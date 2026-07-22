import { createHash } from "node:crypto";
import { Sandbox } from "e2b";
import type { SnapshotInfo } from "e2b";

/** Connection-scoping options reused across snapshot lookups/creates. */
export interface ConnectionOptions {
  apiKey?: string;
  domain?: string;
}

const SNAPSHOT_PREFIX = "eve";

/**
 * In-process dedup of in-flight template builds, keyed by snapshot name. The
 * durable, cross-process reuse comes from the named snapshot itself (found via
 * `listSnapshots`); this map only collapses concurrent builds within one process.
 */
const buildCache = new Map<string, Promise<string>>();

/**
 * Deterministic, E2B-safe snapshot name for an Eve `templateKey`.
 *
 * The hash covers both the Eve `templateKey` AND a backend-identity string.
 * Eve's `templateKey` is derived from authored sandbox source + seeds, but NOT
 * from our backend options — so without folding `identity` in, changing
 * `e2b({ template })` (a different base image) would silently reuse the old
 * snapshot. `identity` is hashed, never placed raw in the name, so it is safe
 * to include secrets (envs / network transforms).
 */
export function sanitizeSnapshotName(templateKey: string, identity = ""): string {
  const slug = templateKey
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const hash = createHash("sha256")
    .update(`${templateKey}\0${identity}`)
    .digest("hex")
    .slice(0, 12);
  return `${SNAPSHOT_PREFIX}-${slug || "template"}-${hash}`;
}

/** Strip the team namespace and tag from a snapshot ref to its bare name. */
function snapshotBaseName(ref: string): string {
  return (ref.split("/").pop() ?? ref).replace(/:[^/:]+$/, "");
}

/** Find an existing snapshot by its bare name (any process), or null. */
export async function findSnapshotByName(
  name: string,
  conn: ConnectionOptions,
): Promise<SnapshotInfo | null> {
  // E2B's list API now filters by name server-side (e2b >= 2.34), so we ask for
  // this exact snapshot instead of scanning every page and matching client-side.
  // A live probe (test/snapshot.integration.test.ts) confirms the filter is an
  // exact, namespace-aware match today — no prefix/substring match, no
  // unknown-name "latest" fallback. We still re-check the bare name anyway: the
  // filter is an untrusted API boundary with undocumented semantics, so accepting
  // only a snapshot created under this exact name keeps a future server change a
  // harmless rebuild rather than wrong execution — "a bounded duplicate build,
  // never wrong execution". The filter narrows results to this one template's
  // builds/tags, so the first page is enough (a match beyond it would only cost a
  // rebuild, never correctness).
  const items = await Sandbox.listSnapshots({ ...conn, name }).nextItems(conn);
  return (
    items.find(
      (info) =>
        info.names?.some((n) => snapshotBaseName(n) === name) ||
        snapshotBaseName(info.snapshotId) === name,
    ) ?? null
  );
}

/**
 * Resolve a snapshot id for `name`, reusing an existing snapshot when present
 * and otherwise building one via `build` (deduped against concurrent callers).
 *
 * `build` runs the bootstrap + seeding on a throwaway sandbox and returns its
 * captured `snapshotId`.
 */
export async function ensureSnapshot(
  name: string,
  conn: ConnectionOptions,
  build: () => Promise<string>,
): Promise<{ reused: boolean; snapshotId: string }> {
  const existing = await findSnapshotByName(name, conn);
  if (existing) return { reused: true, snapshotId: existing.snapshotId };

  let pending = buildCache.get(name);
  if (!pending) {
    pending = build();
    buildCache.set(name, pending);
    // Drop the entry once it settles (success or failure): this map only
    // collapses concurrent in-flight builds. Durable reuse comes from the named
    // snapshot itself (found above), so a later-deleted snapshot is rebuilt
    // rather than served stale from a cached promise.
    void pending.finally(() => buildCache.delete(name));
  }
  return { reused: false, snapshotId: await pending };
}
