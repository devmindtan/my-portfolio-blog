import type { BlogPost } from "./blog.types";

export interface Project {
  id: string;
  title: string;
  tag: string;
  problem: string;
  actions: string[];
  results: { value: string; label: string }[];
  insight: string;
  tech: string[];
  blogUrl?: string;
  sort_order: number;
  created_at: string;
}

export interface TechItem {
  name: string;
  category: string;
}

export interface Stat {
  value: string;
  label: string;
}

export type SortKey = "sort_order" | "title" | "tag" | "created_at";
export type SortDir = "asc" | "desc";
export type ViewMode = "grid" | "list";

export interface HeroLine {
  prompt: string;
  cmd: string;
  output: string;
}

export interface Principle {
  label: string;
  desc: string;
}

export interface ContactLink {
  label: string;
  href: string;
  icon: string;
}

export interface SiteConfig {
  brand: string;
  navLinks: { label: string; href: string }[];
  sectionTitles: {
    projects: string;
    connect: string;
  };
  footer: {
    version: string;
    tech: string[];
    year: number;
  };
  status: {
    text: string;
    detail: string;
  };
  contact: {
    description: string;
    links: { label: string; href: string; icon: string }[];
  };
}

export interface WelcomeLine {
  text: string;
  className?: string;
  pauseAfter?: number;
}

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  url?: string;
  imageUrl?: string;
}

export type ExperienceEntryType = "company" | "project";

export interface ExperienceEntry {
  role: string;
  organization: string;
  type: ExperienceEntryType;
  period: string;
  description: string;
  links?: {
    label: string;
    href: string;
    projectName?: string;
  }[];
}

export interface Profile {
  name: string;
  title: string;
  avatar: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  detail: string;
  experience: ExperienceEntry[];
  education: {
    degree: string;
    school: string;
    year: string;
  }[];
}

export interface PortfolioData {
  projects: Project[];
  blogPosts: BlogPost[];
  techStack: TechItem[];
  stats: Stat[];
  profile: Profile;
  heroLines: HeroLine[];
  welcomeLines: WelcomeLine[];
  principles: Principle[];
  certificates: Certificate[];
  siteConfig: SiteConfig;
}
