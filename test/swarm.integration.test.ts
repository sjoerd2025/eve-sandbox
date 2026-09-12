import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { describe, expect, it } from "vitest";
import { createSwarmDb, migrateSwarmSchema, swarmDbConfigFromEnv } from "../src/swarm/db";
import { createOpenRouterPlanner } from "../src/swarm/planner";
import { TaskQueue } from "../src/swarm/queue";
import { SamEngine } from "../src/swarm/sam";

// Live test against the configured Turso database (and OpenRouter when
// reachable). Networked and slow — same convention as test/e2b.integration
// .test.ts. It runs whenever TURSO_DATABASE_URL is set (the repo .env sets it);
// `src/swarm/db.ts` loads the .env at import time.
const hasTurso = Boolean(process.env.TURSO_DATABASE_URL);

/** Same dev executor shape the actor uses: bash in a local child process. */
function runLocal(command: string): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn("bash", ["-c", command]);
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("close", (code) => resolve({ exitCode: code ?? -1, stdout, stderr }));
    child.on("error", (err) => resolve({ exitCode: -1, stdout, stderr: stderr + err.message }));
  });
}

describe.skipIf(!hasTurso)("swarm integration (live Turso)", () => {
  it("enqueues a real task and drives one full SAM cycle to COMPLETED", async (ctx) => {
    const db = createSwarmDb(swarmDbConfigFromEnv());
    await migrateSwarmSchema(db); // idempotent on the configured database
    const queue = new TaskQueue(db);

    // claimNextTask takes the oldest PENDING task in the default queue;
    // require an empty queue so the test can never consume a foreign task.
    const depth = await queue.queueDepth();
    ctx.skip(depth.PENDING > 0, "default queue holds foreign PENDING tasks");

    const taskId = `integration-${randomUUID()}`;
    const transitions: string[] = [];
    try {
      const task = await queue.enqueue({
        id: taskId,
        prompt:
          "Run exactly one shell command: echo swarm-integration-ok. When it succeeds, finish.",
      });
      expect(task.status).toBe("PENDING");

      const planner = createOpenRouterPlanner({ apiKey: process.env.OPENROUTER_API_KEY });
      const sam = new SamEngine(
        planner,
        { exec: runLocal },
        {}, // no Weaviate here — memory hooks are optional
        { onTransition: (from, to) => transitions.push(`${from}->${to}`) },
      );

      // One SAM cycle makes sequential LLM calls that can outlive the 60s
      // default lease, so claim with a lease covering the whole run.
      const claimed = await queue.claimNextTask(`it-worker-${process.pid}`, {
        leaseMs: 180_000,
      });
      expect(claimed?.task.id).toBe(taskId);
      expect(claimed?.task.status).toBe("LEASED");
      expect(claimed?.task.attempts).toBe(1);

      const result = await sam.run(claimed!.task.prompt);

      expect(sam.currentPhase).toBe("COMMIT");
      for (const phase of ["RECALL", "PLAN", "COMMIT"] as const) {
        expect(
          transitions.some((t) => t.endsWith(`->${phase}`)),
          phase,
        ).toBe(true);
      }
      if (result.escalated) {
        await claimed!.fail(result.summary);
        expect.unreachable(`SAM escalated instead of completing: ${result.summary}`);
      }
      await claimed!.complete({ summary: result.summary, iterations: result.iterations });

      // The terminal state must be visible in the real Turso database.
      const rs = await db.execute({
        sql: "SELECT status, result FROM task_queue WHERE id = ?",
        args: [taskId],
      });
      expect(rs.rows).toHaveLength(1);
      expect(String(rs.rows[0]!.status)).toBe("COMPLETED");
      const stored = JSON.parse(String(rs.rows[0]!.result)) as { summary: string };
      expect(stored.summary).toBe(result.summary);
    } finally {
      // Leave the shared database as we found it.
      await db
        .execute({ sql: "DELETE FROM task_queue WHERE id = ?", args: [taskId] })
        .catch(() => {});
    }
  }, 180_000);
});
