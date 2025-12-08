-- Migration to reset password for fernando.gabos@hotmail.com and enforce first login change

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  target_email TEXT := 'fernando.gabos@hotmail.com';
  target_password TEXT := 'admin123';
  v_user_id UUID;
BEGIN
  -- Check if user exists
  SELECT id INTO v_user_id FROM auth.users WHERE email = target_email;

  IF v_user_id IS NOT NULL THEN
    -- Update existing user
    UPDATE auth.users
    SET encrypted_password = crypt(target_password, gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        raw_user_meta_data = jsonb_set(
            COALESCE(raw_user_meta_data, '{}'::jsonb),
            '{role}',
            '"admin"'
        ),
        updated_at = now()
    WHERE id = v_user_id;

    -- Update profile to require first login and ensure admin role
    UPDATE public.profiles
    SET first_login_required = TRUE,
        role = 'admin'
    WHERE id = v_user_id;
    
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
      updated_at
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      target_email,
      crypt(target_password, gen_salt('bf')),
      now(),
      '{"role": "admin"}',
      now(),
      now()
    );
    
    -- Profile creation is handled by the trigger 'on_auth_user_created'
    -- defined in previous migrations (which uses the role from metadata)
    
  END IF;
END $$;
