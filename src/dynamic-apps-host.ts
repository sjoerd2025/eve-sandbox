import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { appsRouter, deployApp } from "@rivet-dev/dynamic-apps";
import { registry } from "./server.js";

/**
 * Dynamic Apps host (https://rivet.dev/dynamic-apps/docs/quickstart/).
 *
 * One Hono server, three surfaces:
 * - /api/rivet/*  — the private Rivet control-plane callback (deployments,
 *   health, app lifecycle). Rivet reaches this directly; it is not app traffic.
 * - /apps/:appId  — every deployed generated application.
 * - /registry/*   — this repo's own actors (vm, swarmWorker), mounted from the
 *   existing rivetkit registry so the swarm and the app host share one server.
 *
 * Authentication and other trusted control-plane routes stay here in the host;
 * generated apps never see them.
 */
const host = new Hono();

// Rivet control plane → Dynamic Apps.
host.all("/api/rivet/*", (c) => appsRouter.fetch(c.req.raw));

// The swarm's existing actors, reachable under /registry (strip the prefix —
// registry.handler only recognizes /api/rivet/* paths).
host.all("/registry/*", (c) => {
  const url = new URL(c.req.raw.url);
  const path = url.pathname.replace(/^\/registry/, "") || "/";
  return registry.handler(new Request(new URL(path + url.search, url.origin), c.req.raw));
});

// Deployed generated applications.
host.route("/apps", appsRouter);

// Host liveness (distinct from actor health under /registry).
host.get("/healthz", (c) => c.json({ ok: true, host: "dynamic-apps" }));

// Trusted deploy trigger. Guarded three ways: header bearer secret, a kill
// switch env (unset = enabled), and an app-id allowlist pattern. RIVET_CLOUD
// _TOKEN is only read here, server-side — never served to apps or browsers.
host.post("/internal/deploy-app", async (c) => {
  const secret = process.env.DEPLOY_APP_SECRET;
  if (!secret || c.req.header("authorization") !== `Bearer ${secret}`) {
    return c.json({ error: "unauthorized" }, 401);
  }
  if (process.env.DEPLOY_APP_DISABLED === "1") {
    return c.json({ error: "deployments disabled" }, 403);
  }
  const body = await c.req.json<{ appId?: string; files?: Record<string, string> }>();
  const appId = body.appId ?? "";
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(appId) || !body.files) {
    return c.json({ error: "appId (lowercase alphanumeric/dash) and files required" }, 400);
  }
  try {
    const result = await deployApp({ appId, files: body.files });
    return c.json({ ok: true, appId, result });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

const port = Number(process.env.PORT ?? process.env.RIVET_PORT ?? 3000);

// Bind in ALL runtime modes when this module is the entrypoint. Rivet Compute
// injects RIVETKIT_RUNTIME_MODE=serverless, but the HTTP listener is still
// what Compute routes $PORT to — skipping serve() leaves the container with
// no listener and the gateway returns upstream errors on every route
// (observed on beta-g2ly-production-kxh0 2026-09-13). The registry itself is
// mounted via registry.handler below, so it needs no start() of its own here.
const entry = process.argv[1]?.replace(/\\/g, "/");
if (
  entry?.endsWith("dynamic-apps-host.js") ||
  entry?.endsWith("dynamic-apps-host.ts") ||
  process.env.DYNAMIC_APPS_HOST_AUTO_START === "1"
) {
  serve({ fetch: host.fetch, port });
  console.log(`dynamic-apps host listening on http://localhost:${port}`);
}

export default host;

// Example trusted-side deployment (never expose RIVET_CLOUD_TOKEN to apps):
//   await deployApp({ appId: "onboarding", files });
