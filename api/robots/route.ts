import type { VercelRequest, VercelResponse } from '@vercel/node';
import { basePath } from '../../App.tsx';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const sitemapUrl = `https://${req.headers.host || ''}${basePath}/sitemap.xml`.replace(/([^:]\/)\/+/g, "$1");
    const content = `User-agent: *
Allow: /
Sitemap: ${sitemapUrl}

# Disallow admin and API paths
Disallow: /admin
Disallow: /api/
`;

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(content);
}