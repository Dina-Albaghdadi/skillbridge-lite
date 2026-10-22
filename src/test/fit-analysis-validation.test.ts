import { describe, expect, it } from "vitest";
import { validateFitResult } from "@/lib/fit-analysis";

const result = {
  relevantSkills: [{ item: "Python", evidence: "Built a Python script", relevance: "Relevant to scripting tasks" }],
  potentialGaps: [{ requirement: "AI", reason: "AI experience is not documented" }],
  recommendedNextSteps: [{ action: "Build an AI integration project", reason: "Document the required API experience" }],
};
describe("Required analysis output", () => {
  it("accepts the three specified structured fields", () => {
    expect(validateFitResult(result)).toEqual(result);
  });
  it("rejects extra top-level fields", () => {
    expect(() => validateFitResult({ ...result, hiringGuarantee: true })).toThrow();
  });
  it("rejects a relevant skill without evidence", () => {
    expect(() => validateFitResult({ ...result, relevantSkills: [{ item: "Python", relevance: "Scripting" }] })).toThrow();
  });
  it("rejects a potential gap without its reason", () => {
    expect(() => validateFitResult({ ...result, potentialGaps: [{ requirement: "AI" }] })).toThrow();
  });
  it("rejects a next step without its reason", () => {
    expect(() => validateFitResult({ ...result, recommendedNextSteps: [{ action: "Build a project" }] })).toThrow();
  });
  it("rejects blank evidence and static string arrays", () => {
    expect(() => validateFitResult({ ...result, relevantSkills: [{ ...result.relevantSkills[0], evidence: " " }] })).toThrow();
    expect(() => validateFitResult({ relevantSkills: ["Python"], potentialGaps: [], recommendedNextSteps: [] })).toThrow();
  });
});