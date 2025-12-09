-- Fix "Database error querying schema" and RLS recursion issues

-- 1. Grant usage on public schema to all relevant roles
-- This is often the cause of "Database error querying schema"
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role, postgres;

-- 2. Set search_path for roles to ensure they can find public tables and extensions
ALTER ROLE anon SET search_path = "$user", public, extensions;
ALTER ROLE authenticated SET search_path = "$user", public, extensions;
ALTER ROLE service_role SET search_path = "$user", public, extensions;

-- 3. Ensure pgcrypto extension exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA public;

-- 4. Clean up triggers on auth.users
-- Remove potentially broken triggers that might run on UPDATE (login)
DROP TRIGGER IF EXISTS sync_profiles_with_auth ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Re-define the handle_new_user function safely with SECURITY DEFINER and search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, first_login_required)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'editor'),
    TRUE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Ensure the INSERT trigger is correct
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Fix RLS Recursion in Profiles
-- Create a helper function to check admin status safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the current user has 'admin' role in profiles
  -- Bypasses RLS because it's SECURITY DEFINER (runs as owner/postgres)
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop recursive policies
DROP POLICY IF EXISTS "select_profiles_admins" ON public.profiles;
DROP POLICY IF EXISTS "delete_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "select_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create clean, non-recursive policies

-- Allow users to view their own profile
CREATE POLICY "select_own_profile"
ON public.profiles
FOR SELECT
USING ( auth.uid() = id );

-- Allow admins to view all profiles (using is_admin function to avoid recursion)
CREATE POLICY "select_all_profiles_admin"
ON public.profiles
FOR SELECT
USING ( public.is_admin() );

-- Allow users to insert their own profile
CREATE POLICY "insert_own_profile"
ON public.profiles
FOR INSERT
WITH CHECK ( auth.uid() = id );

-- Allow users to update their own profile
CREATE POLICY "update_own_profile"
ON public.profiles
FOR UPDATE
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );

-- Allow admins to update all profiles
CREATE POLICY "update_all_profiles_admin"
ON public.profiles
FOR UPDATE
USING ( public.is_admin() );

-- Allow users to delete their own profile
CREATE POLICY "delete_own_profile"
ON public.profiles
FOR DELETE
USING ( auth.uid() = id );

-- Allow admins to delete any profile
CREATE POLICY "delete_all_profiles_admin"
ON public.profiles
FOR DELETE
USING ( public.is_admin() );

-- 6. Seed/Fix Dev User
DO $$
DECLARE
  dev_email text := 'desenvolvimento@innovagrupo.com.br';
  dev_pass text := 'admin123';
  user_id uuid;
BEGIN
  -- Check if user exists
  SELECT id INTO user_id FROM auth.users WHERE email = dev_email;

  IF user_id IS NULL THEN
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
      is_super_admin
    ) VALUES (
      user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      dev_email,
      crypt(dev_pass, gen_salt('bf')),
      now(),
      '{"role": "admin"}',
      now(),
      now(),
      '',
      '',
      false
    );
  ELSE
    UPDATE auth.users
    SET encrypted_password = crypt(dev_pass, gen_salt('bf')),
        raw_user_meta_data = '{"role": "admin"}',
        updated_at = now()
    WHERE id = user_id;
  END IF;

  -- Ensure profile exists and is admin
  INSERT INTO public.profiles (id, role, first_login_required)
  VALUES (user_id, 'admin', FALSE)
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin', first_login_required = FALSE;
END $$;
