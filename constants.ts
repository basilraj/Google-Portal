import { Job, QuickLink, ContentPost, Subscriber, ContactSubmission, BreakingNews, AdSettings, SEOSettings, GeneralSettings, SocialMediaSettings, EmailNotification, CustomEmail } from './types';

export const INITIAL_JOBS: Job[] = [
    {
        id: '1',
        title: 'Railway Recruitment Board - Assistant Loco Pilot',
        department: 'Railways',
        description: 'Assistant Loco Pilot position in Indian Railways. Great opportunity for ITI and 10+2 passed candidates.',
        qualification: '12th Pass',
        vacancies: '5,696',
        postedDate: '2025-10-10',
        lastDate: '2025-11-15',
        applyLink: '#',
        status: 'active',
        createdAt: '2025-10-10T10:00:00Z',
    },
    {
        id: '2',
        title: 'SSC CHSL - Combined Higher Secondary Level',
        department: 'SSC',
        description: 'Combined Higher Secondary Level Examination for various government posts.',
        qualification: '12th Pass',
        vacancies: '3,712',
        postedDate: '2025-10-08',
        lastDate: '2025-11-20',
        applyLink: '#',
        status: 'active',
        createdAt: '2025-10-08T11:00:00Z',
    },
    {
        id: '3',
        title: 'UPSC Civil Services Examination 2026',
        department: 'UPSC',
        description: 'Prestigious Civil Services Examination for IAS, IPS, IFS and other central services.',
        qualification: 'Graduate',
        vacancies: '1,056',
        postedDate: '2025-09-25',
        lastDate: '2025-10-18',
        applyLink: '#',
        status: 'closing-soon',
        createdAt: '2025-09-25T09:00:00Z',
    },
     {
        id: '4',
        title: 'Banking Personnel Selection - Probationary Officer',
        department: 'Banking',
        description: 'IBPS PO recruitment for various public sector banks.',
        qualification: 'Graduate',
        vacancies: '4,500',
        postedDate: '2025-10-05',
        lastDate: '2025-11-10',
        applyLink: '#',
        status: 'active',
        createdAt: '2025-10-05T12:00:00Z',
    }
];

export const INITIAL_QUICK_LINKS: QuickLink[] = [
    { id: '1', title: 'Banking Jobs', category: 'Category', url: '#', description: '', status: 'active' },
    { id: '2', title: 'Railway Jobs', category: 'Category', url: '#', description: '', status: 'active' },
    { id: '3', title: 'SSC Jobs', category: 'Category', url: '#', description: '', status: 'active' },
    { id: '4', title: 'Defence Jobs', category: 'Category', url: '#', description: '', status: 'active' },
];

export const INITIAL_POSTS: ContentPost[] = [
    { id: '1', title: 'How to Prepare for SSC CGL 2025', category: 'Preparation Tips', content: "The SSC Combined Graduate Level (CGL) Exam is one of India's most sought-after government exams, opening doors to prestigious careers. Cracking it requires a strategic approach, dedication, and a clear understanding of the syllabus and exam pattern. This guide provides a comprehensive roadmap to help you prepare effectively for the SSC CGL 2025 and secure your dream job in a government department. We will cover section-wise strategies, recommended books, time management tips, and the importance of mock tests.", status: 'published', type: 'posts', publishedDate: '2025-10-12', createdAt: '2025-10-12T14:00:00Z' },
    { id: '2', title: 'Top 10 Government Jobs for Graduates', category: 'Career Guidance', content: "After graduation, a secure and prestigious government job is a dream for many. The Indian government offers a wide range of opportunities for graduates across various sectors. This article lists the top 10 most sought-after government jobs for graduates, including positions in Civil Services (IAS, IPS), Banking (PO, Clerk), Staff Selection Commission (CGL, CHSL), Railways (NTPC), and Defence. We'll explore the roles, eligibility criteria, and career growth prospects for each.", status: 'published', type: 'posts', publishedDate: '2025-10-10', createdAt: '2025-10-10T15:00:00Z' },
    { id: '3', title: 'Banking Exams Pattern Changes 2025', category: 'Exam Updates', content: "The Institute of Banking Personnel Selection (IBPS) and other banking recruitment bodies frequently update their exam patterns to select the best candidates. For the 2025-26 season, several key changes have been introduced in the prelims and mains exams for PO and Clerk positions. This post will detail the updated syllabus, new question types, changes in sectional timings, and how you should adapt your preparation strategy to stay ahead of the curve.", status: 'draft', type: 'posts', publishedDate: '2025-10-08' },
    { id: '4', title: 'SSC CGL Tier-II Admit Card Released', category: 'Admit Card', content: "The Staff Selection Commission (SSC) has released the admit cards for the Combined Graduate Level (CGL) Tier-II Examination 2025. Candidates who have qualified the Tier-I exam can now download their hall tickets from the official regional SSC websites. The exam is scheduled to be conducted from 2025-10-25. Candidates are advised to download their admit card well in advance to avoid any last-minute rush. Please carry a valid photo ID along with your admit card to the examination center.", status: 'published', type: 'exam-notices', publishedDate: '2025-10-12', examDate: '2025-10-25' },
    { id: '5', title: 'IBPS PO Prelims 2025 Admit Card Out', category: 'Admit Card', content: "The admit cards for the IBPS Probationary Officer (PO) Preliminary Examination 2025 are now available for download. The exam will be held on various dates starting from November 5, 2025. All registered candidates can download their call letters from the official IBPS website. Remember to check the reporting time and exam center details carefully.", status: 'published', type: 'exam-notices', publishedDate: '2025-10-10', examDate: '2025-11-05' },
    { id: '6', title: 'SSC MTS Final Result 2025 Declared', category: 'Results', content: "The Staff Selection Commission has declared the final result for the Multi-Tasking (Non-Technical) Staff Examination 2025. The result, along with the final cut-off marks, is available on the official SSC website. Candidates can check their results using their roll number. Congratulations to all the successful candidates!", status: 'published', type: 'results', publishedDate: '2025-10-13', examDate: '2025-08-15' },
    { id: '7', title: 'Railway Group D CBT Result 2025 Announced', category: 'Results', content: "The Railway Recruitment Board (RRB) has announced the results for the Group D CBT (Computer Based Test) conducted in September 2025. The list of shortlisted candidates for the Physical Efficiency Test (PET) has been published on the official websites of the respective RRBs. Candidates can view their scores and check their eligibility for the next stage.", status: 'published', type: 'results', publishedDate: '2025-10-11', examDate: '2025-09-20' },
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
    { id: '1', email: 'subscriber1@example.com', subscriptionDate: '2025-10-01', status: 'active' },
    { id: '2', email: 'subscriber2@example.com', subscriptionDate: '2025-10-02', status: 'active' },
];

export const INITIAL_CONTACTS: ContactSubmission[] = [];

export const INITIAL_EMAIL_NOTIFICATIONS: EmailNotification[] = [];

export const INITIAL_CUSTOM_EMAILS: CustomEmail[] = [];

export const INITIAL_BREAKING_NEWS: BreakingNews[] = [
    { id: '1', text: 'SSC CGL 2025 Notification Released. Last date to apply is Nov 20, 2025.', link: '#', status: 'active' },
    { id: '2', text: 'Railway NTPC Final Result has been declared. Check your result now.', link: '#', status: 'active' },
    { id: '3', text: 'UPSC Civil Services 2026 Prelims Exam Date Announced.', link: '#', status: 'active' },
];

export const initialAdSettings: AdSettings = {
  headerAdEnabled: true,
  headerAdCode: '<!-- Header Ad Code Here -->',
  sidebarAdEnabled: true,
  sidebarAdCode: '<!-- Sidebar Ad Code Here -->',
  footerAdEnabled: false,
  footerAdCode: '<!-- Footer Ad Code Here -->',
  adFrequency: 'medium',
  adStartTime: '00:00',
  adEndTime: '23:59',
  bannerAds: true,
  squareAds: true,
  skyscraperAds: false,
  popupAds: false,
  adsense: {
    enabled: false,
    publisherId: '',
  },
  customAds: {
    enabled: false,
    rotation: false,
    codes: [''],
  },
  abTests: [
    {
      id: '1',
      placement: 'Header',
      enabled: false,
      codeA: '<!-- Header Variation A -->',
      codeB: '<!-- Header Variation B -->',
      stats: { impressionsA: 10520, clicksA: 150, impressionsB: 10480, clicksB: 180 },
    },
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
        siteTitle: 'Divine Computer Jobs',
        metaDescription: 'Find the latest government job notifications, exam results, and admit cards. Your one-stop destination for all government job updates in India.',
        metaKeywords: 'divine computer jobs, government jobs, sarkari naukri, job portal, railway jobs, ssc, upsc, banking jobs',
    },
    social: {
        ogTitle: 'Divine Computer Jobs - Latest Government Jobs',
        ogDescription: 'Your gateway to a successful career in the public sector. Get daily updates on all government job vacancies.',
        ogImageUrl: '',
    },
    structuredData: {
        jobPostingSchemaEnabled: true,
    },
};

export const initialGeneralSettings: GeneralSettings = {
    maintenanceMode: false,
    maintenanceMessage: 'Our website is currently undergoing scheduled maintenance. We should be back shortly. Thank you for your patience.',
    emailNotificationsEnabled: true,
};

export const initialSocialMediaSettings: SocialMediaSettings = {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    telegram: 'https://telegram.org',
    whatsapp: 'https://whatsapp.com',
    telegramGroup: 'https://t.me/joinchat/yourgroup',
    telegramGroupIcon: 'cog',
};