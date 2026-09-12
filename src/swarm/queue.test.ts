import { describe, expect, it } from "vitest";
import { TaskQueue } from "./queue";
import { createSwarmDb, migrateSwarmSchema } from "./db";

async function freshQueue() {
  const db = createSwarmDb({ url: ":memory:" });
  await migrateSwarmSchema(db);
  return new TaskQueue(db);
}

describe("TaskQueue", () => {
  it("claims atomically and completes a task", async () => {
    const queue = await freshQueue();
    await queue.enqueue({ prompt: "echo hi" });

    const claimed = await queue.claimNextTask("worker-1");
    expect(claimed?.task.prompt).toBe("echo hi");
    expect(claimed?.task.status).toBe("LEASED");

    // A second worker must not claim the same task.
    expect(await queue.claimNextTask("worker-2")).toBeNull();

    await claimed!.complete({ summary: "done" });
    expect(await queue.queueDepth()).toEqual({ PENDING: 0, LEASED: 0, COMPLETED: 1, FAILED: 0 });
  });

  it("reaps expired leases and retries, failing after max attempts", async () => {
    const queue = await freshQueue();
    const task = await queue.enqueue({ prompt: "flaky", maxAttempts: 2 });

    const first = await queue.claimNextTask("w1", { leaseMs: 5 });
    expect(first?.task.id).toBe(task.id);
    await new Promise((r) => setTimeout(r, 15)); // let the lease expire

    expect(await queue.reapExpiredLeases()).toBe(1);
    const second = await queue.claimNextTask("w2", { leaseMs: 5 });
    expect(second?.task.attempts).toBe(2);
    await new Promise((r) => setTimeout(r, 15));

    await queue.reapExpiredLeases(); // attempts exhausted -> FAILED
    const depth = await queue.queueDepth();
    expect(depth.FAILED).toBe(1);
  });

  it("enqueues idempotently per id", async () => {
    const queue = await freshQueue();
    const a = await queue.enqueue({ prompt: "x", id: "same" });
    const b = await queue.enqueue({ prompt: "y", id: "same" });
    expect(a.id).toBe(b.id);
    expect((await queue.queueDepth()).PENDING).toBe(1);
  });
});
