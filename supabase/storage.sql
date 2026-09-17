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
