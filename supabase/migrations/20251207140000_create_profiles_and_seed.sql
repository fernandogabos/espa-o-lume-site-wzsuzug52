-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'editor',
  first_login_required BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create trigger function to sync auth.users to public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, first_login_required)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'editor'),
    TRUE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Seed the admin user
-- We need to install pgcrypto to hash the password
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  user_id uuid := gen_random_uuid();
  exists boolean;
BEGIN
  SELECT EXISTS (SELECT 1 FROM auth.users WHERE email = 'fernando.gabos@innovagrupo.com.br') INTO exists;
  
  IF NOT exists THEN
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
      'fernando.gabos@innovagrupo.com.br',
      crypt('123456a!', gen_salt('bf')), -- 123456a!
      now(),
      '{"role": "admin"}',
      now(),
      now(),
      '',
      ''
    );
  END IF;
END $$;
