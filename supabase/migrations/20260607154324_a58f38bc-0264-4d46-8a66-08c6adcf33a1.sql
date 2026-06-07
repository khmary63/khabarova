-- Restrict column-level SELECT on posts so anon/authenticated cannot read
-- internal lead-magnet storage path/filename. service_role (admin) keeps full access.
REVOKE SELECT ON public.posts FROM anon, authenticated;

GRANT SELECT (
  id, excerpt, title, slug, category,
  lead_magnet_button_label, lead_magnet_description, lead_magnet_title, lead_magnet_enabled,
  telegram_posted_at, updated_at, created_at, published_at, published, tags, cover_image_url, content
) ON public.posts TO anon, authenticated;
