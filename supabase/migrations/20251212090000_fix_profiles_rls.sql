-- Fix Profiles RLS and Data Consistency

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Ensure id column type is UUID
-- This casts the column to UUID if it isn't already, ensuring type consistency
ALTER TABLE public.profiles ALTER COLUMN id TYPE uuid USING id::uuid;

-- 2. Clean up orphaned profiles
-- Remove any profiles that do not have a corresponding user in auth.users
DELETE FROM public.profiles WHERE id NOT IN (SELECT id FROM auth.users);

-- 3. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies (covering both provided names and previous migration names)
DROP POLICY IF EXISTS "allow_select_authenticated" ON public.profiles;
DROP POLICY IF EXISTS "service_role_can_insert" ON public.profiles;
DROP POLICY IF EXISTS "allow_insert_authenticated" ON public.profiles;
DROP POLICY IF EXISTS "allow_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "allow_admin_read_all" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "delete_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "select_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "select_profiles_admins" ON public.profiles;
DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;

-- 5. Create new policies as specified

-- Allow users to select their own profile
CREATE POLICY "select_own_profile"
ON public.profiles
FOR SELECT
USING ( auth.uid() = id );

-- Allow admins to select all profiles
-- Note: logic checks if the current user has 'admin' role in profiles
CREATE POLICY "select_profiles_admins"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'admin'
  )
);

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

-- Allow users to delete their own profile, or admins to delete any profile
CREATE POLICY "delete_own_or_admin"
ON public.profiles
FOR DELETE
USING (
  (auth.uid() = id)
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'admin'
  )
);

-- 6. Ensure dev user exists and has admin role
DO $$
DECLARE
  dev_email text := 'desenvolvimento@innovagrupo.com.br';
  dev_pass text := 'admin123';
  user_id uuid;
BEGIN
  -- Check if user exists
  SELECT id INTO user_id FROM auth.users WHERE email = dev_email;

  IF user_id IS NULL THEN
    -- Create user
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
    -- Update password to ensure login works
    UPDATE auth.users
    SET encrypted_password = crypt(dev_pass, gen_salt('bf')),
        updated_at = now()
    WHERE id = user_id;
  END IF;

  -- Ensure profile exists and has admin role
  INSERT INTO public.profiles (id, role, first_login_required)
  VALUES (user_id, 'admin', FALSE)
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin', first_login_required = FALSE;
  
END $$;
