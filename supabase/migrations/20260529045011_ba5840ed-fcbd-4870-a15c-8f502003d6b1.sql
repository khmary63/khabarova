ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'ai';

CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts (category);