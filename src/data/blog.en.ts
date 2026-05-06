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

/**
 * Per-project custom sections appended after the auto-generated ones.
 * Add an entry here keyed by project id to enrich any specific blog post.
 */
const EXTRA_SECTIONS: Record<string, BlogPost["extraSections"]> = {
  // Payment Gateway Migration — deep dive on saga pattern
  p01: [
    {
      heading: "Why the Saga Pattern?",
      paragraphs: [
        "Distributed transactions across payment, ledger, and notification services made two-phase commit a liability. Any downstream timeout would lock funds in limbo for minutes.",
        "The saga choreography model — where each service publishes a compensating event on failure — gave us deterministic rollback without a central coordinator. We modelled every failure path on a whiteboard before writing a single line.",
        "Key lesson: compensating transactions must be idempotent. A retry storm during a downstream outage will replay your rollbacks. We used a distributed idempotency store backed by Redis with a 24h TTL to deduplicate every event.",
      ],
    },
    {
      heading: "Circuit Breaker Tuning in Production",
      paragraphs: [
        "Our first circuit breaker thresholds were copied from a blog post — 50% error rate over 10s window. In production, this tripped on normal traffic spikes during batch settlement windows, cascading into unnecessary failures.",
        "We moved to adaptive thresholds: the breaker samples a rolling p99 latency baseline and opens only when current p99 exceeds 3× the 5-minute baseline. This eliminated 100% of false-positive trips while still catching real outages within 2 seconds.",
      ],
    },
  ],

  // CI/CD Pipeline Overhaul — how test impact analysis works
  p05: [
    {
      heading: "Building Test Impact Analysis from Scratch",
      paragraphs: [
        "Most open-source TIA tools require tight coupling with the test runner. We needed something language-agnostic that worked across Go, Python, and TypeScript repos.",
        "The solution: parse git diff to get changed file paths, then walk the import graph of each test file to determine which tests transitively depend on changed code. Tests with no path to any changed file are skipped entirely.",
        "The import graph is rebuilt on every push but cached per commit SHA. Cache hit rate settled at 82% after the first week, meaning most pushes skip the graph walk entirely.",
      ],
    },
    {
      heading: "Canary Deployments with Automated Rollback",
      paragraphs: [
        "We route 5% of production traffic to the canary using weighted Kubernetes services. A controller polls the error rate and p99 latency every 30 seconds against a rolling baseline from the stable deployment.",
        "If either metric degrades by more than 15% for two consecutive windows, the controller patches the canary Deployment's replica count to zero and fires a Slack alert. Full rollback completes in under 90 seconds without human intervention.",
        "The biggest win was psychological: engineers stopped treating deploys as high-stakes events. Deploy frequency tripled in the first month.",
      ],
    },
  ],

  // Search Platform Rebuild — ranking and relevance deep dive
  p11: [
    {
      heading: "Learning-to-Rank from Click Logs",
      paragraphs: [
        "Raw Elasticsearch BM25 scoring gave us decent recall but poor precision for head queries — top results were often technically relevant but commercially wrong (e.g. returning discontinued SKUs above in-stock ones).",
        "We collected implicit feedback by logging query-result pairs with click, dwell time, and add-to-cart signals. A LambdaMART model trained on 90 days of click logs reranked the top-20 BM25 results at query time.",
        "Serving the model required p99 < 20ms at our query volume. We compiled the model to a native binary using ONNX Runtime and co-located it in the same pod as the search gateway. Cold start went from 800ms to 4ms.",
      ],
    },
    {
      heading: "Prefix Trie for Type-ahead at Scale",
      paragraphs: [
        "Type-ahead suggestions with Elasticsearch completion suggesters couldn't handle our personalization requirements — every user needed a different ranking based on purchase history.",
        "We built an in-process prefix trie loaded from a Redis snapshot at startup. Each leaf node carries a weight vector: global popularity, per-category CTR, and a personalization multiplier computed offline. The trie fits in 180MB of heap for our full catalog of 2M terms.",
        "The result: type-ahead latency dropped from 120ms to 6ms p99, and conversion from suggestion clicks increased 18% in an A/B test.",
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
      readTime: "8 min",
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
