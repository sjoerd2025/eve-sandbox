import type { SamMemoryHooks } from "./sam";

export interface WeaviateMemoryConfig {
  /** e.g. http://localhost:8080 (Docker) or a WCS cloud URL. */
  url: string;
  apiKey?: string;
  /** Collection name; default AgentMemory (ADR-001 §4). */
  collection?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

interface WeaviateGraphQlResponse {
  data?: {
    Get?: Record<string, Array<Record<string, unknown>>>;
  };
  errors?: Array<{ message: string }>;
}

/**
 * Semantic memory hooks over Weaviate's REST + GraphQL API (ADR-001 §4):
 * hybrid (vector + BM25) recall injected into the planner's context, and
 * best-effort persist of completed session outcomes. Every failure degrades to
 * "no memory" — a memory outage must never kill a task run.
 */
export function createWeaviateMemory(config: WeaviateMemoryConfig): SamMemoryHooks {
  const collection = config.collection ?? "AgentMemory";
  const doFetch = config.fetchImpl ?? fetch;
  const timeoutMs = config.timeoutMs ?? 10_000;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (config.apiKey) headers.Authorization = `Bearer ${config.apiKey}`;

  async function gql(query: string): Promise<WeaviateGraphQlResponse | null> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await doFetch(`${config.url.replace(/\/$/, "")}/v1/graphql`, {
        method: "POST",
        headers,
        body: JSON.stringify({ query }),
        signal: controller.signal,
      });
      if (!res.ok) return null;
      return (await res.json()) as WeaviateGraphQlResponse;
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    async recall(prompt) {
      const safePrompt = prompt.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      const query = `{
        Get {
          ${collection}(
            hybrid: { query: "${safePrompt}", alpha: 0.5 }
            limit: 3
          ) {
            text
            _additional { id distance }
          }
        }
      }`;
      const body = await gql(query);
      const rows = body?.data?.Get?.[collection] ?? [];
      return rows.map((r) => ({
        id: String((r._additional as { id?: string } | undefined)?.id ?? ""),
        text: String(r.text ?? ""),
        score: Number((r._additional as { distance?: number } | undefined)?.distance ?? 0),
      }));
    },

    async persist({ prompt, summary, success, artifacts }) {
      // Best-effort insert; ignores validation/failure (index-only sink per
      // ADR-001 negative consequences: Turso is the source of truth).
      const url = `${config.url.replace(/\/$/, "")}/v1/objects`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        await doFetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({
            class: collection,
            properties: { prompt, summary, success, artifacts },
          }),
          signal: controller.signal,
        });
      } catch {
        // swallow — index-only sink
      } finally {
        clearTimeout(timer);
      }
    },
  };
}
