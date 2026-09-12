import { describe, expect, it } from "vitest";
import { createAgentOsRegistry, vm } from "../src/server";

/** The parsed registry actor definition as rivetkit exposes it at runtime. */
type ParsedActorDef = {
  config: {
    actions: Record<string, unknown>;
    events: Record<string, unknown>;
  };
};

function parsedVmActor(): ParsedActorDef {
  const registry = createAgentOsRegistry();
  const config = registry.parseConfig() as unknown as {
    use: Record<string, ParsedActorDef>;
  };
  return config.use.vm!;
}

describe("RivetKit agentOS server", () => {
  it("the registry registers the vm and swarmWorker actors", () => {
    const registry = createAgentOsRegistry();
    const config = registry.parseConfig() as unknown as { use: Record<string, unknown> };
    expect(Object.keys(config.use).sort()).toEqual(["swarmWorker", "vm"].sort());
    expect(config.namespace).toBeTypeOf("string");
  });

  it("the vm actor exposes the agentOS action surface", () => {
    const { config } = parsedVmActor();
    const actions = Object.keys(config.actions);
    // Core agentOS groups that clients (and Eve's agentOSBackend) drive.
    for (const group of ["filesystem", "sessions", "process", "terminal", "software", "cron"]) {
      expect(actions, `missing action group ${group}`).toContain(group);
    }
    // Session lifecycle the agentos client uses.
    expect(Object.keys(config.actions.sessions as object)).toContain("open");
    expect(Object.keys(config.actions.sessions as object)).toContain("prompt");
  });

  it("the vm actor exposes the agentOS event stream", () => {
    const { config } = parsedVmActor();
    const events = Object.keys(config.events);
    for (const event of [
      "sessionEvent",
      "vmBooted",
      "vmShutdown",
      "processOutput",
      "processExit",
    ]) {
      expect(events, `missing event ${event}`).toContain(event);
    }
  });

  it("the exported vm actor definition carries the same surface", () => {
    const config = (vm as unknown as ParsedActorDef).config;
    expect(Object.keys(config.actions)).toContain("sessions");
    expect(Object.keys(config.events)).toContain("sessionEvent");
  });
});
