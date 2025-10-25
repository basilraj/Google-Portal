# Jobtica - Full-Stack Government Job Portal & Admin Panel

Jobtica is a comprehensive, full-stack single-page application (SPA) built with React. It serves as a portal for government job notifications, featuring a public-facing website for job seekers and a complete, secure admin panel for managing all site content.

The application is built on a modern serverless architecture using a **React (Vite) frontend**, **Vercel Serverless Functions** for the backend, and a **Prisma-managed MySQL database**.

## Features

### Public Website
- **Dynamic Job Listings:** A clean, searchable, and paginated job board.
- **Advanced Search & Filter:** Users can filter jobs by keyword, department, and qualification, and sort by posted or last date.
- **SEO-Optimized Detail Pages:** All job and blog pages are dynamically rendered with SEO-friendly URLs, titles, meta descriptions, and structured data (Schema.org's `JobPosting` and `Article` schemas) to improve search engine visibility.
- **Content Sections:** Dedicated sections for Exam Notices, Latest Results, and a full-featured Blog with category filtering.
- **Exam Preparation:** A central hub for affiliate courses and recommended books to help users prepare for exams.
- **Responsive Design:** A fully mobile-friendly layout ensures a seamless experience on all devices.
- **Automated SEO:** Dynamically generated `sitemap.xml` and `robots.txt` for optimal search engine crawling.
- **User Engagement:** Includes a newsletter subscription form and a contact page for user inquiries.
- **Dynamic Theming:** The entire site's color scheme can be changed from the admin panel.
- **Content Protection:** Optional feature to disable text selection, right-clicking, and printing to deter content theft.

### Admin Panel (`/admin`)
- **Secure Authentication:** Admin access is protected by server-side authentication using `iron-session` for encrypted, cookie-based sessions.
- **Demo User Mode:** A safe, sandboxed mode for demonstrating admin panel features with restricted permissions.
- **Comprehensive Dashboard:** An overview of site statistics (active jobs, subscribers) and quick actions.
- **Full CRUD Management:**
    - **Job Listings:** Includes bulk CSV upload and a manual notification parsing helper.
    - **Content Posts:** Manage the Blog, Exam Notices, and Results.
    - **Exam Preparation:** Add and manage affiliate Courses, Books, and Upcoming Exam deadlines.
    - **Site Elements:** Control Quick Links and the Breaking News ticker.
- **Audience Management:** View contact form submissions and manage the subscriber list (with CSV export).
- **Marketing Suite:**
    - **Email Campaigns:** A composer to send custom emails to all subscribers, with support for templates.
    - **Ad Management:** Control Sponsored Ads and a configurable Popup Ad for the public site.
- **System-wide Settings:**
    - **General:** Set the site title, upload a logo, and toggle maintenance mode.
    - **SEO:** Configure global meta tags, social media (Open Graph) previews, and schema toggles.
    - **Advertisements:** A central library for ad network codes, placement control, and an A/B testing simulation mode.
    - **Theme:** A color picker to customize the site's primary and accent colors instantly.
    - **Security:** Manage Content Security Policy (CSP), session timeouts, and demo mode permissions.
- **Activity Logs:** A complete, timestamped audit trail of all admin actions for security and monitoring.

## Tech Stack
- **Frontend:** React 18, Vite, TypeScript
- **Backend:** Serverless Functions (deployed on Vercel)
- **Database:** MySQL
- **ORM:** Prisma
- **Authentication:** `iron-session` (for encrypted, cookie-based sessions)
- **Styling:** Tailwind CSS (via CDN), Font Awesome

## Project Structure
```
/
├── api/                  # Serverless backend functions for each data model
├── components/           # Reusable React components (public and admin)
│   ├── admin/            # Components specific to the admin panel
│   └── ...
├── contexts/             # React Context for global state (AuthContext, DataContext)
├── hooks/                # Custom React hooks (e.g., usePagination)
├── lib/                  # Shared server-side logic (Prisma client, session config)
├── pages/                # Top-level page components used for client-side routing
├── prisma/               # Prisma schema, migrations, and seed script
│   ├── schema.prisma     # Defines all database models and relations
│   └── seed.mjs          # Seeds the database with initial sample data
├── public/               # Static assets (deprecated, as assets are minimal)
├── utils/                # Client-side utility functions (slugify, jobUtils)
├── App.tsx               # Main application component with client-side routing logic
├── index.tsx             # Application entry point
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vercel.json           # Vercel deployment configuration (rewrites for SPA and API)
└── README.md             # This documentation file
```

## API Endpoints & Database Models

### API Endpoints
All backend logic is handled by serverless functions in the `/api/` directory.

- `GET /api/data`: The primary endpoint to fetch all site data. It returns public data to all users and extended data (e.g., subscribers, logs) to authenticated admins.
- `/api/auth`: Handles user session management: `GET` (check status), `POST` (signup, login, logout), `PUT` (update credentials).
- CRUD Endpoints: The following endpoints provide full Create, Read (via `/api/data`), Update, and Delete functionality for their respective models:
    - `/api/jobs`
    - `/api/posts` (for Blog, Notices, and Results)
    - `/api/quicklinks`
    - `/api/breakingnews`
    - `/api/sponsoredads`
    - `/api/preparationcourses`
    - `/api/preparationbooks`
    - `/api/upcomingexams`
    - `/api/emailtemplates`
- Specialized Endpoints:
    - `/api/subscribers`: `POST` for new subscriptions, `DELETE` for admin removal.
    - `/api/contacts`: `POST` for new submissions, `DELETE` for admin removal.
    - `/api/settings`: `POST` to update any key-value site setting.
    - `/api/activitylogs`: `POST` to create new logs, `DELETE` to clear history.

### Database Models
The database schema is defined in `prisma/schema.prisma`. Key models include:
- **User**: Stores hashed credentials for the admin account.
- **Job**: The core model for job listings, with relations to preparation materials.
- **ContentPost**: A versatile model for Blog Posts, Exam Notices, and Results, differentiated by a `type` field.
- **Subscriber**, **ContactSubmission**: Models for audience interaction.
- **QuickLink**, **BreakingNews**, **SponsoredAd**: Models for various site components.
- **PreparationCourse**, **PreparationBook**, **UpcomingExam**: Models for the Exam Prep section.
- **ActivityLog**: Stores a record of all actions performed in the admin panel.
- **KeyValueStore**: A generic key-value table that stores all site-wide settings (General, SEO, Ads, etc.) as JSON objects, providing flexibility.

## Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/)
- A local MySQL server instance.

### Installation & Running
1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd jobtica-portal
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Setup Environment Variables:**
    - Create a file named `.env` in the root of the project.
    - Add your MySQL database connection string:
      ```
      # Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE
      DATABASE_URL="mysql://root:password@localhost:3306/jobtica"
      ```
    - Add a secret for session encryption (a random string of at least 32 characters):
      ```
      SESSION_SECRET="your_long_random_secret_for_session_encryption"
      ```

4.  **Sync Database Schema:**
    - This command reads your `prisma/schema.prisma` file and creates all the necessary tables in your database.
    ```bash
    npx prisma db push
    ```

5.  **Seed Initial Data (Recommended):**
    - Populate your database with sample data to see the application in action immediately.
    ```bash
    npx prisma db seed
    ```
    *(Note: The seed script is configured in `package.json`.)*

6.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`. The Vite dev server also runs the serverless functions in the `api/` directory locally.

### Admin Access
- Navigate to `/admin`.
- On your first visit, the app will prompt you to create a secure admin account (this only happens if no users exist in the database).
- On subsequent visits, you will use the standard login page.

## Deployment
This project is optimized for one-click deployment on **Vercel**.

1.  **Push to GitHub:** Create a new repository on GitHub and push your project code.
2.  **Import Project on Vercel:**
    - From your Vercel dashboard, import the project from your GitHub repository.
3.  **Configure Build Settings:** Vercel should automatically detect the `Vite` framework preset. The settings will be:
    - **Build Command:** `npm run build` (which includes `prisma generate`)
    - **Output Directory:** `dist`
4.  **Add Environment Variables:**
    - In your Vercel project settings, go to "Environment Variables".
    - Add `DATABASE_URL` with your production database connection string (e.g., from PlanetScale, Neon, etc.).
    - Add `SESSION_SECRET` with your unique session secret.
5.  **Deploy:** Vercel will build the frontend, deploy the API functions from the `/api` directory, and connect to your database.
