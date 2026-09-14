import { describe, expect, it } from "vitest";
import { createSwarmDb, backfillQueueNamesFromPayload, migrateSwarmSchema } from "./db";

describe("backfillQueueNamesFromPayload", () => {
  it("moves rows off 'default' to the payload url's repo, idempotently", async () => {
    const db = createSwarmDb({ url: ":memory:" });
    await migrateSwarmSchema(db);

    const insert = (id: string, payload: string) =>
      db.execute({
        sql: `INSERT INTO task_queue (id, queue_name, prompt, payload, created_at, updated_at)
              VALUES (?, 'default', 'p', ?, 1, 1)`,
        args: [id, payload],
      });
    const queueNameOf = async (id: string) => {
      const rs = await db.execute({
        sql: "SELECT queue_name FROM task_queue WHERE id = ?",
        args: [id],
      });
      return String(rs.rows[0].queue_name);
    };

    await insert("gh-1", JSON.stringify({ url: "https://github.com/acme/widget/issues/1" }));
    await insert("gh-2", JSON.stringify({ url: "https://github.com/acme/eve-sandbox/issues/2" }));
    await insert("no-url", "{}");
    await insert("already", JSON.stringify({ url: "https://github.com/acme/widget/issues/9" }));
    await db.execute({
      sql: "UPDATE task_queue SET queue_name = 'widget' WHERE id = 'already'",
      args: [],
    });

    expect(await backfillQueueNamesFromPayload(db)).toBe(2);

    expect(await queueNameOf("gh-1")).toBe("widget");
    expect(await queueNameOf("gh-2")).toBe("eve-sandbox");
    // No parseable url, or already moved: untouched.
    expect(await queueNameOf("no-url")).toBe("default");
    expect(await queueNameOf("already")).toBe("widget");

    // Second pass is a no-op.
    expect(await backfillQueueNamesFromPayload(db)).toBe(0);
  });
});
