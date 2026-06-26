DROP POLICY IF EXISTS "Public read for public buckets" ON storage.objects;
CREATE POLICY "Public read for public buckets"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id IN ('blog-images', 'portfolio-images'));

DROP POLICY IF EXISTS "Service role manages storage objects" ON storage.objects;
CREATE POLICY "Service role manages storage objects"
ON storage.objects
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);