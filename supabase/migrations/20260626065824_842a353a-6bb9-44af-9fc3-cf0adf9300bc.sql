REVOKE SELECT ON public.posts FROM anon, authenticated;

GRANT SELECT (
  id, slug, title, excerpt, content, cover_image_url, tags, published,
  published_at, created_at, updated_at, telegram_posted_at,
  lead_magnet_enabled, lead_magnet_title, lead_magnet_description,
  lead_magnet_button_label, category
) ON public.posts TO anon, authenticated;