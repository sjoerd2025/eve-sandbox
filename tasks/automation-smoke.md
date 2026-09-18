# Automation draft: post-deploy smoke verification

Defines the recurring chore "verify the agentOS deployment is alive." Two usable
transports — pick one when the parked decision (tasks/plan.md → Open Questions)
is made. The prompt body is transport-independent; edit here, not in the
scheduler, when the rules evolve.

## What "done" looks like

`pnpm smoke` against the deployed endpoint exits 0 (health → session on the
`smoke-agent` key → one trivial pi prompt). Anything else is a failed
verification.

## The prompt (agent with zero context)

```text
You are verifying that the Rivet agentOS deployment is healthy after a rollout.

1. Work in the repository checkout at the path given to you. Do not modify any
   files; this is a read-only verification task.
2. Get the model credential from the environment: OPENROUTER_API_KEY
   (or ANTHROPIC_API_KEY / ANTHROPIC_BASE_URL + ANTHROPIC_AUTH_TOKEN). Never
   print, log, or hardcode it.
3. Run: ENDPOINT=<deployed-url>/api/rivet pnpm smoke
   (<deployed-url> is provided by the scheduler / CI env, e.g.
   https://beta-g2ly-production-kxh0.rivet.run)
4. On exit 0: report "smoke PASSED (<endpoint>)" and stop.
5. On failure: report the exact failing step (health / session / prompt), the
   error line from the output, and the deployment's last-deploy timestamp if
   available. Do not retry more than once; do not attempt a redeploy.
6. Never widen scope: no code changes, no deploys, no issue updates. Report
   only.
```

## Rules that evolve (keep out of the prompt, edit here)

- The `smoke-agent` actor key is smoke-only — never point the automation at
  `my-agent` or any real session.
- Each run costs one trivial pi prompt (~pennies). If cost becomes a concern,
  gate the prompt step behind `SMOKE_SKIP_PROMPT=1` support instead of
  weakening the assertion.
- Credential rotation: rotate the OpenRouter key in the scheduler/CI secret
  store, never in this file.

## Transport A: CI job (available today)

GitHub Actions on `deployment_status.success` (or after a deploy workflow):
checkout → setup-node 22 + pnpm → run the prompt's step 3 with the secret
mapped from the repo secret store. Exit code is the signal; failure pins the
bad rollout in CI logs.

## Transport B: Superset automation (when the CLI is installed)

```bash
superset automations create \
  --name "agentOS post-deploy smoke" \
  --rrule "FREQ=HOURLY;BYMINUTE=5" \
  --timezone America/Los_Angeles \
  --project <project-id> \
  --agent claude \
  --prompt-file tasks/automation-smoke.md   # extract the prompt block first
```

Then `superset automations run <id>`, review logs together, and refine until
one real run looks good. Hourly cadence is a placeholder — confirm the real
cadence (per-deploy vs hourly) when deciding between transports.
