const draftModuleSlugs = new Set<string>([]);

export function isDraftModule(slug: string) {
  return draftModuleSlugs.has(slug);
}

export const draftModuleMessage =
  "This module is being upgraded with WASSCE-standard questions, checked diagrams, and stronger explanations.";
