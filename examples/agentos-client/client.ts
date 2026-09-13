import { randomUUID } from "node:crypto";
import { createClient } from "rivetkit/client";
import type { registry } from "./server.js";

/**
 * Boots an agentOS VM instance (the `vm` actor, key "my-agent"), runs a pi
 * session prompt, and reads back the file the agent wrote.
 *
 * Action surface (rivetkit 2.3.10 agentOS actor):
 * - openSession({ sessionId, agent, env })  — client supplies the sessionId
 * - prompt({ sessionId, content: [{ type: "text", text }] })
 * - readFile(path) -> Uint8Array
 *
 * The VM's home directory is /home/agentos (not /home/user).
 *
 * Model credentials come from the environment (never hardcoded). pi reads:
 * - OPENROUTER_API_KEY      native OpenRouter key
 * - ANTHROPIC_API_KEY       or an Anthropic-compatible endpoint via
 * - ANTHROPIC_BASE_URL / ANTHROPIC_AUTH_TOKEN
 *
 * Usage:
 *   node --experimental-strip-types client.ts          # local engine
 *   ENDPOINT=https://<app>/api/rivet node client.ts    # deployed endpoint
 */
const client = createClient<typeof registry>(process.env.ENDPOINT ?? "http://127.0.0.1:6420");

// getOrCreate boots the agentOS instance on first call.
const agent = client.vm.getOrCreate(["my-agent"]);

const env = {
  ...(process.env.OPENROUTER_API_KEY ? { OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY } : {}),
  ...(process.env.ANTHROPIC_API_KEY ? { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY } : {}),
  ...(process.env.ANTHROPIC_BASE_URL ? { ANTHROPIC_BASE_URL: process.env.ANTHROPIC_BASE_URL } : {}),
  ...(process.env.ANTHROPIC_AUTH_TOKEN
    ? { ANTHROPIC_AUTH_TOKEN: process.env.ANTHROPIC_AUTH_TOKEN }
    : {}),
};

const sessionId = randomUUID();
await agent.openSession({ sessionId, agent: "pi", env });

const FILE = "/home/agentos/hello.js";
const prompt =
  process.argv[2] ?? `Create the file ${FILE} containing a hello-world script, then finish.`;
const result = await agent.prompt({ sessionId, content: [{ type: "text", text: prompt }] });

const content = await agent.readFile(FILE);
console.log(`--- ${FILE} ---`);
console.log(new TextDecoder().decode(content));
console.log("--- prompt result ---");
console.log(JSON.stringify(result));
