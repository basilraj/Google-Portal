import { PrismaClient } from '@prisma/client';
import {
    INITIAL_JOBS,
    INITIAL_QUICK_LINKS,
    INITIAL_POSTS,
    INITIAL_SUBSCRIBERS,
    INITIAL_BREAKING_NEWS,
    INITIAL_SPONSORED_ADS,
    INITIAL_PREPARATION_COURSES,
    INITIAL_PREPARATION_BOOKS,
    INITIAL_UPCOMING_EXAMS,
    initialAdSettings,
    initialSeoSettings,
    initialGeneralSettings,
    initialSocialMediaSettings,
    initialSmtpSettings,
    INITIAL_ACTIVITY_LOGS,
    initialRssSettings,
    initialAlertSettings,
    initialPopupAdSettings,
    initialThemeSettings,
    initialSecuritySettings,
    initialDemoUserSettings,
    INITIAL_EMAIL_TEMPLATES,
    initialGoogleSearchConsoleSettings,
} from '../src/constants.ts';

const prisma = new PrismaClient();

// Helper to convert date strings to ISO strings for Prisma
const toISO = (dateStr) => new Date(dateStr).toISOString();

async function main() {
    console.log('Start seeding ...');

    // Seed Jobs
    for (const job of INITIAL_JOBS) {
        await prisma.job.upsert({
            where: { id: job.id },
            update: {},
            create: {
                ...job,
                postedDate: toISO(job.postedDate),
                lastDate: toISO(job.lastDate),
                createdAt: toISO(job.createdAt),
                affiliateCourses: job.affiliateCourses || [],
                affiliateBooks: job.affiliateBooks || [],
            },
        });
    }

    // Seed other models...
    for (const ql of INITIAL_QUICK_LINKS) await prisma.quickLink.upsert({ where: { id: ql.id }, update: {}, create: ql });
    for (const post of INITIAL_POSTS) {
        await prisma.contentPost.upsert({
            where: { id: post.id },
            update: {},
            create: {
                ...post,
                publishedDate: toISO(post.publishedDate),
                createdAt: toISO(post.createdAt),
                examDate: post.examDate ? toISO(post.examDate) : null,
            },
        });
    }
    for (const sub of INITIAL_SUBSCRIBERS) await prisma.subscriber.upsert({ where: { email: sub.email }, update: {}, create: { ...sub, subscriptionDate: toISO(sub.subscriptionDate) } });
    for (const bn of INITIAL_BREAKING_NEWS) await prisma.breakingNews.upsert({ where: { id: bn.id }, update: {}, create: bn });
    for (const ad of INITIAL_SPONSORED_ADS) await prisma.sponsoredAd.upsert({ where: { id: ad.id }, update: {}, create: ad });
    for (const course of INITIAL_PREPARATION_COURSES) await prisma.preparationCourse.upsert({ where: { id: course.id }, update: {}, create: course });
    for (const book of INITIAL_PREPARATION_BOOKS) await prisma.preparationBook.upsert({ where: { id: book.id }, update: {}, create: book });
    for (const exam of INITIAL_UPCOMING_EXAMS) await prisma.upcomingExam.upsert({ where: { id: exam.id }, update: {}, create: { ...exam, deadline: toISO(exam.deadline) } });
    for (const log of INITIAL_ACTIVITY_LOGS) await prisma.activityLog.upsert({ where: { id: log.id }, update: {}, create: log });
    for (const template of INITIAL_EMAIL_TEMPLATES) await prisma.emailTemplate.upsert({ where: { id: template.id }, update: {}, create: template });

    // Seed Settings (single row)
    const settingsCount = await prisma.settings.count();
    if (settingsCount === 0) {
        await prisma.settings.create({
            data: {
                id: 'global_settings',
                generalSettings: initialGeneralSettings,
                seoSettings: initialSeoSettings,
                socialMediaSettings: initialSocialMediaSettings,
                smtpSettings: initialSmtpSettings,
                adSettings: initialAdSettings,
                rssSettings: initialRssSettings,
                alertSettings: initialAlertSettings,
                popupAdSettings: initialPopupAdSettings,
                themeSettings: initialThemeSettings,
                securitySettings: initialSecuritySettings,
                demoUserSettings: initialDemoUserSettings,
                googleSearchConsoleSettings: initialGoogleSearchConsoleSettings,
            },
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        // FIX: Supress type error for process.exit, which is valid in this Node.js script context.
        // @ts-ignore
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });