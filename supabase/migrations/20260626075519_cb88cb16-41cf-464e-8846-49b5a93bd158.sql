ALTER TABLE public.portfolio_projects
  ADD COLUMN IF NOT EXISTS images jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS layout text NOT NULL DEFAULT 'web';
ALTER TABLE public.portfolio_projects ALTER COLUMN url DROP NOT NULL;