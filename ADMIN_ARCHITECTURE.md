# Portfolio Admin Panel Architecture (CMS)

**Document Version:** 1.0.0 (Prompt 2 Implementation)  
**Base Route:** `/admin`  
**Authentication Provider:** Supabase Native Auth  
**Target User:** Single Portfolio Administrator  

---

## 1. Overview & Core Principles

The Portfolio Administration Panel provides a private, password-protected management interface for creating, editing, reordering, publishing, and deleting portfolio content without modifying source code or committing to Git.

### Key Tenets:
1. **Isolated Administration Layout**: The admin area lives at `/admin/*` and renders its own responsive, sidebar-driven dark theme layout, completely isolated from public portfolio navigation and footers.
2. **Strict Single-Admin Access**: There is zero public self-registration, user creation, or invitation UI. Only the designated administrator who exists in both `auth.users` and `public.admin_users` can access CMS CRUD tools.
3. **Database-Level Authority**: Frontend route guards provide user experience flow (redirecting to login, showing loading spinners), but **PostgreSQL Row Level Security (RLS)** is the sole authoritative barrier preventing unauthorized reads or writes.
4. **Zero Impact on Public Portfolio**: The existing public portfolio pages continue reading their existing content models undisturbed. Migration of public views to the database takes place in Prompt 3.

---

## 2. Admin Route Hierarchy

All administrative routes are handled inside [`src/admin/AdminApp.js`](file:///Users/home/Documents/GitHub/portfolio/src/admin/AdminApp.js) using the project's existing React Router v6 setup:

| Route Path | View / Component | Access Level | Responsibilities |
|---|---|---|---|
| `/admin` | `<Dashboard />` | **Protected (Admin)** | Content overview, live counters (total & published), quick links to modules. Unauthenticated visitors see `<Login />`. |
| `/admin/profile` | `<ProfileAdmin />` | **Protected (Admin)** | Singleton form for developer identity, bio, hero greetings, typewriter titles, quote, and hobbies. |
| `/admin/projects` | `<ProjectsAdmin />` | **Protected (Admin)** | Collection CRUD for portfolio projects: table list, create/edit modal, reordering, published toggle, demo/GitHub links. |
| `/admin/experience` | `<ExperienceAdmin />` | **Protected (Admin)** | Career history timeline CRUD: company, role, date ranges, current status, and responsibilities. |
| `/admin/education` | `<EducationAdmin />` | **Protected (Admin)** | Academic credentials CRUD: degrees, universities, fields of study, graduation dates, and GPA. |
| `/admin/skills` | `<SkillsAdmin />` | **Protected (Admin)** | Categorized skills & tools CRUD: category tabs (`technical`, `tool`, `service`), `react-icons` identifiers, proficiency, ordering. |
| `/admin/services` | `<ServicesAdmin />` | **Protected (Admin)** | Freelance services CRUD: titles, descriptions, icon references, CTA links, and ordering. |
| `/admin/certifications`| `<CertificationsAdmin />` | **Protected (Admin)** | Certifications CRUD: titles, issuers, issue dates, verification links, thumbnail previews, PDF toggles. |
| `/admin/resume` | `<ResumeAdmin />` | **Protected (Admin)** | Resume metadata form: active CV title, document URL, version label, and active download toggle. |
| `/admin/contact` | `<ContactAdmin />` | **Protected (Admin)** | Direct contact info form (email, phone, WhatsApp, location) plus social media profiles CRUD. |
| `/admin/seo` | `<SeoAdmin />` | **Protected (Admin)** | Search engine optimization metadata editor with per-route selector (`global`, `/`, `/about`, `/project`, etc.). |
| `/admin/reset-password` | `<ResetPassword />` | **Public Recovery** | Native Supabase recovery screen allowing the admin to set a new password after clicking an email reset link. |

---

## 3. Authentication & Authorization Flow

```
                                  VISITOR ACCESSES /admin
                                            |
                                            v
                         +--------------------------------------+
                         |   src/admin/context/AuthContext.js   |
                         |      supabase.auth.getSession()      |
                         +--------------------------------------+
                                            |
                         +------------------+------------------+
                         |                                     |
                    No Session?                           Active Session?
                         |                                     |
                         v                                     v
               Render <Login /> View                 Query public.admin_users
          (Email, Password, Forgot PW)               WHERE user_id = auth.uid()
                         |                                     |
                         |                           +---------+---------+
                         |                           |                   |
                         |                      Role = 'admin'?      Not Admin?
                         |                           |                   |
                         v                           v                   v
             Call signInWithPassword()      Render Protected CMS    Render Access Denied
                         |                     <AdminLayout>         (No CMS Data Loaded)
                         |                           |
                         +---------------------------+
```

### 3.1 Authentication Details
- Handled in [`src/admin/context/AuthContext.js`](file:///Users/home/Documents/GitHub/portfolio/src/admin/context/AuthContext.js).
- Login identifier is the administrator's email address.
- Session persistence is handled natively by Supabase (`localStorage` auth tokens managed by `@supabase/supabase-js`; passwords and secrets are never stored).
- On page refresh, the session is restored asynchronously via `supabase.auth.getSession()`, keeping the administrator signed in.

### 3.2 Native Password Reset Flow
1. In `<Login />`, administrator clicks *"Forgot password?"*.
2. Administrator enters their email address and clicks *"Send Recovery Email"*.
3. Supabase triggers `supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/admin/reset-password` })`.
4. Administrator receives email and clicks the magic link.
5. Browser opens `/admin/reset-password#access_token=...&type=recovery`.
6. Supabase client detects the recovery hash and fires the `PASSWORD_RECOVERY` auth event.
7. Administrator submits their new password, executing `supabase.auth.updateUser({ password: newPassword })`.
8. Administrator is redirected to the active dashboard.

### 3.3 Authorization Verification (`is_admin()`)
- Frontend verification: Checks whether a record with `user_id = user.id` exists in `admin_users`. If not, renders the `<AccessDenied />` guard and refuses to mount CMS modules.
- Backend verification: All SQL mutations execute under PostgreSQL Row Level Security requiring `public.is_admin() = true`. Even if a malicious actor bypassed frontend code, Supabase PostgreSQL rejects all unauthorized writes with 403 Forbidden.

---

## 4. CMS Module Architecture

### 4.1 Reusable UI Patterns
- **Modals**: Collection entities use Bootstrap modal dialogs for clean creation and editing without navigating away from the list context.
- **Feedback Alerts**: [`ToastAlert.js`](file:///Users/home/Documents/GitHub/portfolio/src/admin/components/ToastAlert.js) displays instant green/red status notifications on all save, update, or error events.
- **Delete Confirmation**: [`ConfirmModal.js`](file:///Users/home/Documents/GitHub/portfolio/src/admin/components/ConfirmModal.js) prevents accidental data loss with an explicit confirmation step.
- **Live Status Toggles**: Single-click badges toggle `is_published` directly in list tables.

---

## 5. Security Summary & Guarantees

1. **No Service-Role Key**: Only `REACT_APP_SUPABASE_ANON_KEY` is referenced in the frontend client. The master `service_role` key does not exist anywhere in source code or client bundles.
2. **No Public Registration**: Public signups are turned off in Supabase Auth.
3. **No Client-Side Privilege Elevation**: The `admin_users` table is protected by RLS; users cannot add themselves to this table from the browser.
4. **No Password Storage**: Passwords are never stored in browser memory, state, or storage.

---

## 6. Manual Setup Required in Supabase Dashboard

To log in and use the Admin Panel:

1. **Populate `.env`**:
   Add your Supabase project URL and anon public key:
   ```bash
   REACT_APP_SUPABASE_URL=https://<your-project-ref>.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=<your-anon-key>
   ```
2. **Execute Database Scripts**:
   Ensure [`supabase/schema.sql`](file:///Users/home/Documents/GitHub/portfolio/supabase/schema.sql) and [`supabase/rls.sql`](file:///Users/home/Documents/GitHub/portfolio/supabase/rls.sql) have been run in the Supabase SQL Editor.
3. **Create Admin User in Supabase Auth**:
   Go to **Authentication -> Users**, click **Add user** -> **Create user**, enter email and password. Copy the created User UUID.
4. **Authorize in `admin_users`**:
   In the SQL Editor, execute:
   ```sql
   INSERT INTO public.admin_users (user_id, email, role)
   VALUES ('<COPIED_USER_UUID>', '<ADMIN_EMAIL>', 'admin');
   ```
5. **Configure Redirect URLs**:
   In **Authentication -> URL Configuration**, add `http://localhost:3000/admin/reset-password` (and your production domain) to **Redirect URLs**.

---

## 7. Roadmap: Next Steps in Prompt 3

- Connect public portfolio pages (`Home`, `Projects`, `About`, `Certificates`, `Services`, `Resume`, `ContactUs`) to query Supabase dynamic content.
- Implement graceful fallback: if Supabase is offline or not configured, public pages seamlessly fall back to their existing hardcoded data.
