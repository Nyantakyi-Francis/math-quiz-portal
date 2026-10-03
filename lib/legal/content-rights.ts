export type ContentRightsEntry = {
  category: string;
  status: string;
  handling: string;
};

export const contentRightsRegister: ContentRightsEntry[] = [
  {
    category: "Quiz questions and explanations",
    status: "Authored practice content aligned to WASSCE mathematics topics.",
    handling:
      "Questions should be original platform wording. Do not publish copied textbook questions, answer keys, or page images."
  },
  {
    category: "Aki-Ola source books",
    status: "Private local source material used for topic and skill alignment.",
    handling:
      "The books must stay outside the public app and repository publishing flow. Do not place scans, pages, or copied diagrams online."
  },
  {
    category: "Protected PDF resource packs",
    status: "Learner resources served only through authenticated app routes.",
    handling:
      "Keep each PDF outside public static hosting. Review every pack for ownership, permission, and copied third-party material before release."
  },
  {
    category: "Diagrams and visual assets",
    status: "Use original diagrams or assets with clear permission.",
    handling:
      "If a book diagram is needed, redraw it as an original teaching diagram unless permission exists to reproduce the original."
  },
  {
    category: "Branding and app assets",
    status: "Project-owned app branding and generated PWA assets.",
    handling:
      "Keep source files and exported icons in the repo only when they are owned by the project or licensed for this use."
  }
];
