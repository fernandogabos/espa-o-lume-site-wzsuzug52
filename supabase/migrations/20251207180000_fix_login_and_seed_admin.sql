-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Fix Permissions to prevent "Database error querying schema"
-- Explicitly grant usage on public schema to all roles
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 2. Ensure Profile Table Exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'editor',
  first_login_required BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS on profiles if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Re-create Policies to ensure access is correct
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. Seed/Fix Admin User (fernando.gabos@innovagrupo.com.br)
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
    -- Update existing user's password and ensure metadata is correct
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

  -- Ensure Profile Exists in public.profiles and is set to Admin with First Login Required
  -- This ensures the flow described in the user story (reset flow) works
  INSERT INTO public.profiles (id, role, first_login_required)
  VALUES (user_id, 'admin', TRUE)
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      first_login_required = TRUE; -- Reset to TRUE to force password change test
END $$;
