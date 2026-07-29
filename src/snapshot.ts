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
 * Eve's `templateKey` is `eve-sbx-tpl-<backend>-<scope16>-<versionHash20>`. The
 * scope is `hash(appRoot)` — or `hash("bundled")` when artifacts are bundled —
 * for every backend except Eve's own `vercel`, which short-circuits to a stable
 * project-id scope. So on a Vercel deploy the same app yields two different keys:
 * `hash("/vercel/path0")` while `eve build` prewarms, `hash("bundled")` inside
 * the serverless runtime — and the snapshot captured at build time is
 * unreachable at runtime (`SandboxTemplateNotProvisionedError` on every turn,
 * with no self-heal since Eve's re-prewarm retry is disk-artifacts only).
 *
 * Dropping the scope makes the name purely content-addressed: `versionHash`
 * already folds in the Eve version, sandbox source, seed content, nodeId and
 * sourceId, and our own `identity` covers the backend options. Keys that don't
 * match Eve's shape (a future format, or a hand-rolled key) pass through whole.
 */
const EVE_TEMPLATE_KEY = /^(eve-sbx-tpl-.+?)-[0-9a-f]{16}-([0-9a-f]{20})$/;

function stripTemplateKeyScope(templateKey: string): string {
  const match = EVE_TEMPLATE_KEY.exec(templateKey);
  return match ? `${match[1]}-${match[2]}` : templateKey;
}

/**
 * Deterministic, E2B-safe snapshot name for an Eve `templateKey`.
 *
 * The hash covers both the (scope-stripped) Eve `templateKey` AND a
 * backend-identity string. Eve's `templateKey` is derived from authored sandbox
 * source + seeds, but NOT from our backend options — so without folding
 * `identity` in, changing `e2b({ template })` (a different base image) would
 * silently reuse the old snapshot. `identity` is hashed, never placed raw in the
 * name, so it is safe to include secrets (envs / network transforms).
 */
export function sanitizeSnapshotName(templateKey: string, identity = ""): string {
  const key = stripTemplateKeyScope(templateKey);
  const slug = key
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const hash = createHash("sha256").update(`${key}\0${identity}`).digest("hex").slice(0, 12);
  return `${SNAPSHOT_PREFIX}-${slug || "template"}-${hash}`;
}

/** Find an existing snapshot by its bare name (any process), or null. */
export async function findSnapshotByName(
  name: string,
  conn: ConnectionOptions,
): Promise<SnapshotInfo | null> {
  // E2B's list API filters by name server-side (e2b >= 2.34). Per its documented
  // contract (e2b-dev/E2B#1523) the filter is an EXACT match on a name or ID,
  // namespace/tag-qualified, and unknown names return an empty list — so any row
  // it returns is this exact snapshot (or another interchangeable build/tag of
  // it). We rely on that contract rather than re-matching client-side; the live
  // test (test/snapshot.integration.test.ts) verifies it end-to-end and would
  // catch a server-side regression.
  const [info] = await Sandbox.listSnapshots({ ...conn, name }).nextItems(conn);
  return info ?? null;
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
