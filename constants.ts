// Fix: Import all types from the dedicated types.ts file to resolve circular dependencies.
import { Job, QuickLink, ContentPost, Subscriber, BreakingNews, AdSettings, SEOSettings, GeneralSettings, SocialMediaSettings, SMTPSettings, ActivityLog, RSSSettings, AlertSettings, SponsoredAd, PopupAdSettings, ThemeSettings, SecuritySettings, DemoUserSettings, EmailTemplate, GoogleSearchConsoleSettings, PreparationCourse, PreparationBook, UpcomingExam } from './types.ts';

export const INITIAL_JOBS: Job[] = [
  // 20 sample jobs for pagination and variety
  { id: '1', title: 'Railway Recruitment Board - Assistant Loco Pilot', department: 'Indian Railways', category: 'Railways', description: '...', qualification: '10th + ITI', vacancies: '27795', postedDate: '2025-10-01', lastDate: '2025-11-15', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '2', title: 'SSC Combined Graduate Level (CGL) Exam', department: 'Staff Selection Commission', category: 'SSC', description: '...', qualification: 'Graduate', vacancies: '8000', postedDate: '2025-10-05', lastDate: '2025-11-25', applyLink: '#', status: 'active', createdAt: new Date().toISOString(),
    affiliateCourses: [
        { id: 'c1', platform: 'Testbook', title: 'SSC CGL SuperCoaching', url: '#' },
        { id: 'c2', platform: 'Adda247', title: 'SSC CGL Mahapack', url: '#' }
    ],
    affiliateBooks: [
        { id: 'b1', title: 'Quantitative Aptitude for Competitive Examinations', author: 'R.S. Aggarwal', url: '#', imageUrl: 'https://m.media-amazon.com/images/I/81+373i2z-L._AC_UY327_FMwebp_QL65_.jpg' },
        { id: 'b2', title: 'A New Approach to Reasoning', author: 'B.S. Sijwali & Indu Sijwali', url: '#', imageUrl: 'https://m.media-amazon.com/images/I/81MW4K52pDL._AC_UY327_FMwebp_QL65_.jpg' }
    ]
  },
  { id: '3', title: 'IBPS PO/MT Recruitment', department: 'Institute of Banking Personnel Selection', category: 'Banking', description: '...', qualification: 'Graduate', vacancies: '4135', postedDate: '2025-09-20', lastDate: '2025-10-20', applyLink: '#', status: 'active', createdAt: new Date().toISOString(),
    affiliateCourses: [
        { id: 'c3', platform: 'Unacademy', title: 'Bank Exams Subscription', url: '#' }
    ],
    affiliateBooks: [
         { id: 'b3', title: 'Comprehensive Guide to IBPS PO/MT', author: 'Disha Experts', url: '#', imageUrl: 'https://m.media-amazon.com/images/I/81w4fTj2-JL._AC_UY327_FMwebp_QL65_.jpg' }
    ]
  },
  { id: '4', title: 'UPSC Civil Services Exam (IAS/IPS)', department: 'Union Public Service Commission', category: 'UPSC', description: '...', qualification: 'Graduate', vacancies: '1011', postedDate: '2025-09-15', lastDate: '2025-10-10', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '5', title: 'State Bank of India - Clerk (Junior Associate)', department: 'State Bank of India', category: 'Banking', description: '...', qualification: 'Graduate', vacancies: '5486', postedDate: '2025-10-12', lastDate: '2025-11-30', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '6', title: 'LIC Assistant Administrative Officer (AAO)', department: 'Life Insurance Corporation', category: 'Insurance', description: '...', qualification: 'Graduate', vacancies: '300', postedDate: '2025-10-18', lastDate: '2025-12-05', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '7', title: 'DRDO Scientist \'B\' Recruitment', department: 'Defence Research & Development Organisation', category: 'Defence', description: '...', qualification: 'B.E./B.Tech', vacancies: '579', postedDate: '2025-09-28', lastDate: '2025-10-28', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '8', title: 'ISRO Scientist/Engineer \'SC\'', department: 'Indian Space Research Organisation', category: 'Research', description: '...', qualification: 'B.E./B.Tech/M.Sc', vacancies: '68', postedDate: '2025-10-20', lastDate: '2025-11-19', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '9', title: 'RBI Grade B Officer', department: 'Reserve Bank of India', category: 'Banking', description: '...', qualification: 'Graduate', vacancies: '291', postedDate: '2025-10-22', lastDate: '2025-12-10', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '10', title: 'Indian Army Technical Graduate Course (TGC)', department: 'Indian Army', category: 'Defence', description: '...', qualification: 'B.E./B.Tech', vacancies: '40', postedDate: '2025-11-01', lastDate: '2025-12-15', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '11', title: 'Delhi Police Head Constable', department: 'Delhi Police', category: 'Police', description: '...', qualification: '12th Pass', vacancies: '835', postedDate: '2025-11-05', lastDate: '2025-12-20', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '12', title: 'UPPSC Combined State Services Exam', department: 'Uttar Pradesh Public Service Commission', category: 'State Government', description: '...', qualification: 'Graduate', vacancies: '400', postedDate: '2025-11-10', lastDate: '2025-12-25', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '13', title: 'NTA UGC NET for JRF & Assistant Professor', department: 'National Testing Agency', category: 'Teaching', description: '...', qualification: 'Post Graduate', vacancies: 'N/A', postedDate: '2025-10-30', lastDate: '2025-11-28', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '14', title: 'BSF Constable (Tradesman)', department: 'Border Security Force', category: 'Defence', description: '...', qualification: '10th + ITI', vacancies: '2788', postedDate: '2025-11-12', lastDate: '2025-12-30', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '15', title: 'Indian Navy Agniveer (SSR/MR)', department: 'Indian Navy', category: 'Defence', description: '...', qualification: '10+2 / 10th Pass', vacancies: '2800', postedDate: '2025-11-15', lastDate: '2026-01-05', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '16', title: 'FCI Category III Recruitment', department: 'Food Corporation of India', category: 'Central Government', description: '...', qualification: 'Graduate', vacancies: '5043', postedDate: '2025-11-20', lastDate: '2026-01-10', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '17', title: 'CISF Head Constable (Ministerial)', department: 'Central Industrial Security Force', category: 'Defence', description: '...', qualification: '12th Pass', vacancies: '540', postedDate: '2025-11-25', lastDate: '2026-01-15', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '18', title: 'Indian Coast Guard Navik (GD & DB)', department: 'Indian Coast Guard', category: 'Defence', description: '...', qualification: '10+2 / 10th Pass', vacancies: '322', postedDate: '2025-11-28', lastDate: '2026-01-20', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '19', title: 'ESIC UDC, MTS & Steno Recruitment', department: 'Employees State Insurance Corporation', category: 'Central Government', description: '...', qualification: 'Graduate/12th/10th', vacancies: '3847', postedDate: '2025-12-01', lastDate: '2026-01-25', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
  { id: '20', title: 'BARC Scientific Officer', department: 'Bhabha Atomic Research Centre', category: 'Research', description: '...', qualification: 'B.E./B.Tech/M.Sc', vacancies: '225', postedDate: '2025-12-05', lastDate: '2026-01-30', applyLink: '#', status: 'active', createdAt: new Date().toISOString() },
];

export const INITIAL_QUICK_LINKS: QuickLink[] = [
    { id: '1', title: 'UPSC Official Website', category: 'UPSC', url: 'https://upsc.gov.in', description: '', status: 'active' },
    { id: '2', title: 'SSC Official Website', category: 'SSC', url: 'https://ssc.nic.in', description: '', status: 'active' },
    { id: '3', title: 'IBPS Official Website', category: 'Banking', url: 'https://www.ibps.in', description: '', status: 'active' },
    { id: '4', title: 'Indian Railways Portal', category: 'Railways', url: 'http://www.indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&id=0,1,304,366,537', description: '', status: 'active' },
];

export const INITIAL_POSTS: ContentPost[] = [
    { id: '1', type: 'exam-notices', title: 'SSC CGL 2025 Tier I Exam Date Announced', category: 'SSC', content: '...', status: 'published', publishedDate: '2025-10-15', examDate: '2025-12-10', detailsUrl: '#', createdAt: new Date().toISOString() },
    { id: '2', type: 'exam-notices', title: 'IBPS PO 2025 Admit Card Released', category: 'Banking', content: '...', status: 'published', publishedDate: '2025-10-12', detailsUrl: '#', createdAt: new Date().toISOString() },
    { id: '3', type: 'results', title: 'UPSC Civil Services 2024 Final Result Declared', category: 'UPSC', content: '...', status: 'published', publishedDate: '2025-10-10', detailsUrl: '#', createdAt: new Date().toISOString() },
    { id: '4', type: 'results', title: 'Railway Group D PET/PST Result', category: 'Railways', content: '...', status: 'published', publishedDate: '2025-10-08', detailsUrl: '#', createdAt: new Date().toISOString() },
    { id: '5', type: 'posts', title: 'How to Prepare for Government Exams: A Comprehensive Guide', category: 'Guidance', content: 'Preparing for government exams requires a structured approach and dedication. This guide will walk you through the essential steps to create a successful study plan...', status: 'published', publishedDate: '2025-09-01', createdAt: new Date().toISOString(), imageUrl: 'https://images.unsplash.com/photo-1517842645767-c6f90415ad90?q=80&w=2070&auto=format&fit=crop' },
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
    { id: '1', email: 'test.user1@example.com', subscriptionDate: '2025-10-01', status: 'active' },
    { id: '2', email: 'another.subscriber@example.com', subscriptionDate: '2025-10-03', status: 'active' },
];

export const INITIAL_BREAKING_NEWS: BreakingNews[] = [
    { id: '1', text: 'SSC CGL 2025 notification is expected to be released by the end of this month.', link: '#', status: 'active' },
    { id: '2', text: 'IBPS Clerk Mains exam date has been revised. Check the official notice for details.', link: '#', status: 'active' },
];

export const INITIAL_SPONSORED_ADS: SponsoredAd[] = [
    { id: '1', imageUrl: 'https://via.placeholder.com/300x250.png/9333ea/ffffff?text=Sponsored+Ad', destinationUrl: '#', placement: 'sidebar-top', status: 'active', clicks: 125 },
];

export const INITIAL_PREPARATION_COURSES: PreparationCourse[] = [
    { id: 'pc1', platform: 'Testbook', title: 'SSC CGL SuperCoaching', url: '#' },
    { id: 'pc2', platform: 'Adda247', title: 'SSC CGL Mahapack', url: '#' },
    { id: 'pc3', platform: 'Unacademy', title: 'Bank Exams Subscription', url: '#' },
];

export const INITIAL_PREPARATION_BOOKS: PreparationBook[] = [
    { id: 'pb1', title: 'Quantitative Aptitude for Competitive Examinations', author: 'R.S. Aggarwal', url: '#', imageUrl: 'https://m.media-amazon.com/images/I/81+373i2z-L._AC_UY327_FMwebp_QL65_.jpg' },
    { id: 'pb2', title: 'A New Approach to Reasoning', author: 'B.S. Sijwali & Indu Sijwali', url: '#', imageUrl: 'https://m.media-amazon.com/images/I/81MW4K52pDL._AC_UY327_FMwebp_QL65_.jpg' },
    { id: 'pb3', title: 'Comprehensive Guide to IBPS PO/MT', author: 'Disha Experts', url: '#', imageUrl: 'https://m.media-amazon.com/images/I/81w4fTj2-JL._AC_UY327_FMwebp_QL65_.jpg' },
];

export const INITIAL_UPCOMING_EXAMS: UpcomingExam[] = [
    { id: 'ue1', name: 'SSC CGL 2025 Tier I Application', deadline: '2025-11-25', notificationLink: '#' },
    { id: 'ue2', name: 'IBPS PO 2025 Registration', deadline: '2025-10-20', notificationLink: '#' },
    { id: 'ue3', name: 'UPSC Civil Services 2025 Prelims Application', deadline: '2025-10-10', notificationLink: '#' },
];

export const initialAdSettings: AdSettings = {
    headerAd: { enabled: true, type: 'network', networkKey: 'googleAdSense', customCode: '' },
    sidebarAd: { enabled: true, type: 'network', networkKey: 'mediaNet', customCode: '' },
    footerAd: { enabled: false, type: 'network', networkKey: '', customCode: '' },
    inFeedJobsAd: { enabled: true, type: 'network', networkKey: 'googleAdSense', customCode: '' },
    inFeedBlogAd: { enabled: false, type: 'network', networkKey: '', customCode: '' },
    jobDetailTopAd: { enabled: false, type: 'network', networkKey: '', customCode: '' },
    blogDetailTopAd: { enabled: false, type: 'network', networkKey: '', customCode: '' },
    
    adFrequency: 'medium',
    adStartTime: '00:00',
    adEndTime: '23:59',
    bannerAds: true,
    squareAds: true,
    skyscraperAds: false,
    popupAds: false,
    customAds: {
        enabled: false,
        rotation: false,
        codes: [],
    },
    abTests: [
        { id: '1', placement: 'Sidebar', enabled: false, codeA: '<!-- Ad Variation A -->', codeB: '<!-- Ad Variation B -->', stats: { impressionsA: 10520, clicksA: 315, impressionsB: 10480, clicksB: 350 } },
    ],
    deviceTargeting: {
        enabled: false,
        desktopCode: '<!-- Desktop Ad -->',
        mobileCode: '<!-- Mobile Ad -->',
    },
    geoTargeting: {
        enabled: false,
        rules: [
            { id: '1', country: 'IN', code: '<!-- Ad for India -->'},
        ],
    },
    adNetworks: {
        googleAdSense: { code: '<!-- Google AdSense Placeholder -->', notes: 'Main 728x90 Banner' },
        adsterra: { code: '<!-- Adsterra Placeholder -->', notes: '' },
        mediaNet: { code: '<!-- Media.net Placeholder -->', notes: 'Sidebar 300x250' },
        ezoic: { code: '<!-- Ezoic Placeholder -->', notes: '' },
        propellerAds: { code: '<!-- PropellerAds Placeholder -->', notes: '' },
    },
    activeTests: [],
};

export const initialSeoSettings: SEOSettings = {
    global: {
        siteTitle: 'Jobtica - Your Gateway to Government Jobs',
        metaDescription: 'Find the latest government job notifications, exam results, and admit cards. Your one-stop destination for all sarkari naukri updates.',
        metaKeywords: 'sarkari naukri, government jobs, jobs, recruitment, exam result, admit card, jobtica',
    },
    social: {
        ogTitle: 'Jobtica - Government Job Portal',
        ogDescription: 'Your one-stop destination for all sarkari naukri updates.',
        ogImageUrl: 'https://jobtica.vercel.app/og-image.jpg', // Placeholder
    },
    structuredData: {
        jobPostingSchemaEnabled: true,
    },
};

export const initialGeneralSettings: GeneralSettings = {
    siteTitle: 'Jobtica',
    siteIconUrl: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3crect width='100' height='100' rx='20' fill='%234f46e5'/%3e%3ctext x='50' y='50' font-size='60' fill='white' text-anchor='middle' dy='.3em' font-family='sans-serif' font-weight='bold'%3eJ%3c/text%3e%3c/svg%3e",
    maintenanceMode: false,
    maintenanceMessage: 'Our website is currently undergoing scheduled maintenance. We should be back shortly. Thank you for your patience.',
    emailNotificationsEnabled: true,
};

export const initialSocialMediaSettings: SocialMediaSettings = {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    telegram: 'https://t.me',
    telegramGroup: 'https://t.me',
    telegramGroupIcon: 'users',
    whatsapp: 'https://wa.me',
};

export const initialSmtpSettings: SMTPSettings = {
    configured: false,
    host: '',
    port: 587,
    secure: true,
    user: '',
    pass: '',
    fromEmail: '',
    fromName: '',
};

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
    { id: '1', timestamp: new Date().toISOString(), action: 'System Initialized', details: 'The application was loaded for the first time.'},
];

export const initialRssSettings: RSSSettings = {
    feedUrl: '',
};

export const initialAlertSettings: AlertSettings = {
    whatsApp: { enabled: false, apiKey: '', senderNumber: '' },
    sms: { enabled: false, twilioSid: '', twilioToken: '', twilioNumber: '' },
};

export const initialPopupAdSettings: PopupAdSettings = {
    enabled: false,
    imageUrl: 'https://via.placeholder.com/600x400.png/9333ea/ffffff?text=Popup+Ad',
    destinationUrl: '#',
    size: 'medium',
    openDelaySeconds: 3,
    closeAfterSeconds: 0,
    showOncePerSession: true,
};

export const initialThemeSettings: ThemeSettings = {
    primaryColor: '#4f46e5',
    accentColor: '#9333ea',
};

export const initialSecuritySettings: SecuritySettings = {
    enableCSP: true,
    autoLogoutMinutes: 30,
    enable2FASimulation: false,
    warnOnExternalLink: true,
    preventContentCopy: false,
    demoModeEnabled: true,
    demoSessionTimeoutMinutes: 10,
};

export const initialDemoUserSettings: DemoUserSettings = {
    canManageJobs: true,
    canManageContent: true,
    canManageLinks: true,
    canManageAudience: false,
    canSendEmails: false,
    canManageAds: false,
    canChangeTheme: true,
};

export const INITIAL_EMAIL_TEMPLATES: EmailTemplate[] = [
    {
        id: 'template-welcome',
        name: 'Welcome Email',
        subject: 'Welcome to {{siteName}}!',
        body: 'Thank you for subscribing to {{siteName}}.\n\nYou will now receive the latest government job alerts directly in your inbox.\n\nBest regards,\nThe {{siteName}} Team'
    },
    {
        id: 'template-new-job',
        name: 'New Job Alert',
        subject: 'New Job Alert: {{jobTitle}} at {{jobDepartment}}',
        body: 'Hello,\n\nA new job has been posted that might interest you:\n\nJob Title: {{jobTitle}}\nDepartment: {{jobDepartment}}\nLast Date to Apply: {{jobLastDate}}\n\nApply now: {{jobLink}}\n\nBest regards,\nThe {{siteName}} Team'
    }
];

export const initialGoogleSearchConsoleSettings: GoogleSearchConsoleSettings = {
    verificationTag: '',
};