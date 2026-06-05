import type { BlogPost } from "./blog.types";
import type { Project } from "./portfolio.types";

const SECTION_HEADINGS_VI: Record<string, [string, string, string]> = {
  fintech: [
    "Bối cảnh kinh doanh",
    "Triển khai kỹ thuật",
    "Kết quả tuân thủ & rủi ro",
  ],
  data: ["Thách thức dữ liệu", "Kiến trúc pipeline", "Chỉ số & tác động"],
  security: ["Bức tranh bảo mật", "Kiến trúc an ninh", "Kết quả tăng cường"],
  retail: [
    "Bài toán thương mại",
    "Hướng giải quyết kỹ thuật",
    "Kết quả kinh doanh",
  ],
  devops: ["Điểm nghẽn hạ tầng", "Kỹ thuật nền tảng", "Cải thiện độ tin cậy"],
  healthcare: ["Bối cảnh y tế", "Thiết kế hệ thống", "Tuân thủ & kết quả"],
  saas: ["Thách thức sản phẩm", "Quyết định kiến trúc", "Tín hiệu tăng trưởng"],
  iot: ["Bối cảnh thiết bị & biên", "Kiến trúc tích hợp", "Dữ liệu vận hành"],
  infra: ["Thách thức hạ tầng", "Thiết kế nền tảng", "Ổn định & hiệu năng"],
  media: [
    "Bài toán mở rộng nội dung",
    "Kiến trúc phân phối",
    "Hiệu suất & khán giả",
  ],
};

const DEFAULT_HEADINGS_VI: [string, string, string] = [
  "Bối cảnh vấn đề",
  "Hành trình triển khai",
  "Kết quả và bài học",
];

const DEFAULT_READ_TIME_VI = "Đọc trong 6 phút";
const CUSTOM_READ_TIMES_VI: Record<string, string> = {
  p01: "Đọc trong 12 phút",
  p07: "Đọc trong 9 phút",
};

export const createBlogPostsVi = (
  projects: Project[],
  blogPostsEn: BlogPost[],
): BlogPost[] => {
  const blogSlugByProjectId = new Map(
    blogPostsEn.map((post) => [post.projectId, post.slug]),
  );

  return projects.map((project) => {
    const [h1, h2, h3] =
      SECTION_HEADINGS_VI[project.tag] ?? DEFAULT_HEADINGS_VI;
    return {
      id: `blog-${project.id}`,
      projectId: project.id,
      slug: blogSlugByProjectId.get(project.id) ?? project.id,
      title: `${project.title} - Phân tích kỹ thuật`,
      excerpt: `Bài viết chi tiết về kiến trúc, quá trình triển khai và bài học từ dự án ${project.title}.`,
      publishedAt: project.created_at,
      readTime: CUSTOM_READ_TIMES_VI[project.id] ?? DEFAULT_READ_TIME_VI,
      tags: [project.tag, ...project.tech.slice(0, 2)],
      sections: [
        {
          heading: h1,
          paragraphs: [
            project.problem,
            "Trước khi thực hiện, các ràng buộc về khả năng mở rộng, độ tin cậy và chi phí vận hành đã được phân tích kỹ lưỡng.",
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
            `Chỉ số đạt được: ${project.results.map((r) => `${r.value} ${r.label}`).join(", ")}.`,
            `Bài học chính: ${project.insight}`,
          ],
        },
      ],
    };
  });
};
