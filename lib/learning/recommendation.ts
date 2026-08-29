import type { ModuleMeta } from "@/lib/data/modules";

export type LearningAttempt = {
  moduleSlug: string;
  scorePercent: number;
  createdAt: string;
};

export type LearningRecommendation = {
  kind: "start" | "reinforce" | "advance" | "maintain";
  moduleSlug: string;
  moduleTitle: string;
  reason: string;
  evidence: string;
  actionLabel: string;
};

const masteryThreshold = 70;
const recentAttemptsPerModule = 3;

export function buildLearningRecommendation(
  moduleCatalog: ModuleMeta[],
  attempts: LearningAttempt[]
): LearningRecommendation | null {
  const orderedModules = [...moduleCatalog].sort(
    (left, right) => left.moduleNumber - right.moduleNumber
  );
  const firstModule = orderedModules[0];

  if (!firstModule) {
    return null;
  }

  if (!attempts.length) {
    return {
      kind: "start",
      moduleSlug: firstModule.slug,
      moduleTitle: firstModule.title,
      reason: "Begin with the first topic in the curriculum to establish your baseline.",
      evidence: "No completed attempts yet",
      actionLabel: "Start learning"
    };
  }

  const attemptsByModule = new Map<string, LearningAttempt[]>();

  attempts.forEach((attempt) => {
    if (!attempt.moduleSlug) return;
    const moduleAttempts = attemptsByModule.get(attempt.moduleSlug) ?? [];
    moduleAttempts.push(attempt);
    attemptsByModule.set(attempt.moduleSlug, moduleAttempts);
  });

  const performance = orderedModules
    .map((module) => {
      const moduleAttempts = (attemptsByModule.get(module.slug) ?? [])
        .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
        .slice(0, recentAttemptsPerModule);

      if (!moduleAttempts.length) return null;

      const average =
        moduleAttempts.reduce((total, attempt) => total + attempt.scorePercent, 0) /
        moduleAttempts.length;

      return { module, average, attemptCount: moduleAttempts.length };
    })
    .filter((result): result is NonNullable<typeof result> => Boolean(result));

  const weakest = [...performance].sort(
    (left, right) => left.average - right.average || left.module.moduleNumber - right.module.moduleNumber
  )[0];

  if (weakest && weakest.average < masteryThreshold) {
    return {
      kind: "reinforce",
      moduleSlug: weakest.module.slug,
      moduleTitle: weakest.module.title,
      reason: "Strengthen this topic before moving on so later modules have a firmer foundation.",
      evidence: `${weakest.average.toFixed(1)}% average across ${weakest.attemptCount} recent ${
        weakest.attemptCount === 1 ? "attempt" : "attempts"
      }`,
      actionLabel: "Practise again"
    };
  }

  const nextModule = orderedModules.find((module) => !attemptsByModule.has(module.slug));

  if (nextModule) {
    return {
      kind: "advance",
      moduleSlug: nextModule.slug,
      moduleTitle: nextModule.title,
      reason: "Your attempted topics meet the current mastery target, so this is the next step in sequence.",
      evidence: `${performance.length} ${performance.length === 1 ? "module" : "modules"} at or above ${masteryThreshold}%`,
      actionLabel: "Continue learning"
    };
  }

  const reviewModule = weakest?.module ?? firstModule;

  return {
    kind: "maintain",
    moduleSlug: reviewModule.slug,
    moduleTitle: reviewModule.title,
    reason: "You have attempted every module. Revisit your lowest recent average to keep it secure.",
    evidence: weakest ? `Lowest recent average: ${weakest.average.toFixed(1)}%` : "Curriculum completed",
    actionLabel: "Review topic"
  };
}
