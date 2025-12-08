-- Migration to refine Row Level Security (RLS) policies for the profiles table

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts and ensure clean state
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create comprehensive policies

-- 1. READ: Everyone (including anon for login checks if needed, but mostly authenticated) can view profiles
-- This allows the application to check roles and fetch user data
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

-- 2. UPDATE: Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- 3. INSERT: Users can insert their own profile (useful for self-registration flows or triggers fallback)
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 4. ALL: Service Role should bypass RLS automatically, but explicit policies for admin-level operations via Supabase client if needed
-- (Note: Service Role key bypasses RLS by default, so we don't strictly need a policy for it)
