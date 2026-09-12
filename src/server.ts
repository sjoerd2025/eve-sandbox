import { agentOS, setup, type Registry } from "@rivet-dev/agentos";
import common from "@agentos-software/common";
import pi from "@agentos-software/pi";
import { swarmWorker } from "./swarm/actor";

/**
 * The agentOS VM actor: one isolated virtual Linux per actor key, with durable
 * `/workspace` persistence, the standard CLI toolset (`@agentos-software/common`:
 * sh, coreutils, sed, grep, gawk, findutils, diffutils, tar, gzip) and the `pi`
 * coding agent available as a session agent (`sessions.open({ agent: "pi" })`).
 *
 * Software entries are agentOS package references (`{ packagePath }` pointing at
 * the packed `.aospkg` shipped inside each `@agentos-software/*` package) — the
 * sidecar projects them into the VM's `/opt/agentos` at boot.
 *
 * Everything else (models & credentials, permissions, mounts, cron) is
 * configured by the client when it opens a session — see
 * https://rivet.dev/agentos/docs.
 */
export const vm: AgentOsActorDefinition = agentOS({
  software: [common, pi],
});

/** The `vm` actor's definition type, without serializing the full inferred type. */
export type AgentOsActorDefinition = ReturnType<typeof agentOS>;

/**
 * Build the application registry. Exported as a factory so tests (and
 * embedders) can construct a registry without side effects; the default
 * `registry` below is what the entrypoint and `agentOSBackend()` consumers use.
 */
export function createAgentOsRegistry(): Registry<{
  vm: typeof vm;
  swarmWorker: typeof swarmWorker;
}> {
  return setup({ use: { vm, swarmWorker } });
}

/**
 * The application registry. `agentOSBackend({ actor: "vm", registry })` (from
 * `@rivet-dev/agentos-eve`, re-exported by this package) points Eve at this
 * actor, mapping every Eve sandbox session onto a `vm` actor instance.
 */
export const registry: Registry<{ vm: typeof vm; swarmWorker: typeof swarmWorker }> =
  createAgentOsRegistry();

// Only auto-start when run directly as the entrypoint (dist/server.js), not
// when imported by tests or `agentOSBackend()` consumers that own the
// registry lifecycle themselves.
const entry = process.argv[1]?.replace(/\\/g, "/");
if (
  entry?.endsWith("server.js") ||
  entry?.endsWith("server.ts") ||
  process.env.RIVETKIT_AUTO_START === "1"
) {
  // Serverless mode is automatic on Rivet Compute (it sets
  // RIVETKIT_RUNTIME_MODE=serverless): start() binds an HTTP listener on
  // $RIVET_PORT (default 3000) instead of opening a long-lived engine
  // connection. Locally it runs in engine mode via `npx rivetkit dev`.
  registry.start();
}
