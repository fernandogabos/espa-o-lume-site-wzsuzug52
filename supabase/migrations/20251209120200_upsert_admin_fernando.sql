-- Migration to explicitly provision the admin user fernando.gabos@innovagrupo.com.br

-- Ensure pgcrypto extension is enabled for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  v_email TEXT := 'fernando.gabos@innovagrupo.com.br';
  v_password TEXT := '123456a!';
  v_user_id UUID;
  v_existing_id UUID;
BEGIN
  -- 1. Handle auth.users entry
  -- Check if user exists
  SELECT id INTO v_existing_id FROM auth.users WHERE email = v_email;

  IF v_existing_id IS NOT NULL THEN
    -- Update existing user credentials and metadata
    UPDATE auth.users
    SET encrypted_password = crypt(v_password, gen_salt('bf')),
        raw_user_meta_data = jsonb_set(
            COALESCE(raw_user_meta_data, '{}'::jsonb),
            '{role}',
            '"admin"'
        ),
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

  -- 2. Handle public.profiles entry
  -- Ensure the profile exists and has correct admin settings
  INSERT INTO public.profiles (id, role, first_login_required)
  VALUES (v_user_id, 'admin', TRUE)
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      first_login_required = TRUE; -- Force password change on first login/reset

END $$;
