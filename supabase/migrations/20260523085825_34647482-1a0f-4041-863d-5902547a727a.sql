-- Remove broad SELECT policy that allows listing files in the public bucket.
-- Public CDN URLs (/storage/v1/object/public/blog-images/...) bypass RLS,
-- so blog cover images keep loading via <img src>. Only the listing API is blocked.
DROP POLICY IF EXISTS "Public read blog-images" ON storage.objects;