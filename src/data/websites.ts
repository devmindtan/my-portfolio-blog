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
    url: "https://my-portfolio.devmindtan.uk/",
    description: {
      en: "Personal portfolio website with projects, blog and CV export.",
      vi: "Website portfolio cá nhân với dự án, blog và xuất CV.",
    },
    tags: ["portfolio", "react", "vercel"],
  },
  {
    id: "w02",
    name: "SmartCity",
    url: "https://smartcity.devmindtan.uk/",
    description: {
      en: "Traffic monitoring and prediction platform for smart city scenarios.",
      vi: "Nền tảng giám sát và dự đoán mật độ giao thông cho kịch bản đô thị thông minh.",
    },
    tags: ["iot", "analytics", "microservices"],
  },
  {
    id: "w03",
    name: "Verzik App",
    url: "https://verzik-app.vercel.app/",
    description: {
      en: "Web app for decentralized workflows and protocol-related utilities.",
      vi: "Ứng dụng web cho workflow phi tập trung và các tiện ích liên quan giao thức.",
    },
    tags: ["dapp", "web3", "frontend"],
  },
  {
    id: "w04",
    name: "GitHub",
    url: "https://github.com/devmindtan",
    description: {
      en: "Open-source repositories, experiments and engineering playground.",
      vi: "Kho mã nguồn mở, các thử nghiệm và khu vực kỹ thuật cá nhân.",
    },
    tags: ["opensource", "code", "repos"],
  },
  {
    id: "w05",
    name: "LinkedIn",
    url: "https://linkedin.com/in/devmind-tan/",
    description: {
      en: "Professional profile, career timeline and technical highlights.",
      vi: "Hồ sơ nghề nghiệp, lộ trình làm việc và các điểm nhấn kỹ thuật.",
    },
    tags: ["profile", "network", "career"],
  },
  {
    id: "w06",
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61578904173779",
    description: {
      en: "Social profile and direct communication channel.",
      vi: "Trang cá nhân mạng xã hội và kênh liên hệ trực tiếp.",
    },
    tags: ["social", "contact"],
  },
  {
    id: "w07",
    name: "KLTN 2026 Repo",
    url: "https://github.com/devmindtan/KLTN_2026",
    description: {
      en: "Graduation thesis source code and technical implementation notes.",
      vi: "Mã nguồn đồ án tốt nghiệp và các ghi chú triển khai kỹ thuật.",
    },
    tags: ["thesis", "research", "source"],
  },
  {
    id: "w08",
    name: "UtilityBox",
    url: "https://github.com/devmindtan/UtilityBox",
    description: {
      en: "Collection of reusable utilities, assets and helper tools.",
      vi: "Bộ sưu tập tiện ích tái sử dụng, tài nguyên và helper tools.",
    },
    tags: ["tools", "assets", "utilities"],
  },
];
