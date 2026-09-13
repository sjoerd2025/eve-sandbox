import { actor, event, type ActorDefinition, type Actions, type Type } from "rivetkit";
import { Registry } from "prom-client";
import { createSwarmDb, migrateSwarmSchema, swarmDbConfigFromEnv, type SwarmDbConfig } from "./db";
import { TaskQueue, type ClaimedTask } from "./queue";
import { SamEngine, type SamPhase } from "./sam";
import { localExecutor } from "./executor";
import { createOpenRouterPlanner } from "./planner";
import { createWeaviateMemory } from "./memory";
import { SwarmMetrics } from "./telemetry";
import {
  createAgentBranch,
  destroyAgentBranch,
  tursoPlatformConfigFromEnv,
  type BranchCredentials,
  type TursoPlatformConfig,
} from "./branches";

/** WebSocket event payloads (consumed by the Multica/TUI/dashboard clients). */
export interface SamTransitionEvent {
  agentId: string;
  from: SamPhase;
  to: SamPhase;
  taskId: string;
  ts: number;
}

export interface SandboxStdoutEvent {
  agentId: string;
  taskId: string;
  output: string;
  ts: number;
}

export interface WorkspaceStatusEvent {
  agentId: string;
  step:
    | "creating_turso_branch"
    | "branch_ready"
    | "task_started"
    | "task_completed"
    | "task_failed"
    | "task_escalated"
    | "destroyed";
  detail?: string;
  ts: number;
}

export interface QueueStatusEvent {
  agentId: string;
  depth: { PENDING: number; LEASED: number; COMPLETED: number; FAILED: number };
  ts: number;
}

const DEFAULT_MODEL = "anthropic/claude-sonnet-4.5";
const DEFAULT_QUEUE = "default";

/**
 * Default queue name: the repo (each repo's issues get their own queue via the
 * bridge), overridable with SWARM_QUEUE_NAME, falling back to "default".
 */
export function defaultQueueName(env: NodeJS.ProcessEnv = process.env): string {
  return env.SWARM_QUEUE_NAME ?? env.GITHUB_REPO ?? DEFAULT_QUEUE;
}

/**
 * Env-driven worker config. Services degrade independently: no Weaviate → no
 * recall; no OpenRouter → planner finishes immediately; no Turso platform
 * token → no CoW branch. A missing Turso queue config surfaces on first claim.
 */
export interface SwarmWorkerConfig extends SwarmDbConfig {
  workerId?: string;
  queueName?: string;
  leaseMs?: number;
  heartbeatMs?: number;
  /** Max SAM EXECUTE→VERIFY→REFLECT cycles before ESCALATE. */
  maxRetries?: number;
  model?: string;
  weaviateUrl?: string;
  weaviateApiKey?: string;
}

export function swarmWorkerConfigFromEnv(env: NodeJS.ProcessEnv = process.env): SwarmWorkerConfig {
  return {
    ...swarmDbConfigFromEnv(env),
    workerId: env.SWARM_WORKER_ID,
    queueName: defaultQueueName(env),
    leaseMs: numEnv(env.SWARM_LEASE_MS) ?? 60_000,
    heartbeatMs: numEnv(env.SWARM_HEARTBEAT_MS) ?? 20_000,
    maxRetries: numEnv(env.SWARM_MAX_RETRIES) ?? 2,
    model: env.SWARM_MODEL ?? DEFAULT_MODEL,
    weaviateUrl: env.WEAVIATE_URL,
    weaviateApiKey: env.WEAVIATE_API_KEY,
  };
}

function numEnv(v: string | undefined): number | undefined {
  const n = v === undefined ? NaN : Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** Actor state — durable across sleeps (Rivet persists state automatically). */
interface SwarmWorkerState {
  currentTaskId: string | null;
  currentTaskName: string | null;
  lastDepth: QueueStatusEvent["depth"] | null;
  processedTasks: number;
}

/** Non-durable per-run vars. */
interface SwarmWorkerVars {
  queue: TaskQueue | null;
  metrics: SwarmMetrics;
  branch: BranchCredentials | null;
  branchConfig: TursoPlatformConfig | null;
  emptyPollStreak: number;
}

type SwarmEvents = {
  samTransition: Type<SamTransitionEvent>;
  sandboxStdout: Type<SandboxStdoutEvent>;
  workspaceStatus: Type<WorkspaceStatusEvent>;
  queueStatus: Type<QueueStatusEvent>;
};

type SwarmActions = Actions<
  SwarmWorkerState,
  undefined,
  undefined,
  SwarmWorkerVars,
  undefined,
  any,
  SwarmEvents,
  Record<never, never>
>;

type SwarmWorkerDefinition = ActorDefinition<
  SwarmWorkerState,
  undefined,
  undefined,
  SwarmWorkerVars,
  undefined,
  any,
  SwarmEvents,
  Record<never, never>,
  SwarmActions
>;

export const swarmWorker: SwarmWorkerDefinition = actor({
  options: {
    // Long action timeouts: a SAM run can take minutes.
    actionTimeout: 900_000,
    // Workers stay awake while they own a task lease.
    sleepGracePeriod: 900_000,
  },

  events: {
    samTransition: event<SamTransitionEvent>(),
    sandboxStdout: event<SandboxStdoutEvent>(),
    workspaceStatus: event<WorkspaceStatusEvent>(),
    queueStatus: event<QueueStatusEvent>(),
  },

  createState: (): SwarmWorkerState => ({
    currentTaskId: null,
    currentTaskName: null,
    lastDepth: null,
    processedTasks: 0,
  }),

  onCreate: async (c) => {
    // Self-driving poll loop: a durable fixed-interval schedule invokes
    // processNextTask (and refreshes queue depth) every 5s, surviving sleep,
    // restarts, and crashes — no external caller required.
    await c.cron.every({
      name: "poll-tasks",
      interval: 5_000, // minimum allowed interval
      action: "processNextTask",
    });
    await c.cron.every({
      name: "poll-depth",
      interval: 5_000,
      action: "pollQueueDepth",
    });
  },

  createVars: (): SwarmWorkerVars => ({
    queue: null,
    metrics: new SwarmMetrics(new Registry()),
    branch: null,
    branchConfig: tursoPlatformConfigFromEnv(),
    emptyPollStreak: 0,
  }),

  actions: {
    /**
     * Pull-based worker loop (ADR-001 §2): claim → run SAM → complete/fail,
     * one task per call so the caller (cron/inspector/TUI) controls pacing.
     */
    async processNextTask(c) {
      const config = swarmWorkerConfigFromEnv();
      const agentId = config.workerId ?? String(c.key);
      const queue = await ensureInit(c);
      const claimed: ClaimedTask | null = await queue.claimNextTask(agentId, {
        queueName: config.queueName,
        leaseMs: config.leaseMs,
      });
      if (!claimed) {
        // Exponential backoff on empty queues (ADR-001 queue-pressure
        // mitigation): 250ms doubling to a 5s ceiling.
        const streak = Math.min(c.vars.emptyPollStreak, 5);
        c.vars.emptyPollStreak += 1;
        await sleep(Math.min(250 * 2 ** streak, 5_000));
        return null;
      }
      c.vars.emptyPollStreak = 0;

      const queueName = config.queueName ?? DEFAULT_QUEUE;
      const waitSeconds = Math.max(0, (Date.now() - claimed.task.created_at) / 1000);
      c.vars.metrics.observeQueueWait(queueName, waitSeconds);

      c.state.currentTaskId = claimed.task.id;
      c.state.currentTaskName = claimed.task.name || claimed.task.id;
      broadcast(c, "workspaceStatus", {
        agentId,
        step: "task_started",
        detail: claimed.task.name || claimed.task.id,
      });

      // Heartbeat lease renewal (20s default; ADR-001 Phase 3 step 11).
      const heartbeatTimer = setInterval(() => {
        claimed.heartbeat(config.leaseMs).catch(() => {});
      }, config.heartbeatMs);

      const db = c.vars.queue!.db;
      const memory = config.weaviateUrl
        ? createWeaviateMemory({ url: config.weaviateUrl, apiKey: config.weaviateApiKey })
        : {};
      const planner = createOpenRouterPlanner({
        apiKey: process.env.OPENROUTER_API_KEY,
        model: config.model,
      });

      const sam = new SamEngine(
        planner,
        {
          async exec(command) {
            const result = await localExecutor.exec(command);
            c.vars.metrics.incExecution(result.exitCode);
            broadcast(c, "sandboxStdout", {
              agentId,
              taskId: claimed.task.id,
              output: result.stdout,
            });
            return result;
          },
        },
        memory,
        {
          onTransition: (from, to) => {
            c.vars.metrics.incTransition(from, to);
            broadcast(c, "samTransition", { agentId, from, to, taskId: claimed.task.id });
          },
          onStep: async (step) => {
            // Audit trail (ADR-001 §4): every tool invocation durably logged.
            await db
              .execute({
                sql: `INSERT INTO agent_audit_logs (session_id, task_id, worker_id, phase, action, detail, created_at)
                      VALUES (?, ?, ?, 'EXECUTE', 'run_command', ?, ?)`,
                args: [
                  claimed.task.id,
                  claimed.task.id,
                  agentId,
                  JSON.stringify({
                    command: step.action.type === "run_command" ? step.action.command : null,
                    exitCode: step.exitCode,
                    stdout: step.stdout.slice(0, 2000),
                    stderr: step.stderr.slice(0, 1000),
                  }),
                  step.endedAt,
                ],
              })
              .catch(() => {});
          },
        },
      );

      try {
        const result = await sam.run(claimed.task.prompt, { maxRetries: config.maxRetries });

        const model = config.model ?? DEFAULT_MODEL;
        if (planner.lastUsage) {
          c.vars.metrics.addLlmTokens(model, "prompt", planner.lastUsage.promptTokens);
          c.vars.metrics.addLlmTokens(model, "completion", planner.lastUsage.completionTokens);
        }

        if (result.escalated) {
          // Human-in-the-loop escalation (ADR-001 §3): task FAILED with the
          // escalation summary; operators re-queue after intervening.
          await claimed.fail(result.summary);
          broadcast(c, "workspaceStatus", {
            agentId,
            step: "task_escalated",
            detail: result.summary,
          });
        } else {
          await claimed.complete({ summary: result.summary, iterations: result.iterations });
          broadcast(c, "workspaceStatus", {
            agentId,
            step: "task_completed",
            detail: result.summary,
          });
        }
        c.state.processedTasks += 1;
        return { taskId: claimed.task.id, ...result };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await claimed.fail(message).catch(() => {});
        broadcast(c, "workspaceStatus", { agentId, step: "task_failed", detail: message });
        return { taskId: claimed.task.id, error: message };
      } finally {
        clearInterval(heartbeatTimer);
        c.state.currentTaskId = null;
        c.state.currentTaskName = null;
      }
    },

    /** Queue depth snapshot (bounded label sets) + push to subscribers. */
    async pollQueueDepth(c) {
      const config = swarmWorkerConfigFromEnv();
      const queue = await ensureInit(c);
      const depth = await queue.queueDepth(config.queueName ?? DEFAULT_QUEUE);
      c.state.lastDepth = depth;
      c.vars.metrics.setQueueDepth(
        Object.entries(depth).map(([status, count]) => ({
          queueName: config.queueName ?? DEFAULT_QUEUE,
          status,
          count,
        })),
      );
      broadcast(c, "queueStatus", { agentId: config.workerId ?? String(c.key), depth });
      return depth;
    },

    /**
     * Turso CoW branch lifecycle (ADR-001 "THIS IS DONE IN RIVET.DEV"):
     * branch per actor, token scoped to the branch, destroyed on teardown.
     */
    async setupWorkspace(c) {
      const agentId = swarmWorkerConfigFromEnv().workerId ?? String(c.key);
      if (c.vars.branch) return { status: "ready", ...c.vars.branch };
      if (!c.vars.branchConfig) {
        return {
          status: "skipped",
          reason: "TURSO_PLATFORM_API_TOKEN / TURSO_ORG_SLUG not configured",
        };
      }
      broadcast(c, "workspaceStatus", { agentId, step: "creating_turso_branch" });
      const branch = await createAgentBranch(c.vars.branchConfig, `worker-${agentId}`);
      c.vars.branch = branch;
      broadcast(c, "workspaceStatus", { agentId, step: "branch_ready", detail: branch.dbUrl });
      return { status: "created", ...branch };
    },

    async teardownWorkspace(c) {
      if (c.vars.branch) {
        await destroyAgentBranch(c.vars.branchConfig!, c.vars.branch.branchName);
        c.vars.branch = null;
      }
      broadcast(c, "workspaceStatus", {
        agentId: swarmWorkerConfigFromEnv().workerId ?? String(c.key),
        step: "destroyed",
      });
      return { status: "cleaned_up" };
    },

    /** Inspect this worker (TUI/inspector view model). */
    async status(c) {
      return {
        agentId: swarmWorkerConfigFromEnv().workerId ?? String(c.key),
        currentTaskId: c.state.currentTaskId,
        currentTaskName: c.state.currentTaskName,
        processedTasks: c.state.processedTasks,
        lastDepth: c.state.lastDepth,
        hasBranch: c.vars.branch !== null,
      };
    },

    /** Expose bounded Prometheus metrics from this worker. */
    async metrics(c) {
      return {
        contentType: c.vars.metrics.contentType(),
        body: await c.vars.metrics.render(),
      };
    },
  },
});

/** Broadcast with a timestamp — every swarm event carries `ts`. */
function broadcast(
  c: { broadcast: (name: string, ...args: unknown[]) => void },
  name: "samTransition" | "sandboxStdout" | "workspaceStatus" | "queueStatus",
  payload: Record<string, unknown>,
): void {
  c.broadcast(name, { ts: Date.now(), ...payload });
}

/** Lazy-init the Turso client + queue (module-level helper, not an action). */
async function ensureInit(c: { vars: SwarmWorkerVars }): Promise<TaskQueue> {
  if (c.vars.queue) return c.vars.queue;
  const db = createSwarmDb(swarmWorkerConfigFromEnv());
  await migrateSwarmSchema(db);
  c.vars.queue = new TaskQueue(db, { leaseMs: swarmWorkerConfigFromEnv().leaseMs });
  return c.vars.queue;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
