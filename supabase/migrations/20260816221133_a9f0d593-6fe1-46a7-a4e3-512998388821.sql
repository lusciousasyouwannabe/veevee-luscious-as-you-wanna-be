CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  size text,
  variant_key text,
  image_key text NOT NULL,
  stock_quantity integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published products"
ON public.products FOR SELECT
TO anon, authenticated
USING (is_published = true);

CREATE POLICY "Admin can view all products"
ON public.products FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');

CREATE POLICY "Admin can insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');

CREATE POLICY "Admin can update products"
ON public.products FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');

CREATE POLICY "Admin can delete products"
ON public.products FOR DELETE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX products_category_idx ON public.products (category, sort_order);