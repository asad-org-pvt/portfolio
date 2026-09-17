# Public Data Architecture: Supabase Integration & Fallback Strategy

This document describes the public data architecture implemented in **Implementation Prompt 3**, migrating the public portfolio from hardcoded JSX/data to Supabase-backed content with a zero-disruption fallback strategy.

---

## 1. Architectural Overview & Data Flow

The public portfolio operates on a dual-tier architecture:

```
                    ┌─────────────────────────┐
                    │     Supabase Cloud      │
                    │  (PostgreSQL Database)  │
                    └────────────┬────────────┘
                                 │
                         Published Content
                       (is_published = true)
                                 │
                                 v
┌─────────────────────────────────────────────────────────────┐
│                      React Portfolio                        │
│                                                             │
│   useProfile, useProjects, useSkills, useServices, etc.    │
│                                │                            │
│           ┌────────────────────┴────────────────────┐       │
│           ▼                                         ▼       │
│  [Supabase Record Present]            [Error / Offline /    │
│                                       Empty / Loading]      │
│           │                                         │       │
│           ▼                                         ▼       │
│   Dynamic Content                      Bundled Fallback     │
│   (Rendered Seamlessly)                (Preserved Assets)   │
└─────────────────────────────────────────────────────────────┘
```

The Administrator modifies content via `/admin` (built in Prompt 2). The public website dynamically fetches the latest published records without requiring code redeployments.

---

## 2. Zero-Blank Fallback Strategy

A critical requirement is that the public portfolio **never flashes blank or breaks**, even if:
1. Supabase credentials are not yet configured in `.env`
2. Supabase backend is unreachable or experiencing downtime
3. The database tables exist but contain 0 records
4. Network queries fail or time out
5. A remote media URL is null or invalid

### Fallback Implementation Pattern
Every custom hook initializes its React state **synchronously** with fallback constants imported from `src/services/fallbackData.js`:

```javascript
export function useProjects() {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [isFromSupabase, setIsFromSupabase] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const data = await fetchPublishedProjects();
      if (isMounted) {
        if (data && data.length > 0) {
          setProjects(data);
          setIsFromSupabase(true);
        }
        setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  return { projects, loading, isFromSupabase };
}
```

**Benefits**:
- **Zero initial layout shift (CLS)**: Initial render renders the fallback content instantly.
- **Zero global loading screen**: The public preloader duration remains at its original 1200ms.
- **Graceful degradation**: If Supabase returns empty arrays or network errors, state remains on fallback data.
- **No duplicate content**: Rendered arrays replace the fallback cleanly without appending or duplicating.

---

## 3. Data Access Layer: Services and Hooks

All Supabase operations are encapsulated in `src/services/portfolioService.js` and exposed to UI components via custom hooks in `src/hooks/`:

| Hook | Backing Table | Filter Criteria | Fallback Constant | Public Section |
| :--- | :--- | :--- | :--- | :--- |
| `useProfile` | `profile` | `is_published = true` | `FALLBACK_PROFILE` | Hero (`Home.js`), Intro (`Home2.js`), About (`AboutCard.js`), Footer |
| `useProjects` | `projects` | `is_published = true`, order by `display_order` | `FALLBACK_PROJECTS` | Projects (`Projects.js`, `ProjectCards.js`) |
| `useSkills(cat)` | `skills` | `is_published = true`, `category = ?`, order by `display_order` | `FALLBACK_SKILLS` | Skillset (`Techstack.js`), Tools (`Toolstack.js`), Services (`TechstackInService.js`) |
| `useServices` | `services` | `is_published = true`, order by `display_order` | `FALLBACK_SERVICES` | Services (`Services.js`, `ServiceCards.js`) |
| `useCertifications` | `certifications` | `is_published = true`, order by `display_order` | `FALLBACK_CERTIFICATIONS` | Certifications (`Certificates.js`, `CertificateCards.js`) |
| `useResume` | `resume` | `is_active = true`, order by `created_at desc` | `FALLBACK_RESUME` | Resume (`ResumeNew.js`) |
| `useContact` | `contact_info`, `social_links` | `is_published = true` | `FALLBACK_CONTACT`, `FALLBACK_SOCIAL_LINKS` | Contact (`ContactUs.js`), Footer (`Footer.js`), Social Links (`Home2.js`) |
| `useExperience` | `experience` | `is_published = true`, order by `display_order` | `FALLBACK_EXPERIENCE` | Timeline & Bio (`AboutCard.js`) |
| `useEducation` | `education` | `is_published = true`, order by `display_order` | `FALLBACK_EDUCATION` | Education summary (`AboutCard.js`) |
| `useSeo` | `seo_settings` | `page_route = ?` with `global` fallback | `FALLBACK_SEO` | Document `<title>` and `<meta name="description">` across all routes |

---

## 4. Icon Resolution System (`iconResolver.js`)

In Supabase, icons are stored as strings (e.g., `'DiJavascript1'`, `'SiNextdotjs'`, `'FaLinkedinIn'`, or HTTP/S image URLs).

`src/services/iconResolver.js` provides:
1. **Dynamic lookup** across `react-icons` icon packs (`di`, `si`, `fa`, `ai`, `cg`, `bs`, `im`, `fi`).
2. **Image URL support**: Automatically renders `<img />` if the icon string starts with `http://`, `https://`, `/`, or `data:`.
3. **Safe fallback**: If an icon identifier cannot be resolved or is null, renders a standard code icon (`<FiCode />`) instead of crashing the UI.

---

## 5. Security & RLS Compliance

- **No Secret Keys**: Frontend code and bundled assets use **only** the anonymous public key (`REACT_APP_SUPABASE_ANON_KEY`).
- **No Service Role**: The `service_role` key is never referenced, loaded, or exposed in any client-side JavaScript.
- **Row Level Security (RLS)**: Public queries strictly honor RLS policies established in Prompt 1:
  - `anon` role has `SELECT` permission exclusively where `is_published = true` or `is_active = true`.
  - Unauthenticated clients cannot view draft or unpublished records.
  - Write, update, and delete access require an authenticated Supabase admin session.

---

## 6. Public Sections Migrated

1. **Hero / Profile (`Home.js` & `Type.js`)**:
   - Dynamic greeting, full name, and typewriter rotating titles.
   - Dynamic hero image with local SVG fallback.
2. **Intro & Socials (`Home2.js`)**:
   - Custom bio text when updated in CMS; preserves original rich formatted JSX with highlights when using default fallback.
   - Dynamic social media links and avatar image.
3. **About (`About.js` & `AboutCard.js`)**:
   - About bio, current employer, education summary, hobbies array, and quote.
4. **Skills & Tools (`Techstack.js`, `Toolstack.js`, `TechstackInService.js`)**:
   - Technical skills (`category = 'technical'`).
   - Tools (`category = 'tool'`).
   - Available services skillset (`category = 'service'`).
5. **Projects (`Projects.js`)**:
   - Projects list ordered by `display_order` and filtered by `is_published`.
   - Title, description, demo URL, GitHub URL, and cover image.
6. **Services (`Services.js`)**:
   - Services list with title, description, icon, and dynamic CTA label/link.
7. **Certifications (`Certificates.js`)**:
   - Dynamic certifications list supporting PDF view and image preview.
8. **Resume (`ResumeNew.js`)**:
   - Active resume PDF download and inline viewer via `useResume`.
9. **Contact & Social Links (`ContactUs.js` & `Footer.js`)**:
   - Dynamic email, phone, WhatsApp, LinkedIn, and dynamic footer copyright.
10. **SEO / Meta (`useSeo.js`)**:
    - Dynamically synchronizes document `<title>` and `<meta name="description">` per page route (`/`, `/about`, `/project`, `/services`, `/certificates`, `/resume`, `/contact`).

---

## 7. Known Limitations & What Remains for Prompt 4

- **Media Uploads**: Binary assets (PDFs, project screenshots, avatar images) are currently referenced via URLs. Uploading new files directly to Supabase Storage buckets (`portfolio-media`, `resumes`, `certificates`) from `/admin` is scheduled for **Prompt 4**.
- **Media Migration**: Existing local assets in `src/Assets/` serve as the immediate fallback; automated bucket uploading and CDN URL migration will be handled in **Prompt 4**.
- **Public Contact Form Submission**: As required by prompt specifications, no backend submission endpoint was invented because the original site did not have an active backend form handler.
