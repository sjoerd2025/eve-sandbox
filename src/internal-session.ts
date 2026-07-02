import { FileNotFoundError, CommandExitError } from "e2b";
import type { Sandbox, CommandStartOpts } from "e2b";
import type { SandboxSpawnOptions } from "eve/sandbox";
import { createSandboxProcess } from "./e2b-process";
import type { E2BSessionPrimitives } from "./build-sandbox-session";
import { streamToString } from "./stream-utils";

/**
 * Eve roots every sandbox at `/workspace`. E2B's default working directory is
 * the user home (`/home/user`), so relative paths are anchored to `/workspace`
 * here and the workspace dir is created during base setup (see `ensureWorkspace`).
 */
export const WORKSPACE_ROOT = "/workspace";

/** Single-quote a path for safe use in a `bash -lc` command. */
function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function resolveWorkspacePath(path: string): string {
  return path.startsWith("/") ? path : `${WORKSPACE_ROOT}/${path}`;
}

/**
 * Build the byte-oriented primitives over a live E2B {@link Sandbox}; our
 * {@link buildSandboxSession} turns these into the full public session surface.
 *
 * `id` is Eve's session/template key (NOT the E2B `sandboxId`): Eve uses it as a
 * stable cache key that must survive reconnects, and the E2B sandbox id changes
 * across pause/resume.
 */
export function createE2BInternalSession(sandbox: Sandbox, id: string): E2BSessionPrimitives {
  return {
    id,
    resolvePath: resolveWorkspacePath,

    async spawn(options: SandboxSpawnOptions) {
      const { command, workingDirectory, env, abortSignal } = options;
      abortSignal?.throwIfAborted();
      return createSandboxProcess(abortSignal, ({ onStdout, onStderr }) => {
        const opts: CommandStartOpts & { background: true } = {
          background: true,
          envs: env,
          timeoutMs: 0, // disable E2B's 60s default; spawned processes are long-lived.
          onStdout,
          onStderr,
          signal: abortSignal,
          // Resolve like every other path: a relative `workingDirectory` anchors
          // to /workspace (E2B would otherwise run it from the user home, out of
          // step with our file paths); absolute passes through; undefined = root.
          cwd:
            workingDirectory === undefined
              ? WORKSPACE_ROOT
              : resolveWorkspacePath(workingDirectory),
        };
        return sandbox.commands.run(command, opts);
      });
    },

    async readFile({ path, abortSignal }) {
      abortSignal?.throwIfAborted();
      try {
        return await sandbox.files.read(path, {
          format: "stream",
          ...(abortSignal ? { signal: abortSignal } : {}),
        });
      } catch (error) {
        if (error instanceof FileNotFoundError) return null;
        throw error;
      }
    },

    async writeFile({ path, content, abortSignal }) {
      abortSignal?.throwIfAborted();
      await sandbox.files.write(path, content, abortSignal ? { signal: abortSignal } : undefined);
    },

    async removePath({ path, force, recursive, abortSignal }) {
      abortSignal?.throwIfAborted();

      // E2B's `files.remove` has no force/recursive flags and is idempotent (it
      // does NOT error on a missing path), so map straight to `rm` to honor
      // Eve's contract — same as eve's own backends: `-f` ignores missing paths,
      // `-r` removes non-empty dirs, and a plain `rm` still errors on a missing
      // path. Run it in the background so an abort actually kills the remote `rm`
      // (a foreground request abort only cancels the client wait).
      const flags = `${recursive ? "r" : ""}${force ? "f" : ""}`;
      const command = `rm ${flags ? `-${flags} ` : ""}-- ${shellQuote(path)}`;
      const process = await createSandboxProcess(abortSignal, ({ onStdout, onStderr }) =>
        sandbox.commands.run(command, {
          background: true,
          timeoutMs: 0,
          onStdout,
          onStderr,
          signal: abortSignal,
        }),
      );
      // Start draining stderr now, but only await it if the command fails.
      const stderrPromise = streamToString(process.stderr);
      const { exitCode } = await process.wait();
      if (exitCode !== 0) {
        const stderr = await stderrPromise;
        throw new Error(`Failed to remove "${path}" (exit ${exitCode}): ${stderr}`);
      }
    },
  };
}

/**
 * Ensure `/workspace` exists in a freshly created (template-less) sandbox.
 * Snapshot-backed sessions inherit it from the prewarm builder.
 */
export async function ensureWorkspace(sandbox: Sandbox): Promise<void> {
  const quoted = shellQuote(WORKSPACE_ROOT);
  // Try without sudo first (a template may already grant write at the root or
  // not ship sudo), then fall back to sudo + chown — mirrors how the upstream
  // reference backend runs its base-setup step. E2B's base template needs sudo.
  //
  // Require the dir to be *writable*, not just present: `mkdir -p` succeeds even
  // when /workspace already exists but is root-owned (e.g. a custom template), so
  // `test -w` gates the early return and otherwise falls through to the chown.
  const plain = await runForResult(sandbox, `mkdir -p ${quoted} && test -w ${quoted}`);
  if (plain.exitCode === 0) return;

  const elevated = await runForResult(
    sandbox,
    `sudo mkdir -p ${quoted} && sudo chown -R "$(id -u):$(id -g)" ${quoted}`,
  );
  if (elevated.exitCode !== 0) {
    throw new Error(
      `Failed to create ${WORKSPACE_ROOT} (exit ${elevated.exitCode}): ` +
        `${elevated.stderr || plain.stderr}`,
    );
  }
}

/**
 * Run a command and return its result, normalizing E2B's `CommandExitError`
 * (thrown on non-zero exit) into a plain result so callers can branch on the
 * exit code instead of catching.
 */
async function runForResult(
  sandbox: Sandbox,
  command: string,
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  try {
    const { exitCode, stdout, stderr } = await sandbox.commands.run(command, {
      background: false,
      timeoutMs: 0,
    });
    return { exitCode, stdout, stderr };
  } catch (error) {
    if (error instanceof CommandExitError) {
      return { exitCode: error.exitCode, stdout: error.stdout, stderr: error.stderr };
    }
    throw error;
  }
}
