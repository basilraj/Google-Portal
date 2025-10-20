import { db } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Job, QuickLink, ContentPost, Subscriber, ContactSubmission, BreakingNews, EmailNotification, CustomEmail } from '../../types';
import { initialAdSettings, initialGeneralSettings, initialSeoSettings, initialSocialMediaSettings } from '../../constants';

type SettingKey = 'adSettings' | 'seoSettings' | 'generalSettings' | 'socialMediaSettings';

// DB to Frontend converters
const dbToJob = (dbJob: any): Job => ({ id: dbJob.id, title: dbJob.title, department: dbJob.department, description: dbJob.description, qualification: dbJob.qualification, vacancies: dbJob.vacancies, postedDate: new Date(dbJob.posted_date).toISOString().split('T')[0], lastDate: new Date(dbJob.last_date).toISOString().split('T')[0], applyLink: dbJob.apply_link, status: dbJob.status, createdAt: new Date(dbJob.created_at).toISOString() });
const dbToQuickLink = (dbLink: any): QuickLink => ({ id: dbLink.id, title: dbLink.title, category: dbLink.category, url: dbLink.url, description: dbLink.description, status: dbLink.status });
const dbToPost = (dbPost: any): ContentPost => ({ id: dbPost.id, title: dbPost.title, category: dbPost.category, content: dbPost.content, status: dbPost.status, type: dbPost.type, publishedDate: new Date(dbPost.published_date).toISOString().split('T')[0], createdAt: new Date(dbPost.created_at).toISOString(), examDate: dbPost.exam_date ? new Date(dbPost.exam_date).toISOString().split('T')[0] : undefined, imageUrl: dbPost.image_url || undefined });
const dbToSubscriber = (dbSub: any): Subscriber => ({ id: dbSub.id, email: dbSub.email, subscriptionDate: new Date(dbSub.subscription_date).toISOString().split('T')[0], status: dbSub.status });
const dbToContact = (dbContact: any): ContactSubmission => ({ id: dbContact.id, name: dbContact.name, email: dbContact.email, subject: dbContact.subject, message: dbContact.message, submittedAt: new Date(dbContact.submitted_at).toISOString() });
const dbToBreakingNews = (dbNews: any): BreakingNews => ({ id: dbNews.id, text: dbNews.text, link: dbNews.link, status: dbNews.status });

async function fetchTableData<T>(client: any, tableName: string, mapper: (row: any) => T, orderBy: string | null = 'created_at DESC'): Promise<T[]> {
    try {
        const query = `SELECT * FROM ${client.sql.unsafe(tableName)} ${orderBy ? `ORDER BY ${client.sql.unsafe(orderBy)}` : ''};`;
        const result = await client.sql.unsafe(query);
        return result.rows.map(mapper);
    } catch (error: any) {
        if (error.message.includes('does not exist')) {
            console.warn(`Table "${tableName}" not found, returning empty array.`);
            return [];
        }
        console.error(`Error fetching from table "${tableName}":`, error);
        return [];
    }
}

async function fetchSettings(client: any) {
    const settings: { [key: string]: any } = { adSettings: initialAdSettings, seoSettings: initialSeoSettings, generalSettings: initialGeneralSettings, socialMediaSettings: initialSocialMediaSettings };
    try {
        const result = await client.sql`SELECT * FROM settings;`;
        result.rows.forEach((row: { key: SettingKey, value: any }) => {
            if (settings[row.key]) {
                 settings[row.key] = { ...settings[row.key], ...row.value };
            }
        });
    } catch (error: any) {
         if (error.message.includes('does not exist')) console.warn(`Table "settings" not found, returning initial settings.`);
         else console.error('Error fetching settings:', error);
    }
    return settings;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    try {
        const client = await db.connect();
        const [jobs, quickLinks, posts, settingsData, subscribers, contacts, breakingNews ] = await Promise.all([
            fetchTableData(client, 'jobs', dbToJob),
            fetchTableData(client, 'quick_links', dbToQuickLink, null),
            fetchTableData(client, 'posts', dbToPost),
            fetchSettings(client),
            fetchTableData(client, 'subscribers', dbToSubscriber, 'subscription_date DESC'),
            fetchTableData(client, 'contacts', dbToContact, 'submitted_at DESC'),
            fetchTableData(client, 'breaking_news', dbToBreakingNews, null),
        ]);

        const responseData = { jobs, quickLinks, posts, ...settingsData, subscribers, contacts, breakingNews, emailNotifications: [], customEmails: [] };
        client.release();
        return res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching initial data:', error);
        return res.status(500).json({ message: 'Failed to fetch initial data' });
    }
}
