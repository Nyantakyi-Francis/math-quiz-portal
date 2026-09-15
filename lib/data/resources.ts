export type ResourceMeta = {
  slug: string;
  title: string;
  description: string;
  href: string;
  sizeLabel: string;
  tone: {
    badge: string;
    badgeText: string;
    accent: string;
  };
};

export const resources: ResourceMeta[] = [
  {
    slug: "binary-operations-sets-and-binomials",
    title: "Binary Operations, Sets & Binomials",
    description: "Core notes for operations, sets, and binomial expansion practice.",
    href: "/resources/binary-operations-sets-and-binomials.pdf",
    sizeLabel: "2.7 MB",
    tone: {
      badge: "bg-blue-50",
      badgeText: "text-blue-700",
      accent: "border-blue-200"
    }
  },
  {
    slug: "surds-indices-and-log",
    title: "Surds, Indices & Logarithms",
    description: "Reference material for simplifying expressions and applying index laws.",
    href: "/resources/surds-indices-and-log.pdf",
    sizeLabel: "1.0 MB",
    tone: {
      badge: "bg-violet-50",
      badgeText: "text-violet-700",
      accent: "border-violet-200"
    }
  },
  {
    slug: "sequences-and-functions",
    title: "Sequences & Functions",
    description: "Study notes for patterns, mappings, domains, and algebraic functions.",
    href: "/resources/sequences-and-functions.pdf",
    sizeLabel: "2.5 MB",
    tone: {
      badge: "bg-rose-50",
      badgeText: "text-rose-700",
      accent: "border-rose-200"
    }
  },
  {
    slug: "straight-lines",
    title: "Straight Lines",
    description: "Coordinate geometry notes for gradients, intercepts, and line equations.",
    href: "/resources/straight-lines.pdf",
    sizeLabel: "1.3 MB",
    tone: {
      badge: "bg-amber-50",
      badgeText: "text-amber-700",
      accent: "border-amber-200"
    }
  },
  {
    slug: "vectors-core-maths",
    title: "Vectors (Core Maths)",
    description: "Core Mathematics notes for magnitude, direction, components, and vector operations.",
    href: "/resources/VECTORS%20(CORE%20MATHS).pdf",
    sizeLabel: "2.5 MB",
    tone: {
      badge: "bg-cyan-50",
      badgeText: "text-cyan-700",
      accent: "border-cyan-200"
    }
  },
  {
    slug: "vectors-elective-maths",
    title: "Vectors (Elective Maths)",
    description: "Elective Mathematics vector notes for structured revision and practice.",
    href: "/resources/VECTORS%20(ELECTIVE%20MATHS).pdf",
    sizeLabel: "2.2 MB",
    tone: {
      badge: "bg-cyan-50",
      badgeText: "text-cyan-700",
      accent: "border-cyan-200"
    }
  },
  {
    slug: "trigonometry-functions",
    title: "Trigonometry Functions",
    description: "Notes for identities, graphs, ratios, and angle-based reasoning.",
    href: "/resources/trigonometry-functions.pdf",
    sizeLabel: "3.5 MB",
    tone: {
      badge: "bg-indigo-50",
      badgeText: "text-indigo-700",
      accent: "border-indigo-200"
    }
  },
  {
    slug: "limits-and-differentiation",
    title: "Limits & Differentiation",
    description: "Calculus notes for limits, first principles, and differentiation techniques.",
    href: "/resources/limits-and-differentiation.pdf",
    sizeLabel: "2.9 MB",
    tone: {
      badge: "bg-fuchsia-50",
      badgeText: "text-fuchsia-700",
      accent: "border-fuchsia-200"
    }
  },
  {
    slug: "matrices",
    title: "Matrices",
    description: "Compact matrix notes covering operations, determinants, and transformations.",
    href: "/resources/matrices.pdf",
    sizeLabel: "434 KB",
    tone: {
      badge: "bg-sky-50",
      badgeText: "text-sky-700",
      accent: "border-sky-200"
    }
  },
  {
    slug: "combinations-permutations-and-probability",
    title: "Combinations, Permutations & Probability",
    description: "Counting and probability notes for structured exam preparation.",
    href: "/resources/combinations-permutations-and-probability.pdf",
    sizeLabel: "2.2 MB",
    tone: {
      badge: "bg-orange-50",
      badgeText: "text-orange-700",
      accent: "border-orange-200"
    }
  },
  {
    slug: "statistics",
    title: "Statistics",
    description: "A full statistics pack for data handling, interpretation, and calculations.",
    href: "/resources/statistics.pdf",
    sizeLabel: "12.1 MB",
    tone: {
      badge: "bg-red-50",
      badgeText: "text-red-700",
      accent: "border-red-200"
    }
  },
  {
    slug: "algebraic-expressions-and-factorisation",
    title: "Algebraic Expressions & Factorisation",
    description: "Practice notes for expanding, simplifying, and factorising algebraic expressions.",
    href: "/resources/ALGEBRAIC%20EXPRESSIONS%20AND%20FACTORISATION.pdf",
    sizeLabel: "1.8 MB",
    tone: {
      badge: "bg-emerald-50",
      badgeText: "text-emerald-700",
      accent: "border-emerald-200"
    }
  },
  {
    slug: "angles-and-the-pythagorean-theorem",
    title: "Angles & the Pythagorean Theorem",
    description: "Notes for angle facts, right triangles, and Pythagorean calculations.",
    href: "/resources/ANGLES%20%26%20THE%20PYTHAGOREAN%20THEOREM.pdf",
    sizeLabel: "3.9 MB",
    tone: {
      badge: "bg-lime-50",
      badgeText: "text-lime-700",
      accent: "border-lime-200"
    }
  },
  {
    slug: "data-organisation-analysis-and-presentation",
    title: "Data Organisation, Analysis & Presentation",
    description: "Core notes for collecting, organising, presenting, and interpreting data.",
    href: "/resources/DATA%20ORGANISATION%2C%20ANALYSIS%20AND%20PRESENTATION.pdf",
    sizeLabel: "1.4 MB",
    tone: {
      badge: "bg-teal-50",
      badgeText: "text-teal-700",
      accent: "border-teal-200"
    }
  },
  {
    slug: "fractions-and-percentages",
    title: "Fractions & Percentages",
    description: "Revision notes for fraction operations, percentage change, and comparison.",
    href: "/resources/FRACTIONS%20AND%20PERCENTAGES.pdf",
    sizeLabel: "3.5 MB",
    tone: {
      badge: "bg-pink-50",
      badgeText: "text-pink-700",
      accent: "border-pink-200"
    }
  },
  {
    slug: "linear-equations-relations-and-functions",
    title: "Linear Equations, Relations & Functions",
    description: "Notes for solving equations, reading relations, and working with functions.",
    href: "/resources/LINEAR%20EQUATIONS%2C%20RELATIONS%20AND%20FUNCTIONS.pdf",
    sizeLabel: "3.7 MB",
    tone: {
      badge: "bg-blue-50",
      badgeText: "text-blue-700",
      accent: "border-blue-200"
    }
  },
  {
    slug: "number-sets",
    title: "Number Sets",
    description: "Reference notes for classifying and working with common number sets.",
    href: "/resources/NUMBER%20SETS.pdf",
    sizeLabel: "2.6 MB",
    tone: {
      badge: "bg-violet-50",
      badgeText: "text-violet-700",
      accent: "border-violet-200"
    }
  },
  {
    slug: "perimeter-area-and-volume",
    title: "Perimeter, Area & Volume",
    description: "Formula notes and worked guidance for plane shapes and solid figures.",
    href: "/resources/PERIMETER%2C%20AREA%20%26%20VOLUME.pdf",
    sizeLabel: "1.5 MB",
    tone: {
      badge: "bg-amber-50",
      badgeText: "text-amber-700",
      accent: "border-amber-200"
    }
  },
  {
    slug: "probability-of-independent-events",
    title: "Probability of Independent Events",
    description: "Probability notes for independent events, outcomes, and simple event reasoning.",
    href: "/resources/PROBABILITY%20OF%20INDEPENDENT%20EVENTS.pdf",
    sizeLabel: "1.1 MB",
    tone: {
      badge: "bg-orange-50",
      badgeText: "text-orange-700",
      accent: "border-orange-200"
    }
  }
];
