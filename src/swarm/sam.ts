const nowMs = () => Date.now();

/** Bounded SAM phase set (ADR-001 §3). These are the only telemetry-safe phases. */
export type SamPhase = "IDLE" | "RECALL" | "PLAN" | "EXECUTE" | "VERIFY" | "COMMIT" | "ESCALATE";

/** Optional semantic-memory hooks (Weaviate). All optional; recall may return []. */
export interface SamMemoryHooks {
  recall?: (prompt: string) => Promise<Array<{ id: string; text: string; score: number }>>;
  /** Persist a completed session's outcome for future recall. */
  persist?: (record: {
    prompt: string;
    summary: string;
    success: boolean;
    artifacts: string[];
  }) => Promise<void>;
}

export interface SamPlanner {
  /**
   * Produce the next concrete action given the phase history. The TaskQueue
   * lease provides replay-safety: a crashed run simply loses its lease and the
   * task is re-run from scratch.
   */
  plan(input: {
    prompt: string;
    history: SamStep[];
    recall: Array<{ id: string; text: string; score: number }>;
  }): Promise<SamAction>;
}

export type SamAction =
  | { type: "run_command"; command: string }
  | { type: "finish"; summary: string };

/** One journaled step of a SAM run. */
export interface SamStep {
  seq: number;
  action: SamAction;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  startedAt: number;
  endedAt: number;
}

export interface SamRunOptions {
  /** Max failed EXECUTE→VERIFY cycles before ESCALATE (ADR-001 §3). */
  maxRetries?: number;
}

export interface SamExecutor {
  /**
   * Run a command in the sandbox (litebox microVM / agentOS VM actor / E2B).
   * Returns exit code and captured stdio.
   */
  exec(command: string): Promise<{ exitCode: number; stdout: string; stderr: string }>;
}

export interface SamRunResult {
  success: boolean;
  summary: string;
  steps: SamStep[];
  escalated: boolean;
  iterations: number;
}

export interface SamEvents {
  onTransition?: (from: SamPhase, to: SamPhase) => void;
  onStep?: (step: SamStep) => void;
}

/** Legal transitions of the ADR-001 §3 lifecycle. Anything else is a bug. */
const ALLOWED: Record<SamPhase, SamPhase[]> = {
  IDLE: ["RECALL"],
  RECALL: ["PLAN"],
  PLAN: ["EXECUTE", "COMMIT"], // planner may answer finish directly from PLAN
  EXECUTE: ["VERIFY"],
  VERIFY: ["COMMIT", "PLAN", "ESCALATE"], // success | retry | retries exhausted
  COMMIT: [],
  ESCALATE: ["COMMIT"],
};

/**
 * SAM (Structured Agent Model): a formal FSM around the agent loop so impossible
 * transitions are impossible (ADR-001 §3) — unlike an unstructured while(true)
 * LLM loop. Illegal transitions throw instead of being attempted.
 */
export class SamEngine {
  private phase: SamPhase = "IDLE";
  private steps: SamStep[] = [];

  constructor(
    private readonly planner: SamPlanner,
    private readonly executor: SamExecutor,
    private readonly memory: SamMemoryHooks = {},
    private readonly events: SamEvents = {},
  ) {}

  get currentPhase(): SamPhase {
    return this.phase;
  }

  get journal(): readonly SamStep[] {
    return this.steps;
  }

  private transition(to: SamPhase): void {
    if (!ALLOWED[this.phase].includes(to)) {
      throw new Error(`SAM illegal transition ${this.phase} -> ${to}`);
    }
    const from = this.phase;
    this.phase = to;
    this.events.onTransition?.(from, to);
  }

  /**
   * Run the full lifecycle for one prompt. Executor failures are captured in
   * the journal (as non-zero steps); transport-level throws propagate to the
   * caller, which maps them onto the TaskQueue lease.
   */
  async run(prompt: string, options: SamRunOptions = {}): Promise<SamRunResult> {
    const maxRetries = options.maxRetries ?? 2;
    let retries = 0;
    let escalated = false;
    let summary = "";

    this.transition("RECALL");
    const recall = (await this.memory.recall?.(prompt)) ?? [];

    this.transition("PLAN");

    while (true) {
      const action = await this.planner.plan({ prompt, history: this.steps, recall });

      if (action.type === "finish") {
        summary = action.summary;
        this.transition("COMMIT");
        break;
      }

      this.transition("EXECUTE");
      const startedAt = nowMs();
      let exitCode = -1;
      let stdout = "";
      let stderr = "";
      try {
        ({ exitCode, stdout, stderr } = await this.executor.exec(action.command));
      } catch (error) {
        stderr = error instanceof Error ? error.message : String(error);
      }
      const step: SamStep = {
        seq: this.steps.length + 1,
        action,
        exitCode,
        stdout,
        stderr,
        startedAt,
        endedAt: nowMs(),
      };
      this.steps.push(step);
      this.events.onStep?.(step);

      this.transition("VERIFY");
      if (exitCode === 0) {
        // Success: let the planner write the finish summary.
        continue;
      }

      // Non-zero exit: re-plan until retries are exhausted, then ESCALATE
      // (human-in-the-loop is handled by the actor).
      retries += 1;
      if (retries > maxRetries) {
        this.transition("ESCALATE");
        escalated = true;
        summary = `escalated after ${maxRetries} failed attempts: last stderr: ${stderr.slice(0, 200)}`;
        this.transition("COMMIT");
        break;
      }
      // Retry: re-plan with the failure in the journal.
      this.transition("PLAN");
    }

    await this.memory.persist?.({
      prompt,
      summary,
      success: !escalated,
      artifacts: [],
    });

    return {
      success: !escalated,
      summary,
      steps: this.steps,
      escalated,
      iterations: this.steps.length,
    };
  }
}
