-- Fix 'Database error querying schema' by granting usage on public schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- Ensure profiles table exists and RLS is enabled
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'editor',
  first_login_required BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean state and avoid conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create Policy: Authenticated users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create Policy: Authenticated users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create Policy: Authenticated users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create Policy: Admins can view all profiles (using JWT metadata to prevent recursion)
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Seed/Update user 'fernando.gabos@hotmail.com' with password 'admin123' and role 'admin'
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  user_id uuid;
  existing_id uuid;
BEGIN
  -- Check if user exists
  SELECT id INTO existing_id FROM auth.users WHERE email = 'fernando.gabos@hotmail.com';

  IF existing_id IS NOT NULL THEN
    -- Update existing user credentials and metadata
    UPDATE auth.users
    SET encrypted_password = crypt('admin123', gen_salt('bf')),
        raw_user_meta_data = jsonb_build_object('role', 'admin'),
        updated_at = now()
    WHERE id = existing_id;
    
    -- Ensure profile exists and requires first login (password change)
    INSERT INTO public.profiles (id, role, first_login_required)
    VALUES (existing_id, 'admin', true)
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin',
        first_login_required = true;
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
      recovery_token
    ) VALUES (
      user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'fernando.gabos@hotmail.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"role": "admin"}',
      now(),
      now(),
      '',
      ''
    );
    
    -- Create profile
    INSERT INTO public.profiles (id, role, first_login_required)
    VALUES (user_id, 'admin', true)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
