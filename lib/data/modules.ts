export type ModuleCardTone = {
  badge: string;
  badgeText: string;
  accent: string;
};

export type ModuleMeta = {
  slug: string;
  title: string;
  description: string;
  moduleNumber: number;
  questionCount: number;
  difficulty: "Intermediate" | "Hard";
  legacyDataPath: string;
  legacyQuizPath: string;
  tone: ModuleCardTone;
};

export const modules: ModuleMeta[] = [
  {
    slug: "binary-sets-binomial",
    title: "Binary Operations, Sets & Binomial",
    description: "Foundational structures, notation, and pattern fluency for early Elective Maths confidence.",
    moduleNumber: 1,
    questionCount: 40,
    difficulty: "Intermediate",
    legacyDataPath: "data/binary-sets-binomial.json",
    legacyQuizPath: "quizzes/binary-sets-binomial.html",
    tone: {
      badge: "bg-blue-50",
      badgeText: "text-blue-700",
      accent: "border-blue-200"
    }
  },
  {
    slug: "surds-indices-logs",
    title: "Surds, Indices & Logarithm",
    description: "Simplification, transformation, and laws of indices with exam-style algebraic reasoning.",
    moduleNumber: 2,
    questionCount: 40,
    difficulty: "Intermediate",
    legacyDataPath: "data/surds-indices-logs.json",
    legacyQuizPath: "quizzes/surds-indices-logs.html",
    tone: {
      badge: "bg-violet-50",
      badgeText: "text-violet-700",
      accent: "border-violet-200"
    }
  },
  {
    slug: "sequences-functions",
    title: "Sequences & Functions",
    description: "Patterns, mappings, and formal relationships that connect algebra to graph thinking.",
    moduleNumber: 3,
    questionCount: 30,
    difficulty: "Intermediate",
    legacyDataPath: "data/sequences-functions.json",
    legacyQuizPath: "quizzes/sequences-functions.html",
    tone: {
      badge: "bg-rose-50",
      badgeText: "text-rose-700",
      accent: "border-rose-200"
    }
  },
  {
    slug: "straight-lines",
    title: "Straight Lines",
    description: "Coordinate geometry techniques for slope, intercepts, and line equations under time pressure.",
    moduleNumber: 4,
    questionCount: 40,
    difficulty: "Intermediate",
    legacyDataPath: "data/straight-lines.json",
    legacyQuizPath: "quizzes/straight-lines.html",
    tone: {
      badge: "bg-amber-50",
      badgeText: "text-amber-700",
      accent: "border-amber-200"
    }
  },
  {
    slug: "vectors",
    title: "Vectors",
    description: "Magnitude, direction, and geometric interpretation for accurate vector manipulation.",
    moduleNumber: 5,
    questionCount: 40,
    difficulty: "Intermediate",
    legacyDataPath: "data/vectors.json",
    legacyQuizPath: "quizzes/vectors.html",
    tone: {
      badge: "bg-cyan-50",
      badgeText: "text-cyan-700",
      accent: "border-cyan-200"
    }
  },
  {
    slug: "trigonometry",
    title: "Trigonometry",
    description: "Identities, ratios, and angle reasoning with stronger emphasis on exam stamina.",
    moduleNumber: 6,
    questionCount: 40,
    difficulty: "Hard",
    legacyDataPath: "data/trigonometry.json",
    legacyQuizPath: "quizzes/trigonometry.html",
    tone: {
      badge: "bg-indigo-50",
      badgeText: "text-indigo-700",
      accent: "border-indigo-200"
    }
  },
  {
    slug: "limits-differentiation",
    title: "Limits & Differentiation",
    description: "Core calculus transition topics with step-based algebra and interpretation practice.",
    moduleNumber: 7,
    questionCount: 40,
    difficulty: "Hard",
    legacyDataPath: "data/limits-differentiation.json",
    legacyQuizPath: "quizzes/limits-and-differentiation.html",
    tone: {
      badge: "bg-fuchsia-50",
      badgeText: "text-fuchsia-700",
      accent: "border-fuchsia-200"
    }
  },
  {
    slug: "coordinate-geometry",
    title: "Coordinate Geometry II: Circles",
    description: "Circle geometry in coordinate form, with focus on equations, tangents, and interpretation.",
    moduleNumber: 8,
    questionCount: 40,
    difficulty: "Intermediate",
    legacyDataPath: "data/coordinate-geometry.json",
    legacyQuizPath: "quizzes/coordinate-geometry-ii-circles.html",
    tone: {
      badge: "bg-emerald-50",
      badgeText: "text-emerald-700",
      accent: "border-emerald-200"
    }
  },
  {
    slug: "matrices",
    title: "Matrices",
    description: "Matrix arithmetic, transformations, and determinant intuition for high-accuracy problem solving.",
    moduleNumber: 9,
    questionCount: 40,
    difficulty: "Intermediate",
    legacyDataPath: "data/matrices.json",
    legacyQuizPath: "quizzes/matrices.html",
    tone: {
      badge: "bg-sky-50",
      badgeText: "text-sky-700",
      accent: "border-sky-200"
    }
  },
  {
    slug: "combinations-probability",
    title: "Combinations, Permutations & Probability",
    description: "Counting strategies and probability modelling for more demanding exam questions.",
    moduleNumber: 10,
    questionCount: 40,
    difficulty: "Hard",
    legacyDataPath: "data/combinations-probability.json",
    legacyQuizPath: "quizzes/combinations-permutations-and-probability.html",
    tone: {
      badge: "bg-orange-50",
      badgeText: "text-orange-700",
      accent: "border-orange-200"
    }
  },
  {
    slug: "statistics",
    title: "Statistics",
    description: "Interpretation, grouped data, and applied statistical reasoning in test conditions.",
    moduleNumber: 11,
    questionCount: 40,
    difficulty: "Intermediate",
    legacyDataPath: "data/statistics.json",
    legacyQuizPath: "quizzes/statistics.html",
    tone: {
      badge: "bg-red-50",
      badgeText: "text-red-700",
      accent: "border-red-200"
    }
  }
];

export function getModuleBySlug(slug: string) {
  return modules.find((module) => module.slug === slug) ?? null;
}

export const totalQuestions = modules.reduce(
  (sum, module) => sum + module.questionCount,
  0
);
