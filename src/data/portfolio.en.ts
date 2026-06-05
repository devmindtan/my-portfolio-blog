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
import { createBlogPostsEn, withBlogUrls } from "./blog.en";

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
    output: "web platforms · mobile apps · backend microservices",
  },
  { prompt: "~", cmd: "uptime", output: "2+ years shipping real projects" },
];

export const welcomeLines: WelcomeLine[] = [
  { text: "Welcome,", pauseAfter: 300 },
  { text: "My name is", pauseAfter: 100 },
  {
    text: "TAN",
    className: "text-terminal-accent text-shadow-glow font-bold",
    pauseAfter: 400,
  },
  { text: "A Full-Stack Developer", pauseAfter: 200 },
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
  { label: "simplicity", desc: "Build only what the product truly needs." },
  { label: "resilience", desc: "Design offline-first and recover gracefully." },
  { label: "observability", desc: "Measure before optimizing." },
  { label: "ownership", desc: "From commit to deployment, keep responsibility end-to-end." },
];

export const siteConfig: SiteConfig = {
  brand: "devmindtan.portfolio",
  navLinks: [
    { label: "projects", href: "#projects" },
    { label: "blog", href: "/blog" },
    { label: "websites", href: "#websites" },
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
    text: "Open to fresher full-stack roles",
    detail: "Response time: ~24h",
  },
  contact: {
    description:
      "Software Engineering graduate focused on full-stack and cloud-native delivery. Open for fresher opportunities and practical collaboration.",
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
  email: "devmind.tan@gmail.com",
  phone: "+84 942 510 317",
  website: "https://my-portfolio.devmindtan.uk/",
  linkedin: "linkedin.com/in/devmind-tan",
  github: "github.com/devmindtan",
  summary:
    "Software Engineering graduate with hands-on experience building web, mobile, and microservice systems. I focus on practical product delivery: offline-first apps, secure authentication flows, and data-driven backend services.",
  detail:
    "My recent work includes a smart traffic thesis platform (KLTN_2026), mobile-first productivity and fitness apps with Expo + Supabase, and authentication prototypes for Google and Microsoft accounts. I am comfortable across frontend, backend, and deployment workflows, especially when projects require integrating multiple services into one reliable product.",
  experience: [
    {
      role: "Graduation thesis",
      organization: "Van Lang University",
      type: "project",
      period: "02/2026 - 06/2026",
      description:
        "Built SmartCity traffic monitoring and prediction platform using a distributed microservice architecture with React, Node.js, Python services, PostgreSQL, MinIO, and Kubernetes manifests.",
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
      role: "Product builder",
      organization: "Personal Projects",
      type: "project",
      period: "2025 - 2026",
      description:
        "Delivered Expo-based mobile apps with local SQLite, Supabase sync, Google Sign-In, and MinIO image workflows (TaskFlow, Muscle Exercise Manager, Mobile Image Uploader).",
      links: [
        {
          label: "project list",
          href: "#projects",
        },
      ],
    },
    {
      role: "Blockchain prototype contributor",
      organization: "VIETFUTURE / Verzik",
      type: "company",
      period: "2026",
      description:
        "Contributed to a blockchain protocol management prototype spanning smart contracts, backend API, and React app with role-based governance flows.",
      links: [
        {
          label: "website",
          href: "https://verzik-app.vercel.app/",
        },
      ],
    },
  ],
  education: [
    {
      degree: "B.S. Software Engineering",
      school: "Van Lang University",
      year: "2026",
    },
  ],
};

export const stats: Stat[] = [
  { value: "2+", label: "years building products" },
  { value: "7", label: "active project repositories" },
  { value: "3", label: "platforms (web/mobile/backend)" },
  { value: "5+", label: "auth and data integrations" },
  { value: "offline-first", label: "preferred architecture" },
  { value: "24h", label: "average response" },
];

export const techStack: TechItem[] = [
  { name: "TypeScript", category: "lang" },
  { name: "JavaScript", category: "lang" },
  { name: "Python", category: "lang" },
  { name: "SQL", category: "lang" },

  { name: "React", category: "fe" },
  { name: "React Native", category: "fe" },
  { name: "Expo", category: "fe" },
  { name: "Tailwind CSS", category: "fe" },
  { name: "Mantine", category: "fe" },

  { name: "Node.js", category: "be" },
  { name: "Express", category: "be" },
  { name: "REST API", category: "be" },

  { name: "PostgreSQL", category: "db" },
  { name: "SQLite", category: "db" },
  { name: "Supabase", category: "db" },

  { name: "Docker", category: "infra" },
  { name: "Kubernetes", category: "infra" },
  { name: "MinIO", category: "infra" },

  { name: "GitHub Actions", category: "cicd" },

  { name: "YOLOv11", category: "data" },
  { name: "scikit-learn", category: "data" },

  { name: "OAuth 2.0", category: "net" },
  { name: "Socket.IO", category: "net" },
];

export const projects: Project[] = [
  {
    id: "p01",
    title: "KLTN_2026 - Smart Traffic Monitoring Platform",
    tag: "data",
    problem:
      "Traffic monitoring requires combining realtime camera streams, prediction services, and a dashboard in one coordinated system.",
    actions: [
      "Designed a distributed microservice architecture across React web, Node.js API, and Python services",
      "Integrated camera processing, forecasting, decision analysis, and report generation services",
      "Prepared Kubernetes manifests and cronjobs for backup, export, sync, and model performance tasks",
    ],
    results: [
      { value: "10+", label: "API route groups" },
      { value: "9", label: "backend service modules" },
      { value: "K8s", label: "deployment-ready configs" },
    ],
    insight:
      "A graduation thesis becomes production-like only when service boundaries and operational workflows are treated seriously.",
    tech: ["React", "Node.js", "Python", "PostgreSQL", "MinIO", "Kubernetes"],
    sort_order: 1,
    created_at: "2026-03-15",
  },
  {
    id: "p02",
    title: "TaskFlow - Offline-first Task Manager",
    tag: "saas",
    problem:
      "Task management on mobile must stay usable without network while still syncing safely to cloud when online.",
    actions: [
      "Implemented local-first data flow with SQLite as the source of truth",
      "Built automatic dirty-sync to Supabase every 60 seconds with manual sync option",
      "Separated mobile full logic and web preview-only mode to keep behavior predictable",
    ],
    results: [
      { value: "60s", label: "auto-sync interval" },
      { value: "SQLite", label: "local persistence" },
      { value: "Supabase", label: "cloud synchronization" },
    ],
    insight:
      "Offline-first architecture simplifies user trust: data is always available first, then synchronized.",
    tech: ["Expo", "React Native", "SQLite", "Supabase", "TypeScript"],
    sort_order: 2,
    created_at: "2026-01-20",
  },
  {
    id: "p03",
    title: "Muscle Exercise Manager",
    tag: "healthcare",
    problem:
      "Workout tracking apps need fast daily logging, stable offline behavior, and optional media synchronization.",
    actions: [
      "Built workout planner, dashboard, body metrics, and workout log flows for mobile-first usage",
      "Implemented local SQLite storage with cloud sync and dirty-state handling",
      "Integrated Google Sign-In and MinIO-based image upload for exercise illustrations",
    ],
    results: [
      { value: "offline-first", label: "core workflow" },
      { value: "Google", label: "auth integration" },
      { value: "MinIO", label: "media storage" },
    ],
    insight:
      "For lifestyle products, reliability and speed of logging matter more than feature count.",
    tech: ["Expo", "React Native", "SQLite", "Supabase", "MinIO"],
    sort_order: 3,
    created_at: "2025-12-10",
  },
  {
    id: "p04",
    title: "Mobile Image Uploader",
    tag: "infra",
    problem:
      "Uploading many images from mobile requires clear queue handling, progress visibility, and robust object storage integration.",
    actions: [
      "Implemented gallery selection and local upload queue with status states",
      "Built progress screen with per-file tracking and error handling",
      "Connected direct object operations for MinIO-compatible endpoints (list, upload, delete)",
    ],
    results: [
      { value: "4", label: "main app screens" },
      { value: "50MB", label: "size guidance per file" },
      { value: "live", label: "upload progress feedback" },
    ],
    insight:
      "A transparent queue UX reduces support issues more effectively than retry logic alone.",
    tech: ["Expo", "React Native", "TypeScript", "MinIO", "zustand"],
    sort_order: 4,
    created_at: "2025-11-05",
  },
  {
    id: "p05",
    title: "Google Connect",
    tag: "security",
    problem:
      "Mobile authentication demos often stop at UI, but practical apps need a complete sign-in context and user state flow.",
    actions: [
      "Integrated Google Sign-In SDK into an Expo Router project",
      "Implemented auth context for login/logout and user state propagation",
      "Built login and profile screens to validate end-to-end authentication UX",
    ],
    results: [
      { value: "Expo", label: "cross-platform baseline" },
      { value: "Google Sign-In", label: "identity provider" },
      { value: "AuthContext", label: "session state layer" },
    ],
    insight:
      "Authentication quality is defined by state handling and failure paths, not only successful login.",
    tech: ["Expo", "React Native", "TypeScript", "Google Sign-In"],
    sort_order: 5,
    created_at: "2025-10-12",
  },
  {
    id: "p06",
    title: "Azure Connect",
    tag: "security",
    problem:
      "University and enterprise users need a simple way to authenticate with Microsoft accounts and inspect granted identity data.",
    actions: [
      "Implemented OAuth 2.0 login flow with Microsoft identity platform",
      "Built Express session management and protected dashboard routing",
      "Connected Microsoft Graph API endpoint to fetch user profile data",
    ],
    results: [
      { value: "OAuth 2.0", label: "Microsoft 365 login" },
      { value: "/api/me", label: "profile data endpoint" },
      { value: "Express", label: "session-backed backend" },
    ],
    insight:
      "Authentication demos become practical only when token flow and session boundaries are explicit.",
    tech: ["Node.js", "Express", "MSAL", "Microsoft Graph"],
    sort_order: 6,
    created_at: "2025-09-01",
  },
  {
    id: "p07",
    title: "Verzik - Blockchain Protocol Prototype",
    tag: "fintech",
    problem:
      "Document verification workflows need stronger integrity guarantees and role-based governance across multiple operators.",
    actions: [
      "Built a role-based protocol management app for tenant, operator, and document flows",
      "Developed supporting backend and blockchain modules with SDK and smart contract tooling",
      "Prepared subgraph indexing setup for tracking protocol events",
    ],
    results: [
      { value: "RBAC", label: "governance model" },
      { value: "Hardhat", label: "contract toolchain" },
      { value: "Subgraph", label: "event indexing layer" },
    ],
    insight:
      "Blockchain prototypes are valuable when they clarify governance and process rules before mainnet complexity.",
    tech: ["React", "TypeScript", "Express", "Ethers", "Hardhat", "The Graph"],
    sort_order: 7,
    created_at: "2026-02-01",
  },
];

export const blogPosts = createBlogPostsEn(projects);
const projectsWithBlogUrls = withBlogUrls(projects, blogPosts);

export const portfolioDataEn: PortfolioData = {
  projects: projectsWithBlogUrls,
  blogPosts,
  techStack,
  stats,
  profile,
  heroLines,
  welcomeLines,
  principles,
  certificates,
  siteConfig,
};
