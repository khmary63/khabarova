-- Create public bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public read access
CREATE POLICY "Public can read blog images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');