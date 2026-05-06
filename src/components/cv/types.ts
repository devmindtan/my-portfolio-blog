export type TemplateKey = "minimal" | "modern" | "executive";

export type CVSectionKey =
  | "experience"
  | "skills"
  | "education"
  | "projects"
  | "certifications";

export type SectionSelection = Record<CVSectionKey, boolean>;
