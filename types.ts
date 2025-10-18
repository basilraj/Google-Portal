export interface Job {
  id: string;
  title: string;
  department: string;
  postDate: string;
  lastDate: string;
  shortInfo: string;
  content: string; // Markdown or HTML content
  tags: string[];
  importantLinks: { label: string; url: string }[];
  isFeatured?: boolean;
}

export interface Subscriber {
  id: string;
  email: string;
  subscriptionDate: string;
  status: 'active' | 'inactive';
}

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  category: 'Admit Card' | 'Result' | 'Latest Jobs' | 'Answer Key' | 'Syllabus';
}

export interface ContentPost {
  id: string;
  title: string;
  content: string; // Markdown or HTML
  author: string;
  publishDate: string;
  category: 'Blog' | 'News' | 'Updates';
  tags: string[];
}

export interface BreakingNews {
  id:string;
  text: string;
  link: string;
  isActive: boolean;
}

export interface AdSettings {
  adsense: {
    enabled: boolean;
    publisherId: string;
  };
  adsterra: {
    enabled: boolean;
    zoneId: string;
  };
  customAds: {
    enabled: boolean;
    code: string;
  };
  adFrequency: 'low' | 'medium' | 'high';
  adStartTime: string;
  adEndTime: string;
  bannerAds: boolean;
  squareAds: boolean;
  skyscraperAds: boolean;
  popupAds: boolean;
}

export interface GeneralSettings {
  siteTitle: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  footerText: string;
}

export interface DataContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id'>) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  subscribers: Subscriber[];
  addSubscriber: (email: string) => void;
  deleteSubscriber: (id: string) => void;
  quickLinks: QuickLink[];
  addQuickLink: (link: Omit<QuickLink, 'id'>) => void;
  updateQuickLink: (link: QuickLink) => void;
  deleteQuickLink: (id: string) => void;
  contentPosts: ContentPost[];
  addContentPost: (post: Omit<ContentPost, 'id'>) => void;
  updateContentPost: (post: ContentPost) => void;
  deleteContentPost: (id: string) => void;
  breakingNews: BreakingNews[];
  addBreakingNews: (news: Omit<BreakingNews, 'id'>) => void;
  updateBreakingNews: (news: BreakingNews) => void;
  deleteBreakingNews: (id: string) => void;
  adSettings: AdSettings;
  updateAdSettings: (settings: AdSettings) => void;
  generalSettings: GeneralSettings;
  updateGeneralSettings: (settings: GeneralSettings) => void;
  loading: boolean;
}
