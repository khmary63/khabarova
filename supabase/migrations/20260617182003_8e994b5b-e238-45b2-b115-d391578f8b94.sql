REVOKE SELECT (lead_magnet_file_path, lead_magnet_file_name) ON public.posts FROM anon;
REVOKE SELECT (lead_magnet_file_path, lead_magnet_file_name) ON public.posts FROM authenticated;
GRANT ALL ON public.posts TO service_role;