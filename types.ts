export type JobStatus = 'active' | 'closing-soon' | 'expired';
export type PostStatus = 'published' | 'draft';
export type PostType = 'posts' | 'exam-notices' | 'results';

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

export interface GeoTargetedAd {
    id: string;
    country: string; // e.g., 'IN', 'US'
    code: string;
}
  
export interface ABTest {
    id: string;
    placement: string; // e.g., 'Header', 'Sidebar'
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
  
export interface AdSettings {
    adFrequency: 'low' | 'medium' | 'high';
    adStartTime: string; // HH:mm
    adEndTime: string;   // HH:mm
    bannerAds: boolean;
    squareAds: boolean;
    skyscraperAds: boolean;
    popupAds: boolean;
    headerAdEnabled: boolean;
    headerAdCode: string;
    sidebarAdEnabled: boolean;
    sidebarAdCode: string;
    footerAdEnabled: boolean;
    footerAdCode: string;
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
    siteTitle: string;
    siteIconUrl: string;
    maintenanceMode: boolean;
    maintenanceMessage: string;
    emailNotificationsEnabled: boolean;
}

export interface SocialMediaSettings {
    facebook: string;
    instagram: string;
    telegram: string;
    telegramGroup: string;
    telegramGroupIcon: string;
    whatsapp: string;
}

export interface EmailNotification {
    id: string;
    recipient: string;
    subject: string;
    body: string;
    sentAt: string; // ISO 8601
    jobId?: string;
}

export interface CustomEmail {
    id: string;
    recipients: 'all' | string[]; // 'all' or array of emails
    subject: string;
    body: string;
    sentAt: string; // ISO 8601
}

export interface SMTPSettings {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
  secure: boolean;
  configured: boolean;
}

export interface BackupData {
    jobs: Job[];
    quickLinks: QuickLink[];
    posts: ContentPost[];
    subscribers: Subscriber[];
    contacts: ContactSubmission[];
    breakingNews: BreakingNews[];
    adSettings: AdSettings;
    seoSettings: SEOSettings;
    generalSettings: GeneralSettings;
    socialMediaSettings: SocialMediaSettings;
    emailNotifications: EmailNotification[];
    customEmails: CustomEmail[];
    smtpSettings: SMTPSettings;
}
