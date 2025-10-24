import { VercelRequest, VercelResponse } from '@vercel/node';

const robotsContent = `User-agent: *
Allow: /
Sitemap: /sitemap.xml

Disallow: /admin/
Disallow: /api/`;

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(robotsContent);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}