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
