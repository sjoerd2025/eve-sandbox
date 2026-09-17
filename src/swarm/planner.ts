import type { SamAction, SamPlanner } from "./sam";

const SYSTEM_PROMPT = `You are the planner of a sandboxed coding agent.
Reply with ONE JSON object and nothing else:
{"action":"run_command","command":"<single shell command>"} to act,
or {"action":"finish","summary":"<what was accomplished>"} when done.
Never request more than one command. Prefer short, safe, reversible commands.`;

export interface OpenRouterPlanParams {
  model?: string;
  /** OpenRouter API key. Falls back to OPENROUTER_API_KEY. */
  apiKey?: string;
  fetchImpl?: typeof fetch;
}

/** OpenRouter response shape (only the fields we consume). */
interface ChatResponse {
  choices?: Array<{ message?: { content?: string } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number };
}

/**
 * SAM planner over OpenRouter (ADR-001 §3). One model call per SAM cycle,
 * parsed as JSON with a strict fallback: unparseable output finishes the run
 * with the raw text instead of throwing — provider flakiness must not burn a
 * task's retry budget.
 */
export function createOpenRouterPlanner(
  params: OpenRouterPlanParams = {},
): SamPlanner & { lastUsage: { promptTokens: number; completionTokens: number } | null } {
  const apiKey = params.apiKey ?? process.env.OPENROUTER_API_KEY;
  const model = params.model ?? "anthropic/claude-sonnet-4.5";
  const doFetch = params.fetchImpl ?? fetch;
  const state = { lastUsage: null as { promptTokens: number; completionTokens: number } | null };

  return {
    get lastUsage() {
      return state.lastUsage;
    },
    async plan({ prompt, history, recall }) {
      const historyText = history
        .map(
          (s) =>
            `[${s.seq}] $ ${s.action.type === "run_command" ? s.action.command : "(finish)"} -> exit ${s.exitCode}\n${s.stdout.slice(0, 400)}${s.stderr ? `\nERR: ${s.stderr.slice(0, 200)}` : ""}`,
        )
        .join("\n");
      const memoryText = recall.map((r) => `- ${r.text}`).join("\n");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60_000);
      try {
        const res = await doFetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey ?? ""}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              {
                role: "user",
                content: `Task: ${prompt}\n\nPast relevant outcomes:\n${memoryText || "(none)"}\n\nSo far:\n${historyText || "(none)"}`,
              },
            ],
            max_tokens: 512,
          }),
          signal: controller.signal,
        });
        if (!res.ok) {
          state.lastUsage = null;
          return { type: "finish", summary: `planner HTTP ${res.status}` } as SamAction;
        }
        const body = (await res.json()) as ChatResponse;
        state.lastUsage = {
          promptTokens: body.usage?.prompt_tokens ?? 0,
          completionTokens: body.usage?.completion_tokens ?? 0,
        };
        return parsePlanAction(body.choices?.[0]?.message?.content ?? "");
      } catch {
        state.lastUsage = null;
        return { type: "finish", summary: "planner request failed" } as SamAction;
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}

/** Parse model output into a {@link SamAction}, defaulting to finish. */
export function parsePlanAction(content: string): SamAction {
  const fallback = { type: "finish", summary: content || "(empty planner output)" } as SamAction;
  for (const candidate of jsonCandidates(content)) {
    try {
      const parsed = JSON.parse(candidate) as {
        action?: string;
        command?: string;
        summary?: string;
      };
      if (parsed.action === "run_command" && parsed.command?.trim()) {
        return { type: "run_command", command: parsed.command };
      }
      if (parsed.action === "finish") {
        return { type: "finish", summary: parsed.summary ?? content };
      }
    } catch {
      // try the next candidate
    }
  }
  return fallback;
}

/**
 * JSON substrings to try, in order: the whole text (bare JSON), then fenced
 * code blocks (models commonly wrap the action in prose + ```json), then the
 * outermost brace span. First parseable object wins.
 */
function* jsonCandidates(content: string): Generator<string> {
  const trimmed = content.trim();
  if (trimmed) yield trimmed;
  const fence = /```(?:json)?\s*([\s\S]*?)```/g;
  for (const match of trimmed.matchAll(fence)) {
    const block = match[1]?.trim() ?? "";
    if (block) yield block;
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end > start) yield trimmed.slice(start, end + 1);
}
