/**
 * Portions of this file (the line-range / encoding primitives:
 * `splitLinesPreservingEndings`, `applyLineRange`, `validateReadTextFileOptions`,
 * `decodeBytes`, `encodeString`, and the `buildSandboxSession` shape) are adapted
 * from `src/execution/sandbox/session.js` in Vercel's `eve` package.
 *
 * We port rather than import these because eve does not export `buildSandboxSession`
 * or its internal helpers — they live in eve's private sandbox layer. Mirroring the
 * logic here lets our E2B-backed `SandboxSession` behave byte-for-byte like eve's
 * built-in sessions (identical line-range slicing, encoding, and validation), so the
 * E2B backend is a drop-in for code that expects eve's sandbox semantics.
 *
 * eve — Copyright 2026 Vercel, Inc. and contributors (https://vercel.com/)
 * Licensed under the Apache License, Version 2.0.
 * See https://github.com/vercel/eve and http://www.apache.org/licenses/LICENSE-2.0
 */
import type {
  SandboxSession,
  SandboxProcess,
  SandboxSpawnOptions,
  SandboxReadTextFileOptions,
  SandboxNetworkPolicy,
} from "eve/sandbox";
import { bufferToStream, streamToBuffer, streamToString } from "./stream-utils";

/**
 * The small set of byte-oriented primitives our E2B session is built from.
 * {@link buildSandboxSession} derives the full public {@link SandboxSession}
 * (text/binary variants, line slicing, `run`) from these, so the E2B layer only
 * implements raw spawn + file I/O. Paths handed to `readFile`/`writeFile`/
 * `removePath` are already resolved (the builder calls `resolvePath` first).
 */
export interface E2BSessionPrimitives {
  readonly id: string;
  resolvePath(path: string): string;
  spawn(options: SandboxSpawnOptions): Promise<SandboxProcess>;
  readFile(options: {
    path: string;
    abortSignal?: AbortSignal;
  }): Promise<ReadableStream<Uint8Array> | null>;
  writeFile(options: {
    path: string;
    content: ReadableStream<Uint8Array>;
    abortSignal?: AbortSignal;
  }): Promise<void>;
  removePath(options: {
    path: string;
    force?: boolean;
    recursive?: boolean;
    abortSignal?: AbortSignal;
  }): Promise<void>;
}

export type NetworkPolicySetter = (policy: SandboxNetworkPolicy) => Promise<void>;

/**
 * Build the public {@link SandboxSession} (which Eve exports as a type, but
 * whose builder it keeps internal) from our {@link E2BSessionPrimitives}:
 * `run` is `spawn` + stream collection + `wait`; the text/binary file variants
 * are encode/decode wrappers over the byte-stream primitives; every path is
 * resolved before delegating. This is our own implementation of the public
 * contract — we depend only on the exported `SandboxSession` type.
 */
export function buildSandboxSession(
  internal: E2BSessionPrimitives,
  setNetworkPolicy: NetworkPolicySetter = async () => {},
): SandboxSession {
  return {
    id: internal.id,
    resolvePath(path) {
      return internal.resolvePath(path);
    },
    async run(options) {
      const process = await internal.spawn(options);
      const [stdout, stderr, { exitCode }] = await Promise.all([
        streamToString(process.stdout),
        streamToString(process.stderr),
        process.wait(),
      ]);
      return { exitCode, stdout, stderr };
    },
    async spawn(options) {
      return internal.spawn(options);
    },
    async readFile(options) {
      return internal.readFile({
        abortSignal: options.abortSignal,
        path: internal.resolvePath(options.path),
      });
    },
    async readBinaryFile(options) {
      const stream = await internal.readFile({
        abortSignal: options.abortSignal,
        path: internal.resolvePath(options.path),
      });
      if (stream === null) return null;
      const bytes = await streamToBuffer(stream);
      return new Uint8Array(bytes);
    },
    async readTextFile(options) {
      validateReadTextFileOptions(options);
      const stream = await internal.readFile({
        abortSignal: options.abortSignal,
        path: internal.resolvePath(options.path),
      });
      if (stream === null) return null;
      const bytes = await streamToBuffer(stream);
      return applyLineRange(decodeBytes(bytes, options.encoding ?? "utf-8"), options);
    },
    async writeFile(options) {
      await internal.writeFile({
        abortSignal: options.abortSignal,
        content: options.content,
        path: internal.resolvePath(options.path),
      });
    },
    async writeBinaryFile(options) {
      await internal.writeFile({
        abortSignal: options.abortSignal,
        content: bufferToStream(options.content),
        path: internal.resolvePath(options.path),
      });
    },
    async writeTextFile(options) {
      const bytes = encodeString(options.content, options.encoding ?? "utf-8");
      await internal.writeFile({
        abortSignal: options.abortSignal,
        content: bufferToStream(bytes),
        path: internal.resolvePath(options.path),
      });
    },
    async removePath(options) {
      await internal.removePath({
        abortSignal: options.abortSignal,
        force: options.force,
        path: internal.resolvePath(options.path),
        recursive: options.recursive,
      });
    },
    setNetworkPolicy,
  };
}

function validateReadTextFileOptions(options: SandboxReadTextFileOptions): void {
  const { startLine, endLine } = options;
  if (startLine !== undefined && (!Number.isInteger(startLine) || startLine < 1)) {
    throw new Error("startLine must be a positive integer (1-based).");
  }
  if (endLine !== undefined && (!Number.isInteger(endLine) || endLine < 1)) {
    throw new Error("endLine must be a positive integer (1-based).");
  }
  if (startLine !== undefined && endLine !== undefined && startLine > endLine) {
    throw new Error("startLine must not be greater than endLine.");
  }
}

function splitLinesPreservingEndings(text: string): string[] {
  const lines: string[] = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\r") {
      if (i + 1 < text.length && text[i + 1] === "\n") {
        lines.push(text.slice(start, i + 2));
        start = i + 2;
        i++;
      } else {
        lines.push(text.slice(start, i + 1));
        start = i + 1;
      }
    } else if (text[i] === "\n") {
      lines.push(text.slice(start, i + 1));
      start = i + 1;
    }
  }
  if (start < text.length) lines.push(text.slice(start));
  return lines;
}

function applyLineRange(text: string, options: { startLine?: number; endLine?: number }): string {
  if (options.startLine === undefined && options.endLine === undefined) {
    return text;
  }
  const lines = splitLinesPreservingEndings(text);
  const count = lines.length;
  const start = options.startLine ?? 1;
  const end = Math.min(options.endLine ?? count, count);
  if (start > count) return "";
  return lines.slice(start - 1, end).join("");
}

function decodeBytes(bytes: Uint8Array, encoding: string): string {
  if (encoding === "utf-8" || encoding === "utf8") {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  }
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString(
    encoding as BufferEncoding,
  );
}

function encodeString(content: string, encoding: string): Uint8Array {
  if (encoding === "utf-8" || encoding === "utf8") {
    return new TextEncoder().encode(content);
  }
  const buffer = Buffer.from(content, encoding as BufferEncoding);
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
}
