// Fix: Separate type definitions from constants to resolve circular dependencies.
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
  createdAt: string; // ISO String
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
    status: 'published' | 'draft';
    type: 'posts' | 'exam-notices' | 'results';
    publishedDate: string; // YYYY-MM-DD
    createdAt: string; // ISO String
    examDate?: string; // YYYY-MM-DD
    detailsUrl?: string;
    imageUrl?: string;
    seoTitle?: string;
    seoDescription?: string;
}

export interface Subscriber {
    id: string;
    email: string;
    subscriptionDate: string; // YYYY-MM-DD
    status: 'active' | 'inactive';
}

export interface BreakingNews {
    id: string;
    text: string;
    link: string;
    status: 'active' | 'inactive';
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

export interface SponsoredAd {
    id: string;
    imageUrl: string;
    destinationUrl: string;
    placement: 'sidebar-top';
    status: 'active' | 'inactive';
    clicks?: number;
}

export interface AdSettings {
    headerAdEnabled: boolean;
    headerAdCode: string;
    sidebarAdEnabled: boolean;
    sidebarAdCode: string;
    footerAdEnabled: boolean;
    footerAdCode: string;
    inFeedJobsAdEnabled: boolean;
    inFeedJobsAdCode: string;
    inFeedBlogAdEnabled: boolean;
    inFeedBlogAdCode: string;
    jobDetailTopAdEnabled: boolean;
    jobDetailTopAdCode: string;
    blogDetailTopAdEnabled: boolean;
    blogDetailTopAdCode: string;
    adFrequency: 'low' | 'medium' | 'high';
    adStartTime: string; // HH:mm
    adEndTime: string; // HH:mm
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

export interface User {
    username: string;
    email: string;
    passwordHash: string;
}

export interface ActivityLog {
    id: string;
    timestamp: string; // ISO String
    action: string;
    details: string;
}

export interface RSSSettings {
    feedUrl: string;
}

export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    submittedAt: string; // ISO String
}

export interface EmailNotification {
    id: string;
    recipient: string;
    subject: string;
    body: string;
    sentAt: string; // ISO String
}

export interface CustomEmail {
    id: string;
    subject: string;
    body: string;
    sentAt: string; // ISO String
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