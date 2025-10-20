import type { VercelRequest, VercelResponse } from '@vercel/node';
import { slugify } from '../../utils/slugify.ts';
import { INITIAL_JOBS, INITIAL_POSTS } from '../../constants.ts';

// This function cannot import from frontend components like App.tsx.
// The basePath is defined here as it is in the App component.
const basePath = '';

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

    try {
        const baseUrl = `https://${req.headers.host}${basePath}`.replace(/\/$/, '');

        // Static Pages
        const staticPages = ['/', '/blog', '/privacy', '/about', '/disclaimer', '/terms'];
        let sitemap = staticPages.map(page => createUrlEntry(`${baseUrl}${page}`)).join('');

        // Dynamic Job Pages from constants
        sitemap += INITIAL_JOBS.map(job => {
            const url = `${baseUrl}/job/${slugify(job.title)}`;
            const lastmod = new Date(job.createdAt).toISOString();
            return createUrlEntry(url, lastmod);
        }).join('');

        // Dynamic Blog Post Pages from constants
        sitemap += INITIAL_POSTS.filter(p => p.type === 'posts').map(post => {
            const url = `${baseUrl}/blog/${post.id}`;
            const lastmod = new Date(post.createdAt).toISOString();
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
    }
}
