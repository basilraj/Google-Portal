# Jobtica - Comprehensive Job Portal & Admin Panel

![Jobtica Logo](https://i.imgur.com/2A6g2hX.png)

Jobtica is a feature-rich, modern job portal application built with React and Vite. It includes a public-facing website for job seekers and a powerful, secure admin panel for managing all aspects of the site. The application is designed as a "database-less" demo, using the browser's `localStorage` for data persistence, which makes it incredibly easy to set up, test, and deploy.

**Live Demo:** [https://jobtica.vercel.app/](https://jobtica.vercel.app/)

---

## Key Features

### Public Website
- **Advanced Job Search:** Filter jobs by keyword, department, qualification, and status.
- **Dynamic Job Listings:** Clean, paginated display of job openings with clear status badges (Active, Closing Soon, Expired).
- **SEO-Optimized Job Pages:** User-friendly URLs (e.g., `/job/ssc-cgl-recruitment-2025`), dynamic meta tags, and structured data (`JobPosting` schema) for rich search results.
- **Blog & Content Pages:** A dedicated blog section with category filtering and SEO-optimized article pages (`Article` schema).
- **Static Pages:** Fully styled pages for About Us, Privacy Policy, Terms, and Disclaimer.
- **Social Sharing:** Easily share jobs and blog posts on Facebook, WhatsApp, and Telegram.
- **Newsletter Subscription:** A functional subscription form that captures user emails.
- **Contact Form:** A working contact form for user inquiries.
- **Responsive Design:** A fully responsive and mobile-friendly user interface.
- **Ad Integration:** Displays ads in the header, sidebar, and footer, including manually uploaded sponsored ads.
- **Technical SEO:** Automatically generates `sitemap.xml` and `robots.txt` for optimal search engine crawling.

### Admin Panel
- **Secure Authentication:**
    - **One-Time Signup:** A secure, one-time process to create the initial admin account.
    - **Two-Factor Authentication (2FA):** Email-based OTP verification for enhanced login security.
- **Comprehensive Dashboard:** At-a-glance view of key metrics like active jobs, total posts, subscribers, and system health.
- **Full CRUD Functionality:** Manage Jobs, General Posts, Exam Notices, Results, Quick Links, and Breaking News.
- **Advanced Job Management:** Includes features for bulk CSV upload, bulk deletion, and a manual notification parser tool.
- **Subscriber & Contact Management:** View and manage all newsletter subscribers and contact form submissions.
- **Ad Management System:**
    - Control AdSense-style ad placements.
    - Manually upload **Sponsored Ads** with destination URLs and track click-through rates.
- **Settings Configuration:**
    - **General:** Set site title, upload a custom logo, and toggle maintenance mode.
    - **SEO:** Manage global meta tags, social media (Open Graph) previews, and structured data settings.
    - **Social Media:** Update links to your social media profiles.
    - **Email Server:** Configure SMTP settings to enable sending real emails.
- **Backup & Restore:** Create a full backup of all site data as a single JSON file and restore from it.
- **Automation:**
    - **RSS Feed Importer:** Fetch, review, and import job listings from an external RSS feed.
    - **Automatic Status Updates:** Job statuses are automatically updated to "Closing Soon" or "Expired" based on their application deadline.

---

## Tech Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **State Management:** React Context API
- **Data Persistence:** Browser `localStorage` (This is a client-side demo application without a traditional backend database).
- **Deployment:** Vercel

---

## Getting Started (Local Setup)

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/jobtica.git
    cd jobtica
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

---

## Admin Access

-   **URL:** Navigate to `http://localhost:5173/admin`
-   **First-Time Setup:** On your first visit, you will be prompted to create a new admin account with a username, password, and an email for OTP verification.
-   **Subsequent Logins:** After the initial setup, you will use the standard login form, followed by an OTP verification step.

---

## Deployment to Vercel (from GitHub)

Deploying this project to Vercel is straightforward because it's a static frontend application.

### Step 1: Fork the Repository
-   Click the "Fork" button at the top right of this GitHub repository page to create a copy under your own GitHub account.

### Step 2: Connect to Vercel
1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard) and log in with your GitHub account.
2.  Click the "**Add New...**" button and select "**Project**".
3.  In the "Import Git Repository" section, find your forked `jobtica` repository and click "**Import**".

### Step 3: Configure Your Project
-   Vercel will automatically detect that you are using **Vite**. The default settings should be correct.
-   **Framework Preset:** `Vite`
-   **Build Command:** `npm run build` or `vite build`
-   **Output Directory:** `dist`
-   You do not need to configure any Environment Variables.

### Step 4: Deploy
-   Click the "**Deploy**" button.
-   Vercel will build and deploy your project. Once finished, you will be provided with a live URL.

---

### Important Note on Data Persistence
This application uses the browser's `localStorage` to store all its data. This means:
-   The live Vercel deployment will start with the initial sample data from the codebase.
-   Any changes you make (adding jobs, changing settings, etc.) on the live site will be saved **only in your current browser**.
-   The data is not shared between different users or even different browsers on the same computer. Clearing your browser's data will reset the application to its initial state.
