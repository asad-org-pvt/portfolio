# Asad Sarwar - Portfolio & CMS

A dynamic, full-stack developer portfolio built with React and powered by Supabase. Features a modern public showcase with a secured administration panel (`/admin`) for managing content, projects, certifications, skills, and media without modifying source code.

---

## Architecture Overview

- **Frontend:** React (Create React App), React Router v6, React Bootstrap
- **Backend & Database:** Supabase (PostgreSQL with Row Level Security)
- **Authentication:** Supabase Auth (Email & Password with native recovery)
- **Media Storage:** Supabase Storage (Dedicated public buckets with mime-type & size validation)
- **Hosting:** Netlify (with SPA deep-link routing configuration)
- **Resilience:** Built-in offline fallback architecture ensuring 100% public uptime

---

## Quick Start

### 1. Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Supabase project account (free tier compatible)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/asad-org-pvt/portfolio.git
cd portfolio
npm install
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Populate `.env.local` with your public Supabase credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Note:** Only public anon credentials belong in the frontend environment. Never add `SUPABASE_SERVICE_ROLE_KEY` to client-facing `.env` files.

### 4. Running Locally

Start the local development server:

```bash
npm start
```

The application will open at `http://localhost:3000`.

### 5. Production Build

Create an optimized production bundle:

```bash
npm run build
```

---

## Supabase & Database Setup

1. **Database Schema & RLS:**
   Execute the following SQL scripts in the Supabase SQL Editor:
   - `supabase/schema.sql` - Core schema, constraints, and indexes
   - `supabase/rls.sql` - Row Level Security policies (Public read-only, Admin full-access)
   - `supabase/storage.sql` - Storage buckets and upload security policies

2. **Create Admin User:**
   - Create a user in Supabase Auth (**Authentication -> Users**).
   - Authorize the user in PostgreSQL:
     ```sql
     INSERT INTO public.admin_users (user_id, email, is_active)
     VALUES ('YOUR_USER_UUID', 'your-email@example.com', true);
     ```

3. **URL Configuration:**
   In Supabase Dashboard -> **Authentication -> URL Configuration**, set:
   - **Site URL:** `https://your-portfolio.netlify.app`
   - **Redirect URLs:** `https://your-portfolio.netlify.app/admin/reset-password` (and `http://localhost:3000/admin/reset-password` for local testing).

---

## Content Seeding

To populate the database with initial portfolio data:

### Option A: Via Browser (Recommended)
Log in to `/admin` as the administrator and click **Seed Initial Portfolio** on the dashboard.

### Option B: Via Command Line (Headless / CI)
```bash
export REACT_APP_SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-secret-service-role-key"

npm run seed
```

---

## Administration Portal

The administration portal is located at:
```
/admin
```

For complete instructions on managing content, uploading media, updating SEO settings, and administering the system, see [ADMIN_HANDOVER.md](ADMIN_HANDOVER.md).

---

## Technical Documentation

- [SUPABASE_ARCHITECTURE.md](SUPABASE_ARCHITECTURE.md) - Database schema, RLS policies, and functions
- [ADMIN_ARCHITECTURE.md](ADMIN_ARCHITECTURE.md) - CMS routing, authentication, and state management
- [PUBLIC_DATA_ARCHITECTURE.md](PUBLIC_DATA_ARCHITECTURE.md) - Public data hooks, icon resolution, and fallback mechanism
- [MEDIA_MIGRATION.md](MEDIA_MIGRATION.md) - Storage buckets, file validation, and asset migration
- [ADMIN_HANDOVER.md](ADMIN_HANDOVER.md) - Administrator guide and operational manual

---

## License

This project is open source and available under the [MIT License](LICENSE).
