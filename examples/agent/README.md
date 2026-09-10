# Example: Eve agent on Rivet (agentOS + Rivet World)

A minimal [Vercel Eve](https://vercel.com/eve) agent that runs with Rivet:

- **Rivet World** (`world.ts` + `@rivet-dev/vercel-world`) runs Eve workflows on
  Rivet Actors, so runs resume instead of restarting.
- **agentOS VM actor** (`actors.ts`) provides a durable Linux VM actor; if you
  switch the sandbox backend, Eve maps every sandbox session onto it.
- **Sandbox backend** (`agent/sandbox.ts`) defaults to
  [`@e2b/eve-sandbox`](https://github.com/e2b-dev/eve-sandbox) — E2B sandboxes
  with snapshot-backed prewarm and a domain-level network firewall — with a
  one-line switch to Rivet-native `agentOSBackend()`.

## Run

```bash
# from this directory
npm install

# link Eve once so it can call your configured model
npm install --global vercel@latest
npx eve link

# run the agent locally
npx eve dev
```

## Switch sandboxes from E2B to Rivet agentOS VMs

Edit `agent/sandbox.ts` and swap the default export for the commented
`agentOSBackend({ actor: "vm", registry })` block. Trade-offs:

|                                      | E2B (`e2b()`)         | Rivet agentOS (`agentOSBackend()`) |
| ------------------------------------ | --------------------- | ---------------------------------- |
| Durable filesystem across runs       | snapshots (opt-in)    | always (`/workspace` persisted)    |
| Network firewall (domain allow-list) | yes (`networkPolicy`) | via agentOS permissions            |
| Extra account/keys                   | `E2B_API_KEY`         | none (same Rivet deployment)       |
| Snapshot-backed build prewarm        | yes                   | no (VM boots on demand)            |

## Deploy

Deploy the host server (Rivet World + agentOS actors) to Rivet Compute with
`npx @rivetkit/cli deploy` — see the root README's
[Run on Rivet (agentOS)](../../README.md#run-on-rivet-agentos) section and
https://rivet.dev/docs/deploy/rivet-compute.
