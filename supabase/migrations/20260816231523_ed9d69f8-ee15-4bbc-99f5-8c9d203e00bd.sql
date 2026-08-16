-- 1. Extend products
ALTER TABLE public.products RENAME COLUMN stock_quantity TO quantity;
ALTER TABLE public.products RENAME COLUMN is_published TO is_visible;

ALTER TABLE public.products
  ADD COLUMN sku text,
  ADD COLUMN description text,
  ADD COLUMN ingredients text,
  ADD COLUMN tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN notes text,
  ADD COLUMN seo_title text,
  ADD COLUMN seo_description text,
  ADD COLUMN status text NOT NULL DEFAULT 'Active',
  ADD COLUMN archived boolean NOT NULL DEFAULT false,
  ADD COLUMN manual_hidden boolean NOT NULL DEFAULT false,
  ADD COLUMN sold_out_at timestamptz,
  ADD COLUMN restocked_at timestamptz,
  ADD COLUMN last_production_date date;

-- preserve currently hidden products as manually hidden
UPDATE public.products SET manual_hidden = true WHERE is_visible = false;

-- backfill SKUs from slug
UPDATE public.products SET sku = upper(replace(slug, '-', '_')) WHERE sku IS NULL;
CREATE UNIQUE INDEX products_sku_key ON public.products (sku) WHERE sku IS NOT NULL;

-- 2. Inventory history log
CREATE TABLE public.inventory_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  sku text,
  action text NOT NULL,
  quantity_before integer,
  quantity_after integer,
  quantity_added integer NOT NULL DEFAULT 0,
  quantity_sold integer NOT NULL DEFAULT 0,
  status_after text,
  changed_by uuid,
  changed_by_email text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.inventory_log TO authenticated;
GRANT ALL ON public.inventory_log TO service_role;
ALTER TABLE public.inventory_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view inventory log"
  ON public.inventory_log FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');

CREATE POLICY "Admin can insert inventory log"
  ON public.inventory_log FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');

CREATE INDEX inventory_log_product_id_idx ON public.inventory_log (product_id);
CREATE INDEX inventory_log_created_at_idx ON public.inventory_log (created_at DESC);

-- 3. Derive status / visibility from quantity, archived, manual_hidden
CREATE OR REPLACE FUNCTION public.sync_product_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.archived THEN
    NEW.status := 'Archived';
    NEW.is_visible := false;
  ELSIF NEW.quantity <= 0 THEN
    NEW.status := 'Out of Stock';
    NEW.is_visible := false;
    IF NEW.sold_out_at IS NULL OR (TG_OP = 'UPDATE' AND OLD.quantity > 0) THEN
      NEW.sold_out_at := now();
    END IF;
  ELSIF NEW.manual_hidden THEN
    NEW.status := 'Hidden';
    NEW.is_visible := false;
  ELSE
    NEW.status := 'Active';
    NEW.is_visible := true;
    IF TG_OP = 'UPDATE' AND OLD.quantity <= 0 THEN
      NEW.restocked_at := now();
      NEW.sold_out_at := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_sync_status
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.sync_product_status();

-- 4. Automatic history logging
CREATE OR REPLACE FUNCTION public.log_inventory_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_action text;
  v_added integer := 0;
  v_sold integer := 0;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'created';
    v_added := GREATEST(NEW.quantity, 0);
  ELSE
    IF NEW.quantity > OLD.quantity THEN
      v_action := 'restocked';
      v_added := NEW.quantity - OLD.quantity;
    ELSIF NEW.quantity < OLD.quantity THEN
      v_action := CASE WHEN NEW.quantity <= 0 THEN 'sold_out' ELSE 'quantity_decreased' END;
      v_sold := OLD.quantity - NEW.quantity;
    ELSIF NEW.archived IS DISTINCT FROM OLD.archived THEN
      v_action := CASE WHEN NEW.archived THEN 'archived' ELSE 'unarchived' END;
    ELSIF NEW.manual_hidden IS DISTINCT FROM OLD.manual_hidden THEN
      v_action := CASE WHEN NEW.manual_hidden THEN 'hidden' ELSE 'restored' END;
    ELSE
      RETURN NULL;
    END IF;
  END IF;

  INSERT INTO public.inventory_log (
    product_id, product_name, sku, action, quantity_before, quantity_after,
    quantity_added, quantity_sold, status_after, changed_by, changed_by_email
  ) VALUES (
    NEW.id, NEW.name, NEW.sku, v_action,
    CASE WHEN TG_OP = 'UPDATE' THEN OLD.quantity ELSE NULL END,
    NEW.quantity, v_added, v_sold, NEW.status,
    auth.uid(), (auth.jwt() ->> 'email')
  );

  RETURN NULL;
END;
$$;

CREATE TRIGGER products_log_inventory
AFTER INSERT OR UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.log_inventory_change();
