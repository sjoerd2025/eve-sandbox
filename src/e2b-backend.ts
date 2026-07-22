import { ConnectionConfig, Sandbox, SandboxError, SandboxNotFoundError } from "e2b";
import type { SandboxOpts } from "e2b";
import pkg from "../package.json" with { type: "json" };
import {
  SandboxTemplateNotProvisionedError,
  type SandboxBackend,
  type SandboxBackendCreateInput,
  type SandboxBackendHandle,
  type SandboxBackendPrewarmInput,
  type SandboxNetworkPolicy,
} from "eve/sandbox";
import { buildSandboxSession } from "./build-sandbox-session";
import { createE2BInternalSession, ensureWorkspace } from "./internal-session";
import { toE2BNetworkUpdate } from "./network-policy";
import {
  ensureSnapshot,
  findSnapshotByName,
  sanitizeSnapshotName,
  type ConnectionOptions,
} from "./snapshot";

const BACKEND_NAME = "e2b";

// Tag every E2B API request's `User-Agent` so E2B can attribute traffic coming
// through this wrapper (e2b's set-once integration hook, JS SDK >= 2.33). It's a
// process-wide static that ConnectionConfig reads at construction time, so it
// must run before any Sandbox call — hence at module load, not per `e2b()` call.
ConnectionConfig.setIntegration(`eve-sandbox/${pkg.version}`);

/** 30 minutes — agent turns run long; E2B's 5-minute default expires mid-session. */
const DEFAULT_SANDBOX_TIMEOUT_MS = 30 * 60 * 1_000;

/** Bump when the snapshot's framework-managed setup changes, to invalidate caches. */
const SNAPSHOT_SCHEMA_VERSION = 1;

const METADATA_BACKEND_KEY = "eveBackend";
const METADATA_SESSION_KEY = "eveSessionKey";

/** Options applied per-session/bootstrap via the `use()` call in Eve hooks. */
export interface E2BSandboxUseOptions {
  /** Apply a firewall network policy when opening the session. */
  networkPolicy?: SandboxNetworkPolicy;
}

/** Options for {@link e2b}. E2B `SandboxOpts` pass through via `createOptions`. */
export interface E2BSandboxBackendOptions {
  /** E2B template id/alias the base sandbox is created from. */
  template?: string;
  /** Sandbox auto-pause timeout in ms. Defaults to 30 minutes. */
  timeoutMs?: number;
  /** Environment variables baked into every sandbox. */
  envs?: Record<string, string>;
  /** Extra E2B metadata stamped on every sandbox (create-time only). */
  metadata?: Record<string, string>;
  /** Diagnostic tags merged into sandbox metadata (E2B has no separate tags). */
  tags?: Record<string, string>;
  /** E2B API key. Falls back to `E2B_API_KEY`. */
  apiKey?: string;
  /** E2B API domain (for self-hosted/region endpoints). */
  domain?: string;
  /** Initial firewall policy applied to each live session after create. */
  networkPolicy?: SandboxNetworkPolicy;
  /**
   * Whether the sandbox pauses (resumable) instead of being killed on timeout.
   * Defaults to `true` so Eve can reconnect to a session after a cold start —
   * a killed sandbox would lose state and Eve would NOT rerun `onSession()`.
   */
  autoPause?: boolean;
  /** Raw E2B `SandboxOpts` merged into every create call (escape hatch). */
  createOptions?: SandboxOpts;
}

/** Extract a human-readable message from an unknown thrown value. */
function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Translate Eve's {@link SandboxNetworkPolicy} into an E2B network update for a
 * live sandbox. A named factory (not an inline closure) so the live-turn path
 * and the prewarm bootstrap path share one policy-application implementation.
 */
function createE2BNetworkPolicySetter(
  sandbox: Sandbox,
): (policy: SandboxNetworkPolicy) => Promise<void> {
  return (policy) => sandbox.updateNetwork(toE2BNetworkUpdate(policy));
}

/**
 * Build the public {@link SandboxSession} plus its `use()` closure over one live
 * sandbox. Shared by {@link makeHandle} (live agent turns) and `prewarm`'s
 * bootstrap so both construct the session and apply `networkPolicy` identically —
 * building it in one place makes build-vs-run network drift structurally impossible.
 */
function buildE2BSession(sandbox: Sandbox, sessionKey: string) {
  const setNetworkPolicy = createE2BNetworkPolicySetter(sandbox);
  const session = buildSandboxSession(
    createE2BInternalSession(sandbox, sessionKey),
    setNetworkPolicy,
  );
  // Opens the session, applying an optional per-call network policy first. Named
  // to match Eve's `SandboxSessionUseFn`: it becomes the handle's `useSessionFn`
  // and the `use` an author calls inside `bootstrap`/`onSession`.
  const useSessionFn = async (useOptions?: E2BSandboxUseOptions) => {
    if (useOptions?.networkPolicy) {
      await setNetworkPolicy(useOptions.networkPolicy);
    }
    return session;
  };
  return { session, useSessionFn };
}

/**
 * Constructs the E2B sandbox backend: ephemeral cloud sandboxes via
 * [e2b](https://www.npmjs.com/package/e2b), with snapshot-backed templates and a
 * firewall capable of domain-level network policies and credential brokering.
 *
 * Requires `E2B_API_KEY` (or pass `apiKey`). Configuring this backend pins it
 * unconditionally — E2B runs in every environment (local dev, CI, hosted) and is
 * never substituted; if it's unreachable, creation fails rather than falling back.
 *
 * ```ts
 * // agent/sandbox.ts
 * import { defineSandbox } from 'eve/sandbox';
 * import { e2b } from '@e2b/eve-sandbox';
 * export default defineSandbox({ backend: e2b({ template: 'base' }) });
 * ```
 *
 * Two-phase lifecycle (Eve's SandboxBackend contract):
 * - `prewarm()` runs at build time: captures a reusable E2B snapshot from the
 *   authored bootstrap + seed files, keyed by Eve's `templateKey` and the
 *   snapshot-affecting options (base image, envs, network policy), so it's reused
 *   across deploys.
 * - `create()` runs at runtime: reattaches to a live sandbox (by persisted
 *   `sandboxId`, else by `sessionKey`), or opens a fresh one — forked from the
 *   prewarmed snapshot, or from the base template when there's no snapshot.
 */
export function e2b(
  options: E2BSandboxBackendOptions = {},
): SandboxBackend<E2BSandboxUseOptions, E2BSandboxUseOptions> {
  const connection: ConnectionOptions = {
    apiKey: options.apiKey,
    domain: options.domain,
  };
  // Reconnects must carry the same timeout, else E2B resumes a paused sandbox
  // with its 5-minute default and it expires mid-session.
  const connectOptions = {
    ...connection,
    timeoutMs: options.timeoutMs ?? DEFAULT_SANDBOX_TIMEOUT_MS,
  };

  function baseCreateOptions(
    sessionKey: string,
    runtimeTags?: Readonly<Record<string, string>>,
  ): SandboxOpts {
    return {
      ...options.createOptions,
      apiKey: options.apiKey,
      domain: options.domain,
      timeoutMs: options.timeoutMs ?? DEFAULT_SANDBOX_TIMEOUT_MS,
      // Pause (resumable) on timeout instead of killing, so Eve can reconnect
      // after a cold start. A killed sandbox loses state and Eve would NOT
      // rerun onSession(). Caller can opt out with `autoPause: false`.
      lifecycle:
        options.createOptions?.lifecycle ??
        (options.autoPause === false
          ? { onTimeout: "kill" }
          : { onTimeout: "pause", autoResume: true }),
      envs: { ...options.createOptions?.envs, ...options.envs },
      metadata: {
        ...options.createOptions?.metadata,
        ...options.metadata,
        ...options.tags,
        ...runtimeTags, // Eve-supplied diagnostic tags (agent/channel/session)
        [METADATA_BACKEND_KEY]: BACKEND_NAME,
        [METADATA_SESSION_KEY]: sessionKey,
      },
    };
  }

  // Identity of the snapshot's *contents/config* — folded (hashed) into the
  // snapshot name so changing the base image, baked envs, or the policy that
  // bootstrap runs under forces a fresh snapshot. Eve's `templateKey` covers
  // authored source + seeds but NOT our backend options, so this closes the
  // "reuse a snapshot built on the wrong base image" gap. Excludes
  // session/connection/lifecycle fields (apiKey, domain, timeout, metadata,
  // tags, sessionKey) which don't affect snapshot contents.
  const snapshotIdentity = JSON.stringify({
    schema: SNAPSHOT_SCHEMA_VERSION,
    template: options.template ?? options.createOptions?.template ?? null,
    envs: { ...options.createOptions?.envs, ...options.envs },
    network: options.createOptions?.network ?? null,
    allowInternetAccess: options.createOptions?.allowInternetAccess ?? null,
    networkPolicy: options.networkPolicy ?? null,
  });

  async function applyInitialNetworkPolicy(
    sandbox: Sandbox,
    policy: SandboxNetworkPolicy | undefined,
  ): Promise<void> {
    if (!policy || policy === "allow-all") return;
    await createE2BNetworkPolicySetter(sandbox)(policy);
  }

  /** Create a sandbox from the configured base template (or E2B's default). */
  function createConfiguredSandbox(createOptions: SandboxOpts): Promise<Sandbox> {
    return options.template
      ? Sandbox.create(options.template, createOptions)
      : Sandbox.create(createOptions);
  }

  function makeHandle(
    sandbox: Sandbox,
    sessionKey: string,
  ): SandboxBackendHandle<E2BSandboxUseOptions> {
    const { session, useSessionFn } = buildE2BSession(sandbox, sessionKey);
    return {
      session,
      useSessionFn,
      async captureState() {
        return {
          backendName: BACKEND_NAME,
          metadata: { sandboxId: sandbox.sandboxId },
          sessionKey,
        };
      },
      // No-op: rely on `autoPause` + Eve's reconnect, matching the upstream
      // reference backend (whose shutdown() is also a no-op). Killing here would
      // drop background work and force Eve to re-create without rerunning onSession().
      async shutdown() {},
    };
  }

  /** Reattach to a sandbox persisted by a prior {@link captureState}. */
  async function reconnect(input: SandboxBackendCreateInput): Promise<Sandbox | null> {
    const persistedId = input.existingMetadata?.["sandboxId"];
    if (typeof persistedId === "string") {
      try {
        return await Sandbox.connect(persistedId, connectOptions);
      } catch (error) {
        // Only a genuinely-gone sandbox should fall through to a fresh create.
        // Auth/transient/provider errors must surface, not silently recreate
        // (which would lose state and skip Eve's onSession()).
        if (!(error instanceof SandboxNotFoundError)) throw error;
      }
    }
    // Fallback: find a still-live sandbox tagged with this session key.
    const [info] = await Sandbox.list({
      ...connection,
      query: {
        // Scope by backend too, so a sessionKey can only ever match a sandbox
        // this backend created (defense-in-depth alongside unique sessionKeys).
        metadata: {
          [METADATA_BACKEND_KEY]: BACKEND_NAME,
          [METADATA_SESSION_KEY]: input.sessionKey,
        },
        state: ["running", "paused"],
      },
      limit: 1,
    }).nextItems(connection);
    if (info) {
      try {
        return await Sandbox.connect(info.sandboxId, connectOptions);
      } catch (error) {
        if (!(error instanceof SandboxNotFoundError)) throw error;
      }
    }
    return null;
  }

  /**
   * Open a live session: reconnect to an existing sandbox, else open a fresh one
   * from the base template or by forking the prewarmed snapshot. Throws provider
   * errors raw and Eve's typed provisioning error directly; `create()` is the
   * single boundary that adds session context (so coverage can't drift per-path).
   */
  async function openSession(
    input: SandboxBackendCreateInput,
  ): Promise<SandboxBackendHandle<E2BSandboxUseOptions>> {
    // Reconnect to an existing session first, regardless of templateKey. We
    // intentionally do NOT re-apply the configured `networkPolicy` here (only
    // fresh creates do, in finalizeSession): a resumed sandbox retains its live
    // policy, which is the default *plus* any per-session tightening an author
    // applied via onSession/`use({ networkPolicy })`. Re-stamping the create-time
    // default on reconnect would clobber that and could loosen a locked-down
    // session. This matches Eve's own backends (Vercel applies the initial policy
    // only on fresh create, not on resume).
    const existing = await reconnect(input);
    if (existing) return makeHandle(existing, input.sessionKey);

    // Otherwise open a fresh session: base template (no bootstrap/seeds), or a
    // fork of the prewarmed snapshot.
    const createOptions = baseCreateOptions(input.sessionKey, input.tags);
    return input.templateKey === null
      ? createFromBaseTemplate(createOptions, input.sessionKey)
      : createFromSnapshot(input.templateKey, createOptions, input.sessionKey);
  }

  /** Open a fresh session from the base template (no bootstrap/seed state). */
  async function createFromBaseTemplate(
    createOptions: SandboxOpts,
    sessionKey: string,
  ): Promise<SandboxBackendHandle<E2BSandboxUseOptions>> {
    const sandbox = await createConfiguredSandbox(createOptions);
    return finalizeSession(sandbox, sessionKey, { prepareWorkspace: true });
  }

  /** Fork a session from the prewarmed snapshot (/workspace + bootstrap baked in). */
  async function createFromSnapshot(
    templateKey: string,
    createOptions: SandboxOpts,
    sessionKey: string,
  ): Promise<SandboxBackendHandle<E2BSandboxUseOptions>> {
    const name = sanitizeSnapshotName(templateKey, snapshotIdentity);
    const snapshot = await findSnapshotByName(name, connection);
    if (!snapshot) {
      throw new SandboxTemplateNotProvisionedError({ backendName: BACKEND_NAME, templateKey });
    }
    let sandbox: Sandbox;
    try {
      sandbox = await Sandbox.create(snapshot.snapshotId, createOptions);
    } catch (error) {
      // The named snapshot existed at lookup but is gone/unusable now (deleted
      // between deploys, GC'd, etc.). E2B reports this as a 404 `SandboxError`
      // ("template '<id>' not found"), not a typed not-found error — so match on
      // that and surface a provisioning error, letting Eve re-run prewarm instead
      // of bubbling a raw provider error.
      const isMissing =
        error instanceof SandboxNotFoundError ||
        (error instanceof SandboxError && /not found|\b404\b/i.test(error.message));
      if (isMissing) {
        throw new SandboxTemplateNotProvisionedError({ backendName: BACKEND_NAME, templateKey });
      }
      throw error;
    }
    return finalizeSession(sandbox, sessionKey, { prepareWorkspace: false });
  }

  /**
   * Prepare a freshly-acquired sandbox and wrap it in a handle, killing it if any
   * setup step fails so a half-initialized sandbox never leaks. `prepareWorkspace`
   * creates `/workspace` for base sandboxes; snapshot forks already carry it.
   */
  async function finalizeSession(
    sandbox: Sandbox,
    sessionKey: string,
    { prepareWorkspace }: { prepareWorkspace: boolean },
  ): Promise<SandboxBackendHandle<E2BSandboxUseOptions>> {
    try {
      if (prepareWorkspace) await ensureWorkspace(sandbox);
      await applyInitialNetworkPolicy(sandbox, options.networkPolicy);
      return makeHandle(sandbox, sessionKey);
    } catch (error) {
      await sandbox.kill().catch(() => {});
      throw error;
    }
  }

  return {
    name: BACKEND_NAME,

    async create(
      input: SandboxBackendCreateInput,
    ): Promise<SandboxBackendHandle<E2BSandboxUseOptions>> {
      try {
        return await openSession(input);
      } catch (error) {
        // Pass Eve's typed provisioning error through so the runtime can
        // self-heal (re-prewarm); wrap everything else with backend + session
        // context, preserving the original via `cause` for debugging.
        if (SandboxTemplateNotProvisionedError.is(error)) throw error;
        throw new Error(
          `E2B backend failed to open sandbox session "${input.sessionKey}": ${errorMessage(error)}`,
          { cause: error },
        );
      }
    },

    async prewarm(input: SandboxBackendPrewarmInput<E2BSandboxUseOptions>) {
      const name = sanitizeSnapshotName(input.templateKey, snapshotIdentity);

      const build = async (): Promise<string> => {
        input.log?.(`creating E2B template sandbox for "${input.templateKey}"`);
        const createOptions = baseCreateOptions(`template:${input.templateKey}`);
        const sandbox = await createConfiguredSandbox(createOptions);
        try {
          await ensureWorkspace(sandbox);
          // Match the upstream reference backend: framework base setup runs
          // unrestricted, then the configured policy applies, then authored
          // bootstrap runs under it. (No-op for the default "allow-all".)
          await applyInitialNetworkPolicy(sandbox, options.networkPolicy);
          const { session, useSessionFn } = buildE2BSession(sandbox, input.templateKey);

          if (input.bootstrap) {
            input.log?.("running sandbox bootstrap");
            await input.bootstrap({ use: useSessionFn });
          }

          for (const file of input.seedFiles) {
            if (typeof file.content === "string") {
              await session.writeTextFile({
                path: file.path,
                content: file.content,
              });
            } else {
              await session.writeBinaryFile({
                path: file.path,
                content: new Uint8Array(file.content),
              });
            }
          }

          input.log?.(`capturing snapshot "${name}"`);
          const snapshot = await sandbox.createSnapshot({
            name,
            ...connection,
          });
          return snapshot.snapshotId;
        } finally {
          await sandbox.kill().catch(() => {});
        }
      };

      try {
        const { reused } = await ensureSnapshot(name, connection, build);
        return { reused };
      } catch (error) {
        if (SandboxTemplateNotProvisionedError.is(error)) throw error;
        throw new Error(
          `E2B backend failed to prewarm template "${input.templateKey}": ${errorMessage(error)}`,
          { cause: error },
        );
      }
    },
  };
}
