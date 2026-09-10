---
"@e2b/eve-sandbox": minor
---

Add a deployable RivetKit agentOS server (`src/server.ts`): an agentOS VM actor
(`vm`) with the `@agentos-software/common` CLI toolset and the `pi` coding
agent, a typed `createAgentOsRegistry()` factory, and re-exports of the
`agentOSCoreBackend` / `AgentOs` / `nodeModulesMount` API surface. Replaces the
stale `@rivet-dev/agent-os-common` / `@rivet-dev/agent-os-pi` deps (legacy
`commandDir` package descriptors the current runtime rejects) with
`@agentos-software/common` + `@agentos-software/pi`, and adds a Rivet Compute
Dockerfile target plus an `examples/agent` Eve-on-Rivet example (Rivet World +
agentOS, defaulting to the E2B sandbox backend).
