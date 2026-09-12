package swarm

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"os"
	"time"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

// Task mirrors the swarm's task_queue row (ADR-001 schema, src/swarm/db.ts).
type Task struct {
	ID       string
	Queue    string
	Prompt   string
	Status   string // PENDING | LEASED | COMPLETED | FAILED
	Priority int
	Payload  map[string]any
	Result   *string
	Error    *string
}

// Queue is a minimal client for the swarm's Turso-backed task queue.
type Queue struct {
	db *sql.DB
}

// OpenQueue connects to Turso using TURSO_DATABASE_URL / TURSO_AUTH_TOKEN.
func OpenQueue() (*Queue, error) {
	url := os.Getenv("TURSO_DATABASE_URL")
	if url == "" {
		return nil, fmt.Errorf("TURSO_DATABASE_URL not set")
	}
	dsn := url + "?authToken=" + os.Getenv("TURSO_AUTH_TOKEN")
	db, err := sql.Open("libsql", dsn)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(4)
	return &Queue{db: db}, nil
}

// Enqueue inserts a task; idempotent per id (existing row returned unchanged).
func (q *Queue) Enqueue(ctx context.Context, id, prompt string, priority int, payload map[string]any) (*Task, error) {
	if payload == nil {
		payload = map[string]any{}
	}
	pl, _ := json.Marshal(payload)
	now := time.Now().UnixMilli()
	_, err := q.db.ExecContext(ctx, `
		INSERT INTO task_queue (id, queue_name, prompt, status, priority, attempts, max_attempts, payload, created_at, updated_at)
		VALUES (?, 'default', ?, 'PENDING', ?, 0, 3, ?, ?, ?)
		ON CONFLICT(id) DO NOTHING`,
		id, prompt, priority, string(pl), now, now)
	if err != nil {
		return nil, err
	}
	return q.Get(ctx, id)
}

// Get fetches one task by id.
func (q *Queue) Get(ctx context.Context, id string) (*Task, error) {
	row := q.db.QueryRowContext(ctx, `
		SELECT id, queue_name, prompt, status, priority, payload, result, error
		FROM task_queue WHERE id = ?`, id)
	var t Task
	var payload string
	var result, taskErr sql.NullString
	if err := row.Scan(&t.ID, &t.Queue, &t.Prompt, &t.Status, &t.Priority, &payload, &result, &taskErr); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	_ = json.Unmarshal([]byte(payload), &t.Payload)
	if result.Valid {
		t.Result = &result.String
	}
	if taskErr.Valid {
		t.Error = &taskErr.String
	}
	return &t, nil
}

// Depth counts PENDING tasks in the default queue.
func (q *Queue) Depth(ctx context.Context) (int, error) {
	var n int
	err := q.db.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM task_queue WHERE status = 'PENDING' AND queue_name = 'default'`).Scan(&n)
	return n, err
}

// Close releases the connection.
func (q *Queue) Close() error { return q.db.Close() }
