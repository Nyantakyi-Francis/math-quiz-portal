export function validateModuleStimuli(quizData) {
  const stimuli = quizData.stimuli ?? {};
  if (!stimuli || typeof stimuli !== "object" || Array.isArray(stimuli)) {
    throw new Error("Module stimuli must be an object keyed by stimulus id.");
  }

  for (const [id, stimulus] of Object.entries(stimuli)) {
    if (!stimulus || typeof stimulus !== "object" || Array.isArray(stimulus)) {
      throw new Error(`Stimulus "${id}" must be an object.`);
    }
    if (stimulus.type === "diagram") {
      validateDiagramStimulus(id, stimulus);
      continue;
    }
    if (stimulus.type !== "table" || typeof stimulus.title !== "string" || !stimulus.title.trim()) {
      throw new Error(`Stimulus "${id}" must be a titled table or diagram.`);
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

function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function validateDiagramStimulus(id, stimulus) {
  if (typeof stimulus.title !== "string" || !stimulus.title.trim()) {
    throw new Error(`Diagram stimulus "${id}" must have a title.`);
  }
  if (typeof stimulus.alt !== "string" || !stimulus.alt.trim()) {
    throw new Error(`Diagram stimulus "${id}" must have alt text.`);
  }
  if (!Array.isArray(stimulus.viewBox) || stimulus.viewBox.length !== 4 || stimulus.viewBox.some((value) => !isNumber(value))) {
    throw new Error(`Diagram stimulus "${id}" must have a numeric viewBox.`);
  }
  if (!Array.isArray(stimulus.elements) || stimulus.elements.length === 0) {
    throw new Error(`Diagram stimulus "${id}" must include elements.`);
  }

  for (const [index, element] of stimulus.elements.entries()) {
    if (!element || typeof element !== "object" || Array.isArray(element)) {
      throw new Error(`Diagram stimulus "${id}" element ${index + 1} must be an object.`);
    }
    if (element.type === "line") {
      if (![element.x1, element.y1, element.x2, element.y2].every(isNumber)) {
        throw new Error(`Diagram stimulus "${id}" line ${index + 1} must have numeric endpoints.`);
      }
      continue;
    }
    if (element.type === "polygon") {
      if (!Array.isArray(element.points) || element.points.length < 3 || element.points.some((point) => !Array.isArray(point) || point.length !== 2 || point.some((value) => !isNumber(value)))) {
        throw new Error(`Diagram stimulus "${id}" polygon ${index + 1} must have numeric points.`);
      }
      continue;
    }
    if (element.type === "circle") {
      if (![element.cx, element.cy, element.r].every(isNumber)) {
        throw new Error(`Diagram stimulus "${id}" circle ${index + 1} must have numeric centre and radius.`);
      }
      continue;
    }
    if (element.type === "arc") {
      if (![element.cx, element.cy, element.r, element.start, element.end].every(isNumber)) {
        throw new Error(`Diagram stimulus "${id}" arc ${index + 1} must have numeric values.`);
      }
      continue;
    }
    if (element.type === "text") {
      if (!isNumber(element.x) || !isNumber(element.y) || typeof element.text !== "string" || !element.text.trim()) {
        throw new Error(`Diagram stimulus "${id}" text ${index + 1} must have a position and text.`);
      }
      continue;
    }
    throw new Error(`Diagram stimulus "${id}" element ${index + 1} has an unsupported type.`);
  }
}
