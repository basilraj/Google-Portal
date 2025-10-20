import { Job, QuickLink, ContentPost, Subscriber, BreakingNews, AdSettings, SEOSettings, GeneralSettings, SocialMediaSettings, ContactSubmission, EmailNotification, CustomEmail, SMTPSettings } from './types';

export const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'SSC CGL Recruitment 2025',
    department: 'Staff Selection Commission',
    description: 'Combined Graduate Level Examination for various Group B and C posts in different ministries and departments of the Government of India.',
    qualification: 'Graduate',
    vacancies: 'Approx. 8000',
    postedDate: '2025-06-11',
    lastDate: '2025-07-10',
    applyLink: 'https://ssc.nic.in',
    status: 'active',
    createdAt: '2025-06-11T10:00:00Z',
  },
  {
    id: '2',
    title: 'IBPS Clerk Recruitment 2025',
    department: 'Institute of Banking Personnel Selection',
    description: 'Recruitment of clerks in various public sector banks across India. The selection process includes a preliminary and a main exam.',
    qualification: 'Graduate',
    vacancies: 'Approx. 6000',
    postedDate: '2025-07-01',
    lastDate: '2025-07-21',
    applyLink: 'https://www.ibps.in',
    status: 'active',
    createdAt: '2025-07-01T11:00:00Z',
  },
  {
    id: '3',
    title: 'RRB NTPC 2025 Notification',
    department: 'Railway Recruitment Board',
    description: 'Non-Technical Popular Categories (NTPC) exam for posts like Junior Clerk cum Typist, Accounts Clerk cum Typist, Goods Guard, etc.',
    qualification: '12th Pass / Graduate',
    vacancies: 'Approx. 35000',
    postedDate: '2025-05-15',
    lastDate: '2025-06-30',
    applyLink: 'https://www.rrbcdg.gov.in',
    status: 'closing-soon',
    createdAt: '2025-05-15T09:00:00Z',
  },
    {
    id: '4',
    title: 'UPSC Civil Services Examination 2025',
    department: 'Union Public Service Commission',
    description: 'The Civil Services Examination (CSE) is a nationwide competitive examination in India conducted by the UPSC for recruitment to various Civil Services of the Government of India, including the Indian Administrative Service (IAS), Indian Foreign Service (IFS), and Indian Police Service (IPS).',
    qualification: 'Graduate',
    vacancies: 'Approx. 1000',
    postedDate: '2025-02-14',
    lastDate: '2025-03-05',
    applyLink: 'https://upsc.gov.in',
    status: 'expired',
    createdAt: '2025-02-14T08:00:00Z',
  },
];

export const INITIAL_QUICK_LINKS: QuickLink[] = [
  { id: '1', title: 'Admit Card', category: 'General', url: '#', description: '', status: 'active' },
  { id: '2', title: 'Answer Key', category: 'General', url: '#', description: '', status: 'active' },
  { id: '3', title: 'Results', category: 'General', url: '#', description: '', status: 'active' },
  { id: '4', title: 'Syllabus', category: 'General', url: '#', description: '', status: 'active' },
  { id: '5', title: 'Latest Jobs', category: 'General', url: '#', description: '', status: 'active' },
];

export const INITIAL_POSTS: ContentPost[] = [
  {
    id: '101',
    title: 'SSC CHSL 2025 Exam Date Announced',
    category: 'Exam Dates',
    content: 'The Staff Selection Commission has announced the exam dates for the Combined Higher Secondary Level (CHSL) 2025 examination. The Tier-I exam will be conducted from August 5th to August 20th, 2025.',
    status: 'published',
    type: 'exam-notices',
    publishedDate: '2025-06-10',
    createdAt: '2025-06-10T14:00:00Z',
    examDate: '2025-08-05',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '102',
    title: 'UPSC Civil Services 2024 Final Result Declared',
    category: 'Results',
    content: 'The Union Public Service Commission has declared the final results for the Civil Services Examination 2024. Candidates can check their results on the official UPSC website.',
    status: 'published',
    type: 'results',
    publishedDate: '2025-04-15',
    createdAt: '2025-04-15T12:00:00Z',
  },
  {
    id: '103',
    title: 'How to Prepare for Government Exams: A Comprehensive Guide',
    category: 'Tips & Tricks',
    content: 'Preparing for government exams requires a structured approach. This guide covers everything from understanding the syllabus to time management and revision strategies to help you succeed.',
    status: 'published',
    type: 'posts',
    publishedDate: '2025-05-20',
    createdAt: '2025-05-20T10:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c6f90405774b?q=80&w=2070&auto=format&fit=crop',
  },
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { id: '1', email: 'testuser1@example.com', subscriptionDate: '2025-01-15', status: 'active' },
  { id: '2', email: 'testuser2@example.com', subscriptionDate: '2025-02-20', status: 'active' },
];

export const INITIAL_BREAKING_NEWS: BreakingNews[] = [
  { id: '1', text: 'SSC CGL 2025 Notification Released! Apply now.', link: '#', status: 'active' },
  { id: '2', text: 'IBPS Clerk 2025 Application Starts from July 1st.', link: '#', status: 'active' },
];

export const initialAdSettings: AdSettings = {
    adFrequency: 'medium',
    adStartTime: '00:00',
    adEndTime: '23:59',
    bannerAds: true,
    squareAds: true,
    skyscraperAds: false,
    popupAds: false,
    headerAdEnabled: true,
    headerAdCode: '<div class="w-full h-24 bg-gray-200 flex items-center justify-center text-gray-500 rounded-md">Header Ad (728x90)</div>',
    sidebarAdEnabled: true,
    sidebarAdCode: '<div class="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded-md">Sidebar Ad (300x250)</div>',
    footerAdEnabled: true,
    footerAdCode: '<div class="w-full h-24 bg-gray-200 flex items-center justify-center text-gray-500 rounded-md">Footer Ad (728x90)</div>',
    customAds: {
      enabled: false,
      rotation: false,
      codes: [],
    },
    abTests: [
        {
            id: '1',
            placement: 'Header',
            enabled: false,
            codeA: '<div class="w-full h-24 bg-blue-100 flex items-center justify-center text-blue-500 rounded-md">Header Ad - Variation A</div>',
            codeB: '<div class="w-full h-24 bg-green-100 flex items-center justify-center text-green-500 rounded-md">Header Ad - Variation B</div>',
            stats: { impressionsA: 10520, clicksA: 350, impressionsB: 10480, clicksB: 410 },
        }
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
      siteTitle: 'Jobtica - Your Gateway to Government Jobs',
      metaDescription: 'Find the latest government job notifications, exam results, and admit cards. Your one-stop destination for all sarkari naukri updates.',
      metaKeywords: 'sarkari naukri, government jobs, jobs, recruitment, exam result, admit card',
    },
    social: {
      ogTitle: 'Jobtica - Latest Government Job Updates',
      ogDescription: 'Stay updated with the latest government job openings across India with Jobtica.',
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
    adminEmail: 'admin@example.com',
};

export const initialSocialMediaSettings: SocialMediaSettings = {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    telegram: 'https://telegram.org',
    telegramGroup: 'https://telegram.org',
    telegramGroupIcon: 'users',
    whatsapp: 'https://whatsapp.com',
};

export const INITIAL_CONTACTS: ContactSubmission[] = [];
export const INITIAL_EMAIL_NOTIFICATIONS: EmailNotification[] = [];
export const INITIAL_CUSTOM_EMAILS: CustomEmail[] = [];

export const initialSmtpSettings: SMTPSettings = {
    host: '',
    port: 587,
    user: '',
    pass: '',
    fromEmail: '',
    fromName: 'Jobtica',
    secure: false,
    configured: false,
};