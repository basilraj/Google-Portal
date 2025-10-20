// Fix: Import the 'process' module to provide correct types for process.cwd()
// and resolve the TypeScript error.
import process from 'process';
import fs from 'fs';
import path from 'path';

// Since we can't use dynamic imports easily in this context, we will manually copy the data.
// In a real project, this would import from the source files.
const INITIAL_JOBS = [
  { id: '1', title: 'Railway Recruitment Board - Assistant Loco Pilot', createdAt: new Date().toISOString() },
  { id: '2', title: 'SSC Combined Graduate Level (CGL) Exam', createdAt: new Date().toISOString() },
  { id: '3', title: 'IBPS PO/MT Recruitment', createdAt: new Date().toISOString() },
  { id: '4', title: 'UPSC Civil Services Exam (IAS/IPS)', createdAt: new Date().toISOString() },
  { id: '5', title: 'State Bank of India - Clerk (Junior Associate)', createdAt: new Date().toISOString() },
  { id: '6', title: 'LIC Assistant Administrative Officer (AAO)', createdAt: new Date().toISOString() },
  { id: '7', title: 'DRDO Scientist \'B\' Recruitment', createdAt: new Date().toISOString() },
  { id: '8', title: 'ISRO Scientist/Engineer \'SC\'', createdAt: new Date().toISOString() },
  { id: '9', title: 'RBI Grade B Officer', createdAt: new Date().toISOString() },
  { id: '10', title: 'Indian Army Technical Graduate Course (TGC)', createdAt: new Date().toISOString() },
  { id: '11', title: 'Delhi Police Head Constable', createdAt: new Date().toISOString() },
  { id: '12', title: 'UPPSC Combined State Services Exam', createdAt: new Date().toISOString() },
  { id: '13', title: 'NTA UGC NET for JRF & Assistant Professor', createdAt: new Date().toISOString() },
  { id: '14', title: 'BSF Constable (Tradesman)', createdAt: new Date().toISOString() },
  { id: '15', title: 'Indian Navy Agniveer (SSR/MR)', createdAt: new Date().toISOString() },
  { id: '16', title: 'FCI Category III Recruitment', createdAt: new Date().toISOString() },
  { id: '17', title: 'CISF Head Constable (Ministerial)', createdAt: new Date().toISOString() },
  { id: '18', title: 'Indian Coast Guard Navik (GD & DB)', createdAt: new Date().toISOString() },
  { id: '19', title: 'ESIC UDC, MTS & Steno Recruitment', createdAt: new Date().toISOString() },
  { id: '20', title: 'BARC Scientific Officer', createdAt: new Date().toISOString() },
];

const INITIAL_POSTS = [
    { id: '1', type: 'exam-notices', createdAt: new Date().toISOString() },
    { id: '2', type: 'exam-notices', createdAt: new Date().toISOString() },
    { id: '3', type: 'results', createdAt: new Date().toISOString() },
    { id: '4', type: 'results', createdAt: new Date().toISOString() },
    { id: '5', type: 'posts', title: 'How to Prepare for Government Exams', createdAt: new Date().toISOString() },
];

const slugify = (text) => {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};


const baseUrl = 'https://jobtica.vercel.app'; // Replace with your actual domain

function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Static Pages
  const staticPages = ['/', '/blog', '/privacy', '/about', '/disclaimer', '/terms'];
  staticPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  });

  // Dynamic Job Pages
  INITIAL_JOBS.forEach(job => {
    sitemap += `
  <url>
    <loc>${baseUrl}/job/${slugify(job.title)}</loc>
    <lastmod>${new Date(job.createdAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  // Dynamic Blog Post Pages
  INITIAL_POSTS.filter(p => p.type === 'posts').forEach(post => {
    sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <lastmod>${new Date(post.createdAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;
  
  const publicPath = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath);
  }
  fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), sitemap);
  console.log('sitemap.xml generated successfully in public directory.');
}

generateSitemap();