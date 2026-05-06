import type {
  Profile,
  Project,
  Certificate,
  TechItem,
} from "../../data/portfolio.types";
import type { SectionSelection } from "./types";

export interface CVTemplateProps {
  profile: Profile;
  projects: Project[];
  certificates: Certificate[];
  techStack?: TechItem[];
  includedSections: SectionSelection;
  renderMode?: "preview" | "print";
}
