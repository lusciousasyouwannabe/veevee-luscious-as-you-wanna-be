
CREATE TABLE public.email_template_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name text NOT NULL UNIQUE,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.email_template_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view template settings"
  ON public.email_template_settings
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'email'::text) = 'lusciousasyouwannabe@gmail.com'::text);

CREATE POLICY "Admin can update template settings"
  ON public.email_template_settings
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'email'::text) = 'lusciousasyouwannabe@gmail.com'::text)
  WITH CHECK ((auth.jwt() ->> 'email'::text) = 'lusciousasyouwannabe@gmail.com'::text);

CREATE POLICY "Admin can insert template settings"
  ON public.email_template_settings
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'email'::text) = 'lusciousasyouwannabe@gmail.com'::text);

CREATE POLICY "Service role can read template settings"
  ON public.email_template_settings
  FOR SELECT
  USING (auth.role() = 'service_role'::text);
