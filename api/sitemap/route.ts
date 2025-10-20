// Fix: Implemented the full sitemap generation logic which was previously a placeholder.
import { db } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { slugify } from '../../utils/slugify.ts';
import { basePath } from '../../App.tsx';

const createUrlEntry = (url: string, lastmod?: string) => `
  <url>
    <loc>${url}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
  </url>
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    let client;
    try {
        client = await db.connect();
        const baseUrl = `https://${req.headers.host}${basePath}`.replace(/\/$/, '');

        // Static Pages
        const staticPages = ['/', '/blog', '/privacy', '/about', '/disclaimer', '/terms'];
        let sitemap = staticPages.map(page => createUrlEntry(`${baseUrl}${page}`)).join('');

        // Dynamic Job Pages
        const jobsResult = await client.sql`SELECT title, created_at FROM jobs WHERE status = 'active' OR status = 'closing-soon' ORDER BY created_at DESC;`;
        const jobs = jobsResult.rows;
        sitemap += jobs.map(job => {
            const url = `${baseUrl}/job/${slugify(job.title)}`;
            const lastmod = new Date(job.created_at).toISOString();
            return createUrlEntry(url, lastmod);
        }).join('');

        // Dynamic Blog Post Pages
        const postsResult = await client.sql`SELECT id, created_at FROM posts WHERE status = 'published' AND type = 'posts' ORDER BY created_at DESC;`;
        const posts = postsResult.rows;
        sitemap += posts.map(post => {
            const url = `${baseUrl}/blog/${post.id}`;
            const lastmod = new Date(post.created_at).toISOString();
            return createUrlEntry(url, lastmod);
        }).join('');
        
        const fullSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemap}
</urlset>`;

        res.setHeader('Content-Type', 'application/xml');
        return res.status(200).send(fullSitemap);

    } catch (error) {
        console.error('Error generating sitemap:', error);
        return res.status(500).json({ message: 'Failed to generate sitemap' });
    } finally {
        if (client) {
            client.release();
        }
    }
}
