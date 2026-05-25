
-- Lead magnet feature: add fields on posts and create submissions table + private storage bucket

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS lead_magnet_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS lead_magnet_title text,
  ADD COLUMN IF NOT EXISTS lead_magnet_description text,
  ADD COLUMN IF NOT EXISTS lead_magnet_button_label text,
  ADD COLUMN IF NOT EXISTS lead_magnet_file_path text,
  ADD COLUMN IF NOT EXISTS lead_magnet_file_name text;

CREATE TABLE IF NOT EXISTS public.lead_magnet_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE SET NULL,
  post_slug text,
  magnet_title text,
  name text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_magnet_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead magnet request"
ON public.lead_magnet_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 100
  AND length(phone) BETWEEN 3 AND 50
  AND (post_slug IS NULL OR length(post_slug) <= 200)
  AND (magnet_title IS NULL OR length(magnet_title) <= 300)
);

CREATE INDEX IF NOT EXISTS idx_lead_magnet_submissions_created_at
  ON public.lead_magnet_submissions(created_at DESC);

-- Private bucket for lead magnet files (PDFs). Access is brokered via signed URLs
-- returned by a server function after the user submits the form.
INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-magnets', 'lead-magnets', false)
ON CONFLICT (id) DO NOTHING;
