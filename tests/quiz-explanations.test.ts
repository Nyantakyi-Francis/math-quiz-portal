import { describe, expect, it } from "vitest";
import { normalizeQuizExplanation } from "../lib/quiz/explanations";

describe("normalizeQuizExplanation", () => {
  it("keeps structured explanation steps, formula, and misconceptions", () => {
    expect(
      normalizeQuizExplanation({
        summary: "Apply the law of indices.",
        steps: [" Rewrite the expression ", "Simplify"],
        formula: "$a^m a^n = a^{m+n}$",
        misconceptions: { optionId: "The powers were multiplied." }
      })
    ).toEqual({
      summary: "Apply the law of indices.",
      steps: ["Rewrite the expression", "Simplify"],
      formula: "$a^m a^n = a^{m+n}$",
      misconceptions: { optionId: "The powers were multiplied." }
    });
  });

  it("supports legacy plain-text explanations", () => {
    expect(normalizeQuizExplanation("  Divide both sides by 3. ")).toEqual({
      summary: "Divide both sides by 3.",
      steps: [],
      formula: null,
      misconceptions: {}
    });
  });

  it("provides a safe fallback when explanation data is missing", () => {
    expect(normalizeQuizExplanation(null)).toEqual({
      summary: "Review the correct answer and compare it with your working.",
      steps: [],
      formula: null,
      misconceptions: {}
    });
  });
});
