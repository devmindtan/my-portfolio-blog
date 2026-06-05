import { portfolioDataEn } from "./portfolio.en";
import type { PortfolioData } from "./portfolio.types";
import { createBlogPostsVi } from "./blog.vi";
import { withBlogUrls } from "./blog.en";

const profileVi = {
  ...portfolioDataEn.profile,
  title: "Lập trình viên Full-Stack",
  summary:
    "Kỹ sư phần mềm mới tốt nghiệp với kinh nghiệm thực chiến ở cả web, mobile và backend microservice. Mình tập trung vào triển khai sản phẩm thực tế: ứng dụng offline-first, luồng xác thực an toàn và hệ thống dữ liệu có thể vận hành ổn định.",
  detail:
    "Trong giai đoạn gần đây, mình xây dựng nền tảng đồ án SmartCity (KLTN_2026), các ứng dụng mobile dùng Expo + Supabase, và các project xác thực với Google/Microsoft. Mình có thể đi xuyên suốt từ UI, API đến tích hợp dịch vụ và tổ chức cấu hình triển khai để sản phẩm hoạt động trơn tru.",
  experience: portfolioDataEn.profile.experience.map((item, index) => {
    const descriptions = [
      "Xây dựng hệ thống SmartCity giám sát và dự đoán lưu lượng giao thông theo kiến trúc microservice phân tán, gồm web dashboard, API server và dịch vụ AI nền.",
      "Phát triển nhóm ứng dụng mobile theo hướng offline-first (TaskFlow, Muscle Exercise Manager, Mobile Image Uploader) với SQLite cục bộ và đồng bộ Supabase.",
      "Đóng góp cho prototype Verzik gồm app quản trị giao thức, backend API và thành phần blockchain phục vụ xác thực tài liệu phi tập trung.",
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
      title: "KLTN_2026 - Nền tảng Giám sát Giao thông Thông minh",
      problem:
        "Bài toán giao thông cần kết hợp luồng camera thời gian thực, mô hình dự báo và dashboard điều hành trong cùng một hệ thống đồng bộ.",
      actions: [
        "Thiết kế kiến trúc microservice phân tán cho web React, API Node.js và dịch vụ Python",
        "Tích hợp các khối xử lý ảnh, dự báo, phân tích quyết định và tạo báo cáo tự động",
        "Chuẩn bị cấu hình Kubernetes và cronjob cho backup, export, sync và đo hiệu năng mô hình",
      ],
      results: [
        { value: "10+", label: "nhóm API" },
        { value: "9", label: "service backend" },
        { value: "K8s", label: "sẵn sàng triển khai" },
      ],
      insight:
        "Đồ án chỉ thật sự mạnh khi ranh giới service và quy trình vận hành được thiết kế rõ ràng ngay từ đầu.",
    },
    p02: {
      title: "TaskFlow - Quản lý Công việc Offline-first",
      problem:
        "Ứng dụng task trên mobile cần hoạt động mượt khi mất mạng nhưng vẫn đảm bảo đồng bộ an toàn khi online.",
      actions: [
        "Triển khai luồng local-first với SQLite làm nguồn dữ liệu chính",
        "Xây dựng đồng bộ dirty-sync lên Supabase mỗi 60 giây và hỗ trợ sync thủ công",
        "Tách logic mobile đầy đủ và web preview để giữ hành vi nhất quán",
      ],
      results: [
        { value: "60s", label: "chu kỳ auto-sync" },
        { value: "SQLite", label: "lưu trữ cục bộ" },
        { value: "Supabase", label: "đồng bộ đám mây" },
      ],
      insight:
        "Offline-first giúp người dùng luôn làm việc được ngay, đồng bộ chỉ là bước bổ sung phía sau.",
    },
    p03: {
      title: "Muscle Exercise Manager",
      problem:
        "Ứng dụng theo dõi tập luyện cần thao tác ghi log nhanh, ổn định offline và có thể đồng bộ ảnh minh họa.",
      actions: [
        "Xây dựng luồng Weekly Plan, Dashboard, Body Metrics và Workout Log theo mobile-first",
        "Triển khai SQLite local kết hợp đồng bộ cloud với cơ chế dirty state",
        "Tích hợp Google Sign-In và upload ảnh lên MinIO cho tài nguyên bài tập",
      ],
      results: [
        { value: "offline-first", label: "workflow chính" },
        { value: "Google", label: "xác thực tài khoản" },
        { value: "MinIO", label: "lưu trữ media" },
      ],
      insight:
        "Với sản phẩm lifestyle, tốc độ ghi nhận và độ ổn định quan trọng hơn số lượng tính năng.",
    },
    p04: {
      title: "Mobile Image Uploader",
      problem:
        "Upload nhiều ảnh từ mobile cần hàng chờ rõ ràng, theo dõi tiến trình cụ thể và tích hợp object storage ổn định.",
      actions: [
        "Xây dựng luồng chọn ảnh và hàng chờ upload với trạng thái chi tiết",
        "Triển khai màn hình tiến trình theo từng file kèm xử lý lỗi",
        "Kết nối thao tác upload, list và delete trực tiếp với endpoint MinIO tương thích S3",
      ],
      results: [
        { value: "4", label: "màn hình chính" },
        { value: "50MB", label: "mức khuyến nghị/file" },
        { value: "live", label: "theo dõi tiến trình" },
      ],
      insight:
        "UX hàng chờ minh bạch giúp giảm lỗi vận hành và giảm phụ thuộc vào support.",
    },
    p05: {
      title: "Google Connect",
      problem:
        "Demo đăng nhập mobile thường chỉ dừng ở giao diện, trong khi ứng dụng thật cần quản lý state người dùng đầy đủ.",
      actions: [
        "Tích hợp Google Sign-In SDK trong dự án Expo Router",
        "Xây dựng AuthContext cho login/logout và quản lý user state",
        "Hoàn thiện luồng màn hình đăng nhập và profile để kiểm tra end-to-end",
      ],
      results: [
        { value: "Expo", label: "nền tảng đa thiết bị" },
        { value: "Google Sign-In", label: "nhà cung cấp định danh" },
        { value: "AuthContext", label: "lớp quản lý phiên" },
      ],
      insight:
        "Chất lượng auth nằm ở xử lý trạng thái và lỗi, không chỉ ở trường hợp đăng nhập thành công.",
    },
    p06: {
      title: "Azure Connect",
      problem:
        "Người dùng trường học/doanh nghiệp cần đăng nhập Microsoft đơn giản và xem thông tin định danh đã cấp quyền.",
      actions: [
        "Triển khai luồng OAuth 2.0 với Microsoft identity platform",
        "Xây dựng session backend bằng Express và bảo vệ route dashboard",
        "Kết nối Microsoft Graph API để lấy thông tin user qua endpoint riêng",
      ],
      results: [
        { value: "OAuth 2.0", label: "đăng nhập Microsoft 365" },
        { value: "/api/me", label: "endpoint thông tin user" },
        { value: "Express", label: "backend quản lý session" },
      ],
      insight:
        "Demo xác thực chỉ đáng tin khi luồng token và session boundary được thể hiện minh bạch.",
    },
    p07: {
      title: "Verzik - Prototype Giao thức Blockchain",
      problem:
        "Quy trình xác thực tài liệu cần cơ chế toàn vẹn dữ liệu và quản trị vai trò rõ ràng giữa nhiều operator.",
      actions: [
        "Xây dựng app quản trị giao thức theo mô hình role-based cho tenant, operator và document",
        "Phát triển backend và module blockchain kèm SDK, smart contract toolchain",
        "Chuẩn bị thành phần subgraph để theo dõi event của giao thức",
      ],
      results: [
        { value: "RBAC", label: "mô hình quản trị" },
        { value: "Hardhat", label: "toolchain hợp đồng" },
        { value: "Subgraph", label: "lớp index sự kiện" },
      ],
      insight:
        "Prototype blockchain hiệu quả khi giúp chốt rule quản trị trước khi đi sâu vào độ phức tạp production.",
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
      "ICPC Việt Nam - Vòng Khu Vực Miền Nam",
    "ICPC Vietnam National PC": "ICPC Việt Nam - Vòng Quốc Gia",
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
      output: "nền tảng web · ứng dụng mobile · backend microservices",
    },
    { prompt: "~", cmd: "uptime", output: "2+ năm xây dựng sản phẩm" },
  ],

  welcomeLines: [
    { text: "Xin chào,", pauseAfter: 300 },
    { text: "Mình là", pauseAfter: 100 },
    {
      text: "TAN",
      className: "text-terminal-accent text-shadow-glow font-bold",
      pauseAfter: 400,
    },
    { text: "Một lập trình viên Full-Stack", pauseAfter: 200 },
  ],

  principles: [
    { label: "đơn giản", desc: "Chỉ xây thứ sản phẩm thực sự cần." },
    {
      label: "bền bỉ",
      desc: "Thiết kế ưu tiên hoạt động ổn định cả khi offline hoặc lỗi mạng.",
    },
    { label: "quan sát", desc: "Đo được thì mới tối ưu được." },
    {
      label: "trách nhiệm",
      desc: "Theo dự án xuyên suốt từ lúc code đến lúc chạy thực tế.",
    },
  ],

  stats: [
    { value: "2+", label: "năm xây dựng sản phẩm" },
    { value: "7", label: "repository dự án chính" },
    { value: "3", label: "nền tảng (web/mobile/backend)" },
    { value: "5+", label: "tích hợp auth và dữ liệu" },
    { value: "offline-first", label: "kiến trúc ưa thích" },
    { value: "24h", label: "thời gian phản hồi trung bình" },
  ],

  certificates: certificatesVi,

  profile: profileVi,

  siteConfig: {
    ...portfolioDataEn.siteConfig,
    navLinks: [
      { label: "dự án", href: "#projects" },
      { label: "blog", href: "/blog" },
      { label: "websites", href: "#websites" },
      { label: "công nghệ", href: "#stack" },
      { label: "liên hệ", href: "#contact" },
    ],
    sectionTitles: {
      projects: "dự án tiêu biểu",
      connect: "kết nối",
    },
    status: {
      text: "Sẵn sàng cho vị trí fresher full-stack",
      detail: "Thời gian phản hồi: ~24h",
    },
    contact: {
      ...portfolioDataEn.siteConfig.contact,
      description:
        "Kỹ sư phần mềm mới tốt nghiệp, định hướng Full-Stack và Cloud Native. Sẵn sàng cho cơ hội fresher và các dự án thực chiến.",
    },
  },

  projects: projectsViWithBlogUrls,
  blogPosts: blogPostsVi,
};
