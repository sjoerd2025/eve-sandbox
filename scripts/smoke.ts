/**
 * Post-deploy smoke test: catches bad rollouts immediately by exercising the
 * minimum live surface of the agentOS `vm` actor.
 *
 * Steps:
 *   1. HTTP health      — GET `${ENDPOINT}/health` must return 2xx
 *   2. Session creation — openSession() boots/uses the `smoke-agent` VM
 *   3. One trivial prompt — pi must reply containing "OK"
 *
 * Usage:
 *   pnpm smoke                                       # local engine (default endpoint)
 *   ENDPOINT=https://<app>/api/rivet pnpm smoke      # deployed endpoint
 *   OPENROUTER_API_KEY=sk-or-... ENDPOINT=... pnpm smoke
 *
 * Env:
 *   ENDPOINT           client endpoint (default: http://127.0.0.1:6420;
 *                      deployed: https://<app>/api/rivet)
 *   SMOKE_TIMEOUT_MS   overall budget in ms (default: 180000)
 *   Model creds (at least one form required):
 *     OPENROUTER_API_KEY  |  ANTHROPIC_API_KEY  |  ANTHROPIC_BASE_URL + ANTHROPIC_AUTH_TOKEN
 *
 * Exits 0 on pass, 1 on any failure.
 */
import { randomUUID } from "node:crypto";
import { createClient } from "rivetkit/client";
import type { registry } from "../src/server.js";

const ENDPOINT = (process.env.ENDPOINT ?? "http://127.0.0.1:6420").replace(/\/+$/, "");
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS ?? 180_000);

// Hard overall budget so a hung rollout fails the check instead of hanging CI.
setTimeout(() => {
  console.error(`[smoke] ✗ overall timeout after ${TIMEOUT_MS}ms`);
  process.exit(1);
}, TIMEOUT_MS).unref();

async function step<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    console.log(`[smoke] ✓ ${name} (${Date.now() - start}ms)`);
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[smoke] ✗ ${name}: ${message}`);
    process.exit(1);
  }
}

const client = createClient<typeof registry>(ENDPOINT);

// 1. Health — fails fast (10s) when the rollout serves nothing (blanket 502 case).
await step("health", async () => {
  const res = await fetch(`${ENDPOINT}/health`, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`/health returned HTTP ${res.status}`);
});

// 2. Session creation — dedicated `smoke-agent` key keeps smoke traffic
//    isolated from the example's `my-agent` instance.
const sessionId = await step("session", async () => {
  const agent = client.vm.getOrCreate(["smoke-agent"]);
  const env = {
    ...(process.env.OPENROUTER_API_KEY
      ? { OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY }
      : {}),
    ...(process.env.ANTHROPIC_API_KEY ? { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY } : {}),
    ...(process.env.ANTHROPIC_BASE_URL
      ? { ANTHROPIC_BASE_URL: process.env.ANTHROPIC_BASE_URL }
      : {}),
    ...(process.env.ANTHROPIC_AUTH_TOKEN
      ? { ANTHROPIC_AUTH_TOKEN: process.env.ANTHROPIC_AUTH_TOKEN }
      : {}),
  };
  if (Object.keys(env).length === 0) {
    throw new Error(
      "no model credentials in environment (set OPENROUTER_API_KEY, or ANTHROPIC_API_KEY / ANTHROPIC_BASE_URL + ANTHROPIC_AUTH_TOKEN)",
    );
  }
  const id = randomUUID();
  await agent.openSession({ sessionId: id, agent: "pi", env });
  return id;
});

// 3. Trivial prompt — proves the full chain: actor → session → model round-trip.
const reply = await step("prompt", async () => {
  const agent = client.vm.getOrCreate(["smoke-agent"]);
  const result = await agent.prompt({
    sessionId,
    content: [{ type: "text", text: "Reply with exactly: OK" }],
  });
  const parts = (result?.message?.content ?? []) as Array<{ type: string; text?: string }>;
  const text = parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join(" ")
    .trim();
  if (!/\bOK\b/i.test(text)) {
    throw new Error(`pi did not confirm OK; replied: ${text.slice(0, 120) || "(empty)"}`);
  }
  return text;
});

console.log(`[smoke] PASSED — endpoint ${ENDPOINT}, pi replied "${reply}"`);
