// FIX: Removed self-import of types which caused declaration conflicts.



export type JobStatus = 'active' | 'closing-soon' | 'expired';
export type LinkStatus = 'active' | 'inactive';
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
  lastDate: string;   // YYYY-MM-DD
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
  status: LinkStatus;
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
  examDate?: string;    // YYYY-MM-DD
  imageUrl?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscriptionDate: string; // YYYY-MM-DD
  status: 'active';
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
  status: LinkStatus;
}

export interface ABTestStats {
    impressionsA: number;
    clicksA: number;
    impressionsB: number;
    clicksB: number;
}

export interface ABTest {
    id: string;
    placement: string;
    enabled: boolean;
    codeA: string;
    codeB: string;
    stats: ABTestStats;
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
    emailNotificationsEnabled: boolean;
}

export interface SocialMediaSettings {
    facebook: string;
    instagram: string;
    telegram: string;
    whatsapp: string;
    telegramGroup: string;
    telegramGroupIcon: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface EmailNotification {
  id: string;
  recipient: string; // Subscriber's email
  subject: string;
  body: string;
  sentAt: string; // ISO 8601
  jobId: string; // To link back to the job
}

export interface CustomEmail {
  id: string;
  recipients: 'all' | string[]; // 'all' for all subscribers, or an array of emails
  subject: string;
  body: string;
  sentAt: string; // ISO 8601
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
}