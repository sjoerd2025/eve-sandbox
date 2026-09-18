# Preview runbook (mirror of `.freebuff/run.md`)

> Mirrored verbatim from `.freebuff/run.md`, which is gitignored, so this
> tracked copy is what reviewers and fresh checkouts see. Update both when
> the recipe changes.

## Reproduce artifacts

- Use the primary checkout at `/Volumes/t9-2/Github/eve-sandbox`.
- Copy `.env` from the primary checkout into this worktree without committing it; keep credentials out of this document.
- Install dependencies with `pnpm install`.
- Build the checked-in application bundles with `pnpm run build`.

## Run the server

- From the worktree, run `node --env-file=.env dist/server.js`.
- The dashboard is served at `http://127.0.0.1:3000/dashboard.html`.
- If port 3000 is occupied, choose a free port and set `PORT` before starting the server.
