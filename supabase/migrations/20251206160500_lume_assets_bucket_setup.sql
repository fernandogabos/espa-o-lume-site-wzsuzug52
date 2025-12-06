-- Create the storage bucket 'lume-assets' if it does not exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('lume-assets', 'lume-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Remove existing policies to ensure idempotent migration (avoiding errors if they already exist)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Access Lume Assets" ON storage.objects;
    DROP POLICY IF EXISTS "Public Upload Lume Assets" ON storage.objects;
    DROP POLICY IF EXISTS "Public Update Lume Assets" ON storage.objects;
    DROP POLICY IF EXISTS "Public Delete Lume Assets" ON storage.objects;
END $$;

-- Create policies for public access
-- 1. Allow public read access
CREATE POLICY "Public Access Lume Assets"
ON storage.objects FOR SELECT
USING ( bucket_id = 'lume-assets' );

-- 2. Allow public upload (insert) access
CREATE POLICY "Public Upload Lume Assets"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'lume-assets' );

-- 3. Allow public update access
CREATE POLICY "Public Update Lume Assets"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'lume-assets' );

-- 4. Allow public delete access
CREATE POLICY "Public Delete Lume Assets"
ON storage.objects FOR DELETE
USING ( bucket_id = 'lume-assets' );
