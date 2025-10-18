import { Job, Subscriber, QuickLink, ContentPost, BreakingNews, AdSettings, GeneralSettings } from '../types';

export const initialJobs: Job[] = [
  {
    id: '1',
    title: 'SSC CGL 2025 Notification',
    department: 'Staff Selection Commission',
    postDate: '2025-10-25',
    lastDate: '2025-11-24',
    shortInfo: 'Recruitment for various Group B and Group C posts in different ministries/departments of the Government of India.',
    content: '<h2>SSC CGL 2025: Important Dates</h2><ul><li>Application Begin : 25/10/2025</li><li>Last Date for Apply Online : 24/11/2025</li><li>Pay Exam Fee Last Date : 25/11/2025</li></ul><h2>Application Fee</h2><ul><li>General / OBC : 100/-</li><li>SC / ST / PH : 0/-</li><li>All Category Female : 0/-</li></ul>',
    tags: ['SSC', 'Graduate', 'Government'],
    importantLinks: [{ label: 'Apply Online', url: '#' }, { label: 'Download Notification', url: '#' }],
    isFeatured: true,
  },
];

export const initialSubscribers: Subscriber[] = [
  { id: '1', email: 'test.user@example.com', subscriptionDate: '2025-10-20', status: 'active' },
];

export const initialQuickLinks: QuickLink[] = [
  { id: '1', title: 'UPSC Civil Services Result 2024', url: '#', category: 'Result' },
  { id: '2', title: 'RRB NTPC Admit Card', url: '#', category: 'Admit Card' },
];

export const initialContentPosts: ContentPost[] = [
  {
    id: '1',
    title: 'How to Prepare for Government Exams',
    content: '<p>Start by understanding the syllabus...</p>',
    author: 'Admin',
    publishDate: '2025-10-15',
    category: 'Blog',
    tags: ['Preparation', 'Tips'],
  },
];

export const initialBreakingNews: BreakingNews[] = [
  { id: '1', text: 'SSC CGL 2025 Notification Out! Last date to apply is 24/11/2025.', link: '#', isActive: true },
];

export const initialAdSettings: AdSettings = {
  adsense: { enabled: false, publisherId: '' },
  adsterra: { enabled: false, zoneId: '' },
  customAds: { enabled: true, code: '<div style="width:100%;height:90px;background:#f0f0f0;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;">Custom Ad Area</div>' },
  adFrequency: 'medium',
  adStartTime: '00:00',
  adEndTime: '23:59',
  bannerAds: true,
  squareAds: true,
  skyscraperAds: false,
  popupAds: false,
};

export const initialGeneralSettings: GeneralSettings = {
  siteTitle: 'Divine Computer Job Portal',
  siteDescription: 'Your Gateway to Government Jobs',
  logoUrl: '',
  faviconUrl: '',
  contactEmail: 'contact@example.com',
  footerText: '© 2025 Divine Computer Job Portal. All Rights Reserved.',
};
