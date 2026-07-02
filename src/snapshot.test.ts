import { describe, expect, it, vi, beforeEach } from "vitest";

const { listSnapshotsMock } = vi.hoisted(() => ({ listSnapshotsMock: vi.fn() }));

vi.mock("e2b", () => ({
  Sandbox: {
    listSnapshots: (...args: unknown[]) => listSnapshotsMock(...args),
  },
}));

import { sanitizeSnapshotName, findSnapshotByName, ensureSnapshot } from "./snapshot";

/** A fake paginator over the given pages of SnapshotInfo items. */
function paginator(pages: Array<Array<{ snapshotId: string; names: string[] }>>) {
  let i = 0;
  return {
    get hasNext() {
      return i < pages.length;
    },
    nextItems: async () => pages[i++] ?? [],
  };
}

beforeEach(() => {
  listSnapshotsMock.mockReset();
});

describe("sanitizeSnapshotName", () => {
  it("produces a deterministic, prefixed, E2B-safe name", () => {
    const name = sanitizeSnapshotName("Repo Bootstrap v1");
    expect(name).toMatch(/^eve-repo-bootstrap-v1-[0-9a-f]{12}$/);
    expect(/^[a-z0-9-]+$/.test(name)).toBe(true);
    expect(sanitizeSnapshotName("Repo Bootstrap v1")).toBe(name); // deterministic
  });

  it("is collision-resistant when slugs would otherwise match", () => {
    // Both slug to "eve-x...", but the full-key hash keeps them distinct.
    const a = sanitizeSnapshotName("x".repeat(60) + "A");
    const b = sanitizeSnapshotName("x".repeat(60) + "B");
    expect(a).not.toBe(b);
  });

  it("changes when the backend identity changes (same templateKey)", () => {
    const base = sanitizeSnapshotName("tpl", JSON.stringify({ template: "base" }));
    const node = sanitizeSnapshotName("tpl", JSON.stringify({ template: "node20" }));
    expect(base).not.toBe(node); // different base image => different snapshot
    expect(sanitizeSnapshotName("tpl", "x")).toBe(sanitizeSnapshotName("tpl", "x"));
  });

  it("falls back to a stable name for empty input", () => {
    expect(sanitizeSnapshotName("")).toMatch(/^eve-template-[0-9a-f]{12}$/);
  });
});

describe("findSnapshotByName", () => {
  it("matches by bare name, stripping namespace and tag", async () => {
    listSnapshotsMock.mockImplementation(() =>
      paginator([[{ snapshotId: "team-x/eve-foo:default", names: ["team-x/eve-foo:default"] }]]),
    );
    const found = await findSnapshotByName("eve-foo", {});
    expect(found?.snapshotId).toBe("team-x/eve-foo:default");
  });

  it("returns null when nothing matches", async () => {
    listSnapshotsMock.mockImplementation(() => paginator([]));
    expect(await findSnapshotByName("eve-missing", {})).toBeNull();
  });
});

describe("ensureSnapshot", () => {
  it("reuses an existing snapshot without building", async () => {
    listSnapshotsMock.mockImplementation(() =>
      paginator([[{ snapshotId: "eve-cached:default", names: ["eve-cached:default"] }]]),
    );
    const build = vi.fn(async () => "fresh-id");
    const result = await ensureSnapshot("eve-cached", {}, build);
    expect(result).toEqual({ reused: true, snapshotId: "eve-cached:default" });
    expect(build).not.toHaveBeenCalled();
  });

  it("dedupes concurrent builds, then re-checks on a later call", async () => {
    listSnapshotsMock.mockImplementation(() => paginator([]));
    let resolveBuild!: (id: string) => void;
    const build = vi.fn(() => new Promise<string>((resolve) => (resolveBuild = resolve)));

    const a = ensureSnapshot("eve-new", {}, build);
    const b = ensureSnapshot("eve-new", {}, build);
    // Let both calls get past their `await findSnapshotByName` so the shared
    // build() has actually started before we resolve it.
    await new Promise((r) => setTimeout(r, 0));
    expect(build).toHaveBeenCalledTimes(1); // both awaited the same in-flight build
    resolveBuild("built-id");
    const [ra, rb] = await Promise.all([a, b]);

    expect(ra).toEqual({ reused: false, snapshotId: "built-id" });
    expect(rb).toEqual({ reused: false, snapshotId: "built-id" });

    // Cache entry is cleared after settle, so a later miss rebuilds.
    const build2 = vi.fn(async () => "built-again");
    const rc = await ensureSnapshot("eve-new", {}, build2);
    expect(build2).toHaveBeenCalledTimes(1);
    expect(rc.snapshotId).toBe("built-again");
  });
});
