// Byte-stream helpers, mirrored from eve (Apache-2.0):
// https://github.com/vercel/eve/blob/main/packages/eve/src/execution/sandbox/stream-utils.ts

/**
 * Collects all chunks of a `ReadableStream<Uint8Array>` into a single
 * Buffer.
 */
export async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/**
 * Wraps a byte buffer as a single-chunk `ReadableStream<Uint8Array>`.
 */
export function bufferToStream(buf: Uint8Array): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(buf);
      controller.close();
    },
  });
}

/** Drain a byte stream and decode it as UTF-8. */
export async function streamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  return (await streamToBuffer(stream)).toString("utf-8");
}
