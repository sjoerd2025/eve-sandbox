/**
 * Turso Copy-on-Write branch client (ADR-001 "THIS IS DONE IN RIVET.DEV").
 *
 * Every sandboxed actor gets an ephemeral libSQL branch forked from the parent
 * database at workspace setup, a token scoped to the branch only, and full
 * teardown on completion — zero leakage into production data, no lock
 * contention between workers, and no residual storage after destroy.
 */

export interface TursoPlatformConfig {
  apiToken: string;
  orgSlug: string;
  /** Parent database to branch from (e.g. swarm-db). */
  parentDb: string;
  /** Default group; override if you use named replication groups. */
  group?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

export function tursoPlatformConfigFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): TursoPlatformConfig | null {
  const apiToken = env.TURSO_PLATFORM_API_TOKEN;
  const orgSlug = env.TURSO_ORG_SLUG;
  if (!apiToken || !orgSlug) return null;
  return {
    apiToken,
    orgSlug,
    parentDb: env.TURSO_PARENT_DB ?? "swarm-db",
    group: env.TURSO_GROUP ?? "default",
  };
}

export interface BranchCredentials {
  branchName: string;
  /** libsql://… URL of the branch. */
  dbUrl: string;
  /** Token scoped to the branch only — never the parent. */
  authToken: string;
}

interface TursoDatabaseResponse {
  database?: { Name?: string; Hostname?: string; name?: string; hostname?: string };
}

interface TursoTokenResponse {
  jwt?: string;
  token?: string;
}

/**
 * Create an ephemeral CoW branch + scoped token. Tolerates an existing branch
 * of the same name (HTTP 409) by issuing a fresh token for it, making this
 * safe to retry after a partial setup.
 */
export async function createAgentBranch(
  config: TursoPlatformConfig,
  taskKey: string,
): Promise<BranchCredentials> {
  const base = config.baseUrl ?? "https://api.turso.tech/v1";
  const doFetch = config.fetchImpl ?? fetch;
  const org = encodeURIComponent(config.orgSlug);
  const branchName = sanitizeBranchName(`branch-${taskKey}`);

  const res = await doFetch(`${base}/organizations/${org}/databases`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: branchName,
      group: config.group ?? "default",
      seed: { type: "database", name: config.parentDb },
    }),
  });
  if (!res.ok && res.status !== 409) {
    throw new Error(`Turso branch create failed (HTTP ${res.status}): ${await safeText(res)}`);
  }
  const body = (await res.json().catch(() => ({}))) as TursoDatabaseResponse;
  const db = body.database ?? {};
  const hostname = db.Hostname ?? db.hostname ?? "";
  if (!hostname) {
    throw new Error("Turso branch create returned no database hostname");
  }

  const tokenRes = await doFetch(
    `${base}/organizations/${org}/databases/${encodeURIComponent(branchName)}/auth/tokens`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiToken}` },
    },
  );
  if (!tokenRes.ok) {
    throw new Error(
      `Turso branch token create failed (HTTP ${tokenRes.status}): ${await safeText(tokenRes)}`,
    );
  }
  const tokenBody = (await tokenRes.json()) as TursoTokenResponse;
  const token = tokenBody.jwt ?? tokenBody.token;
  if (!token) throw new Error("Turso branch token response missing jwt");

  return {
    branchName,
    dbUrl: `libsql://${hostname}`,
    authToken: token,
  };
}

/** Delete the branch. Idempotent: a 404 counts as success. */
export async function destroyAgentBranch(
  config: TursoPlatformConfig,
  branchName: string,
): Promise<void> {
  const base = config.baseUrl ?? "https://api.turso.tech/v1";
  const doFetch = config.fetchImpl ?? fetch;
  const org = encodeURIComponent(config.orgSlug);
  const res = await doFetch(
    `${base}/organizations/${org}/databases/${encodeURIComponent(branchName)}`,
    { method: "DELETE", headers: { Authorization: `Bearer ${config.apiToken}` } },
  );
  if (!res.ok && res.status !== 404) {
    throw new Error(`Turso branch destroy failed (HTTP ${res.status}): ${await safeText(res)}`);
  }
}

/** Branch names: alphanumeric + dashes, Turso-safe. */
export function sanitizeBranchName(raw: string): string {
  return (
    raw
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "branch-unnamed"
  );
}

async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 300);
  } catch {
    return "(no body)";
  }
}
