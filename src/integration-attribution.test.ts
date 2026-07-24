import { describe, expect, it } from "vitest";
import { ConnectionConfig } from "e2b";
import pkg from "../package.json" with { type: "json" };
// Importing the backend runs its module-load-time `ConnectionConfig.setIntegration`
// side effect — this test asserts that wiring, not the e2b SDK's own behavior.
import "./e2b-backend";

describe("integration attribution", () => {
  it("tags every request's User-Agent with eve-sandbox/<version>", () => {
    // e2b appends the set integration to the User-Agent it builds at
    // ConnectionConfig construction time.
    const config = new ConnectionConfig();
    const userAgentProducts = (config.headers?.["User-Agent"] ?? "").split(/\s+/);
    expect(userAgentProducts).toContain(`eve-sandbox/${pkg.version}`);
  });
});
