import { defineSandbox } from "eve/sandbox";
import { e2b } from "@e2b/eve-sandbox";

/**
 * Default: E2B sandboxes. Eve runs every sandbox session (code execution,
 * file I/O, shell) in an ephemeral E2B sandbox, while Rivet World + agentOS
 * provide durable workflow orchestration.
 *
 * Set E2B_API_KEY in the environment.
 */
export default defineSandbox({
  // Factory form defers reading env vars until first access and memoizes the
  // backend (so its prewarmed-snapshot cache is preserved across calls).
  backend: () =>
    e2b({
      template: "base",
      timeoutMs: 30 * 60 * 1000,
      envs: { NODE_ENV: "production" },
      // apiKey defaults to process.env.E2B_API_KEY
    }),

  // Runs once at build time; its result is captured into a reusable snapshot.
  async bootstrap({ use }) {
    const sandbox = await use();
    await sandbox.run({ command: "sudo apt-get install -y jq" });
  },

  // Runs once per live session (e.g. tighten egress for the turn).
  async onSession({ use }) {
    await use({ networkPolicy: { allow: ["*.npmjs.org", "github.com"] } });
  },
});

/**
 * Alternative: run sandbox sessions on Rivet agentOS VMs instead of E2B.
 * Requires `eve dev` (or your deployed server) to be running the `vm` actor
 * from `actors.ts`. Swap the default export for:
 *
 * ```ts
 * import { agentOSBackend } from "@rivet-dev/agentos-eve";
 * import { registry } from "../actors";
 *
 * export default defineSandbox({
 *   backend: agentOSBackend({ actor: "vm", registry }),
 * });
 * ```
 *
 * Trade-offs (see https://rivet.dev/agentos/integrations/vercel-eve):
 * - agentOS: durable filesystem + session history, no E2B account needed,
 *   same process/infra as your World actors.
 * - E2B: firewall with domain-level network policies, snapshot-backed
 *   prewarm, credential brokering.
 */
