

import { Router } from 'express';

const router = Router();

const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/-+$/, '');
};


// Helper to parse JSON from DB fields with error handling
const parseJsonField = (jsonString) => {
    if (!jsonString) return [];
    // PostgreSQL's `pg` driver often parses JSONB columns directly into JS objects.
    // So, we only parse if it's still a string, implying a TEXT column or driver setting.
    if (typeof jsonString === 'string') {
        try { return JSON.parse(jsonString); } catch (e) { return []; }
    }
    return jsonString; // Assume it's already an object if not a string
};

// GET /api/data - Fetch all site data
router.get('/data', async (req, res, next) => {
    try {
        const connection = req.db;
        const settingsResult = await connection.query('SELECT key_name, value FROM KeyValueStore');
        const settingsObject = settingsResult.rows.reduce((acc, row) => {
            acc[row.key_name] = parseJsonField(row.value);
            return acc;
        }, {});

        const jobsResult = await connection.query('SELECT * FROM Job ORDER BY "createdAt" DESC');
        const quickLinksResult = await connection.query('SELECT * FROM QuickLink ORDER BY title ASC');
        const postsResult = await connection.query('SELECT * FROM ContentPost ORDER BY "createdAt" DESC');
        const breakingNewsResult = await connection.query('SELECT * FROM BreakingNews');
        const sponsoredAdsResult = await connection.query('SELECT * FROM SponsoredAd');
        const preparationCoursesResult = await connection.query('SELECT * FROM PreparationCourse ORDER BY title ASC');
        const preparationBooksResult = await connection.query('SELECT * FROM PreparationBook ORDER BY title ASC');
        const upcomingExamsResult = await connection.query('SELECT * FROM UpcomingExam ORDER BY deadline ASC');
        
        const parsedJobs = jobsResult.rows.map(job => ({
            ...job,
            affiliateCourses: parseJsonField(job.affiliateCoursesJson),
            affiliateBooks: parseJsonField(job.affiliateBooksJson),
        }));
        
        const publicData = {
            jobs: parsedJobs, quickLinks: quickLinksResult.rows, posts: postsResult.rows, breakingNews: breakingNewsResult.rows, sponsoredAds: sponsoredAdsResult.rows,
            preparationCourses: preparationCoursesResult.rows, preparationBooks: preparationBooksResult.rows, upcomingExams: upcomingExamsResult.rows, ...settingsObject,
        };

        if (req.session.isAdmin) {
            const subscribersResult = await connection.query('SELECT * FROM Subscriber ORDER BY "subscriptionDate" DESC');
            const activityLogsResult = await connection.query('SELECT * FROM ActivityLog ORDER BY timestamp DESC');
            const contactsResult = await connection.query('SELECT * FROM ContactSubmission ORDER BY "submittedAt" DESC');
            const emailNotificationsResult = await connection.query('SELECT * FROM EmailNotification ORDER BY "sentAt" DESC');
            const customEmailsResult = await connection.query('SELECT * FROM CustomEmail ORDER BY "sentAt" DESC');
            const emailTemplatesResult = await connection.query('SELECT * FROM EmailTemplate ORDER BY name ASC');
            
            res.status(200).json({
                ...publicData,
                subscribers: subscribersResult.rows, activityLogs: activityLogsResult.rows, contacts: contactsResult.rows, emailNotifications: emailNotificationsResult.rows, customEmails: customEmailsResult.rows, emailTemplates: emailTemplatesResult.rows,
            });
        } else {
            res.status(200).json({
                ...publicData,
                subscribers: [], activityLogs: [], contacts: [],
                emailNotifications: [], customEmails: [], emailTemplates: [],
            });
        }
    } catch (error) {
        next(error);
    }
});

// GET /api/health - A simple health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// GET /api/robots - Serve the robots.txt content dynamically
router.get('/robots', (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    const baseURL = `${protocol}://${host}`;

    const robotsContent = `User-agent: *
Allow: /
Sitemap: ${baseURL}/sitemap.xml

Disallow: /admin
Disallow: /api`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(robotsContent);
});

// GET /api/sitemap - Dynamically generate the sitemap.xml
const generateSitemap = (pages) => {
    const urls = pages.map(({ url, lastModified }) => `
        <url>
            <loc>${url}</loc>
            ${lastModified ? `<lastmod>${lastModified}</lastmod>` : ''}
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
        </url>
    `).join('');
    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
};

router.get('/sitemap', async (req, res, next) => {
    try {
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');
        const baseURL = `${protocol}://${host}`;

        const jobsResult = await req.db.query(`SELECT title, "createdAt" FROM Job WHERE status != 'expired'`);
        const postsResult = await req.db.query(`SELECT id, "createdAt" FROM ContentPost WHERE status = 'published' AND type = 'posts'`);

        const jobPages = jobsResult.rows.map(job => ({
            url: `${baseURL}/job/${slugify(job.title)}`,
            lastModified: new Date(job.createdAt).toISOString(),
        }));
        
        const postPages = postsResult.rows.map(post => ({
            url: `${baseURL}/blog/${post.id}`,
            lastModified: new Date(post.createdAt).toISOString(),
        }));
        
        const staticPages = ['/', '/blog', '/preparation', '/about', '/contact', '/privacy', '/terms', '/disclaimer']
            .map(path => ({ url: `${baseURL}${path}` }));
        
        const allPages = [...staticPages, ...jobPages, ...postPages];
        const sitemap = generateSitemap(allPages);

        res.setHeader('Content-Type', 'text/xml');
        res.status(200).send(sitemap);
    } catch (error) {
        next(error);
    }
});

export default router;