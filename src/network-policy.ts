import type { SandboxNetworkRule, SandboxNetworkUpdate } from "e2b";
import type { SandboxNetworkPolicy } from "eve/sandbox";

/** E2B's catch-all egress sentinel (every host / all traffic). */
const ALL_TRAFFIC = "0.0.0.0/0";

/**
 * Translate Eve's {@link SandboxNetworkPolicy} (which follows the upstream
 * `NetworkPolicy` shape) into E2B's {@link SandboxNetworkUpdate}.
 *
 * E2B's egress model, which drives every branch here:
 * - When `allowOut` is unset, all egress is allowed; `denyOut` then carves out
 *   exceptions.
 * - To *restrict* egress to an allow-list you must set `allowOut` AND include
 *   `ALL_TRAFFIC` in `denyOut` (E2B rejects a domain `allowOut` without it).
 * - Allowed entries always take precedence over denied ones, so you cannot deny
 *   a subset of an allowed range.
 *
 * Mapping:
 * - `"allow-all"` / catch-all `"*"` with no exclusions → `allowInternetAccess`.
 * - `"deny-all"` / an empty allow-list → `allowInternetAccess: false`.
 * - catch-all `"*"` + `subnets.deny` → unset `allowOut`, deny the listed CIDRs.
 * - an allow-list → `allowOut` + `denyOut: [ALL_TRAFFIC]`, plus per-domain `rules`
 *   for header `transform`s.
 *
 * Not expressible in E2B — we throw rather than silently weaken the policy:
 * - per-rule `match` conditions and `forwardURL` proxying,
 * - any header `transform` combined with a catch-all allow (a transform host
 *   must be allow-listed, which an allow-all can't also be),
 * - `subnets.deny` alongside an allow-list (allow wins over deny in E2B, so the
 *   deny would never take effect — use `"*"` + `subnets.deny` for deny-lists).
 */
export function toE2BNetworkUpdate(policy: SandboxNetworkPolicy): SandboxNetworkUpdate {
  if (policy === "allow-all") {
    return { allowInternetAccess: true };
  }
  if (policy === "deny-all") {
    return { allowInternetAccess: false };
  }

  const allowOut: string[] = [];
  const rules: Record<string, SandboxNetworkRule[]> = {};
  let hasCatchAll = false;

  const { allow, subnets } = policy;

  if (Array.isArray(allow)) {
    for (const entry of allow) {
      if (entry === "*" || entry === ALL_TRAFFIC) hasCatchAll = true;
      else allowOut.push(entry);
    }
  } else if (allow && typeof allow === "object") {
    for (const [domain, domainRules] of Object.entries(allow)) {
      if (domain === "*" || domain === ALL_TRAFFIC) {
        if (domainRules.length > 0) {
          throw new Error(
            `E2B network policy cannot apply transform rules to the catch-all ` +
              `"${domain}" — E2B has no global per-request transform.`,
          );
        }
        hasCatchAll = true;
        continue;
      }
      allowOut.push(domain);
      const mapped = mapDomainRules(domain, domainRules);
      if (mapped.length > 0) rules[domain] = mapped;
    }
  }

  if (subnets?.allow) allowOut.push(...subnets.allow);
  const subnetDeny = subnets?.deny ?? [];

  // A catch-all allow means "allow everything", so the specific allow entries
  // are redundant. E2B has no allow-list that also permits everything, so we
  // lean on its default (unset `allowOut` = allow all egress) and put any
  // exclusions in `denyOut`.
  if (hasCatchAll) {
    if (Object.keys(rules).length > 0) {
      // A per-domain transform requires its host in `allowOut`, which would turn
      // this into an allow-list (E2B then demands ALL_TRAFFIC in denyOut) — the
      // opposite of allow-all. Can't honor "allow everything" + a transform.
      throw new Error(
        `E2B network policy cannot combine a catch-all allow ("*") with per-domain ` +
          `transform rules. List explicit allowed hosts instead.`,
      );
    }
    return subnetDeny.length > 0 ? { denyOut: subnetDeny } : { allowInternetAccess: true };
  }

  // Allow-list mode. An empty list allows nothing → deny-all.
  if (allowOut.length === 0) {
    return { allowInternetAccess: false };
  }

  // Fail closed on a deny inside an allow-list. E2B applies allow rules with
  // absolute precedence over deny (regardless of CIDR specificity), so a
  // `subnets.deny` here is at best redundant (anything outside the allow-list is
  // already denied by the catch-all) and at worst silently unenforced (a deny
  // that overlaps an allowed range never takes effect). Rather than emit a policy
  // that quietly permits a "denied" host, reject it.
  if (subnetDeny.length > 0) {
    throw new Error(
      `E2B network policy: an allow-list can't be combined with \`subnets.deny\`. ` +
        `E2B always gives allow rules precedence over deny, so the "denied" hosts ` +
        `would stay reachable. Choose one instead:\n` +
        `  • allow everything except some hosts → { allow: ["*"], subnets: { deny: [...] } }\n` +
        `  • allow only specific hosts → list them in \`allow\` and drop \`subnets.deny\` ` +
        `(anything not in the allow-list is already blocked).`,
    );
  }

  // Restricting to an allow-list requires ALL_TRAFFIC in `denyOut`; allow takes
  // precedence, so the listed hosts pass and everything else is denied.
  const update: SandboxNetworkUpdate = { allowOut, denyOut: [ALL_TRAFFIC] };
  if (Object.keys(rules).length > 0) update.rules = rules;
  return update;
}

function mapDomainRules(
  domain: string,
  domainRules: ReadonlyArray<{
    match?: unknown;
    forwardURL?: string;
    transform?: ReadonlyArray<{ headers?: Record<string, string> }>;
  }>,
): SandboxNetworkRule[] {
  const out: SandboxNetworkRule[] = [];
  for (const rule of domainRules) {
    if (rule.match !== undefined) {
      throw new Error(
        `E2B network policy for "${domain}" cannot honor a per-rule \`match\` ` +
          `condition — E2B applies header transforms to every request to a host. ` +
          `Remove \`match\` or use a backend that supports it.`,
      );
    }
    if (rule.forwardURL !== undefined) {
      throw new Error(
        `E2B network policy for "${domain}" cannot honor \`forwardURL\` request ` +
          `proxying — no E2B equivalent. Use a backend that supports it.`,
      );
    }
    const headers: Record<string, string> = {};
    for (const transform of rule.transform ?? []) {
      Object.assign(headers, transform.headers ?? {});
    }
    if (Object.keys(headers).length > 0) {
      out.push({ transform: { headers } });
    }
  }
  return out;
}
