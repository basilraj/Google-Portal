# Jobtica - Government Job Portal (Full-Stack SPA)

Jobtica is a comprehensive, full-stack React application designed as a portal for government job notifications. It features a public-facing website for job seekers and a complete, password-protected admin panel for managing all site content.

This application uses a modern full-stack architecture with a **React (Vite) frontend** and a **serverless backend powered by Prisma and a PostgreSQL database (e.g., Neon)**.

## Features

### Public Website
- **Job Listings:** Clean, searchable, and paginated job board powered by a central database.
- **Advanced Search:** Filter by keyword, department, and qualification. Sort by dates.
- **Job Details:** SEO-friendly detail pages with structured data (`JobPosting` schema).
- **Content Sections:** Dedicated areas for Exam Notices, Admit Cards, and Latest Results.
- **Blog:** A simple blog with categories and SEO-friendly post pages (`Article` schema).
- **Responsive Design:** Fully mobile-friendly layout.
- **Dynamic SEO:** Includes a dynamic `sitemap.xml` generated from database content for optimal crawling.

### Admin Panel (path: `/admin`)
- **Secure Server-Side Authentication:** Admin account credentials are securely stored and verified against the database, with sessions managed by encrypted cookies.
- **Dashboard:** At-a-glance overview of site statistics and quick actions.
- **Full CRUD Management (powered by Prisma):**
    - Job Listings (with bulk CSV upload)
    - General Posts (Blog)
    - Exam Notices & Results
    - Quick Links & Breaking News
- **Audience Management:** View subscribers and contact form submissions.
- **Marketing:** Tools to send email campaigns to subscribers (logged to DB, real sending requires SMTP setup).
- **Comprehensive Settings:**
    - **General:** Site title, logo upload, maintenance mode.
    - **SEO:** Global meta tags, social media previews.
    - **Advertisements:** Manage ad network placements and sponsored ads.
- **System Tools:**
    - **Security Logs:** A complete, timestamped audit trail of all admin actions stored in the database.

## Tech Stack
- **Frontend:** React, Vite, TypeScript
- **Backend:** Serverless Functions (Vercel)
- **Database:** PostgreSQL (e.g., Neon)
- **ORM:** Prisma
- **Authentication:** `iron-session` for encrypted cookie-based sessions.
- **Styling:** Tailwind CSS (via CDN) & Font Awesome

## Project Setup & Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/)
- A PostgreSQL database. A free serverless instance can be obtained from [Neon](https://neon.tech/).

### Installation & Running
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/jobtica-portal.git
    cd jobtica-portal
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Setup Environment Variables:**
    - Create a file named `.env` in the root of the project.
    - Add your PostgreSQL database connection string:
      ```
      DATABASE_URL="YOUR_POSTGRES_DATABASE_CONNECTION_STRING"
      ```
    - Add a secret for session encryption (a random string of at least 32 characters):
      ```
      SESSION_SECRET="your_long_random_secret_for_session_encryption"
      ```

4.  **Sync Database Schema:**
    - Push the Prisma schema to your database. This will create all the necessary tables.
    ```bash
    npx prisma db push
    ```

5.  **Seed Initial Data (Optional but Recommended):**
    - Populate your database with the initial sample data.
    ```bash
    npx prisma db seed
    ```
    *Note: The seed script is configured in `package.json`.*

6.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the next available port). The dev server also runs the serverless functions in the `api/` directory.

### Admin Access
- Navigate to `/admin`.
- If it's your first time, the app will prompt you to create a secure admin account.
- On subsequent visits, you will use the standard login page.

## Deployment on Vercel
This project is optimized for deployment on Vercel.

1.  **Push to GitHub:** Create a new repository on GitHub and push your project code.
2.  **Import Project on Vercel:**
    - Import your project from the GitHub repository.
3.  **Configure Build Settings:** Vercel should automatically detect Vite. The settings should be:
    - **Framework Preset:** `Vite`
    - **Build Command:** `npm run build`
    - **Output Directory:** `dist`
4.  **Add Environment Variables:**
    - In your Vercel project settings, go to "Environment Variables".
    - Add `DATABASE_URL` with your database connection string.
    - Add `SESSION_SECRET` with your session secret.
5.  **Deploy:** Vercel will build your frontend, deploy your API functions, and connect to your database.
