export type TemplateKey = "minimal" | "modern" | "executive";

export type CVSectionKey =
  | "experience"
  | "skills"
  | "education"
  | "projects"
  | "certifications";

export const DEFAULT_CV_SECTION_ORDER: CVSectionKey[] = [
  "experience",
  "skills",
  "education",
  "projects",
  "certifications",
];

export type SectionSelection = Record<CVSectionKey, boolean>;

export type FontKey =
  | "georgia"
  | "inter"
  | "merriweather"
  | "roboto"
  | "playfair";

export const FONT_CSS: Record<FontKey, string> = {
  georgia: "Georgia, 'Times New Roman', serif",
  inter: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  merriweather: "'Merriweather', Georgia, serif",
  roboto: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
  playfair: "'Playfair Display', Georgia, serif",
};
