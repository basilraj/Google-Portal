export type PostType = 'posts' | 'exam-notices' | 'results';

export interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  qualification: string;
  vacancies: string;
  postedDate: string;
  lastDate: string;
  applyLink: string;
  status: 'active' | 'closing-soon' | 'expired';
  createdAt?: string;
}

export interface QuickLink {
  id: string;
  title: string;
  category: string;
  url: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt?: string;
}

export interface ContentPost {
  id: string;
  title: string;
  category: string;
  content: string;
  status: 'published' | 'draft';
  type: PostType;
  publishedDate: string;
  createdAt?: string;
  examDate?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscriptionDate: string;
  status: 'active';
}

export interface AdSettings {
  // Display Settings
  adFrequency: 'low' | 'medium' | 'high';
  bannerAds: boolean;
  squareAds: boolean;
  skyscraperAds: boolean;
  popupAds: boolean;
  adStartTime: string;
  adEndTime: string;

  // Network Configurations
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
  
  // Kept for backward compatibility if needed, but new implementation focuses on networks
  headerAdCode: string;
  sidebarAdCode: string;
  footerAdCode: string;
  headerAdEnabled: boolean;
  sidebarAdEnabled: boolean;
  footerAdEnabled: boolean;
}


export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export interface BreakingNews {
    id: string;
    text: string;
    link: string;
    status: 'active' | 'inactive';
}
