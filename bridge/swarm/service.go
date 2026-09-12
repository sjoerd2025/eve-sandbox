package swarm

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"encore.dev/cron"
)

// ---- API ----------------------------------------------------------------

// SyncRequest overrides the default sync behavior.
type SyncRequest struct {
	Label string `json:"label"` // issue label to sync (default: swarm)
	Limit int    `json:"limit"` // max issues to enqueue (default 10)
}

// SyncResponse reports what the sync pass did.
type SyncResponse struct {
	Repo      string   `json:"repo"`
	Enqueued  []string `json:"enqueued"`
	Skipped   int      `json:"skipped"`
	Reported  []int    `json:"reported"`
	Paused    bool     `json:"paused"`
	QueueDone int      `json:"queue_done"`
}

// Sync pulls open GitHub issues into the swarm queue and reports completed
// tasks back as issue comments. Call from curl, cron, or Multica webhooks.
//
//encore:api public method=POST path=/sync
func Sync(ctx context.Context, req *SyncRequest) (*SyncResponse, error) {
	label := req.Label
	if label == "" {
		label = "swarm"
	}
	limit := req.Limit
	if limit == 0 {
		limit = 10
	}

	flags := NewFlags()
	res := &SyncResponse{}

	gh := NewGitHub()
	queue, err := OpenQueue()
	if err != nil {
		return nil, err
	}
	defer queue.Close()

	// 1. Report COMPLETED tasks back to their issues, then close them.
	done, err := listCompleted(ctx, queue)
	if err != nil {
		return nil, err
	}
	for _, t := range done {
		num, ok := issueNumber(t)
		if !ok {
			continue
		}
		comment := formatReport(t)
		if err := gh.CloseIssue(ctx, num, comment); err != nil {
			return nil, err
		}
		res.Reported = append(res.Reported, num)
		if err := markReported(ctx, queue, t.ID); err != nil {
			return nil, err
		}
	}

	// 2. Kill switch: when Flipt says paused, stop enqueueing new work.
	if flags.Bool(ctx, "swarm-paused", false) {
		res.Paused = true
		return res, nil
	}

	// 3. Enqueue open issues as tasks (idempotent: stable task id per issue).
	issues, err := gh.ListOpenIssues(ctx, label)
	if err != nil {
		return nil, err
	}
	for _, issue := range issues {
		if len(res.Enqueued) >= limit {
			break
		}
		id := taskIDForIssue(issue.Number)
		existing, err := queue.Get(ctx, id)
		if err != nil {
			return nil, err
		}
		if existing != nil {
			res.Skipped++
			continue
		}
		if _, err := queue.Enqueue(ctx, id, deriveTaskName(issue.Title),
			fmt.Sprintf("%s\n\n(source: %s)", issue.Title, issue.HTMLURL),
			0, map[string]any{
				"issue":   issue.Number,
				"title":   issue.Title,
				"url":     issue.HTMLURL,
				"executor": flags.Variant(ctx, "swarm-executor"),
				"planner":  flags.Variant(ctx, "swarm-planner"),
			}); err != nil {
			return nil, err
		}
		res.Enqueued = append(res.Enqueued, id)
	}
	return res, nil
}

// Status reports the bridge's view of the swarm.
//
//encore:api public method=GET path=/status
func Status(ctx context.Context) (*SyncResponse, error) {
	queue, err := OpenQueue()
	if err != nil {
		return nil, err
	}
	defer queue.Close()
	depth, err := queue.Depth(ctx)
	if err != nil {
		return nil, err
	}
	return &SyncResponse{QueueDone: depth}, nil
}

// ---- Cron ----------------------------------------------------------------

// Sync cron job: every 15 minutes.
var _ = cron.NewJob("github-sync", cron.JobConfig{
	Title:    "Sync GitHub issues with the swarm",
	Every:    15 * cron.Minute,
	Endpoint: Sync,
})

// ---- helpers --------------------------------------------------------------

const taskIDPrefix = "gh-"

func taskIDForIssue(n int) string { return fmt.Sprintf("%s%d", taskIDPrefix, n) }

func issueNumber(t *Task) (int, bool) {
	if len(t.ID) <= len(taskIDPrefix) || t.ID[:len(taskIDPrefix)] != taskIDPrefix {
		return 0, false
	}
	n, err := strconv.Atoi(t.ID[len(taskIDPrefix):])
	if err != nil {
		return 0, false
	}
	return n, true
}

// listCompleted fetches COMPLETED tasks that have not been reported yet.
func listCompleted(ctx context.Context, q *Queue) ([]*Task, error) {
	rows, err := q.db.QueryContext(ctx, `
		SELECT id, queue_name, prompt, status, priority, payload, result, error
		FROM task_queue
		WHERE status = 'COMPLETED' AND result IS NOT NULL
		  AND json_extract(payload, '$.reported') IS NULL
		ORDER BY updated_at ASC LIMIT 20`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []*Task
	for rows.Next() {
		var t Task
		var payload string
		var result, taskErr sql.NullString
		if err := rows.Scan(&t.ID, &t.Queue, &t.Prompt, &t.Status, &t.Priority, &payload, &result, &taskErr); err != nil {
			return nil, err
		}
		_ = json.Unmarshal([]byte(payload), &t.Payload)
		if result.Valid {
			t.Result = &result.String
		}
		if taskErr.Valid {
			t.Error = &taskErr.String
		}
		out = append(out, &t)
	}
	return out, rows.Err()
}

// markReported stamps the payload so the task is not reported twice.
func markReported(ctx context.Context, q *Queue, id string) error {
	t, err := q.Get(ctx, id)
	if err != nil || t == nil {
		return err
	}
	t.Payload["reported"] = true
	pl, _ := json.Marshal(t.Payload)
	_, err = q.db.ExecContext(ctx,
		`UPDATE task_queue SET payload = ?, updated_at = ? WHERE id = ?`,
		string(pl), time.Now().UnixMilli(), id)
	return err
}

// formatReport renders the completion payload as a GitHub comment.
func formatReport(t *Task) string {
	var summary, iterations string
	var m map[string]any
	if t.Result != nil && json.Unmarshal([]byte(*t.Result), &m) == nil {
		if s, ok := m["summary"].(string); ok {
			summary = s
		}
		if i, ok := m["iterations"].(float64); ok {
			iterations = fmt.Sprintf("%d", int(i))
		}
	}
	report := fmt.Sprintf("✅ **Swarm task complete**\n\n%s", summary)
	if iterations != "" {
		report += fmt.Sprintf("\n\nSAM cycles: %s", iterations)
	}
	report += "\n\n<sub>by the eve-sandbox swarm via the bridge</sub>"
	return report
}
