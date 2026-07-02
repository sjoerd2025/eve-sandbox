// Example: drop this in your Eve project at `agent/sandbox.ts`.
// (Or `agent/sandbox/sandbox.ts` if you also seed files via a `workspace/` folder.)
import { defineSandbox } from "eve/sandbox";
import { e2b } from "@e2b/eve-sandbox";

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
