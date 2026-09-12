# Review priorities for this repo (layered over the flipt-io/agents central
# code-review defaults; local wins on conflict).

## Repo layout
- `src/` — TypeScript (RivetKit actors, swarm, E2B sandboxing). Unit tests are
  `*.test.ts` colocated in `src/` and `test/`; run with `pnpm test` (vitest).
  Type-check with `pnpm exec tsc --noEmit`; build with `pnpm run build` (tsup).
- `bridge/` — Go (Encore service: GitHub ⇄ Turso queue sync). Check with
  `go vet ./...` and `go test ./...` from inside `bridge/`.
- `public/dashboard.html` + `src/dashboard.ts` — the live swarm dashboard.

## Hard rules
- Secrets only via environment variables. Never commit API keys or tokens
  (`.env` is gitignored); a hardcoded credential is an automatic request-change.
- Version pin: this stack runs rivetkit exactly 2.3.10 (pinned by
  `@rivet-dev/agentos@0.2.19`). Do not bump rivetkit in isolation.
- Turso queue statuses are bounded to `PENDING | LEASED | COMPLETED | FAILED`
  (ADR-001); flag any new ad-hoc state strings.
- Prefer the smallest correct change. Flag speculative abstractions,
  single-caller helpers, and options nothing selects.

## Swarm-produced PRs
Many PRs here are opened by the swarm itself. For those, pay extra attention to:
- The diff staying inside the task's stated scope (no drive-by refactors).
- Executor/sandbox code paths: resource cleanup (unmount, kill, timeout) and
  bounded retries — a leaked container or unbounded loop is a blocker.
- New surfaces needing a test: anything touching `src/swarm/queue.ts`,
  `src/swarm/sam.ts`, or `bridge/swarm/` should come with coverage.
