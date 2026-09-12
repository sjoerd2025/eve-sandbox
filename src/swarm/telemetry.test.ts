import { describe, expect, it } from "vitest";
import { Registry } from "prom-client";
import { SwarmMetrics } from "./telemetry";

describe("SwarmMetrics", () => {
  it("records bounded metrics and renders exposition format", async () => {
    const metrics = new SwarmMetrics(new Registry());

    metrics.observeQueueWait("default", 0.2);
    metrics.setQueueDepth([{ queueName: "default", status: "PENDING", count: 3 }]);
    metrics.addLlmTokens("anthropic/claude-3.5-sonnet", "prompt", 120);
    metrics.incExecution(0);
    metrics.incExecution(1);
    metrics.incTransition("PLAN", "EXECUTE");

    const text = await metrics.render();
    expect(text).toContain('swarm_queue_depth{queue_name="default",status="PENDING"} 3');
    expect(text).toContain(
      'swarm_llm_tokens_total{model="anthropic/claude-3.5-sonnet",token_type="prompt"} 120',
    );
    expect(text).toContain('swarm_litebox_executions_total{exit_code_group="0"} 1');
    expect(text).toContain('swarm_litebox_executions_total{exit_code_group="1-3"} 1');
    expect(text).toContain('swarm_sam_transitions_total{from="PLAN",to="EXECUTE"} 1');
  });

  it("buckets exit codes into bounded groups", () => {
    expect(SwarmMetrics.exitCodeGroup(0)).toBe("0");
    expect(SwarmMetrics.exitCodeGroup(2)).toBe("1-3");
    expect(SwarmMetrics.exitCodeGroup(42)).toBe("4-63");
    expect(SwarmMetrics.exitCodeGroup(101)).toBe("64-127");
    expect(SwarmMetrics.exitCodeGroup(137)).toBe("128-255");
    expect(SwarmMetrics.exitCodeGroup(-1)).toBe("other");
  });
});
