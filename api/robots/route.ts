import type { VercelRequest, VercelResponse } from '@vercel/node';
import { basePath } from '../../App.tsx';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const content = `User-agent: *
Allow: /
Sitemap: ${new URL('/sitemap.xml', `https://${req.headers.host}`).href}

# Disallow admin and API paths
Disallow: /admin
Disallow: /api/
`;

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(content);
}