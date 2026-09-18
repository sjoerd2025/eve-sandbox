import { describe, expect, it } from "vitest";
import { parsePlanAction } from "./planner";

describe("parsePlanAction", () => {
  it("parses bare JSON run_command", () => {
    const action = parsePlanAction('{"action":"run_command","command":"echo hi"}');
    expect(action).toEqual({ type: "run_command", command: "echo hi" });
  });

  it("parses a fenced json block", () => {
    const action = parsePlanAction('```json\n{"action":"run_command","command":"echo hi"}\n```');
    expect(action).toEqual({ type: "run_command", command: "echo hi" });
  });

  it("parses a fenced json block preceded by prose (regression: prose caused a premature finish)", () => {
    const content = [
      "I'll run the requested bash command and capture its output.",
      "",
      "```json",
      '{"action":"run_command","command":"date && echo LIVE-E2E-OK"}',
      "```",
    ].join("\n");
    const action = parsePlanAction(content);
    expect(action).toEqual({ type: "run_command", command: "date && echo LIVE-E2E-OK" });
  });

  it("parses prose that itself contains braces before the fenced block", () => {
    const content = [
      'The plan {"is":"simple"} is:',
      "```json",
      '{"action":"run_command","command":"echo hi"}',
      "```",
    ].join("\n");
    const action = parsePlanAction(content);
    expect(action).toEqual({ type: "run_command", command: "echo hi" });
  });

  it("parses a fenced block without a language tag", () => {
    const action = parsePlanAction('```\n{"action":"run_command","command":"pwd"}\n```');
    expect(action).toEqual({ type: "run_command", command: "pwd" });
  });

  it("parses a fenced finish action", () => {
    const action = parsePlanAction('Done!\n```json\n{"action":"finish","summary":"all ran"}\n```');
    expect(action).toEqual({ type: "finish", summary: "all ran" });
  });

  it("falls back to finish with raw text when nothing parses", () => {
    const action = parsePlanAction("I cannot run commands in this environment.");
    expect(action).toEqual({
      type: "finish",
      summary: "I cannot run commands in this environment.",
    });
  });

  it("ignores an empty fenced block", () => {
    const action = parsePlanAction("```json\n```");
    expect(action.type).toBe("finish");
  });
});
