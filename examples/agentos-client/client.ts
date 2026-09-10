import { createClient } from "rivetkit/client";
import type { registry } from "./server.js";

/**
 * Boots an agentOS VM instance (the `vm` actor, key "my-agent"), runs a pi
 * session prompt, and reads back the file the agent wrote.
 *
 * Model credentials come from the environment (never hardcoded):
 * - ANTHROPIC_BASE_URL  e.g. https://openrouter.ai/api (Anthropic-compatible)
 * - ANTHROPIC_AUTH_TOKEN  provider auth token
 * (ANTHROPIC_API_KEY works too if you have a native key.)
 *
 * Usage:
 *   node --experimental-strip-types client.ts          # local server
 *   ENDPOINT=https://<app>/api/rivet node client.ts    # deployed endpoint
 */
const client = createClient<typeof registry>(process.env.ENDPOINT);

// getOrCreate boots the agentOS instance on first call.
const agent = client.vm.getOrCreate(["my-agent"]);

// Stream session events (agent messages, tool calls, prompt lifecycle).
agent.on("sessionEvent", (data) => console.log(data.event));

const session = await agent.createSession("pi", {
  env: {
    ...(process.env.ANTHROPIC_API_KEY ? { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY } : {}),
    ...(process.env.ANTHROPIC_BASE_URL
      ? { ANTHROPIC_BASE_URL: process.env.ANTHROPIC_BASE_URL }
      : {}),
    ...(process.env.ANTHROPIC_AUTH_TOKEN
      ? { ANTHROPIC_AUTH_TOKEN: process.env.ANTHROPIC_AUTH_TOKEN }
      : {}),
  },
});

const prompt = process.argv[2] ?? "Write a hello world script to /home/user/hello.js";
const result = await agent.sendPrompt(session.sessionId, prompt);

const content = await agent.readFile("/home/user/hello.js");
console.log("--- /home/user/hello.js ---");
console.log(new TextDecoder().decode(content));
console.log("prompt result:", JSON.stringify(result));
