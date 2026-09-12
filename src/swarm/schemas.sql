-- ADR-001 Phase 1: deterministic relational storage for the agent swarm.
-- Apply with: turso db shell swarm-db < schemas.sql
-- (The runtime migrator in src/swarm/db.ts creates these tables idempotently.)

CREATE TABLE IF NOT EXISTS task_queue (
    id               TEXT PRIMARY KEY,
    queue_name       TEXT NOT NULL DEFAULT 'default',
    prompt           TEXT NOT NULL,
    status           TEXT NOT NULL DEFAULT 'PENDING'
                     CHECK (status IN ('PENDING', 'LEASED', 'COMPLETED', 'FAILED')),
    priority         INTEGER NOT NULL DEFAULT 0,
    attempts         INTEGER NOT NULL DEFAULT 0,
    max_attempts     INTEGER NOT NULL DEFAULT 3,
    leased_by        TEXT,
    lease_expires_at INTEGER,
    -- Dynamic, per-task context (session ids, paths) lives in JSON here —
    -- never in telemetry labels (ADR-001 §5).
    payload          TEXT NOT NULL DEFAULT '{}',
    result           TEXT,
    error            TEXT,
    created_at       INTEGER NOT NULL,
    updated_at       INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_task_queue_claim ON task_queue (
    queue_name, status, priority DESC, created_at ASC
);
CREATE INDEX IF NOT EXISTS idx_task_queue_lease ON task_queue (status, lease_expires_at);
CREATE INDEX IF NOT EXISTS idx_task_queue_worker ON task_queue (leased_by, status);

CREATE TABLE IF NOT EXISTS agent_sessions (
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
);

CREATE TABLE IF NOT EXISTS agent_audit_logs (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id   TEXT NOT NULL,
    task_id      TEXT,
    worker_id    TEXT NOT NULL,
    -- Bounded enum: one of the SAM phases, never a dynamic value.
    phase        TEXT NOT NULL,
    action       TEXT NOT NULL,
    detail       TEXT NOT NULL DEFAULT '{}',
    created_at   INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_session ON agent_audit_logs (session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_worker ON agent_audit_logs (worker_id, created_at);
