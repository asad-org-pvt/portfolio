import {
  FALLBACK_PROFILE,
  FALLBACK_PROJECTS,
  FALLBACK_SKILLS,
  FALLBACK_SERVICES,
  FALLBACK_CERTIFICATIONS,
  FALLBACK_RESUME,
  FALLBACK_CONTACT,
  FALLBACK_SOCIAL_LINKS,
  FALLBACK_EXPERIENCE,
  FALLBACK_EDUCATION,
  FALLBACK_SEO,
} from "./fallbackData";

/**
 * Deterministic Seeding Service
 *
 * Populates all 11 Supabase portfolio tables with default content from fallbackData.js.
 * Uses deterministic UUIDs and onConflict upserts so that running it multiple times
 * updates records without creating duplicates.
 */

// Deterministic UUIDs for idempotent upserts
export const SEED_IDS = {
  profile: "00000000-0000-0000-0000-000000000001",
  contact: "00000000-0000-0000-0000-000000000002",
  resume: "00000000-0000-0000-0000-000000000003",
  projects: [
    "10000000-0000-0000-0000-000000000001",
    "10000000-0000-0000-0000-000000000002",
    "10000000-0000-0000-0000-000000000003",
    "10000000-0000-0000-0000-000000000004",
    "10000000-0000-0000-0000-000000000005",
    "10000000-0000-0000-0000-000000000006",
  ],
  services: [
    "20000000-0000-0000-0000-000000000001",
    "20000000-0000-0000-0000-000000000002",
    "20000000-0000-0000-0000-000000000003",
    "20000000-0000-0000-0000-000000000004",
  ],
  certifications: [
    "30000000-0000-0000-0000-000000000001",
    "30000000-0000-0000-0000-000000000002",
    "30000000-0000-0000-0000-000000000003",
    "30000000-0000-0000-0000-000000000004",
    "30000000-0000-0000-0000-000000000005",
    "30000000-0000-0000-0000-000000000006",
  ],
  experience: ["40000000-0000-0000-0000-000000000001"],
  education: ["50000000-0000-0000-0000-000000000001"],
  socialLinks: [
    "60000000-0000-0000-0000-000000000001",
    "60000000-0000-0000-0000-000000000002",
  ],
};

export async function seedPortfolioData(supabaseClient) {
  if (!supabaseClient) {
    throw new Error("Supabase client is required for seeding.");
  }

  const results = {
    profile: false,
    contact: false,
    resume: false,
    projects: 0,
    skills: 0,
    services: 0,
    certifications: 0,
    experience: 0,
    education: 0,
    socialLinks: 0,
    seo: 0,
  };

  // 1. Profile
  const profileRecord = {
    id: SEED_IDS.profile,
    full_name: FALLBACK_PROFILE.full_name,
    initials: FALLBACK_PROFILE.initials,
    hero_greeting: FALLBACK_PROFILE.hero_greeting,
    hero_intro_title: FALLBACK_PROFILE.hero_intro_title,
    hero_intro_body: FALLBACK_PROFILE.hero_intro_body,
    rotating_titles: FALLBACK_PROFILE.rotating_titles,
    about_heading: FALLBACK_PROFILE.about_heading,
    about_body: FALLBACK_PROFILE.about_body,
    about_quote: FALLBACK_PROFILE.about_quote,
    about_quote_author: FALLBACK_PROFILE.about_quote_author,
    current_employer: FALLBACK_PROFILE.current_employer,
    education_summary: FALLBACK_PROFILE.education_summary,
    hobbies: FALLBACK_PROFILE.hobbies,
    avatar_url: FALLBACK_PROFILE.avatar_url,
    hero_image_url: FALLBACK_PROFILE.hero_image_url,
    about_image_url: FALLBACK_PROFILE.about_image_url,
    contact_image_url: FALLBACK_PROFILE.contact_image_url,
    github_url: FALLBACK_PROFILE.github_url,
    linkedin_url: FALLBACK_PROFILE.linkedin_url,
    email: FALLBACK_PROFILE.email,
    phone: FALLBACK_PROFILE.phone,
    whatsapp: FALLBACK_PROFILE.whatsapp,
    github_username_main: FALLBACK_PROFILE.github_username_main,
    github_username_alt: FALLBACK_PROFILE.github_username_alt,
    is_published: true,
  };

  const { error: profErr } = await supabaseClient
    .from("profile")
    .upsert(profileRecord, { onConflict: "id" });
  if (profErr) throw new Error(`Failed to seed profile: ${profErr.message}`);
  results.profile = true;

  // 2. Contact Info
  const contactRecord = {
    id: SEED_IDS.contact,
    email: FALLBACK_CONTACT.email,
    phone: FALLBACK_CONTACT.phone,
    whatsapp: FALLBACK_CONTACT.whatsapp,
    location: FALLBACK_CONTACT.location,
    is_published: true,
  };
  const { error: cErr } = await supabaseClient
    .from("contact_info")
    .upsert(contactRecord, { onConflict: "id" });
  if (cErr) throw new Error(`Failed to seed contact_info: ${cErr.message}`);
  results.contact = true;

  // 3. Social Links
  const socialRecords = FALLBACK_SOCIAL_LINKS.map((link, idx) => ({
    id: SEED_IDS.socialLinks[idx] || `60000000-0000-0000-0000-00000000000${idx + 1}`,
    platform: link.platform,
    url: link.url,
    icon_name: link.icon_name,
    display_order: link.display_order || idx + 1,
    is_published: true,
  }));
  const { error: sErr } = await supabaseClient
    .from("social_links")
    .upsert(socialRecords, { onConflict: "id" });
  if (sErr) throw new Error(`Failed to seed social_links: ${sErr.message}`);
  results.socialLinks = socialRecords.length;

  // 4. Projects
  const projectSlugs = [
    "confidant-health",
    "klaims",
    "bulletproof-inbox",
    "manifest-notify",
    "wells-and-seismic",
    "makman",
  ];
  const projectRecords = FALLBACK_PROJECTS.map((proj, idx) => ({
    id: SEED_IDS.projects[idx],
    title: proj.title,
    slug: projectSlugs[idx] || proj.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description: proj.description,
    demo_url: proj.demo_url,
    github_url: proj.github_url,
    cover_image_url: proj.cover_image_url,
    is_featured: proj.is_featured,
    display_order: proj.display_order,
    is_published: true,
  }));
  const { error: pErr } = await supabaseClient
    .from("projects")
    .upsert(projectRecords, { onConflict: "id" });
  if (pErr) throw new Error(`Failed to seed projects: ${pErr.message}`);
  results.projects = projectRecords.length;

  // 5. Skills
  const skillRecords = FALLBACK_SKILLS.map((skill, idx) => {
    // Generate deterministic UUID for each skill
    const hexIdx = (idx + 1).toString().padStart(4, "0");
    return {
      id: `70000000-0000-0000-0000-00000000${hexIdx}`,
      name: skill.name,
      category: skill.category,
      icon_name: skill.icon_name,
      display_order: skill.display_order,
      is_published: true,
    };
  });
  const { error: skErr } = await supabaseClient
    .from("skills")
    .upsert(skillRecords, { onConflict: "id" });
  if (skErr) throw new Error(`Failed to seed skills: ${skErr.message}`);
  results.skills = skillRecords.length;

  // 6. Services
  const serviceRecords = FALLBACK_SERVICES.map((srv, idx) => ({
    id: SEED_IDS.services[idx],
    title: srv.title,
    description: srv.description,
    icon_url: srv.icon_url,
    cta_label: srv.cta_label,
    cta_link: srv.cta_link,
    display_order: srv.display_order,
    is_published: true,
  }));
  const { error: srvErr } = await supabaseClient
    .from("services")
    .upsert(serviceRecords, { onConflict: "id" });
  if (srvErr) throw new Error(`Failed to seed services: ${srvErr.message}`);
  results.services = serviceRecords.length;

  // 7. Certifications
  const certRecords = FALLBACK_CERTIFICATIONS.map((cert, idx) => ({
    id: SEED_IDS.certifications[idx],
    title: cert.title,
    issuer: cert.issuer,
    description: cert.description,
    credential_url: cert.credential_url,
    thumbnail_url: cert.thumbnail_url,
    file_url: cert.file_url,
    is_pdf: cert.is_pdf,
    display_order: cert.display_order,
    is_published: true,
  }));
  const { error: certErr } = await supabaseClient
    .from("certifications")
    .upsert(certRecords, { onConflict: "id" });
  if (certErr) throw new Error(`Failed to seed certifications: ${certErr.message}`);
  results.certifications = certRecords.length;

  // 8. Resume
  const resumeRecord = {
    id: SEED_IDS.resume,
    title: FALLBACK_RESUME.title,
    file_url: FALLBACK_RESUME.file_url,
    version_label: FALLBACK_RESUME.version_label,
    is_active: true,
  };
  const { error: rErr } = await supabaseClient
    .from("resume")
    .upsert(resumeRecord, { onConflict: "id" });
  if (rErr) throw new Error(`Failed to seed resume: ${rErr.message}`);
  results.resume = true;

  // 9. Experience
  const expRecords = FALLBACK_EXPERIENCE.map((exp, idx) => ({
    id: SEED_IDS.experience[idx] || `40000000-0000-0000-0000-00000000000${idx + 1}`,
    position: exp.position,
    company: exp.company,
    location: exp.location,
    start_date: exp.start_date,
    end_date: exp.end_date,
    is_current: exp.is_current,
    description: exp.description,
    technologies: exp.technologies,
    display_order: exp.display_order,
    is_published: true,
  }));
  const { error: expErr } = await supabaseClient
    .from("experience")
    .upsert(expRecords, { onConflict: "id" });
  if (expErr) throw new Error(`Failed to seed experience: ${expErr.message}`);
  results.experience = expRecords.length;

  // 10. Education
  const eduRecords = FALLBACK_EDUCATION.map((edu, idx) => ({
    id: SEED_IDS.education[idx] || `50000000-0000-0000-0000-00000000000${idx + 1}`,
    institution: edu.institution,
    degree: edu.degree,
    field_of_study: edu.field_of_study,
    start_date: edu.start_date,
    end_date: edu.end_date,
    is_current: edu.is_current,
    description: edu.description,
    display_order: edu.display_order,
    is_published: true,
  }));
  const { error: eduErr } = await supabaseClient
    .from("education")
    .upsert(eduRecords, { onConflict: "id" });
  if (eduErr) throw new Error(`Failed to seed education: ${eduErr.message}`);
  results.education = eduRecords.length;

  // 11. SEO Settings
  const seoRoutes = [
    { route: "global", title: FALLBACK_SEO.title, desc: FALLBACK_SEO.meta_description },
    { route: "/", title: "Asad Sarwar | Software Developer", desc: "Welcome to Asad Sarwar's portfolio. Software engineer specializing in modern web & mobile technologies." },
    { route: "/about", title: "About Me | Asad Sarwar", desc: "Learn more about Asad Sarwar, full-stack engineer and software developer." },
    { route: "/project", title: "Projects | Asad Sarwar", desc: "Showcase of recent software projects and commercial solutions built by Asad Sarwar." },
    { route: "/services", title: "Services | Asad Sarwar", desc: "Freelance web and mobile engineering services offered by Asad Sarwar." },
    { route: "/certificates", title: "Certifications | Asad Sarwar", desc: "Professional credentials and certifications earned by Asad Sarwar." },
    { route: "/resume", title: "Resume | Asad Sarwar", desc: "Download and view the latest curriculum vitae of Asad Sarwar." },
    { route: "/contact", title: "Contact | Asad Sarwar", desc: "Get in touch with Asad Sarwar for software development and consulting inquiries." },
  ];

  const seoRecords = seoRoutes.map((s) => ({
    page_route: s.route,
    title: s.title,
    meta_description: s.desc,
    keywords: "software engineer, react developer, full stack developer, asad sarwar",
    canonical_url: `https://asadsarwar.com${s.route === "global" ? "" : s.route}`,
  }));

  const { error: seoErr } = await supabaseClient
    .from("seo_settings")
    .upsert(seoRecords, { onConflict: "page_route" });
  if (seoErr) throw new Error(`Failed to seed seo_settings: ${seoErr.message}`);
  results.seo = seoRecords.length;

  return results;
}
