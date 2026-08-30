export type LearnerQuizOption = {
  id: string;
  text: string;
  orderIndex: number;
};

export type QuizTableStimulus = {
  type: "table";
  title: string;
  description: string | null;
  columns: string[];
  rows: string[][];
};

export type LearnerQuizQuestion = {
  id: string;
  prompt: string;
  orderIndex: number;
  stimulus: QuizTableStimulus | null;
  options: LearnerQuizOption[];
};

export type LearnerQuizModule = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  difficulty: "Intermediate" | "Hard";
  questionCount: number;
  questions: LearnerQuizQuestion[];
};

export type QuizSubmissionAnswer = {
  questionId: string;
  selectedOptionId: string | null;
};

export type StructuredQuizExplanation = {
  summary: string;
  steps: string[];
  formula: string | null;
  misconceptions: Record<string, string>;
};

export type QuizAnswerReview = {
  questionId: string;
  isCorrect: boolean;
  selectedOptionId: string | null;
  selectedOptionText: string | null;
  correctOptionId: string;
  correctOptionText: string;
  explanation: StructuredQuizExplanation;
  misconception: string | null;
};

export type QuizSubmissionResult = {
  attemptId: string;
  scoreRaw: number;
  scoreTotal: number;
  scorePercent: number;
  incorrectCount: number;
  messageSubject: string;
  breakdown: QuizAnswerReview[];
};
