import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

type StatisticsQuestion = {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
  stimulusId?: string;
};

const statistics = JSON.parse(
  readFileSync(join(process.cwd(), "data", "statistics.json"), "utf8")
) as { questions: StatisticsQuestion[] };

const addedQuestions = statistics.questions.slice(40);

describe("expanded Statistics question bank", () => {
  it("adds 40 complete questions without a fixed answer position", () => {
    expect(statistics.questions).toHaveLength(80);
    expect(addedQuestions).toHaveLength(40);

    for (const question of addedQuestions) {
      expect(question.options).toHaveLength(4);
      expect(question.options[question.correct]).toBeTruthy();
      expect(question.explanation.trim().length).toBeGreaterThan(20);
    }

    expect(new Set(addedQuestions.map((question) => question.correct)).size).toBe(4);
  });

  it("checks the main numerical results used by the added questions", () => {
    expect(5 * 18 - (12 + 17 + 20 + 24)).toBe(17);
    expect((20 * 64 + 30 * 70) / 50).toBe(67.6);
    expect(0.2 * 80 + 0.3 * 70 + 0.5 * 60).toBe(67);
    expect((7 + 8) / 2).toBe(7.5);
    expect(16 * 5).toBe(80);
    expect((2 + 0 + 2) / 3).toBeCloseTo(4 / 3);
    expect(10 - 3.5).toBe(6.5);
    expect(20 + 1.5 * (20 - 12)).toBe(32);
    expect((42 / 120) * 360).toBeCloseTo(126);
    expect((6 / 80) * 100).toBeLessThan((5 / 50) * 100);
    expect((12 * 15 + (30 - 18)) / 12).toBe(16);
    expect((72 - 60) / 6).toBe(2);
    expect(2 * 10 + 3).toBe(23);
    expect((18 + 21) / 2).toBe(19.5);
    expect(18 / 60).toBe(0.3);
    expect((12 + 15 + 18) / 3).toBe(15);
    expect((75 - 60) / 5).toBe((88 - 70) / 6);
  });
});
