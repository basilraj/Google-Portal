import { db } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto

function formatJob(job: any) {
  return {
    ...job,
    postedDate: new Date(job.posted_date).toISOString().split('T')[0],
    lastDate: new Date(job.last_date).toISOString().split('T')[0],
    createdAt: new Date(job.created_at).toISOString(),
  };
}
function formatPost(post: any) {
    return {
      ...post,
      publishedDate: new Date(post.published_date).toISOString().split('T')[0],
      createdAt: new Date(post.created_at).toISOString(),
      examDate: post.exam_date ? new Date(post.exam_date).toISOString().split('T')[0] : undefined,
      imageUrl: post.image_url,
    };
  }

export async function GET(request: NextRequest) {
  const client = await db.connect();
  try {
    const jobsResult = await client.sql`SELECT * FROM jobs ORDER BY created_at DESC;`;
    const quickLinksResult = await client.sql`SELECT * FROM quick_links;`;
    const postsResult = await client.sql`SELECT * FROM posts ORDER BY created_at DESC;`;
    // Add queries for other data types here

    return NextResponse.json({
      jobs: jobsResult.rows.map(formatJob),
      quickLinks: quickLinksResult.rows,
      posts: postsResult.rows.map(formatPost),
      subscribers: [], // Placeholder
      contacts: [], // Placeholder
      breakingNews: [], // Placeholder
      // You would fetch settings from the 'settings' table here
      adSettings: null, 
      seoSettings: null,
      generalSettings: null,
      socialMediaSettings: null,
      emailNotifications: [], // Placeholder
      customEmails: [], // Placeholder
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching data' }, { status: 500 });
  } finally {
    client.release();
  }
}