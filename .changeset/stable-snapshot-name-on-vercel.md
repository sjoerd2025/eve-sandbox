---
"@e2b/eve-sandbox": patch
---

Fix sandboxes failing to provision on Vercel deployments.

Eve's `templateKey` is `eve-sbx-tpl-<backend>-<scope>-<versionHash>`, where `scope` is derived from the app root — `hash(appRoot)`, or `hash("bundled")` for bundled artifacts — for every backend except Eve's own `vercel`, which short-circuits to a stable project-id scope. On Vercel that scope differs between the two lifecycle phases: `eve build` prewarms under `hash("/vercel/path0")`, while the serverless runtime looks the template up under `hash("bundled")`. The snapshot captured at build time was therefore unreachable at runtime, and every agent turn that touched the sandbox failed with `SandboxTemplateNotProvisionedError` — permanently, since Eve's re-prewarm retry only runs for disk-backed artifacts. Local `eve dev` was unaffected (both phases share one app root), so this only surfaced on deployed channels.

Snapshot names are now derived from the scope-stripped `templateKey`, making them purely content-addressed: `versionHash` already covers the Eve version, sandbox source, seed content, node id and source id, and the backend-identity hash still covers base image, envs and network policy. Template keys that don't match Eve's shape pass through unchanged.

Existing snapshots built under the old scoped names are orphaned, not migrated — the first build after upgrading captures a fresh one.
