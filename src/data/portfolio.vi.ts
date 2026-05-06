import { portfolioDataEn } from "./portfolio.en";
import type { PortfolioData } from "./portfolio.types";
import { createBlogPostsVi } from "./blog.vi";
import { withBlogUrls } from "./blog.en";

const profileVi = {
  ...portfolioDataEn.profile,
  title: "Lập trình viên Full-Stack",
  summary:
    "Sinh viên năm cuối ngành Kỹ thuật Phần mềm, tập trung mạnh vào Distributed Systems và Platform Engineering. Có kinh nghiệm thiết kế microservices với K3s, tối ưu pipeline dữ liệu thời gian thực bằng YOLOv11 cho bài toán phân tích giao thông, và phát triển giao thức phi tập trung. Đam mê xây dựng hạ tầng tự động, bền bỉ và xử lý bài toán backend phức tạp ở quy mô lớn.",
  detail:
    'Nền tảng kỹ thuật của mình được xây dựng từ niềm yêu thích với công nghệ mới, từ giao thức phi tập trung đến Computer Vision. Thông qua đồ án tốt nghiệp DatapolisX và giao thức Verzik, mình có trải nghiệm thực chiến với các bài toán "khó": tối ưu gas trong Solidity, stream dữ liệu đồng thời cao và mô hình dự báo bằng Random Forest Regressor. Mình phù hợp với quy trình làm việc tập trung vào terminal, nơi có thể tự động hóa hầu hết các bước CI/CD để tập trung vào thiết kế giải pháp phi tập trung an toàn và hiệu quả.',
  experience: portfolioDataEn.profile.experience.map((item, index) => {
    const descriptions = [
      "Phát triển hệ thống giám sát và dự đoán mật độ giao thông theo kiến trúc microservice.",
      "Xây dựng nền tảng phân tích thời gian thực và pipeline dữ liệu streaming. Giảm độ trễ dữ liệu từ 24 giờ xuống dưới 30 giây bằng Flink và Kafka.",
      "Xây dựng nền tảng phân tích thời gian thực và pipeline dữ liệu streaming. Giảm độ trễ dữ liệu từ 24 giờ xuống dưới 30 giây bằng Flink và Kafka.",
    ];
    return { ...item, description: descriptions[index] ?? item.description };
  }),
};

const projectsVi = portfolioDataEn.projects.map((p) => {
  type ProjectId = (typeof portfolioDataEn.projects)[number]["id"];

  const translations: Record<
    ProjectId,
    {
      title: string;
      problem: string;
      actions: string[];
      results: { value: string; label: string }[];
      insight: string;
    }
  > = {
    p01: {
      title: "Di Chuyển Cổng Thanh Toán",
      problem:
        "Monolith cũ xử lý 2M+ giao dịch/ngày với tỉ lệ lỗi 0.8% và độ trễ trung bình 12 giây.",
      actions: [
        "Thiết kế kiến trúc microservice hướng sự kiện",
        "Triển khai saga pattern cho giao dịch phân tán",
        "Xây dựng circuit breaker với ngưỡng thích ứng động",
      ],
      results: [
        { value: "99.97%", label: "uptime" },
        { value: "180ms", label: "độ trễ p99" },
        { value: "0.01%", label: "tỉ lệ lỗi" },
      ],
      insight: "Idempotency key là yêu cầu bắt buộc trong hệ thống thanh toán.",
    },
    p02: {
      title: "Pipeline Phân Tích Thời Gian Thực",
      problem:
        "Batch ETL gây độ trễ dữ liệu 24 giờ, khiến đội vận hành không thể ra quyết định kịp thời.",
      actions: [
        "Thay thế batch bằng streaming với Flink",
        "Xây dựng windowed aggregation tuỳ chỉnh",
        "Triển khai exactly-once semantics",
      ],
      results: [
        { value: "<30s", label: "độ trễ dữ liệu" },
        { value: "500K", label: "sự kiện/giây" },
        { value: "40%", label: "giảm chi phí" },
      ],
      insight: "Exactly-once xứng đáng với độ phức tạp mà nó mang lại.",
    },
    p03: {
      title: "Tái Thiết Kế Nền Tảng Xác Thực",
      problem:
        "Hệ thống auth tự xây 3K dòng code, không có MFA và lỗ hổng session fixation trên 12 service.",
      actions: [
        "Triển khai auth server chuẩn OIDC",
        "Thêm hỗ trợ FIDO2/WebAuthn MFA",
        "Xây dựng token introspection layer cho service mesh",
      ],
      results: [
        { value: "0", label: "lỗ hổng xác thực" },
        { value: "2M+", label: "đăng nhập/ngày" },
        { value: "<50ms", label: "xác thực token" },
      ],
      insight:
        "Bảo mật là thuộc tính của hệ thống, không phải một tính năng rời rạc.",
    },
    p04: {
      title: "Nền Tảng Thương Mại Điện Tử",
      problem:
        "Traffic đột biến dịp Black Friday gây lỗi dây chuyền, mỗi phút sập mất $2M doanh thu.",
      actions: [
        "Triển khai adaptive rate limiting",
        "Xây dựng inventory reservation với TTL lock",
        "Tạo bộ test chaos engineering",
      ],
      results: [
        { value: "0", label: "sự cố" },
        { value: "10x", label: "traffic đỉnh điểm" },
        { value: "$18M", label: "doanh thu BF" },
      ],
      insight:
        "Khả năng phục hồi được xây dựng bằng cách chủ động phá vỡ hệ thống trước.",
    },
    p05: {
      title: "Cải Tổ Pipeline CI/CD",
      problem:
        "Build mất 45 phút, test flaky 30%, deploy 2 giờ với nhiều bước thủ công.",
      actions: [
        "Song song hoá test suite với deterministic test container",
        "Triển khai canary deployment với auto rollback",
        "Xây dựng test impact analysis để bỏ qua suite không bị ảnh hưởng",
      ],
      results: [
        { value: "4 phút", label: "thời gian build" },
        { value: "<1%", label: "tỉ lệ flaky" },
        { value: "15 phút", label: "thời gian deploy" },
      ],
      insight:
        "Vòng phản hồi nhanh thay đổi hành vi lập trình viên hơn bất kỳ chính sách nào.",
    },
    p06: {
      title: "Nền Tảng Dữ Liệu Y Tế",
      problem:
        "Dữ liệu bị cô lập HIPAA trên 8 bệnh viện, đồng bộ hồ sơ bệnh nhân mất 72 giờ.",
      actions: [
        "Xây dựng lớp trao đổi dữ liệu chuẩn FHIR",
        "Triển khai mã hoá cấp trường với key rotation",
        "Tạo audit trail với event log bất biến",
      ],
      results: [
        { value: "<5 phút", label: "đồng bộ hồ sơ" },
        { value: "100%", label: "tuân thủ HIPAA" },
        { value: "8", label: "bệnh viện đang dùng" },
      ],
      insight: "Tuân thủ là kiến trúc, không phải thủ tục giấy tờ.",
    },
    p07: {
      title: "Nền Tảng SaaS Đa Tenant",
      problem:
        "Kiến trúc single-tenant đạt giới hạn ở 50 khách hàng, onboarding mỗi tenant mất 3 tuần.",
      actions: [
        "Thiết kế row-level security với tenant isolation",
        "Xây dựng self-service onboarding bằng infrastructure-as-code",
        "Triển khai connection pooling nhận biết tenant",
      ],
      results: [
        { value: "500+", label: "tenant" },
        { value: "15 phút", label: "onboarding" },
        { value: "60%", label: "tiết kiệm hạ tầng" },
      ],
      insight:
        "Multi-tenancy là quyết định mô hình dữ liệu, không phải chiến lược triển khai.",
    },
    p08: {
      title: "Engine Phát Hiện Gian Lận",
      problem:
        "Hệ thống phát hiện gian lận dựa trên rule bỏ sót 35% và tạo 90% false positive.",
      actions: [
        "Xây dựng feature store thời gian thực từ transaction stream",
        "Triển khai ML model serving với A/B testing framework",
        "Tạo explainability layer để tuân thủ quy định",
      ],
      results: [
        { value: "92%", label: "tỉ lệ phát hiện" },
        { value: "<8%", label: "false positive" },
        { value: "<100ms", label: "độ trễ chấm điểm" },
      ],
      insight:
        "Độ chính xác của model không có nghĩa gì nếu không đáp ứng ngân sách độ trễ vận hành.",
    },
    p09: {
      title: "Quản Lý Fleet Thiết Bị IoT",
      problem:
        "50K+ thiết bị kết nối không ổn định, mất 40% dữ liệu telemetry, không có khả năng cập nhật từ xa.",
      actions: [
        "Xây dựng MQTT broker cluster với store-and-forward",
        "Triển khai hệ thống OTA update dựa trên delta",
        "Tạo device shadow để đồng bộ trạng thái offline",
      ],
      results: [
        { value: "99.5%", label: "giao nhận dữ liệu" },
        { value: "50K+", label: "thiết bị quản lý" },
        { value: "<2GB", label: "kích thước cập nhật" },
      ],
      insight:
        "Eventual consistency là mô hình nhất quán duy nhất hoạt động ở edge.",
    },
    p10: {
      title: "Mạng Phân Phối Nội Dung (CDN)",
      problem:
        "Origin server xử lý 100% traffic, TTFB trung bình 800ms ở APAC, chi phí băng thông $500K/tháng.",
      actions: [
        "Triển khai edge node tại 12 PoP trên toàn cầu",
        "Xây dựng cache invalidation với kiến trúc surrogate key",
        "Triển khai origin shielding với request coalescing",
      ],
      results: [
        { value: "<50ms", label: "TTFB khu vực APAC" },
        { value: "95%", label: "tỉ lệ cache hit" },
        { value: "$120K", label: "chi phí/tháng" },
      ],
      insight: "Cache invalidation chỉ khó nếu key của bạn sai.",
    },
    p11: {
      title: "Tái Xây Dựng Nền Tảng Tìm Kiếm",
      problem:
        "Query LIKE trên MySQL với 50M bản ghi, độ trễ tìm kiếm 12 giây, không thể tinh chỉnh relevance.",
      actions: [
        "Chuyển sang Elasticsearch với custom analyzer",
        "Xây dựng learning-to-rank pipeline từ click log",
        "Triển khai type-ahead với prefix trie index",
      ],
      results: [
        { value: "<80ms", label: "độ trễ tìm kiếm" },
        { value: "3x", label: "cải thiện CTR" },
        { value: "50M", label: "tài liệu đã index" },
      ],
      insight:
        "Chất lượng tìm kiếm là kết quả của lặp đi lặp lại, không phải kiến trúc.",
    },
    p12: {
      title: "Hệ Thống Chat & Thông Báo",
      problem:
        "Messaging dựa trên polling tiêu thụ 60% API capacity, độ trễ gửi tin 5 giây, không hỗ trợ offline.",
      actions: [
        "Xây dựng WebSocket gateway với connection draining",
        "Triển khai message queue với đảm bảo delivery",
        "Tạo client offline-first với CRDT sync",
      ],
      results: [
        { value: "<200ms", label: "thời gian gửi" },
        { value: "80%", label: "giảm tải API" },
        { value: "100K", label: "người dùng đồng thời" },
      ],
      insight:
        "Offline-first không phải tính năng, mà là kiến trúc duy nhất hợp lý cho mobile.",
    },
    p13: {
      title: "Nền Tảng Tự Động Hoá Tuân Thủ",
      problem:
        "Audit SOC2 cần 3 tháng thu thập bằng chứng thủ công, theo dõi 200+ control trên spreadsheet.",
      actions: [
        "Xây dựng giám sát control liên tục từ infrastructure API",
        "Triển khai pipeline tự động thu thập bằng chứng",
        "Tạo drift detection so với baseline tuân thủ",
      ],
      results: [
        { value: "2 tuần", label: "chuẩn bị audit" },
        { value: "200+", label: "control tự động hoá" },
        { value: "98%", label: "độ phủ bằng chứng" },
      ],
      insight:
        "Tuân thủ nên là sản phẩm phụ của hạ tầng tốt, không phải một quy trình riêng biệt.",
    },
    p14: {
      title: "Pipeline Chuyển Mã Video",
      problem:
        "Quy trình chuyển mã thủ công, 8 giờ mỗi video, không có adaptive bitrate, lãng phí $200K/năm.",
      actions: [
        "Xây dựng chuyển mã hướng sự kiện với per-title encoding",
        "Tối ưu adaptive bitrate ladder",
        "Tạo GPU-accelerated preview generation",
      ],
      results: [
        { value: "15 phút", label: "mỗi video" },
        { value: "40%", label: "tiết kiệm lưu trữ" },
        { value: "4K", label: "độ phân giải tối đa" },
      ],
      insight: "Per-title encoding hoàn vốn trong vòng một tháng ở quy mô lớn.",
    },
  };

  const t = translations[p.id as ProjectId];
  if (!t) return p;

  return {
    ...p,
    title: t.title,
    problem: t.problem,
    actions: t.actions,
    results: t.results,
    insight: t.insight,
  };
});

const blogPostsVi = createBlogPostsVi(projectsVi, portfolioDataEn.blogPosts);
const projectsViWithBlogUrls = withBlogUrls(projectsVi, blogPostsVi);

const certificatesVi = portfolioDataEn.certificates.map((cert) => {
  const nameMap: Record<string, string> = {
    "Olympic PMNM Contest 2025": "Cuộc thi Olympic PMNM 2025",
    "ICPC Vietnam Southern Provincial PC":
      "ICPC Việt Nam — Vòng Khu Vực Miền Nam",
    "ICPC Vietnam National PC": "ICPC Việt Nam — Vòng Quốc Gia",
  };
  return { ...cert, name: nameMap[cert.name] ?? cert.name };
});

export const portfolioDataVi: PortfolioData = {
  ...portfolioDataEn,

  heroLines: [
    { prompt: "~", cmd: "whoami", output: "lập trình viên full-stack" },
    {
      prompt: "~",
      cmd: "cat focus.txt",
      output:
        "hệ thống phân tán · dữ liệu thời gian thực · platform engineering",
    },
    { prompt: "~", cmd: "uptime", output: "4+ năm lập trình" },
  ],

  welcomeLines: [
    { text: "Xin chào,", pauseAfter: 300 },
    { text: "Mình là", pauseAfter: 100 },
    {
      text: "TAN",
      className: "text-terminal-accent text-shadow-glow font-bold",
      pauseAfter: 400,
    },
    { text: "Một kỹ sư phần mềm", pauseAfter: 200 },
  ],

  principles: [
    { label: "đơn giản", desc: "Code tốt nhất là code không cần phải viết." },
    {
      label: "bền bỉ",
      desc: "Thiết kế cho thất bại. Dự đoán trước. Xử lý sẵn.",
    },
    { label: "quan sát", desc: "Không nhìn thấy thì không thể sửa." },
    { label: "trách nhiệm", desc: "Bạn xây dựng nó, bạn vận hành nó." },
  ],

  stats: [
    { value: "2+", label: "năm phát triển" },
    { value: "20+", label: "dự án" },
    { value: "10+", label: "ngôn ngữ lập trình" },
    { value: "100+", label: "commit/tháng" },
    { value: "8+ giờ", label: "coding mỗi ngày" },
    { value: "cao", label: "độ tin cậy" },
  ],

  certificates: certificatesVi,

  profile: profileVi,

  siteConfig: {
    ...portfolioDataEn.siteConfig,
    navLinks: [
      { label: "dự án", href: "#projects" },
      { label: "blog", href: "/blog" },
      { label: "công nghệ", href: "#stack" },
      { label: "liên hệ", href: "#contact" },
    ],
    sectionTitles: {
      projects: "công trình tiêu biểu",
      connect: "kết nối",
    },
    status: {
      text: "Sẵn sàng nhận dự án mới",
      detail: "Thời gian phản hồi: ~24h",
    },
    contact: {
      ...portfolioDataEn.siteConfig.contact,
      description:
        "Sinh viên mới tốt nghiệp | Lập trình viên Full-stack và đam mê Cloud Native. Sẵn sàng cho vị trí Fresher và tư vấn kỹ thuật. Ưu tiên trao đổi bất đồng bộ! ⚡",
    },
  },

  projects: projectsViWithBlogUrls,
  blogPosts: blogPostsVi,
};
