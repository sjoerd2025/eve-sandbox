import { createClient, type Client } from "@libsql/client";

// Load a local .env once (Node >= 20.12 built-in; no-op when absent or already
// loaded). Keeps secrets out of source while `process.env` reads stay simple.
try {
  process.loadEnvFile();
} catch {
  // no .env file — fine in production where env vars are injected
}

export interface SwarmDbConfig {
  url?: string;
  authToken?: string;
}

/** Defaults from the environment (ADR-001 key table). */
export function swarmDbConfigFromEnv(env: NodeJS.ProcessEnv = process.env): SwarmDbConfig {
  return {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  };
}

/** Create a libSQL client; tests pass `file:` URLs, production passes Turso creds. */
export function createSwarmDb(config: SwarmDbConfig = {}): Client {
  if (!config.url) {
    throw new Error(
      "Turso is not configured: set TURSO_DATABASE_URL/TURSO_AUTH_TOKEN or pass a url.",
    );
  }
  return createClient({ url: config.url, authToken: config.authToken });
}

/**
 * ADR-001 Phase 1 schema. Kept as a string (not a `.sql` import) so it bundles
 * cleanly with tsc/tsup/vitest; `src/swarm/schemas.sql` mirrors it for
 * `turso db shell swarm-db < schemas.sql`, and a unit test asserts they match.
 */
export const SWARM_SCHEMA_SQL =
  [
    `CREATE TABLE IF NOT EXISTS task_queue (
    id               TEXT PRIMARY KEY,
    queue_name       TEXT NOT NULL DEFAULT 'default',
    name             TEXT NOT NULL DEFAULT '',
    prompt           TEXT NOT NULL,
    status           TEXT NOT NULL DEFAULT 'PENDING'
                     CHECK (status IN ('PENDING', 'LEASED', 'COMPLETED', 'FAILED')),
    priority         INTEGER NOT NULL DEFAULT 0,
    attempts         INTEGER NOT NULL DEFAULT 0,
    max_attempts     INTEGER NOT NULL DEFAULT 3,
    leased_by        TEXT,
    lease_expires_at INTEGER,
    payload          TEXT NOT NULL DEFAULT '{}',
    result           TEXT,
    error            TEXT,
    created_at       INTEGER NOT NULL,
    updated_at       INTEGER NOT NULL
)`,
    `CREATE INDEX IF NOT EXISTS idx_task_queue_claim ON task_queue (
    queue_name, status, priority DESC, created_at ASC
)`,
    `CREATE INDEX IF NOT EXISTS idx_task_queue_lease ON task_queue (status, lease_expires_at)`,
    `CREATE INDEX IF NOT EXISTS idx_task_queue_worker ON task_queue (leased_by, status)`,
    `CREATE TABLE IF NOT EXISTS agent_sessions (
    id            TEXT PRIMARY KEY,
    task_id       TEXT REFERENCES task_queue(id),
    worker_id     TEXT NOT NULL,
    state         TEXT NOT NULL DEFAULT 'IDLE',
    prompt        TEXT NOT NULL,
    summary       TEXT,
    iterations    INTEGER NOT NULL DEFAULT 0,
    token_usage   TEXT NOT NULL DEFAULT '{}',
    created_at    INTEGER NOT NULL,
    updated_at    INTEGER NOT NULL
)`,
    `CREATE TABLE IF NOT EXISTS agent_audit_logs (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id   TEXT NOT NULL,
    task_id      TEXT,
    worker_id    TEXT NOT NULL,
    phase        TEXT NOT NULL,
    action       TEXT NOT NULL,
    detail       TEXT NOT NULL DEFAULT '{}',
    created_at   INTEGER NOT NULL
)`,
    `CREATE INDEX IF NOT EXISTS idx_audit_session ON agent_audit_logs (session_id, created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_audit_worker ON agent_audit_logs (worker_id, created_at)`,
  ].join(";\n") + ";";

/** Idempotently create the swarm tables and indexes. */
export async function migrateSwarmSchema(db: Client): Promise<void> {
  for (const statement of SWARM_SCHEMA_SQL.split(";")) {
    if (statement.trim()) await db.execute(statement);
  }
  // Migration: databases created before task naming existed lack the column.
  try {
    await db.execute("ALTER TABLE task_queue ADD COLUMN name TEXT NOT NULL DEFAULT ''");
  } catch (error) {
    if (!String(error).includes("duplicate column")) throw error;
  }
  await backfillQueueNamesFromPayload(db);
}

/**
 * Migration: rows enqueued before repo-named queues landed still carry
 * queue_name='default'. Their payload url (a GitHub issue link) identifies the
 * repo, so historical tasks group with newly enqueued ones. Idempotent: only
 * rows still on 'default' with a parseable url are touched.
 */
export async function backfillQueueNamesFromPayload(db: Client): Promise<number> {
  const rs = await db.execute(
    "SELECT id, payload FROM task_queue WHERE queue_name = 'default'",
  );
  let updated = 0;
  for (const row of rs.rows) {
    const repo = repoFromPayloadUrl(String(row.payload));
    if (repo === null) continue;
    await db.execute({
      sql: "UPDATE task_queue SET queue_name = ? WHERE id = ? AND queue_name = 'default'",
      args: [repo, String(row.id)],
    });
    updated++;
  }
  return updated;
}

/** Extract the repo name from a payload url like …/github.com/<owner>/<repo>/issues/<n>. */
function repoFromPayloadUrl(payload: string): string | null {
  try {
    const url: unknown = JSON.parse(payload)?.url;
    if (typeof url !== "string") return null;
    const m = url.match(/^https:\/\/github\.com\/[^/]+\/([^/]+)\/issues\//);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}
