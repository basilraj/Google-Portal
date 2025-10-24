import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';
import { getSession } from '../../lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    const session = await getSession(req, res);

    try {
        const settings = await prisma.keyValueStore.findMany();
        const settingsObject = settings.reduce((acc, { key, value }) => {
            acc[key] = value;
            return acc;
        }, {} as { [key: string]: any });

        // If admin, return everything
        if (session.isAdmin) {
            const [
                jobs, quickLinks, posts, subscribers, breakingNews, sponsoredAds,
                activityLogs, contacts, emailNotifications, customEmails, emailTemplates,
                preparationCourses, preparationBooks, upcomingExams
            ] = await prisma.$transaction([
                prisma.job.findMany({ include: { affiliateCourses: true, affiliateBooks: true }, orderBy: { createdAt: 'desc' } }),
                prisma.quickLink.findMany({ orderBy: { title: 'asc' } }),
                prisma.contentPost.findMany({ orderBy: { createdAt: 'desc' } }),
                prisma.subscriber.findMany({ orderBy: { subscriptionDate: 'desc' } }),
                prisma.breakingNews.findMany(),
                prisma.sponsoredAd.findMany(),
                prisma.activityLog.findMany({ orderBy: { timestamp: 'desc' } }),
                prisma.contactSubmission.findMany({ orderBy: { submittedAt: 'desc' }}),
                prisma.emailNotification.findMany({ orderBy: { sentAt: 'desc' } }),
                prisma.customEmail.findMany({ orderBy: { sentAt: 'desc' } }),
                prisma.emailTemplate.findMany({ orderBy: { name: 'asc' } }),
                prisma.preparationCourse.findMany({ orderBy: { title: 'asc' } }),
                prisma.preparationBook.findMany({ orderBy: { title: 'asc' } }),
                prisma.upcomingExam.findMany({ orderBy: { deadline: 'asc' } }),
            ]);

             return res.status(200).json({
                jobs, quickLinks, posts, subscribers, breakingNews, sponsoredAds,
                activityLogs, contacts, emailNotifications, customEmails, emailTemplates,
                preparationCourses, preparationBooks, upcomingExams,
                ...settingsObject,
            });
        } else {
             // For public users, only return public data
            const [
                jobs, quickLinks, posts, breakingNews, sponsoredAds,
                preparationCourses, preparationBooks, upcomingExams
            ] = await prisma.$transaction([
                prisma.job.findMany({ include: { affiliateCourses: true, affiliateBooks: true }, orderBy: { createdAt: 'desc' } }),
                prisma.quickLink.findMany({ orderBy: { title: 'asc' } }),
                prisma.contentPost.findMany({ orderBy: { createdAt: 'desc' } }),
                prisma.breakingNews.findMany(),
                prisma.sponsoredAd.findMany(),
                prisma.preparationCourse.findMany({ orderBy: { title: 'asc' } }),
                prisma.preparationBook.findMany({ orderBy: { title: 'asc' } }),
                prisma.upcomingExam.findMany({ orderBy: { deadline: 'asc' } }),
            ]);
            
            // Return public data, with empty arrays for admin-only data
            return res.status(200).json({
                jobs, quickLinks, posts, breakingNews, sponsoredAds,
                preparationCourses, preparationBooks, upcomingExams,
                ...settingsObject,
                subscribers: [], activityLogs: [], contacts: [], 
                emailNotifications: [], customEmails: [], emailTemplates: [],
            });
        }

    } catch (error) {
        console.error('Failed to fetch all data:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}