import type { RenderedMathText } from "@/lib/math/render";

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

export type RenderedQuizTableStimulus = Omit<QuizTableStimulus, "columns" | "rows"> & {
  columns: RenderedMathText[];
  rows: RenderedMathText[][];
};

export type RenderedLearnerQuizOption = LearnerQuizOption & {
  renderedText: RenderedMathText;
};

export type RenderedLearnerQuizQuestion = Omit<LearnerQuizQuestion, "prompt" | "stimulus" | "options"> & {
  prompt: string;
  renderedPrompt: RenderedMathText;
  stimulus: RenderedQuizTableStimulus | null;
  options: RenderedLearnerQuizOption[];
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

export type RenderedStructuredQuizExplanation = StructuredQuizExplanation & {
  renderedSummary: RenderedMathText;
  renderedSteps: RenderedMathText[];
  renderedFormula: RenderedMathText | null;
};

export type QuizAnswerReview = {
  questionId: string;
  isCorrect: boolean;
  selectedOptionId: string | null;
  selectedOptionText: string | null;
  renderedSelectedOptionText: RenderedMathText | null;
  correctOptionId: string;
  correctOptionText: string;
  renderedCorrectOptionText: RenderedMathText;
  explanation: RenderedStructuredQuizExplanation;
  misconception: string | null;
  renderedMisconception: RenderedMathText | null;
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
