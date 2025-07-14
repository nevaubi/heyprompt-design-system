-- Fix RLS policy infinite recursion by dropping problematic policy
DROP POLICY IF EXISTS "Admins can view all user profiles" ON public.user_profiles;

-- Create security definer function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.user_profiles WHERE id = user_id),
    false
  );
$$;

-- Recreate admin policies using the security definer function
CREATE POLICY "Admins can view all user profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Update prompt policies to use the security definer function
DROP POLICY IF EXISTS "Admins can view all prompts" ON public.prompts;
DROP POLICY IF EXISTS "Admins can update any prompt" ON public.prompts;
DROP POLICY IF EXISTS "Admins can delete any prompt" ON public.prompts;

CREATE POLICY "Admins can view all prompts"
ON public.prompts
FOR SELECT
TO authenticated
USING (is_published = true OR auth.uid() = created_by OR public.is_admin());

CREATE POLICY "Admins can update any prompt"
ON public.prompts
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by OR public.is_admin());

CREATE POLICY "Admins can delete any prompt"
ON public.prompts
FOR DELETE
TO authenticated
USING (auth.uid() = created_by OR public.is_admin());

-- Set the first user as admin (you can change this to your specific user ID)
UPDATE public.user_profiles 
SET is_admin = true 
WHERE id = (
  SELECT id FROM public.user_profiles 
  ORDER BY created_at ASC 
  LIMIT 1
);