import { Job, QuickLink, ContentPost, Subscriber, BreakingNews, AdSettings, SEOSettings, GeneralSettings, SocialMediaSettings, ContactSubmission, EmailNotification, CustomEmail, SMTPSettings } from './types';

export const INITIAL_JOBS: Job[] = [];
export const INITIAL_QUICK_LINKS: QuickLink[] = [];
export const INITIAL_POSTS: ContentPost[] = [];
export const INITIAL_SUBSCRIBERS: Subscriber[] = [];
export const INITIAL_CONTACTS: ContactSubmission[] = [];
export const INITIAL_BREAKING_NEWS: BreakingNews[] = [];
export const INITIAL_EMAIL_NOTIFICATIONS: EmailNotification[] = [];
export const INITIAL_CUSTOM_EMAILS: CustomEmail[] = [];

export const initialAdSettings: AdSettings = {
  adFrequency: 'medium',
  adStartTime: '00:00',
  adEndTime: '23:59',
  bannerAds: true,
  squareAds: true,
  skyscraperAds: false,
  popupAds: false,
  headerAdEnabled: false,
  headerAdCode: '<!-- Header Ad Code -->',
  sidebarAdEnabled: false,
  sidebarAdCode: '<!-- Sidebar Ad Code -->',
  footerAdEnabled: false,
  footerAdCode: '<!-- Footer Ad Code -->',
  customAds: {
    enabled: false,
    rotation: false,
    codes: [],
  },
  abTests: [
    { id: '1', placement: 'Header', enabled: false, codeA: '', codeB: '', stats: { impressionsA: 10520, clicksA: 150, impressionsB: 10480, clicksB: 180 } },
    { id: '2', placement: 'Sidebar', enabled: false, codeA: '', codeB: '', stats: { impressionsA: 25100, clicksA: 300, impressionsB: 25230, clicksB: 280 } },
  ],
  deviceTargeting: {
    enabled: false,
    desktopCode: '',
    mobileCode: '',
  },
  geoTargeting: {
    enabled: false,
    rules: [],
  },
};

export const initialSeoSettings: SEOSettings = {
  global: {
    siteTitle: 'Jobtica - Your Government Job Portal',
    metaDescription: 'Find the latest government job openings, exam notifications, and results. Your one-stop destination for a successful career in the public sector.',
    metaKeywords: 'government jobs, sarkari naukri, exam results, admit card, job notifications',
  },
  social: {
    ogTitle: 'Jobtica - Government Job Notifications',
    ogDescription: 'Your one-stop destination for a successful career in the public sector.',
    ogImageUrl: '',
  },
  structuredData: {
    jobPostingSchemaEnabled: true,
  },
};

export const initialGeneralSettings: GeneralSettings = {
  siteTitle: 'Jobtica',
  siteIconUrl: '/logo.png',
  maintenanceMode: false,
  maintenanceMessage: 'Our website is currently undergoing scheduled maintenance. We should be back shortly. Thank you for your patience.',
  emailNotificationsEnabled: true,
};

export const initialSocialMediaSettings: SocialMediaSettings = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  telegram: 'https://telegram.org',
  telegramGroup: '',
  telegramGroupIcon: 'users',
  whatsapp: 'https://whatsapp.com',
};

export const initialSmtpSettings: SMTPSettings = {
  host: '',
  port: 587,
  user: '',
  pass: '',
  fromEmail: '',
  fromName: '',
  secure: false,
  configured: false,
};
