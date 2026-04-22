export type LearnerQuizOption = {
  id: string;
  text: string;
  orderIndex: number;
};

export type LearnerQuizQuestion = {
  id: string;
  prompt: string;
  orderIndex: number;
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

export type QuizSubmissionResult = {
  attemptId: string;
  scoreRaw: number;
  scoreTotal: number;
  scorePercent: number;
  incorrectCount: number;
  messageSubject: string;
  breakdown: Array<{
    questionId: string;
    isCorrect: boolean;
  }>;
};
