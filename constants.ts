
import { Job, QuickLink, ContentPost, Subscriber, BreakingNews, AdSettings, SEOSettings, GeneralSettings, SocialMediaSettings, ContactSubmission, EmailNotification, CustomEmail, SMTPSettings } from './types';

export const INITIAL_JOBS: Job[] = [
  { id: '1', title: 'SSC CGL 2024 Notification', department: 'Staff Selection Commission', description: 'Staff Selection Commission has released the notification for Combined Graduate Level Examination 2024.', qualification: 'Graduate', vacancies: '7500', postedDate: '2024-06-24', lastDate: '2024-07-24', applyLink: 'https://ssc.nic.in', status: 'active', createdAt: new Date().toISOString() },
  { id: '2', title: 'IBPS Clerk Recruitment 2024', department: 'IBPS', description: 'Institute of Banking Personnel Selection invites applications for Clerk positions in various public sector banks.', qualification: 'Graduate', vacancies: '4000', postedDate: '2024-07-01', lastDate: '2024-07-21', applyLink: 'https://www.ibps.in', status: 'closing-soon', createdAt: new Date().toISOString() }
];
export const INITIAL_QUICK_LINKS: QuickLink[] = [
  { id: '1', title: 'UPSC Official Website', category: 'Official Sites', url: 'https://upsc.gov.in', description: '', status: 'active' },
  { id: '2', title: 'SSC Official Website', category: 'Official Sites', url: 'https://ssc.nic.in', description: '', status: 'active' }
];
export const INITIAL_POSTS: ContentPost[] = [
  { id: '1', title: 'How to Prepare for Government Exams', category: 'Guidance', content: 'A comprehensive guide on how to start your preparation for government jobs.', status: 'published', type: 'posts', publishedDate: '2024-01-15', createdAt: new Date().toISOString() },
  { id: '2', title: 'RRB NTPC CBT-2 Admit Card Released', category: 'Admit Cards', content: 'The admit card for RRB NTPC CBT-2 is now available for download.', status: 'published', type: 'exam-notices', publishedDate: '2024-07-10', createdAt: new Date().toISOString() },
  { id: '3', title: 'UPSSSC PET 2023 Result Declared', category: 'Results', content: 'The result for UPSSSC PET 2023 has been declared. Check your score now.', status: 'published', type: 'results', publishedDate: '2024-02-20', createdAt: new Date().toISOString() }
];
export const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { id: '1', email: 'test1@example.com', subscriptionDate: '2024-01-01', status: 'active' },
  { id: '2', email: 'test2@example.com', subscriptionDate: '2024-02-15', status: 'active' }
];
export const INITIAL_BREAKING_NEWS: BreakingNews[] = [
  { id: '1', text: 'SSC CGL 2024 Application has started. Last date: 24-07-2024.', link: '#', status: 'active' }
];
export const INITIAL_CONTACTS: ContactSubmission[] = [];
export const INITIAL_EMAIL_NOTIFICATIONS: EmailNotification[] = [];
export const INITIAL_CUSTOM_EMAILS: CustomEmail[] = [];

export const initialAdSettings: AdSettings = {
  adFrequency: 'medium', adStartTime: '00:00', adEndTime: '23:59', bannerAds: true, squareAds: true, skyscraperAds: false, popupAds: false,
  headerAdEnabled: true, headerAdCode: '<!-- Header Ad Code Here -->',
  sidebarAdEnabled: true, sidebarAdCode: '<!-- Sidebar Ad Code Here -->',
  footerAdEnabled: false, footerAdCode: '<!-- Footer Ad Code Here -->',
  customAds: { enabled: false, rotation: false, codes: [] },
  abTests: [{ id: '1', placement: 'header', enabled: false, codeA: '', codeB: '', stats: { impressionsA: 1000, clicksA: 50, impressionsB: 1020, clicksB: 65 } }],
  deviceTargeting: { enabled: false, desktopCode: '', mobileCode: '' },
  geoTargeting: { enabled: false, rules: [] }
};
export const initialSeoSettings: SEOSettings = {
  global: { siteTitle: 'Jobtica - Your Gateway to Government Jobs', metaDescription: 'Find the latest government job notifications, exam results, and admit cards.', metaKeywords: 'sarkari naukri, government jobs, sarkari result' },
  social: { ogTitle: 'Jobtica', ogDescription: 'Your Gateway to Government Jobs', ogImageUrl: '' },
  structuredData: { jobPostingSchemaEnabled: true }
};
export const initialGeneralSettings: GeneralSettings = {
  siteTitle: 'Jobtica', siteIconUrl: '', maintenanceMode: false, maintenanceMessage: 'Our website is currently undergoing scheduled maintenance. We should be back shortly. Thank you for your patience.', emailNotificationsEnabled: true
};
export const initialSocialMediaSettings: SocialMediaSettings = {
  facebook: 'https://facebook.com', instagram: '', telegram: 'https://t.me', telegramGroup: '', telegramGroupIcon: 'users', whatsapp: ''
};
export const initialSmtpSettings: SMTPSettings = {
  configured: false, host: '', port: 587, secure: false, user: '', pass: '', fromEmail: '', fromName: ''
};
