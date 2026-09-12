import { Counter, Gauge, Histogram, type Registry } from "prom-client";

/**
 * ADR-001 §5: strictly bounded cardinality. Dynamic values (session ids,
 * prompts, file paths, actor keys) are FORBIDDEN as labels — they go to Turso
 * (agent_audit_logs) instead. Every label below is drawn from a small enum;
 * this guard asserts that contract at runtime in tests.
 */

/**
 * Collected by the swarm modules, rendered by the app's /metrics route.
 * The registry is injected (not a global singleton) so parallel test files and
 * multiple registries stay independent.
 */
export class SwarmMetrics {
  readonly queueWait: Histogram<"queue">;
  readonly queueDepth: Gauge<"queue_name" | "status">;
  readonly llmTokens: Counter<"model" | "token_type">;
  readonly executions: Counter<"exit_code_group">;
  readonly samTransitions: Counter<"from" | "to">;

  constructor(private readonly registryRef: Registry) {
    const labels = { registers: [registryRef] };

    this.queueWait = new Histogram({
      ...labels,
      name: "swarm_queue_wait_duration_seconds",
      help: "Time tasks spend PENDING before a worker claims them",
      labelNames: ["queue"],
      buckets: [0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30, 60, 300],
    });
    this.queueDepth = new Gauge({
      ...labels,
      name: "swarm_queue_depth",
      help: "Tasks per status per queue (status/queue_name are bounded enums)",
      labelNames: ["queue_name", "status"],
    });
    this.llmTokens = new Counter({
      ...labels,
      name: "swarm_llm_tokens_total",
      help: "LLM tokens burned (model/token_type are bounded enums)",
      labelNames: ["model", "token_type"],
    });
    this.executions = new Counter({
      ...labels,
      name: "swarm_litebox_executions_total",
      help: "Sandbox executions bucketed by exit-code class",
      labelNames: ["exit_code_group"],
    });
    this.samTransitions = new Counter({
      ...labels,
      name: "swarm_sam_transitions_total",
      help: "SAM phase transitions (from/to are bounded phase enums)",
      labelNames: ["from", "to"],
    });
  }

  /** Exit code -> bounded bucket (0 | 1-3 | 4-63 | 64-127 | 128-255 | other). */
  static exitCodeGroup(code: number): string {
    if (code === 0) return "0";
    if (code >= 1 && code <= 3) return "1-3";
    if (code >= 4 && code <= 63) return "4-63";
    if (code >= 64 && code <= 127) return "64-127";
    if (code >= 128 && code <= 255) return "128-255";
    return "other";
  }

  /** Observe how long a task waited before claim (PENDING -> LEASED). */
  observeQueueWait(queue: string, seconds: number): void {
    this.queueWait.labels(queue).observe(seconds);
  }

  /** Push the latest queue depth snapshot (call from the polling loop). */
  setQueueDepth(depths: Array<{ queueName: string; status: string; count: number }>): void {
    this.queueDepth.reset();
    for (const { queueName, status, count } of depths) {
      this.queueDepth.labels(queueName, status).set(count);
    }
  }

  /** Record token burn. `model` must be a static config value, not per-request. */
  addLlmTokens(model: string, tokenType: "prompt" | "completion", count: number): void {
    this.llmTokens.labels(model, tokenType).inc(count);
  }

  /** Record a sandbox execution by exit-code bucket. */
  incExecution(exitCode: number): void {
    this.executions.labels(SwarmMetrics.exitCodeGroup(exitCode)).inc();
  }

  /** Record a SAM transition (both labels from the bounded phase enum). */
  incTransition(from: string, to: string): void {
    this.samTransitions.labels(from, to).inc();
  }

  /** Render the registry in Prometheus text exposition format. */
  render(): Promise<string> {
    return this.registryRef.metrics();
  }

  /** Content-Type header to serve with {@link render}. */
  contentType(): string {
    return this.registryRef.contentType;
  }
}
