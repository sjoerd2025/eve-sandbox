import { createAgent } from "@flue/runtime";
import { agentOSSandbox } from "@rivet-dev/agentos-flue";
import { registry } from "../server.js";

// Fleet pattern (flipt-io/agents): the agent's behavior is assembled from
// registered pieces instead of one inline string.
//
// - skills/sandboxed-task/SKILL.md — the registered skill: how a task is
//   executed in the sandbox and what structured result to return.
// - prompts/swarm.md — the runtime prompt file, loaded as base instructions.
// - personas/ — delegateable subagent profiles (security, correctness) the
//   agent hands focused deep-dives to via session.task(_, { agent }).
import swarmPrompt from "./prompts/swarm.md" with { type: "markdown" };
import sandboxedTask from "./skills/sandboxed-task/SKILL.md" with { type: "skill" };
import { personas } from "./personas/index.js";

/**
 * The swarm coding agent. Every conversation context runs inside its own
 * agentOS `vm` actor — an isolated virtual Linux with a persistent
 * /workspace — so commands are always sandboxed, never on the host (ADR-001
 * zero-trust isolation). pi-ai ships an OpenRouter provider natively, so
 * `openrouter/<model>` resolves against the OPENROUTER_API_KEY.
 */
export default createAgent(() => ({
	model: `openrouter/${process.env.SWARM_MODEL ?? "anthropic/claude-sonnet-4.5"}`,
	instructions: swarmPrompt,
	skills: [sandboxedTask],
	subagents: personas,
	// Task execution is a bounded, well-specified job — the skill spells out
	// exactly what to do — so "low" keeps the model decisive instead of
	// deliberating. Non-reasoning models ignore it.
	thinkingLevel: "low",
	sandbox: agentOSSandbox({ actor: "vm", registry }),
}));
