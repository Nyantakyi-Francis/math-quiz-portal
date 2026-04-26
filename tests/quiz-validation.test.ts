import { describe, expect, it } from "vitest";
import { validateQuizSubmissionBody } from "../lib/quiz/validation";

const questionId = "11111111-1111-4111-8111-111111111111";
const selectedOptionId = "22222222-2222-4222-8222-222222222222";

describe("validateQuizSubmissionBody", () => {
  it("accepts valid answer payloads", () => {
    const result = validateQuizSubmissionBody({
      answers: [
        {
          questionId,
          selectedOptionId
        },
        {
          questionId: "33333333-3333-4333-8333-333333333333",
          selectedOptionId: null
        }
      ]
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.answers).toHaveLength(2);
    }
  });

  it("rejects missing answers", () => {
    const result = validateQuizSubmissionBody({ answers: [] });

    expect(result).toEqual({
      ok: false,
      error: "No quiz answers were submitted."
    });
  });

  it("rejects invalid ids before scoring runs", () => {
    const result = validateQuizSubmissionBody({
      answers: [
        {
          questionId: "not-a-uuid",
          selectedOptionId
        }
      ]
    });

    expect(result).toEqual({
      ok: false,
      error: "Each answer must include a valid question id."
    });
  });
});
