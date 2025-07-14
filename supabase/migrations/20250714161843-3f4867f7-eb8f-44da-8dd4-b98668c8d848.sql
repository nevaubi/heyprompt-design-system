-- Add image_url column to prompts table
ALTER TABLE public.prompts 
ADD COLUMN image_url TEXT;