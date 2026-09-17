# Portfolio Administrator Guide & Handover

Welcome to the Administrator Guide for your portfolio CMS. This handbook provides practical, step-by-step instructions for managing your portfolio content, updating assets, configuring security settings, and troubleshooting.

---

## Table of Contents

1. [Accessing the Admin Portal](#1-accessing-the-admin-portal)
2. [Logging In](#2-logging-in)
3. [Resetting Your Password](#3-resetting-your-password)
4. [Managing Projects](#4-managing-projects)
5. [Managing Certifications](#5-managing-certifications)
6. [Managing Skills](#6-managing-skills)
7. [Managing Services](#7-managing-services)
8. [Managing Experience](#8-managing-experience)
9. [Managing Education](#9-managing-education)
10. [Updating Profile & Hero Section](#10-updating-profile--hero-section)
11. [Updating Contact & Social Links](#11-updating-contact--social-links)
12. [Updating Dynamic SEO](#12-updating-dynamic-seo)
13. [Updating Your Resume](#13-updating-your-resume)
14. [Uploading & Managing Media](#14-uploading--managing-media)
15. [How Publishing & Enabling Works](#15-how-publishing--enabling-works)
16. [What Happens When Content is Unpublished](#16-what-happens-when-content-is-unpublished)
17. [Seeding & Resetting Data](#17-seeding--resetting-data)
18. [Supabase Configuration Requirements](#18-supabase-configuration-requirements)
19. [Netlify Environment Variables](#19-netlify-environment-variables)
20. [Troubleshooting & Support](#20-troubleshooting--support)
21. [Backup & Recovery Considerations](#21-backup--recovery-considerations)

---

## 1. Accessing the Admin Portal

Navigate to `/admin` on your portfolio site:
- **Local development:** `http://localhost:3000/admin`
- **Production site:** `https://your-domain.netlify.app/admin`

The public portfolio navigation does not display any link to the admin panel. The URL must be navigated to directly.

---

## 2. Logging In

1. Open `/admin`.
2. Enter your administrator email and password.
3. Click **Sign In**.
4. Upon successful authentication, the system validates that your account has administrator privileges in the database before granting access to the CMS dashboard.
5. If the account is valid but lacks admin permissions in `public.admin_users`, an access denied notification is displayed.

> **Security Note:** Session tokens are stored securely by the Supabase client. No passwords or secret keys are ever stored in the browser's localStorage or frontend code.

---

## 3. Resetting Your Password

If you forget your password:
1. On the login screen (`/admin`), click **"Forgot Password?"**.
2. Enter your registered administrator email address and click **Send Recovery Email**.
3. Check your inbox for the password reset email sent from Supabase.
4. Click the reset link in the email. You will be redirected to:
   `https://your-domain.netlify.app/admin/reset-password`
5. Enter your new password (minimum 8 characters) and confirm it.
6. Click **Update Password**. You will be securely logged in with your new password.

> **Important Configuration:** For password reset links to work in production, you must whitelist your production domain in the Supabase Dashboard:
> - Go to: **Authentication -> URL Configuration**
> - Set **Site URL** to: `https://your-domain.netlify.app`
> - Add Redirect URL: `https://your-domain.netlify.app/admin/reset-password`

---

## 4. Managing Projects

Navigate to **Projects** (`/admin/projects`) from the sidebar:

- **Adding a Project:**
  1. Click **+ Add Project**.
  2. Fill in the title, description, and display order (lower numbers appear first).
  3. Upload a cover image using the file uploader (PNG, JPG, WebP up to 10MB).
  4. Enter project links: GitHub Repository URL, Live Demo URL.
  5. Check **Published** to display it on the public site immediately, or uncheck to keep it as a draft.
  6. Click **Save Project**.

- **Editing a Project:** Click **Edit** on any existing project card, modify fields, and click **Save**.
- **Deleting a Project:** Click **Delete** on a project card. A confirmation dialog will appear to prevent accidental deletion.

---

## 5. Managing Certifications

Navigate to **Certifications** (`/admin/certifications`):

- **Optimized Media Architecture:**
  - **Cover / Thumbnail:** Upload a PNG, JPG, or WebP thumbnail of the certificate badge. This is what displays on public certificate cards, ensuring fast page load speeds.
  - **PDF Document:** Upload the full official certificate PDF. The PDF is only downloaded or viewed when a visitor clicks to view or verify the certificate.
- **Fields:** Title, issuing organization, issue date, credential ID, verification URL, display order, and published toggle.

---

## 6. Managing Skills

Navigate to **Skills** (`/admin/skills`):

Skills are grouped into three categories:
1. **Technical Skills:** Displayed in the "Professional Skillset" section on `/about`.
2. **Tools:** Displayed in the "Tools I Use" section on `/about`.
3. **Services / Additional:** Displayed on the services page.

- **Adding a Skill:**
  1. Select the category (**Technical**, **Tool**, or **Service**).
  2. Enter the skill name (e.g., "React", "Docker", "Node.js").
  3. Select or type an icon identifier:
     - Standard React Icons: `DiReact`, `SiDocker`, `DiNodejs`, `SiPostgresql`, `SiGit`, etc.
     - Or paste an HTTPS URL to a custom icon image.
  4. Specify display order.
  5. Check **Active** and click **Save Skill**.

---

## 7. Managing Services

Navigate to **Services** (`/admin/services`):

- **Fields:**
  - **Title:** Name of the service offering (e.g., "Full-Stack Web Development").
  - **Description:** Summary of what you provide.
  - **Icon:** React icon name or uploaded image URL.
  - **Display Order:** Controls the grid arrangement.
  - **Active Toggle:** Toggle to display or hide the service on `/services`.

---

## 8. Managing Experience

Navigate to **Experience** (`/admin/experience`):

- **Fields:**
  - **Company:** Company or organization name.
  - **Role:** Position or job title.
  - **Location:** City, State, Country, or "Remote".
  - **Start Date & End Date:** Dates of employment.
  - **Current Position:** Check if this is your current ongoing role.
  - **Description / Bullets:** Responsibilities and achievements (supports bullet points).
  - **Display Order & Active Toggle.**

---

## 9. Managing Education

Navigate to **Education** (`/admin/education`):

- **Fields:**
  - **Institution:** University or school name.
  - **Degree:** Degree name (e.g., "Bachelor of Science in Computer Science").
  - **Field of Study:** Major / specialization.
  - **Start & End Years:** Period of study.
  - **Grade / Honors:** GPA, honors, or distinctions (optional).
  - **Display Order & Active Toggle.**

---

## 10. Updating Profile & Hero Section

Navigate to **Profile** (`/admin/profile`):

- **Full Name & Initials:** e.g., "Asad Sarwar", "AS".
- **Hero Greeting & Rotating Titles:** The typing animation on the home page draws from these titles (e.g., "Software Developer", "Full Stack Engineer", "Open Source Contributor"). Enter one title per line.
- **Hero Description:** The introductory text on the home page.
- **About Introduction & Bio:** The detailed paragraphs on the `/about` page.
- **Hobbies & Interests:** Listed on the About page.
- **Avatar Image:** Upload a profile picture (replaces the default home avatar).

---

## 11. Updating Contact & Social Links

Navigate to **Contact** (`/admin/contact`):

- **Primary Contact Info:** Contact email, phone number (optional), location.
- **Social Media Links:**
  - Platform (GitHub, LinkedIn, Twitter/X, Instagram, etc.)
  - URL (full link to your profile)
  - Icon identifier (e.g., `AiFillGithub`, `FaLinkedinIn`, `AiOutlineTwitter`)
  - Active toggle (controls appearance in footer and contact page)

---

## 12. Updating Dynamic SEO

Navigate to **SEO Settings** (`/admin/seo`):

Allows custom meta tags for each page route (`/`, `/about`, `/project`, `/services`, `/certificates`, `/resume`, `/contact`):
- **Page Title:** Displayed in the browser tab and search engine results.
- **Meta Description:** Summary displayed in Google search previews and social link shares.
- **Keywords:** Comma-separated search keywords.
- **OpenGraph Image URL:** Image preview shown when sharing your portfolio on LinkedIn, Twitter, Slack, etc.

---

## 13. Updating Your Resume

Navigate to **Resume** (`/admin/resume`):

- **Upload New Resume PDF:**
  1. Click the file upload box or drag and drop your updated resume PDF (up to 10MB).
  2. The system uploads it to the `resumes` storage bucket with a clean, versioned filename.
  3. Enter version notes (e.g., "Updated September 2026").
  4. Click **Save Resume**.
- **Public Impact:** The public `/resume` page immediately downloads and displays the new PDF.

---

## 14. Uploading & Managing Media

The CMS includes integrated media uploaders for:
- **Project Covers** (Bucket: `projects`, Folder: `covers/`)
- **Certificate Thumbnails** (Bucket: `certifications`, Folder: `thumbnails/`)
- **Certificate PDFs** (Bucket: `certifications`, Folder: `documents/`)
- **Profile Avatars** (Bucket: `profile`, Folder: `avatars/`)
- **Resume PDFs** (Bucket: `resumes`, Folder: `documents/`)
- **Service Icons** (Bucket: `services`, Folder: `icons/`)

### Upload Rules:
- **Images:** Supported types: JPEG (`.jpg`, `.jpeg`), PNG (`.png`), WebP (`.webp`), SVG (`.svg`). Maximum size: **10MB**.
- **Documents:** Supported types: PDF (`.pdf`). Maximum size: **10MB**.
- Executable files (`.exe`, `.sh`, `.bat`, `.js`, `.html`) are strictly blocked.
- Filenames are automatically sanitized to remove spaces and special characters.
- Replacing an image automatically updates the database reference.

---

## 15. How Publishing & Enabling Works

Every CMS content item features a **Published** (or **Active**) switch:
- **Checked (True):** The record is visible to all public visitors on the portfolio.
- **Unchecked (False):** The record is saved as a private draft. Only you (logged in as administrator) can see it in the CMS.

---

## 16. What Happens When Content is Unpublished

- The item disappears from the public portfolio immediately upon page refresh or navigation.
- The item remains safe in your database and appears in the admin panel with an **Unpublished** badge.
- You can re-publish it at any time with a single click.
- If all items in a section are unpublished, the public page gracefully shows an empty state without breaking or crashing.

---

## 17. Seeding & Resetting Data

### Browser Seeding Safeguard:
In the Admin Dashboard (`/admin`), there is an **Initial Portfolio Seeding** utility.
- **Safety First:** Clicking this button opens a modal requiring explicit confirmation.
- **Idempotency:** Seeding uses database `UPSERT` matching on record IDs. It inserts initial baseline records and updates missing data without duplicating records.
- **When Database is Populated:** The dashboard displays a notice: *"Portfolio database is populated. Seeding is only needed if you want to restore baseline starter content."*

### Command-Line Seeding (CLI):
For headless migrations or local development:
```bash
# Set Supabase credentials in your terminal or .env
export REACT_APP_SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-secret-service-role-key"

# Run idempotent seed script
npm run seed
```
> **Security Reminder:** The `SUPABASE_SERVICE_ROLE_KEY` should ONLY be used in private local terminal sessions or CI/CD pipelines. Never commit it to git or put it in public frontend files.

---

## 18. Supabase Configuration Requirements

To connect your Supabase project to the portfolio:

### 1. Database Schema & RLS:
Run the SQL scripts in your Supabase SQL Editor in this order:
1. `supabase/schema.sql` (Creates all tables, constraints, and indexes)
2. `supabase/rls.sql` (Creates `is_admin()` function and Row Level Security policies)
3. `supabase/storage.sql` (Creates public storage buckets and storage access policies)

### 2. Administrator Account Setup:
1. In Supabase Dashboard -> **Authentication -> Users**, create a user with your email and password.
2. Copy the user's `UUID` from the dashboard.
3. In SQL Editor, grant administrator rights:
   ```sql
   INSERT INTO public.admin_users (user_id, email, is_active)
   VALUES ('YOUR_USER_UUID', 'your-email@example.com', true)
   ON CONFLICT (user_id) DO UPDATE SET is_active = true;
   ```

### 3. URL Configuration:
In Supabase Dashboard -> **Authentication -> URL Configuration**:
- **Site URL:** `https://your-domain.netlify.app`
- **Redirect URLs:**
  - `https://your-domain.netlify.app/admin/reset-password`
  - `http://localhost:3000/admin/reset-password` (for local development)

---

## 19. Netlify Environment Variables

In your Netlify site dashboard (**Site Configuration -> Environment variables**), set:

| Variable Name | Value | Purpose |
|---------------|-------|---------|
| `REACT_APP_SUPABASE_URL` | `https://your-project.supabase.co` | Supabase API URL (Public) |
| `REACT_APP_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Supabase Anonymous Client Key (Public) |

> **Do NOT add `SUPABASE_SERVICE_ROLE_KEY` to Netlify environment variables.** Frontend builds do not need and must not contain the service-role key.

### SPA Redirects:
The repository includes `public/_redirects` and `netlify.toml` which automatically handle Single Page App (SPA) routing, ensuring that URLs like `/admin/projects` or `/certificates` load correctly on direct refresh.

---

## 20. Troubleshooting & Support

| Problem | Cause | Solution |
|---------|-------|----------|
| Public site displays original default content instead of CMS updates | Supabase credentials not set or network error | Verify `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` in Netlify settings. Check browser console for network blocks. |
| "Access Denied: You do not have administrator permissions" on `/admin` | User account exists in Supabase Auth but is missing from `public.admin_users` | Run the SQL command in [Section 18](#18-supabase-configuration-requirements) with your user UUID. |
| Password reset email redirects to `localhost:3000` instead of production | Supabase Site URL not configured | In Supabase Dashboard, set Site URL to your Netlify URL and add `/admin/reset-password` to Redirect URLs. |
| File upload error: "File exceeds the 10MB limit" | File is too large | Compress image using TinyPNG or similar tool; keep PDFs under 10MB. |
| File upload error: "File type not permitted" | Disallowed file extension | Upload only `.jpg`, `.png`, `.webp`, or `.pdf`. |
| 404 Not Found on Netlify when refreshing `/admin` or `/projects` | Missing redirect rules | Verify `public/_redirects` and `netlify.toml` are present in git repository. |

---

## 21. Backup & Recovery Considerations

1. **Automatic Supabase Backups:**
   - Pro and Team Supabase tiers perform automated daily backups.
   - For free-tier projects, periodically export database tables via Supabase Dashboard -> Table Editor -> Export to CSV, or use `pg_dump`.
2. **Offline Fallback Guarantee:**
   - The portfolio code contains built-in static fallbacks (`src/services/fallbackData.js`).
   - If Supabase ever experiences an outage or temporary connectivity issue, your public portfolio remains online and functional without displaying broken pages.
3. **Storage Asset Retention:**
   - All uploaded media files in Supabase Storage buckets (`projects`, `certifications`, `profile`, `resumes`, `services`) are independent of code deploys. Redeploying the frontend on Netlify will never delete your uploaded media.
