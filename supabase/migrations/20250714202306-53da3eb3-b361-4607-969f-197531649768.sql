-- Add foreign key constraint for prompts.created_by to reference user_profiles.id
-- This will fix the database relationship issues when fetching library data

ALTER TABLE public.prompts 
ADD CONSTRAINT prompts_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;