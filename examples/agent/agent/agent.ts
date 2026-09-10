import { defineAgent } from "eve";

export default defineAgent({
  model: "anthropic/claude-sonnet-5",
  build: {
    // agentOS + Rivet World packages must be resolvable inside the sandbox.
    externalDependencies: [
      "@rivet-dev/agentos",
      "@rivet-dev/agentos-core",
      "@rivet-dev/agentos-eve",
      "@rivet-dev/agentos-runtime-core",
      "@rivet-dev/agentos-sidecar",
      "@rivet-dev/vercel-world",
      "@rivetkit/engine-cli",
    ],
  },
  experimental: {
    workflow: { world: "#world" },
  },
});
