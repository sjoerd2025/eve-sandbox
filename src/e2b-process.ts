import { CommandExitError } from "e2b";
import type { SandboxProcess } from "eve/sandbox";

/** Minimal view of an E2B background command handle. */
interface BackgroundCommand {
  pid: number;
  wait: () => Promise<{ exitCode: number }>;
  kill: () => Promise<unknown>;
}

/**
 * Adapt an E2B background command to a {@link SandboxProcess}. The caller's
 * `start` receives `onStdout`/`onStderr` to wire into the command and returns
 * the handle; E2B streams output through those callbacks and we re-encode it
 * onto Web `ReadableStream`s, which close once the process exits or is killed.
 *
 * Ported from `@e2b/ai-sdk-sandbox` — same plumbing, retargeted at Eve's
 * `SandboxProcess` shape (`pid` is optional there but E2B always provides one).
 */
export async function createSandboxProcess(
  abortSignal: AbortSignal | undefined,
  start: (handlers: {
    onStdout: (data: string) => void;
    onStderr: (data: string) => void;
  }) => Promise<BackgroundCommand>,
): Promise<SandboxProcess> {
  const encoder = new TextEncoder();
  let stdoutController!: ReadableStreamDefaultController<Uint8Array>;
  let stderrController!: ReadableStreamDefaultController<Uint8Array>;
  const stdout = new ReadableStream<Uint8Array>({
    start: (controller) => {
      stdoutController = controller;
    },
  });
  const stderr = new ReadableStream<Uint8Array>({
    start: (controller) => {
      stderrController = controller;
    },
  });

  let closed = false;
  const closeStreams = () => {
    if (closed) return;
    closed = true;
    try {
      stdoutController.close();
    } catch {
      /* already closed */
    }
    try {
      stderrController.close();
    } catch {
      /* already closed */
    }
  };

  const handle = await start({
    onStdout: (data) => stdoutController.enqueue(encoder.encode(data)),
    onStderr: (data) => stderrController.enqueue(encoder.encode(data)),
  });

  // Resolve the exit code once, closing the streams as soon as the process
  // exits — independent of whether the caller awaits `wait()`. E2B's `wait()`
  // throws `CommandExitError` on a non-zero exit; we want the code, not a throw.
  const exit: Promise<{ exitCode: number }> = handle.wait().then(
    (result) => ({ exitCode: result.exitCode }),
    (error: unknown) => {
      if (error instanceof CommandExitError) return { exitCode: error.exitCode };
      throw error;
    },
  );
  exit.then(closeStreams, closeStreams);

  // On abort, kill the remote process (E2B does not necessarily terminate a
  // detached command when the request signal aborts) and make `wait()` reject
  // with the abort reason.
  if (abortSignal?.aborted) {
    void handle.kill().catch(() => {});
  } else if (abortSignal) {
    const onAbort = () => void handle.kill().catch(() => {});
    abortSignal.addEventListener("abort", onAbort, { once: true });
    void exit.finally(() => abortSignal.removeEventListener("abort", onAbort)).catch(() => {});
  }

  return {
    pid: handle.pid,
    stdout,
    stderr,
    async wait(): Promise<{ exitCode: number }> {
      try {
        const result = await exit;
        if (!abortSignal?.aborted) return result;
      } catch (error) {
        if (!abortSignal?.aborted) throw error;
      }
      // Aborted: surface the abort reason regardless of how `exit` settled.
      throw abortSignal?.reason ?? new DOMException("Aborted", "AbortError");
    },
    async kill(): Promise<void> {
      await handle.kill();
    },
  };
}
