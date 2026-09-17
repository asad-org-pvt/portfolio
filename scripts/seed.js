#!/usr/bin/env node

/**
 * CLI Migration & Seeding Script: Supabase Portfolio CMS
 *
 * Usage:
 *   node scripts/seed.js
 *
 * Reads REACT_APP_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or REACT_APP_SUPABASE_ANON_KEY
 * from environment or local .env file.
 *
 * 1. Uploads local portfolio assets (project covers, certs, resume, avatars) to Supabase Storage.
 * 2. Seeds all 11 database tables with deterministic, idempotent records.
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// 1. Simple .env parser to avoid requiring external packages
function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    content.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [k, ...v] = trimmed.split("=");
        const key = k.trim();
        const val = v.join("=").trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project-ref")) {
  console.error("\n❌ Error: Missing valid Supabase environment variables.");
  console.error("Please configure REACT_APP_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or REACT_APP_SUPABASE_ANON_KEY) in .env or environment.\n");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// Assets to migrate to Supabase Storage
const ASSETS_TO_MIGRATE = [
  // Projects
  { localPath: "src/Assets/Projects/confidant.png", bucket: "projects", storagePath: "covers/confidant.png", mime: "image/png" },
  { localPath: "src/Assets/Projects/klaims.png", bucket: "projects", storagePath: "covers/klaims.png", mime: "image/png" },
  { localPath: "src/Assets/Projects/bulletproofinbox.png", bucket: "projects", storagePath: "covers/bulletproofinbox.png", mime: "image/png" },
  { localPath: "src/Assets/Projects/manifestnotify.png", bucket: "projects", storagePath: "covers/manifestnotify.png", mime: "image/png" },
  { localPath: "src/Assets/Projects/wellsnsiesmic.png", bucket: "projects", storagePath: "covers/wellsnsiesmic.png", mime: "image/png" },
  { localPath: "src/Assets/Projects/makman.png", bucket: "projects", storagePath: "covers/makman.png", mime: "image/png" },

  // Certifications
  { localPath: "src/Assets/frontend_developer_react.pdf", bucket: "certifications", storagePath: "documents/frontend_developer_react.pdf", mime: "application/pdf" },
  { localPath: "src/Assets/js_intermediate.pdf", bucket: "certifications", storagePath: "documents/js_intermediate.pdf", mime: "application/pdf" },
  { localPath: "src/Assets/se.pdf", bucket: "certifications", storagePath: "documents/se.pdf", mime: "application/pdf" },

  // Resume
  { localPath: "src/Assets/Asad_Resume.pdf", bucket: "resumes", storagePath: "documents/Asad_Resume.pdf", mime: "application/pdf" },

  // Profile & graphics
  { localPath: "src/Assets/avatar.svg", bucket: "profile", storagePath: "avatars/avatar.svg", mime: "image/svg+xml" },
  { localPath: "src/Assets/home-main.svg", bucket: "profile", storagePath: "heros/home-main.svg", mime: "image/svg+xml" },
  { localPath: "src/Assets/about.png", bucket: "profile", storagePath: "about/about.png", mime: "image/png" },
  { localPath: "src/Assets/contact.png", bucket: "profile", storagePath: "contact/contact.png", mime: "image/png" },
  { localPath: "src/Assets/fee.webp", bucket: "profile", storagePath: "services/fee.webp", mime: "image/webp" },
  { localPath: "src/Assets/be.png", bucket: "profile", storagePath: "services/be.png", mime: "image/png" },
  { localPath: "src/Assets/md.png", bucket: "profile", storagePath: "services/md.png", mime: "image/png" },
  { localPath: "src/Assets/consult.png", bucket: "profile", storagePath: "services/consult.png", mime: "image/png" },
];

async function uploadLocalAssets() {
  console.log("📦 1. Uploading local portfolio assets to Supabase Storage...");
  const uploadedUrls = {};

  for (const item of ASSETS_TO_MIGRATE) {
    const fullPath = path.resolve(__dirname, "..", item.localPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`  ⚠️ File not found: ${item.localPath}, skipping.`);
      continue;
    }

    try {
      const fileBuffer = fs.readFileSync(fullPath);
      const { error } = await supabase.storage
        .from(item.bucket)
        .upload(item.storagePath, fileBuffer, {
          contentType: item.mime,
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.warn(`  ⚠️ Storage upload warning for ${item.storagePath}: ${error.message}`);
      } else {
        const { data } = supabase.storage.from(item.bucket).getPublicUrl(item.storagePath);
        uploadedUrls[item.localPath] = data.publicUrl;
        console.log(`  ✅ Uploaded: ${item.storagePath} -> ${data.publicUrl}`);
      }
    } catch (err) {
      console.warn(`  ⚠️ Exception uploading ${item.localPath}:`, err.message);
    }
  }

  return uploadedUrls;
}

async function seedDatabase(cdnUrls) {
  console.log("\n🌱 2. Seeding database tables with portfolio records...");

  // Helpers to resolve CDN URL or fallback
  const getUrl = (local, fallback) => cdnUrls[local] || fallback;

  // 1. Profile
  const profile = {
    id: "00000000-0000-0000-0000-000000000001",
    full_name: "Asad Sarwar",
    initials: "AS",
    hero_greeting: "Hi There!",
    hero_intro_title: "LET ME INTRODUCE MYSELF",
    hero_intro_body:
      "I fell in love with programming and I have at least learnt something, I think… 🤷‍♂️ I am fluent in Javascript and Typescript. My field of Interest's are building new Web Technologies and Products. Whenever possible, I also apply my passion for developing products with Node.js and Modern Javascript Library and Frameworks like React.js, Angular and Next.js.",
    rotating_titles: [
      "Software Developer",
      "Freelancer",
      "MERN Stack Developer",
      "MEAN Stack Developer",
      "React Native Developer",
      "Android/IOS Developer",
    ],
    about_heading: "Know Who I'M",
    about_body:
      "Hi Everyone, I am Asad Sarwar from Pakistan. I am currently employed as a Software Engineer at Stella Technology. I have completed BS Software Engineering from the Sukkur IBA University.",
    about_quote: "Strive to build things that make a difference!",
    about_quote_author: "Asad",
    current_employer: "Stella Technology",
    education_summary: "BS Software Engineering from the Sukkur IBA University",
    hobbies: ["Travelling", "Watching Movies", "Reading Ancient History"],
    avatar_url: getUrl("src/Assets/avatar.svg", null),
    hero_image_url: getUrl("src/Assets/home-main.svg", null),
    about_image_url: getUrl("src/Assets/about.png", null),
    contact_image_url: getUrl("src/Assets/contact.png", null),
    github_url: "https://github.com/asadsarwar1",
    linkedin_url: "https://www.linkedin.com/in/itsasadsarwar/",
    email: "notasadsarwar@gmail.com",
    phone: "+92-313-6100930",
    whatsapp: "+92-313-6100930",
    github_username_main: "asadsarwar1",
    github_username_alt: "asarwar-tes",
    is_published: true,
  };
  const { error: profErr } = await supabase.from("profile").upsert(profile, { onConflict: "id" });
  if (profErr) console.warn("  ⚠️ Profile seed warning:", profErr.message);
  else console.log("  ✅ Seeded: profile");

  // 2. Contact info
  const contact = {
    id: "00000000-0000-0000-0000-000000000002",
    email: "notasadsarwar@gmail.com",
    phone: "+92-313-6100930",
    whatsapp: "+92-313-6100930",
    location: "Pakistan",
    is_published: true,
  };
  await supabase.from("contact_info").upsert(contact, { onConflict: "id" });
  console.log("  ✅ Seeded: contact_info");

  // 3. Social links
  const socials = [
    { id: "60000000-0000-0000-0000-000000000001", platform: "github", url: "https://github.com/asadsarwar1", icon_name: "AiFillGithub", display_order: 1, is_published: true },
    { id: "60000000-0000-0000-0000-000000000002", platform: "linkedin", url: "https://www.linkedin.com/in/itsasadsarwar/", icon_name: "FaLinkedinIn", display_order: 2, is_published: true },
  ];
  await supabase.from("social_links").upsert(socials, { onConflict: "id" });
  console.log("  ✅ Seeded: social_links (2 records)");

  // 4. Projects
  const projects = [
    {
      id: "10000000-0000-0000-0000-000000000001",
      title: "Confidant Health",
      slug: "confidant-health",
      description: "Confidant Health is both a tech platform and a network of top-notch behavioral health providers. We’re a virtual health system specializing in mental health and addiction. We combine cutting edge tech with great caregivers to help people thrive.",
      demo_url: "https://confidanthealth.com/",
      github_url: null,
      cover_image_url: getUrl("src/Assets/Projects/confidant.png", null),
      is_featured: true,
      display_order: 1,
      is_published: true,
    },
    {
      id: "10000000-0000-0000-0000-000000000002",
      title: "Klaims",
      slug: "klaims",
      description: "Klaim is an award-winning fintech company based in UAE. Since 2019, we’ve been revolutionizing the healthcare industry by giving providers access to the working capital they need to grow faster and serve patients better. Our solutions are already trusted by more than 40 healthcare providers, and so far we’ve accelerated 300,000 claims and paid out 100 million AED in purchased claims",
      demo_url: "https://www.klaim.ai/",
      github_url: null,
      cover_image_url: getUrl("src/Assets/Projects/klaims.png", null),
      is_featured: false,
      display_order: 2,
      is_published: true,
    },
    {
      id: "10000000-0000-0000-0000-000000000003",
      title: "Bulletproof Inbox",
      slug: "bulletproof-inbox",
      description: "Bulletproof turns your open-access inbox into a permission-based one. Stop emails from unknown senders before they arrive in your inbox. It works with Gmail and Outlook.",
      demo_url: "https://www.bulletproofinbox.com/",
      github_url: null,
      cover_image_url: getUrl("src/Assets/Projects/bulletproofinbox.png", null),
      is_featured: false,
      display_order: 3,
      is_published: true,
    },
    {
      id: "10000000-0000-0000-0000-000000000004",
      title: "Manifest Notify",
      slug: "manifest-notify",
      description: "MX Notify is a powerful, customizable tool that updates clinicians and other care providers moments after their patients are seen in the emergency department or are discharged from a hospital",
      demo_url: "https://www.manifestmedex.org/solutions/mx-notify/",
      github_url: null,
      cover_image_url: getUrl("src/Assets/Projects/manifestnotify.png", null),
      is_featured: false,
      display_order: 4,
      is_published: true,
    },
    {
      id: "10000000-0000-0000-0000-000000000005",
      title: "Wells and Siesmic",
      slug: "wells-and-seismic",
      description: "Wells and Siesmic is an online data management and reporting tool for wells, siesmic and related data from Oman, Turkey and more. Data can also be exported and shared in many standards and formates.",
      demo_url: "https://was.demo.omanbidround.com",
      github_url: null,
      cover_image_url: getUrl("src/Assets/Projects/wellsnsiesmic.png", null),
      is_featured: false,
      display_order: 5,
      is_published: true,
    },
    {
      id: "10000000-0000-0000-0000-000000000006",
      title: "Makman",
      slug: "makman",
      description: "Makman is an online open data market place, where you can access free data of wells and siesmic from Oman, Turkey and more. Data can also be purchased from there.",
      demo_url: "https://makman.om/",
      github_url: null,
      cover_image_url: getUrl("src/Assets/Projects/makman.png", null),
      is_featured: false,
      display_order: 6,
      is_published: true,
    },
  ];
  await supabase.from("projects").upsert(projects, { onConflict: "id" });
  console.log("  ✅ Seeded: projects (6 records)");

  // 5. Skills
  const rawSkills = [
    { name: "JavaScript", category: "technical", icon_name: "DiJavascript1", display_order: 1 },
    { name: "React.js", category: "technical", icon_name: "DiReact", display_order: 2 },
    { name: "Android", category: "technical", icon_name: "DiAndroid", display_order: 3 },
    { name: "Apple", category: "technical", icon_name: "DiApple", display_order: 4 },
    { name: "Node.js", category: "technical", icon_name: "DiNodejs", display_order: 5 },
    { name: "Angular", category: "technical", icon_name: "DiAngularSimple", display_order: 6 },
    { name: "MongoDB", category: "technical", icon_name: "DiMongodb", display_order: 7 },
    { name: "Firebase", category: "technical", icon_name: "SiFirebase", display_order: 8 },
    { name: "MySQL", category: "technical", icon_name: "DiMysql", display_order: 9 },
    { name: "Next.js", category: "technical", icon_name: "SiNextdotjs", display_order: 10 },
    { name: "HTML5", category: "technical", icon_name: "DiHtml5", display_order: 11 },
    { name: "CSS3", category: "technical", icon_name: "DiCss3", display_order: 12 },
    { name: "Bootstrap", category: "technical", icon_name: "DiBootstrap", display_order: 13 },
    { name: "macOS", category: "tool", icon_name: "SiMacos", display_order: 1 },
    { name: "Xcode", category: "tool", icon_name: "SiXcode", display_order: 2 },
    { name: "Android Studio", category: "tool", icon_name: "SiAndroidstudio", display_order: 3 },
    { name: "VS Code", category: "tool", icon_name: "SiVisualstudiocode", display_order: 4 },
    { name: "Postman", category: "tool", icon_name: "SiPostman", display_order: 5 },
    { name: "Slack", category: "tool", icon_name: "SiSlack", display_order: 6 },
    { name: "Vercel", category: "tool", icon_name: "SiVercel", display_order: 7 },
    { name: "GitHub", category: "tool", icon_name: "DiGithub", display_order: 8 },
    { name: "Jira", category: "tool", icon_name: "DiJira", display_order: 9 },
    { name: "JavaScript", category: "service", icon_name: "DiJavascript1", display_order: 1 },
    { name: "React.js", category: "service", icon_name: "DiReact", display_order: 2 },
    { name: "Express.js", category: "service", icon_name: "SiExpress", display_order: 3 },
    { name: "Android", category: "service", icon_name: "DiAndroid", display_order: 4 },
    { name: "Apple", category: "service", icon_name: "DiApple", display_order: 5 },
    { name: "Node.js", category: "service", icon_name: "DiNodejs", display_order: 6 },
    { name: "Angular", category: "service", icon_name: "DiAngularSimple", display_order: 7 },
    { name: "MongoDB", category: "service", icon_name: "DiMongodb", display_order: 8 },
    { name: "Firebase", category: "service", icon_name: "SiFirebase", display_order: 9 },
    { name: "MySQL", category: "service", icon_name: "DiMysql", display_order: 10 },
    { name: "Next.js", category: "service", icon_name: "SiNextdotjs", display_order: 11 },
    { name: "HTML5", category: "service", icon_name: "DiHtml5", display_order: 12 },
    { name: "CSS3", category: "service", icon_name: "DiCss3", display_order: 13 },
    { name: "Bootstrap", category: "service", icon_name: "DiBootstrap", display_order: 14 },
    { name: "AWS", category: "service", icon_name: "SiAmazonaws", display_order: 15 },
  ];

  const skillRecords = rawSkills.map((s, idx) => ({
    id: `70000000-0000-0000-0000-00000000${(idx + 1).toString().padStart(4, "0")}`,
    name: s.name,
    category: s.category,
    icon_name: s.icon_name,
    display_order: s.display_order,
    is_published: true,
  }));
  await supabase.from("skills").upsert(skillRecords, { onConflict: "id" });
  console.log(`  ✅ Seeded: skills (${skillRecords.length} records)`);

  // 6. Services
  const services = [
    {
      id: "20000000-0000-0000-0000-000000000001",
      title: "Frontend Development",
      description: "We have a team of experienced frontend developers who are proficient in React.js, Angular, and Next.js. We can build scalable and responsive web applications for you.",
      icon_url: getUrl("src/Assets/fee.webp", null),
      cta_label: "Contact Us",
      cta_link: "/contact",
      display_order: 1,
      is_published: true,
    },
    {
      id: "20000000-0000-0000-0000-000000000002",
      title: "Backend Development",
      description: "We have a team of experienced backend developers who are proficient in Node.js, Express.js, and MongoDB. We can build scalable and secure backend for your web and mobile applications.",
      icon_url: getUrl("src/Assets/be.png", null),
      cta_label: "Contact Us",
      cta_link: "/contact",
      display_order: 2,
      is_published: true,
    },
    {
      id: "20000000-0000-0000-0000-000000000003",
      title: "Mobile Application Development",
      description: "We have a team of experienced React Native developers. We can build cross-platform mobile applications for you. Including the ability to build/publish mobile applications for both iOS and Android on App Store and Play Store.",
      icon_url: getUrl("src/Assets/md.png", null),
      cta_label: "Contact Us",
      cta_link: "/contact",
      display_order: 3,
      is_published: true,
    },
    {
      id: "20000000-0000-0000-0000-000000000004",
      title: "Consultation Services",
      description: "We provide consultation services for your web and mobile applications. We can help you with the architecture of your application, the technology stack, and the best practices to follow.",
      icon_url: getUrl("src/Assets/consult.png", null),
      cta_label: "Contact Us",
      cta_link: "/contact",
      display_order: 4,
      is_published: true,
    },
  ];
  await supabase.from("services").upsert(services, { onConflict: "id" });
  console.log("  ✅ Seeded: services (4 records)");

  // 7. Certifications
  const certs = [
    {
      id: "30000000-0000-0000-0000-000000000001",
      title: "Frontend Developer (React) Certificate",
      issuer: "HackerRank",
      description: "Awarded by HackerRank for successfully completing the Frontend Developer (React) Certificate. The certificate verifies that the recipient has successfully completed the Frontend Developer (React) Certificate.",
      credential_url: "https://www.hackerrank.com/certificates/c81d69157c24",
      file_url: getUrl("src/Assets/frontend_developer_react.pdf", null),
      thumbnail_url: null,
      is_pdf: true,
      display_order: 1,
      is_published: true,
    },
    {
      id: "30000000-0000-0000-0000-000000000002",
      title: "Software Engineer Certificate",
      issuer: "HackerRank",
      description: "Awarded by HackerRank for successfully completing the Software Engineer Certificate. The certificate verifies that the recipient has successfully completed the Software Engineer Certificate.",
      credential_url: "https://www.hackerrank.com/certificates/56fb13932891",
      file_url: getUrl("src/Assets/se.pdf", null),
      thumbnail_url: null,
      is_pdf: true,
      display_order: 2,
      is_published: true,
    },
    {
      id: "30000000-0000-0000-0000-000000000003",
      title: "JavaScript (Intermediate) Certificate",
      issuer: "HackerRank",
      description: "Awarded by HackerRank for successfully completing the JavaScript (Intermediate) Certificate. The certificate verifies that the recipient has successfully completed the JavaScript (Intermediate) Certificate.",
      credential_url: "https://www.hackerrank.com/certificates/7c5552aeb986",
      file_url: getUrl("src/Assets/js_intermediate.pdf", null),
      thumbnail_url: null,
      is_pdf: true,
      display_order: 3,
      is_published: true,
    },
    {
      id: "30000000-0000-0000-0000-000000000004",
      title: "GCP: Core Infrastructure",
      issuer: "Google & Coursera",
      description: "Awarded by Google & Coursera for successfully completing the Google Cloud Platform Fundamentals: Core Infrastructure. The certificate verifies that the recipient has successfully completed the Google Cloud Platform Fundamentals: Core Infrastructure.",
      credential_url: "https://www.coursera.org/account/accomplishments/verify/GMTR8AY2YPRP?utm_source=mobile&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course",
      thumbnail_url: "https://s3.amazonaws.com/coursera_assets/meta_images/generated/CERTIFICATE_LANDING_PAGE/CERTIFICATE_LANDING_PAGE~GMTR8AY2YPRP/CERTIFICATE_LANDING_PAGE~GMTR8AY2YPRP.jpeg",
      file_url: null,
      is_pdf: false,
      display_order: 4,
      is_published: true,
    },
    {
      id: "30000000-0000-0000-0000-000000000005",
      title: "Google IT Support Certificate",
      issuer: "Google & Coursera / Credly",
      description: "Awarded by Google & Coursera and authorized by Credly for successfully completing the Google IT Support Certificate. The certificate verifies that the recipient has successfully completed the Google IT Support Certificate.",
      credential_url: "https://www.credly.com/badges/b73c48de-d683-4d48-8f92-09fc59235554/linked_in_profile",
      thumbnail_url: "https://images.credly.com/size/680x680/images/ae2f5bae-b110-4ea1-8e26-77cf5f76c81e/GCC_badge_IT_Support_1000x1000.png",
      file_url: null,
      is_pdf: false,
      display_order: 5,
      is_published: true,
    },
    {
      id: "30000000-0000-0000-0000-000000000006",
      title: "Getting Started With Application Development: GCP",
      issuer: "Google & Coursera",
      description: "Awarded by Google & Coursera for successfully completing the Getting Started With Application Development: GCP. The certificate verifies that the recipient has successfully completed the Getting Started With Application Development: GCP.",
      credential_url: "https://www.coursera.org/account/accomplishments/verify/SX6KPVQHKM29?utm_source=mobile&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course",
      thumbnail_url: "https://s3.amazonaws.com/coursera_assets/meta_images/generated/CERTIFICATE_LANDING_PAGE/CERTIFICATE_LANDING_PAGE~SX6KPVQHKM29/CERTIFICATE_LANDING_PAGE~SX6KPVQHKM29.jpeg",
      file_url: null,
      is_pdf: false,
      display_order: 6,
      is_published: true,
    },
  ];
  await supabase.from("certifications").upsert(certs, { onConflict: "id" });
  console.log("  ✅ Seeded: certifications (6 records)");

  // 8. Resume
  const resume = {
    id: "00000000-0000-0000-0000-000000000003",
    title: "Asad_Resume.pdf",
    file_url: getUrl("src/Assets/Asad_Resume.pdf", null),
    version_label: "v1.0",
    is_active: true,
  };
  await supabase.from("resume").upsert(resume, { onConflict: "id" });
  console.log("  ✅ Seeded: resume (1 active document)");

  // 9. Experience
  const exp = [
    {
      id: "40000000-0000-0000-0000-000000000001",
      position: "Software Engineer",
      company: "Stella Technology",
      location: "Pakistan",
      start_date: "2022-01-01",
      end_date: null,
      is_current: true,
      description: "Full stack web and mobile development specializing in modern JavaScript/TypeScript, React, Node.js, and healthcare software solutions.",
      technologies: ["React", "Node.js", "TypeScript", "MongoDB"],
      display_order: 1,
      is_published: true,
    },
  ];
  await supabase.from("experience").upsert(exp, { onConflict: "id" });
  console.log("  ✅ Seeded: experience (1 record)");

  // 10. Education
  const edu = [
    {
      id: "50000000-0000-0000-0000-000000000001",
      institution: "Sukkur IBA University",
      degree: "Bachelor of Science (BS)",
      field_of_study: "Software Engineering",
      start_date: "2018-08-01",
      end_date: "2022-06-30",
      is_current: false,
      description: "BS Software Engineering from Sukkur IBA University.",
      display_order: 1,
      is_published: true,
    },
  ];
  await supabase.from("education").upsert(edu, { onConflict: "id" });
  console.log("  ✅ Seeded: education (1 record)");

  // 11. SEO Settings
  const seoRoutes = [
    { route: "global", title: "Asad Sarwar | Portfolio", desc: "Self Developed personal website built with React.js" },
    { route: "/", title: "Asad Sarwar | Software Developer", desc: "Welcome to Asad Sarwar's portfolio. Software engineer specializing in modern web & mobile technologies." },
    { route: "/about", title: "About Me | Asad Sarwar", desc: "Learn more about Asad Sarwar, full-stack engineer and software developer." },
    { route: "/project", title: "Projects | Asad Sarwar", desc: "Showcase of recent software projects and commercial solutions built by Asad Sarwar." },
    { route: "/services", title: "Services | Asad Sarwar", desc: "Freelance web and mobile engineering services offered by Asad Sarwar." },
    { route: "/certificates", title: "Certifications | Asad Sarwar", desc: "Professional credentials and certifications earned by Asad Sarwar." },
    { route: "/resume", title: "Resume | Asad Sarwar", desc: "Download and view the latest curriculum vitae of Asad Sarwar." },
    { route: "/contact", title: "Contact | Asad Sarwar", desc: "Get in touch with Asad Sarwar for software development and consulting inquiries." },
  ];
  const seo = seoRoutes.map((s) => ({
    page_route: s.route,
    title: s.title,
    meta_description: s.desc,
    keywords: "software engineer, react developer, full stack developer, asad sarwar",
    canonical_url: `https://asadsarwar.com${s.route === "global" ? "" : s.route}`,
  }));
  await supabase.from("seo_settings").upsert(seo, { onConflict: "page_route" });
  console.log("  ✅ Seeded: seo_settings (8 routes)");

  console.log("\n🎉 Seeding completed successfully! All tables populated with idempotent records.\n");
}

async function run() {
  try {
    const cdnUrls = await uploadLocalAssets();
    await seedDatabase(cdnUrls);
  } catch (err) {
    console.error("\n❌ Seeding failed:", err);
    process.exit(1);
  }
}

run();
