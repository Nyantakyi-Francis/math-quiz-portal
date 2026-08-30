export function validateExplanation(value, questionNumber) {
  if (value === undefined || value === null) return null;
  if (typeof value === "string") {
    if (!value.trim()) throw new Error(`Question ${questionNumber} has an empty explanation.`);
    return value.trim();
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Question ${questionNumber} has an invalid explanation.`);
  }
  if (typeof value.summary !== "string" || !value.summary.trim()) {
    throw new Error(`Question ${questionNumber} explanation must include a summary.`);
  }
  if (value.steps !== undefined && (!Array.isArray(value.steps) || value.steps.some((step) => typeof step !== "string" || !step.trim()))) {
    throw new Error(`Question ${questionNumber} explanation steps must be non-empty strings.`);
  }
  if (value.formula !== undefined && value.formula !== null && (typeof value.formula !== "string" || !value.formula.trim())) {
    throw new Error(`Question ${questionNumber} explanation formula must be a non-empty string.`);
  }
  if (value.misconceptions !== undefined && (!value.misconceptions || typeof value.misconceptions !== "object" || Array.isArray(value.misconceptions) || Object.values(value.misconceptions).some((message) => typeof message !== "string" || !message.trim()))) {
    throw new Error(`Question ${questionNumber} misconceptions must contain non-empty messages.`);
  }
  return {
    summary: value.summary.trim(),
    steps: value.steps?.map((step) => step.trim()) ?? [],
    formula: value.formula?.trim() ?? null,
    misconceptions: value.misconceptions ?? {}
  };
}
