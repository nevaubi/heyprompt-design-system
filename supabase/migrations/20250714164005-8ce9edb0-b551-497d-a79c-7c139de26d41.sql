-- Replace image_url with emoji and background_color columns
ALTER TABLE public.prompts 
DROP COLUMN IF EXISTS image_url;

ALTER TABLE public.prompts 
ADD COLUMN emoji TEXT DEFAULT '🎨',
ADD COLUMN background_color TEXT DEFAULT 'gradient-blue';