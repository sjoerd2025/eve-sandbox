import { describe, expect, it } from "vitest";
import { Sandbox } from "e2b";
import { findSnapshotByName, sanitizeSnapshotName } from "../src/snapshot";

// Live test: only runs when E2B_API_KEY is set. It builds a real named snapshot
// (slow + billable), then cleans it up. Run with: E2B_API_KEY=... npm test
//
// Purpose: `findSnapshotByName` trusts E2B's documented name-filter contract
// (e2b-dev/E2B#1523: exact, namespace/tag-qualified match; unknown names return an
// empty list) instead of re-matching client-side. This test verifies that
// contract end-to-end against the live API — an exact name resolves, and a prefix
// or unknown name does not — so a server-side regression is caught here rather
// than silently reusing the wrong snapshot in production.
const hasKey = Boolean(process.env.E2B_API_KEY);

describe.skipIf(!hasKey)("e2b snapshot name filter (live)", () => {
  it("resolves an exact name and rejects prefix / unknown names", async () => {
    const conn = {}; // uses E2B_API_KEY from the environment
    const unique = `${process.pid}-${Date.now()}`;
    const name = sanitizeSnapshotName(`live-name-probe-${unique}`);
    const prefixName = name.slice(0, -4); // strict prefix (drops 4 hash chars)
    const bogusName = sanitizeSnapshotName(`does-not-exist-${unique}`);

    const sandbox = await Sandbox.create("base", {});
    let snapshotId: string | undefined;
    try {
      const snapshot = await sandbox.createSnapshot({ name });
      snapshotId = snapshot.snapshotId;

      // --- Discovery: log what the raw server filter returns. No assertions here;
      // this is how we SEE the server's semantics rather than assume them. ---
      const rawExact = await Sandbox.listSnapshots({ ...conn, name }).nextItems();
      const rawPrefix = await Sandbox.listSnapshots({ ...conn, name: prefixName }).nextItems();
      const rawBogus = await Sandbox.listSnapshots({ ...conn, name: bogusName }).nextItems();
      console.log("[name-filter probe]", {
        query: { name, prefixName, bogusName },
        exact: rawExact.map((s) => s.names),
        prefix: rawPrefix.map((s) => s.names),
        bogus: rawBogus.map((s) => s.names),
      });

      // --- Contract E2B must uphold for our lookup to be correct. ---

      // 1. The exact name resolves to the snapshot we just created.
      const found = await findSnapshotByName(name, conn);
      expect(found).not.toBeNull();
      expect(found?.names.some((n) => n.includes(name))).toBe(true);

      // 2. A strict prefix must NOT resolve — the filter is exact, not a prefix
      //    match. If E2B ever regressed to prefix matching, this would return the
      //    snapshot and we'd catch it here instead of reusing the wrong one.
      expect(await findSnapshotByName(prefixName, conn)).toBeNull();

      // 3. An unknown name must NOT resolve — E2B returns an empty list for
      //    unknown names (no "latest" fallback). This locks that in.
      expect(await findSnapshotByName(bogusName, conn)).toBeNull();
    } finally {
      await sandbox.kill().catch(() => {});
      if (snapshotId) await Sandbox.deleteSnapshot(snapshotId, conn).catch(() => {});
    }
  }, 300_000);
});
