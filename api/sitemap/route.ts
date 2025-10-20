import { db } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Job, ContentPost } from '../../types';
import { slugify } from '../../utils/slugify';
import { basePath } from '../../App';

const dbToJob = (dbJob: any): Job => ({ id: dbJob.id, title: dbJob.title, department: dbJob.department, description: dbJob.description, qualification: dbJob.qualification, vacancies: dbJob.vacancies, postedDate: new Date(dbJob.posted_date).toISOString().split('T')[0], lastDate: new Date(dbJob.last_date).toISOString().split('T')[0], applyLink: dbJob.apply_link, status: dbJob.status, createdAt: new Date(dbJob.created_at).toISOString() });
const dbToPost = (dbPost: any): ContentPost => ({ id: dbPost.id, title: dbPost.title, category: dbPost.category, content: dbPost.content, status: dbPost.status, type: dbPost.type, publishedDate: new Date(dbPost.published_date).toISOString().split('T')[0], createdAt: new Date(dbPost.created_at).toISOString(), examDate: dbPost.exam_date ? new Date(dbPost.exam_date).toISOString().split('T')[0] : undefined, imageUrl: dbPost.image_url || undefined });

const generateSitemap = (jobs: Job[], posts: ContentPost[], baseUrl: string): string => {
    const urls = [
        { loc: baseUrl, changefreq: 'daily', priority: '1.0' },
        { loc: `${baseUrl}/blog`, changefreq: 'weekly', priority: '0.8' },
    ];

    jobs.forEach(job => {
        urls.push({
            loc: `${baseUrl}/job/${slugify(job.title)}`,
            changefreq: 'weekly',
            priority: '0.9'
        });
    });

    posts.filter(p => p.type === 'posts').forEach(post => {
        urls.push({
            loc: `${baseUrl}/blog/${post.id}`,
            changefreq: 'monthly',
            priority: '0.7'
        });
    });

    const urlset = urls.map(url => `
    <url>
        <loc>${url.loc}</loc>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urlset}
</urlset>`;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const client = await db.connect();
    try {
        const jobsResult = await client.sql`SELECT title, created_at FROM jobs WHERE status != 'expired' ORDER BY created_at DESC;`;
        const postsResult = await client.sql`SELECT id, created_at FROM posts WHERE type = 'posts' AND status = 'published' ORDER BY created_at DESC;`;
        
        const jobs = jobsResult.rows.map(dbToJob);
        const posts = postsResult.rows.map(dbToPost);

        const baseUrl = `https://${req.headers.host}${basePath}`.replace(/\/$/, '');
        const sitemap = generateSitemap(jobs, posts, baseUrl);

        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(sitemap);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).send('Error generating sitemap');
    } finally {
        client.release();
    }
}
