import { z } from "zod";

const text = z.string();
export const fitResultSchema = z.object({
  relevantSkills: z.array(z.object({ item: text, evidence: text, relevance: text }).strict()),
  potentialGaps: z.array(z.object({ requirement: text, reason: text }).strict()),
  recommendedNextSteps: z.array(z.object({ action: text, reason: text }).strict()),
}).strict();
export type FitResult = z.infer<typeof fitResultSchema>;
export function validateFitResult(value: unknown): FitResult {
  const result = fitResultSchema.parse(value);
  for (const items of Object.values(result)) {
    for (const item of items) {
      if (Object.values(item).some((value) => !value.trim())) throw new Error("Empty analysis detail");
    }
  }
  return result;
}
export type AnalysisFailure = { status: "insufficient" | "unavailable" | "error"; message: string; code: number };
export type AnalysisResponse = { status: "success"; result: FitResult } | AnalysisFailure;