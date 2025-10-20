import { db } from '@vercel/postgres';
import dotenv from 'dotenv';

// IMPORTANT: This script will DELETE all existing data in the tables before seeding.
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
    { id: '3', title: 'SSC Jobs', category: 'Category', url: '#', description: '', status: 'active' },
    { id: '4', title: 'Defence Jobs', category: 'Category', url: '#', description: '', status: 'active' },
];
const INITIAL_POSTS = [
    { id: '1', title: 'How to Prepare for SSC CGL 2025', category: 'Preparation Tips', content: "Detailed content on preparing for SSC CGL...", status: 'published', type: 'posts', publishedDate: '2025-10-12', createdAt: '2025-10-12T14:00:00Z' },
    { id: '4', title: 'SSC CGL Tier-II Admit Card Released', category: 'Admit Card', content: "Details about the admit card release...", status: 'published', type: 'exam-notices', publishedDate: '2025-10-12', examDate: '2025-10-25' },
    { id: '6', title: 'SSC MTS Final Result 2025 Declared', category: 'Results', content: "Details about the final result declaration...", status: 'published', type: 'results', publishedDate: '2025-10-13', examDate: '2025-08-15' },
];
const INITIAL_SUBSCRIBERS = [
    { id: '1', email: 'subscriber1@example.com', subscriptionDate: '2025-10-01', status: 'active' },
    { id: '2', email: 'subscriber2@example.com', subscriptionDate: '2025-10-02', status: 'active' },
];
const INITIAL_BREAKING_NEWS = [
    { id: '1', text: 'SSC CGL 2025 Notification Released. Last date to apply is Nov 20, 2025.', link: '#', status: 'active' },
    { id: '2', text: 'Railway NTPC Final Result has been declared. Check your result now.', link: '#', status: 'active' },
];

async function seedTable(client, tableName, createQuery, seedData, insertQueryBuilder) {
    try {
        await client.sql`DROP TABLE IF EXISTS ${client.sql.unsafe(tableName)};`;
        console.log(`Dropped "${tableName}" table`);
        await client.sql(createQuery);
        console.log(`Created "${tableName}" table`);
        if (seedData.length > 0) {
            const inserted = await Promise.all(seedData.map(item => client.sql(insertQueryBuilder(item))));
            console.log(`Seeded ${inserted.length} ${tableName}`);
        }
    } catch (error) {
        console.error(`Error seeding ${tableName}:`, error);
        throw error;
    }
}

async function main() {
  const client = await db.connect();
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await seedTable(client, 'jobs', 
    `CREATE TABLE jobs (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, title VARCHAR(255) NOT NULL, department VARCHAR(255) NOT NULL,
        description TEXT NOT NULL, qualification VARCHAR(255) NOT NULL, vacancies VARCHAR(50) NOT NULL,
        posted_date DATE NOT NULL, last_date DATE NOT NULL, apply_link VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW()
    );`,
    INITIAL_JOBS,
    (job) => `INSERT INTO jobs (title, department, description, qualification, vacancies, posted_date, last_date, apply_link, status, created_at)
        VALUES (${job.title}, ${job.department}, ${job.description}, ${job.qualification}, ${job.vacancies}, ${job.postedDate}, ${job.lastDate}, ${job.applyLink}, ${job.status}, ${job.createdAt})`
  );

  await seedTable(client, 'quick_links',
    `CREATE TABLE quick_links (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, title VARCHAR(255) NOT NULL, category VARCHAR(100) NOT NULL,
        url VARCHAR(255) NOT NULL, description TEXT, status VARCHAR(50) NOT NULL
    );`,
    INITIAL_QUICK_LINKS,
    (link) => `INSERT INTO quick_links (title, category, url, description, status)
        VALUES (${link.title}, ${link.category}, ${link.url}, ${link.description}, ${link.status})`
  );

  await seedTable(client, 'posts',
    `CREATE TABLE posts (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, title VARCHAR(255) NOT NULL, category VARCHAR(100) NOT NULL,
        content TEXT NOT NULL, status VARCHAR(50) NOT NULL, type VARCHAR(50) NOT NULL, published_date DATE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(), exam_date DATE, image_url TEXT
    );`,
    INITIAL_POSTS,
    (post) => `INSERT INTO posts (title, category, content, status, type, published_date, created_at, exam_date)
        VALUES (${post.title}, ${post.category}, ${post.content}, ${post.status}, ${post.type}, ${post.publishedDate}, ${post.createdAt}, ${post.examDate})`
  );

  await seedTable(client, 'subscribers',
    `CREATE TABLE subscribers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, 
        subscription_date DATE NOT NULL, status VARCHAR(50) NOT NULL
    );`,
    INITIAL_SUBSCRIBERS,
    (sub) => `INSERT INTO subscribers (email, subscription_date, status) VALUES (${sub.email}, ${sub.subscriptionDate}, ${sub.status})`
  );

  await seedTable(client, 'contacts',
    `CREATE TABLE contacts (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL, message TEXT NOT NULL, submitted_at TIMESTAMPTZ DEFAULT NOW()
    );`, [], () => ``
  );

  await seedTable(client, 'breaking_news',
    `CREATE TABLE breaking_news (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, text VARCHAR(255) NOT NULL, link VARCHAR(255), status VARCHAR(50) NOT NULL
    );`,
    INITIAL_BREAKING_NEWS,
    (news) => `INSERT INTO breaking_news (text, link, status) VALUES (${news.text}, ${news.link}, ${news.status})`
  );

  await seedTable(client, 'settings',
    `CREATE TABLE settings (key VARCHAR(255) PRIMARY KEY, value JSONB NOT NULL);`,
    [], () => ``
  );

  await client.end();
}

main().catch((err) => {
  console.error('An error occurred while attempting to seed the database:', err);
});
