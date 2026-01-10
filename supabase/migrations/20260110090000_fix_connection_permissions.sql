-- Restore permissions for public schema and ensure access for all necessary roles
-- This resolves "Database error querying schema" and permission denied errors

BEGIN;

-- 1. Grant USAGE on SCHEMA public
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Grant ALL privileges on ALL TABLES in schema public
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 3. Grant ALL privileges on ALL SEQUENCES in schema public
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 4. Grant ALL privileges on ALL ROUTINES in schema public
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 5. Set DEFAULT PRIVILEGES for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

COMMIT;
