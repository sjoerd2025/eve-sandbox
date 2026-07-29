import { describe, expect, it, vi, beforeEach } from "vitest";

const { listSnapshotsMock } = vi.hoisted(() => ({ listSnapshotsMock: vi.fn() }));

vi.mock("e2b", () => ({
  Sandbox: {
    listSnapshots: (...args: unknown[]) => listSnapshotsMock(...args),
  },
}));

import { sanitizeSnapshotName, findSnapshotByName, ensureSnapshot } from "./snapshot";

/**
 * A fake paginator returning `items` from its first (and only) page. E2B's list
 * API filters by name server-side now, so `findSnapshotByName` reads one page.
 */
function paginator(items: Array<{ snapshotId: string; names: string[] }>) {
  let done = false;
  return {
    get hasNext() {
      return !done;
    },
    nextItems: async () => {
      done = true;
      return items;
    },
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

  // Eve scopes its templateKey by app root for non-`vercel` backends, so a Vercel
  // deploy prewarms under hash("/vercel/path0") but looks the snapshot up under
  // hash("bundled") at runtime. Both keys must name the same snapshot.
  it("ignores Eve's environment-dependent scope segment", () => {
    const build = "eve-sbx-tpl-e2b-1e1c9bcd9b3bd900-6e1f87ba175e05a4b5f1";
    const runtime = "eve-sbx-tpl-e2b-4c4164b5039c3606-6e1f87ba175e05a4b5f1";
    expect(sanitizeSnapshotName(build)).toBe(sanitizeSnapshotName(runtime));
  });

  it("still separates templates that differ in content, not just scope", () => {
    const a = sanitizeSnapshotName("eve-sbx-tpl-e2b-1e1c9bcd9b3bd900-6e1f87ba175e05a4b5f1");
    const b = sanitizeSnapshotName("eve-sbx-tpl-e2b-1e1c9bcd9b3bd900-891e9f8a175e05a4b5f1");
    expect(a).not.toBe(b);
  });

  it("passes through keys that do not match Eve's template-key shape", () => {
    // A hand-rolled or future-format key keeps its scope-like segments intact.
    const a = sanitizeSnapshotName("custom-key-1e1c9bcd9b3bd900-6e1f87ba175e05a4b5f1");
    const b = sanitizeSnapshotName("custom-key-4c4164b5039c3606-6e1f87ba175e05a4b5f1");
    expect(a).not.toBe(b);
  });
});

describe("findSnapshotByName", () => {
  it("forwards the bare name to E2B's server-side filter and returns its match", async () => {
    listSnapshotsMock.mockImplementation(() =>
      paginator([{ snapshotId: "team-x/eve-foo:default", names: ["team-x/eve-foo:default"] }]),
    );
    const found = await findSnapshotByName("eve-foo", {});
    expect(found?.snapshotId).toBe("team-x/eve-foo:default");
    // The bare name is forwarded to E2B's server-side `name` filter, which does
    // the exact (namespace/tag-qualified) matching for us.
    expect(listSnapshotsMock).toHaveBeenCalledWith(expect.objectContaining({ name: "eve-foo" }));
  });

  it("returns null when the filter matches nothing (unknown names → empty list)", async () => {
    listSnapshotsMock.mockImplementation(() => paginator([]));
    expect(await findSnapshotByName("eve-missing", {})).toBeNull();
  });
});

describe("ensureSnapshot", () => {
  it("reuses an existing snapshot without building", async () => {
    listSnapshotsMock.mockImplementation(() =>
      paginator([{ snapshotId: "eve-cached:default", names: ["eve-cached:default"] }]),
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
