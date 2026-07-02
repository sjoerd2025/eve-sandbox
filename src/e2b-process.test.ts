import { describe, expect, it, vi } from "vitest";
import { CommandExitError } from "e2b";
import { createSandboxProcess } from "./e2b-process";
import { streamToString } from "./stream-utils";

describe("createSandboxProcess", () => {
  it("streams stdout/stderr and resolves the exit code", async () => {
    const kill = vi.fn(async () => {});
    const process = await createSandboxProcess(undefined, ({ onStdout, onStderr }) => {
      onStdout("hello ");
      onStdout("world");
      onStderr("warn");
      return Promise.resolve({ pid: 7, wait: async () => ({ exitCode: 0 }), kill });
    });
    expect(process.pid).toBe(7);
    expect(await streamToString(process.stdout)).toBe("hello world");
    expect(await streamToString(process.stderr)).toBe("warn");
    expect(await process.wait()).toEqual({ exitCode: 0 });
  });

  it("reports a non-zero exit as a code instead of throwing (CommandExitError)", async () => {
    const process = await createSandboxProcess(undefined, ({ onStderr }) => {
      onStderr("boom");
      return Promise.resolve({
        pid: 1,
        wait: async () => {
          throw new CommandExitError({ exitCode: 2, stdout: "", stderr: "boom", error: "x" });
        },
        kill: async () => {},
      });
    });
    expect(await process.wait()).toEqual({ exitCode: 2 });
  });

  it("kills the remote process and rejects wait() when the signal is already aborted", async () => {
    const kill = vi.fn(async () => {});
    const controller = new AbortController();
    controller.abort();
    const process = await createSandboxProcess(controller.signal, () =>
      Promise.resolve({ pid: 1, wait: async () => ({ exitCode: 0 }), kill }),
    );
    await expect(process.wait()).rejects.toThrow();
    expect(kill).toHaveBeenCalled();
  });
});
