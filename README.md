# Jobtica - Government Job Portal

Jobtica is a comprehensive, client-side React application designed as a portal for government job notifications. It features a public-facing website for job seekers and a complete, password-protected admin panel for managing all site content.

## Features

### Public Website
- **Job Listings:** Clean, searchable, and paginated job board.
- **Advanced Search:** Filter by keyword, department, and qualification. Sort by dates.
- **Job Details:** SEO-friendly detail pages with structured data (`JobPosting`).
- **Content Sections:** Dedicated areas for Exam Notices, Admit Cards, and Latest Results.
- **Blog:** A simple blog with categories and SEO-friendly post pages (`Article` schema).
- **Responsive Design:** Fully mobile-friendly layout.
- **Technical SEO:** Includes a static `robots.txt` and a build-time generated `sitemap.xml`.

### Admin Panel (path: `/admin`)
- **Secure Login:** One-time admin signup and two-factor authentication (2FA) with email-based OTP.
- **Dashboard:** At-a-glance overview of site statistics and quick actions.
- **Full CRUD Management:**
    - Job Listings (with bulk CSV upload)
    - General Posts (Blog)
    - Exam Notices & Results
    - Quick Links & Breaking News
- **Audience Management:** View subscribers and contact form submissions.
- **Marketing:** Tools to send (simulated) email campaigns to subscribers.
- **Comprehensive Settings:**
    - **General:** Site title, logo upload, maintenance mode.
    - **SEO:** Global meta tags, social media previews.
    - **Advertisements:** Manage AdSense/network placements and manually upload sponsored ads with click tracking.
- **System Tools:**
    - **Backup & Restore:** Download or upload a single JSON file with all site data.
    - **Security Logs:** A complete, timestamped audit trail of all admin actions.

## Tech Stack
- **Frontend:** React, Vite, TypeScript
- **Styling:** Tailwind CSS (via CDN) & Font Awesome
- **State Management:** React Context API
- **Data Persistence:** Client-Side via Browser `localStorage`

## Local Setup & Development

This is a pure client-side application. No database or backend server is required to run it locally.

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
    The application will be available at `http://localhost:5173`.

### Admin Access
- Navigate to `/admin`.
- The very first time, you will be prompted to create a secure admin account (username, password, and email for OTP).
- On subsequent visits, you will use the standard login page with 2FA.

## Deployment on Vercel
This project is optimized for deployment as a Single-Page Application (SPA) on Vercel.

1.  **Push to GitHub:** Create a new repository on GitHub and push your project code.
2.  **Import Project on Vercel:**
    - Log in to your Vercel account.
    - Click "Add New..." -> "Project".
    - Import your project from the GitHub repository.
3.  **Configure Build Settings:**
    - **Framework Preset:** `Vite`
    - **Build Command:** `npm run build`
    - **Output Directory:** `dist`
    - **Install Command:** `npm install`
4.  **Deploy:** Click the "Deploy" button. Vercel will automatically build and deploy your application.
