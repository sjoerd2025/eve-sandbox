/**
 * Subagent personas for the swarm agent, following the flipt-io/agents fleet
 * pattern: each persona is a focused `defineAgentProfile` the main agent can
 * delegate to with `session.task(work, { agent: "<name>" })`. Add one: create
 * a module here exporting a profile, then add it to `personas`.
 */
import { correctness } from "./correctness.js";
import { security } from "./security.js";

export const personas = [correctness, security];
