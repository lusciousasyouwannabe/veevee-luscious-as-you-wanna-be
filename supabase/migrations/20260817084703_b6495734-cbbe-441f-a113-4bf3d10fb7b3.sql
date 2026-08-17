CREATE TABLE public.discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text,
  discount_type text NOT NULL DEFAULT 'percentage',
  amount numeric NOT NULL DEFAULT 10,
  expires_at timestamptz,
  min_purchase numeric NOT NULL DEFAULT 0,
  eligible_categories text[] NOT NULL DEFAULT '{}',
  excluded_slugs text[] NOT NULL DEFAULT '{}',
  stackable boolean NOT NULL DEFAULT false,
  first_order_only boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discount_codes TO authenticated;
GRANT ALL ON public.discount_codes TO service_role;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can manage discount codes" ON public.discount_codes FOR ALL TO authenticated
USING ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');

CREATE TABLE public.customer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  user_id uuid,
  phone text,
  shipping_address text,
  billing_address text,
  newsletter_subscriber boolean NOT NULL DEFAULT false,
  welcome_discount_sent boolean NOT NULL DEFAULT false,
  welcome_discount_sent_at timestamptz,
  redemption_date timestamptz,
  first_order_date timestamptz,
  completed_orders integer NOT NULL DEFAULT 0,
  flagged_for_review boolean NOT NULL DEFAULT false,
  flag_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX customer_profiles_email_key ON public.customer_profiles (lower(email));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_profiles TO authenticated;
GRANT ALL ON public.customer_profiles TO service_role;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can manage customer profiles" ON public.customer_profiles FOR ALL TO authenticated
USING ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');

CREATE TABLE public.discount_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  email text NOT NULL,
  customer_id uuid REFERENCES public.customer_profiles(id) ON DELETE SET NULL,
  order_reference text,
  phone text,
  shipping_address text,
  billing_address text,
  discount_amount numeric NOT NULL DEFAULT 0,
  order_subtotal numeric NOT NULL DEFAULT 0,
  flagged boolean NOT NULL DEFAULT false,
  flag_reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX discount_redemptions_code_email_key ON public.discount_redemptions (code, lower(email));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discount_redemptions TO authenticated;
GRANT ALL ON public.discount_redemptions TO service_role;
ALTER TABLE public.discount_redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can manage redemptions" ON public.discount_redemptions FOR ALL TO authenticated
USING ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');

CREATE TRIGGER update_discount_codes_updated_at BEFORE UPDATE ON public.discount_codes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON public.customer_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.discount_codes (code, description, discount_type, amount, min_purchase, first_order_only)
VALUES ('LUSCIOUS10', 'Welcome offer - 10% off your first order', 'percentage', 10, 0, true);

-- Merge any existing newsletter signups into customer profiles
INSERT INTO public.customer_profiles (email, newsletter_subscriber, welcome_discount_sent, welcome_discount_sent_at, created_at)
SELECT DISTINCT ON (lower(email)) email, true, true, created_at, created_at
FROM public.newsletter_signups
ORDER BY lower(email), created_at ASC
ON CONFLICT DO NOTHING;