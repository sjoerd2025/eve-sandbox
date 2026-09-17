import { describe, expect, it } from "vitest";
import { createQueueStatusApp, type QueueStatusSnapshot } from "./queue-status-route";
import { TaskQueue } from "./queue";
import { createSwarmDb, migrateSwarmSchema } from "./db";

async function freshQueue(): Promise<TaskQueue> {
  const db = createSwarmDb({ url: ":memory:" });
  await migrateSwarmSchema(db);
  return new TaskQueue(db);
}

function appWithQueue(queue: TaskQueue, queueName = "default") {
  return createQueueStatusApp({
    getConfig: () => ({ url: ":memory:" }),
    openQueue: async () => ({ queue, queueName }),
  });
}

describe("GET /api/queue-status", () => {
  it("returns real depth and processed counts from the queue", async () => {
    const queue = await freshQueue();
    const app = appWithQueue(queue);

    await queue.enqueue({ prompt: "one" });
    const claimed = await queue.claimNextTask("w1");
    await claimed!.complete({ summary: "done" });
    await queue.enqueue({ prompt: "two" });

    const res = await app.request("http://localhost/api/queue-status");
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    const body = (await res.json()) as QueueStatusSnapshot;
    expect(body.queueName).toBe("default");
    expect(body.depth).toEqual({ PENDING: 1, LEASED: 0, COMPLETED: 1, FAILED: 0 });
    expect(body.processedTasks).toBe(1);
    expect(typeof body.ts).toBe("number");
  });

  it("reflects the configured queue name", async () => {
    const queue = await freshQueue();
    const app = appWithQueue(queue, "acme/repo");

    await queue.enqueue({ prompt: "x", queueName: "acme/repo" });
    const res = await app.request("http://localhost/api/queue-status");
    const body = (await res.json()) as QueueStatusSnapshot;
    expect(body.queueName).toBe("acme/repo");
    expect(body.depth.PENDING).toBe(1);
  });

  it("returns 503 with an error payload when the queue is unreachable", async () => {
    const app = createQueueStatusApp({
      getConfig: () => {
        throw new Error("no turso");
      },
    });
    const res = await app.request("http://localhost/api/queue-status");
    expect(res.status).toBe(503);
    const body = (await res.json()) as { error: string };
    expect(body.error).toContain("queue status unavailable");
  });

  it("retries after a transient queue failure instead of caching the error", async () => {
    const queue = await freshQueue();
    let failFirst = true;
    const app = createQueueStatusApp({
      getConfig: () => {
        if (failFirst) throw new Error("not yet");
        return { url: ":memory:" };
      },
      openQueue: async () => ({ queue, queueName: "default" }),
    });

    const bad = await app.request("http://localhost/api/queue-status");
    expect(bad.status).toBe(503);

    failFirst = false; // ensure() resets after the failure, so this succeeds
    await queue.enqueue({ prompt: "after-retry" });
    const good = await app.request("http://localhost/api/queue-status");
    expect(good.status).toBe(200);
    const body = (await good.json()) as QueueStatusSnapshot;
    expect(body.depth.PENDING).toBe(1);
  });

  it("exposes only the queue-status route", async () => {
    const queue = await freshQueue();
    const app = appWithQueue(queue);
    const res = await app.request("http://localhost/anything-else");
    expect(res.status).toBe(404);
  });
});
