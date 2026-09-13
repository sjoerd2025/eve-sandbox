# Implementation Plan: Rivet agentOS — Post-Deploy Verification & Hardening

## Overview

The agentOS integration is built and verified locally (vm actor with pi + common software, 59/59 tests, Docker health check). The deployment to namespace `beta-g2ly-production-kxh0` is pending the user running the deploy command with a fresh `cloud_api_*` token (both previous tokens are dead; all automated deploy paths were exhausted — see Risks). This plan covers what happens after that deploy lands: verify the namespace, prove the vm actor end-to-end with a real pi prompt, then harden with a reusable smoke test and docs.

## Architecture Decisions

- **Verify through the public surface, not internal tooling:** health via `https://beta-g2ly-production-kxh0.rivet.run/api/rivet/health`, actor ops via the Rivet Engine HTTP API / gateway with the provided `pk_` token. This is exactly what any real client would do.
- **Drive the e2e run through the existing `examples/agentos-client/client.ts`** with `ENDPOINT=https://beta-g2ly-production-kxh0.rivet.run/api/rivet` and model creds from env — no new code for the e2e proof itself; it validates the exact path a user would take.
- **Model credentials stay env-only:** `ANTHROPIC_BASE_URL` / `ANTHROPIC_AUTH_TOKEN` never enter the repo or committed files (they were passed as deployment `--env` at deploy time; the pi agent reads them from the pool environment).
- **Smoke test is a standalone script** (`scripts/smoke.ts`), not a vitest suite, because it targets a live deployed endpoint and must be runnable locally and from CI without test-runner coupling.

## Task List

### Phase 0: Human gate (in flight)

- [ ] Task 0: User runs the deploy command with a fresh Cloud API token (PORT=3000 + model creds as `--env`). No agent work — blocked on the user.

### Phase 1: Deployment verification

- [ ] Task 1: Confirm the namespace is live (S)
  - Poll `GET /api/rivet/health` on the Run URL until 200 (max ~5 min after deploy exits).
  - Acceptance: health returns 200; `/api/rivet/metadata` returns 200.
  - Verification: curl checks above. Files: none (terminal only). Deps: Task 0.

- [ ] Task 2: Boot and health-check a `vm` actor (S)
  - Create actor `{"name":"vm","key":"my-agent"}` via Engine API (`crash_policy: restart`), then poll `gateway/<ACTOR_ID>/health` until ok.
  - Acceptance: gateway health prints ok with 200. Note: the `pk_` token was denied for actor _listing_; _creation_ may be allowed — try it, fall back to the Rivet dashboard/inspector if the API refuses.
  - Files: none. Deps: Task 1.

### Checkpoint: Deployment live

- [ ] Health + metadata 200, vm actor healthy via gateway. Review before e2e spend (each pi prompt costs tokens).

### Phase 2: End-to-end pi run

- [ ] Task 3: Drive a real prompt through the deployed vm (S)
  - Run `examples/agentos-client/client.ts` with `ENDPOINT=<run-url>/api/rivet`, `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN` from env.
  - Acceptance: session events stream; `readFile` returns the hello-world script pi wrote to `/home/user/hello.js`.
  - Verification: manual run output. Files: none. Deps: Task 2.

### Checkpoint: E2E proven

- [ ] A real LLM-driven prompt executed on deployed Compute and the artifact read back.

### Phase 3: Hardening & docs

- [ ] Task 4: Add `scripts/smoke.ts` deploy smoke test (M)
  - Checks: health 200 → getOrCreate vm → createSession("pi") with env creds → trivial prompt → readFile asserts content.
  - Acceptance: exits 0 against a healthy deployment, non-zero with a clear failure message otherwise; honors `ENDPOINT` env; no creds hardcoded.
  - Verification: `pnpm type-check` passes; manual run against the live deployment. Files: `scripts/smoke.ts`, `package.json` (add `smoke` script), `README.md` (usage). Deps: Task 3.

- [ ] Task 5: Update docs with deployed-state runbook (S)
  - README "Run on Rivet (agentOS)" section: current deploy URL, smoke-test usage, how to rotate model creds as dashboard secrets instead of `--env`.
  - Acceptance: a new engineer can verify the deployment from the README alone. Files: `README.md`. Deps: Task 4 (or parallel).

### Checkpoint: Complete

- [ ] All acceptance criteria met; smoke test green against production; docs current.

## Risks and Mitigations

| Risk                                                               | Impact                         | Mitigation                                                                                                                        |
| ------------------------------------------------------------------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `pk_` token lacks actor-create permission (listing already denied) | Medium — can't boot vm via API | Try create first; fall back to Rivet dashboard/inspector; worst case drive actor via first client call (getOrCreate auto-creates) |
| Pool rollout transiently fails ("Failed to start container")       | Medium — 502 persists          | Known-good image; re-run deploy command; diagnose via `npx @rivetkit/cli logs --namespace beta-g2ly-production-kxh0`              |
| OpenRouter key sits in shell history / chat                        | Medium — credential exposure   | Recommend rotating the key after deploy and storing it as a dashboard deployment secret                                           |
| pi agent needs more env than BASE_URL+AUTH_TOKEN (beta)            | Low — session errors           | Inspect sessionEvent error payload; adjust `--env` set and redeploy                                                               |
| Smoke test costs tokens on every run                               | Low                            | Trivial single prompt; document that it's a paid call                                                                             |

## Open Questions

- Should the smoke test run in CI on every deploy (needs a repo secret for the OpenRouter key), or stay manual? (Assumed manual until decided.)

## Future Direction: LLM observability via traces (evaluated 2026-09-13, Langfuse skill)

The brainstorm's "per-cycle cost/quality telemetry" gap is half-solved: planner usage already
flows into Prometheus via `planner.lastUsage` → `addLlmTokens` (src/swarm/actor.ts:291-292) —
nothing new needed for token-rate monitoring. What's genuinely missing is **per-task traces**
(plan JSON, pi tool-call outcomes, durations, cost) in one queryable place, plus the never-tracked
third LLM surface: pi inside the VMs (its usage vanishes into the VM). If/when a vendor is wanted,
Langfuse is the natural fit (traces + scores for VERIFY outcomes + prompt management);
scoping: OTel-compatible, would slot next to the existing prom-client setup. Requires a
Langfuse account + project keys (user-gated, env-only). Tracked here, not todo.md.

## Future Direction: Rivet Workflows as the SAM orchestrator (evaluated 2026-09-13)

The brainstorm's consolidation finding (three execution paths, two credential stories) points at
Rivet Workflows (`@rivet-dev/workflows`) as the native replacement for the Hatchet+Turso loop:
the durable `ctx.loop` + `queue.next` shape maps 1:1 onto dispatch-next-task → sam-loop
(`Patterns` → Loops; `Quickstart` → Setup & teardown), progress would live in actor `state` with
`broadcast` — fixing the dashboard-zeros problem (Hatchet cycles currently bypass the swarmWorker
event stream) — and `onError` hooks + rollback checkpoints would give the GitHub bridge a
guarded, compensating close path. Blocked today: `@rivet-dev/workflows@1.0.0` peers
`rivetkit >=2.3.11 <2.4.0`, but the repo pins rivetkit to exactly 2.3.10 (agentOS 0.2.19 compat
override). Note (rivetkit skill version-check, 2026-09-13): registry latest is 2.3.17, which
SATISFIES that peer range — so the single unblock is validating that agentOS 0.2.19 tolerates
rivetkit 2.3.11+ (ideally 2.3.17): install, run the full suite + local agentOS e2e probe, and if
green, lift the override and adopt workflows. Caution: agentOS 0.2.19 hard-pins
`rivetkit: 2.3.10` in its own dependencies (no peer range), i.e. upstream built it against
exactly 2.3.10 — treat the lift as a real compatibility experiment, not a formality (the action
surface already changed across these versions: flat `openSession`/`prompt` on 2.3.10 vs grouped
`sessions.open` in current docs). Migration itself is a standalone task (L), tracked here not in
todo.md.
