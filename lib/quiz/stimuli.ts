import type { QuizTableStimulus } from "@/lib/quiz/types";

export function normalizeQuizStimulus(value: unknown): QuizTableStimulus | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const stimulus = value as Record<string, unknown>;
  if (
    stimulus.type !== "table" ||
    typeof stimulus.title !== "string" ||
    !stimulus.title.trim() ||
    !Array.isArray(stimulus.columns) ||
    stimulus.columns.length < 2 ||
    stimulus.columns.some((column) => typeof column !== "string" || !column.trim()) ||
    !Array.isArray(stimulus.rows) ||
    stimulus.rows.length === 0
  ) {
    return null;
  }

  const columns = stimulus.columns.map(String);
  const rows = stimulus.rows.filter(
    (row): row is string[] =>
      Array.isArray(row) &&
      row.length === columns.length &&
      row.every((cell) => typeof cell === "string")
  );

  if (rows.length !== stimulus.rows.length) return null;

  return {
    type: "table",
    title: stimulus.title.trim(),
    description:
      typeof stimulus.description === "string" && stimulus.description.trim()
        ? stimulus.description.trim()
        : null,
    columns,
    rows
  };
}
