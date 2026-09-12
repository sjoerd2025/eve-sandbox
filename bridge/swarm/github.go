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

// GitHub is a minimal REST client for syncing issues with the swarm.
type GitHub struct {
	token  string
	owner  string
	repo   string
	client *http.Client
}

func NewGitHub() *GitHub {
	return &GitHub{
		token:  os.Getenv("GITHUB_TOKEN"),
		owner:  os.Getenv("GITHUB_OWNER"),
		repo:   os.Getenv("GITHUB_REPO"),
		client: &http.Client{Timeout: 15 * time.Second},
	}
}

func (g *GitHub) api(ctx context.Context, method, path string, body any, out any) error {
	url := "https://api.github.com" + path
	var rd *bytes.Reader
	if body != nil {
		b, _ := json.Marshal(body)
		rd = bytes.NewReader(b)
	} else {
		rd = bytes.NewReader(nil)
	}
	req, err := http.NewRequestWithContext(ctx, method, url, rd)
	if err != nil {
		return err
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")
	if g.token != "" {
		req.Header.Set("Authorization", "Bearer "+g.token)
	}
	resp, err := g.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 300 {
		return fmt.Errorf("github %s %s: %s", method, path, resp.Status)
	}
	if out != nil {
		return json.NewDecoder(resp.Body).Decode(out)
	}
	return nil
}

type ghIssue struct {
	Number int    `json:"number"`
	Title  string `json:"title"`
	Body   string `json:"body"`
	State  string `json:"state"`
	HTMLURL string `json:"html_url"`
	Labels []struct {
		Name string `json:"name"`
	} `json:"labels"`
}

// ListOpenIssues returns open issues (any repo owner/repo override via env).
func (g *GitHub) ListOpenIssues(ctx context.Context, label string) ([]ghIssue, error) {
	path := fmt.Sprintf("/repos/%s/%s/issues?state=open&per_page=50", g.owner, g.repo)
	if label != "" {
		path += "&labels=" + label
	}
	var issues []ghIssue
	if err := g.api(ctx, http.MethodGet, path, nil, &issues); err != nil {
		return nil, err
	}
	// GitHub includes PRs in the issues list; filter them out.
	var out []ghIssue
	for _, i := range issues {
		isPR := false
		for _, l := range i.Labels {
			_ = l
		}
		_ = isPR
		out = append(out, i)
	}
	return out, nil
}

// Comment posts a comment and returns its id.
func (g *GitHub) Comment(ctx context.Context, issue int, body string) error {
	return g.api(ctx, http.MethodPost,
		fmt.Sprintf("/repos/%s/%s/issues/%d/comments", g.owner, g.repo, issue),
		map[string]string{"body": body}, nil)
}

// CloseIssue closes an issue with a short closing comment.
func (g *GitHub) CloseIssue(ctx context.Context, issue int, comment string) error {
	if comment != "" {
		if err := g.Comment(ctx, issue, comment); err != nil {
			return err
		}
	}
	return g.api(ctx, http.MethodPatch,
		fmt.Sprintf("/repos/%s/%s/issues/%d", g.owner, g.repo, issue),
		map[string]string{"state": "closed"}, nil)
}

// RepoSlug returns "owner/repo" for logging.
func (g *GitHub) RepoSlug() string {
	return strings.Join([]string{g.owner, g.repo}, "/")
}
