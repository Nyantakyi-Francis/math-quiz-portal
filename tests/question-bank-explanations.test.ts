import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateExplanation } from "../scripts/lib/explanations.mjs";
import { validateModuleStimuli } from "../scripts/lib/stimuli.mjs";

type QuestionData = {
  q: string;
  options: string[];
  correct: number;
  explanation?: unknown;
};

describe("authored question-bank explanations", () => {
  const dataDirectory = join(process.cwd(), "data");
  const moduleFiles = readdirSync(dataDirectory).filter((file) => file.endsWith(".json"));

  it("covers and validates every question", () => {
    let questionCount = 0;

    for (const moduleFile of moduleFiles) {
      const moduleData = JSON.parse(
        readFileSync(join(dataDirectory, moduleFile), "utf8")
      ) as { questions: QuestionData[] };
      expect(() => validateModuleStimuli(moduleData), moduleFile).not.toThrow();

      moduleData.questions.forEach((question, index) => {
        questionCount += 1;
        expect(
          () => validateExplanation(question.explanation, index + 1),
          `${moduleFile} question ${index + 1}`
        ).not.toThrow();
        expect(
          typeof question.explanation === "string"
            ? question.explanation.trim().length
            : question.explanation,
          `${moduleFile} question ${index + 1}`
        ).toBeTruthy();
      });
    }

    expect(questionCount).toBe(430);
  });

  it("keeps every corrected answer index within its option list", () => {
    for (const moduleFile of moduleFiles) {
      const moduleData = JSON.parse(
        readFileSync(join(dataDirectory, moduleFile), "utf8")
      ) as { questions: QuestionData[] };

      moduleData.questions.forEach((question, index) => {
        expect(Number.isInteger(question.correct), `${moduleFile} question ${index + 1}`).toBe(true);
        expect(question.correct, `${moduleFile} question ${index + 1}`).toBeGreaterThanOrEqual(0);
        expect(question.correct, `${moduleFile} question ${index + 1}`).toBeLessThan(
          question.options.length
        );
      });
    }
  });
});
