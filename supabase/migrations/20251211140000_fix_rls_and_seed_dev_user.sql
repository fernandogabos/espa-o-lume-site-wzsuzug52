-- Migration to fix RLS policies and permissions, and seed the development user

-- 1. Ensure permissions on public schema are correct to avoid "Database error querying schema"
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 2. Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 3. Ensure RLS is enabled on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create a SECURITY DEFINER function to check if a user is an admin
-- This allows policies to check the user's role without causing recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Checks if the current user has an 'admin' role in the profiles table
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Drop existing policies to start fresh
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- 6. Create new, comprehensive RLS policies

-- Policy: Authenticated users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Admins can view all profiles (using the safe function)
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Policy: Authenticated users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy: Authenticated users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 7. Seed the 'desenvolvimento@innovagrupo.com.br' user
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  exists_user_id uuid;
BEGIN
  -- Check if user exists
  SELECT id INTO exists_user_id FROM auth.users WHERE email = 'desenvolvimento@innovagrupo.com.br';
  
  IF exists_user_id IS NULL THEN
    -- Create new user
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
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'desenvolvimento@innovagrupo.com.br',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"role": "admin"}',
      now(),
      now(),
      '',
      '',
      false
    );

    -- Ensure profile exists and has admin role
    -- Note: Trigger might create profile, so we use ON CONFLICT
    INSERT INTO public.profiles (id, role, first_login_required)
    VALUES (new_user_id, 'admin', FALSE)
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin', first_login_required = FALSE;
    
  ELSE
    -- User exists, update password and ensure profile is admin
    UPDATE auth.users
    SET encrypted_password = crypt('admin123', gen_salt('bf')),
        raw_user_meta_data = jsonb_build_object('role', 'admin'),
        updated_at = now()
    WHERE id = exists_user_id;

    INSERT INTO public.profiles (id, role, first_login_required)
    VALUES (exists_user_id, 'admin', FALSE)
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin', first_login_required = FALSE;
  END IF;
END $$;
