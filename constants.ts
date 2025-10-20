// Fix: Import all types from the dedicated types.ts file to resolve circular dependencies.
import { Job, QuickLink, ContentPost, Subscriber, BreakingNews, AdSettings, SEOSettings, GeneralSettings, SocialMediaSettings, SMTPSettings, ActivityLog, RSSSettings } from './types.ts';

export const INITIAL_JOBS: Job[] = [
  // 20 sample jobs for pagination and variety
  { id: '1', title: 'Railway Recruitment Board - Assistant Loco Pilot', department: 'Indian Railways', description: '...', qualification: '10th + ITI', vacancies: '27795', postedDate: '2025-10-01', lastDate: '2025-11-15', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '2', title: 'SSC Combined Graduate Level (CGL) Exam', department: 'Staff Selection Commission', description: '...', qualification: 'Graduate', vacancies: '8000', postedDate: '2025-10-05', lastDate: '2025-11-25', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '3', title: 'IBPS PO/MT Recruitment', department: 'Institute of Banking Personnel Selection', description: '...', qualification: 'Graduate', vacancies: '4135', postedDate: '2025-09-20', lastDate: '2025-10-20', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '4', title: 'UPSC Civil Services Exam (IAS/IPS)', department: 'Union Public Service Commission', description: '...', qualification: 'Graduate', vacancies: '1011', postedDate: '2025-09-15', lastDate: '2025-10-10', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '5', title: 'State Bank of India - Clerk (Junior Associate)', department: 'State Bank of India', description: '...', qualification: 'Graduate', vacancies: '5486', postedDate: '2025-10-12', lastDate: '2025-11-30', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '6', title: 'LIC Assistant Administrative Officer (AAO)', department: 'Life Insurance Corporation', description: '...', qualification: 'Graduate', vacancies: '300', postedDate: '2025-10-18', lastDate: '2025-12-05', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '7', title: 'DRDO Scientist \'B\' Recruitment', department: 'Defence Research & Development Organisation', description: '...', qualification: 'B.E./B.Tech', vacancies: '579', postedDate: '2025-09-28', lastDate: '2025-10-28', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '8', title: 'ISRO Scientist/Engineer \'SC\'', department: 'Indian Space Research Organisation', description: '...', qualification: 'B.E./B.Tech/M.Sc', vacancies: '68', postedDate: '2025-10-20', lastDate: '2025-11-19', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '9', title: 'RBI Grade B Officer', department: 'Reserve Bank of India', description: '...', qualification: 'Graduate', vacancies: '291', postedDate: '2025-10-22', lastDate: '2025-12-10', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '10', title: 'Indian Army Technical Graduate Course (TGC)', department: 'Indian Army', description: '...', qualification: 'B.E./B.Tech', vacancies: '40', postedDate: '2025-11-01', lastDate: '2025-12-15', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '11', title: 'Delhi Police Head Constable', department: 'Delhi Police', description: '...', qualification: '12th Pass', vacancies: '835', postedDate: '2025-11-05', lastDate: '2025-12-20', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '12', title: 'UPPSC Combined State Services Exam', department: 'Uttar Pradesh Public Service Commission', description: '...', qualification: 'Graduate', vacancies: '400', postedDate: '2025-11-10', lastDate: '2025-12-25', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '13', title: 'NTA UGC NET for JRF & Assistant Professor', department: 'National Testing Agency', description: '...', qualification: 'Post Graduate', vacancies: 'N/A', postedDate: '2025-10-30', lastDate: '2025-11-28', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '14', title: 'BSF Constable (Tradesman)', department: 'Border Security Force', description: '...', qualification: '10th + ITI', vacancies: '2788', postedDate: '2025-11-12', lastDate: '2025-12-30', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '15', title: 'Indian Navy Agniveer (SSR/MR)', department: 'Indian Navy', description: '...', qualification: '10+2 / 10th Pass', vacancies: '2800', postedDate: '2025-11-15', lastDate: '2026-01-05', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '16', title: 'FCI Category III Recruitment', department: 'Food Corporation of India', description: '...', qualification: 'Graduate', vacancies: '5043', postedDate: '2025-11-20', lastDate: '2026-01-10', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '17', title: 'CISF Head Constable (Ministerial)', department: 'Central Industrial Security Force', description: '...', qualification: '12th Pass', vacancies: '540', postedDate: '2025-11-25', lastDate: '2026-01-15', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '18', title: 'Indian Coast Guard Navik (GD & DB)', department: 'Indian Coast Guard', description: '...', qualification: '10+2 / 10th Pass', vacancies: '322', postedDate: '2025-11-28', lastDate: '2026-01-20', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '19', title: 'ESIC UDC, MTS & Steno Recruitment', department: 'Employees State Insurance Corporation', description: '...', qualification: 'Graduate/12th/10th', vacancies: '3847', postedDate: '2025-12-01', lastDate: '2026-01-25', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '20', title: 'BARC Scientific Officer', department: 'Bhabha Atomic Research Centre', description: '...', qualification: 'B.E/B.Tech/M.Sc', vacancies: 'N/A', postedDate: '2025-12-05', lastDate: '2026-01-30', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
];

export const INITIAL_QUICK_LINKS: QuickLink[] = [
    { id: '1', title: 'UPSC Official Website', category: 'Official Sites', url: 'https://upsc.gov.in', description: '', status: 'active' },
    { id: '2', title: 'SSC Official Website', category: 'Official Sites', url: 'https://ssc.nic.in', description: '', status: 'active' },
];

export const INITIAL_POSTS: ContentPost[] = [
    { id: '1', title: 'SSC CGL Tier-II Admit Card Released', category: 'Admit Cards', content: '...', status: 'published', type: 'exam-notices', publishedDate: '2025-10-12', examDate: '2025-10-25', detailsUrl: '#', createdAt: new Date().toISOString() },
    { id: '2', title: 'Railway Group D PET Exam Notice', category: 'Exam Notices', content: '...', status: 'published', type: 'exam-notices', publishedDate: '2025-10-15', examDate: '2025-11-05', detailsUrl: '#', createdAt: new Date().toISOString() },
    { id: '3', title: 'IBPS Clerk Final Result Declared', category: 'Results', content: '...', status: 'published', type: 'results', publishedDate: '2025-10-20', detailsUrl: '#', createdAt: new Date().toISOString() },
    { id: '4', title: 'UP Police Constable Result Out', category: 'Results', content: '...', status: 'published', type: 'results', publishedDate: '2025-10-22', createdAt: new Date().toISOString() },
    { id: '5', title: 'How to Prepare for Government Exams', category: 'Guides', content: 'A comprehensive guide on cracking government job examinations.', status: 'published', type: 'posts', publishedDate: '2025-10-20', createdAt: new Date().toISOString() },
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
    { id: '1', email: 'test.subscriber@example.com', subscriptionDate: new Date().toISOString().split('T')[0], status: 'active' },
];

export const INITIAL_BREAKING_NEWS: BreakingNews[] = [
    { id: '1', text: 'New vacancy announced for IBPS PO. Last date to apply is tomorrow!', link: '#', status: 'active' },
];

export const initialAdSettings: AdSettings = {
  headerAdEnabled: true,
  headerAdCode: '<!-- Header Ad Code -->',
  sidebarAdEnabled: true,
  sidebarAdCode: '<!-- Sidebar Ad Code -->',
  footerAdEnabled: false,
  footerAdCode: '<!-- Footer Ad Code -->',
  adFrequency: 'medium',
  adStartTime: '00:00',
  adEndTime: '23:59',
  bannerAds: true,
  squareAds: true,
  skyscraperAds: false,
  popupAds: false,
  customAds: { enabled: false, rotation: false, codes: ['<!-- Custom Ad Code -->'] },
  abTests: [{
      id: '1', placement: 'Sidebar', enabled: true, codeA: '<!-- Ad A -->', codeB: '<!-- Ad B -->', 
      stats: { impressionsA: 1500, impressionsB: 1450, clicksA: 75, clicksB: 82 }
  }],
  deviceTargeting: { enabled: false, desktopCode: '', mobileCode: '' },
  geoTargeting: { enabled: false, rules: [] },
  sponsoredAds: [],
};

export const initialSeoSettings: SEOSettings = {
  global: {
    siteTitle: 'Jobtica - Your Government Job Portal',
    metaDescription: 'Find the latest government job openings, exam notifications, and results. Your one-stop destination for a career in the public sector.',
    metaKeywords: 'government jobs, sarkari naukri, exam results, job notifications',
  },
  social: {
    ogTitle: 'Jobtica - Government Job Portal',
    ogDescription: 'Latest updates on government jobs and exams.',
    ogImageUrl: 'https://example.com/og-image.png',
  },
  structuredData: {
    jobPostingSchemaEnabled: true,
  },
};

export const initialGeneralSettings: GeneralSettings = {
  siteTitle: 'Jobtica',
  siteIconUrl: 'data:image/png;base64,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',
  maintenanceMode: false,
  maintenanceMessage: 'Our website is currently undergoing scheduled maintenance. We should be back shortly. Thank you for your patience.',
  emailNotificationsEnabled: true,
};

export const initialSocialMediaSettings: SocialMediaSettings = {
  facebook: 'https://facebook.com/your-page',
  instagram: 'https://instagram.com/your-profile',
  telegram: 'https://t.me/your-channel',
  telegramGroup: 'https://t.me/joinchat/your-group',
  telegramGroupIcon: 'users',
  whatsapp: 'https://wa.me/910000000000',
};

export const initialSmtpSettings: SMTPSettings = {
  configured: false,
  host: '',
  port: 587,
  secure: false,
  user: '',
  pass: '',
  fromEmail: '',
  fromName: '',
};

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [];

export const initialRssSettings: RSSSettings = {
    feedUrl: '',
};
