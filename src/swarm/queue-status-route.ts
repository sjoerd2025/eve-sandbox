import { Hono } from "hono";
import { TaskQueue, type TaskStatus } from "./queue";
import { createSwarmDb, migrateSwarmSchema, swarmDbConfigFromEnv, type SwarmDbConfig } from "./db";
import { defaultQueueName } from "./actor";

/** One /api/queue-status snapshot — the dashboard's poll payload. */
export interface QueueStatusSnapshot {
  queueName: string;
  depth: Record<TaskStatus, number>;
  /** COMPLETED tasks across every driver (actor cron, Hatchet, manual ticks). */
  processedTasks: number;
  ts: number;
}

export interface QueueStatusDeps {
  /** Config source (env by default); overridable in tests. */
  getConfig?: () => SwarmDbConfig & { queueName?: string };
  /** Test seam: open the queue directly (skips db client creation). */
  openQueue?: (config: SwarmDbConfig & { queueName?: string }) => Promise<{
    queue: TaskQueue;
    queueName: string;
  }>;
}

function envConfig(): SwarmDbConfig & { queueName?: string } {
  return { ...swarmDbConfigFromEnv(), queueName: defaultQueueName() };
}

async function openFromConfig(config: SwarmDbConfig & { queueName?: string }): Promise<{
  queue: TaskQueue;
  queueName: string;
}> {
  const db = createSwarmDb(config);
  await migrateSwarmSchema(db);
  return { queue: new TaskQueue(db), queueName: config.queueName ?? "default" };
}

/**
 * Same-origin queue-status routes for the registry listener's `application`
 * fallback (see server.ts): the dashboard polls real depth + processed counts
 * straight from the Turso queue — the same source of truth the actor and the
 * Hatchet driver write to — so counts reflect every driver, not just the actor
 * instance this page happens to be attached to.
 *
 * Route ownership: this module owns the HTTP surface; TaskQueue owns all
 * task_queue SQL (queueDepth/completedCount); db.ts owns the client.
 */
export function createQueueStatusApp(deps: QueueStatusDeps = {}): Hono {
  const getConfig = deps.getConfig ?? envConfig;
  const openQueue = deps.openQueue ?? openFromConfig;

  // Lazy shared client (same pattern as the actor's ensureInit). A failed
  // init resets the promise so a later request can retry (e.g. env injected
  // after boot).
  let loaded: Promise<{ queue: TaskQueue; queueName: string }> | null = null;
  function ensure(): Promise<{ queue: TaskQueue; queueName: string }> {
    if (!loaded) {
      loaded = openQueue(getConfig());
      loaded.catch(() => {
        loaded = null;
      });
    }
    return loaded;
  }

  const app = new Hono();
  app.get("/api/queue-status", async (c) => {
    try {
      const { queue, queueName } = await ensure();
      const [depth, processedTasks] = await Promise.all([
        queue.queueDepth(queueName),
        queue.completedCount(queueName),
      ]);
      const body: QueueStatusSnapshot = { queueName, depth, processedTasks, ts: Date.now() };
      return c.json(body, 200, { "cache-control": "no-store" });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[queue-status] snapshot failed:", message);
      return c.json({ error: `queue status unavailable: ${message}` }, 503, {
        "cache-control": "no-store",
      });
    }
  });
  return app;
}
