# @e2b/eve-sandbox

_Experimental._ An [E2B](https://e2b.dev) sandbox backend for Vercel's
[Eve](https://vercel.com/docs/eve) agent framework — the E2B counterpart to
Eve's built-in `vercel()` / `docker()` / `microsandbox()` / `justbash()`
backends. It implements the public `SandboxBackend` interface from `eve/sandbox`,
so no changes to Eve itself are required.

## Install

```bash
npm i @e2b/eve-sandbox e2b
# eve and ai are peer deps provided by your Eve project
```

Set `E2B_API_KEY` (or pass `apiKey` in options).

## Usage

```ts
// agent/sandbox.ts
import { defineSandbox } from "eve/sandbox";
import { e2b } from "@e2b/eve-sandbox";

export default defineSandbox({
  backend: () => e2b({ template: "base" }),
});
```

For one-time setup (installing packages, seeding files), add Eve's optional
`bootstrap` hook or `agent/sandbox/workspace/` seed files — this package bakes
them into a reusable snapshot at build time.

## Testing

```bash
pnpm test          # unit tests (no credentials needed)
pnpm type-check
```

The unit suite covers the network-policy mapping, snapshot naming/dedup, the
`buildSandboxSession` replica, the background-process adapter, and the bundled
RivetKit agentOS server. A live integration test in `test/` boots a real E2B
sandbox and **auto-skips unless `E2B_API_KEY` is set**:

```bash
E2B_API_KEY=... pnpm test   # also runs the live sandbox round-trip
```

## Run on Rivet (agentOS)

This package ships a ready-to-deploy [RivetKit](https://rivet.dev) server
(`src/server.ts`) that hosts an **agentOS VM actor** — one isolated virtual
Linux per actor key with a durable `/workspace`, standard CLI tools, and the
`pi` coding agent (`@agentos-software/pi`). It is the server-side counterpart
to the E2B backend:

- The server runs locally with `npx rivetkit dev`, or deploys to
  [Rivet Compute](https://rivet.dev/docs/deploy/rivet-compute) (serverless mode
  is automatic; `registry.start()` binds `$RIVET_PORT`, default 3000).
- Eve projects can point their sandbox at it via
  `agentOSBackend({ actor: "vm", registry })` (see `examples/agent`), or use
  the default `e2b()` backend and let Rivet handle orchestration + workflow
  durability (Rivet World).
- Drive the VM from any client (`@rivet-dev/agentos/client`) or watch it live
  in the actor inspector at `<deployment-url>/ui`.

Deploy to your Rivet namespace:

```bash
pnpm build
npx @rivetkit/cli deploy --token $RIVET_CLOUD_TOKEN \
  --namespace <your-namespace> --env PORT=3000 --yes
```

Then verify `https://<app>/api/rivet/health` returns 200 and create a `vm`
actor (`{"name":"vm","key":"my-agent","crash_policy":"restart"}`) via the
Engine API or the inspector.
