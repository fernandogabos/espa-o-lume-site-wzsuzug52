-- Create extension if not exists for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  user_id uuid;
  exists boolean;
BEGIN
  -- Check if user exists
  SELECT EXISTS (SELECT 1 FROM auth.users WHERE email = 'desenvolvimento@innovagrupo.com.br') INTO exists;
  
  IF NOT exists THEN
    user_id := gen_random_uuid();
    
    -- Insert into auth.users
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
      'desenvolvimento@innovagrupo.com.br',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"role": "admin"}',
      now(),
      now(),
      '',
      '',
      FALSE
    );
    
    -- Insert into public.profiles
    -- We use ON CONFLICT DO UPDATE to ensure the role is correct even if the trigger created it
    INSERT INTO public.profiles (id, role, first_login_required)
    VALUES (user_id, 'admin', TRUE)
    ON CONFLICT (id) DO UPDATE 
    SET role = 'admin', 
        first_login_required = TRUE;
        
  ELSE
    -- If user exists, update password and role to match requirements
    SELECT id INTO user_id FROM auth.users WHERE email = 'desenvolvimento@innovagrupo.com.br';
    
    UPDATE auth.users 
    SET encrypted_password = crypt('admin123', gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        raw_user_meta_data = jsonb_set(
            COALESCE(raw_user_meta_data, '{}'::jsonb), 
            '{role}', 
            '"admin"'
        )
    WHERE id = user_id;

    -- Ensure profile is correct
    INSERT INTO public.profiles (id, role, first_login_required)
    VALUES (user_id, 'admin', TRUE)
    ON CONFLICT (id) DO UPDATE 
    SET role = 'admin';
    
  END IF;
END $$;
