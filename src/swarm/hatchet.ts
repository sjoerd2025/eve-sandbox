import { HatchetClient } from "@hatchet-dev/typescript-sdk";
import { createSwarmDb, migrateSwarmSchema, swarmDbConfigFromEnv } from "./db";
import { defaultQueueName } from "./actor";
import { TaskQueue, type ClaimedTask } from "./queue";
import { createOpenRouterPlanner } from "./planner";
import { createWeaviateMemory } from "./memory";
import { localExecutor } from "./executor";
import { buildSamStep, completionSummary, escalationSummary, stepPassed } from "./sam";
import type { RecallItem, SamAction, SamStep } from "./sam";

// ---- client ----------------------------------------------------------------

export const hatchet = HatchetClient.init();

// ---- shared JSON-safe types (type aliases: Hatchet inputs must be JsonObject) --

/**
 * Step and recall shapes are owned by sam.ts (single source for both the FSM
 * and this durable driver); these aliases keep Hatchet's workflow type names
 * stable while making drift a type error.
 */
export type SerializedStep = SamStep;
export type { RecallItem };

export type CycleInput = {
  taskId: string;
  prompt: string;
  recall: RecallItem[];
  history: SerializedStep[];
};

/** Workflow output = merged outputs of its tasks, keyed by task name. */
export type CycleOutput = {
  plan: { action: SamAction };
  execute: { action: SamAction; step: SerializedStep | null };
  verify: { done: boolean; passed: boolean; summary: string; step: SerializedStep | null };
};

export type LoopInput = {
  taskId: string;
  prompt: string;
  maxIterations?: number;
};

export type LoopOutput = {
  taskId: string;
  success: boolean;
  summary: string;
  iterations: number;
  steps: SerializedStep[];
};

export type DispatchOutput = { claimed: false } | LoopOutput;

const MAX_ITERATIONS = 10;

// ---- one SAM cycle (checkpointed children) ----------------------------------

/**
 * One PLAN → EXECUTE → VERIFY cycle as a child workflow. Each task is
 * checkpointed by Hatchet: a crashed worker replays completed tasks instead of
 * re-billing the LLM or re-running commands.
 */
export const samCycle = hatchet.workflow<CycleInput, CycleOutput>({
  name: "sam-cycle",
});

const plan = samCycle.task({
  name: "plan",
  fn: async (input) => {
    const planner = createOpenRouterPlanner({});
    const action = await planner.plan({
      prompt: input.prompt,
      history: input.history,
      recall: input.recall,
    });
    return { action };
  },
});

const execute = samCycle.task({
  name: "execute",
  parents: [plan],
  fn: async (input, ctx) => {
    const { action } = await ctx.parentOutput(plan);
    if (action.type !== "run_command") {
      return { action, step: null };
    }
    const startedAt = Date.now();
    const result = await localExecutor.exec(action.command);
    return {
      action,
      step: buildSamStep(input.history.length + 1, action, startedAt, result),
    };
  },
});

const verify = samCycle.task({
  name: "verify",
  parents: [execute],
  fn: async (_input, ctx) => {
    const out = await ctx.parentOutput(execute);
    if (out.action.type === "finish") {
      // Planner finished directly from PLAN.
      return { done: true, passed: true, summary: out.action.summary, step: null };
    }
    const step = out.step!;
    return { done: false, passed: stepPassed(step), summary: "", step };
  },
});

// ---- durable SAM loop --------------------------------------------------------

/**
 * The full SAM lifecycle as a durable task. Each iteration spawns a
 * checkpointed `sam-cycle` child; Hatchet's durable event log means an evicted
 * or crashed run resumes from the last completed child, never re-running
 * billed LLM calls or executed commands.
 */
export const samLoop = hatchet.durableTask({
  name: "sam-loop",
  executionTimeout: "30m",
  fn: async (input: LoopInput, ctx): Promise<LoopOutput> => {
    const maxIterations = input.maxIterations ?? MAX_ITERATIONS;
    const memory = createWeaviateMemory({
      url: process.env.WEAVIATE_URL ?? "",
      apiKey: process.env.WEAVIATE_API_KEY ?? "",
    });
    const recall = (await memory.recall?.(input.prompt)) ?? [];
    const history: SerializedStep[] = [];

    for (let iteration = 1; iteration <= maxIterations; iteration++) {
      const cycle = await ctx.runChild(samCycle, {
        taskId: input.taskId,
        prompt: input.prompt,
        recall,
        history,
      });
      if (cycle.verify.done) {
        // finish action straight from PLAN
        return finish(memory, input, history, cycle.verify.summary, true);
      }
      const step = cycle.verify.step!;
      history.push(step);

      if (cycle.verify.passed) {
        // Success: one more plan round writes the finish summary.
        const finisher = await ctx.runChild(samCycle, {
          taskId: input.taskId,
          prompt: input.prompt,
          recall,
          history,
        });
        const summary =
          finisher.plan.action.type === "finish"
            ? finisher.plan.action.summary
            : completionSummary(history.length);
        return finish(memory, input, history, summary, true);
      }
      if (iteration === maxIterations) {
        const summary = escalationSummary(maxIterations, step.stderr);
        return finish(memory, input, history, summary, false);
      }
      // Non-zero exit: loop back to PLAN with the failure in the journal.
    }
    // Unreachable (loop always returns), kept for the type checker.
    return finish(memory, input, history, "escalated: iteration budget exhausted", false);
  },
});

async function finish(
  memory: ReturnType<typeof createWeaviateMemory>,
  input: LoopInput,
  history: SerializedStep[],
  summary: string,
  success: boolean,
): Promise<LoopOutput> {
  await memory.persist?.({ prompt: input.prompt, summary, success, artifacts: [] });
  return { taskId: input.taskId, success, summary, iterations: history.length, steps: history };
}

// ---- dispatcher: Turso queue → Hatchet ---------------------------------------

/**
 * Claims the next PENDING task from the Turso queue and runs one durable SAM
 * loop for it. If the dispatcher dies before the child starts, the Turso lease
 * simply expires and another worker retries.
 */
export const dispatchNextTask = hatchet.task({
  name: "dispatch-next-task",
  retries: 1,
  executionTimeout: "35m",
  fn: async (_input: Record<string, never>, ctx): Promise<DispatchOutput> => {
    const db = createSwarmDb(swarmDbConfigFromEnv());
    await migrateSwarmSchema(db);
    const queue = new TaskQueue(db);
    const claimed: ClaimedTask | null = await queue.claimNextTask("hatchet-worker", {
      queueName: defaultQueueName(),
      leaseMs: 35 * 60 * 1000,
    });
    if (!claimed) return { claimed: false };

    ctx.logger.info(`claimed ${claimed.task.id}: ${claimed.task.prompt.slice(0, 80)}`);
    try {
      const result = await ctx.runChild(samLoop, {
        taskId: claimed.task.id,
        prompt: claimed.task.prompt,
      });
      await claimed.complete({
        summary: result.summary,
        iterations: result.iterations,
        success: result.success,
      });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await claimed.fail(message);
      throw error;
    }
  },
});
