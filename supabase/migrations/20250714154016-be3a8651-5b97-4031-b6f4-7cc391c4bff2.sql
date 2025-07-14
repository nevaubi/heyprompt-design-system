-- Add is_admin column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN is_admin BOOLEAN DEFAULT FALSE NOT NULL;

-- Create an index for faster admin lookups
CREATE INDEX idx_user_profiles_is_admin ON public.user_profiles(is_admin) WHERE is_admin = true;

-- Update RLS policy to allow admins to view all user profiles
CREATE POLICY "Admins can view all user profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Allow admins to bypass prompt ownership restrictions for viewing
CREATE POLICY "Admins can view all prompts"
ON public.prompts
FOR SELECT
TO authenticated
USING (
  is_published = true OR 
  auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Allow admins to update any prompt
CREATE POLICY "Admins can update any prompt"
ON public.prompts
FOR UPDATE
TO authenticated
USING (
  auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Allow admins to delete any prompt
CREATE POLICY "Admins can delete any prompt"
ON public.prompts
FOR DELETE
TO authenticated
USING (
  auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);