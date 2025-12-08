-- Seed the admin user fernndo.gabos@hotmail.com
-- Using pgcrypto to hash the password
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  user_id uuid := gen_random_uuid();
  exists boolean;
BEGIN
  -- Check if user already exists
  SELECT EXISTS (SELECT 1 FROM auth.users WHERE email = 'fernndo.gabos@hotmail.com') INTO exists;
  
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
      'fernndo.gabos@hotmail.com',
      crypt('123456a!', gen_salt('bf')), -- 123456a!
      now(),
      '{"role": "admin"}',
      now(),
      now(),
      '',
      ''
    );
    
    -- Note: The 'handle_new_user' trigger on auth.users (created in 20251207140000) 
    -- will automatically insert a row into public.profiles with role='admin' 
    -- (from raw_user_meta_data) and first_login_required=true.
    
  END IF;
END $$;
