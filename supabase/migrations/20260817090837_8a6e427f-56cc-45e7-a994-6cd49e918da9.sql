DROP POLICY IF EXISTS "Public read email assets" ON storage.objects;
CREATE POLICY "Public read email assets" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'email-assets');

DROP POLICY IF EXISTS "Admin can upload email assets" ON storage.objects;
CREATE POLICY "Admin can upload email assets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'email-assets' AND (auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');

DROP POLICY IF EXISTS "Admin can update email assets" ON storage.objects;
CREATE POLICY "Admin can update email assets" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'email-assets' AND (auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com')
  WITH CHECK (bucket_id = 'email-assets' AND (auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');

DROP POLICY IF EXISTS "Admin can delete email assets" ON storage.objects;
CREATE POLICY "Admin can delete email assets" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'email-assets' AND (auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');