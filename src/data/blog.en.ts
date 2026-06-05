import type { BlogPost } from "./blog.types";
import type { Project } from "./portfolio.types";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const SECTION_HEADINGS: Record<string, [string, string, string]> = {
  fintech: [
    "Business Context",
    "Technical Implementation",
    "Risk & Compliance Outcomes",
  ],
  data: ["Data Challenge", "Pipeline Architecture", "Metrics & Impact"],
  security: ["Threat Landscape", "Security Architecture", "Hardening Results"],
  retail: ["Commerce Problem", "Engineering Approach", "Business Outcomes"],
  devops: [
    "Infrastructure Bottleneck",
    "Platform Engineering",
    "Reliability Gains",
  ],
  healthcare: ["Clinical Context", "System Design", "Compliance & Outcomes"],
  saas: ["Product Challenge", "Architecture Decisions", "Growth Signals"],
  iot: [
    "Edge & Device Context",
    "Integration Architecture",
    "Operational Telemetry",
  ],
  infra: [
    "Infrastructure Challenge",
    "Platform Design",
    "Stability & Performance",
  ],
  media: [
    "Content Scale Problem",
    "Delivery Architecture",
    "Audience & Performance",
  ],
};

const DEFAULT_HEADINGS: [string, string, string] = [
  "Problem Context",
  "Implementation Journey",
  "Outcomes and Signals",
];

const DEFAULT_READ_TIME = "6 min read";
const CUSTOM_READ_TIMES: Record<string, string> = {
  p01: "10 min read",
  p07: "9 min read",
};

const EXTRA_SECTIONS: Record<string, BlogPost["extraSections"]> = {
  p01: [
    {
      heading: "Microservice Scope and Boundaries",
      paragraphs: [
        "The project separates camera ingestion, prediction, decision support, and report generation into independent services. This made each workflow easier to test and evolve without rewriting the entire platform.",
        "Service boundaries were designed around responsibilities instead of technology. The API layer handles business routes, while Python services focus on model and data processing workloads.",
      ],
    },
    {
      heading: "Operational Automation",
      paragraphs: [
        "Kubernetes cronjobs were prepared for backup, data export, actual-data sync, and model-performance checks. Treating operations as part of the product improved maintainability during development.",
      ],
    },
  ],
  p07: [
    {
      heading: "Governance Before Mainnet",
      paragraphs: [
        "The prototype focuses on role flows first: protocol admin, tenant admin, operator manager, and operator. This clarified permission boundaries before adding full blockchain persistence.",
        "Document registration and co-sign scenarios were validated with a deterministic demo dataset to speed up product iteration.",
      ],
    },
  ],
};

export const createBlogPostsEn = (projects: Project[]): BlogPost[] =>
  projects.map((project) => {
    const [h1, h2, h3] = SECTION_HEADINGS[project.tag] ?? DEFAULT_HEADINGS;
    return {
      id: `blog-${project.id}`,
      projectId: project.id,
      slug: toSlug(project.title),
      title: `${project.title} - Technical Deep Dive`,
      excerpt: `Detailed breakdown of architecture decisions, delivery milestones, and production lessons from ${project.title}.`,
      publishedAt: project.created_at,
      readTime: CUSTOM_READ_TIMES[project.id] ?? DEFAULT_READ_TIME,
      tags: [project.tag, ...project.tech.slice(0, 2)],
      sections: [
        {
          heading: h1,
          paragraphs: [
            project.problem,
            "The initial system constraints were mapped against scalability, resilience, and team operation costs before implementation started.",
          ],
        },
        {
          heading: h2,
          paragraphs: project.actions.map(
            (action, index) => `${index + 1}. ${action}.`,
          ),
        },
        {
          heading: h3,
          paragraphs: [
            `Measured outcomes: ${project.results.map((r) => `${r.value} ${r.label}`).join(", ")}.`,
            `Primary engineering insight: ${project.insight}`,
          ],
        },
      ],
      extraSections: EXTRA_SECTIONS[project.id],
    };
  });

export const withBlogUrls = (
  projects: Project[],
  blogPosts: BlogPost[],
): Project[] => {
  const blogUrlByProjectId = new Map(
    blogPosts.map((post) => [post.projectId, `/blog/${post.slug}`]),
  );

  return projects.map((project) => ({
    ...project,
    blogUrl: blogUrlByProjectId.get(project.id),
  }));
};
