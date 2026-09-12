package swarm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

// Flags evaluates Flipt v2 via its OpenFeature Remote Evaluation Protocol
// (OFREP) endpoint. Fail-open: when Flipt is unreachable every flag falls
// back to its safe default so the swarm never stalls because the control
// plane is down.
type Flags struct {
	base   string
	client *http.Client

	mu    sync.Mutex
	cache map[string]cacheEntry
	ttl   time.Duration
}

type cacheEntry struct {
	value    any
	obtained time.Time
}

func NewFlags() *Flags {
	base := os.Getenv("FLIPT_URL")
	if base == "" {
		base = "http://127.0.0.1:8080"
	}
	return &Flags{
		base:   strings.TrimRight(base, "/"),
		client: &http.Client{Timeout: 3 * time.Second},
		cache:  map[string]cacheEntry{},
		ttl:    30 * time.Second,
	}
}

// Bool evaluates a boolean flag. def is the fail-open default.
func (f *Flags) Bool(ctx context.Context, key string, def bool) bool {
	v, ok := f.evaluate(ctx, key).(bool)
	if !ok {
		return def
	}
	return v
}

// Variant returns the selected variant key of a string flag ("" when missing).
func (f *Flags) Variant(ctx context.Context, key string) string {
	v, ok := f.evaluate(ctx, key).(string)
	if !ok {
		return ""
	}
	return v
}

func (f *Flags) evaluate(ctx context.Context, key string) any {
	f.mu.Lock()
	if e, ok := f.cache[key]; ok && time.Since(e.obtained) < f.ttl {
		f.mu.Unlock()
		return e.value
	}
	f.mu.Unlock()

	body, _ := json.Marshal(map[string]any{"context": map[string]any{}})
	req, err := http.NewRequestWithContext(ctx, http.MethodPost,
		f.base+"/ofrep/v1/evaluate/flags/"+key, bytes.NewReader(body))
	if err != nil {
		return nil
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := f.client.Do(req)
	if err != nil {
		return nil
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil
	}

	var out struct {
		Value          any    `json:"value"`
		Variant        string `json:"variant"`
		Reason         string `json:"reason"`
		ErrorCode      string `json:"errorCode"`
		Enabled        *bool  `json:"enabled"`
		VariantKey     string `json:"variantKey"`
		VariantAttachment any  `json:"variantAttachment"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return nil
	}
	if out.ErrorCode != "" {
		return nil
	}

	var value any
	switch {
	case out.Enabled != nil:
		value = *out.Enabled
	case out.VariantKey != "":
		value = out.VariantKey
	default:
		value = out.Value
	}

	f.mu.Lock()
	f.cache[key] = cacheEntry{value: value, obtained: time.Now()}
	f.mu.Unlock()
	return value
}

var _ = fmt.Sprintf // keep fmt for future error wrapping
