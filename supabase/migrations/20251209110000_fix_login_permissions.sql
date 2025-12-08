-- Fix "Database error querying schema" by granting usage on public schema
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Ensure pgcrypto extension is available for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Ensure profiles table exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'editor',
  first_login_required BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Re-create policies to ensure correct access
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Ensure Admin User 'fernando.gabos@innovagrupo.com.br' exists and has correct credentials
DO $$
DECLARE
  v_email TEXT := 'fernando.gabos@innovagrupo.com.br';
  v_password TEXT := '123456a!';
  v_user_id UUID;
  v_existing_id UUID;
BEGIN
  -- Check if user exists
  SELECT id INTO v_existing_id FROM auth.users WHERE email = v_email;

  IF v_existing_id IS NOT NULL THEN
    -- Update existing user
    UPDATE auth.users
    SET encrypted_password = crypt(v_password, gen_salt('bf')),
        raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"admin"'),
        updated_at = now()
    WHERE id = v_existing_id;
    v_user_id := v_existing_id;
  ELSE
    -- Create new user
    v_user_id := gen_random_uuid();
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
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf')),
      now(),
      '{"role": "admin"}',
      now(),
      now(),
      '',
      '',
      FALSE
    );
  END IF;

  -- Ensure profile exists with correct settings
  INSERT INTO public.profiles (id, role, first_login_required)
  VALUES (v_user_id, 'admin', TRUE)
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      first_login_required = TRUE;
END $$;
