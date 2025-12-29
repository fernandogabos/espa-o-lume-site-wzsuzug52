-- Ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('lume-assets', 'lume-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies to ensure a clean slate and avoid conflicts
-- We drop policies for both 'lume-assets' and generic ones if they match to allow this migration to fix any previous state
DROP POLICY IF EXISTS "Public Access Lume Assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Lume Assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Lume Assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Lume Assets" ON storage.objects;
DROP POLICY IF EXISTS "Lume Assets Public Read" ON storage.objects;
DROP POLICY IF EXISTS "Lume Assets Auth Insert" ON storage.objects;
DROP POLICY IF EXISTS "Lume Assets Auth Update" ON storage.objects;
DROP POLICY IF EXISTS "Lume Assets Auth Delete" ON storage.objects;

-- Create explicit policies
-- 1. Allow public read access (so the website can display images)
CREATE POLICY "Lume Assets Public Read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'lume-assets' );

-- 2. Allow authenticated users to upload (INSERT)
CREATE POLICY "Lume Assets Auth Insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'lume-assets' );

-- 3. Allow authenticated users to update their uploads (UPDATE)
CREATE POLICY "Lume Assets Auth Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'lume-assets' );

-- 4. Allow authenticated users to delete (DELETE)
CREATE POLICY "Lume Assets Auth Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'lume-assets' );
