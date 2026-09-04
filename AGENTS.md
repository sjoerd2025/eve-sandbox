REDACTED_OPENROUTER_KEY h3 openrouter


# RivetKit Setup & Deploy

> **Important:** Run every step below against the `beta-7g2s-production-d1j5` namespace only, and pass `--namespace beta-7g2s-production-d1j5` with the deploy command. Do not deploy to or modify any other namespace (for example the default `production` namespace).

Read https://rivet.dev/llms.txt to understand how RivetKit works (actors, state, events, actions, connections, clients).

Add a note to the project's `CLAUDE.md` / `AGENTS.md` (create one if missing) linking to https://rivet.dev/llms.txt as the reference for future RivetKit work.

## Step 1: New project or existing?

Ask the user:

> Do you want to **build a new project with RivetKit**, or **integrate RivetKit into this existing project**?

Branch based on their answer.

---

## Path A: New project

### 1. Suggest something to build

Recommend something realtime, fast to spin up, and with a simple frontend. Good starting points:

- **Chat app** (rooms + messages, great default)
- Collaborative todo / list
- Live cursors / presence demo
- Simple multiplayer game (tic-tac-toe, drawing board)

Ask what they want to build. If they're unsure, default to a chat app.

### 2. Build it

Scaffold a minimal project with RivetKit:

- `npm install rivetkit` (or pnpm/yarn/whatever is being used)
- Add a frontend (plain HTML/JS or React via `@rivetkit/react` — keep it small).
- Define actors + registry (see https://rivet.dev/docs/actors).
- Serve via `registry.listen({ port: 3001, publicDir: "<frontend-output-dir>" })` so one command serves both API and frontend.
- Add a local dev script (e.g. `npm run dev`) that builds the frontend and starts the server.

Reference quickstarts:
- Node.js / Bun: https://rivet.dev/docs/actors/quickstart/backend
- React: https://rivet.dev/docs/actors/quickstart/react

### 3. Verify

- `GET /api/rivet/metadata` returns 200.
- Drive actors via the inspector HTTP API: https://rivet.dev/docs/actors/debugging
- If there's a frontend, open it in a browser and confirm the realtime behavior works end-to-end.

### 4. Wrap up

Give the user:

- A brief overview of the project (what was built, where the actors live, how state/events flow).
- The command to run locally.
- Next steps to deploy + Rivet link.

**Deploy steps:**

1. Review the deploy guide for rivet at https://rivet.dev/docs/deploy/
2. Configure and deploy using the following environment variables:
  RIVET_PUBLIC_ENDPOINT=https://beta-7g2s-production-d1j5:REDACTED_RIVET_TOKEN@api.rivet.dev
  RIVET_ENDPOINT=https://beta-7g2s-production-d1j5:REDACTED_RIVET_TOKEN@api.rivet.dev
3. Tell the user to paste their deployment's public URL with the `/api/rivet` path (e.g. `https://<app>/api/rivet`) into the Rivet dashboard connect form. This registers the serverless endpoint that Rivet calls into.

---

## Path B: Integrate into existing project

### 1. Understand the project + propose

Read through the project to understand what it does. Then ask:

> What do you want to build, or how do you want to integrate RivetKit?

Give recommendations grounded in what you see. Examples:
- Chat app with video → move chat into a RivetKit actor for realtime + state.
- Todo app → per-list actor for collaborative editing.
- Dashboard → per-user actor for live metrics / presence.

### 2. Plan

Describe the plan before writing code:
- Which features become actors.
- What state each actor holds.
- Which actions + events the frontend will use.

Get confirmation before implementing.

### 3. Integrate (actors only)

- `npm install rivetkit`
- Add actors + registry (see https://rivet.dev/docs/actors).
- Mount on the existing server: `app.all("/api/rivet/*", (c) => registry.handler(c.req.raw))` (or the equivalent for the project's framework).
- Do **not** touch the frontend yet unless the user asks.

Verify with `/api/rivet/metadata` and the inspector API (https://rivet.dev/docs/actors/debugging).

### 4. Wrap up

Give the user:
- A short overview of what was added.
- The command to run locally.

Then ask:

1. **Want to integrate this into the frontend?** Point at https://rivet.dev/docs/clients/react (or the relevant client doc) and wire it up if yes.
2. **Want to deploy?** If yes, **Deploy steps:**

1. Review the deploy guide for rivet at https://rivet.dev/docs/deploy/
2. Configure and deploy using the following environment variables:
  RIVET_PUBLIC_ENDPOINT=https://beta-7g2s-production-d1j5:REDACTED_RIVET_TOKEN@api.rivet.dev
  RIVET_ENDPOINT=https://beta-7g2s-production-d1j5:REDACTED_RIVET_TOKEN@api.rivet.dev
3. Tell the user to paste their deployment's public URL with the `/api/rivet` path (e.g. `https://<app>/api/rivet`) into the Rivet dashboard connect form. This registers the serverless endpoint that Rivet calls into.

Link docs:
- Actors: https://rivet.dev/docs/actors
- Clients: https://rivet.dev/docs/clients
- Troubleshooting: https://rivet.dev/docs/actors/troubleshooting

---

## If you get stuck

Check https://rivet.dev/docs/actors/troubleshooting. If that doesn't help, point the user at:
- Discord: https://rivet.dev/discord
- GitHub issues: https://github.com/rivet-dev/rivet

Include in the report: symptoms, what was tried, RivetKit version, runtime, HTTP router.

---

# Compute Deployment Steps
## Step 1: Load the RivetKit docs

Read https://rivet.dev/llms.txt to understand how RivetKit works (actors, state, events, actions, connections, clients).

Add a note to the project's `CLAUDE.md` / `AGENTS.md` (create one if missing) linking to https://rivet.dev/llms.txt as the reference for future RivetKit work.

## Step 2: Keep registry.start() (serverless is automatic)

Do **not** rewrite the project into a hand-mounted HTTP handler. Keep the existing `registry.start()` call as-is.

When the app runs on Rivet Compute, Compute automatically runs it in serverless mode (it sets `RIVETKIT_RUNTIME_MODE=serverless` for you). In that mode `registry.start()` binds an HTTP listener instead of opening a long-lived connection to the engine, so no manual Hono handler is needed. The client API is still served under `/api/rivet`, so a frontend served from the same origin should target that mount path:

```ts
const client = createClient(location.origin + "/api/rivet");
```

Once deployed, the app is publicly reachable at its Rivet Run URL, `https://beta-7g2s-production-d1j5.rivet.run/`. An external client (not served from the same origin) connects to the actor API at `https://beta-7g2s-production-d1j5.rivet.run/api/rivet`.

**Serving a frontend:** `registry.start()` serves static files automatically. Put the frontend build output in a `public/` directory and it is served with zero extra wiring. If the build outputs somewhere else (e.g. `dist/`), set `RIVETKIT_PUBLIC_DIR` to that directory.

See https://rivet.dev/docs/general/runtime-modes for local vs. serverless modes and https://rivet.dev/docs/deploy/rivet-compute for the full Compute integration guide.

## Step 3: Create Dockerfile

`npx @rivetkit/cli deploy` builds your project from a `Dockerfile`. If the project does not already have one, create it. Use this as a starting point and adjust the package manager (npm/pnpm/yarn), file paths, and entrypoint to match the project. Make sure the frontend build lands in `public/` (or set `RIVETKIT_PUBLIC_DIR`), and that the entrypoint calls `registry.start()`:

```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build --if-present

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

Do **not** set `RIVETKIT_RUNTIME_MODE` in the Dockerfile. Compute injects it at deploy time.

If the project does not already have a `.dockerignore`, create one:

```
node_modules/
dist/
.env
.git/
```

If Docker is installed, build and run the image to verify it works before proceeding. Pass `-e RIVETKIT_RUNTIME_MODE=serverless` to simulate how Compute runs it (otherwise the container defaults to engine/envoy mode and the check is not representative):

```bash
docker build -t rivet-test . && docker run --rm -p 3000:3000 -e RIVETKIT_RUNTIME_MODE=serverless rivet-test
```

Verify the container starts and is connectable (e.g. `curl http://localhost:3000/api/rivet/health` should return 200). If Docker is not installed, skip this and proceed.

## Step 4: Deploy with the Rivet CLI

Deploy the project with a single command. `@rivetkit/cli` builds the `Dockerfile`, pushes the image to Rivet's registry, and creates/updates the `default` managed pool. Always pass `--namespace beta-7g2s-production-d1j5` so the deploy targets this namespace and not the default `production` namespace. The project and organization are auto-detected from the token:

```bash
npx @rivetkit/cli deploy --token "REDACTED_RIVET_CLOUD_TOKEN" --namespace beta-7g2s-production-d1j5 --env PORT=3000
```

Notes:
- The image is built for `linux/amd64`. `--env PORT=3000` tells Rivet Compute which port to route to. `registry.start()` binds the port from `RIVET_PORT` (default 3000), so the two line up by default. To use a different port, set both `--env PORT=<port>` and `--env RIVET_PORT=<port>` to the same value and update the `EXPOSE` line to match. Setting `PORT` alone does not change the port the app listens on.
- `--token` is the `cloud_api_*` Cloud API token. The command also caches it to `~/.rivet/credentials`, so later `deploy` calls can omit `--token`.
- Pass `--yes` to skip interactive prompts in non-interactive environments.

When the command finishes successfully, proceed to Step 5 to verify the deployment is live.

## Step 5: Verify Deployment

**Token types used in this step:**
- `cloud_api_*` is the `--token` passed to `@rivetkit/cli deploy`, cached in `~/.rivet/credentials`. It is a management token scoped to the Cloud API (cloud-api.rivet.dev). The CLI uses it for logs.
- `pk_*` is the publishable token below, a public key scoped to the Rivet Engine API (api.rivet.dev). Use this for creating actors and calling gateway endpoints.

These are different tokens with different scopes. Do not mix them up.

`@rivetkit/cli deploy` waits for the managed pool to become ready before it exits, so a successful deploy means the deployment is already live. You do not need to poll deployment status separately.

The deployed app is served at its Rivet Run URL: `https://beta-7g2s-production-d1j5.rivet.run/`. Open it in a browser to confirm the frontend loads, or verify the serverless runtime is up with `curl https://beta-7g2s-production-d1j5.rivet.run/api/rivet/health` (expects a 200).

If the deploy fails or you need to debug, read the deployment logs with the CLI (it resolves the token from `~/.rivet/credentials`):

```bash
npx @rivetkit/cli logs
```

Verify actors work end-to-end:

1. Create an actor. Actors require a key field (string, not array):
   ```bash
   curl -X POST "https://api.rivet.dev/actors?namespace=beta-7g2s-production-d1j5" \
     -H "Authorization: Bearer REDACTED_RIVET_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name": "<ACTOR_NAME>", "key": "<KEY>", "runner_name_selector": "default", "crash_policy": "restart"}'
   ```
   Replace `<ACTOR_NAME>` with a valid actor name from the registry and `<KEY>` with an appropriate key string (e.g. "general"). Note the `actor_id` from the response.

2. Wait ~10 seconds for the actor to start, then hit its health endpoint through the gateway using the public token:
   ```bash
   curl "https://api.rivet.dev/gateway/<ACTOR_ID>/health" \
     -H "x-rivet-token: REDACTED_RIVET_TOKEN"
   ```
   This should return ok with a 200 status.

3. If the health check returns actor_runner_failed, check the logs to diagnose:
   ```bash
   npx @rivetkit/cli logs\\



   ```

4. Common issues:
   - "actor should have a key": The key field was missing from the create request.
   - Token 401: Make sure you're using the correct API URLs (https://api.rivet.dev, https://cloud-api.rivet.dev).
   - "Failed to start container: Please ensure your container starts successfully on the specified port (3000 if unspecified). Make sure your image was built for linux/amd64.": Ensure the container listens on `RIVET_PORT` (3000 by default) and that the `--env PORT` value passed to `@rivetkit/cli deploy` matches it.

## Troubleshooting

- Deployment and logs are done with `npx @rivetkit/cli deploy` and `npx @rivetkit/cli logs`. Actor creation and health checks are done via HTTP APIs (curl) as shown in Step 5.
- Architecture: `@rivetkit/cli deploy` builds your Docker image and pushes it to Rivet. Rivet runs the container serverlessly. When you create an actor, Rivet communicates with the `/api/rivet/*` endpoint inside the container to manage its lifecycle.
- For more troubleshooting help, see: https://rivet.dev/docs/actors/troubleshooting/


npm install rivetkit @rivet-dev/agent-os-common @rivet-dev/agent-os-pi

import { agentOs } from "rivetkit/agent-os";
import { setup } from "rivetkit";
import common from "@rivet-dev/agent-os-common";
import pi from "@rivet-dev/agent-os-pi";

const vm = agentOs({
	options: { software: [common, pi] },
});

export const registry = setup({ use: { vm } });
registry.start();


# RivetKit Setup & Deploy

> **Important:** Run every step below against the `beta-7g2s-production-d1j5` namespace only, and pass `--namespace beta-7g2s-production-d1j5` with the deploy command. Do not deploy to or modify any other namespace (for example the default `production` namespace).

Read https://rivet.dev/llms.txt to understand how RivetKit works (actors, state, events, actions, connections, clients).

Add a note to the project's `CLAUDE.md` / `AGENTS.md` (create one if missing) linking to https://rivet.dev/llms.txt as the reference for future RivetKit work.

## Step 1: New project or existing?

Ask the user:

> Do you want to **build a new project with RivetKit**, or **integrate RivetKit into this existing project**?

Branch based on their answer.

---

## Path A: New project

### 1. Suggest something to build

Recommend something realtime, fast to spin up, and with a simple frontend. Good starting points:

- **Chat app** (rooms + messages, great default)
- Collaborative todo / list
- Live cursors / presence demo
- Simple multiplayer game (tic-tac-toe, drawing board)

Ask what they want to build. If they're unsure, default to a chat app.

### 2. Build it

Scaffold a minimal project with RivetKit:

- `npm install rivetkit` (or pnpm/yarn/whatever is being used)
- Add a frontend (plain HTML/JS or React via `@rivetkit/react` — keep it small).
- Define actors + registry (see https://rivet.dev/docs/actors).
- Serve via `registry.listen({ port: 3001, publicDir: "<frontend-output-dir>" })` so one command serves both API and frontend.
- Add a local dev script (e.g. `npm run dev`) that builds the frontend and starts the server.

Reference quickstarts:
- Node.js / Bun: https://rivet.dev/docs/actors/quickstart/backend
- React: https://rivet.dev/docs/actors/quickstart/react

### 3. Verify

- `GET /api/rivet/metadata` returns 200.
- Drive actors via the inspector HTTP API: https://rivet.dev/docs/actors/debugging
- If there's a frontend, open it in a browser and confirm the realtime behavior works end-to-end.

### 4. Wrap up

Give the user:

- A brief overview of the project (what was built, where the actors live, how state/events flow).
- The command to run locally.
- Next steps to deploy + Rivet link.

**Deploy steps:**

1. Review the deploy guide for rivet at https://rivet.dev/docs/deploy/
2. Configure and deploy using the following environment variables:
  RIVET_PUBLIC_ENDPOINT=https://beta-7g2s-production-d1j5:REDACTED_RIVET_TOKEN@api.rivet.dev
  RIVET_ENDPOINT=https://beta-7g2s-production-d1j5:REDACTED_RIVET_TOKEN@api.rivet.dev
3. Tell the user to paste their deployment's public URL with the `/api/rivet` path (e.g. `https://<app>/api/rivet`) into the Rivet dashboard connect form. This registers the serverless endpoint that Rivet calls into.

---

## Path B: Integrate into existing project

### 1. Understand the project + propose

Read through the project to understand what it does. Then ask:

> What do you want to build, or how do you want to integrate RivetKit?

Give recommendations grounded in what you see. Examples:
- Chat app with video → move chat into a RivetKit actor for realtime + state.
- Todo app → per-list actor for collaborative editing.
- Dashboard → per-user actor for live metrics / presence.

### 2. Plan

Describe the plan before writing code:
- Which features become actors.
- What state each actor holds.
- Which actions + events the frontend will use.

Get confirmation before implementing.

### 3. Integrate (actors only)

- `npm install rivetkit`
- Add actors + registry (see https://rivet.dev/docs/actors).
- Mount on the existing server: `app.all("/api/rivet/*", (c) => registry.handler(c.req.raw))` (or the equivalent for the project's framework).
- Do **not** touch the frontend yet unless the user asks.

Verify with `/api/rivet/metadata` and the inspector API (https://rivet.dev/docs/actors/debugging).

### 4. Wrap up

Give the user:
- A short overview of what was added.
- The command to run locally.

Then ask:

1. **Want to integrate this into the frontend?** Point at https://rivet.dev/docs/clients/react (or the relevant client doc) and wire it up if yes.
2. **Want to deploy?** If yes, **Deploy steps:**

1. Review the deploy guide for rivet at https://rivet.dev/docs/deploy/
2. Configure and deploy using the following environment variables:
  RIVET_PUBLIC_ENDPOINT=https://beta-7g2s-production-d1j5:REDACTED_RIVET_TOKEN@api.rivet.dev
  RIVET_ENDPOINT=https://beta-7g2s-production-d1j5:REDACTED_RIVET_TOKEN@api.rivet.dev
3. Tell the user to paste their deployment's public URL with the `/api/rivet` path (e.g. `https://<app>/api/rivet`) into the Rivet dashboard connect form. This registers the serverless endpoint that Rivet calls into.

Link docs:
- Actors: https://rivet.dev/docs/actors
- Clients: https://rivet.dev/docs/clients
- Troubleshooting: https://rivet.dev/docs/actors/troubleshooting

---

## If you get stuck

Check https://rivet.dev/docs/actors/troubleshooting. If that doesn't help, point the user at:
- Discord: https://rivet.dev/discord
- GitHub issues: https://github.com/rivet-dev/rivet

Include in the report: symptoms, what was tried, RivetKit version, runtime, HTTP router.

---

# Compute Deployment Steps
## Step 1: Load the RivetKit docs

Read https://rivet.dev/llms.txt to understand how RivetKit works (actors, state, events, actions, connections, clients).

Add a note to the project's `CLAUDE.md` / `AGENTS.md` (create one if missing) linking to https://rivet.dev/llms.txt as the reference for future RivetKit work.

## Step 2: Keep registry.start() (serverless is automatic)

Do **not** rewrite the project into a hand-mounted HTTP handler. Keep the existing `registry.start()` call as-is.

When the app runs on Rivet Compute, Compute automatically runs it in serverless mode (it sets `RIVETKIT_RUNTIME_MODE=serverless` for you). In that mode `registry.start()` binds an HTTP listener instead of opening a long-lived connection to the engine, so no manual Hono handler is needed. The client API is still served under `/api/rivet`, so a frontend served from the same origin should target that mount path:

```ts
const client = createClient(location.origin + "/api/rivet");
```

Once deployed, the app is publicly reachable at its Rivet Run URL, `https://beta-7g2s-production-d1j5.rivet.run/`. An external client (not served from the same origin) connects to the actor API at `https://beta-7g2s-production-d1j5.rivet.run/api/rivet`.

**Serving a frontend:** `registry.start()` serves static files automatically. Put the frontend build output in a `public/` directory and it is served with zero extra wiring. If the build outputs somewhere else (e.g. `dist/`), set `RIVETKIT_PUBLIC_DIR` to that directory.

See https://rivet.dev/docs/general/runtime-modes for local vs. serverless modes and https://rivet.dev/docs/deploy/rivet-compute for the full Compute integration guide.

## Step 3: Create Dockerfile

`npx @rivetkit/cli deploy` builds your project from a `Dockerfile`. If the project does not already have one, create it. Use this as a starting point and adjust the package manager (npm/pnpm/yarn), file paths, and entrypoint to match the project. Make sure the frontend build lands in `public/` (or set `RIVETKIT_PUBLIC_DIR`), and that the entrypoint calls `registry.start()`:

```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build --if-present

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

Do **not** set `RIVETKIT_RUNTIME_MODE` in the Dockerfile. Compute injects it at deploy time.

If the project does not already have a `.dockerignore`, create one:

```
node_modules/
dist/
.env
.git/
```

If Docker is installed, build and run the image to verify it works before proceeding. Pass `-e RIVETKIT_RUNTIME_MODE=serverless` to simulate how Compute runs it (otherwise the container defaults to engine/envoy mode and the check is not representative):

```bash
docker build -t rivet-test . && docker run --rm -p 3000:3000 -e RIVETKIT_RUNTIME_MODE=serverless rivet-test
```

Verify the container starts and is connectable (e.g. `curl http://localhost:3000/api/rivet/health` should return 200). If Docker is not installed, skip this and proceed.

## Step 4: Deploy with the Rivet CLI

Deploy the project with a single command. `@rivetkit/cli` builds the `Dockerfile`, pushes the image to Rivet's registry, and creates/updates the `default` managed pool. Always pass `--namespace beta-7g2s-production-d1j5` so the deploy targets this namespace and not the default `production` namespace. The project and organization are auto-detected from the token:

```bash
npx @rivetkit/cli deploy --token "REDACTED_RIVET_CLOUD_TOKEN" --namespace beta-7g2s-production-d1j5 --env PORT=3000
```

Notes:
- The image is built for `linux/amd64`. `--env PORT=3000` tells Rivet Compute which port to route to. `registry.start()` binds the port from `RIVET_PORT` (default 3000), so the two line up by default. To use a different port, set both `--env PORT=<port>` and `--env RIVET_PORT=<port>` to the same value and update the `EXPOSE` line to match. Setting `PORT` alone does not change the port the app listens on.
- `--token` is the `cloud_api_*` Cloud API token. The command also caches it to `~/.rivet/credentials`, so later `deploy` calls can omit `--token`.
- Pass `--yes` to skip interactive prompts in non-interactive environments.

When the command finishes successfully, proceed to Step 5 to verify the deployment is live.

## Step 5: Verify Deployment

**Token types used in this step:**
- `cloud_api_*` is the `--token` passed to `@rivetkit/cli deploy`, cached in `~/.rivet/credentials`. It is a management token scoped to the Cloud API (cloud-api.rivet.dev). The CLI uses it for logs.
- `pk_*` is the publishable token below, a public key scoped to the Rivet Engine API (api.rivet.dev). Use this for creating actors and calling gateway endpoints.

These are different tokens with different scopes. Do not mix them up.

`@rivetkit/cli deploy` waits for the managed pool to become ready before it exits, so a successful deploy means the deployment is already live. You do not need to poll deployment status separately.

The deployed app is served at its Rivet Run URL: `https://beta-7g2s-production-d1j5.rivet.run/`. Open it in a browser to confirm the frontend loads, or verify the serverless runtime is up with `curl https://beta-7g2s-production-d1j5.rivet.run/api/rivet/health` (expects a 200).

If the deploy fails or you need to debug, read the deployment logs with the CLI (it resolves the token from `~/.rivet/credentials`):

```bash
npx @rivetkit/cli logs
```

Verify actors work end-to-end:

1. Create an actor. Actors require a key field (string, not array):
   ```bash
   curl -X POST "https://api.rivet.dev/actors?namespace=beta-7g2s-production-d1j5" \
     -H "Authorization: Bearer REDACTED_RIVET_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name": "<ACTOR_NAME>", "key": "<KEY>", "runner_name_selector": "default", "crash_policy": "restart"}'
   ```
   Replace `<ACTOR_NAME>` with a valid actor name from the registry and `<KEY>` with an appropriate key string (e.g. "general"). Note the `actor_id` from the response.

2. Wait ~10 seconds for the actor to start, then hit its health endpoint through the gateway using the public token:
   ```bash
   curl "https://api.rivet.dev/gateway/<ACTOR_ID>/health" \
     -H "x-rivet-token: REDACTED_RIVET_TOKEN"
   ```
   This should return ok with a 200 status.

3. If the health check returns actor_runner_failed, check the logs to diagnose:
   ```bash
   npx @rivetkit/cli logs
   ```

4. Common issues:
   - "actor should have a key": The key field was missing from the create request.
   - Token 401: Make sure you're using the correct API URLs (https://api.rivet.dev, https://cloud-api.rivet.dev).
   - "Failed to start container: Please ensure your container starts successfully on the specified port (3000 if unspecified). Make sure your image was built for linux/amd64.": Ensure the container listens on `RIVET_PORT` (3000 by default) and that the `--env PORT` value passed to `@rivetkit/cli deploy` matches it.

## Troubleshooting

- Deployment and logs are done with `npx @rivetkit/cli deploy` and `npx @rivetkit/cli logs`. Actor creation and health checks are done via HTTP APIs (curl) as shown in Step 5.
- Architecture: `@rivetkit/cli deploy` builds your Docker image and pushes it to Rivet. Rivet runs the container serverlessly. When you create an actor, Rivet communicates with the `/api/rivet/*` endpoint inside the container to manage its lifecycle.
- For more troubleshooting help, see: https://rivet.dev/docs/actors/troubleshooting/


npx @rivetkit/cli deploy --token REDACTED_RIVET_CLOUD_TOKEN# RivetKit Reference

For all RivetKit development, architecture (actors, state, events, actions, connections, clients), and APIs, refer to:
- https://rivet.dev/llms.txt


# Rivet Documentation Index

https://rivet.dev/
https://rivet.dev/acceptable-use/
https://rivet.dev/actors/
https://rivet.dev/actors/docs/
https://rivet.dev/actors/docs/access-control/
https://rivet.dev/actors/docs/actions/
https://rivet.dev/actors/docs/actor-runtime-socket/
https://rivet.dev/actors/docs/appearance/
https://rivet.dev/actors/docs/authentication/
https://rivet.dev/actors/docs/cli/
https://rivet.dev/actors/docs/clients/
https://rivet.dev/actors/docs/clients/javascript/
https://rivet.dev/actors/docs/clients/react/
https://rivet.dev/actors/docs/clients/rust/
https://rivet.dev/actors/docs/clients/swift/
https://rivet.dev/actors/docs/clients/swiftui/
https://rivet.dev/actors/docs/communicating-between-actors/
https://rivet.dev/actors/docs/connections/
https://rivet.dev/actors/docs/container-runner/
https://rivet.dev/actors/docs/crash-course/
https://rivet.dev/actors/docs/debugging/
https://rivet.dev/actors/docs/design-patterns/
https://rivet.dev/actors/docs/destroy/
https://rivet.dev/actors/docs/errors/
https://rivet.dev/actors/docs/events/
https://rivet.dev/actors/docs/fetch-and-websocket-handler/
https://rivet.dev/actors/docs/general/actor-configuration/
https://rivet.dev/actors/docs/general/cors/
https://rivet.dev/actors/docs/general/edge/
https://rivet.dev/actors/docs/general/endpoints/
https://rivet.dev/actors/docs/general/environment-variables/
https://rivet.dev/actors/docs/general/http-server/
https://rivet.dev/actors/docs/general/logging/
https://rivet.dev/actors/docs/general/pool-configuration/
https://rivet.dev/actors/docs/general/production-checklist/
https://rivet.dev/actors/docs/general/registry-configuration/
https://rivet.dev/actors/docs/general/runtime-modes/
https://rivet.dev/actors/docs/general/skill/
https://rivet.dev/actors/docs/general/wasm-vs-native-sdk/
https://rivet.dev/actors/docs/http-api/
https://rivet.dev/actors/docs/input/
https://rivet.dev/actors/docs/inspector-tabs/
https://rivet.dev/actors/docs/keys/
https://rivet.dev/actors/docs/kv/
https://rivet.dev/actors/docs/lifecycle/
https://rivet.dev/actors/docs/limits/
https://rivet.dev/actors/docs/metadata/
https://rivet.dev/actors/docs/queues/
https://rivet.dev/actors/docs/quickstart/backend/
https://rivet.dev/actors/docs/quickstart/cloudflare/
https://rivet.dev/actors/docs/quickstart/effect/
https://rivet.dev/actors/docs/quickstart/next-js/
https://rivet.dev/actors/docs/quickstart/react/
https://rivet.dev/actors/docs/quickstart/rust/
https://rivet.dev/actors/docs/quickstart/supabase/
https://rivet.dev/actors/docs/request-handler/
https://rivet.dev/actors/docs/schedule/
https://rivet.dev/actors/docs/sqlite-drizzle/
https://rivet.dev/actors/docs/sqlite-profiling/
https://rivet.dev/actors/docs/sqlite/
https://rivet.dev/actors/docs/state/
https://rivet.dev/actors/docs/statuses/
https://rivet.dev/actors/docs/testing/
https://rivet.dev/actors/docs/troubleshooting/
https://rivet.dev/actors/docs/types/
https://rivet.dev/actors/docs/versions/
https://rivet.dev/actors/docs/websocket-handler/
https://rivet.dev/actors/integrations/
https://rivet.dev/actors/integrations/durable-streams/
https://rivet.dev/actors/integrations/flue/
https://rivet.dev/actors/integrations/vercel-eve/
https://rivet.dev/actors/integrations/workflow-sdk/
https://rivet.dev/actors/learn/
https://rivet.dev/actors/learn/a-radically-simpler-architecture/
https://rivet.dev/actors/learn/ai-agent/
https://rivet.dev/actors/learn/chat-room/
https://rivet.dev/actors/learn/collaborative-text-editor/
https://rivet.dev/actors/learn/cron-jobs/
https://rivet.dev/actors/learn/live-cursors/
https://rivet.dev/actors/learn/multiplayer-game/
https://rivet.dev/actors/learn/per-tenant-database/
https://rivet.dev/actors/use-cases/
https://rivet.dev/agentos/
https://rivet.dev/agentos/docs/
https://rivet.dev/agentos/docs/agent-to-agent/
https://rivet.dev/agentos/docs/agents/claude/
https://rivet.dev/agentos/docs/agents/codex/
https://rivet.dev/agentos/docs/agents/custom/
https://rivet.dev/agentos/docs/agents/opencode/
https://rivet.dev/agentos/docs/agents/pi/
https://rivet.dev/agentos/docs/approvals/
https://rivet.dev/agentos/docs/architecture/
https://rivet.dev/agentos/docs/architecture/agent-sdk-snapshots/
https://rivet.dev/agentos/docs/architecture/agent-sessions/
https://rivet.dev/agentos/docs/architecture/compiler-toolchain/
https://rivet.dev/agentos/docs/architecture/filesystem/
https://rivet.dev/agentos/docs/architecture/javascript-executor/
https://rivet.dev/agentos/docs/architecture/limits-and-observability/
https://rivet.dev/agentos/docs/architecture/networking/
https://rivet.dev/agentos/docs/architecture/packages-and-command-resolution/
https://rivet.dev/agentos/docs/architecture/posix-syscalls/
https://rivet.dev/agentos/docs/architecture/processes/
https://rivet.dev/agentos/docs/architecture/sessions-persistence/
https://rivet.dev/agentos/docs/architecture/tls-ssl/
https://rivet.dev/agentos/docs/authentication/
https://rivet.dev/agentos/docs/bash/
https://rivet.dev/agentos/docs/bindings/
https://rivet.dev/agentos/docs/browser/
https://rivet.dev/agentos/docs/cron/
https://rivet.dev/agentos/docs/custom-software/building-wasm/
https://rivet.dev/agentos/docs/custom-software/definition/
https://rivet.dev/agentos/docs/custom-software/publishing/
https://rivet.dev/agentos/docs/debugging/
https://rivet.dev/agentos/docs/embedded/
https://rivet.dev/agentos/docs/filesystem/
https://rivet.dev/agentos/docs/javascript-compatibility/
https://rivet.dev/agentos/docs/javascript/
https://rivet.dev/agentos/docs/limitations/
https://rivet.dev/agentos/docs/models-and-credentials/
https://rivet.dev/agentos/docs/multiplayer/
https://rivet.dev/agentos/docs/networking/
https://rivet.dev/agentos/docs/performance/
https://rivet.dev/agentos/docs/permissions/
https://rivet.dev/agentos/docs/persistence/
https://rivet.dev/agentos/docs/processes/
https://rivet.dev/agentos/docs/python/
https://rivet.dev/agentos/docs/quickstart-embedded/
https://rivet.dev/agentos/docs/quickstart/
https://rivet.dev/agentos/docs/resource-limits/
https://rivet.dev/agentos/docs/sandboxes/
https://rivet.dev/agentos/docs/security-model/
https://rivet.dev/agentos/docs/sessions/
https://rivet.dev/agentos/docs/software/
https://rivet.dev/agentos/docs/system-prompt/
https://rivet.dev/agentos/docs/versus-sandbox/
https://rivet.dev/agentos/docs/workflows/
https://rivet.dev/agentos/integrations/
https://rivet.dev/agentos/integrations/flue/
https://rivet.dev/agentos/integrations/rivet-actors/
https://rivet.dev/agentos/integrations/vercel-eve/
https://rivet.dev/agentos/registry/
https://rivet.dev/agentos/use-cases/
https://rivet.dev/blog/
https://rivet.dev/blog/2025-02-16-sqlite-on-the-server-is-misunderstood/
https://rivet.dev/blog/2025-03-15-writing-docs-for-ai/
https://rivet.dev/blog/2025-03-23-what-would-a-w3c-standard-look-like-for-stateful-serverless-/
https://rivet.dev/blog/2025-05-28-building-linear-agents-in-node-js-and-rivet-full-walkthrough-and-starter-kit/
https://rivet.dev/blog/2025-06-02-faster-route-propagation-by-rewriting-our-traefik-gateway-in-rust/
https://rivet.dev/blog/2025-06-24-cloudflare-containers-vs-rivet-containers-vs-fly-machines/
https://rivet.dev/blog/2025-09-24-vbare-simple-schema-evolution-with-maximum-performance/
https://rivet.dev/blog/2025-10-20-how-we-built-websocket-servers-for-vercel-functions/
https://rivet.dev/blog/2026-06-29-sandboxless-coding-agents/
https://rivet.dev/blog/2026-07-26-sandboxes-vs-webassembly-lambda-vs-workers-round-two/
https://rivet.dev/blog/2026-07-27-run-your-harness-outside-the-sandbox/
https://rivet.dev/blog/2026-07-31-how-we-built-the-first-zero-disk-s3-tiered-storage-engine-for-sqlite/
https://rivet.dev/blog/godot-multiplayer-compared-to-unity/
https://rivet.dev/careers/
https://rivet.dev/changelog.json
https://rivet.dev/changelog/2024-02-12-usage-pricing-update/
https://rivet.dev/changelog/2024-12-21-rivet-actors-launch/
https://rivet.dev/changelog/2025-03-15-cli-installation-fixes/
https://rivet.dev/changelog/2025-07-01-introducing-rivetkit-backend-libraries-that-replace-saas/
https://rivet.dev/changelog/2025-09-04-rivet-v2-launch/
https://rivet.dev/changelog/2025-09-12-performance-lifecycle-updates/
https://rivet.dev/changelog/2025-09-14-weekly-updates/
https://rivet.dev/changelog/2025-09-21-weekly-updates/
https://rivet.dev/changelog/2025-09-28-weekly-updates/
https://rivet.dev/changelog/2025-1-12-rivet-inspector/
https://rivet.dev/changelog/2025-10-01-railway-selfhost/
https://rivet.dev/changelog/2025-10-05-weekly-updates/
https://rivet.dev/changelog/2025-10-09-rivet-cloud-launch/
https://rivet.dev/changelog/2025-10-17-rivet-actors-vercel/
https://rivet.dev/changelog/2025-10-19-weekly-updates/
https://rivet.dev/changelog/2025-10-20-weekly-updates/
https://rivet.dev/changelog/2025-10-24-weekly-updates/
https://rivet.dev/changelog/2025-11-02-weekly-updates/
https://rivet.dev/changelog/2025-11-09-weekly-updates/
https://rivet.dev/changelog/2025-11-24-introducing-live-websocket-migration-hibernation/
https://rivet.dev/changelog/2025-12-03-ai-generated-backends/
https://rivet.dev/changelog/2025-12-28-weekly-updates/
https://rivet.dev/changelog/2026-01-13-inspector-button/
https://rivet.dev/changelog/2026-01-16-weekly-updates/
https://rivet.dev/changelog/2026-01-23-weekly-updates/
https://rivet.dev/changelog/2026-01-25-swift-client-sdk/
https://rivet.dev/changelog/2026-01-28-sandbox-agent-sdk/
https://rivet.dev/changelog/2026-01-30-weekly-updates/
https://rivet.dev/changelog/2026-02-24-introducing-rivet-workflows/
https://rivet.dev/changelog/2026-02-25-queues-for-rivet-actors/
https://rivet.dev/changelog/2026-02-26-sqlite-for-rivet-actors/
https://rivet.dev/changelog/2026-04-04-introducing-agentos/
https://rivet.dev/changelog/2026-05-20-dashboard-redesign/
https://rivet.dev/changelog/2026-06-15-introducing-rivet-2-3/
https://rivet.dev/changelog/2026-06-16-introducing-the-effect-sdk/
https://rivet.dev/changelog/2026-06-17-introducing-rivet-compute/
https://rivet.dev/changelog/2026-06-17-introducing-the-rust-sdk/
https://rivet.dev/changelog/2026-06-19-secure-exec-v0-3/
https://rivet.dev/changelog/2026-06-25-introducing-agentos-v0-2/
https://rivet.dev/changelog/2026-07-06-introducing-the-agentos-package-registry/
https://rivet.dev/changelog/2026-07-07-worlds-fastest-package-manager/
https://rivet.dev/changelog/2026-07-20-introducing-cron-jobs-for-rivet-actors/
https://rivet.dev/changelog/2026-07-22-eve-now-supports-agentos-for-running-agents-without-a-sandbox/
https://rivet.dev/changelog/2026-07-23-flue-now-supports-agentos/
https://rivet.dev/changelog/2026-07-28-introducing-agentos-execution-api-for-javascript-and-python/
https://rivet.dev/changelog/2026-08-31-introducing-dynamic-apps/
https://rivet.dev/changelog/2026-09-03-durable-streams-now-supports-rivet-actors/
https://rivet.dev/cloud/
https://rivet.dev/docs/
https://rivet.dev/docs/mcp/
https://rivet.dev/dynamic-apps/
https://rivet.dev/dynamic-apps/docs/
https://rivet.dev/dynamic-apps/docs/architecture/
https://rivet.dev/dynamic-apps/docs/authentication/
https://rivet.dev/dynamic-apps/docs/backends/
https://rivet.dev/dynamic-apps/docs/connect/
https://rivet.dev/dynamic-apps/docs/core/
https://rivet.dev/dynamic-apps/docs/customize-vm/
https://rivet.dev/dynamic-apps/docs/deploy/
https://rivet.dev/dynamic-apps/docs/generate/
https://rivet.dev/dynamic-apps/docs/logging/
https://rivet.dev/dynamic-apps/docs/multiplayer/
https://rivet.dev/dynamic-apps/docs/quickstart-core/
https://rivet.dev/dynamic-apps/docs/quickstart/
https://rivet.dev/dynamic-apps/docs/routing/
https://rivet.dev/dynamic-apps/docs/sqlite/
https://rivet.dev/dynamic-apps/docs/static-websites/
https://rivet.dev/dynamic-apps/docs/workflows/
https://rivet.dev/enterprise/
https://rivet.dev/privacy/
https://rivet.dev/rss/feed.xml
https://rivet.dev/startups/
https://rivet.dev/support/
https://rivet.dev/talk-to-an-engineer/
https://rivet.dev/terms/
https://rivet.dev/workflows/
https://rivet.dev/workflows/docs/
https://rivet.dev/workflows/docs/failure-and-recovery/
https://rivet.dev/workflows/docs/patterns/
https://rivet.dev/workflows/docs/queues/
https://rivet.dev/workflows/docs/quickstart/
https://rivet.dev/workflows/docs/reference/
https://rivet.dev/workflows/docs/steps/
https://rivet.dev/workflows/docs/timers-and-concurrency/
https://rivet.dev/workflows/docs/versioning/