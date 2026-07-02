import { describe, expect, it } from "vitest";
import type { SandboxSession } from "eve/sandbox";
import { e2b } from "../src/index";
import { buildSandboxSession, type E2BSessionPrimitives } from "../src/build-sandbox-session";
import { bufferToStream } from "../src/stream-utils";

describe("SandboxBackend contract", () => {
  it("e2b() exposes the backend surface Eve calls", () => {
    const backend = e2b({ template: "base" });
    expect(backend.name).toBe("e2b");
    expect(typeof backend.create).toBe("function");
    expect(typeof backend.prewarm).toBe("function");
  });

  it("the built session satisfies the public SandboxSession contract", () => {
    // Typed as SandboxSession — TypeScript enforces we implement the public
    // contract; the runtime check guards against a method going missing.
    const session: SandboxSession = buildSandboxSession(createTestPrimitives());
    for (const key of [
      "id",
      "resolvePath",
      "run",
      "spawn",
      "readFile",
      "readBinaryFile",
      "readTextFile",
      "writeFile",
      "writeBinaryFile",
      "writeTextFile",
      "removePath",
      "setNetworkPolicy",
    ]) {
      expect(session, `missing ${key}`).toHaveProperty(key);
    }
  });
});

function streamOf(text: string): ReadableStream<Uint8Array> {
  return bufferToStream(Buffer.from(text, "utf8"));
}

function createTestPrimitives(): E2BSessionPrimitives {
  return {
    id: "test-session-id",
    readFile: async () => streamOf("line1\nline2\nline3\n"),
    removePath: async () => {},
    resolvePath: (p) => (p.startsWith("/") ? p : `/workspace/${p}`),
    spawn: async () => ({
      stdout: streamOf("out\n"),
      stderr: streamOf("err\n"),
      wait: async () => ({ exitCode: 0 }),
      kill: async () => {},
    }),
    writeFile: async () => {},
  };
}
