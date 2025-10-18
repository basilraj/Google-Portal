
export type JobStatus = 'active' | 'closing-soon' | 'expired';

export interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  qualification: string;
  vacancies: string;
  postedDate: string; // YYYY-MM-DD
  lastDate: string; // YYYY-MM-DD
  applyLink: string;
  status: JobStatus;
  createdAt: string; // ISO 8601
}

export interface QuickLink {
  id: string;
  title: string;
  category: string;
  url: string;
  description: string;
  status: 'active' | 'inactive';
}

export type PostType = 'posts' | 'exam-notices' | 'results';
export type PostStatus = 'published' | 'draft';

export interface ContentPost {
  id: string;
  title: string;
  category: string;
  content: string;
  status: PostStatus;
  type: PostType;
  publishedDate: string; // YYYY-MM-DD
  createdAt?: string; // ISO 8601
  examDate?: string; // YYYY-MM-DD
  imageUrl?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscriptionDate: string; // YYYY-MM-DD
  status: 'active' | 'inactive';
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string; // ISO 8601
}

export interface BreakingNews {
  id: string;
  text: string;
  link: string;
  status: 'active' | 'inactive';
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface ABTest {
  id: string;
  placement: string;
  enabled: boolean;
  codeA: string;
  codeB: string;
  stats: {
    impressionsA: number;
    clicksA: number;
    impressionsB: number;
    clicksB: number;
  };
}

export interface GeoTargetedAd {
  id: string;
  country: string;
  code: string;
}

export interface AdSettings {
  headerAdEnabled: boolean;
  headerAdCode: string;
  sidebarAdEnabled: boolean;
  sidebarAdCode: string;
  footerAdEnabled: boolean;
  footerAdCode: string;
  adFrequency: 'low' | 'medium' | 'high';
  adStartTime: string;
  adEndTime: string;
  bannerAds: boolean;
  squareAds: boolean;
  skyscraperAds: boolean;
  popupAds: boolean;
  adsense: {
    enabled: boolean;
    publisherId: string;
  };
  customAds: {
    enabled: boolean;
    rotation: boolean;
    codes: string[];
  };
  abTests: ABTest[];
  deviceTargeting: {
    enabled: boolean;
    desktopCode: string;
    mobileCode: string;
  };
  geoTargeting: {
    enabled: boolean;
    rules: GeoTargetedAd[];
  };
}

export interface SEOSettings {
    global: {
        siteTitle: string;
        metaDescription: string;
        metaKeywords: string;
    };
    social: {
        ogTitle: string;
        ogDescription: string;
        ogImageUrl: string;
    };
    structuredData: {
        jobPostingSchemaEnabled: boolean;
    };
}

export interface GeneralSettings {
    maintenanceMode: boolean;
    maintenanceMessage: string;
}

export interface SocialMediaSettings {
    facebook: string;
    instagram: string;
    telegram: string;
    whatsapp: string;
}
