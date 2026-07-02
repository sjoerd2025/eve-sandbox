import { describe, expect, it, vi } from "vitest";
import type { SandboxProcess } from "eve/sandbox";
import { buildSandboxSession, type E2BSessionPrimitives } from "./build-sandbox-session";
import { bufferToStream, streamToBuffer } from "./stream-utils";

function textStream(content: string): ReadableStream<Uint8Array> {
  return bufferToStream(Buffer.from(content, "utf8"));
}

function syntheticProcess(input: {
  exitCode?: number;
  stdout?: string;
  stderr?: string;
}): SandboxProcess {
  return {
    stdout: textStream(input.stdout ?? ""),
    stderr: textStream(input.stderr ?? ""),
    async wait() {
      return { exitCode: input.exitCode ?? 0 };
    },
    async kill() {},
  };
}

function createTestPrimitives(overrides: Partial<E2BSessionPrimitives> = {}): E2BSessionPrimitives {
  return {
    id: overrides.id ?? "test-session-id",
    readFile: overrides.readFile ?? vi.fn(async () => null),
    removePath: overrides.removePath ?? vi.fn(async () => {}),
    resolvePath: overrides.resolvePath ?? ((path: string) => `/resolved/${path}`),
    spawn: overrides.spawn ?? vi.fn(async () => syntheticProcess({})),
    writeFile: overrides.writeFile ?? vi.fn(async () => {}),
  };
}

describe("buildSandboxSession", () => {
  // ---------------------------------------------------------------------------
  // id
  // ---------------------------------------------------------------------------

  it("exposes the primitives id as the public session id", () => {
    const session = buildSandboxSession(createTestPrimitives({ id: "sbx-123" }));

    expect(session.id).toBe("sbx-123");
  });

  // ---------------------------------------------------------------------------
  // setNetworkPolicy
  // ---------------------------------------------------------------------------

  it("forwards setNetworkPolicy to the supplied applier", async () => {
    const apply = vi.fn(async () => {});
    const session = buildSandboxSession(createTestPrimitives(), apply);

    await session.setNetworkPolicy("deny-all");

    expect(apply).toHaveBeenCalledWith("deny-all");
  });

  it("defaults setNetworkPolicy to a no-op when no applier is supplied", async () => {
    const session = buildSandboxSession(createTestPrimitives());

    await expect(session.setNetworkPolicy("deny-all")).resolves.toBeUndefined();
  });

  // ---------------------------------------------------------------------------
  // resolvePath
  // ---------------------------------------------------------------------------

  it("exposes resolvePath through the public session", () => {
    const resolvePath = vi.fn((path: string) => `/resolved/${path}`);
    const session = buildSandboxSession(createTestPrimitives({ resolvePath }));

    expect(session.resolvePath("notes/todo.txt")).toBe("/resolved/notes/todo.txt");
    expect(resolvePath).toHaveBeenCalledWith("notes/todo.txt");
  });

  // ---------------------------------------------------------------------------
  // removePath
  // ---------------------------------------------------------------------------

  it("resolves removePath paths before delegating to the primitive", async () => {
    const removePath = vi.fn(async () => {});
    const session = buildSandboxSession(
      createTestPrimitives({
        removePath,
        resolvePath: (path) => `/workspace/${path}`,
      }),
    );

    await session.removePath({ force: true, path: "skills/tenant", recursive: true });

    expect(removePath).toHaveBeenCalledWith({
      abortSignal: undefined,
      force: true,
      path: "/workspace/skills/tenant",
      recursive: true,
    });
  });

  // ---------------------------------------------------------------------------
  // run / spawn
  // ---------------------------------------------------------------------------

  it("implements run by collecting stdout/stderr from the spawn primitive", async () => {
    const spawn = vi.fn(async () =>
      syntheticProcess({ exitCode: 3, stderr: "oops", stdout: "hello" }),
    );
    const session = buildSandboxSession(createTestPrimitives({ spawn }));

    const result = await session.run({ command: "echo hello" });

    expect(spawn).toHaveBeenCalledWith({ command: "echo hello" });
    expect(result).toEqual({ exitCode: 3, stderr: "oops", stdout: "hello" });
  });

  it("delegates spawn directly to the primitive", async () => {
    const process = syntheticProcess({ exitCode: 7, stdout: "live" });
    const spawn = vi.fn(async () => process);
    const session = buildSandboxSession(createTestPrimitives({ spawn }));

    const handle = await session.spawn({ command: "tail -f log" });

    expect(spawn).toHaveBeenCalledWith({ command: "tail -f log" });
    expect(handle).toBe(process);
  });

  // ---------------------------------------------------------------------------
  // writeFile (stream)
  // ---------------------------------------------------------------------------

  it("resolves the path and forwards the stream verbatim to the primitive", async () => {
    let capturedPath: string | undefined;
    let capturedBytes: Buffer | undefined;
    const session = buildSandboxSession(
      createTestPrimitives({
        resolvePath: (path) => `/workspace/${path}`,
        writeFile: async ({ path, content }) => {
          capturedPath = path;
          capturedBytes = await streamToBuffer(content);
        },
      }),
    );

    await session.writeFile({ content: textStream("buy milk"), path: "notes/todo.txt" });

    expect(capturedPath).toBe("/workspace/notes/todo.txt");
    expect(capturedBytes?.toString("utf8")).toBe("buy milk");
  });

  // ---------------------------------------------------------------------------
  // writeBinaryFile
  // ---------------------------------------------------------------------------

  it("passes Uint8Array content through writeBinaryFile without lossy conversion", async () => {
    let capturedBytes: Buffer | undefined;
    const session = buildSandboxSession(
      createTestPrimitives({
        resolvePath: (path) => `/workspace/${path}`,
        writeFile: async ({ content }) => {
          capturedBytes = await streamToBuffer(content);
        },
      }),
    );
    const bytes = new Uint8Array([0x00, 0x01, 0x02, 0xff]);

    await session.writeBinaryFile({ content: bytes, path: "assets/binary.bin" });

    expect(capturedBytes).toEqual(Buffer.from(bytes));
  });

  // ---------------------------------------------------------------------------
  // writeTextFile
  // ---------------------------------------------------------------------------

  it("encodes a string as utf-8 bytes through writeTextFile by default", async () => {
    let capturedPath: string | undefined;
    let capturedBytes: Buffer | undefined;
    const session = buildSandboxSession(
      createTestPrimitives({
        resolvePath: (path) => `/workspace/${path}`,
        writeFile: async ({ path, content }) => {
          capturedPath = path;
          capturedBytes = await streamToBuffer(content);
        },
      }),
    );

    await session.writeTextFile({ content: "buy milk", path: "notes/todo.txt" });

    expect(capturedPath).toBe("/workspace/notes/todo.txt");
    expect(capturedBytes).toEqual(Buffer.from("buy milk", "utf8"));
  });

  // ---------------------------------------------------------------------------
  // readBinaryFile
  // ---------------------------------------------------------------------------

  it("collects the readFile stream into a Uint8Array for readBinaryFile", async () => {
    const bytes = Buffer.from([0x00, 0x01, 0x02, 0xff]);
    const readFile = vi.fn(async () => textStreamFromBytes(bytes));
    const session = buildSandboxSession(
      createTestPrimitives({
        readFile,
        resolvePath: (path) => `/workspace/${path}`,
      }),
    );

    const result = await session.readBinaryFile({ path: "assets/binary.bin" });

    expect(readFile).toHaveBeenCalledWith({
      abortSignal: undefined,
      path: "/workspace/assets/binary.bin",
    });
    expect(result).toEqual(new Uint8Array(bytes));
  });

  it("returns null when readBinaryFile target is missing", async () => {
    const session = buildSandboxSession(createTestPrimitives({ readFile: async () => null }));

    await expect(session.readBinaryFile({ path: "missing.bin" })).resolves.toBeNull();
  });

  // ---------------------------------------------------------------------------
  // readFile (stream)
  // ---------------------------------------------------------------------------

  it("returns the underlying stream from readFile verbatim", async () => {
    const session = buildSandboxSession(
      createTestPrimitives({ readFile: async () => textStream("streamed content") }),
    );

    const stream = await session.readFile({ path: "f.txt" });

    expect(stream).not.toBeNull();
    expect((await streamToBuffer(stream as ReadableStream<Uint8Array>)).toString("utf8")).toBe(
      "streamed content",
    );
  });

  // ---------------------------------------------------------------------------
  // readTextFile — basic
  // ---------------------------------------------------------------------------

  it("returns null when the file does not exist", async () => {
    const session = buildSandboxSession(createTestPrimitives());

    expect(await session.readTextFile({ path: "missing.txt" })).toBeNull();
  });

  it("returns the full file content when no options are provided", async () => {
    const session = buildSandboxSession(
      createTestPrimitives({ readFile: async () => textStream("line one\nline two\n") }),
    );

    expect(await session.readTextFile({ path: "file.txt" })).toBe("line one\nline two\n");
  });

  it("resolves the path before reading", async () => {
    const readFile = vi.fn(async () => textStream("content"));
    const session = buildSandboxSession(
      createTestPrimitives({ readFile, resolvePath: (path) => `/cwd/${path}` }),
    );

    await session.readTextFile({ path: "relative.txt" });

    expect(readFile).toHaveBeenCalledWith({
      abortSignal: undefined,
      path: "/cwd/relative.txt",
    });
  });

  // ---------------------------------------------------------------------------
  // readTextFile — line ranges
  // ---------------------------------------------------------------------------

  it("returns a single line with startLine and endLine equal", async () => {
    const session = buildSandboxSession(
      createTestPrimitives({ readFile: async () => textStream("alpha\nbeta\ngamma\n") }),
    );

    expect(await session.readTextFile({ endLine: 2, path: "f.txt", startLine: 2 })).toBe("beta\n");
  });

  it("returns a range of lines", async () => {
    const session = buildSandboxSession(
      createTestPrimitives({ readFile: async () => textStream("one\ntwo\nthree\nfour\n") }),
    );

    expect(await session.readTextFile({ endLine: 3, path: "f.txt", startLine: 2 })).toBe(
      "two\nthree\n",
    );
  });

  it("returns from startLine through EOF when endLine is omitted", async () => {
    const session = buildSandboxSession(
      createTestPrimitives({ readFile: async () => textStream("a\nb\nc") }),
    );

    expect(await session.readTextFile({ path: "f.txt", startLine: 2 })).toBe("b\nc");
  });

  it("clamps endLine to EOF without error", async () => {
    const session = buildSandboxSession(
      createTestPrimitives({ readFile: async () => textStream("a\nb\n") }),
    );

    expect(await session.readTextFile({ endLine: 999, path: "f.txt", startLine: 1 })).toBe(
      "a\nb\n",
    );
  });

  it("returns empty string when startLine is past EOF", async () => {
    const session = buildSandboxSession(
      createTestPrimitives({ readFile: async () => textStream("only\n") }),
    );

    expect(await session.readTextFile({ path: "f.txt", startLine: 5 })).toBe("");
  });

  // ---------------------------------------------------------------------------
  // readTextFile — preserves original line endings
  // ---------------------------------------------------------------------------

  it("preserves CRLF line endings in ranged reads", async () => {
    const session = buildSandboxSession(
      createTestPrimitives({
        readFile: async () => textStream("alpha\r\nbeta\r\ngamma\r\n"),
      }),
    );

    expect(await session.readTextFile({ endLine: 2, path: "f.txt", startLine: 1 })).toBe(
      "alpha\r\nbeta\r\n",
    );
  });

  it("handles a file without a trailing newline", async () => {
    const session = buildSandboxSession(
      createTestPrimitives({ readFile: async () => textStream("first\nsecond") }),
    );

    expect(await session.readTextFile({ endLine: 2, path: "f.txt", startLine: 2 })).toBe("second");
  });

  // ---------------------------------------------------------------------------
  // readTextFile — validation
  // ---------------------------------------------------------------------------

  it("throws for a zero or non-integer startLine", async () => {
    const session = buildSandboxSession(createTestPrimitives());

    await expect(session.readTextFile({ path: "f.txt", startLine: 0 })).rejects.toThrow(
      "startLine must be a positive integer (1-based).",
    );
  });

  it("throws when startLine exceeds endLine", async () => {
    const session = buildSandboxSession(createTestPrimitives());

    await expect(session.readTextFile({ endLine: 2, path: "f.txt", startLine: 5 })).rejects.toThrow(
      "startLine must not be greater than endLine.",
    );
  });
});

/** Byte-exact stream (avoids utf-8 round-tripping for binary fixtures). */
function textStreamFromBytes(bytes: Uint8Array): ReadableStream<Uint8Array> {
  return bufferToStream(bytes);
}
