// Fix: The error "Module '@prisma/client' has no exported member 'PrismaClient'" can occur due to ES Module/CommonJS interoperability issues. Using `createRequire` to import `PrismaClient` is a robust workaround.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');
// Fix: Explicitly import process to ensure correct type definitions are used.
import process from 'process';

const prisma = new PrismaClient();

const INITIAL_JOBS = [
  { id: '1', title: 'Railway Recruitment Board - Assistant Loco Pilot', department: 'Indian Railways', category: 'Railways', description: '...', qualification: '10th + ITI', vacancies: '27795', postedDate: '2025-10-01', lastDate: '2025-11-15', applyLink: '#', status: 'active' },
  { id: '2', title: 'SSC Combined Graduate Level (CGL) Exam', department: 'Staff Selection Commission', category: 'SSC', description: '...', qualification: 'Graduate', vacancies: '8000', postedDate: '2025-10-05', lastDate: '2025-11-25', applyLink: '#', status: 'active' },
  { id: '3', title: 'IBPS PO/MT Recruitment', department: 'Institute of Banking Personnel Selection', category: 'Banking', description: '...', qualification: 'Graduate', vacancies: '4135', postedDate: '2025-09-20', lastDate: '2025-10-20', applyLink: '#', status: 'active' },
  { id: '4', title: 'UPSC Civil Services Exam (IAS/IPS)', department: 'Union Public Service Commission', category: 'UPSC', description: '...', qualification: 'Graduate', vacancies: '1011', postedDate: '2025-09-15', lastDate: '2025-10-10', applyLink: '#', status: 'active' },
  { id: '5', title: 'State Bank of India - Clerk (Junior Associate)', department: 'State Bank of India', category: 'Banking', description: '...', qualification: 'Graduate', vacancies: '5486', postedDate: '2025-10-12', lastDate: '2025-11-30', applyLink: '#', status: 'active' },
  { id: '6', title: 'LIC Assistant Administrative Officer (AAO)', department: 'Life Insurance Corporation', category: 'Insurance', description: '...', qualification: 'Graduate', vacancies: '300', postedDate: '2025-10-18', lastDate: '2025-12-05', applyLink: '#', status: 'active' },
  { id: '7', title: 'DRDO Scientist \'B\' Recruitment', department: 'Defence Research & Development Organisation', category: 'Defence', description: '...', qualification: 'B.E./B.Tech', vacancies: '579', postedDate: '2025-09-28', lastDate: '2025-10-28', applyLink: '#', status: 'active' },
  { id: '8', title: 'ISRO Scientist/Engineer \'SC\'', department: 'Indian Space Research Organisation', category: 'Research', description: '...', qualification: 'B.E./B.Tech/M.Sc', vacancies: '68', postedDate: '2025-10-20', lastDate: '2025-11-19', applyLink: '#', status: 'active' },
  { id: '9', title: 'RBI Grade B Officer', department: 'Reserve Bank of India', category: 'Banking', description: '...', qualification: 'Graduate', vacancies: '291', postedDate: '2025-10-22', lastDate: '2025-12-10', applyLink: '#', status: 'active' },
  { id: '10', title: 'Indian Army Technical Graduate Course (TGC)', department: 'Indian Army', category: 'Defence', description: '...', qualification: 'B.E./B.Tech', vacancies: '40', postedDate: '2025-11-01', lastDate: '2025-12-15', applyLink: '#', status: 'active' },
  { id: '11', title: 'Delhi Police Head Constable', department: 'Delhi Police', category: 'Police', description: '...', qualification: '12th Pass', vacancies: '835', postedDate: '2025-11-05', lastDate: '2025-12-20', applyLink: '#', status: 'active' },
  { id: '12', title: 'UPPSC Combined State Services Exam', department: 'Uttar Pradesh Public Service Commission', category: 'State Government', description: '...', qualification: 'Graduate', vacancies: '400', postedDate: '2025-11-10', lastDate: '2025-12-25', applyLink: '#', status: 'active' },
  { id: '13', title: 'NTA UGC NET for JRF & Assistant Professor', department: 'National Testing Agency', category: 'Teaching', description: '...', qualification: 'Post Graduate', vacancies: 'N/A', postedDate: '2025-10-30', lastDate: '2025-11-28', applyLink: '#', status: 'active' },
  { id: '14', title: 'BSF Constable (Tradesman)', department: 'Border Security Force', category: 'Defence', description: '...', qualification: '10th + ITI', vacancies: '2788', postedDate: '2025-11-12', lastDate: '2025-12-30', applyLink: '#', status: 'active' },
  { id: '15', title: 'Indian Navy Agniveer (SSR/MR)', department: 'Indian Navy', category: 'Defence', description: '...', qualification: '10+2 / 10th Pass', vacancies: '2800', postedDate: '2025-11-15', lastDate: '2026-01-05', applyLink: '#', status: 'active' },
  { id: '16', title: 'FCI Category III Recruitment', department: 'Food Corporation of India', category: 'Central Government', description: '...', qualification: 'Graduate', vacancies: '5043', postedDate: '2025-11-20', lastDate: '2026-01-10', applyLink: '#', status: 'active' },
  { id: '17', title: 'CISF Head Constable (Ministerial)', department: 'Central Industrial Security Force', category: 'Defence', description: '...', qualification: '12th Pass', vacancies: '540', postedDate: '2025-11-25', lastDate: '2026-01-15', applyLink: '#', status: 'active' },
  { id: '18', title: 'Indian Coast Guard Navik (GD & DB)', department: 'Indian Coast Guard', category: 'Defence', description: '...', qualification: '10+2 / 10th Pass', vacancies: '322', postedDate: '2025-11-28', lastDate: '2026-01-20', applyLink: '#', status: 'active' },
  { id: '19', title: 'ESIC UDC, MTS & Steno Recruitment', department: 'Employees State Insurance Corporation', category: 'Central Government', description: '...', qualification: 'Graduate/12th/10th', vacancies: '3847', postedDate: '2025-12-01', lastDate: '2026-01-25', applyLink: '#', status: 'active' },
  { id: '20', title: 'BARC Scientific Officer', department: 'Bhabha Atomic Research Centre', category: 'Research', description: '...', qualification: 'B.E./B.Tech/M.Sc', vacancies: '225', postedDate: '2025-12-05', lastDate: '2026-01-30', applyLink: '#', status: 'active' },
];

const INITIAL_QUICK_LINKS = [
    { id: '1', title: 'UPSC Official Website', category: 'UPSC', url: 'https://upsc.gov.in', description: '', status: 'active' },
    { id: '2', title: 'SSC Official Website', category: 'SSC', url: 'https://ssc.nic.in', description: '', status: 'active' },
    { id: '3', title: 'IBPS Official Website', category: 'Banking', url: 'https://www.ibps.in', description: '', status: 'active' },
    { id: '4', title: 'Indian Railways Portal', category: 'Railways', url: 'http://www.indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&id=0,1,304,366,537', description: '', status: 'active' },
];

const INITIAL_POSTS = [
    { id: '1', type: 'exam-notices', title: 'SSC CGL 2025 Tier I Exam Date Announced', category: 'SSC', content: '...', status: 'published', publishedDate: '2025-10-15', examDate: '2025-12-10', detailsUrl: '#' },
    { id: '2', type: 'exam-notices', title: 'IBPS PO 2025 Admit Card Released', category: 'Banking', content: '...', status: 'published', publishedDate: '2025-10-12', detailsUrl: '#' },
    { id: '3', type: 'results', title: 'UPSC Civil Services 2024 Final Result Declared', category: 'UPSC', content: '...', status: 'published', publishedDate: '2025-10-10', detailsUrl: '#' },
    { id: '4', type: 'results', title: 'Railway Group D PET/PST Result', category: 'Railways', content: '...', status: 'published', publishedDate: '2025-10-08', detailsUrl: '#' },
    { id: '5', type: 'posts', title: 'How to Prepare for Government Exams: A Comprehensive Guide', category: 'Guidance', content: 'Preparing for government exams requires a structured approach and dedication. This guide will walk you through the essential steps to create a successful study plan...', status: 'published', publishedDate: '2025-09-01', imageUrl: 'https://images.unsplash.com/photo-1517842645767-c6f90415ad90?q=80&w=2070&auto=format&fit=crop' },
];

const INITIAL_SUBSCRIBERS = [
    { id: '1', email: 'test.user1@example.com', subscriptionDate: '2025-10-01', status: 'active' },
    { id: '2', email: 'another.subscriber@example.com', subscriptionDate: '2025-10-03', status: 'active' },
];

const INITIAL_BREAKING_NEWS = [
    { id: '1', text: 'SSC CGL 2025 notification is expected to be released by the end of this month.', link: '#', status: 'active' },
    { id: '2', text: 'IBPS Clerk Mains exam date has been revised. Check the official notice for details.', link: '#', status: 'active' },
];

const INITIAL_SPONSORED_ADS = [
    { id: '1', imageUrl: 'https://via.placeholder.com/300x250.png/9333ea/ffffff?text=Sponsored+Ad', destinationUrl: '#', placement: 'sidebar-top', status: 'active', clicks: 125 },
];

const INITIAL_PREPARATION_COURSES = [
    { id: 'pc1', platform: 'Testbook', title: 'SSC CGL SuperCoaching', url: '#' },
    { id: 'pc2', platform: 'Adda247', title: 'SSC CGL Mahapack', url: '#' },
    { id: 'pc3', platform: 'Unacademy', title: 'Bank Exams Subscription', url: '#' },
];

const INITIAL_PREPARATION_BOOKS = [
    { id: 'pb1', title: 'Quantitative Aptitude for Competitive Examinations', author: 'R.S. Aggarwal', url: '#', imageUrl: 'https://m.media-amazon.com/images/I/81+373i2z-L._AC_UY327_FMwebp_QL65_.jpg' },
    { id: 'pb2', title: 'A New Approach to Reasoning', author: 'B.S. Sijwali & Indu Sijwali', url: '#', imageUrl: 'https://m.media-amazon.com/images/I/81MW4K52pDL._AC_UY327_FMwebp_QL65_.jpg' },
    { id: 'pb3', title: 'Comprehensive Guide to IBPS PO/MT', author: 'Disha Experts', url: '#', imageUrl: 'https://m.media-amazon.com/images/I/81w4fTj2-JL._AC_UY327_FMwebp_QL65_.jpg' },
];

const INITIAL_UPCOMING_EXAMS = [
    { id: 'ue1', name: 'SSC CGL 2025 Tier I Application', deadline: '2025-11-25', notificationLink: '#' },
    { id: 'ue2', name: 'IBPS PO 2025 Registration', deadline: '2025-10-20', notificationLink: '#' },
    { id: 'ue3', name: 'UPSC Civil Services 2025 Prelims Application', deadline: '2025-10-10', notificationLink: '#' },
];

const INITIAL_EMAIL_TEMPLATES = [
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

const settings = {
    adSettings: {
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
        bannerAds: true, squareAds: true, skyscraperAds: false, popupAds: false,
        customAds: { enabled: false, rotation: false, codes: [] },
        abTests: [{ id: '1', placement: 'Sidebar', enabled: false, codeA: '<!-- Ad Variation A -->', codeB: '<!-- Ad Variation B -->', stats: { impressionsA: 10520, clicksA: 315, impressionsB: 10480, clicksB: 350 } }],
        deviceTargeting: { enabled: false, desktopCode: '<!-- Desktop Ad -->', mobileCode: '<!-- Mobile Ad -->' },
        geoTargeting: { enabled: false, rules: [{ id: '1', country: 'IN', code: '<!-- Ad for India -->'}] },
        adNetworks: {
            googleAdSense: { code: '<!-- Google AdSense Placeholder -->', notes: 'Main 728x90 Banner' },
            adsterra: { code: '<!-- Adsterra Placeholder -->', notes: '' },
            mediaNet: { code: '<!-- Media.net Placeholder -->', notes: 'Sidebar 300x250' },
            ezoic: { code: '<!-- Ezoic Placeholder -->', notes: '' },
            propellerAds: { code: '<!-- PropellerAds Placeholder -->', notes: '' },
        },
        activeTests: [],
    },
    seoSettings: {
        global: { siteTitle: 'Jobtica - Your Gateway to Government Jobs', metaDescription: 'Find the latest government job notifications, exam results, and admit cards. Your one-stop destination for all sarkari naukri updates.', metaKeywords: 'sarkari naukri, government jobs, jobs, recruitment, exam result, admit card, jobtica' },
        social: { ogTitle: 'Jobtica - Government Job Portal', ogDescription: 'Your one-stop destination for all sarkari naukri updates.', ogImageUrl: 'https://jobtica.vercel.app/og-image.jpg' },
        structuredData: { jobPostingSchemaEnabled: true },
    },
    generalSettings: {
        siteTitle: 'Jobtica',
        siteIconUrl: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3crect width='100' height='100' rx='20' fill='%234f46e5'/%3e%3ctext x='50' y='50' font-size='60' fill='white' text-anchor='middle' dy='.3em' font-family='sans-serif' font-weight='bold'%3eJ%3c/text%3e%3c/svg%3e",
        maintenanceMode: false,
        maintenanceMessage: 'Our website is currently undergoing scheduled maintenance. We should be back shortly. Thank you for your patience.',
        emailNotificationsEnabled: true,
    },
    socialMediaSettings: { facebook: 'https://facebook.com', instagram: 'https://instagram.com', telegram: 'https://t.me', telegramGroup: 'https://t.me', telegramGroupIcon: 'users', whatsapp: 'https://wa.me' },
    smtpSettings: { configured: false, host: '', port: 587, secure: true, user: '', pass: '', fromEmail: '', fromName: '' },
    rssSettings: { feedUrl: '' },
    alertSettings: { whatsApp: { enabled: false, apiKey: '', senderNumber: '' }, sms: { enabled: false, twilioSid: '', twilioToken: '', twilioNumber: '' } },
    popupAdSettings: { enabled: false, imageUrl: 'https://via.placeholder.com/600x400.png/9333ea/ffffff?text=Popup+Ad', destinationUrl: '#', size: 'medium', openDelaySeconds: 3, closeAfterSeconds: 0, showOncePerSession: true },
    themeSettings: { primaryColor: '#4f46e5', accentColor: '#9333ea' },
    securitySettings: { enableCSP: true, autoLogoutMinutes: 30, enable2FASimulation: false, warnOnExternalLink: true, preventContentCopy: false, demoModeEnabled: true, demoSessionTimeoutMinutes: 10 },
    demoUserSettings: { canManageJobs: true, canManageContent: true, canManageLinks: true, canManageAudience: false, canSendEmails: false, canManageAds: false, canChangeTheme: true },
    googleSearchConsoleSettings: { verificationTag: '' },
};

async function main() {
    console.log('Start seeding...');

    await prisma.job.createMany({
        data: INITIAL_JOBS.map(({ id, postedDate, lastDate, ...job }) => ({ ...job, postedDate: new Date(postedDate), lastDate: new Date(lastDate) })),
        skipDuplicates: true,
    });
    
    await prisma.quickLink.createMany({
        data: INITIAL_QUICK_LINKS.map(({id, ...link}) => link),
        skipDuplicates: true,
    });
    
    await prisma.contentPost.createMany({
        data: INITIAL_POSTS.map(({ id, publishedDate, examDate, ...post }) => ({ ...post, publishedDate: new Date(publishedDate), examDate: examDate ? new Date(examDate) : null })),
        skipDuplicates: true,
    });
    
    await prisma.subscriber.createMany({
        data: INITIAL_SUBSCRIBERS.map(({ id, subscriptionDate, ...sub }) => ({ ...sub, subscriptionDate: new Date(subscriptionDate) })),
        skipDuplicates: true,
    });
    
    await prisma.breakingNews.createMany({
        data: INITIAL_BREAKING_NEWS.map(({id, ...news}) => news),
        skipDuplicates: true,
    });

    await prisma.sponsoredAd.createMany({
        data: INITIAL_SPONSORED_ADS.map(({id, ...ad}) => ad),
        skipDuplicates: true,
    });

    await prisma.preparationCourse.createMany({
        data: INITIAL_PREPARATION_COURSES.map(({id, ...course}) => course),
        skipDuplicates: true,
    });
    
    await prisma.preparationBook.createMany({
        data: INITIAL_PREPARATION_BOOKS.map(({id, ...book}) => book),
        skipDuplicates: true,
    });
    
    await prisma.upcomingExam.createMany({
        data: INITIAL_UPCOMING_EXAMS.map(({ id, deadline, ...exam }) => ({ ...exam, deadline: new Date(deadline) })),
        skipDuplicates: true,
    });
    
    await prisma.emailTemplate.createMany({
        data: INITIAL_EMAIL_TEMPLATES.map(({id, ...template}) => template),
        skipDuplicates: true,
    });

    for (const [key, value] of Object.entries(settings)) {
        await prisma.keyValueStore.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }

    // Connect special jobs to their prep materials
    const sscJob = await prisma.job.findFirst({ where: { title: { contains: 'SSC Combined Graduate Level' } } });
    const ibpsJob = await prisma.job.findFirst({ where: { title: { contains: 'IBPS PO/MT' } } });
    
    const sscCourse1 = await prisma.preparationCourse.findFirst({ where: { title: 'SSC CGL SuperCoaching' } });
    const sscCourse2 = await prisma.preparationCourse.findFirst({ where: { title: 'SSC CGL Mahapack' } });
    const ibpsCourse = await prisma.preparationCourse.findFirst({ where: { title: 'Bank Exams Subscription' } });
    
    const quantBook = await prisma.preparationBook.findFirst({ where: { title: { contains: 'Quantitative Aptitude' } } });
    const reasoningBook = await prisma.preparationBook.findFirst({ where: { title: { contains: 'New Approach to Reasoning' } } });
    const ibpsBook = await prisma.preparationBook.findFirst({ where: { title: { contains: 'Comprehensive Guide to IBPS' } } });

    if (sscJob && sscCourse1 && sscCourse2 && quantBook && reasoningBook) {
        await prisma.job.update({
            where: { id: sscJob.id },
            data: {
                affiliateCourses: { connect: [{ id: sscCourse1.id }, { id: sscCourse2.id }] },
                affiliateBooks: { connect: [{ id: quantBook.id }, { id: reasoningBook.id }] },
            }
        });
    }
    
    if (ibpsJob && ibpsCourse && ibpsBook) {
        await prisma.job.update({
            where: { id: ibpsJob.id },
            data: {
                affiliateCourses: { connect: { id: ibpsCourse.id } },
                affiliateBooks: { connect: { id: ibpsBook.id } },
            }
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });