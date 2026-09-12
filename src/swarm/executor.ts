import { spawn } from "node:child_process";
import type { SamExecutor } from "./sam";

/**
 * Dev/tests-only executor: run SAM commands in a local bash. Production
 * deployments replace this with a VM/microVM executor (zero-trust isolation).
 */
export const localExecutor: SamExecutor = {
  async exec(command) {
    return new Promise((resolve) => {
      const child = spawn("bash", ["-c", command]);
      let stdout = "";
      let stderr = "";
      const timer = setTimeout(() => child.kill("SIGKILL"), 60_000);
      child.stdout.on("data", (d) => (stdout += d.toString()));
      child.stderr.on("data", (d) => (stderr += d.toString()));
      child.on("close", (code) => {
        clearTimeout(timer);
        resolve({ exitCode: code ?? -1, stdout, stderr });
      });
      child.on("error", (err) => {
        clearTimeout(timer);
        resolve({ exitCode: -1, stdout, stderr: stderr + err.message });
      });
    });
  },
};
