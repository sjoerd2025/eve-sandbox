import { agentOS, setup } from "@rivet-dev/agentos";
import { vercelWorldActors } from "@rivet-dev/vercel-world/registry";
import common from "@agentos-software/common";
import pi from "@agentos-software/pi";

/**
 * The agentOS VM actor. Eve's `agentOSBackend` maps every sandbox session onto
 * an instance of this actor (durable /workspace, standard CLI tools, pi agent).
 */
const vm = agentOS({
  software: [common, pi],
});

export const registry = setup({
  use: { ...vercelWorldActors, vm },
});
