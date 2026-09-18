import { readFile } from "node:fs/promises";
import { serve } from "@hono/node-server";
import { agentOS, setup, type Registry } from "@rivet-dev/agentos";
import { Hono } from "hono";
import common from "@agentos-software/common";
import pi from "@agentos-software/pi";
import { swarmWorker } from "./swarm/actor";
import { swarmRunner } from "./swarm/runner";

/**
 * The agentOS VM actor: one isolated virtual Linux per actor key, with durable
 * `/workspace` persistence, the standard CLI toolset (`@agentos-software/common`:
 * sh, coreutils, sed, grep, gawk, findutils, diffutils, tar, gzip) and the `pi`
 * coding agent available as a session agent (`sessions.open({ agent: "pi" })`).
 *
 * Software entries are agentOS package references (`{ packagePath }` pointing at
 * the packed `.aospkg` shipped inside each `@agentos-software/*` package) — the
 * sidecar projects them into the VM's `/opt/agentos` at boot.
 *
 * Everything else (models & credentials, permissions, mounts, cron) is
 * configured by the client when it opens a session — see
 * https://rivet.dev/agentos/docs.
 */
export const vm: AgentOsActorDefinition = agentOS({
  software: [common, pi],
});

/** The `vm` actor's definition type, without serializing the full inferred type. */
export type AgentOsActorDefinition = ReturnType<typeof agentOS>;

/**
 * Build the application registry. Exported as a factory so tests (and
 * embedders) can construct a registry without side effects; the default
 * `registry` below is what the entrypoint and `agentOSBackend()` consumers use.
 */
export function createAgentOsRegistry(): Registry<{
  vm: typeof vm;
  swarmWorker: typeof swarmWorker;
  swarmRunner: typeof swarmRunner;
}> {
  return setup({ use: { vm, swarmWorker, swarmRunner } });
}

/**
 * The application registry. `agentOSBackend({ actor: "vm", registry })` (from
 * `@rivet-dev/agentos-eve`, re-exported by this package) points Eve at this
 * actor, mapping every Eve sandbox session onto a `vm` actor instance.
 */
export const registry: Registry<{
  vm: typeof vm;
  swarmWorker: typeof swarmWorker;
  swarmRunner: typeof swarmRunner;
}> = createAgentOsRegistry();

function createDashboardApplication(): Hono {
  const app = createQueueStatusApp();
  const publicDir =
    process.env.RIVETKIT_PUBLIC_DIR ?? new URL("../public", import.meta.url).pathname;
  app.all("/api/rivet/*", (context) => registry.handler(context.req.raw));
  app.get("*", async (context) => {
    const file = context.req.path === "/dashboard.js" ? "dashboard.js" : "dashboard.html";
    try {
      const body = await readFile(`${publicDir}/${file}`);
      return new Response(body, {
        headers: {
          "content-type": file.endsWith(".js")
            ? "text/javascript; charset=utf-8"
            : "text/html; charset=utf-8",
        },
      });
    } catch {
      return context.notFound();
    }
  });
  return app;
}

// Only auto-start when run directly as the entrypoint (dist/server.js), not
// when imported by tests or `agentOSBackend()` consumers that own the
// registry lifecycle themselves.
const entry = process.argv[1]?.replace(/\\/g, "/");
if (
  entry?.endsWith("server.js") ||
  entry?.endsWith("server.ts") ||
  process.env.RIVETKIT_AUTO_START === "1"
) {
  // Serverless mode is automatic on Rivet Compute (it sets
  // RIVETKIT_RUNTIME_MODE=serverless): bind the HTTP listener ourselves so we
  // can pass an `application` fallback — same-origin routes the serverless
  // mount doesn't serve (e.g. /api/queue-status, which the dashboard polls
  // because browser calls to engine-gateway action routes are h2-blocked).
  // This is the documented registry.listen() seam; /api/rivet and publicDir
  // static serving are unchanged.
  if (process.env.RIVETKIT_RUNTIME_MODE === "serverless") {
    serve({
      fetch: createDashboardApplication().fetch,
      port: Number(process.env.RIVET_PORT ?? process.env.PORT ?? 3000),
    });
  } else {
    // Engine mode (`npx rivetkit dev`): unchanged start() path.
    registry.start();
  }
}
