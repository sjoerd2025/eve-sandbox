import { actor, queue, type ActorDefinition } from "rivetkit";
import { Loop, workflow } from "rivetkit/workflow";
import { createSwarmDb, migrateSwarmSchema, swarmDbConfigFromEnv } from "./db";
import { TaskQueue, type TaskRow } from "./queue";
import { createOpenRouterPlanner } from "./planner";
import { createWeaviateMemory } from "./memory";
import { localExecutor } from "./executor";
import { defaultQueueName } from "./actor";

/** Journal entry for one executed command (JSON-safe, replayable). */
type RunnerStep = {
  seq: number;
  action: { type: string; command?: string; summary?: string };
  exitCode: number | null;
  stdout: string;
  stderr: string;
  startedAt: number;
  endedAt: number;
};

interface SwarmRunnerState {
  currentTaskId: string | null;
  processedTasks: number;
  lastSummary: string | null;
  lastSuccess: boolean | null;
}

type SwarmRunnerDefinition = ActorDefinition<
  SwarmRunnerState,
  undefined,
  undefined,
  undefined,
  undefined,
  any,
  Record<never, never>,
  { tasks: ReturnType<typeof queue<{ taskId: string }>> },
  {
    getState: (c: any) => SwarmRunnerState;
    submit: (c: any, taskId: string) => Promise<{ queued: boolean }>;
  }
>;

/**
 * Durable swarm runner (Rivet Workflows).
 *
 * One workflow actor per repo-queue. Unlike the Hatchet path (poll + runChild
 * checkpoints), this waits on its actor queue — zero polling — and checkpoints
 * each SAM phase as a named step: a crash mid-task replays completed steps
 * without re-billing the planner LLM call or re-running commands.
 *
 * SAM mapping (one step per phase, mirroring hatchet.ts's samCycle):
 *   claim-task → [sam-loop: plan-N → execute-N → verify-N → finish-N] → complete-task
 *
 * Steps return only JSON-safe data (task rows, journal entries) — closures
 * never cross a step boundary, so replay re-derives identical state.
 */
export const swarmRunner: SwarmRunnerDefinition = actor({
  state: {
    currentTaskId: null as string | null,
    processedTasks: 0,
    lastSummary: null as string | null,
    lastSuccess: null as boolean | null,
  },
  queues: {
    tasks: queue<{ taskId: string }>(),
  },
  run: workflow(async (ctx) => {
    await ctx.loop("swarm-loop", async (loopCtx) => {
      // Durable wait: no message, no wake-up, no polling.
      const [message] = await loopCtx.queue.nextBatch("wait-task", {
        timeout: 30_000,
      });
      if (!message) return;

      // 1. Claim from Turso. The claim UPDATE is idempotent on replay: if the
      //    step already ran, the task is LEASED and the next claim gets nothing.
      const task = await loopCtx.step<TaskRow | null>("claim-task", async () => {
        const db = createSwarmDb(swarmDbConfigFromEnv());
        const q = new TaskQueue(db);
        try {
          await migrateSwarmSchema(db);
          const claimed = await q.claimNextTask("swarm-runner", {
            queueName: defaultQueueName(),
            leaseMs: 30 * 60 * 1000,
          });
          return claimed ? claimed.task : null;
        } finally {
          db.close();
        }
      });
      if (!task) return;

      await loopCtx.step("mark-started", async (step) => {
        step.state.currentTaskId = task.id;
      });

      // 2. Memory recall once per task (cheap, replayable).
      const recall = await loopCtx.step("recall-memory", async () => {
        const memory = createWeaviateMemory({
          url: process.env.WEAVIATE_URL ?? "",
          apiKey: process.env.WEAVIATE_API_KEY ?? "",
        });
        return (await memory.recall?.(task.prompt)) ?? [];
      });

      // 3. SAM loop: one named step per phase — the checkpoint boundary.
      const history: RunnerStep[] = [];
      const maxIterations = 8;

      const outcome = await ctx.loop("sam-loop", async (samCtx) => {
        for (let iteration = 1; iteration <= maxIterations; iteration++) {
          // PLAN — the LLM call; replayed from checkpoint on crash.
          const action = await samCtx.step<RunnerStep["action"]>(`plan-${iteration}`, async () => {
            const planner = createOpenRouterPlanner({});
            return await planner.plan({
              prompt: task.prompt,
              history: history as never,
              recall,
            });
          });

          if (action.type === "finish") {
            return Loop.break({ done: true, summary: action.summary ?? "" });
          }

          // EXECUTE — sandbox command; null for non-command actions.
          const executed = await samCtx.step<RunnerStep | null>(
            `execute-${iteration}`,
            async () => {
              if (action.type !== "run_command") return null;
              const startedAt = Date.now();
              const { exitCode, stdout, stderr } = await localExecutor.exec(action.command!);
              return {
                seq: history.length + 1,
                action,
                exitCode,
                stdout: stdout.slice(0, 8000),
                stderr: stderr.slice(0, 2000),
                startedAt,
                endedAt: Date.now(),
              };
            },
          );

          // VERIFY — journal append only after a passing step.
          const passed = await samCtx.step<boolean>(`verify-${iteration}`, async (vstep) => {
            if (!executed) return true; // non-command action: pass-through
            vstep.state.lastSummary = `exit ${executed.exitCode}`;
            return executed.exitCode === 0;
          });
          if (executed && passed) history.push(executed);

          if (passed) {
            // Success: one more plan round writes the finish summary.
            const summary = await samCtx.step<string>(`finish-${iteration}`, async () => {
              const planner = createOpenRouterPlanner({});
              const fin = await planner.plan({
                prompt: task.prompt,
                history: history as never,
                recall,
              });
              return fin.type === "finish"
                ? (fin.summary ?? `completed after ${history.length} command(s)`)
                : `completed after ${history.length} command(s)`;
            });
            return Loop.break({ done: true, summary });
          }
          // Non-zero exit: loop back to PLAN with the failure in the journal.
        }
        return Loop.break({
          done: false,
          summary: `escalated after ${maxIterations} failed attempts: last stderr: ${
            history.at(-1)?.stderr.slice(0, 200) ?? ""
          }`,
        });
      });

      // 4. Persist the outcome + clear state.
      await loopCtx.step("complete-task", async (step) => {
        const db = createSwarmDb(swarmDbConfigFromEnv());
        const q = new TaskQueue(db);
        try {
          if (outcome.done) {
            await q.completeById(task.id, {
              summary: outcome.summary,
              iterations: history.length,
            });
          } else {
            await q.failById(task.id, outcome.summary);
          }
        } finally {
          db.close();
        }
        step.state.processedTasks += 1;
        step.state.lastSummary = outcome.summary;
        step.state.lastSuccess = outcome.done;
        step.state.currentTaskId = null;
      });
    });
  }),
  actions: {
    getState: (c) => c.state,
    /** Nudge the runner: enqueue a task notification (bridge calls this). */
    submit: async (c, taskId: string) => {
      await c.queue.send("tasks", { taskId });
      return { queued: true };
    },
  },
});
