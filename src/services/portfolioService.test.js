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
import { renderIcon } from "./iconResolver";
import * as portfolioService from "./portfolioService";

describe("Fallback Data Integrity", () => {
  test("FALLBACK_PROFILE contains essential hero and about fields", () => {
    expect(FALLBACK_PROFILE.full_name).toBe("Asad Sarwar");
    expect(FALLBACK_PROFILE.initials).toBe("AS");
    expect(FALLBACK_PROFILE.rotating_titles.length).toBeGreaterThan(0);
    expect(FALLBACK_PROFILE.email).toBeDefined();
  });

  test("FALLBACK_PROJECTS contains 6 default projects", () => {
    expect(FALLBACK_PROJECTS.length).toBe(6);
    FALLBACK_PROJECTS.forEach((p) => {
      expect(p.title).toBeDefined();
      expect(p.description).toBeDefined();
      expect(p.is_published).toBe(true);
    });
  });

  test("FALLBACK_SKILLS contains technical, tool, and service categories", () => {
    const categories = new Set(FALLBACK_SKILLS.map((s) => s.category));
    expect(categories.has("technical")).toBe(true);
    expect(categories.has("tool")).toBe(true);
    expect(categories.has("service")).toBe(true);
  });

  test("FALLBACK_SERVICES contains 4 service entries", () => {
    expect(FALLBACK_SERVICES.length).toBe(4);
    FALLBACK_SERVICES.forEach((s) => {
      expect(s.title).toBeDefined();
      expect(s.description).toBeDefined();
    });
  });

  test("FALLBACK_CERTIFICATIONS contains 6 certifications", () => {
    expect(FALLBACK_CERTIFICATIONS.length).toBe(6);
  });

  test("FALLBACK_RESUME contains file reference", () => {
    expect(FALLBACK_RESUME.file_url).toBeDefined();
    expect(FALLBACK_RESUME.is_active).toBe(true);
  });

  test("FALLBACK_CONTACT and FALLBACK_SOCIAL_LINKS are populated", () => {
    expect(FALLBACK_CONTACT.email).toBe("notasadsarwar@gmail.com");
    expect(FALLBACK_SOCIAL_LINKS.length).toBeGreaterThanOrEqual(2);
  });

  test("FALLBACK_EXPERIENCE and FALLBACK_EDUCATION have records", () => {
    expect(FALLBACK_EXPERIENCE.length).toBeGreaterThan(0);
    expect(FALLBACK_EDUCATION.length).toBeGreaterThan(0);
  });

  test("FALLBACK_SEO provides title and description", () => {
    expect(FALLBACK_SEO.title).toContain("Asad Sarwar");
    expect(FALLBACK_SEO.meta_description).toBeDefined();
  });
});

describe("Icon Resolver", () => {
  test("renders fallback icon for unknown or empty icon names", () => {
    const icon1 = renderIcon(null);
    expect(icon1).toBeDefined();

    const icon2 = renderIcon("NonExistentIconXYZ");
    expect(icon2).toBeDefined();
  });

  test("renders valid React icon for known icon identifier", () => {
    const icon = renderIcon("DiReact");
    expect(icon).toBeDefined();
  });

  test("renders img element for URL icon source", () => {
    const icon = renderIcon("https://example.com/icon.png");
    expect(icon).toBeDefined();
    expect(icon.type).toBe("img");
    expect(icon.props.src).toBe("https://example.com/icon.png");
  });
});

describe("Public Portfolio Service Safety", () => {
  test("fetchPublishedProfile safely returns data or null when unconfigured", async () => {
    const res = await portfolioService.fetchPublishedProfile();
    // In test environment without valid credentials, should return null safely without throwing
    expect(res === null || typeof res === "object").toBe(true);
  });

  test("fetchPublishedProjects safely returns array or null without throwing", async () => {
    const res = await portfolioService.fetchPublishedProjects();
    expect(res === null || Array.isArray(res)).toBe(true);
  });
});

describe("Storage Service Validation & Sanitization", () => {
  const {
    validateFile,
    sanitizeFilename,
    extractStoragePath,
  } = require("./storageService");

  test("sanitizeFilename removes directory traversal and illegal characters", () => {
    expect(sanitizeFilename("../../malicious/file.png")).toBe("malicious_file.png");
    expect(sanitizeFilename("My Test File (1).PDF")).toBe("my_test_file_1_.pdf");
    expect(sanitizeFilename("hello-world_2026.webp")).toBe("hello-world_2026.webp");
  });

  test("validateFile blocks dangerous file extensions", () => {
    const dangerousFile = { name: "exploit.exe", size: 1024, type: "application/x-msdownload" };
    expect(() => validateFile(dangerousFile, "projects")).toThrow(/not permitted for security reasons/);
  });

  test("validateFile blocks oversized files", () => {
    const hugeImage = { name: "huge.png", size: 15 * 1024 * 1024, type: "image/png" };
    expect(() => validateFile(hugeImage, "projects")).toThrow(/exceeds the 10MB limit/);
  });

  test("validateFile validates mime type correctly", () => {
    const validImage = { name: "photo.jpg", size: 500 * 1024, type: "image/jpeg" };
    expect(validateFile(validImage, "projects")).toBe(true);

    const validPdf = { name: "cv.pdf", size: 2 * 1024 * 1024, type: "application/pdf" };
    expect(validateFile(validPdf, "resumes")).toBe(true);

    const pdfInProjects = { name: "doc.pdf", size: 1024, type: "application/pdf" };
    expect(() => validateFile(pdfInProjects, "projects")).toThrow(/Unsupported file type/);
  });

  test("extractStoragePath parses Supabase public CDN URLs", () => {
    const url = "https://xyz.supabase.co/storage/v1/object/public/projects/covers/123-pic.png";
    expect(extractStoragePath(url, "projects")).toBe("covers/123-pic.png");
    expect(extractStoragePath("https://external.com/other.png", "projects")).toBeNull();
  });
});

describe("Deterministic Seeding Integrity", () => {
  const { seedPortfolioData } = require("./seedService");

  test("seedPortfolioData calls upsert with onConflict for all portfolio tables", async () => {
    const upsertCalls = {};
    const mockClient = {
      from: (table) => ({
        upsert: async (data, options) => {
          upsertCalls[table] = { data, options };
          return { error: null };
        },
      }),
    };

    const results = await seedPortfolioData(mockClient);
    expect(results.profile).toBe(true);
    expect(results.contact).toBe(true);
    expect(results.resume).toBe(true);
    expect(results.projects).toBe(6);
    expect(results.services).toBe(4);
    expect(results.certifications).toBe(6);

    // Verify onConflict is used to ensure idempotency
    expect(upsertCalls.profile.options.onConflict).toBe("id");
    expect(upsertCalls.projects.options.onConflict).toBe("id");
    expect(upsertCalls.skills.options.onConflict).toBe("id");
    expect(upsertCalls.services.options.onConflict).toBe("id");
    expect(upsertCalls.certifications.options.onConflict).toBe("id");
    expect(upsertCalls.seo_settings.options.onConflict).toBe("page_route");
  });
});
