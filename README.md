# Jobtica - Government Job Portal

Jobtica is a comprehensive, client-side web application designed to serve as a one-stop portal for government job seekers. It features a public-facing website for users to browse job listings and a secure, feature-rich admin panel for complete site management. The application is built with React, TypeScript, and Vite, and it is designed to run entirely on the client-side, using the browser's `localStorage` for data persistence.

## Key Features

### Public Website
- **Latest Job Listings:** A clean, paginated view of all active job openings.
- **Advanced Search & Filtering:** Users can search for jobs by keyword and filter by department.
- **Detailed Job View:** Each job has a dedicated, SEO-friendly page with a full description and an "Apply Now" link.
- **Content Sections:** Dedicated sections for "Exam Notices," "Admit Cards," and "Latest Results."
- **Newsletter Subscription:** A simple form for users to subscribe to email updates.
- **SEO Optimized:** Includes dynamic meta tags, structured data (JobPosting, Article schemas), and a dynamically generated `sitemap.xml` and `robots.txt` for optimal search engine performance.

### Admin Panel
- **Secure Authentication:** A robust, two-factor authentication (2FA) system with a one-time admin signup and email-based OTP for every login.
- **Comprehensive Dashboard:** An at-a-glance overview of key site metrics, including active jobs, subscribers, and system health.
- **Full CRUD Management:** Intuitive interfaces for managing:
  - Job Listings (including bulk CSV upload)
  - General Blog Posts (with per-post SEO fields)
  - Exam Notices & Results
  - Quick Links & Breaking News
- **Advanced Ad Management:**
  - Configure ad placements for networks like AdSense.
  - Manually upload sponsored ads with click tracking and reporting.
- **Automation:**
  - Job statuses are automatically updated to "Closing Soon" or "Expired" based on their application deadline.
  - Old, expired jobs are automatically deleted to keep the portal clean.
- **Security & Maintenance:**
  - A detailed security log that tracks all admin actions.
  - A simple backup and restore system to export and import all site data as a single JSON file.

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS (via CDN), Font Awesome
- **Data Persistence:** Client-side `localStorage`
- **Deployment:** Vercel

## Project Setup & Deployment

### Local Development
This project is designed to run entirely on the client side.

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server. Open your browser to `http://localhost:5173` (or the URL provided in your terminal) to view the application.

    **Note:** Since the application is now fully client-side, `vercel dev` is no longer required for local development.

### Deployment to Vercel
This project is optimized for deployment on Vercel.

1.  **Push to GitHub:** Ensure your project is pushed to a GitHub repository.

2.  **Import Project on Vercel:**
    - Log in to your Vercel account.
    - Click "Add New..." -> "Project".
    - Import your GitHub repository.

3.  **Configure Build Settings:**
    - Vercel should automatically detect that you are using Vite and configure the build settings correctly.
    - **Framework Preset:** `Vite`
    - **Build Command:** `vite build`
    - **Output Directory:** `dist`

4.  **Deploy:**
    - Click the "Deploy" button. Vercel will build and deploy your application. After the deployment is complete, you will be provided with a live URL.
