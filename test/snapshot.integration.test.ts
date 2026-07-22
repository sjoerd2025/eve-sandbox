import { describe, expect, it } from "vitest";
import { Sandbox } from "e2b";
import { findSnapshotByName, sanitizeSnapshotName } from "../src/snapshot";

// Live test: only runs when E2B_API_KEY is set. It builds a real named snapshot
// (slow + billable), then cleans it up. Run with: E2B_API_KEY=... npm test
//
// Purpose: verify — empirically, no assumptions — what E2B's server-side
// `listSnapshots({ name })` filter actually does (exact / prefix / unknown-name
// fallback), and prove our `findSnapshotByName` stays an EXACT match regardless,
// per "a bounded duplicate build, never wrong execution".
const hasKey = Boolean(process.env.E2B_API_KEY);

describe.skipIf(!hasKey)("e2b snapshot name filter (live)", () => {
  it("finds an exact name and rejects near-misses, whatever the server does", async () => {
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

      // --- Invariants our code must uphold regardless of server behavior. ---

      // 1. The exact name resolves to the snapshot we just created.
      const found = await findSnapshotByName(name, conn);
      expect(found).not.toBeNull();
      expect(found?.names.some((n) => n.includes(name))).toBe(true);

      // 2. A strict prefix must NOT resolve — even if the server returns our
      //    snapshot for a prefix query, our exact re-check rejects it (a rebuild,
      //    never wrong execution).
      expect(await findSnapshotByName(prefixName, conn)).toBeNull();

      // 3. An unknown name must NOT resolve — guards against any server-side
      //    "return latest for an unknown name" fallback.
      expect(await findSnapshotByName(bogusName, conn)).toBeNull();
    } finally {
      await sandbox.kill().catch(() => {});
      if (snapshotId) await Sandbox.deleteSnapshot(snapshotId, conn).catch(() => {});
    }
  }, 300_000);
});
