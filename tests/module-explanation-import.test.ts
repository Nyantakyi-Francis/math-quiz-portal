import { describe, expect, it } from "vitest";
import { validateExplanation } from "../scripts/lib/explanations.mjs";

describe("validateExplanation", () => {
  it("accepts plain-text and structured explanation data", () => {
    expect(validateExplanation("Use the cosine rule.", 1)).toBe("Use the cosine rule.");
    expect(
      validateExplanation(
        { summary: "Use the cosine rule.", steps: ["Substitute"], misconceptions: { 1: "Used sine." } },
        2
      )
    ).toEqual({
      summary: "Use the cosine rule.",
      steps: ["Substitute"],
      formula: null,
      misconceptions: { 1: "Used sine." }
    });
  });

  it("rejects malformed explanation data before import starts", () => {
    expect(() => validateExplanation({ summary: "", steps: [] }, 4)).toThrow(
      "Question 4 explanation must include a summary."
    );
    expect(() => validateExplanation({ summary: "Work it out.", steps: [""] }, 5)).toThrow(
      "Question 5 explanation steps must be non-empty strings."
    );
  });
});
