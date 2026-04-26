import { isUuid, type ValidationResult } from "@/lib/http/validation";
import type { QuizSubmissionAnswer } from "@/lib/quiz/types";

type SubmissionBody = {
  answers: QuizSubmissionAnswer[];
};

export function validateQuizSubmissionBody(value: unknown): ValidationResult<SubmissionBody> {
  if (!value || typeof value !== "object") {
    return {
      ok: false,
      error: "Quiz submission must be an object."
    };
  }

  const answers = (value as { answers?: unknown }).answers;

  if (!Array.isArray(answers) || answers.length === 0) {
    return {
      ok: false,
      error: "No quiz answers were submitted."
    };
  }

  if (answers.length > 250) {
    return {
      ok: false,
      error: "Too many answers were submitted at once."
    };
  }

  const normalizedAnswers: QuizSubmissionAnswer[] = [];

  for (const answer of answers) {
    if (!answer || typeof answer !== "object") {
      return {
        ok: false,
        error: "Each answer must include a question and selected option."
      };
    }

    const questionId = (answer as { questionId?: unknown }).questionId;
    const selectedOptionId = (answer as { selectedOptionId?: unknown }).selectedOptionId;

    if (typeof questionId !== "string" || !isUuid(questionId)) {
      return {
        ok: false,
        error: "Each answer must include a valid question id."
      };
    }

    if (
      selectedOptionId !== null &&
      selectedOptionId !== undefined &&
      (typeof selectedOptionId !== "string" || !isUuid(selectedOptionId))
    ) {
      return {
        ok: false,
        error: "Each selected option must be a valid option id."
      };
    }

    normalizedAnswers.push({
      questionId,
      selectedOptionId: selectedOptionId ? String(selectedOptionId) : null
    });
  }

  return {
    ok: true,
    value: {
      answers: normalizedAnswers
    }
  };
}
