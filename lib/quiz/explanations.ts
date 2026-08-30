import type { StructuredQuizExplanation } from "@/lib/quiz/types";

const fallbackSummary = "Review the correct answer and compare it with your working.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function normalizeQuizExplanation(value: unknown): StructuredQuizExplanation {
  if (typeof value === "string" && value.trim()) {
    return {
      summary: value.trim(),
      steps: [],
      formula: null,
      misconceptions: {}
    };
  }

  if (!isRecord(value)) {
    return {
      summary: fallbackSummary,
      steps: [],
      formula: null,
      misconceptions: {}
    };
  }

  const summary = typeof value.summary === "string" ? value.summary.trim() : "";
  const steps = Array.isArray(value.steps)
    ? value.steps.filter((step): step is string => typeof step === "string" && Boolean(step.trim())).map((step) => step.trim())
    : [];
  const formula = typeof value.formula === "string" && value.formula.trim() ? value.formula.trim() : null;
  const misconceptions = isRecord(value.misconceptions)
    ? Object.fromEntries(
        Object.entries(value.misconceptions).flatMap(([optionId, message]) =>
          typeof message === "string" && message.trim() ? [[optionId, message.trim()]] : []
        )
      )
    : {};

  return {
    summary: summary || fallbackSummary,
    steps,
    formula,
    misconceptions
  };
}
