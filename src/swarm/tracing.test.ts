import { afterEach, describe, expect, it } from "vitest";
import { createLangfuseTracer } from "./tracing";

afterEach(() => {
  delete process.env.LANGFUSE_PUBLIC_KEY;
  delete process.env.LANGFUSE_SECRET_KEY;
  delete process.env.LANGFUSE_BASE_URL;
});

const baseTrace = {
  taskId: "t1",
  model: "anthropic/claude-sonnet-4.5",
  prompt: "do a thing",
  status: "ok" as const,
  actionType: "run_command",
  durationMs: 250,
  usage: { promptTokens: 100, completionTokens: 20 },
};

describe("createLangfuseTracer", () => {
  it("is a no-op without credentials (disabled)", async () => {
    let calls = 0;
    const tracer = createLangfuseTracer({
      fetchImpl: (async () => (calls++, new Response("{}"))) as typeof fetch,
    });
    tracer.record(baseTrace);
    await tracer.flush();
    expect(calls).toBe(0);
  });

  it("posts one OTel span per record with gen_ai attributes and status", async () => {
    process.env.LANGFUSE_PUBLIC_KEY = "pk-test";
    process.env.LANGFUSE_SECRET_KEY = "sk-test";
    let body: any;
    const tracer = createLangfuseTracer({
      fetchImpl: (async (_url, init) => {
        body = JSON.parse(String(init?.body));
        return new Response("{}");
      }) as typeof fetch,
    });
    tracer.record(baseTrace);
    tracer.record({ ...baseTrace, status: "http_error", httpStatus: 502 });
    await tracer.flush();

    const spans = body.resourceSpans[0].scopeSpans[0].spans;
    expect(spans).toHaveLength(2);
    expect(spans[0].name).toBe("sam.planner anthropic/claude-sonnet-4.5");
    expect(spans[0].status.code).toBe(1);
    const keys = (s: any) => Object.fromEntries(s.attributes.map((a: any) => [a.key, a.value]));
    const attrs0 = keys(spans[0]);
    expect(attrs0["gen_ai.request.model"].stringValue).toBe(baseTrace.model);
    expect(attrs0["gen_ai.usage.prompt_tokens"].doubleValue).toBe(100);
    expect(attrs0["eve.task_id"].stringValue).toBe("t1");
    const attrs1 = keys(spans[1]);
    expect(attrs1["eve.status"].stringValue).toBe("http_error");
    expect(attrs1["eve.http_status"].doubleValue).toBe(502);
    expect(spans[1].status.code).toBe(2);
    // ids are hex of right length
    expect(spans[0].traceId).toMatch(/^[0-9a-f]{64}$/);
    expect(spans[0].spanId).toMatch(/^[0-9a-f]{16}$/);
  });

  it("flush drops spans after send and swallows network failures (fail-open)", async () => {
    process.env.LANGFUSE_PUBLIC_KEY = "pk-test";
    process.env.LANGFUSE_SECRET_KEY = "sk-test";
    let calls = 0;
    const tracer = createLangfuseTracer({
      fetchImpl: (async () => {
        calls++;
        throw new Error("network down");
      }) as typeof fetch,
    });
    tracer.record(baseTrace);
    await expect(tracer.flush()).resolves.toBeUndefined();
    expect(calls).toBe(1);
    // spans consumed even though send failed — no retry queue, fail-open
    let secondCalls = 0;
    tracer.record({ ...baseTrace, taskId: "t2" });
    await tracer.flush();
    void secondCalls;
    expect(calls).toBe(2);
  });
});
