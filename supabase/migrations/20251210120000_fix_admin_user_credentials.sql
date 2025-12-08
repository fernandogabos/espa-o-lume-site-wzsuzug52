-- Fix admin user credentials for fernndo.gabos@hotmail.com
-- This migration ensures the user exists, has the correct password hash, and email is confirmed.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  v_user_id uuid;
  v_email text := 'fernndo.gabos@hotmail.com';
  v_password text := '123456a!';
BEGIN
  -- 1. Check if user exists
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NOT NULL THEN
    -- 2. Update existing user
    -- We explicitly update encrypted_password to match '123456a!' and set email_confirmed_at
    UPDATE auth.users
    SET encrypted_password = crypt(v_password, gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now(),
        raw_user_meta_data = jsonb_set(
            COALESCE(raw_user_meta_data, '{}'::jsonb),
            '{role}',
            '"admin"'
        )
    WHERE id = v_user_id;
    
    RAISE NOTICE 'Updated existing user %', v_email;
  ELSE
    -- 3. Insert new user if missing
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
      is_super_admin
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf')),
      now(), -- Confirmed immediately
      '{"role": "admin"}',
      now(),
      now(),
      '',
      '',
      FALSE
    );
    
    RAISE NOTICE 'Created new user %', v_email;
  END IF;

  -- 4. Ensure profile exists and forces first login
  INSERT INTO public.profiles (id, role, first_login_required)
  VALUES (v_user_id, 'admin', TRUE)
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      first_login_required = TRUE;
      
  RAISE NOTICE 'Updated profile for %', v_email;

END $$;
