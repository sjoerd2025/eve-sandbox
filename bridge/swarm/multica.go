package swarm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
)

// Multica is a minimal REST client for the workspace's ticket queue.
// Config: MULTICA_SERVER_URL, MULTICA_TOKEN (mul_… PAT), MULTICA_WORKSPACE_ID.
// Falls back to ~/.multica/config.json so a local daemon's credentials work.
type Multica struct {
	base      string
	token     string
	workspace string
	client    *http.Client
}

func NewMultica() *Multica {
	base := os.Getenv("MULTICA_SERVER_URL")
	token := os.Getenv("MULTICA_TOKEN")
	workspace := os.Getenv("MULTICA_WORKSPACE_ID")
	if base == "" || token == "" || workspace == "" {
		if c := readMulticaConfig(); c != nil {
			if base == "" {
				base = c.ServerURL
			}
			if token == "" {
				token = c.Token
			}
			if workspace == "" {
				workspace = c.WorkspaceID
			}
		}
	}
	return &Multica{
		base:      strings.TrimRight(base, "/"),
		token:     token,
		workspace: workspace,
		client:    &http.Client{Timeout: 15 * time.Second},
	}
}

type multicaConfig struct {
	ServerURL   string `json:"server_url"`
	Token       string `json:"token"`
	WorkspaceID string `json:"workspace_id"`
}

func readMulticaConfig() *multicaConfig {
	home, err := os.UserHomeDir()
	if err != nil {
		return nil
	}
	b, err := os.ReadFile(home + "/.multica/config.json")
	if err != nil {
		return nil
	}
	var c multicaConfig
	if json.Unmarshal(b, &c) != nil {
		return nil
	}
	return &c
}

// Configured reports whether the client has everything it needs; a nil-safe
// false lets Sync skip the Multica pass entirely when unset.
func (m *Multica) Configured() bool { return m != nil && m.base != "" && m.token != "" && m.workspace != "" }

func (m *Multica) api(ctx context.Context, method, path string, body, out any) error {
	var rd *bytes.Reader
	if body != nil {
		b, _ := json.Marshal(body)
		rd = bytes.NewReader(b)
	} else {
		rd = bytes.NewReader(nil)
	}
	req, err := http.NewRequestWithContext(ctx, method, m.base+path, rd)
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+m.token)
	req.Header.Set("X-Workspace-ID", m.workspace)
	resp, err := m.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 300 {
		return fmt.Errorf("multica %s %s: %s", method, path, resp.Status)
	}
	if out != nil {
		return json.NewDecoder(resp.Body).Decode(out)
	}
	return nil
}

type mcIssue struct {
	ID         string `json:"id"`
	Identifier string `json:"identifier"` // e.g. BETA-7
	Title      string `json:"title"`
	Status     string `json:"status"` // backlog | todo | in_progress | done | cancelled
	StatusCategory string `json:"status_category"`
	Description *string `json:"description"`
}

type mcIssueList struct {
	Issues []mcIssue `json:"issues"`
}

// listOpenTickets returns non-done tickets. Only IDs in Done/Cancelled counts
// as closed; every other state is actionable swarm work.
func (m *Multica) listOpenTickets(ctx context.Context, limit int) ([]mcIssue, error) {
	if limit <= 0 {
		limit = 20
	}
	var out mcIssueList
	// status_category filters by behavior; done/cancelled excluded server-side.
	err := m.api(ctx, http.MethodGet,
		fmt.Sprintf("/api/issues/?limit=%d&status_category=todo,backlog,in_progress", limit), nil, &out)
	return out.Issues, err
}

// Comment posts a comment to a ticket (type "comment"; progress_update also
// allowed but reserved for the swarm's own progress narration).
func (m *Multica) Comment(ctx context.Context, issueID, body string) error {
	return m.api(ctx, http.MethodPost, "/api/issues/"+issueID+"/comments",
		map[string]string{"content": body, "type": "comment"}, nil)
}

// Complete posts a closing comment and moves the ticket to done.
func (m *Multica) Complete(ctx context.Context, issueID, comment string) error {
	if comment != "" {
		if err := m.Comment(ctx, issueID, comment); err != nil {
			return err
		}
	}
	return m.api(ctx, http.MethodPut, "/api/issues/"+issueID,
		map[string]string{"status": "done"}, nil)
}
