import { randomUUID } from "node:crypto";
import type { Client, InValue, ResultSet } from "@libsql/client";

/** ADR-001 §2: statuses bounded to this set — no dynamic states. */
export type TaskStatus = "PENDING" | "LEASED" | "COMPLETED" | "FAILED";

export interface TaskRow {
  id: string;
  queue_name: string;
  /** Human-readable task name (slug derived from the prompt when not given). */
  name: string;
  prompt: string;
  status: TaskStatus;
  priority: number;
  attempts: number;
  max_attempts: number;
  leased_by: string | null;
  lease_expires_at: number | null;
  payload: string;
  result: string | null;
  error: string | null;
  created_at: number;
  updated_at: number;
}

export interface EnqueueTaskInput {
  prompt: string;
  /** Human-readable name; derived from the prompt when omitted. */
  name?: string;
  queueName?: string;
  priority?: number;
  maxAttempts?: number;
  payload?: Record<string, unknown>;
  id?: string;
}

export interface ClaimedTask {
  task: TaskRow;
  /** Renew the lease while working (heartbeat). */
  heartbeat: (extendMs?: number) => Promise<boolean>;
  /** Mark COMPLETED with a result payload. */
  complete: (result: Record<string, unknown>) => Promise<void>;
  /** Mark FAILED (terminal — no further retries). */
  fail: (error: string) => Promise<void>;
}

export interface ClaimOptions {
  /** Queue to claim from. Default "default" (or the constructor default). */
  queueName?: string;
  /** Lease duration in ms. Default 60s; renewed via heartbeat. */
  leaseMs?: number;
  /** Reap expired leases before claiming (default true). */
  reap?: boolean;
}

const DEFAULT_LEASE_MS = 60_000;
const DEFAULT_QUEUE = "default";

/**
 * Derive a short human-readable task name from a prompt (or issue title):
 * lowercase, alphanumeric words joined with dashes, truncated to 48 chars.
 * Falls back to a timestamped name when nothing usable survives slugification.
 */
export function deriveTaskName(prompt: string): string {
  const slug = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8)
    .join("-")
    .slice(0, 48)
    .replace(/-+$/, "");
  return slug || `task-${new Date().toISOString().slice(0, 10)}`;
}

/**
 * Execute a statement with retry on libSQL lock contention — many workers
 * polling one Turso database hit `busy`/`locked` under load. Exponential
 * backoff + jitter, then surface non-retryable errors immediately.
 */
async function execWithRetry(
  db: Client,
  stmt: { sql: string; args?: InValue[] },
): Promise<ResultSet> {
  const maxRetries = 10;
  let delay = 10;
  for (let attempt = 1; ; attempt++) {
    try {
      return await db.execute(stmt);
    } catch (error) {
      const message = String(error).toLowerCase();
      const retryable =
        message.includes("busy") || message.includes("locked") || message.includes("conflict");
      if (!retryable || attempt >= maxRetries) throw error;
      const jitter = Math.random() * 50;
      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(delay * 2 ** attempt, 2000) + jitter),
      );
    }
  }
}

/**
 * Map a libSQL row (values may be number | bigint | string) into a typed
 * {@link TaskRow}.
 */
function mapTaskRow(row: Record<string, unknown>): TaskRow {
  const num = (v: unknown): number =>
    typeof v === "bigint" ? Number(v) : typeof v === "string" ? Number(v) : (v as number);
  const str = (v: unknown): string | null => (v === null || v === undefined ? null : String(v));
  return {
    id: String(row.id),
    queue_name: String(row.queue_name),
    name: String(row.name ?? ""),
    prompt: String(row.prompt),
    status: String(row.status) as TaskStatus,
    priority: num(row.priority),
    attempts: num(row.attempts),
    max_attempts: num(row.max_attempts),
    leased_by: str(row.leased_by),
    lease_expires_at:
      row.lease_expires_at === null || row.lease_expires_at === undefined
        ? null
        : num(row.lease_expires_at),
    payload: String(row.payload ?? "{}"),
    result: str(row.result),
    error: str(row.error),
    created_at: num(row.created_at),
    updated_at: num(row.updated_at),
  };
}

/**
 * ADR-001 Phase 3: pull-based competing-consumer queue on Turso (libSQL).
 *
 * No broker daemon: workers claim atomically via `BEGIN IMMEDIATE` +
 * `UPDATE ... RETURNING`, hold a heartbeat lease, and expired leases are reaped
 * back to PENDING with a retry-count increment — crash recovery without Redis.
 */
export class TaskQueue {
  /** The underlying libSQL client (for audit writes etc.). */
  readonly db: Client;

  constructor(
    db: Client,
    private readonly defaults: { leaseMs?: number } = {},
  ) {
    this.db = db;
  }

  /** Insert a task as PENDING. Idempotent per id (existing rows are returned). */
  async enqueue(input: EnqueueTaskInput): Promise<TaskRow> {
    const id = input.id ?? randomUUID();
    const t = Date.now();
    const rs = await execWithRetry(this.db, {
      sql: `INSERT INTO task_queue
              (id, queue_name, name, prompt, status, priority, attempts, max_attempts, payload, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'PENDING', ?, 0, ?, ?, ?, ?)
            ON CONFLICT(id) DO NOTHING
            RETURNING *`,
      args: [
        id,
        input.queueName ?? DEFAULT_QUEUE,
        input.name ?? deriveTaskName(input.prompt),
        input.prompt,
        input.priority ?? 0,
        input.maxAttempts ?? 3,
        JSON.stringify(input.payload ?? {}),
        t,
        t,
      ],
    });
    const [task] = rs.rows.map((r) => mapTaskRow(r as unknown as Record<string, unknown>));
    if (task) return task;
    // Conflict suppressed the insert — return the existing row.
    const existing = await this.db.execute({
      sql: "SELECT * FROM task_queue WHERE id = ?",
      args: [id],
    });
    const [found] = existing.rows.map((r) => mapTaskRow(r as unknown as Record<string, unknown>));
    if (!found) throw new Error(`enqueue: task ${id} vanished`);
    return found;
  }

  /**
   * Atomically claim the next PENDING task: reaps expired leases, then claims
   * inside one immediate transaction so two workers can never hold one task.
   * Returns null when the queue is empty.
   */
  async claimNextTask(workerId: string, options: ClaimOptions = {}): Promise<ClaimedTask | null> {
    const leaseMs = options.leaseMs ?? this.defaults.leaseMs ?? DEFAULT_LEASE_MS;
    const queueName = options.queueName ?? DEFAULT_QUEUE;
    const t = Date.now();

    if (options.reap !== false) await this.reapExpiredLeases();

    // The UPDATE's subquery and write run as one atomic statement, so two
    // workers can never claim the same task; libSQL's batch() keeps the
    // immediate transaction (write lock up front) for remote Turso too.
    const results = await this.db.batch(
      [
        {
          sql: `UPDATE task_queue
                SET status = 'LEASED',
                    leased_by = ?,
                    lease_expires_at = ?,
                    attempts = attempts + 1,
                    updated_at = ?
                WHERE id = (
                    SELECT id FROM task_queue
                    WHERE queue_name = ? AND status = 'PENDING'
                    ORDER BY priority DESC, created_at ASC
                    LIMIT 1
                )
                RETURNING *`,
          args: [workerId, t + leaseMs, t, queueName],
        },
      ],
      "write",
    );
    const [claimed] = (results[0]?.rows ?? []).map((r) =>
      mapTaskRow(r as unknown as Record<string, unknown>),
    );
    return claimed ? this.handles(claimed, leaseMs) : null;
  }

  /** True when the queue has claimable PENDING work (dispatcher gate). */
  async hasPending(queueName: string = DEFAULT_QUEUE): Promise<boolean> {
    const rs = await execWithRetry(this.db, {
      sql: `SELECT 1 FROM task_queue
            WHERE queue_name = ? AND status = 'PENDING' LIMIT 1`,
      args: [queueName],
    });
    return rs.rows.length > 0;
  }

  /**
   * Reset expired LEASED tasks to PENDING (crash recovery); tasks whose
   * retries are exhausted go straight to FAILED. Returns the reaped count.
   */
  async reapExpiredLeases(): Promise<number> {
    const t = Date.now();
    const rs = await execWithRetry(this.db, {
      sql: `UPDATE task_queue
            SET status = 'PENDING', leased_by = NULL, lease_expires_at = NULL, updated_at = ?
            WHERE status = 'LEASED' AND lease_expires_at < ?
            RETURNING id, attempts, max_attempts`,
      args: [t, t],
    });
    for (const row of rs.rows) {
      if (Number(row.attempts) >= Number(row.max_attempts)) {
        await this.db.execute({
          sql: `UPDATE task_queue
                SET status = 'FAILED', error = COALESCE(error, 'lease expired after max attempts'), updated_at = ?
                WHERE id = ? AND status = 'PENDING'`,
          args: [Date.now(), String(row.id)],
        });
      }
    }
    return rs.rows.length;
  }

  /** Mark a task COMPLETED by id with a result payload (workflow runner path). */
  async completeById(id: string, result: Record<string, unknown>): Promise<void> {
    await execWithRetry(this.db, {
      sql: `UPDATE task_queue SET status = 'COMPLETED', result = ?, lease_expires_at = NULL, updated_at = ?
            WHERE id = ? AND status = 'LEASED'`,
      args: [JSON.stringify(result), Date.now(), id],
    });
  }

  /** Mark a task FAILED by id with an error message (workflow runner path). */
  async failById(id: string, error: string): Promise<void> {
    await execWithRetry(this.db, {
      sql: `UPDATE task_queue SET status = 'FAILED', error = ?, lease_expires_at = NULL, updated_at = ?
            WHERE id = ? AND status = 'LEASED'`,
      args: [error, Date.now(), id],
    });
  }

  /** Snapshot of queue depths by status (bounded labels: status + queue_name). */
  async queueDepth(queueName: string = DEFAULT_QUEUE): Promise<Record<TaskStatus, number>> {
    const rs = await this.db.execute({
      sql: "SELECT status, COUNT(*) AS n FROM task_queue WHERE queue_name = ? GROUP BY status",
      args: [queueName],
    });
    const depth: Record<TaskStatus, number> = { PENDING: 0, LEASED: 0, COMPLETED: 0, FAILED: 0 };
    for (const row of rs.rows) {
      const status = String(row.status) as TaskStatus;
      if (status in depth) depth[status] = Number(row.n);
    }
    return depth;
  }

  private handles(task: TaskRow, leaseMs: number): ClaimedTask {
    const db = this.db;
    return {
      task,
      heartbeat: async (extendMs = leaseMs) => {
        const t = Date.now();
        const rs = await db.execute({
          sql: `UPDATE task_queue SET lease_expires_at = ?, updated_at = ?
                WHERE id = ? AND status = 'LEASED' AND leased_by = ?
                RETURNING id`,
          args: [t + extendMs, t, task.id, task.leased_by],
        });
        return rs.rows.length > 0;
      },
      complete: async (result) => {
        await db.execute({
          sql: `UPDATE task_queue SET status = 'COMPLETED', result = ?, lease_expires_at = NULL, updated_at = ?
                WHERE id = ? AND status = 'LEASED' AND leased_by = ?`,
          args: [JSON.stringify(result), Date.now(), task.id, task.leased_by],
        });
      },
      fail: async (error) => {
        await db.execute({
          sql: `UPDATE task_queue SET status = 'FAILED', error = ?, lease_expires_at = NULL, updated_at = ?
                WHERE id = ? AND status = 'LEASED' AND leased_by = ?`,
          args: [error, Date.now(), task.id, task.leased_by],
        });
      },
    };
  }
}
