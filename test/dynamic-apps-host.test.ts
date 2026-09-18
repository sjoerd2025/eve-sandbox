import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import host from "../src/dynamic-apps-host";

/**
 * Tests for the Dynamic Apps host (src/dynamic-apps-host.ts), driven through
 * Hono's `request()` helper — the full fetch handler with no port bound.
 *
 * Not covered here (needs live Rivet/cloud): the /internal/deploy-app happy
 * path (deployApp calls into the dynamic-apps control plane) and the control
 * plane callbacks under /api/rivet. Guards, failure modes, and liveness are
 * covered below.
 */

describe("dynamic-apps host", () => {
  it("reports liveness at /healthz", async () => {
    const res = await host.request("/healthz");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, host: "dynamic-apps" });
  });

  it("wires the generated-app mount (redirects into the apps router)", async () => {
    // appsRouter redirects bare app paths to their trailing-slash form; a
    // missing mount would 404 directly with Hono's own "404 Not Found" body.
    // (Following the redirect needs a live control plane, so it stays out of
    // this hermetic suite.)
    const res = await host.request("/apps/does-not-exist");
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBeTruthy();
  });

  it("rejects the deploy trigger without credentials", async () => {
    const res = await host.request("/internal/deploy-app", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ appId: "x", files: {} }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects the deploy trigger with a wrong bearer secret", async () => {
    const res = await host.request("/internal/deploy-app", {
      method: "POST",
      headers: { authorization: "Bearer wrong-secret", "content-type": "application/json" },
      body: JSON.stringify({ appId: "x", files: {} }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects the deploy trigger when the kill switch is set", async () => {
    const prev = process.env.DEPLOY_APP_SECRET;
    process.env.DEPLOY_APP_SECRET = "test-secret";
    process.env.DEPLOY_APP_DISABLED = "1";
    try {
      const res = await host.request("/internal/deploy-app", {
        method: "POST",
        headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
        body: JSON.stringify({ appId: "x", files: {} }),
      });
      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({ error: "deployments disabled" });
    } finally {
      if (prev === undefined) delete process.env.DEPLOY_APP_SECRET;
      else process.env.DEPLOY_APP_SECRET = prev;
      delete process.env.DEPLOY_APP_DISABLED;
    }
  });

  it("rejects invalid appIds and missing files", async () => {
    const prev = process.env.DEPLOY_APP_SECRET;
    process.env.DEPLOY_APP_SECRET = "test-secret";
    try {
      const headers = {
        authorization: "Bearer test-secret",
        "content-type": "application/json",
      } as const;
      const bad = await host.request("/internal/deploy-app", {
        method: "POST",
        headers,
        body: JSON.stringify({ appId: "../escape", files: {} }),
      });
      expect(bad.status).toBe(400);
      const noFiles = await host.request("/internal/deploy-app", {
        method: "POST",
        headers,
        body: JSON.stringify({ appId: "valid-app" }),
      });
      expect(noFiles.status).toBe(400);
    } finally {
      if (prev === undefined) delete process.env.DEPLOY_APP_SECRET;
      else process.env.DEPLOY_APP_SECRET = prev;
    }
  });

  // Regression test for the deployed-rollout failure on
  // beta-g2ly-production-kxh0 (2026-09-13): the entrypoint guard skipped
  // serve() when RIVETKIT_RUNTIME_MODE=serverless, leaving the container with
  // no listener (blanket upstream-error 502s). The guard must bind in all
  // modes. Asserted on the built dist (the module self-starts on import).
  it("entrypoint binds a listener in all runtime modes (C1 regression)", () => {
    const entry = readFileSync("dist/dynamic-apps-host.js", "utf-8");
    expect(
      !entry.includes("RIVETKIT_RUNTIME_MODE"),
      "the serve() guard must not consult RIVETKIT_RUNTIME_MODE",
    ).toBe(true);
    const guard = entry.match(/if \(([\s\S]{0,400}?)\)\s*\{\s*serve\(/);
    expect(guard, "serve() must be guarded by the entry check").toBeTruthy();
    expect(
      guard![1].includes("dynamic-apps-host"),
      "the guard must test the entrypoint (dynamic-apps-host), not the runtime mode",
    ).toBe(true);
  });
});
