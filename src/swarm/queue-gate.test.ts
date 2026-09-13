import { describe, expect, it } from "vitest";
import { TaskQueue } from "./queue";
import { createSwarmDb, migrateSwarmSchema } from "./db";

async function freshQueue() {
  const db = createSwarmDb({ url: ":memory:" });
  await migrateSwarmSchema(db);
  return new TaskQueue(db);
}

describe("hasPending (dispatcher gate)", () => {
  it("tracks the queue lifecycle: empty → pending → leased → completed", async () => {
    const queue = await freshQueue();

    // Empty queue: the dispatcher tick must NOT spawn a Hatchet run.
    expect(await queue.hasPending()).toBe(false);

    // Enqueue: gate flips true — run spawned.
    await queue.enqueue({ prompt: "real work", id: "t-1" });
    expect(await queue.hasPending()).toBe(true);

    // Claim (LEASED): gate false again — no duplicate dispatch while leased.
    const claimed = await queue.claimNextTask("w1", { leaseMs: 5 });
    expect(claimed?.task.status).toBe("LEASED");
    expect(await queue.hasPending()).toBe(false);

    // Crash recovery: lease expires and is reaped → task back to PENDING.
    await new Promise((r) => setTimeout(r, 15));
    await queue.reapExpiredLeases();
    expect(await queue.hasPending()).toBe(true);

    // Complete: gate false for good — no more runs.
    const reclamed = await queue.claimNextTask("w2", { leaseMs: 5 });
    await reclamed!.complete({ summary: "done" });
    expect(await queue.hasPending()).toBe(false);

    // Depth sanity across the whole lifecycle.
    expect(await queue.queueDepth()).toEqual({ PENDING: 0, LEASED: 0, COMPLETED: 1, FAILED: 0 });
  });

  it("is scoped per queue_name so other repos' work never triggers a dispatch", async () => {
    const queue = await freshQueue();
    await queue.enqueue({ prompt: "other repo", id: "t-2", queueName: "some-other-repo" });
    expect(await queue.hasPending()).toBe(false);
    expect(await queue.hasPending("some-other-repo")).toBe(true);
  });
});
