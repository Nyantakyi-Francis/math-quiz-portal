export function buildScoreMessageSubject(moduleTitle: string, scorePercent: number) {
  return `${moduleTitle} score: ${scorePercent.toFixed(1)}%`;
}

export function buildScoreMessageBody(params: {
  learnerName: string;
  moduleTitle: string;
  scoreRaw: number;
  scoreTotal: number;
  scorePercent: number;
}) {
  const { learnerName, moduleTitle, scoreRaw, scoreTotal, scorePercent } = params;

  let encouragement = "Keep going. Consistent practice is how the strong scores come.";

  if (scorePercent >= 80) {
    encouragement = "Excellent work. You are building real exam readiness here.";
  } else if (scorePercent >= 60) {
    encouragement = "Strong progress. Review the missed questions and push for the next band.";
  } else if (scorePercent >= 40) {
    encouragement = "A solid checkpoint. Review the weaker areas before your next attempt.";
  }

  return [
    `Hello ${learnerName},`,
    "",
    `You completed ${moduleTitle}.`,
    `Score: ${scoreRaw}/${scoreTotal} (${scorePercent.toFixed(1)}%)`,
    "",
    encouragement
  ].join("\n");
}
