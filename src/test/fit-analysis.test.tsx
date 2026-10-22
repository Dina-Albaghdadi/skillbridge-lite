import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnalysisUnavailableError, FitAnalysisPanel, type FitResult } from "@/components/FitAnalysisPanel";
import { OPPORTUNITIES, SAMPLE_PROFILE } from "@/lib/skillbridge";

afterEach(cleanup);
const opportunity = OPPORTUNITIES[0];
if (!opportunity) throw new Error("Test opportunity is missing");
const result: FitResult = { relevantSkills: [{ item: "Python", evidence: "Python, HTML, CSS, APIs", relevance: "Supports scripting." }], potentialGaps: [{ requirement: "Automation", reason: "Not documented." }], recommendedNextSteps: [{ action: "Automate a project using Python.", reason: "Show workflow experience." }] };
const base = { profile: SAMPLE_PROFILE, opportunity, profileLink: <a href="/profile">Complete profile</a> };

describe("Fit analysis request lifecycle", () => {
  it("starts idle and never creates a result when the service is not configured", () => {
    render(<FitAnalysisPanel {...base} />);
    expect(screen.getByRole("region", { name: "Fit analysis" })).toHaveAttribute("aria-busy", "false");
    fireEvent.click(screen.getByRole("button", { name: "Analyze My Fit" }));
    expect(screen.queryByRole("button", { name: "Analyze again" })).not.toBeInTheDocument();
    expect(screen.queryByText("Python")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("requires skills and either a project or experience before calling AI", () => {
    const request = vi.fn();
    const { rerender } = render(<FitAnalysisPanel {...base} profile={{ ...SAMPLE_PROFILE, skills: " " }} request={request} />);
    fireEvent.click(screen.getByRole("button", { name: "Analyze My Fit" }));
    expect(request).not.toHaveBeenCalled();
    rerender(<FitAnalysisPanel {...base} profile={{ ...SAMPLE_PROFILE, projects: " ", experience: " " }} request={request} />);
    fireEvent.click(screen.getByRole("button", { name: "Analyze My Fit" }));
    expect(request).not.toHaveBeenCalled();
  });

  it("is analyzing only while a real request is pending and shows its resolved result", async () => {
    let resolve: ((value: FitResult) => void) | undefined;
    const request = vi.fn(() => new Promise<FitResult>((done) => { resolve = done; }));
    render(<FitAnalysisPanel {...base} request={request} />);
    fireEvent.click(screen.getByRole("button", { name: "Analyze My Fit" }));
    expect(request).toHaveBeenCalledWith(SAMPLE_PROFILE, opportunity);
    expect(screen.getByRole("region", { name: "Fit analysis" })).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("Python")).not.toBeInTheDocument();
    await act(async () => { resolve?.(result); });
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("Automation")).toBeInTheDocument();
    expect(screen.getByText("Automate a project using Python.")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Fit analysis" })).toHaveAttribute("aria-busy", "false");
  });

  it("clears loading on error and retry makes a new request", async () => {
    const request = vi.fn().mockRejectedValueOnce(new Error("Network failure")).mockResolvedValueOnce(result);
    render(<FitAnalysisPanel {...base} request={request} />);
    fireEvent.click(screen.getByRole("button", { name: "Analyze My Fit" }));
    await screen.findByRole("alert");
    expect(screen.getByRole("region", { name: "Fit analysis" })).toHaveAttribute("aria-busy", "false");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    await screen.findByText("Python");
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("does not enter success when the request reports an unavailable service", async () => {
    render(<FitAnalysisPanel {...base} request={vi.fn().mockRejectedValue(new AnalysisUnavailableError())} />);
    fireEvent.click(screen.getByRole("button", { name: "Analyze My Fit" }));
    await waitFor(() => expect(screen.getByRole("region", { name: "Fit analysis" })).toHaveAttribute("aria-busy", "false"));
    expect(screen.queryByRole("button", { name: "Analyze again" })).not.toBeInTheDocument();
  });
});