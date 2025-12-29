-- Fix schema permissions safely
-- Grant necessary permissions to Supabase roles on the public schema

BEGIN;

-- 1. Ensure pgcrypto is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Grant USAGE on schema public
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 3. Grant ALL privileges on ALL tables in public
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;

-- 4. Grant ALL privileges on ALL sequences in public
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 5. Grant ALL privileges on ALL routines in public
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 6. Ensure future tables/sequences/routines get these privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

COMMIT;
