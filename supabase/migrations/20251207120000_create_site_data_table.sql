-- Create the site_data table for persistent content storage
CREATE TABLE IF NOT EXISTS public.site_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.site_data ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access to site data so the website content is visible to everyone
CREATE POLICY "Enable read access for all users" ON public.site_data
  FOR SELECT USING (true);

-- Allow authenticated users (admins) to insert and update site data
CREATE POLICY "Enable insert for authenticated users only" ON public.site_data
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.site_data
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_data_updated_at
    BEFORE UPDATE ON public.site_data
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
