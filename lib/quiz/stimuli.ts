import type {
  QuizDiagramStimulus,
  QuizDiagramStimulusElement,
  QuizStimulusData
} from "@/lib/quiz/types";

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeDiagramElement(value: unknown): QuizDiagramStimulusElement | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const element = value as Record<string, unknown>;
  const label = typeof element.label === "string" && element.label.trim() ? element.label.trim() : undefined;

  if (
    element.type === "line" &&
    isNumber(element.x1) &&
    isNumber(element.y1) &&
    isNumber(element.x2) &&
    isNumber(element.y2)
  ) {
    return { type: "line", x1: element.x1, y1: element.y1, x2: element.x2, y2: element.y2, label };
  }

  if (
    element.type === "polygon" &&
    Array.isArray(element.points) &&
    element.points.length >= 3 &&
    element.points.every(
      (point) => Array.isArray(point) && point.length === 2 && isNumber(point[0]) && isNumber(point[1])
    )
  ) {
    return { type: "polygon", points: element.points as [number, number][], label };
  }

  if (element.type === "circle" && isNumber(element.cx) && isNumber(element.cy) && isNumber(element.r)) {
    return { type: "circle", cx: element.cx, cy: element.cy, r: element.r, label };
  }

  if (
    element.type === "arc" &&
    isNumber(element.cx) &&
    isNumber(element.cy) &&
    isNumber(element.r) &&
    isNumber(element.start) &&
    isNumber(element.end)
  ) {
    return {
      type: "arc",
      cx: element.cx,
      cy: element.cy,
      r: element.r,
      start: element.start,
      end: element.end,
      label
    };
  }

  if (
    element.type === "text" &&
    isNumber(element.x) &&
    isNumber(element.y) &&
    typeof element.text === "string" &&
    element.text.trim()
  ) {
    return { type: "text", x: element.x, y: element.y, text: element.text.trim() };
  }

  return null;
}

export function normalizeQuizStimulus(value: unknown): QuizStimulusData | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const stimulus = value as Record<string, unknown>;
  if (stimulus.type === "diagram") {
    if (
      typeof stimulus.title !== "string" ||
      !stimulus.title.trim() ||
      typeof stimulus.alt !== "string" ||
      !stimulus.alt.trim() ||
      !Array.isArray(stimulus.viewBox) ||
      stimulus.viewBox.length !== 4 ||
      !stimulus.viewBox.every(isNumber) ||
      !Array.isArray(stimulus.elements) ||
      stimulus.elements.length === 0
    ) {
      return null;
    }

    const elements = stimulus.elements.map(normalizeDiagramElement);
    if (elements.some((element) => element === null)) return null;

    return {
      type: "diagram",
      title: stimulus.title.trim(),
      description:
        typeof stimulus.description === "string" && stimulus.description.trim()
          ? stimulus.description.trim()
          : null,
      alt: stimulus.alt.trim(),
      viewBox: stimulus.viewBox as QuizDiagramStimulus["viewBox"],
      elements: elements as QuizDiagramStimulusElement[]
    };
  }

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
