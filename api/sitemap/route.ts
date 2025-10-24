import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';
import { slugify } from '../../utils/slugify';

const BASE_URL = 'https://jobtica.vercel.app'; // Replace with your actual domain

const generateSitemap = (pages: { url: string; lastModified?: string; }[]): string => {
    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${pages
       .map(({ url, lastModified }) => {
         return `
           <url>
               <loc>${url}</loc>
               ${lastModified ? `<lastmod>${lastModified}</lastmod>` : ''}
               <changefreq>daily</changefreq>
               <priority>0.8</priority>
           </url>
         `;
       })
       .join('')}
   </urlset>
 `;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const jobs = await prisma.job.findMany({
            where: { status: { not: 'expired' } },
            select: { title: true, createdAt: true },
        });
        const posts = await prisma.contentPost.findMany({
            where: { status: 'published', type: 'posts' },
            select: { id: true, createdAt: true },
        });

        const jobPages = jobs.map(job => ({
            url: `${BASE_URL}/job/${slugify(job.title)}`,
            lastModified: job.createdAt.toISOString(),
        }));
        
        const postPages = posts.map(post => ({
            url: `${BASE_URL}/blog/${post.id}`,
            lastModified: post.createdAt.toISOString(),
        }));
        
        const staticPages = [
            '/', '/blog', '/preparation', '/about', '/contact', 
            '/privacy', '/terms', '/disclaimer'
        ].map(path => ({ url: `${BASE_URL}${path}` }));
        
        const allPages = [...staticPages, ...jobPages, ...postPages];

        const sitemap = generateSitemap(allPages);

        res.setHeader('Content-Type', 'text/xml');
        res.status(200).send(sitemap);

    } catch (error) {
        console.error('Failed to generate sitemap:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
