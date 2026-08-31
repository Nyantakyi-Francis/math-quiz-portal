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
    description: "Practise binary operations, set notation, Venn diagrams, and binomial expansion.",
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
    description: "Simplify surds and solve problems involving indices and logarithms.",
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
    description: "Work with arithmetic and geometric sequences, mappings, and functions.",
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
    description: "Find gradients, intercepts, equations of lines, and relationships between lines.",
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
    description: "Calculate vector magnitudes, directions, components, and geometric relationships.",
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
    description: "Use trigonometric ratios, identities, equations, and angle relationships.",
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
    description: "Evaluate limits and apply differentiation rules to functions and graphs.",
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
    description: "Work with circle equations, centres, radii, tangents, and coordinate proofs.",
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
    description: "Perform matrix operations and use determinants, inverses, and transformations.",
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
    description: "Solve counting problems using permutations, combinations, and probability rules.",
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
    description: "Calculate and interpret averages, dispersion, grouped data, and statistical diagrams.",
    moduleNumber: 11,
    questionCount: 80,
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
