# Jobtica - Government Job Portal

Jobtica is a comprehensive, modern web application designed to serve as a one-stop portal for government job seekers. It features a public-facing website for users to browse and search for jobs, and a powerful, secure admin panel for site administrators to manage all content.

This project is configured as a **client-side application**. All data is persisted in the browser's `localStorage`, meaning no backend database configuration is required for deployment.

## Key Features

### Public Website
- **Latest Job Listings**: Clean, card-based UI to display recent job openings with key details.
- **Job Search & Filtering**: Users can search for jobs by title or keyword and filter by department.
- **Detailed Job Pages**: SEO-friendly, slug-based URLs for each job with a full description, qualifications, dates, and an "Apply Now" link.
- **Content Sections**: Dedicated sections for "Exam Notices," "Admit Cards," and "Latest Results."
- **Blog**: A content section for articles, guides, and tips.
- **Newsletter Subscription**: Users can subscribe to receive email updates.
- **Social Sharing**: Easily share jobs and blog posts on platforms like Facebook and WhatsApp.
- **Responsive Design**: Fully mobile-friendly layout for access on any device.

### Admin Panel
- **Secure Authentication**: A one-time admin signup process with two-factor authentication (2FA) using email-based One-Time Passwords (OTPs).
- **Dashboard**: An at-a-glance overview of site statistics, including active jobs, subscribers, and system health.
- **Full CRUD Management**:
    - **Job Management**: Add, edit, delete, and preview job listings. Includes bulk upload via CSV and a "Notification Extractor" tool.
    - **Content Management**: Manage general blog posts, exam notices, and results through a unified interface.
    - **Link Management**: Control "Quick Links" and "Breaking News" items.
- **Audience Management**: View and manage newsletter subscribers and contact form submissions.
- **Advanced Settings**:
    - **General**: Control site title, logo (with manual upload), and maintenance mode.
    - **SEO**: Manage global meta tags, social sharing previews (Open Graph), and structured data settings.
    - **Advertisements**: Configure ad placements and manage manually uploaded sponsored ads with click tracking.
    - **Email & RSS**: Configure SMTP server settings for sending real emails and manage RSS feeds for automated job posting.
- **Security & Maintenance**:
    - **Security Logs**: A complete audit trail of all admin activities (logins, content changes, settings updates).
    - **Backup & Restore**: Easily create and restore a full backup of the site's data in a single JSON file.

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Data Persistence**: Browser `localStorage`
- **Deployment**: Vercel (or any static hosting provider)

## Project Setup & Deployment

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Local Development Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run the Development Server**:
    The application runs entirely on the client-side.
    ```bash
    npm run dev
    ```
    Your application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Deployment to Vercel (via GitHub)

1.  **Create a GitHub Repository**:
    Push your project code to a new repository on GitHub.

2.  **Create a Vercel Project**:
    - Go to your Vercel dashboard and click "Add New... -> Project".
    - Import your GitHub repository.
    - Vercel will automatically detect that it is a Vite project. The build settings should be configured automatically with no changes needed.

3.  **Deploy**:
    - Click "Deploy".
    - Vercel will automatically deploy your project whenever you push changes to your main branch on GitHub. Since there is no database, no further configuration is required.
