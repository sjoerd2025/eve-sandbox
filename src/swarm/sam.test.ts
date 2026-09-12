import { describe, expect, it } from "vitest";
import { SamEngine, type SamPlanner, type SamAction } from "./sam";

function scriptedPlanner(actions: SamAction[]): SamPlanner & { calls: number } {
  let calls = 0;
  return {
    get calls() {
      return calls;
    },
    async plan() {
      const action = actions[calls] ?? actions[actions.length - 1]!;
      calls += 1;
      return action;
    },
  };
}

describe("SamEngine", () => {
  it("runs RECALL→PLAN→EXECUTE→VERIFY→COMMIT on success", async () => {
    const planner = scriptedPlanner([
      { type: "run_command", command: "echo hi" },
      { type: "finish", summary: "said hi" },
    ]);
    const sam = new SamEngine(planner, {
      exec: async () => ({ exitCode: 0, stdout: "hi", stderr: "" }),
    });

    const result = await sam.run("say hi");

    expect(result.success).toBe(true);
    expect(result.summary).toBe("said hi");
    expect(result.escalated).toBe(false);
    expect(sam.currentPhase).toBe("COMMIT");
    expect(planner.calls).toBe(2);
  });

  it("reflects on failure and escalates after max retries", async () => {
    const planner = scriptedPlanner([
      { type: "run_command", command: "false" },
      { type: "run_command", command: "false again" },
      { type: "finish", summary: "gave up" },
    ]);
    const sam = new SamEngine(
      planner,
      { exec: async () => ({ exitCode: 1, stdout: "", stderr: "boom" }) },
      {},
      {},
    );

    const result = await sam.run("do the impossible", { maxRetries: 1 });

    expect(result.escalated).toBe(true);
    expect(result.success).toBe(false);
    // The run always ends in COMMIT; it passed through ESCALATE on the way.
    expect(sam.currentPhase).toBe("COMMIT");
    expect(result.summary).toContain("escalated after 1");
    // 2 EXECUTE attempts (initial + 1 retry), then escalate.
    expect(result.steps).toHaveLength(2);
  });

  it("throws on illegal transitions", () => {
    const sam = new SamEngine(
      { plan: async () => ({ type: "finish", summary: "" }) },
      { exec: async () => ({ exitCode: 0, stdout: "", stderr: "" }) },
    );
    // IDLE -> COMMIT is not a legal transition.
    // @ts-expect-error testing an internal invariant
    expect(() => sam.transition("COMMIT")).toThrow(/illegal transition/i);
  });

  it("feeds recall into the planner and persists outcomes", async () => {
    let seenRecall: unknown;
    let persisted: unknown;
    const sam = new SamEngine(
      {
        plan: async ({ recall }) => {
          seenRecall = recall;
          return { type: "finish", summary: "ok" };
        },
      },
      { exec: async () => ({ exitCode: 0, stdout: "", stderr: "" }) },
      {
        recall: async () => [{ id: "1", text: "past run", score: 0.1 }],
        persist: async (record) => {
          persisted = record;
        },
      },
    );

    await sam.run("task");
    expect(Array.isArray(seenRecall)).toBe(true);
    expect((persisted as { summary: string }).summary).toBe("ok");
  });
});
