CREATE POLICY "Admin can view signups" ON public.newsletter_signups
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' = 'lusciousasyouwannabe@gmail.com');