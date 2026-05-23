
-- 1. Bookings: only allow status='pending' on insert from clients
DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;
CREATE POLICY "Anyone can create a booking"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) >= 1 AND length(name) <= 100
  AND length(phone) >= 3 AND length(phone) <= 50
  AND source = ANY (ARRAY['ai_chat','widget','form'])
  AND status = 'pending'
);

-- 2. Storage: public read of blog-images, deny all client writes (service role bypasses RLS)
DROP POLICY IF EXISTS "Public read blog-images" ON storage.objects;
CREATE POLICY "Public read blog-images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "Deny client insert blog-images" ON storage.objects;
CREATE POLICY "Deny client insert blog-images"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id <> 'blog-images');

DROP POLICY IF EXISTS "Deny client update blog-images" ON storage.objects;
CREATE POLICY "Deny client update blog-images"
ON storage.objects
FOR UPDATE
TO anon, authenticated
USING (bucket_id <> 'blog-images')
WITH CHECK (bucket_id <> 'blog-images');

DROP POLICY IF EXISTS "Deny client delete blog-images" ON storage.objects;
CREATE POLICY "Deny client delete blog-images"
ON storage.objects
FOR DELETE
TO anon, authenticated
USING (bucket_id <> 'blog-images');
