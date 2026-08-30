import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { QuizStimulus } from "../components/quiz-stimulus";

describe("QuizStimulus", () => {
  it("renders a captioned table with row and column headers", () => {
    const html = renderToStaticMarkup(
      <QuizStimulus
        stimulus={{
          type: "table",
          title: "Table 1: Scores",
          description: "Scores for 40 students.",
          columns: ["Score", "4", "5"],
          rows: [["Frequency", "3", "5"]]
        }}
      />
    );

    expect(html).toContain("<caption");
    expect(html).toContain("Table 1: Scores");
    expect(html).toContain('scope="col"');
    expect(html).toContain('scope="row"');
    expect(html).toContain('role="region"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain("Scores for 40 students.");
  });
});
