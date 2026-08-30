export function validateModuleStimuli(quizData) {
  const stimuli = quizData.stimuli ?? {};
  if (!stimuli || typeof stimuli !== "object" || Array.isArray(stimuli)) {
    throw new Error("Module stimuli must be an object keyed by stimulus id.");
  }

  for (const [id, stimulus] of Object.entries(stimuli)) {
    if (!stimulus || typeof stimulus !== "object" || Array.isArray(stimulus)) {
      throw new Error(`Stimulus "${id}" must be an object.`);
    }
    if (stimulus.type !== "table" || typeof stimulus.title !== "string" || !stimulus.title.trim()) {
      throw new Error(`Stimulus "${id}" must be a titled table.`);
    }
    if (!Array.isArray(stimulus.columns) || stimulus.columns.length < 2 || stimulus.columns.some((column) => typeof column !== "string" || !column.trim())) {
      throw new Error(`Stimulus "${id}" must have at least two named columns.`);
    }
    if (!Array.isArray(stimulus.rows) || !stimulus.rows.length || stimulus.rows.some((row) => !Array.isArray(row) || row.length !== stimulus.columns.length || row.some((cell) => typeof cell !== "string"))) {
      throw new Error(`Stimulus "${id}" rows must match its column count.`);
    }
  }

  quizData.questions.forEach((question, index) => {
    if (question.stimulusId !== undefined && (typeof question.stimulusId !== "string" || !stimuli[question.stimulusId])) {
      throw new Error(`Question ${index + 1} references an unknown stimulus.`);
    }
  });

  return stimuli;
}
