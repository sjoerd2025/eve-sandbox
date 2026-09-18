# Task List: Rivet agentOS — Post-Deploy Verification & Hardening

Plan details: `tasks/plan.md`. Tasks tracked here (default target; no external tracker designated).

## Phase 0: Human gate

- [x] Task 0: User runs deploy with fresh cloud_api token (PORT + model creds as --env)
      — deploy ran; namespace reachable but 502s on all routes (see Task 1 blocker)

## Phase 1: Deployment verification

- [ ] Task 1: Namespace live — Run URL `/api/rivet/health` + `/metadata` return 200 (Deps: 0)
      **BLOCKED:** deployed image boots `src/dynamic-apps-host.ts`, which binds no listener under
      Compute-injected `RIVETKIT_RUNTIME_MODE=serverless` (review finding C1, reproduced locally —
      idle container = blanket upstream-error 502). C1 + the `/registry/*` prefix-strip are FIXED
      locally; type-check clean, tests 70/70. **Needs user redeploy with the same command.**

## Phase 2: End-to-end pi run (done locally; cloud pending Task 1)

- [x] Task 3 (local): real pi prompt e2e — `openSession` → `prompt` → `readFile` through the actor
      API. pi wrote `/home/agentos/hello.js` (`console.log('hello world')`), read back verbatim.
      Contract notes: client supplies sessionId; VM home is `/home/agentos`; OPENROUTER_API_KEY
      is the key form pi reads. Probe: `.freebuff/probe-vm.mjs`; example rewritten to match.
- [ ] Task 3 (cloud): same flow via `ENDPOINT=https://…/api/rivet` (Deps: 1)

## Phase 3: Hardening & docs

- [x] Task 4: `scripts/smoke.ts` — health → openSession (smoke-agent key) → trivial prompt; `pnpm smoke`. Verified green locally (health 8ms / session 4.6s / prompt 29s) and fails fast exit-1 on a dead endpoint. `scripts/` added to tsconfig include so it stays type-checked.
- [x] Task 5: README runbook added under "Run on Rivet (agentOS)": smoke usage, drive-the-VM example, credential-injection + secret-rotation guidance, permissionPolicy note — grounded in the agentOS docs (models-and-credentials, sessions, agents/pi).

## Checkpoint: Complete

- [ ] All acceptance criteria met, smoke green against production, docs current
