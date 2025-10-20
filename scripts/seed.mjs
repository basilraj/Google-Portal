import { db } from '@vercel/postgres';
import dotenv from 'dotenv';

// IMPORTANT: This script will DELETE all existing data in the tables before seeding.
// Make sure you have a backup if you are running this on a database with important data.

dotenv.config({ path: '.env.local' });

// Copied from constants.ts to avoid TS/JS module issues in a simple script
const INITIAL_JOBS = [
    { id: '1', title: 'Railway Recruitment Board - Assistant Loco Pilot', department: 'Railways', description: 'Assistant Loco Pilot position in Indian Railways.', qualification: '12th Pass', vacancies: '5,696', postedDate: '2025-10-10', lastDate: '2025-11-15', applyLink: '#', status: 'active', createdAt: '2025-10-10T10:00:00Z'},
    { id: '2', title: 'SSC CHSL - Combined Higher Secondary Level', department: 'SSC', description: 'Combined Higher Secondary Level Examination.', qualification: '12th Pass', vacancies: '3,712', postedDate: '2025-10-08', lastDate: '2025-11-20', applyLink: '#', status: 'active', createdAt: '2025-10-08T11:00:00Z'},
    { id: '3', title: 'UPSC Civil Services Examination 2026', department: 'UPSC', description: 'Prestigious Civil Services Examination.', qualification: 'Graduate', vacancies: '1,056', postedDate: '2025-09-25', lastDate: '2025-10-18', applyLink: '#', status: 'closing-soon', createdAt: '2025-09-25T09:00:00Z'},
];

const INITIAL_QUICK_LINKS = [
    { id: '1', title: 'Banking Jobs', category: 'Category', url: '#', description: '', status: 'active' },
    { id: '2', title: 'Railway Jobs', category: 'Category', url: '#', description: '', status: 'active' },
];

const INITIAL_POSTS = [
    { id: '1', title: 'How to Prepare for SSC CGL 2025', category: 'Preparation Tips', content: "Detailed content on preparing for SSC CGL...", status: 'published', type: 'posts', publishedDate: '2025-10-12', createdAt: '2025-10-12T14:00:00Z' },
    { id: '4', title: 'SSC CGL Tier-II Admit Card Released', category: 'Admit Card', content: "Details about the admit card release...", status: 'published', type: 'exam-notices', publishedDate: '2025-10-12', examDate: '2025-10-25' },
    { id: '6', title: 'SSC MTS Final Result 2025 Declared', category: 'Results', content: "Details about the final result declaration...", status: 'published', type: 'results', publishedDate: '2025-10-13', examDate: '2025-08-15' },
];

// ... Add other initial data arrays here if needed

async function seedJobs(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Drop table if it exists to start fresh
    await client.sql`DROP TABLE IF EXISTS jobs;`;
    console.log(`Dropped "jobs" table`);
    
    // Create the "jobs" table
    const createTable = await client.sql`
      CREATE TABLE jobs (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        qualification VARCHAR(255) NOT NULL,
        vacancies VARCHAR(50) NOT NULL,
        posted_date DATE NOT NULL,
        last_date DATE NOT NULL,
        apply_link VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    console.log(`Created "jobs" table`);

    // Insert data into the "jobs" table
    const insertedJobs = await Promise.all(
      INITIAL_JOBS.map(job => client.sql`
        INSERT INTO jobs (title, department, description, qualification, vacancies, posted_date, last_date, apply_link, status, created_at)
        VALUES (${job.title}, ${job.department}, ${job.description}, ${job.qualification}, ${job.vacancies}, ${job.postedDate}, ${job.lastDate}, ${job.applyLink}, ${job.status}, ${job.createdAt})
        ON CONFLICT (id) DO NOTHING;
      `),
    );

    console.log(`Seeded ${insertedJobs.length} jobs`);
    return { createTable, jobs: insertedJobs };
  } catch (error) {
    console.error('Error seeding jobs:', error);
    throw error;
  }
}

async function seedQuickLinks(client) {
  try {
    await client.sql`DROP TABLE IF EXISTS quick_links;`;
    console.log(`Dropped "quick_links" table`);

    const createTable = await client.sql`
      CREATE TABLE quick_links (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        url VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL
      );
    `;
    console.log(`Created "quick_links" table`);
    
    const inserted = await Promise.all(
      INITIAL_QUICK_LINKS.map(link => client.sql`
        INSERT INTO quick_links (title, category, url, description, status)
        VALUES (${link.title}, ${link.category}, ${link.url}, ${link.description}, ${link.status});
      `),
    );
    console.log(`Seeded ${inserted.length} quick links`);
  } catch (error) {
    console.error('Error seeding quick links:', error);
    throw error;
  }
}

async function seedPosts(client) {
  try {
    await client.sql`DROP TABLE IF EXISTS posts;`;
    console.log(`Dropped "posts" table`);

    const createTable = await client.sql`
      CREATE TABLE posts (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        status VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        published_date DATE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        exam_date DATE,
        image_url TEXT
      );
    `;
    console.log(`Created "posts" table`);
    
    const inserted = await Promise.all(
      INITIAL_POSTS.map(post => client.sql`
        INSERT INTO posts (title, category, content, status, type, published_date, created_at, exam_date)
        VALUES (${post.title}, ${post.category}, ${post.content}, ${post.status}, ${post.type}, ${post.publishedDate}, ${post.createdAt}, ${post.examDate});
      `),
    );
    console.log(`Seeded ${inserted.length} posts`);
  } catch (error) {
    console.error('Error seeding posts:', error);
    throw error;
  }
}

// Key-value table for settings
async function createSettingsTable(client) {
    try {
        await client.sql`DROP TABLE IF EXISTS settings;`;
        console.log(`Dropped "settings" table`);
        await client.sql`
            CREATE TABLE settings (
                key VARCHAR(255) PRIMARY KEY,
                value JSONB NOT NULL
            );
        `;
        console.log(`Created "settings" table`);
    } catch (error) {
        console.error('Error creating settings table:', error);
        throw error;
    }
}

async function main() {
  const client = await db.connect();

  await seedJobs(client);
  await seedQuickLinks(client);
  await seedPosts(client);
  await createSettingsTable(client); // For Ad, SEO, General settings
  // Add other seed functions here (subscribers, contacts, etc.)

  await client.end();
}

main().catch((err) => {
  console.error('An error occurred while attempting to seed the database:', err);
});