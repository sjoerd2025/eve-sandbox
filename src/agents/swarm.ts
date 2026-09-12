import { createAgent } from "@flue/runtime";
import { agentOSSandbox } from "@rivet-dev/agentos-flue";
import { registry } from "../server.js";

/**
 * The swarm coding agent. Every conversation context runs inside its own
 * agentOS `vm` actor — an isolated virtual Linux with a persistent
 * /workspace — so commands are always sandboxed, never on the host (ADR-001
 * zero-trust isolation). pi-ai ships an OpenRouter provider natively, so
 * `openrouter/<model>` resolves against the OPENROUTER_API_KEY.
 */
export default createAgent(() => ({
	model: `openrouter/${process.env.SWARM_MODEL ?? "anthropic/claude-sonnet-4.5"}`,
	instructions:
		"You are a sandboxed coding agent working in /workspace. " +
		"Use the filesystem and shell tools to complete the task, then report what you did.",
	sandbox: agentOSSandbox({ actor: "vm", registry }),
}));
