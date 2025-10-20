import { db } from '@vercel/postgres';
import {
  INITIAL_JOBS,
  INITIAL_QUICK_LINKS,
  INITIAL_POSTS,
  INITIAL_SUBSCRIBERS,
  INITIAL_BREAKING_NEWS,
  initialAdSettings,
  initialSeoSettings,
  initialGeneralSettings,
  initialSocialMediaSettings,
} from '../constants.js';

async function seedJobs(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the table, handling if it already exists
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS jobs (
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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log(`Created "jobs" table`);

    // Insert data into the table
    const insertedJobs = await Promise.all(
      INITIAL_JOBS.map(job => client.sql`
        INSERT INTO jobs (title, department, description, qualification, vacancies, posted_date, last_date, apply_link, status)
        VALUES (${job.title}, ${job.department}, ${job.description}, ${job.qualification}, ${job.vacancies}, ${job.postedDate}, ${job.lastDate}, ${job.applyLink}, ${job.status})
        ON CONFLICT (id) DO NOTHING;
      `)
    );

    console.log(`Seeded ${insertedJobs.length} jobs`);
    return { createTable, seededJobs: insertedJobs };
  } catch (error) {
    console.error('Error seeding jobs:', error);
    throw error;
  }
}

async function seedQuickLinks(client) {
    try {
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS quick_links (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                url VARCHAR(255) NOT NULL,
                description TEXT,
                status VARCHAR(50) NOT NULL
            );
        `;
        console.log(`Created "quick_links" table`);
        const inserted = await Promise.all(
            INITIAL_QUICK_LINKS.map(link => client.sql`
                INSERT INTO quick_links (title, category, url, description, status)
                VALUES (${link.title}, ${link.category}, ${link.url}, ${link.description}, ${link.status})
                ON CONFLICT (id) DO NOTHING;
            `)
        );
        console.log(`Seeded ${inserted.length} quick links`);
        return { createTable, seeded: inserted };
    } catch (error) { console.error('Error seeding quick links:', error); throw error; }
}

async function seedPosts(client) {
    try {
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS posts (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                content TEXT NOT NULL,
                status VARCHAR(50) NOT NULL,
                type VARCHAR(50) NOT NULL,
                published_date DATE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                exam_date DATE,
                image_url VARCHAR(255)
            );
        `;
        console.log(`Created "posts" table`);
        const inserted = await Promise.all(
            INITIAL_POSTS.map(post => client.sql`
                INSERT INTO posts (title, category, content, status, type, published_date, exam_date, image_url)
                VALUES (${post.title}, ${post.category}, ${post.content}, ${post.status}, ${post.type}, ${post.publishedDate}, ${post.examDate || null}, ${post.imageUrl || null})
                ON CONFLICT (id) DO NOTHING;
            `)
        );
        console.log(`Seeded ${inserted.length} posts`);
        return { createTable, seeded: inserted };
    } catch (error) { console.error('Error seeding posts:', error); throw error; }
}

async function seedSubscribers(client) {
    try {
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS subscribers (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                subscription_date DATE NOT NULL,
                status VARCHAR(50) NOT NULL
            );
        `;
        console.log(`Created "subscribers" table`);
        const inserted = await Promise.all(
            INITIAL_SUBSCRIBERS.map(sub => client.sql`
                INSERT INTO subscribers (email, subscription_date, status)
                VALUES (${sub.email}, ${sub.subscriptionDate}, ${sub.status})
                ON CONFLICT (email) DO NOTHING;
            `)
        );
        console.log(`Seeded ${inserted.length} subscribers`);
        return { createTable, seeded: inserted };
    } catch (error) { console.error('Error seeding subscribers:', error); throw error; }
}

async function seedBreakingNews(client) {
    try {
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS breaking_news (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                text TEXT NOT NULL,
                link VARCHAR(255),
                status VARCHAR(50) NOT NULL
            );
        `;
        console.log(`Created "breaking_news" table`);
        const inserted = await Promise.all(
            INITIAL_BREAKING_NEWS.map(news => client.sql`
                INSERT INTO breaking_news (text, link, status)
                VALUES (${news.text}, ${news.link}, ${news.status})
                ON CONFLICT (id) DO NOTHING;
            `)
        );
        console.log(`Seeded ${inserted.length} breaking news items`);
        return { createTable, seeded: inserted };
    } catch (error) { console.error('Error seeding breaking news:', error); throw error; }
}

async function seedContacts(client) {
    try {
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS contacts (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log(`Created "contacts" table`);
        return { createTable };
    } catch (error) { console.error('Error seeding contacts:', error); throw error; }
}

async function seedSettings(client) {
  try {
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(50) PRIMARY KEY,
        value JSONB NOT NULL
      );
    `;
    console.log(`Created "settings" table`);

    const settingsToSeed = [
      { key: 'adSettings', value: initialAdSettings },
      { key: 'seoSettings', value: initialSeoSettings },
      { key: 'generalSettings', value: initialGeneralSettings },
      { key: 'socialMediaSettings', value: initialSocialMediaSettings },
    ];
    
    const insertedSettings = await Promise.all(
      settingsToSeed.map(setting => client.sql`
        INSERT INTO settings (key, value)
        VALUES (${setting.key}, ${JSON.stringify(setting.value)})
        ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(setting.value)};
      `)
    );

    console.log(`Seeded ${insertedSettings.length} settings`);
    return { createTable, seededSettings: insertedSettings };
  } catch (error) {
    console.error('Error seeding settings:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedJobs(client);
  await seedQuickLinks(client);
  await seedPosts(client);
  await seedSubscribers(client);
  await seedBreakingNews(client);
  await seedContacts(client);
  await seedSettings(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
