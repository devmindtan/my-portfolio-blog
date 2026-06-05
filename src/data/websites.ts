export interface WebsiteCardItem {
  id: string;
  name: string;
  url: string;
  description: {
    en: string;
    vi: string;
  };
  tags: string[];
  iconUrl?: string;
  thumbnailUrl?: string;
}

export const WEBSITE_ITEMS_PER_PAGE = 8;

function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function buildWebsiteIconUrl(url: string): string {
  const domain = getDomainFromUrl(url);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export function buildWebsiteThumbnailUrl(url: string): string {
  return `https://image.thum.io/get/width/900/noanimate/${url}`;
}

export function withAutoWebsiteImages(item: WebsiteCardItem): WebsiteCardItem {
  return {
    ...item,
    iconUrl: item.iconUrl ?? buildWebsiteIconUrl(item.url),
    thumbnailUrl: item.thumbnailUrl ?? buildWebsiteThumbnailUrl(item.url),
  };
}

// Static website showcase data. Thumbnail and icon are URL-based so cards can render directly.
export const websiteCards: WebsiteCardItem[] = [
  {
    id: "w01",
    name: "Portfolio",
    url: "https://my-portfolio-eight-opal-45.vercel.app/",
    description: {
      en: "Personal portfolio with project highlights, technical blog, and multilingual profile.",
      vi: "Website portfolio cá nhân với dự án nổi bật, blog kỹ thuật và hồ sơ đa ngôn ngữ.",
    },
    tags: ["portfolio", "react", "vercel"],
  },
  {
    id: "w02",
    name: "SmartCity",
    url: "https://smartcity.devmindtan.uk/",
    description: {
      en: "Graduation thesis platform for traffic monitoring and forecasting with a microservice architecture.",
      vi: "Nền tảng đồ án tốt nghiệp cho giám sát và dự báo giao thông theo kiến trúc microservice.",
    },
    tags: ["smartcity", "analytics", "microservices"],
  },
  {
    id: "w03",
    name: "TaskFlow Repo",
    url: "https://github.com/devmindtan/TaskFlow",
    description: {
      en: "Offline-first task management app with SQLite local storage and Supabase sync.",
      vi: "Ứng dụng quản lý task offline-first với SQLite cục bộ và đồng bộ Supabase.",
    },
    tags: ["expo", "sqlite", "supabase"],
  },
  {
    id: "w04",
    name: "Muscle Exercise Manager Repo",
    url: "https://github.com/devmindtan/muscle-exercise-manager",
    description: {
      en: "Workout tracking app with offline-first flow, Google Sign-In, and MinIO media sync.",
      vi: "Ứng dụng theo dõi tập luyện với luồng offline-first, Google Sign-In và đồng bộ media MinIO.",
    },
    tags: ["fitness", "expo", "mobile"],
  },
  {
    id: "w05",
    name: "Mobile Image Uploader Repo",
    url: "https://github.com/devmindtan/mobile-image-uploader",
    description: {
      en: "Mobile utility app for selecting, uploading, listing, and deleting images on MinIO.",
      vi: "Ứng dụng mobile tiện ích để chọn, upload, xem danh sách và xóa ảnh trên MinIO.",
    },
    tags: ["minio", "upload", "react-native"],
  },
  {
    id: "w06",
    name: "Azure Connect Repo",
    url: "https://github.com/devmindtan/vlu-connect",
    description: {
      en: "Node.js + Express app for Microsoft 365 OAuth and Graph profile retrieval.",
      vi: "Ứng dụng Node.js + Express cho OAuth Microsoft 365 và lấy thông tin hồ sơ qua Graph.",
    },
    tags: ["oauth", "microsoft", "express"],
  },
  {
    id: "w07",
    name: "Google Connect Repo",
    url: "https://github.com/devmindtan/google-connect",
    description: {
      en: "Expo app prototype integrating Google Sign-In with profile flow and auth context.",
      vi: "Prototype Expo tích hợp Google Sign-In với luồng profile và auth context.",
    },
    tags: ["google", "expo", "auth"],
  },
  {
    id: "w08",
    name: "Verzik App",
    url: "https://verzik-app.vercel.app/",
    description: {
      en: "Blockchain protocol management prototype for document verification and operator governance.",
      vi: "Prototype quản trị giao thức blockchain cho xác thực tài liệu và quản trị operator.",
    },
    tags: ["blockchain", "governance", "prototype"],
  },
];
