import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { normalizeQuizStimulus } from "../lib/quiz/stimuli";
import { validateModuleStimuli } from "../scripts/lib/stimuli.mjs";

type TableStimulus = {
  columns: string[];
  rows: string[][];
};

const statistics = JSON.parse(
  readFileSync(join(process.cwd(), "data", "statistics.json"), "utf8")
) as {
  stimuli: Record<string, TableStimulus>;
  questions: Array<{ stimulusId?: string; options: string[]; correct: number }>;
};

function numericRow(stimulusId: string, rowIndex = 0) {
  return statistics.stimuli[stimulusId].rows[rowIndex].slice(1).map(Number);
}

describe("Statistics question stimuli", () => {
  it("validates every table and all 21 question references", () => {
    expect(() => validateModuleStimuli(statistics)).not.toThrow();
    expect(statistics.questions.filter((question) => question.stimulusId)).toHaveLength(21);
    for (const stimulus of Object.values(statistics.stimuli)) {
      expect(normalizeQuizStimulus({ type: "table", ...stimulus, title: "Dataset" })).not.toBeNull();
    }
  });

  it("recalculates the ungrouped-score answers", () => {
    const scores = statistics.stimuli["scores-table"].columns.slice(1).map(Number);
    const frequencies = numericRow("scores-table");
    const total = frequencies.reduce((sum, frequency) => sum + frequency, 0);
    const weightedTotal = scores.reduce(
      (sum, score, index) => sum + score * frequencies[index],
      0
    );
    const expanded = scores.flatMap((score, index) => Array(frequencies[index]).fill(score));

    expect(total).toBe(40);
    expect(weightedTotal / total).toBe(6.875);
    expect(expanded[19]).toBe(7);
    expect(expanded[20]).toBe(7);
    expect(Math.max(...scores) - Math.min(...scores)).toBe(5);
    expect(frequencies.slice(0, 3).reduce((sum, frequency) => sum + frequency, 0) / total).toBe(7 / 20);
  });

  it("recalculates grouped-time and cumulative-frequency answers", () => {
    const timeMidpoints = [12, 17, 22, 27, 32, 37];
    const timeFrequencies = numericRow("completion-times-table");
    const weightedTime = timeMidpoints.reduce(
      (sum, midpoint, index) => sum + midpoint * timeFrequencies[index],
      0
    );
    expect(weightedTime / 50).toBe(23.4);
    expect(timeFrequencies[2] / 5).toBe(3.6);

    const cumulativeRows = statistics.stimuli["cumulative-frequency-table"].rows;
    expect(Number(cumulativeRows[3][2]) - Number(cumulativeRows[1][2])).toBe(70);
    expect(80.5 + ((90 - 85) / 15) * 20).toBeCloseTo(87.2, 1);
  });

  it("recalculates the grouped-marks answers", () => {
    const frequencies = statistics.stimuli["grouped-marks-table"].rows.map((row) => Number(row[1]));
    const midpoints = [44.5, 54.5, 64.5, 74.5, 84.5];
    const weightedTotal = midpoints.reduce(
      (sum, midpoint, index) => sum + midpoint * frequencies[index],
      0
    );

    expect(frequencies.reduce((sum, frequency) => sum + frequency, 0)).toBe(40);
    expect(weightedTotal / 40).toBe(63.5);
    expect(59.5 + ((20 - 16) / 16) * 10).toBe(62);
    expect(frequencies[0]).toBeLessThan(10);
    expect(frequencies[0] + frequencies[1]).toBeGreaterThanOrEqual(10);
  });

  it("recalculates the unequal-width grouped-data answers", () => {
    const rows = statistics.stimuli["unequal-width-table"].rows;
    const frequencies = rows.map((row) => Number(row[1]));
    const widths = [10, 10, 10, 20];
    const densities = frequencies.map((frequency, index) => frequency / widths[index]);
    const cumulativeThroughThirdClass = frequencies.slice(0, 3).reduce(
      (sum, frequency) => sum + frequency,
      0
    );

    expect(frequencies.reduce((sum, frequency) => sum + frequency, 0)).toBe(60);
    expect(densities[2]).toBe(2.4);
    expect(densities.indexOf(Math.max(...densities))).toBe(2);
    expect(cumulativeThroughThirdClass).toBe(45);
    expect(19.5 + ((30 - 21) / 24) * 10).toBe(23.25);
  });
});
