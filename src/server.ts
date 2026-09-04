import { agentOS, setup } from "@rivet-dev/agentos";

const vm = agentOS();

export const registry: any = setup({
	use: { vm },
});

registry.start();
