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
  createdAt?: string; // ISO string
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

export interface ContentPost {
  id: string;
  title: string;
  category: string;
  content: string;
  status: 'published' | 'draft';
  type: PostType;
  publishedDate: string; // YYYY-MM-DD
  createdAt?: string; // ISO string
  examDate?: string; // YYYY-MM-DD
  imageUrl?: string;
  detailsUrl?: string;
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
  submittedAt: string; // ISO string
}

export interface BreakingNews {
  id: string;
  text: string;
  link: string;
  status: 'active' | 'inactive';
}

export interface SponsoredAd {
  id: string;
  imageUrl: string;
  destinationUrl: string;
  placement: 'sidebar-top' | 'header' | 'footer';
  status: 'active' | 'inactive';
  clicks: number;
}


export interface ABTest {
  id: string;
  placement: string;
  enabled: boolean;
  codeA: string;
  codeB: string;
  stats: {
    impressionsA: number;
    impressionsB: number;
    clicksA: number;
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
  sponsoredAds: SponsoredAd[];
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
  sentAt: string; // ISO string
}

export interface CustomEmail {
    id: string;
    subject: string;
    body: string;
    sentAt: string; // ISO string
}

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO string
  action: string;
  details: string;
}

export interface SMTPSettings {
  configured: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
}

export interface RSSSettings {
    feedUrl: string;
}

export interface BackupData {
    jobs: Job[];
    quickLinks: QuickLink[];
    posts: ContentPost[];
    subscribers: Subscriber[];
    breakingNews: BreakingNews[];
    adSettings: AdSettings;
    seoSettings: SEOSettings;
    generalSettings: GeneralSettings;
    socialMediaSettings: SocialMediaSettings;
    activityLogs: ActivityLog[];
    smtpSettings: SMTPSettings;
    rssSettings: RSSSettings;
}

export interface User {
    username: string;
    passwordHash: string;
    email: string;
}