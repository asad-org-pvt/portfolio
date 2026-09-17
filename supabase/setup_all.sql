-- ==============================================================================
-- SUPABASE SCHEMA: Portfolio Content Management System (CMS)
-- Purpose: Normalized relational schema for public portfolio content & CMS admin
-- ==============================================================================

-- Enable UUID generation extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. UTILITY: Generic trigger function to automatically update updated_at
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 2. ADMIN USERS TABLE (Single-Admin Authorization Foundation)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER set_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Helper function to verify whether currently authenticated user is an admin
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

-- ------------------------------------------------------------------------------
-- 3. PROFILE / HERO
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  initials TEXT NOT NULL DEFAULT 'AS',
  hero_greeting TEXT NOT NULL DEFAULT 'Hi There!',
  hero_intro_title TEXT NOT NULL DEFAULT 'LET ME INTRODUCE MYSELF',
  hero_intro_body TEXT NOT NULL,
  rotating_titles JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of strings for typewriter effect
  about_heading TEXT NOT NULL DEFAULT 'Know Who I''M',
  about_body TEXT NOT NULL,
  about_quote TEXT,
  about_quote_author TEXT,
  current_employer TEXT,
  education_summary TEXT,
  hobbies JSONB NOT NULL DEFAULT '[]'::jsonb,
  avatar_url TEXT,
  hero_image_url TEXT,
  about_image_url TEXT,
  contact_image_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  github_username_main TEXT,
  github_username_alt TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER set_profile_updated_at
  BEFORE UPDATE ON public.profile
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 4. SKILLS & TOOLS (Categorized)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'tool', 'service')),
  icon_name TEXT, -- react-icons identifier e.g. 'DiJavascript1', 'SiNextdotjs'
  icon_package TEXT DEFAULT 'react-icons',
  icon_url TEXT, -- optional uploaded custom icon URL
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 100),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_skills_category_order ON public.skills(category, display_order);
CREATE INDEX IF NOT EXISTS idx_skills_is_published ON public.skills(is_published);

CREATE TRIGGER set_skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 5. PROJECTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT NOT NULL,
  demo_url TEXT,
  github_url TEXT,
  cover_image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON public.projects(is_published);

CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 6. PROJECT IMAGES (Multiple images/media per project)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id, display_order);

-- ------------------------------------------------------------------------------
-- 7. PROJECT TECHNOLOGIES (Many-to-Many: Projects <-> Skills)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_technologies (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_project_tech_project ON public.project_technologies(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tech_skill ON public.project_technologies(skill_id);

-- ------------------------------------------------------------------------------
-- 8. SERVICES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  cta_label TEXT DEFAULT 'Contact Us',
  cta_link TEXT DEFAULT '/contact',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_services_order ON public.services(display_order);
CREATE INDEX IF NOT EXISTS idx_services_is_published ON public.services(is_published);

CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 9. CERTIFICATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE,
  description TEXT NOT NULL,
  credential_url TEXT,
  credential_id TEXT,
  thumbnail_url TEXT,
  file_url TEXT,
  is_pdf BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_certifications_order ON public.certifications(display_order);
CREATE INDEX IF NOT EXISTS idx_certifications_is_published ON public.certifications(is_published);

CREATE TRIGGER set_certifications_updated_at
  BEFORE UPDATE ON public.certifications
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 10. EXPERIENCE / TIMELINE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  technologies TEXT[],
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_experience_order ON public.experience(display_order);
CREATE INDEX IF NOT EXISTS idx_experience_is_published ON public.experience(is_published);

CREATE TRIGGER set_experience_updated_at
  BEFORE UPDATE ON public.experience
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 11. EDUCATION
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  location TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT false,
  grade_or_gpa TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_education_order ON public.education(display_order);
CREATE INDEX IF NOT EXISTS idx_education_is_published ON public.education(is_published);

CREATE TRIGGER set_education_updated_at
  BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 12. RESUME
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resume (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Asad_Resume.pdf',
  file_url TEXT NOT NULL,
  version_label TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_resume_is_active ON public.resume(is_active);

CREATE TRIGGER set_resume_updated_at
  BEFORE UPDATE ON public.resume
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 13. CONTACT & SOCIAL LINKS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  location TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER set_contact_info_updated_at
  BEFORE UPDATE ON public.contact_info
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL, -- e.g. 'github', 'linkedin'
  url TEXT NOT NULL,
  icon_name TEXT, -- e.g. 'AiFillGithub', 'FaLinkedinIn'
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_social_links_order ON public.social_links(display_order);

CREATE TRIGGER set_social_links_updated_at
  BEFORE UPDATE ON public.social_links
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 14. SEO & META SETTINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_route TEXT NOT NULL UNIQUE, -- 'global', '/', '/about', '/project', etc.
  title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  twitter_card TEXT DEFAULT 'summary_large_image',
  canonical_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER set_seo_settings_updated_at
  BEFORE UPDATE ON public.seo_settings
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ==============================================================================
-- 15. SEED DATA (Exact normalization of existing portfolio content)
-- ==============================================================================

-- Profile
INSERT INTO public.profile (
  full_name,
  initials,
  hero_greeting,
  hero_intro_title,
  hero_intro_body,
  rotating_titles,
  about_heading,
  about_body,
  about_quote,
  about_quote_author,
  current_employer,
  education_summary,
  hobbies,
  github_url,
  linkedin_url,
  email,
  phone,
  whatsapp,
  github_username_main,
  github_username_alt
) VALUES (
  'Asad Sarwar',
  'AS',
  'Hi There!',
  'LET ME INTRODUCE MYSELF',
  'I fell in love with programming and I have at least learnt something, I think… 🤷‍♂️ I am fluent in Javascript and Typescript. My field of Interest''s are building new Web Technologies and Products. Whenever possible, I also apply my passion for developing products with Node.js and Modern Javascript Library and Frameworks like React.js, Angular and Next.js.',
  '["Software Developer", "Freelancer", "MERN Stack Developer", "MEAN Stack Developer", "React Native Developer", "Android/IOS Developer"]'::jsonb,
  'Know Who I''M',
  'Hi Everyone, I am Asad Sarwar from Pakistan. I am currently employed as a Software Engineer at Stella Technology. I have completed BS Software Engineering from the Sukkur IBA University.',
  'Strive to build things that make a difference!',
  'Asad',
  'Stella Technology',
  'BS Software Engineering from Sukkur IBA University',
  '["Travelling", "Watching Movies", "Reading Ancient History"]'::jsonb,
  'https://github.com/asadsarwar1',
  'https://www.linkedin.com/in/itsasadsarwar/',
  'notasadsarwar@gmail.com',
  '+92-313-6100930',
  '+92-313-6100930',
  'asadsarwar1',
  'asarwar-tes'
) ON CONFLICT DO NOTHING;

-- Projects
INSERT INTO public.projects (title, slug, description, demo_url, display_order, is_published) VALUES
('Confidant Health', 'confidant-health', 'Confidant Health is both a tech platform and a network of top-notch behavioral health providers. We’re a virtual health system specializing in mental health and addiction. We combine cutting edge tech with great caregivers to help people thrive.', 'https://confidanthealth.com/', 1, true),
('Klaims', 'klaims', 'Klaim is an award-winning fintech company based in UAE. Since 2019, we’ve been revolutionizing the healthcare industry by giving providers access to the working capital they need to grow faster and serve patients better. Our solutions are already trusted by more than 40 healthcare providers, and so far we’ve accelerated 300,000 claims and paid out 100 million AED in purchased claims', 'https://www.klaim.ai/', 2, true),
('Bulletproof Inbox', 'bulletproof-inbox', 'Bulletproof turns your open-access inbox into a permission-based one. Stop emails from unknown senders before they arrive in your inbox. It works with Gmail and Outlook.', 'https://www.bulletproofinbox.com/', 3, true),
('Manifest Notify', 'manifest-notify', 'MX Notify is a powerful, customizable tool that updates clinicians and other care providers moments after their patients are seen in the emergency department or are discharged from a hospital', 'https://www.manifestmedex.org/solutions/mx-notify/', 4, true),
('Wells and Siesmic', 'wells-and-siesmic', 'Wells and Siesmic is an online data management and reporting tool for wells, siesmic and related data from Oman, Turkey and more. Data can also be exported and shared in many standards and formates.', 'https://was.demo.omanbidround.com', 5, true),
('Makman', 'makman', 'Makman is an online open data market place, where you can access free data of wells and siesmic from Oman, Turkey and more. Data can also be purchased from there.', 'https://makman.om/', 6, true)
ON CONFLICT DO NOTHING;

-- Services
INSERT INTO public.services (title, description, display_order, is_published) VALUES
('Frontend Development', 'We have a team of experienced frontend developers who are proficient in React.js, Angular, and Next.js. We can build scalable and responsive web applications for you.', 1, true),
('Backend Development', 'We have a team of experienced backend developers who are proficient in Node.js, Express.js, and MongoDB. We can build scalable and secure backend for your web and mobile applications.', 2, true),
('Mobile Application Development', 'We have a team of experienced React Native developers. We can build cross-platform mobile applications for you. Including the ability to build/publish mobile applications for both iOS and Android on App Store and Play Store.', 3, true),
('Consultation Services', 'We provide consultation services for your web and mobile applications. We can help you with the architecture of your application, the technology stack, and the best practices to follow.', 4, true)
ON CONFLICT DO NOTHING;

-- Certifications
INSERT INTO public.certifications (title, issuer, description, credential_url, is_pdf, display_order, is_published) VALUES
('Frontend Developer (React) Certificate', 'HackerRank', 'Awarded by HackerRank for successfully completing the Frontend Developer (React) Certificate. The certificate verifies that the recipient has successfully completed the Frontend Developer (React) Certificate.', 'https://www.hackerrank.com/certificates/c81d69157c24', true, 1, true),
('Software Engineer Certificate', 'HackerRank', 'Awarded by HackerRank for successfully completing the Software Engineer Certificate. The certificate verifies that the recipient has successfully completed the Software Engineer Certificate.', 'https://www.hackerrank.com/certificates/56fb13932891', true, 2, true),
('JavaScript (Intermediate) Certificate', 'HackerRank', 'Awarded by HackerRank for successfully completing the JavaScript (Intermediate) Certificate. The certificate verifies that the recipient has successfully completed the JavaScript (Intermediate) Certificate.', 'https://www.hackerrank.com/certificates/7c5552aeb986', true, 3, true),
('GCP: Core Infrastructure', 'Google & Coursera', 'Awarded by Google & Coursera for successfully completing the Google Cloud Platform Fundamentals: Core Infrastructure. The certificate verifies that the recipient has successfully completed the Google Cloud Platform Fundamentals: Core Infrastructure.', 'https://www.coursera.org/account/accomplishments/verify/GMTR8AY2YPRP?utm_source=mobile&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course', false, 4, true),
('Google IT Support Certificate', 'Google & Coursera / Credly', 'Awarded by Google & Coursera and authorized by Credly for successfully completing the Google IT Support Certificate. The certificate verifies that the recipient has successfully completed the Google IT Support Certificate.', 'https://www.credly.com/badges/b73c48de-d683-4d48-8f92-09fc59235554/linked_in_profile', false, 5, true),
('Getting Started With Application Development: GCP', 'Google & Coursera', 'Awarded by Google & Coursera for successfully completing the Getting Started With Application Development: GCP. The certificate verifies that the recipient has successfully completed the Getting Started With Application Development: GCP.', 'https://www.coursera.org/account/accomplishments/verify/SX6KPVQHKM29?utm_source=mobile&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course', false, 6, true)
ON CONFLICT DO NOTHING;

-- Experience
INSERT INTO public.experience (position, company, location, start_date, is_current, description, display_order, is_published) VALUES
('Software Engineer', 'Stella Technology', 'Pakistan', '2022-01-01', true, 'Full stack web and mobile development specializing in modern JavaScript/TypeScript, React, Node.js, and healthcare software solutions.', 1, true)
ON CONFLICT DO NOTHING;

-- Education
INSERT INTO public.education (institution, degree, field_of_study, is_current, display_order, is_published) VALUES
('Sukkur IBA University', 'Bachelor of Science (BS)', 'Software Engineering', false, 1, true)
ON CONFLICT DO NOTHING;

-- Skills: Technical
INSERT INTO public.skills (name, category, icon_name, display_order, is_published) VALUES
('JavaScript', 'technical', 'DiJavascript1', 1, true),
('React.js', 'technical', 'DiReact', 2, true),
('Android', 'technical', 'DiAndroid', 3, true),
('Apple / iOS', 'technical', 'DiApple', 4, true),
('Node.js', 'technical', 'DiNodejs', 5, true),
('Angular', 'technical', 'DiAngularSimple', 6, true),
('MongoDB', 'technical', 'DiMongodb', 7, true),
('Firebase', 'technical', 'SiFirebase', 8, true),
('MySQL', 'technical', 'DiMysql', 9, true),
('Next.js', 'technical', 'SiNextdotjs', 10, true),
('HTML5', 'technical', 'DiHtml5', 11, true),
('CSS3', 'technical', 'DiCss3', 12, true),
('Bootstrap', 'technical', 'DiBootstrap', 13, true)
ON CONFLICT DO NOTHING;

-- Skills: Tools
INSERT INTO public.skills (name, category, icon_name, display_order, is_published) VALUES
('macOS', 'tool', 'SiMacos', 1, true),
('Xcode', 'tool', 'SiXcode', 2, true),
('Android Studio', 'tool', 'SiAndroidstudio', 3, true),
('VS Code', 'tool', 'SiVisualstudiocode', 4, true),
('Postman', 'tool', 'SiPostman', 5, true),
('Slack', 'tool', 'SiSlack', 6, true),
('Vercel', 'tool', 'SiVercel', 7, true),
('GitHub', 'tool', 'DiGithub', 8, true),
('Jira', 'tool', 'DiJira', 9, true)
ON CONFLICT DO NOTHING;

-- Contact Info
INSERT INTO public.contact_info (email, phone, whatsapp, location, is_published) VALUES
('notasadsarwar@gmail.com', '+92-313-6100930', '+92-313-6100930', 'Pakistan', true)
ON CONFLICT DO NOTHING;

-- Social Links
INSERT INTO public.social_links (platform, url, icon_name, display_order, is_published) VALUES
('github', 'https://github.com/asadsarwar1', 'AiFillGithub', 1, true),
('linkedin', 'https://www.linkedin.com/in/itsasadsarwar/', 'FaLinkedinIn', 2, true)
ON CONFLICT DO NOTHING;

-- SEO Settings (Global Default)
INSERT INTO public.seo_settings (page_route, title, meta_description, keywords, canonical_url) VALUES
('global', 'Asad Sarwar | Portfolio', 'Personal developer portfolio of Asad Sarwar, Software Engineer specializing in React, Node.js, and Mobile App Development.', 'software engineer, react developer, full stack developer, asad sarwar, portfolio', 'https://asadsarwar.com')
ON CONFLICT DO NOTHING;
-- ==============================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- Purpose: Complete database security protecting public reads & admin writes
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ENABLE ROW LEVEL SECURITY ACROSS ALL CMS TABLES
-- ------------------------------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 2. ADMIN USERS TABLE POLICIES
-- ------------------------------------------------------------------------------
-- Only existing admins can read the admin list, or an authenticated user can check their own admin status
CREATE POLICY "Admins can view admin list"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Only authenticated admins can manage admin users (preventing self-promotion by arbitrary users)
CREATE POLICY "Admins can manage admin list"
  ON public.admin_users
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 3. PROFILE POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published profile"
  ON public.profile
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admin has full access to profile"
  ON public.profile
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. SKILLS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published skills"
  ON public.skills
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admin has full access to skills"
  ON public.skills
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. PROJECTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published projects"
  ON public.projects
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admin has full access to projects"
  ON public.projects
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. PROJECT IMAGES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view images for published projects"
  ON public.project_images
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_images.project_id
      AND projects.is_published = true
    )
  );

CREATE POLICY "Admin has full access to project images"
  ON public.project_images
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. PROJECT TECHNOLOGIES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view tech mappings for published projects"
  ON public.project_technologies
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_technologies.project_id
      AND projects.is_published = true
    )
  );

CREATE POLICY "Admin has full access to project technologies"
  ON public.project_technologies
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. SERVICES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published services"
  ON public.services
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admin has full access to services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. CERTIFICATIONS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published certifications"
  ON public.certifications
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admin has full access to certifications"
  ON public.certifications
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 10. EXPERIENCE POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published experience"
  ON public.experience
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admin has full access to experience"
  ON public.experience
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 11. EDUCATION POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published education"
  ON public.education
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admin has full access to education"
  ON public.education
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 12. RESUME POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active resume"
  ON public.resume
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admin has full access to resume"
  ON public.resume
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 13. CONTACT INFO & SOCIAL LINKS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published contact info"
  ON public.contact_info
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admin has full access to contact info"
  ON public.contact_info
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public can view published social links"
  ON public.social_links
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admin has full access to social links"
  ON public.social_links
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 14. SEO SETTINGS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view seo settings"
  ON public.seo_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin has full access to seo settings"
  ON public.seo_settings
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
-- ==============================================================================
-- SUPABASE STORAGE BUCKETS & POLICIES
-- Purpose: Storage buckets and RLS policies for portfolio CMS media
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CREATE STORAGE BUCKETS
-- ------------------------------------------------------------------------------
-- Note: In Supabase, buckets can be created via the Dashboard or via SQL insert
-- into storage.buckets if permissions allow.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'projects',
    'projects',
    true,
    10485760, -- 10MB limit
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
  ),
  (
    'certifications',
    'certifications',
    true,
    15728640, -- 15MB limit
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
  ),
  (
    'resumes',
    'resumes',
    true,
    10485760, -- 10MB limit
    ARRAY['application/pdf']
  ),
  (
    'profile',
    'profile',
    true,
    10485760, -- 10MB limit
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ------------------------------------------------------------------------------
-- 2. STORAGE RLS POLICIES (storage.objects)
-- ------------------------------------------------------------------------------
-- Note: storage.objects already has RLS enabled by default in Supabase.

-- Policy 1: Public Read Access for all portfolio media
DROP POLICY IF EXISTS "Public media access for portfolio buckets" ON storage.objects;
CREATE POLICY "Public media access for portfolio buckets"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id IN ('projects', 'certifications', 'resumes', 'profile'));

-- Policy 2: Admin-only file upload (Insert)
DROP POLICY IF EXISTS "Admin media upload for portfolio buckets" ON storage.objects;
CREATE POLICY "Admin media upload for portfolio buckets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('projects', 'certifications', 'resumes', 'profile')
    AND public.is_admin()
  );

-- Policy 3: Admin-only file update
DROP POLICY IF EXISTS "Admin media update for portfolio buckets" ON storage.objects;
CREATE POLICY "Admin media update for portfolio buckets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id IN ('projects', 'certifications', 'resumes', 'profile')
    AND public.is_admin()
  );

-- Policy 4: Admin-only file deletion
DROP POLICY IF EXISTS "Admin media delete for portfolio buckets" ON storage.objects;
CREATE POLICY "Admin media delete for portfolio buckets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id IN ('projects', 'certifications', 'resumes', 'profile')
    AND public.is_admin()
  );
