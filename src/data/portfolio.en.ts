import type {
  Certificate,
  HeroLine,
  PortfolioData,
  Principle,
  Profile,
  Project,
  SiteConfig,
  Stat,
  TechItem,
  WelcomeLine,
} from "./portfolio.types";

export const categoryLabels: Record<string, string> = {
  lang: "languages",
  fe: "frontend",
  be: "backend",
  db: "database",
  infra: "infrastructure",
  cicd: "ci/cd",
  data: "data",
  net: "network",
};

export const categoryOrder = [
  "lang",
  "fe",
  "be",
  "db",
  "infra",
  "cicd",
  "data",
  "net",
] as const;

export const ITEMS_PER_PAGE = 6;

export const heroLines: HeroLine[] = [
  { prompt: "~", cmd: "whoami", output: "full-stack developer" },
  {
    prompt: "~",
    cmd: "cat focus.txt",
    output: "distributed systems · real-time data · platform engineering",
  },
  { prompt: "~", cmd: "uptime", output: "4+ years in programing" },
];

export const welcomeLines: WelcomeLine[] = [
  { text: "Welcome,", pauseAfter: 300 },
  { text: "My name is", pauseAfter: 100 },
  {
    text: "TAN",
    className: "text-terminal-accent text-shadow-glow font-bold",
    pauseAfter: 400,
  },
  { text: "A Software Engineer", pauseAfter: 200 },
];

export const certificates: Certificate[] = [
  {
    name: "Olympic PMNM Contest 2025",
    issuer: "BTC OLYMPIC TIN HOC SINH VIEN VIET NAM",
    date: "12/12/2025",
    credentialId: "",
    url: "https://github.com/devmindtan/UtilityBox/blob/main/Assets/Images/Olympic%20PMNM%20Contest%202025.jpg",
    imageUrl:
      "https://raw.githubusercontent.com/devmindtan/UtilityBox/main/Assets/Images/Olympic%20PMNM%20Contest%202025.jpg",
  },
  {
    name: "ICPC Vietnam Southern Provincial PC",
    issuer: "William B.Poucher, Ph.D ICPC Executive Director",
    date: "11/10/2025",
    credentialId: "",
    url: "https://github.com/devmindtan/UtilityBox/blob/main/Assets/Images/2026-ICPC%20Vietnam%20Southern%20Provincial%20PC-Nguyen%20Khac%20Minh%20Tan-HONORABLE.pdf",
    imageUrl:
      "https://raw.githubusercontent.com/devmindtan/UtilityBox/main/Assets/Images/2026-ICPC%20Vietnam%20Southern%20Provincial%20PC-Nguyen%20Khac%20Minh%20Tan-HONORABLE.pdf",
  },
  {
    name: "ICPC Vietnam National PC",
    issuer: "William B.Poucher, Ph.D ICPC Executive Director",
    date: "8/11/2025",
    credentialId: "",
    url: "https://github.com/devmindtan/UtilityBox/blob/main/Assets/Images/2026-ICPC%20Vietnam%20National%20PC-Nguyen%20Khac%20Minh%20Tan-PLACE.pdf",
    imageUrl:
      "https://raw.githubusercontent.com/devmindtan/UtilityBox/main/Assets/Images/2026-ICPC%20Vietnam%20National%20PC-Nguyen%20Khac%20Minh%20Tan-PLACE.pdf",
  },
];

export const principles: Principle[] = [
  { label: "simplicity", desc: "The best code is code you don't write." },
  { label: "resilience", desc: "Design for failure. Expect it. Handle it." },
  { label: "observability", desc: "You can't fix what you can't see." },
  { label: "ownership", desc: "You build it, you run it." },
];

export const siteConfig: SiteConfig = {
  brand: "devmindtan.portfolio",
  navLinks: [
    { label: "projects", href: "#projects" },
    { label: "stack", href: "#stack" },
    { label: "contact", href: "#contact" },
  ],
  sectionTitles: {
    projects: "selected work",
    connect: "connect",
  },
  footer: {
    version: "v1.0.0",
    tech: ["react", "tailwind"],
    year: new Date().getFullYear(),
  },
  status: {
    text: "Available for new projects",
    detail: "Response time: ~24h",
  },
  contact: {
    description:
      "Fresh Graduate | Full-stack Developer & Cloud Native Enthusiast. Available for Fresher Roles & Technical Advisory. Async preferred! ⚡",
    links: [
      {
        label: "github",
        href: "https://github.com/devmindtan",
        icon: "github",
      },
      {
        label: "linkedin",
        href: "https://linkedin.com/in/devmind-tan/",
        icon: "linkedin",
      },
      { label: "email", href: "mailto:devmind.tan@gmail.com", icon: "mail" },
      {
        label: "facebook",
        href: "https://www.facebook.com/profile.php?id=61578904173779",
        icon: "facebook",
      },
    ],
  },
};

export const profile: Profile = {
  name: "Nguyen Khac Minh Tan",
  title: "Full-Stack Developer",
  avatar:
    "https://raw.githubusercontent.com/devmindtan/UtilityBox/main/Assets/Images/avatar.jpg",
  location: "Ho Chi Minh City, VN",
  email: "devmind.tan@gamil.com",
  phone: "+84 942 510 317",
  website: "https://my-portfolio-eight-opal-45.vercel.app/",
  linkedin: "linkedin.com/in/devmidtan",
  github: "github.com/devmindtan",
  summary:
    "Final-year Software Engineering student with a strong focus on Distributed Systems and Platform Engineering. Experienced in architecting microservices with K3s, optimizing real-time data pipelines using YOLOv11 for traffic analysis, and developing decentralized protocols. Passionate about building resilient, automated infrastructure and solving complex backend challenges at scale.",
  detail:
    "My technical foundation is built on a passion for emerging technologies, from decentralized protocols to Computer Vision. Through my graduation project, DatapolisX, and the Verzik protocol, I have gained hands-on experience in solving the 'hard' problems: gas optimization in Solidity, high-concurrency data streaming, and predictive modeling using Random Forest Regressors. I thrive in terminal-centric workflows where I can automate every part of the CI/CD pipeline, allowing me to focus on architecting secure and efficient decentralized solutions.",
  experience: [
    {
      role: "Graduation thesis",
      organization: "Van Lang University",
      type: "project",
      period: "2/2026 - 6/2026",
      description:
        "Develop a project to monitor and predict traffic density using a microservice system.",
      links: [
        {
          label: "github",
          href: "https://github.com/devmindtan/KLTN_2026",
        },
        {
          label: "website",
          href: "https://smartcity.devmindtan.uk/",
        },
      ],
    },
    {
      role: "Verzik",
      organization: "VIETFUTURE",
      type: "project",
      period: "2/2026 - 8/2026",
      description:
        "Built real-time analytics platforms and streaming data pipelines. Reduced data lag from 24h to under 30s using Flink and Kafka.",
      links: [
        {
          label: "website",
          href: "https://verzik-app.vercel.app/",
        },
      ],
    },
    {
      role: "Verzik",
      organization: "VIETFUTURE",
      type: "company",
      period: "2/2026",
      description:
        "Built real-time analytics platforms and streaming data pipelines. Reduced data lag from 24h to under 30s using Flink and Kafka.",
      links: [
        {
          label: "Real-time Analytics Pipeline",
          href: "#projects",
          projectName: "Real-time Analytics Pipeline",
        },
      ],
    },
  ],
  education: [
    {
      degree: "B.S. Software Engineer",
      school: "Van Lang University",
      year: "2026",
    },
  ],
};

export const stats: Stat[] = [
  { value: "2+", label: "years shipping" },
  { value: "20+", label: "projects" },
  { value: "10+", label: "programming languages" },
  { value: "100+", label: "commits/month" },
  { value: "8+ hrs", label: "daily coding" },
  { value: "high", label: "reliability" },
];

export const techStack: TechItem[] = [
  { name: "TypeScript", category: "lang" },
  { name: "Go", category: "lang" },
  { name: "Rust", category: "lang" },
  { name: "Python", category: "lang" },
  { name: "Java", category: "lang" },
  { name: "C++", category: "lang" },
  { name: "C", category: "lang" },
  { name: "C#", category: "lang" },
  { name: "React", category: "fe" },
  { name: "Tailwind", category: "fe" },
  { name: "ShadCN", category: "fe" },
  { name: "Mantine", category: "fe" },
  { name: "Next.js", category: "fe" },
  { name: "Node.js", category: "be" },
  { name: "Express", category: "be" },
  { name: "Flask", category: "be" },
  { name: "Django", category: "be" },
  { name: "PostgreSQL", category: "db" },
  { name: "MongoDB", category: "db" },
  { name: "MySQL", category: "db" },
  { name: "SQL Server", category: "db" },
  { name: "Redis", category: "db" },
  { name: "Kafka", category: "infra" },
  { name: "Kubernetes", category: "infra" },
  { name: "AWS", category: "infra" },
  { name: "Docker", category: "infra" },
  { name: "Terraform", category: "infra" },
  { name: "Github Action", category: "cicd" },
  { name: "Jenkins", category: "cicd" },
  { name: "Cloudflare", category: "net" },
  { name: "Tailscale", category: "net" },
  { name: "Flink", category: "data" },
  { name: "ClickHouse", category: "data" },
];

export const projects: Project[] = [
  {
    id: "p01",
    title: "Payment Gateway Migration",
    tag: "fintech",
    problem:
      "Legacy monolith processing 2M+ daily transactions with 0.8% failure rate and 12s avg latency.",
    actions: [
      "Designed event-driven microservice architecture",
      "Implemented saga pattern for distributed transactions",
      "Built circuit breaker with adaptive thresholds",
    ],
    results: [
      { value: "99.97%", label: "uptime" },
      { value: "180ms", label: "p99 latency" },
      { value: "0.01%", label: "failure rate" },
    ],
    insight: "Idempotency keys are non-negotiable in payment systems.",
    tech: ["Go", "Kafka", "PostgreSQL", "K8s"],
    sort_order: 1,
    created_at: "2024-01-15",
  },
  {
    id: "p02",
    title: "Real-time Analytics Pipeline",
    tag: "data",
    problem:
      "Batch ETL jobs causing 24h data lag, making real-time decisions impossible for ops team.",
    actions: [
      "Replaced batch with streaming using Flink",
      "Built custom windowed aggregations",
      "Implemented exactly-once semantics",
    ],
    results: [
      { value: "<30s", label: "data lag" },
      { value: "500K", label: "events/sec" },
      { value: "40%", label: "cost reduction" },
    ],
    insight: "Exactly-once is worth the complexity premium.",
    tech: ["Flink", "Kafka", "ClickHouse", "Grafana"],
    sort_order: 2,
    created_at: "2024-03-22",
  },
  {
    id: "p03",
    title: "Auth Platform Redesign",
    tag: "security",
    problem:
      "Homegrown auth with 3K LoC, no MFA, and session fixation vulnerabilities across 12 services.",
    actions: [
      "Implemented OIDC-compliant auth server",
      "Added FIDO2/WebAuthn MFA support",
      "Built token introspection layer for service mesh",
    ],
    results: [
      { value: "0", label: "auth vulns" },
      { value: "2M+", label: "daily logins" },
      { value: "<50ms", label: "token validation" },
    ],
    insight: "Security is a property of the system, not a feature.",
    tech: ["Rust", "Redis", "OAuth2", "WebAuthn"],
    sort_order: 3,
    created_at: "2024-05-10",
  },
  {
    id: "p04",
    title: "E-commerce Platform",
    tag: "retail",
    problem:
      "Black Friday traffic spikes causing cascading failures, $2M lost revenue per outage minute.",
    actions: [
      "Implemented adaptive rate limiting",
      "Built inventory reservation with TTL locks",
      "Created chaos engineering test suite",
    ],
    results: [
      { value: "0", label: "outages" },
      { value: "10x", label: "peak traffic" },
      { value: "$18M", label: "BF revenue" },
    ],
    insight: "Resilience is built by breaking things intentionally first.",
    tech: ["Node.js", "Redis", "RabbitMQ", "AWS"],
    sort_order: 4,
    created_at: "2024-06-01",
  },
  {
    id: "p05",
    title: "CI/CD Pipeline Overhaul",
    tag: "devops",
    problem:
      "Build times averaging 45min, flaky tests at 30% failure rate, deploys taking 2h with manual gates.",
    actions: [
      "Parallelized test suites with deterministic test containers",
      "Implemented canary deployments with automated rollback",
      "Built custom test impact analysis to skip unaffected suites",
    ],
    results: [
      { value: "4min", label: "build time" },
      { value: "<1%", label: "flaky rate" },
      { value: "15min", label: "deploy time" },
    ],
    insight:
      "Fast feedback loops change developer behavior more than any policy.",
    tech: ["Go", "K8s", "Terraform", "ArgoCD"],
    sort_order: 5,
    created_at: "2024-07-14",
  },
  {
    id: "p06",
    title: "Healthcare Data Platform",
    tag: "healthcare",
    problem:
      "HIPAA-compliant data silos across 8 hospitals, patient records taking 72h to sync between systems.",
    actions: [
      "Built FHIR-compliant data exchange layer",
      "Implemented field-level encryption with key rotation",
      "Created audit trail with immutable event log",
    ],
    results: [
      { value: "<5min", label: "record sync" },
      { value: "100%", label: "HIPAA compliance" },
      { value: "8", label: "hospitals live" },
    ],
    insight: "Compliance is architecture, not paperwork.",
    tech: ["Rust", "PostgreSQL", "Kafka", "AWS"],
    sort_order: 6,
    created_at: "2024-08-20",
  },
  {
    id: "p07",
    title: "Multi-tenant SaaS Platform",
    tag: "saas",
    problem:
      "Single-tenant architecture hitting scaling ceiling at 50 customers, onboarding taking 3 weeks per tenant.",
    actions: [
      "Designed row-level security with tenant isolation",
      "Built self-service onboarding with infrastructure-as-code",
      "Implemented tenant-aware connection pooling",
    ],
    results: [
      { value: "500+", label: "tenants" },
      { value: "15min", label: "onboarding" },
      { value: "60%", label: "infra cost saved" },
    ],
    insight:
      "Multi-tenancy is a data modeling decision, not a deployment strategy.",
    tech: ["TypeScript", "PostgreSQL", "Redis", "Docker"],
    sort_order: 7,
    created_at: "2024-09-05",
  },
  {
    id: "p08",
    title: "Fraud Detection Engine",
    tag: "fintech",
    problem:
      "Rule-based fraud detection missing 35% of fraud cases while generating 90% false positive rate.",
    actions: [
      "Built real-time feature store from transaction streams",
      "Implemented ML model serving with A/B testing framework",
      "Created explainability layer for regulatory compliance",
    ],
    results: [
      { value: "92%", label: "detection rate" },
      { value: "<8%", label: "false positive" },
      { value: "<100ms", label: "scoring latency" },
    ],
    insight:
      "Model accuracy means nothing without operational latency budgets.",
    tech: ["Python", "Flink", "Kafka", "Redis"],
    sort_order: 8,
    created_at: "2024-10-12",
  },
  {
    id: "p09",
    title: "IoT Fleet Management",
    tag: "iot",
    problem:
      "50K+ devices with unreliable connectivity, 40% telemetry data loss, and no remote update capability.",
    actions: [
      "Built MQTT broker cluster with store-and-forward",
      "Implemented delta-based OTA update system",
      "Created device shadow for offline state sync",
    ],
    results: [
      { value: "99.5%", label: "data delivery" },
      { value: "50K+", label: "devices managed" },
      { value: "<2GB", label: "update size" },
    ],
    insight:
      "Eventually consistent is the only consistency model that works at the edge.",
    tech: ["Go", "MQTT", "DynamoDB", "AWS"],
    sort_order: 9,
    created_at: "2024-11-01",
  },
  {
    id: "p10",
    title: "Content Delivery Network",
    tag: "infra",
    problem:
      "Origin server handling 100% of traffic, 800ms avg TTFB for APAC users, $500K/month bandwidth cost.",
    actions: [
      "Deployed edge nodes across 12 PoPs globally",
      "Built cache invalidation with surrogate key architecture",
      "Implemented origin shielding with request coalescing",
    ],
    results: [
      { value: "<50ms", label: "APAC TTFB" },
      { value: "95%", label: "cache hit rate" },
      { value: "$120K", label: "monthly cost" },
    ],
    insight: "Cache invalidation is only hard if your keys are wrong.",
    tech: ["Rust", "Nginx", "Terraform", "AWS"],
    sort_order: 10,
    created_at: "2024-11-18",
  },
  {
    id: "p11",
    title: "Search Platform Rebuild",
    tag: "data",
    problem:
      "MySQL LIKE queries on 50M records, 12s search latency, zero relevance tuning capability.",
    actions: [
      "Migrated to Elasticsearch with custom analyzers",
      "Built learning-to-rank pipeline from click logs",
      "Implemented type-ahead with prefix trie index",
    ],
    results: [
      { value: "<80ms", label: "search latency" },
      { value: "3x", label: "CTR improvement" },
      { value: "50M", label: "documents indexed" },
    ],
    insight: "Search quality is a product of iteration, not architecture.",
    tech: ["Python", "Elasticsearch", "Kafka", "K8s"],
    sort_order: 11,
    created_at: "2024-12-03",
  },
  {
    id: "p12",
    title: "Chat & Notification System",
    tag: "saas",
    problem:
      "Polling-based messaging consuming 60% of API capacity, 5s message delivery latency, no offline support.",
    actions: [
      "Built WebSocket gateway with connection draining",
      "Implemented message queue with delivery guarantees",
      "Created offline-first client with CRDT sync",
    ],
    results: [
      { value: "<200ms", label: "delivery" },
      { value: "80%", label: "API load reduced" },
      { value: "100K", label: "concurrent users" },
    ],
    insight:
      "Offline-first is not a feature, it is the only sane architecture for mobile.",
    tech: ["TypeScript", "Redis", "WebSocket", "CRDTs"],
    sort_order: 12,
    created_at: "2025-01-08",
  },
  {
    id: "p13",
    title: "Compliance Automation Platform",
    tag: "security",
    problem:
      "SOC2 audit requiring 3 months of manual evidence collection, 200+ controls tracked in spreadsheets.",
    actions: [
      "Built continuous control monitoring from infrastructure APIs",
      "Implemented evidence auto-collection pipeline",
      "Created drift detection against compliance baselines",
    ],
    results: [
      { value: "2 weeks", label: "audit prep" },
      { value: "200+", label: "controls automated" },
      { value: "98%", label: "evidence coverage" },
    ],
    insight:
      "Compliance should be a byproduct of good infrastructure, not a separate process.",
    tech: ["Go", "Terraform", "PostgreSQL", "AWS"],
    sort_order: 13,
    created_at: "2025-02-14",
  },
  {
    id: "p14",
    title: "Video Transcoding Pipeline",
    tag: "media",
    problem:
      "Manual transcoding workflow, 8h per video, no adaptive bitrate, $200K/year in compute waste.",
    actions: [
      "Built event-driven transcoding with per-title encoding",
      "Implemented adaptive bitrate ladder optimization",
      "Created GPU-accelerated preview generation",
    ],
    results: [
      { value: "15min", label: "per video" },
      { value: "40%", label: "storage saved" },
      { value: "4K", label: "max resolution" },
    ],
    insight: "Per-title encoding pays for itself within a month at scale.",
    tech: ["Go", "FFmpeg", "AWS", "Kafka"],
    sort_order: 14,
    created_at: "2025-03-01",
  },
];

export const portfolioDataEn: PortfolioData = {
  projects,
  techStack,
  stats,
  profile,
  heroLines,
  welcomeLines,
  principles,
  certificates,
  siteConfig,
};
