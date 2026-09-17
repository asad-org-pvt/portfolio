# Supabase Backend & CMS Architecture

**Document Version:** 1.0.0 (Prompt 1 Foundation)  
**Target Application:** Dynamic Portfolio CMS  
**Database Engine:** PostgreSQL 15+ (Supabase)  
**Client SDK:** `@supabase/supabase-js` (^2.116.0)

---

## 1. Architectural Overview

This document defines the backend foundation for transitioning the portfolio from static hardcoded JSX to a dynamic, headless Content Management System powered by **Supabase**.

```
+-------------------------------------------------------------------------------+
|                                CLIENT APPLICATION                             |
|                                                                               |
|   +------------------------------------+   +-------------------------------+  |
|   |         PUBLIC PORTFOLIO           |   |       ADMIN CMS (/admin)      |  |
|   |   (Home, About, Projects, etc.)    |   |   (Auth & Content Management) |  |
|   +------------------------------------+   +-------------------------------+  |
|                     |                                     |                   |
|         Public Anon Query (Read)                Authenticated CRUD (Write)    |
|                     |                                     |                   |
|                     v                                     v                   |
|   +------------------------------------------------------------------------+  |
|   |                 src/lib/supabaseClient.js (Supabase Client)            |  |
|   |     Initialized with: REACT_APP_SUPABASE_URL & REACT_APP_SUPABASE_ANON |  |
|   +------------------------------------------------------------------------+  |
+-------------------------------------------------------------------------------+
                                      |
                                      v HTTPS / WSS
+-------------------------------------------------------------------------------+
|                              SUPABASE PLATFORM                                |
|                                                                               |
|   +-----------------------+ +-----------------------+ +--------------------+  |
|   |     SUPABASE AUTH     | |   POSTGRESQL DATABASE | |  SUPABASE STORAGE  |  |
|   |  - Native Email/Pass  | |   - 14 Relational     | |  - projects        |  |
|   |  - Native Reset Flow  | |     Tables            | |  - certifications  |  |
|   |  - No Public Signup   | |   - Row Level Sec.    | |  - resumes         |  |
|   |                       | |   - is_admin() Definer| |  - profile         |  |
|   +-----------------------+ +-----------------------+ +--------------------+  |
+-------------------------------------------------------------------------------+
```

---

## 2. Database Schema Design

The schema is organized into 14 relational tables in `public` schema. Complete SQL definitions reside in [`supabase/schema.sql`](./supabase/schema.sql).

### 2.1 Entity Relationship Summary

```
                      +------------------+
                      |   admin_users    |
                      +------------------+
                               |
                   references auth.users(id)

+---------------+      +------------------+      +---------------------+
|    profile    |      |  contact_info    |      |    social_links     |
+---------------+      +------------------+      +---------------------+

+---------------+ 1    M +------------------+
|   projects    |--------|  project_images  |
+---------------+        +------------------+
        | 1
        | M
+----------------------+ M      1 +-------------+
| project_technologies |----------|   skills    |
+----------------------+          +-------------+

+---------------+      +------------------+      +---------------------+
|   services    |      |  certifications  |      |       resume        |
+---------------+      +------------------+      +---------------------+

+---------------+      +------------------+      +---------------------+
|  experience   |      |    education     |      |    seo_settings     |
+---------------+      +------------------+      +---------------------+
```

### 2.2 Table Definitions

#### `admin_users`
Authorizes the single designated portfolio administrator.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> `auth.users(id)` ON DELETE CASCADE)
- `email` (TEXT)
- `role` (TEXT, default: `'admin'`)
- `created_at`, `updated_at` (TIMESTAMPTZ)

#### `profile`
Global developer profile, bio, hero introduction, and quotes.
- `id` (UUID, Primary Key)
- `full_name` (TEXT)
- `initials` (TEXT, default: `'AS'`)
- `hero_greeting` (TEXT, default: `'Hi There!'`)
- `hero_intro_title` (TEXT)
- `hero_intro_body` (TEXT)
- `rotating_titles` (JSONB, array of strings for typewriter effect)
- `about_heading` (TEXT)
- `about_body` (TEXT)
- `about_quote` (TEXT)
- `about_quote_author` (TEXT)
- `current_employer` (TEXT)
- `education_summary` (TEXT)
- `hobbies` (JSONB, array of strings)
- `avatar_url`, `hero_image_url`, `about_image_url`, `contact_image_url` (TEXT)
- `github_url`, `linkedin_url`, `email`, `phone`, `whatsapp` (TEXT)
- `github_username_main`, `github_username_alt` (TEXT)
- `is_published` (BOOLEAN, default: `true`)
- `created_at`, `updated_at` (TIMESTAMPTZ)

#### `skills`
Categorized developer skillsets, tools, and service capabilities.
- `id` (UUID, Primary Key)
- `name` (TEXT)
- `category` (TEXT, CHECK `category IN ('technical', 'tool', 'service')`)
- `icon_name` (TEXT, react-icons symbol name e.g. `'DiJavascript1'`)
- `icon_package` (TEXT, default: `'react-icons'`)
- `icon_url` (TEXT, optional custom uploaded icon)
- `proficiency_level` (INTEGER, 1–100)
- `display_order` (INTEGER, default: `0`)
- `is_published` (BOOLEAN, default: `true`)
- `created_at`, `updated_at` (TIMESTAMPTZ)

#### `projects`
Portfolio project showcase cards.
- `id` (UUID, Primary Key)
- `title` (TEXT)
- `slug` (TEXT, UNIQUE)
- `description` (TEXT)
- `demo_url` (TEXT)
- `github_url` (TEXT)
- `cover_image_url` (TEXT)
- `is_featured` (BOOLEAN, default: `false`)
- `display_order` (INTEGER, default: `0`)
- `is_published` (BOOLEAN, default: `true`)
- `created_at`, `updated_at` (TIMESTAMPTZ)

#### `project_images`
Multiple screenshots/media per project.
- `id` (UUID, Primary Key)
- `project_id` (UUID, Foreign Key -> `projects(id)` ON DELETE CASCADE)
- `image_url` (TEXT)
- `caption` (TEXT)
- `is_cover` (BOOLEAN, default: `false`)
- `display_order` (INTEGER, default: `0`)
- `created_at` (TIMESTAMPTZ)

#### `project_technologies`
Junction table linking projects to specific skills.
- `project_id` (UUID, Foreign Key -> `projects(id)` ON DELETE CASCADE)
- `skill_id` (UUID, Foreign Key -> `skills(id)` ON DELETE CASCADE)
- `PRIMARY KEY (project_id, skill_id)`

#### `services`
Freelance / consulting service offerings.
- `id` (UUID, Primary Key)
- `title` (TEXT)
- `description` (TEXT)
- `icon_url` (TEXT)
- `cta_label` (TEXT, default: `'Contact Us'`)
- `cta_link` (TEXT, default: `'/contact'`)
- `display_order` (INTEGER, default: `0`)
- `is_published` (BOOLEAN, default: `true`)
- `created_at`, `updated_at` (TIMESTAMPTZ)

#### `certifications`
Verified licenses and certifications.
- `id` (UUID, Primary Key)
- `title` (TEXT)
- `issuer` (TEXT)
- `issue_date` (DATE)
- `description` (TEXT)
- `credential_url` (TEXT)
- `credential_id` (TEXT)
- `thumbnail_url` (TEXT, preview image)
- `file_url` (TEXT, high-res credential or PDF link)
- `is_pdf` (BOOLEAN, default: `false`)
- `display_order` (INTEGER, default: `0`)
- `is_published` (BOOLEAN, default: `true`)
- `created_at`, `updated_at` (TIMESTAMPTZ)

#### `experience`
Professional career experience timeline.
- `id` (UUID, Primary Key)
- `position` (TEXT)
- `company` (TEXT)
- `location` (TEXT)
- `start_date` (DATE)
- `end_date` (DATE)
- `is_current` (BOOLEAN, default: `false`)
- `description` (TEXT)
- `technologies` (TEXT[])
- `display_order` (INTEGER, default: `0`)
- `is_published` (BOOLEAN, default: `true`)
- `created_at`, `updated_at` (TIMESTAMPTZ)

#### `education`
Academic degrees and institutional credentials.
- `id` (UUID, Primary Key)
- `institution` (TEXT)
- `degree` (TEXT)
- `field_of_study` (TEXT)
- `location` (TEXT)
- `start_date`, `end_date` (DATE)
- `is_current` (BOOLEAN, default: `false`)
- `grade_or_gpa` (TEXT)
- `description` (TEXT)
- `display_order` (INTEGER, default: `0`)
- `is_published` (BOOLEAN, default: `true`)
- `created_at`, `updated_at` (TIMESTAMPTZ)

#### `resume`
Active CV document metadata and download link.
- `id` (UUID, Primary Key)
- `title` (TEXT, default: `'Asad_Resume.pdf'`)
- `file_url` (TEXT)
- `version_label` (TEXT)
- `is_active` (BOOLEAN, default: `true`)
- `created_at`, `updated_at` (TIMESTAMPTZ)

#### `contact_info` & `social_links`
Direct communication details and external social links.
- `contact_info`: `email`, `phone`, `whatsapp`, `location`, `is_published`
- `social_links`: `platform`, `url`, `icon_name`, `display_order`, `is_published`

#### `seo_settings`
Page-level and global search engine metadata.
- `id` (UUID, Primary Key)
- `page_route` (TEXT, UNIQUE, e.g. `'global'`, `'/'`, `'/project'`)
- `title`, `meta_description`, `keywords` (TEXT)
- `og_title`, `og_description`, `og_image_url` (TEXT)
- `twitter_card` (TEXT, default: `'summary_large_image'`)
- `canonical_url` (TEXT)
- `created_at`, `updated_at` (TIMESTAMPTZ)

---

## 3. Storage Buckets Architecture

Four public buckets are defined in [`supabase/storage.sql`](./supabase/storage.sql):

| Bucket Name | Allowed MIME Types | File Size Limit | Usage / Purpose |
|---|---|---|---|
| `projects` | `image/png`, `image/jpeg`, `image/webp`, `image/gif`, `image/svg+xml` | 10 MB | Project screenshots, cover images, multi-image gallery assets |
| `certifications` | `image/png`, `image/jpeg`, `image/webp`, `application/pdf` | 15 MB | Certificate preview thumbnails and verification PDFs |
| `resumes` | `application/pdf` | 10 MB | Downloadable CV PDF documents |
| `profile` | `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml` | 10 MB | Developer avatar, hero graphics, service icons |

---

## 4. Authentication & Admin Authorization Strategy

### 4.1 Native Authentication
- **Mechanism**: Supabase native email and password authentication (`supabase.auth.signInWithPassword`).
- **No Public Signup**: User self-registration is disabled in Supabase Project Settings. Only the single administrator user account exists.
- **Native Password Reset**: Forgot-password recovery is handled via `supabase.auth.resetPasswordForEmail()` which sends a secure native magic link to the administrator's email, redirecting to the password reset view.
- **Frontend Security**: No service-role key is ever bundled or exposed in React. Only the public `anon` key is used.

### 4.2 Admin Authorization Engine (`is_admin()`)
To ensure that an arbitrary authenticated user cannot grant themselves administrative privileges:
1. An internal table `public.admin_users` maps `auth.users.id` to an admin role.
2. A PostgreSQL function with `SECURITY DEFINER` is created:
   ```sql
   CREATE OR REPLACE FUNCTION public.is_admin()
   RETURNS BOOLEAN
   LANGUAGE sql
   SECURITY DEFINER
   SET search_path = public
   STABLE
   AS $$
     SELECT EXISTS (
       SELECT 1 FROM public.admin_users
       WHERE user_id = auth.uid()
     );
   $$;
   ```
3. All write operations (`INSERT`, `UPDATE`, `DELETE`) across all CMS tables and storage buckets require `public.is_admin() = true`.
4. RLS prevents any user from inserting records into `admin_users` unless they are already an authorized admin.

---

## 5. Row Level Security (RLS) Strategy

Row Level Security is enabled on 100% of CMS tables and storage objects. Complete policies are defined in [`supabase/rls.sql`](./supabase/rls.sql).

### 5.1 Public Read Rules
- Unauthenticated visitors have read-only (`SELECT`) access to rows where:
  - `is_published = true` (Profile, Skills, Projects, Services, Certifications, Experience, Education, Contact Info, Social Links)
  - `is_active = true` (Resume)
  - `true` (SEO Settings)
  - Parent project `is_published = true` (Project Images, Project Technologies)
- Drafts and disabled items remain completely invisible to public API requests.

### 5.2 Admin Access Rules
- Authenticated users whose `auth.uid()` matches `admin_users` via `public.is_admin()` have full CRUD (`ALL`) permissions on:
  - All public tables (including unpublished drafts)
  - All media buckets in Supabase Storage (`storage.objects`)

---

## 6. Environment Variables

Defined in `.env.example`:

```bash
# Supabase Public Client Configuration
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key-here
```

### Security Boundary:
- `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` are safe for client-side inclusion because database access is enforced at the database level by PostgreSQL RLS.
- The Supabase **service-role key** (`SUPABASE_SERVICE_ROLE_KEY`) bypasses all RLS policies and must **NEVER** be placed in React source code or client `.env` files.

---

## 7. Manual Configuration Steps in Supabase Dashboard

The following one-time steps must be completed in the Supabase Dashboard:

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com) and create a new project.
2. **Execute Database Scripts**:
   - Open the **SQL Editor** in the Supabase Dashboard.
   - Copy and run [`supabase/schema.sql`](./supabase/schema.sql) (creates tables, functions, triggers, and seed data).
   - Copy and run [`supabase/rls.sql`](./supabase/rls.sql) (enables RLS and binds security policies).
   - Copy and run [`supabase/storage.sql`](./supabase/storage.sql) (creates storage buckets and storage RLS policies).
3. **Disable Public Signups**:
   - Navigate to **Authentication -> Providers -> Email**.
   - Ensure "Enable Email provider" is checked.
   - Turn OFF "Allow new users to sign up" (preventing any public registration).
4. **Create Administrator Account**:
   - In **Authentication -> Users**, click **Add user** -> **Create user**.
   - Enter your administrator email and a strong password.
   - Copy the newly created user's `UID` (UUID).
5. **Register Admin in `admin_users` Table**:
   - In the **SQL Editor**, run:
     ```sql
     INSERT INTO public.admin_users (user_id, email, role)
     VALUES ('<COPIED_USER_UUID>', '<ADMIN_EMAIL>', 'admin');
     ```
6. **Configure Password Reset Redirect URL**:
   - In **Authentication -> URL Configuration**, set:
     - **Site URL**: `https://your-domain.com` (or `http://localhost:3000` for development).
     - **Redirect URLs**: Add `http://localhost:3000/admin/reset-password` and your production admin URL.
7. **Populate `.env`**:
   - Copy Project URL and Anon API key from **Project Settings -> API** into `.env`.

---

## 8. Roadmap: Later Prompts

- **Prompt 2**: Public Data Layer Integration (Create custom query hooks / data fetching services to load published content from Supabase with graceful fallback to existing hardcoded data).
- **Prompt 3**: Admin Authentication & Protected Route Foundation (Build `/admin/login`, session handling, password reset flow, and admin layout wrapper).
- **Prompt 4**: CMS Management Dashboard & CRUD Modules (Build admin management screens for Profile, Projects, Certifications, Skills, Services, Resume, and Media uploads).
- **Prompt 5**: End-to-End Verification, Asset Migration, and Production Readiness.
