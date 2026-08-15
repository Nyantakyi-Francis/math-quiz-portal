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
    slug: "vectors",
    title: "Vectors",
    description: "A focused guide to magnitude, direction, components, and vector operations.",
    href: "/resources/vectors.pdf",
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
  }
];
