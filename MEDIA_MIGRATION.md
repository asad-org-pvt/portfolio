# Portfolio Media Migration & Storage Architecture

**Document Version:** 1.0.0 (Prompt 4 Implementation)  
**Target System:** Supabase Storage & Content Seeding  
**Status:** Completed & Validated

---

## 1. Storage Buckets Configuration

In accordance with [`supabase/storage.sql`](./supabase/storage.sql), four dedicated Supabase Storage buckets manage portfolio media assets:

| Bucket Name | Public Access | Max File Size | Permitted MIME Types | Purpose |
| :--- | :---: | :---: | :--- | :--- |
| `projects` | **Yes** | 10 MB | `image/png`, `image/jpeg`, `image/webp`, `image/gif`, `image/svg+xml` | Project cover images & screenshots |
| `certifications` | **Yes** | 15 MB | `image/png`, `image/jpeg`, `image/webp`, `application/pdf` | Certificate credentials & documents |
| `resumes` | **Yes** | 10 MB | `application/pdf` | Active Curriculum Vitae documents |
| `profile` | **Yes** | 10 MB | `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml` | Avatars, hero graphics, service icons |

---

## 2. Storage Folder Structure & Deterministic Pathing

Files are organized in predictable, collision-safe directory trees:

```
projects/
└── covers/
    └── {entityId}/{timestamp}-{sanitizedFilename}.png

certifications/
├── thumbnails/
│   └── {entityId}/{timestamp}-{sanitizedFilename}.webp
└── documents/
    └── {entityId}/{timestamp}-{sanitizedFilename}.pdf

resumes/
└── documents/
    └── {entityId}/{timestamp}-{sanitizedFilename}.pdf

profile/
├── avatars/
│   └── {timestamp}-avatar.svg
├── heros/
│   └── {timestamp}-hero.svg
├── about/
│   └── {timestamp}-about.png
├── contact/
│   └── {timestamp}-contact.png
└── services/
    └── {timestamp}-{serviceSlug}.png
```

### Filename Sanitization
All filenames uploaded through `uploadPortfolioFile()` or `scripts/seed.js` pass through `sanitizeFilename()`:
- Strips directory traversal sequences (`../`, `..\`)
- Converts slashes and dangerous characters (`:`, `*`, `?`, `"`, `<`, `>`, `|`) to underscores
- Collapses consecutive underscores
- Blocks malicious executable extensions (`.exe`, `.sh`, `.bat`, `.cmd`, `.js`, `.php`, `.vbs`)

---

## 3. Storage Security & Row Level Security (RLS)

Storage security enforces strict segregation between public viewers and the administrator:

1. **Public Read (SELECT)**:
   - Enabled for all 4 buckets (`projects`, `certifications`, `resumes`, `profile`) via `Public media access for portfolio buckets` policy on `storage.objects`.
   - Public visitors can fetch assets directly via Supabase CDN URLs.
2. **Admin Upload (INSERT)**:
   - Restricted to `authenticated` users who satisfy `public.is_admin()`.
   - Unauthenticated visitors cannot upload media files.
3. **Admin Replace & Delete (UPDATE & DELETE)**:
   - Restricted to `authenticated` users who satisfy `public.is_admin()`.
   - Protects against unauthorized file modification or deletion.
4. **Zero Frontend Secrets**:
   - Client code in `src/services/storageService.js` and `src/admin/components/FileUpload.js` exclusively uses the anonymous Supabase client (`REACT_APP_SUPABASE_ANON_KEY`).
   - The `service_role` secret is never exposed to browser bundles.

---

## 4. Admin Upload UI Components

A reusable React component, [`FileUpload.js`](file:///Users/home/Documents/GitHub/portfolio/src/admin/components/FileUpload.js), is integrated into the following administration screens:

- **Project Admin (`ProjectsAdmin.js`)**:
  - Live project cover image preview
  - One-click file replacement and clearing
  - Client-side size & format validation
- **Certification Admin (`CertificationsAdmin.js`)**:
  - Thumbnail uploader for fast grid previews
  - Original PDF document uploader
  - Auto-detection of `.pdf` extension setting `is_pdf = true`
- **Profile Admin (`ProfileAdmin.js`)**:
  - Avatar image uploader (supports SVG, PNG, WebP)
  - Hero illustration graphic uploader
  - About section and Contact section illustration uploaders
- **Resume Admin (`ResumeAdmin.js`)**:
  - PDF document uploader with badge preview and new-tab preview link
- **Services Admin (`ServicesAdmin.js`)**:
  - Service icon uploader directly to `profile/services` folder

---

## 5. Local Media Migration & Assets Identified

The following local binary assets from `src/Assets/` have been mapped for remote Supabase Storage hosting:

| Asset Path | File Type | Original Size | Destination Bucket & Path |
| :--- | :---: | :---: | :--- |
| `src/Assets/Projects/confidant.png` | PNG | 5.01 MB | `projects/covers/confidant.png` |
| `src/Assets/Projects/klaims.png` | PNG | 2.62 MB | `projects/covers/klaims.png` |
| `src/Assets/Projects/bulletproofinbox.png` | PNG | 618 KB | `projects/covers/bulletproofinbox.png` |
| `src/Assets/Projects/manifestnotify.png` | PNG | 822 KB | `projects/covers/manifestnotify.png` |
| `src/Assets/Projects/wellsnsiesmic.png` | PNG | 246 KB | `projects/covers/wellsnsiesmic.png` |
| `src/Assets/Projects/makman.png` | PNG | 63 KB | `projects/covers/makman.png` |
| `src/Assets/frontend_developer_react.pdf` | PDF | 7.68 MB | `certifications/documents/frontend_developer_react.pdf` |
| `src/Assets/js_intermediate.pdf` | PDF | 7.68 MB | `certifications/documents/js_intermediate.pdf` |
| `src/Assets/se.pdf` | PDF | 7.68 MB | `certifications/documents/se.pdf` |
| `src/Assets/Asad_Resume.pdf` | PDF | 365 KB | `resumes/documents/Asad_Resume.pdf` |
| `src/Assets/avatar.svg` | SVG | 13 KB | `profile/avatars/avatar.svg` |
| `src/Assets/home-main.svg` | SVG | 110 KB | `profile/heros/home-main.svg` |
| `src/Assets/about.png` | PNG | 107 KB | `profile/about/about.png` |
| `src/Assets/contact.png` | PNG | 224 KB | `profile/contact/contact.png` |
| `src/Assets/fee.webp` | WebP | 54 KB | `profile/services/fee.webp` |
| `src/Assets/be.png` | PNG | 38 KB | `profile/services/be.png` |
| `src/Assets/md.png` | PNG | 32 KB | `profile/services/md.png` |
| `src/Assets/consult.png` | PNG | 52 KB | `profile/services/consult.png` |

---

## 6. Seeding Strategy & Database Upserts

Two complementary seeding mechanisms are implemented:

### Mechanism A: In-App Admin One-Click Seeding
On `/admin` Dashboard (`src/admin/pages/Dashboard.js`), an admin notification banner appears whenever tables are unpopulated:
- Click **"Seed Initial Portfolio"**
- Invokes `seedPortfolioData(supabase)` from `src/services/seedService.js` using the administrator's active session.
- Uses fixed deterministic UUIDs and `onConflict: "id"` / `onConflict: "page_route"`.
- **Completely Idempotent**: Safe to run repeatedly without creating duplicates.

### Mechanism B: CLI Script (`scripts/seed.js`)
Can be executed locally via:
```bash
npm run seed
# or
node scripts/seed.js
```
- Reads `REACT_APP_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` / `REACT_APP_SUPABASE_ANON_KEY` from `.env`.
- Uploads local files to Supabase Storage and seeds tables with public storage CDN URLs.

### Seeded Tables Summary
- `profile`: 1 record (Full name, bio, rotating titles, social handles, quote)
- `contact_info`: 1 record (Email, phone, whatsapp, location)
- `social_links`: 2 records (GitHub, LinkedIn)
- `projects`: 6 records (Confidant, Klaim, Bulletproof, Manifest, Wells & Seismic, Makman)
- `skills`: 37 records (13 technical, 9 tools, 15 service skills)
- `services`: 4 records (Frontend, Backend, Mobile, Consulting)
- `certifications`: 6 records (3 HackerRank, 2 Coursera GCP, 1 Credly)
- `resume`: 1 active record (`Asad_Resume.pdf`)
- `experience`: 1 record (Stella Technology)
- `education`: 1 record (Sukkur IBA University)
- `seo_settings`: 8 records (`global`, `/`, `/about`, `/project`, `/services`, `/certificates`, `/resume`, `/contact`)

---

## 7. Known Limitations & What Remains for Prompt 5

- **Automated Thumbnail Generation**: Generating image thumbnails from multi-page PDFs in pure client-side JavaScript without WebAssembly / Canvas dependencies is constrained. Administrators should upload lightweight WebP/PNG thumbnails for certificate cards alongside the PDF document.
- **Production Storage Bucket Creation**: If Supabase project has not yet created the storage buckets, the SQL in `supabase/storage.sql` must be run once in the Supabase SQL Editor.
- **Prompt 5 Focus**: Final verification, production readiness review, cleanup of unused legacy artifacts, and end-to-end CMS documentation.
