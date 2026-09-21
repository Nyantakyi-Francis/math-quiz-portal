const draftModuleSlugs = new Set([
  "number-sets",
  "algebraic-expressions-factorisation",
  "linear-equations-relations-functions",
  "angles-pythagorean-theorem",
  "perimeter-area-volume",
  "probability-independent-events",
  "data-organisation-analysis-presentation"
]);

export function isDraftModule(slug: string) {
  return draftModuleSlugs.has(slug);
}

export const draftModuleMessage =
  "This module is being upgraded with WASSCE-standard questions, checked diagrams, and stronger explanations.";
