import { randomUUID } from "node:crypto";

/**
 * Minimal fail-open Langfuse tracer for the SAM planner. One OTel span per
 * LLM call, posted to Langfuse's OTel endpoint
 * (https://langfuse.com/docs/opentelemetry/get-started). Disabled entirely
 * without LANGFUSE_PUBLIC_KEY/SECRET_KEY; any export error is swallowed —
 * tracing must never break a SAM cycle.
 */

const OTEL_PATH = "/api/public/otel/v1/traces";

export interface PlannerTrace {
  taskId: string;
  model: string;
  prompt: string;
  status: "ok" | "http_error" | "request_failed";
  httpStatus?: number;
  actionType?: string;
  durationMs: number;
  usage?: { promptTokens: number; completionTokens: number };
}

export interface LangfuseTracer {
  record(trace: PlannerTrace): void;
  /** Flush pending spans (fire-and-forget await at cycle end). */
  flush(): Promise<void>;
}

/** 128-bit hex trace id / 64-bit hex span id (W3C trace context). */
function newIds(): { traceId: string; spanId: string } {
  return {
    traceId: randomUUID().replaceAll("-", "") + randomUUID().replaceAll("-", ""),
    spanId: randomUUID().replaceAll("-", "").slice(0, 16),
  };
}

function attr(key: string, value: string | number | boolean) {
  if (typeof value === "string") return { key, value: { stringValue: value } };
  if (typeof value === "number") return { key, value: { doubleValue: value } };
  return { key, value: { boolValue: value } };
}

export function createLangfuseTracer(
  config: {
    baseUrl?: string;
    publicKey?: string;
    secretKey?: string;
    fetchImpl?: typeof fetch;
  } = {},
): LangfuseTracer {
  const baseUrl = (
    config.baseUrl ??
    process.env.LANGFUSE_BASE_URL ??
    "https://cloud.langfuse.com"
  ).replace(/\/$/, "");
  const publicKey = config.publicKey ?? process.env.LANGFUSE_PUBLIC_KEY;
  const secretKey = config.secretKey ?? process.env.LANGFUSE_SECRET_KEY;
  const doFetch = config.fetchImpl ?? fetch;

  // Disabled without credentials; record() becomes a no-op.
  const auth =
    publicKey && secretKey
      ? `Basic ${Buffer.from(`${publicKey}:${secretKey}`).toString("base64")}`
      : null;
  const pending: Array<Record<string, unknown>> = [];

  return {
    record(trace: PlannerTrace) {
      if (!auth) return;
      const { traceId, spanId } = newIds();
      const nowNs = BigInt(Date.now()) * 1_000_000n;
      const attributes = [
        attr("gen_ai.system", "openrouter"),
        attr("gen_ai.request.model", trace.model),
        attr("gen_ai.prompt", trace.prompt.slice(0, 4_000)),
        attr("gen_ai.completion", trace.actionType ?? trace.status),
        attr("eve.task_id", trace.taskId),
        attr("eve.status", trace.status),
        ...(trace.httpStatus !== undefined ? [attr("eve.http_status", trace.httpStatus)] : []),
        ...(trace.usage
          ? [
              attr("gen_ai.usage.prompt_tokens", trace.usage.promptTokens),
              attr("gen_ai.usage.completion_tokens", trace.usage.completionTokens),
            ]
          : []),
      ];
      pending.push({
        traceId,
        spanId,
        name: `sam.planner ${trace.model}`,
        kind: 1, // CLIENT
        startTimeUnixNano: (nowNs - BigInt(Math.round(trace.durationMs)) * 1_000_000n).toString(),
        endTimeUnixNano: nowNs.toString(),
        attributes,
        status: trace.status === "ok" ? { code: 1 } : { code: 2, message: trace.status },
      });
    },

    async flush() {
      if (!auth || pending.length === 0) return;
      const spans = pending.splice(0, pending.length);
      try {
        await doFetch(`${baseUrl}${OTEL_PATH}`, {
          method: "POST",
          headers: { Authorization: auth, "Content-Type": "application/json" },
          body: JSON.stringify({
            resourceSpans: [
              {
                resource: { attributes: [attr("service.name", "eve-sandbox")] },
                scopeSpans: [{ scope: { name: "eve-sam-planner" }, spans }],
              },
            ],
          }),
          signal: AbortSignal.timeout(10_000),
        });
      } catch {
        // fail-open: dropped spans must not break the swarm
      }
    },
  };
}
