import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { hasEnoughData, OPPORTUNITIES } from "./skillbridge";
import type { AnalysisResponse } from "./fit-analysis";

const profileSchema = z.object({
  name: z.string(), headline: z.string(), about: z.string(), skills: z.string(), projects: z.string(), experience: z.string(),
}).strict();

export const analyzeFit = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ profile: profileSchema, opportunityId: z.string() }).strict().parse(input))
  .handler(async ({ data }): Promise<AnalysisResponse> => {
    if (!hasEnoughData(data.profile)) return { status: "insufficient", code: 400, message: "Add your skills and at least one project or experience entry before analyzing your fit." };
    const opportunity = OPPORTUNITIES.find((item) => item.id === data.opportunityId);
    if (!opportunity) return { status: "error", code: 400, message: "This opportunity is no longer available. Please choose another opportunity." };
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { status: "unavailable", code: 401, message: "Real AI analysis is unavailable because the AI service has not been configured." };
    const { runFitAnalysis } = await import("./fit-analysis.server");
    return runFitAnalysis(data.profile, opportunity, key);
  });