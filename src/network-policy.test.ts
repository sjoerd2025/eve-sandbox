import { describe, expect, it } from "vitest";
import type { SandboxNetworkPolicy } from "eve/sandbox";
import { toE2BNetworkUpdate } from "./network-policy";

describe("toE2BNetworkUpdate", () => {
  it("maps the coarse policies to allowInternetAccess", () => {
    expect(toE2BNetworkUpdate("allow-all")).toEqual({ allowInternetAccess: true });
    expect(toE2BNetworkUpdate("deny-all")).toEqual({ allowInternetAccess: false });
  });

  it("maps a string allow-list to allowOut + a catch-all denyOut", () => {
    // E2B requires ALL_TRAFFIC in denyOut for an allowOut to actually restrict.
    expect(toE2BNetworkUpdate({ allow: ["github.com", "*.npmjs.org"] })).toEqual({
      allowOut: ["github.com", "*.npmjs.org"],
      denyOut: ["0.0.0.0/0"],
    });
  });

  it("treats an empty allow-list as deny-all", () => {
    expect(toE2BNetworkUpdate({ allow: [] })).toEqual({ allowInternetAccess: false });
  });

  it('treats a bare catch-all "*" as allow-all', () => {
    expect(toE2BNetworkUpdate({ allow: ["github.com", "*"] })).toEqual({
      allowInternetAccess: true,
    });
    // Record form with an empty catch-all rule list.
    expect(toE2BNetworkUpdate({ allow: { "github.com": [], "*": [] } })).toEqual({
      allowInternetAccess: true,
    });
  });

  it("maps record-form header transforms to E2B rules (allow-list)", () => {
    expect(
      toE2BNetworkUpdate({
        allow: {
          "api.openai.com": [{ transform: [{ headers: { Authorization: "Bearer x" } }] }],
        },
      }),
    ).toEqual({
      allowOut: ["api.openai.com"],
      denyOut: ["0.0.0.0/0"],
      rules: {
        "api.openai.com": [{ transform: { headers: { Authorization: "Bearer x" } } }],
      },
    });
  });

  it("throws on a transform combined with a catch-all allow", () => {
    expect(() =>
      toE2BNetworkUpdate({
        allow: {
          "api.openai.com": [{ transform: [{ headers: { Authorization: "Bearer x" } }] }],
          "*": [],
        },
      }),
    ).toThrow(/transform/i);
  });

  it("folds subnets.allow into allowOut", () => {
    expect(
      toE2BNetworkUpdate({
        allow: ["github.com"],
        subnets: { allow: ["10.1.0.0/16"] },
      }),
    ).toEqual({
      allowOut: ["github.com", "10.1.0.0/16"],
      denyOut: ["0.0.0.0/0"],
    });
  });

  it("throws on subnets.deny combined with an allow-list (E2B: allow wins over deny)", () => {
    // E2B applies allow rules with absolute precedence over deny, so a deny inside
    // an allow-list is never enforced — fail closed instead of silently permitting it.
    expect(() =>
      toE2BNetworkUpdate({ allow: ["github.com"], subnets: { deny: ["10.0.0.0/8"] } }),
    ).toThrow(/allow-list|precedence/i);
    // Also when the allow-list comes via subnets.allow.
    expect(() =>
      toE2BNetworkUpdate({ subnets: { allow: ["10.0.0.0/8"], deny: ["10.1.1.1/32"] } }),
    ).toThrow(/allow-list|precedence/i);
  });

  it("maps a catch-all allow + subnets.deny to denyOut only (E2B's allow-all default)", () => {
    // Omitting allowOut leaves E2B allowing all egress, so the deny is actually
    // enforced — unlike putting 0.0.0.0/0 in allowOut, where allow would win.
    expect(toE2BNetworkUpdate({ allow: ["*"], subnets: { deny: ["10.0.0.0/8"] } })).toEqual({
      denyOut: ["10.0.0.0/8"],
    });
    // Specific allows alongside the catch-all are redundant and dropped.
    expect(
      toE2BNetworkUpdate({ allow: ["github.com", "*"], subnets: { deny: ["10.0.0.0/8"] } }),
    ).toEqual({ denyOut: ["10.0.0.0/8"] });
  });

  it("throws on a catch-all allow combined with subnets.deny AND transforms", () => {
    expect(() =>
      toE2BNetworkUpdate({
        allow: {
          "*": [],
          "api.openai.com": [{ transform: [{ headers: { Authorization: "Bearer x" } }] }],
        },
        subnets: { deny: ["10.0.0.0/8"] },
      }),
    ).toThrow(/transform/i);
  });

  it('throws on a transform attached to the catch-all "*"', () => {
    expect(() =>
      toE2BNetworkUpdate({
        allow: { "*": [{ transform: [{ headers: { x: "y" } }] }] },
      }),
    ).toThrow(/catch-all/i);
  });

  it("throws on unsupported per-rule match conditions", () => {
    const policy = {
      allow: { "api.example.com": [{ match: { method: ["POST"] } }] },
    } as unknown as SandboxNetworkPolicy;
    expect(() => toE2BNetworkUpdate(policy)).toThrow(/match/i);
  });

  it("throws on unsupported forwardURL proxying", () => {
    const policy = {
      allow: { "api.example.com": [{ forwardURL: "https://proxy.example" }] },
    } as unknown as SandboxNetworkPolicy;
    expect(() => toE2BNetworkUpdate(policy)).toThrow(/forwardURL/i);
  });
});
