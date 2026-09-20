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

export type QuizDiagramStimulusElement =
  | {
      type: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      label?: string;
    }
  | {
      type: "polygon";
      points: [number, number][];
      label?: string;
    }
  | {
      type: "circle";
      cx: number;
      cy: number;
      r: number;
      label?: string;
    }
  | {
      type: "arc";
      cx: number;
      cy: number;
      r: number;
      start: number;
      end: number;
      label?: string;
    }
  | {
      type: "text";
      x: number;
      y: number;
      text: string;
    };

export type QuizDiagramStimulus = {
  type: "diagram";
  title: string;
  description: string | null;
  alt: string;
  viewBox: [number, number, number, number];
  elements: QuizDiagramStimulusElement[];
};

export type QuizImageStimulus = {
  type: "image";
  title: string;
  description: string | null;
  src: string;
  alt: string;
  attribution: string | null;
};

export type QuizStimulusData = QuizTableStimulus | QuizDiagramStimulus | QuizImageStimulus;

export type LearnerQuizQuestion = {
  id: string;
  prompt: string;
  orderIndex: number;
  stimulus: QuizStimulusData | null;
  options: LearnerQuizOption[];
};

export type RenderedQuizTableStimulus = Omit<QuizTableStimulus, "columns" | "rows"> & {
  columns: RenderedMathText[];
  rows: RenderedMathText[][];
};

export type RenderedQuizDiagramStimulus = QuizDiagramStimulus;
export type RenderedQuizImageStimulus = QuizImageStimulus;

export type RenderedQuizStimulus =
  | RenderedQuizTableStimulus
  | RenderedQuizDiagramStimulus
  | RenderedQuizImageStimulus;

export type RenderedLearnerQuizOption = LearnerQuizOption & {
  renderedText: RenderedMathText;
};

export type RenderedLearnerQuizQuestion = Omit<LearnerQuizQuestion, "prompt" | "stimulus" | "options"> & {
  prompt: string;
  renderedPrompt: RenderedMathText;
  stimulus: RenderedQuizStimulus | null;
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
