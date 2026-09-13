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

### Verify the rollout

`pnpm smoke` exercises the minimum live surface — `/health`, session creation on
a dedicated `smoke-agent` key, and one trivial pi prompt — and exits non-zero on
failure, so bad rollouts are caught immediately:

```bash
ENDPOINT=https://<app>/api/rivet OPENROUTER_API_KEY=$OPENROUTER_API_KEY pnpm smoke
```

### Drive the VM

`examples/agentos-client` boots an actor (`vm/my-agent`), runs a pi prompt, and
reads back the file it wrote:

```bash
ENDPOINT=https://<app>/api/rivet OPENROUTER_API_KEY=$OPENROUTER_API_KEY \
  node --experimental-strip-types examples/agentos-client/client.ts
```

Contract notes (agentOS on rivetkit 2.3.10, per the
[agentOS docs](https://rivet.dev/agentos/docs)):

- The VM never inherits host `process.env` — model credentials are injected per
  session via the session `env`, and provider-named keys work
  (`OPENROUTER_API_KEY`, `ANTHROPIC_API_KEY`, …). Keep keys server-side: store
  them as deployment secrets in the Rivet dashboard and read them into `env` at
  session creation — never hardcode them.
- Sessions are durable and keyed by a client-supplied `sessionId` (defaults to
  `main`); after VM sleep the next `prompt` restores the session transparently.
- Sessions default to `permissionPolicy: allow_all` — pass `ask` in
  `openSession` when the caller is not fully trusted.
- The VM home is `/home/agentos` (the default session `cwd`).

## Swarm workers (ADR-001)

`src/swarm/` adds a durable agent swarm on the same registry:

- **TaskQueue** (Turso/libSQL): pull-based competing-consumer queue with
  atomic claims, heartbeat leases, and expired-lease reaping — no
  Redis/RabbitMQ.
- **SamEngine**: finite state machine `IDLE→RECALL→PLAN→EXECUTE→VERIFY→COMMIT`
  with bounded retries and an `ESCALATE` phase for human-in-the-loop.
- **swarmWorker actor**: claims tasks, runs SAM (OpenRouter planner, optional
  Weaviate recall, executor seam), and broadcasts `samTransition`,
  `sandboxStdout`, `workspaceStatus`, and `queueStatus` events for the
  dashboard/TUI.
- **Turso CoW branches**: `setupWorkspace` / `teardownWorkspace` fork an
  ephemeral database branch per worker with a branch-scoped token.
- **SwarmMetrics**: Prometheus metrics with strictly bounded labels — no
  session ids, prompts, or paths; those go to the audit log instead.

Configure via env: `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` (queue),
`OPENROUTER_API_KEY` (planner), `WEAVIATE_URL` / `WEAVIATE_API_KEY` (optional
memory), `TURSO_PLATFORM_API_TOKEN` / `TURSO_ORG_SLUG` (CoW branches). Apply
`src/swarm/schemas.sql` with `turso db shell <db> < schemas.sql`, or let the
migrator create the tables on first use.
