import { describe, expect, it } from "vitest";
import { Sandbox } from "e2b";
import { e2b } from "../src/index";

// Live test: only runs when E2B_API_KEY is set. It boots a real sandbox, so it
// is slow and billable. Run with: E2B_API_KEY=... npm test
const hasKey = Boolean(process.env.E2B_API_KEY);

describe.skipIf(!hasKey)("e2b backend (live)", () => {
  it("creates a session, runs a command, and round-trips a /workspace file", async () => {
    const backend = e2b({ template: "base" });
    const sessionKey = `eve-e2b-test-${process.pid}-${Date.now()}`;
    const handle = await backend.create({
      templateKey: null,
      sessionKey,
      runtimeContext: { appRoot: process.cwd() },
    });

    const { metadata } = await handle.captureState();
    const sandboxId = metadata["sandboxId"] as string;
    try {
      const run = await handle.session.run({
        command: "echo hi > /workspace/t.txt && cat /workspace/t.txt && whoami",
      });
      expect(run.exitCode).toBe(0);
      expect(run.stdout).toContain("hi");

      const text = await handle.session.readTextFile({ path: "t.txt" });
      expect(text?.trim()).toBe("hi");

      await handle.session.removePath({ path: "t.txt" });
      expect(await handle.session.readTextFile({ path: "t.txt" })).toBeNull();
    } finally {
      // dispose() is intentionally a no-op, so kill the sandbox to clean up.
      await Sandbox.connect(sandboxId)
        .then((s) => s.kill())
        .catch(() => {});
    }
  }, 120_000);
});
