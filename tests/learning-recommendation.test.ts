import { describe, expect, it } from "vitest";
import { modules } from "@/lib/data/modules";
import { buildLearningRecommendation } from "@/lib/learning/recommendation";

describe("buildLearningRecommendation", () => {
  it("starts new learners at the first module", () => {
    expect(buildLearningRecommendation(modules, [])).toMatchObject({
      kind: "start",
      moduleSlug: modules[0].slug
    });
  });

  it("routes learners back to their weakest recent module", () => {
    const recommendation = buildLearningRecommendation(modules, [
      { moduleSlug: modules[0].slug, scorePercent: 82, createdAt: "2026-01-01" },
      { moduleSlug: modules[1].slug, scorePercent: 48, createdAt: "2026-01-02" },
      { moduleSlug: modules[1].slug, scorePercent: 62, createdAt: "2026-01-03" }
    ]);

    expect(recommendation).toMatchObject({
      kind: "reinforce",
      moduleSlug: modules[1].slug,
      actionLabel: "Practise again"
    });
  });

  it("advances learners after mastered attempts", () => {
    const recommendation = buildLearningRecommendation(modules, [
      { moduleSlug: modules[0].slug, scorePercent: 78, createdAt: "2026-01-01" }
    ]);

    expect(recommendation).toMatchObject({
      kind: "advance",
      moduleSlug: modules[1].slug
    });
  });
});
