# Jobtica - Government Job Portal (Client-Side SPA)

Jobtica is a comprehensive, client-side React application designed as a portal for government job notifications. It features a public-facing website for job seekers and a complete, password-protected admin panel for managing all site content.

**Important Note:** This is a **client-side only application**. All data, including jobs, posts, and settings, is persisted in the browser's `localStorage`. There is no backend database. This makes it incredibly easy to deploy on static hosting platforms like Vercel.

## Features

### Public Website
- **Job Listings:** Clean, searchable, and paginated job board.
- **Advanced Search:** Filter by keyword, department, and qualification. Sort by dates.
- **Job Details:** SEO-friendly detail pages with structured data (`JobPosting` schema).
- **Content Sections:** Dedicated areas for Exam Notices, Admit Cards, and Latest Results.
- **Blog:** A simple blog with categories and SEO-friendly post pages (`Article` schema).
- **Responsive Design:** Fully mobile-friendly layout.
- **Technical SEO:** Includes a static `robots.txt` and a build-time generated `sitemap.xml` for better crawling.

### Admin Panel (path: `/admin`)
- **Secure Login:** One-time admin signup. Password reset is simulated unless SMTP is configured.
- **Dashboard:** At-a-glance overview of site statistics and quick actions.
- **Full CRUD Management (powered by `localStorage`):**
    - Job Listings (with bulk CSV upload)
    - General Posts (Blog)
    - Exam Notices & Results
    - Quick Links & Breaking News
- **Audience Management:** View subscribers and contact form submissions.
- **Marketing:** Tools to send email campaigns to subscribers (simulated if SMTP is not configured).
- **Comprehensive Settings:**
    - **General:** Site title, logo upload, maintenance mode.
    - **SEO:** Global meta tags, social media previews.
    - **Advertisements:** Manage ad network placements and sponsored ads.
- **System Tools:**
    - **Backup & Restore:** Download or upload a single JSON file with all site data.
    - **Security Logs:** A complete, timestamped audit trail of all admin actions.

## Tech Stack
- **Frontend:** React, Vite, TypeScript
- **Styling:** Tailwind CSS (via CDN) & Font Awesome
- **State Management:** React Context API
- **Data Persistence:** Browser `localStorage`

## Local Setup & Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/)

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
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the next available port).

### Admin Access
- Navigate to `/admin`.
- The very first time, you will be prompted to create an admin account. This account information is stored in your browser's `localStorage`.
- On subsequent visits, you will use the standard login page.

## Deployment on Vercel
This project is optimized for deployment as a Single-Page Application (SPA) on Vercel.

1.  **Push to GitHub:** Create a new repository on GitHub and push your project code.
2.  **Import Project on Vercel:**
    - Log in to your Vercel account.
    - Click "Add New..." -> "Project".
    - Import your project from the GitHub repository.
3.  **Configure Build Settings:** Vercel should automatically detect Vite and configure the settings correctly. Verify they match the following:
    - **Framework Preset:** `Vite`
    - **Build Command:** `npm run build`
    - **Output Directory:** `dist`
    - **Install Command:** `npm install`
4.  **Deploy:** Click the "Deploy" button. Vercel will automatically build and deploy your application. The `vercel.json` file in this repository ensures that all routes are correctly handled by the React application.