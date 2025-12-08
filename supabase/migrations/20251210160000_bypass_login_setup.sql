-- Enable pgcrypto extension if it is not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'fernando.gabos@hotmail.com';
  v_password TEXT := 'Admin123';
  v_encrypted_pw TEXT;
BEGIN
  -- Generate bcrypt hash for the password
  v_encrypted_pw := crypt(v_password, gen_salt('bf'));
  
  -- Check if user exists in auth.users by email
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
  
  IF v_user_id IS NULL THEN
    -- User does not exist, create new user
    v_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud,
      confirmation_token
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      v_email,
      v_encrypted_pw,
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      'authenticated',
      'authenticated',
      ''
    );
    
    -- Create profile for new user with admin role and forced first login
    INSERT INTO public.profiles (id, role, first_login_required)
    VALUES (v_user_id, 'admin', TRUE);
    
  ELSE
    -- User exists, update password to the known bypass password
    UPDATE auth.users 
    SET encrypted_password = v_encrypted_pw, updated_at = now()
    WHERE id = v_user_id;
    
    -- Ensure profile exists and has admin role
    INSERT INTO public.profiles (id, role, first_login_required)
    VALUES (v_user_id, 'admin', FALSE)
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin';
    -- We do not overwrite first_login_required on conflict to respect existing state
    
  END IF;
  
END $$;
