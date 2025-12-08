-- Fix permissions for schema access to prevent "Database error querying schema"
-- This ensures that the anonymous and authenticated roles can access the public schema
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Ensure tables exist (idempotent check)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'editor',
  first_login_required BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_data ENABLE ROW LEVEL SECURITY;

-- Grant permissions on tables to all roles
-- This is crucial for avoiding permission errors when accessing these tables
GRANT ALL ON TABLE public.profiles TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.site_data TO postgres, anon, authenticated, service_role;

-- Grant permissions on sequences and routines
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Re-create Policies to ensure they are correct and permissive enough for the application logic
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Public site data is viewable by everyone" ON public.site_data;
CREATE POLICY "Public site data is viewable by everyone" ON public.site_data
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can update site data" ON public.site_data;
CREATE POLICY "Authenticated users can update site data" ON public.site_data
  FOR ALL USING (auth.role() = 'authenticated');

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Seed or Update Admin User
-- This ensures the user 'fernando.gabos@innovagrupo.com.br' exists with the correct password and profile
DO $$
DECLARE
  target_email TEXT := 'fernando.gabos@innovagrupo.com.br';
  target_password TEXT := '123456a!';
  user_id UUID;
  existing_user_id UUID;
BEGIN
  -- Check if user exists
  SELECT id INTO existing_user_id FROM auth.users WHERE email = target_email;

  IF existing_user_id IS NOT NULL THEN
    -- Update existing user's password and metadata
    UPDATE auth.users
    SET encrypted_password = crypt(target_password, gen_salt('bf')),
        updated_at = now(),
        raw_user_meta_data = '{"role": "admin"}'::jsonb
    WHERE id = existing_user_id;
    user_id := existing_user_id;
  ELSE
    -- Create new user
    user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id,
      instance_id,
      role,
      aud,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      is_sso_user
    ) VALUES (
      user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      target_email,
      crypt(target_password, gen_salt('bf')),
      now(),
      '{"role": "admin"}',
      now(),
      now(),
      '',
      '',
      FALSE
    );
  END IF;

  -- Ensure Profile Exists in public.profiles
  -- We use ON CONFLICT to ensure the role is 'admin' even if the profile already existed
  INSERT INTO public.profiles (id, role, first_login_required)
  VALUES (user_id, 'admin', TRUE)
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin';
END $$;
