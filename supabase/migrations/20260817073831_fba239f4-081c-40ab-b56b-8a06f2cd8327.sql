-- ============ Substitution groups ============
CREATE TABLE public.substitution_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.substitution_groups TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.substitution_groups TO authenticated;
GRANT ALL ON public.substitution_groups TO service_role;
ALTER TABLE public.substitution_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view substitution groups" ON public.substitution_groups FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin can manage substitution groups" ON public.substitution_groups FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');

CREATE TABLE public.substitution_group_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.substitution_groups(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  preference_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, product_id)
);
GRANT SELECT ON public.substitution_group_products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.substitution_group_products TO authenticated;
GRANT ALL ON public.substitution_group_products TO service_role;
ALTER TABLE public.substitution_group_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view group products" ON public.substitution_group_products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin can manage group products" ON public.substitution_group_products FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');

-- ============ Bundles ============
CREATE TABLE public.bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'Collections',
  image_key text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  original_price numeric,
  savings_label text,
  surprise_mode boolean NOT NULL DEFAULT false,
  track_own_inventory boolean NOT NULL DEFAULT false,
  own_quantity integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Active',
  is_visible boolean NOT NULL DEFAULT true,
  manual_hidden boolean NOT NULL DEFAULT false,
  archived boolean NOT NULL DEFAULT false,
  blocking_item text,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.bundles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bundles TO authenticated;
GRANT ALL ON public.bundles TO service_role;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view available bundles" ON public.bundles FOR SELECT TO anon, authenticated USING (is_visible = true AND archived = false);
CREATE POLICY "Admin can view all bundles" ON public.bundles FOR SELECT TO authenticated USING ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');
CREATE POLICY "Admin can manage bundles" ON public.bundles FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');
CREATE TRIGGER update_bundles_updated_at BEFORE UPDATE ON public.bundles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Bundle components ============
CREATE TABLE public.bundle_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id uuid NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
  component_type text NOT NULL DEFAULT 'product',
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  group_id uuid REFERENCES public.substitution_groups(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  substitution_mode text NOT NULL DEFAULT 'automatic',
  display_label text,
  customer_choice boolean NOT NULL DEFAULT false,
  required boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.bundle_components TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.bundle_components TO authenticated;
GRANT ALL ON public.bundle_components TO service_role;
ALTER TABLE public.bundle_components ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view bundle components" ON public.bundle_components FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin can manage bundle components" ON public.bundle_components FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');
CREATE TRIGGER update_bundle_components_updated_at BEFORE UPDATE ON public.bundle_components
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_bundle_components_bundle ON public.bundle_components(bundle_id);
CREATE INDEX idx_bundle_components_product ON public.bundle_components(product_id);
CREATE INDEX idx_group_products_product ON public.substitution_group_products(product_id);

-- ============ Bundle fulfillment log (which substitute shipped) ============
CREATE TABLE public.bundle_fulfillments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id uuid REFERENCES public.bundles(id) ON DELETE SET NULL,
  bundle_name text NOT NULL,
  order_reference text,
  selections jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.bundle_fulfillments TO authenticated;
GRANT ALL ON public.bundle_fulfillments TO service_role;
ALTER TABLE public.bundle_fulfillments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can view fulfillments" ON public.bundle_fulfillments FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');

-- ============ Availability engine ============
-- Resolves the best in-stock product for a component (exact product, or the
-- preferred available member of its substitution group).
CREATE OR REPLACE FUNCTION public.resolve_bundle_component(_component_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN c.component_type = 'product' THEN (
      SELECT p.id FROM public.products p
      WHERE p.id = c.product_id AND p.archived = false AND p.quantity >= c.quantity
    )
    ELSE (
      SELECT p.id
      FROM public.substitution_group_products sgp
      JOIN public.products p ON p.id = sgp.product_id
      WHERE sgp.group_id = c.group_id AND p.archived = false AND p.quantity >= c.quantity
      ORDER BY sgp.preference_order ASC, p.name ASC
      LIMIT 1
    )
  END
  FROM public.bundle_components c
  WHERE c.id = _component_id;
$$;

CREATE OR REPLACE FUNCTION public.recalc_bundle(_bundle_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  b public.bundles%ROWTYPE;
  c public.bundle_components%ROWTYPE;
  resolved uuid;
  blocker text := NULL;
  has_components boolean := false;
BEGIN
  SELECT * INTO b FROM public.bundles WHERE id = _bundle_id;
  IF NOT FOUND OR b.archived THEN
    RETURN;
  END IF;

  FOR c IN SELECT * FROM public.bundle_components WHERE bundle_id = _bundle_id AND required = true ORDER BY sort_order LOOP
    has_components := true;
    resolved := public.resolve_bundle_component(c.id);
    IF resolved IS NULL THEN
      blocker := COALESCE(
        (SELECT p.name || COALESCE(' ' || p.size, '') FROM public.products p WHERE p.id = c.product_id),
        (SELECT g.name FROM public.substitution_groups g WHERE g.id = c.group_id),
        c.display_label,
        'Unknown component'
      );
      EXIT;
    END IF;
  END LOOP;

  IF b.track_own_inventory AND b.own_quantity <= 0 THEN
    blocker := COALESCE(blocker, 'Bundle stock');
  END IF;

  UPDATE public.bundles
  SET blocking_item = blocker,
      status = CASE
        WHEN blocker IS NOT NULL THEN 'Out of Stock'
        WHEN manual_hidden THEN 'Hidden'
        ELSE 'Active' END,
      is_visible = (blocker IS NULL AND NOT manual_hidden AND has_components),
      updated_at = now()
  WHERE id = _bundle_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.recalc_bundles_for_product(_product_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE bid uuid;
BEGIN
  FOR bid IN
    SELECT DISTINCT c.bundle_id
    FROM public.bundle_components c
    LEFT JOIN public.substitution_group_products sgp ON sgp.group_id = c.group_id
    WHERE c.product_id = _product_id OR sgp.product_id = _product_id
  LOOP
    PERFORM public.recalc_bundle(bid);
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.tg_products_recalc_bundles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.recalc_bundles_for_product(NEW.id);
  RETURN NULL;
END;
$$;

CREATE TRIGGER products_recalc_bundles
AFTER INSERT OR UPDATE OF quantity, archived, is_visible ON public.products
FOR EACH ROW EXECUTE FUNCTION public.tg_products_recalc_bundles();

CREATE OR REPLACE FUNCTION public.tg_bundle_components_recalc()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.recalc_bundle(COALESCE(NEW.bundle_id, OLD.bundle_id));
  RETURN NULL;
END;
$$;

CREATE TRIGGER bundle_components_recalc
AFTER INSERT OR UPDATE OR DELETE ON public.bundle_components
FOR EACH ROW EXECUTE FUNCTION public.tg_bundle_components_recalc();

CREATE OR REPLACE FUNCTION public.tg_group_products_recalc()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE bid uuid;
BEGIN
  FOR bid IN SELECT DISTINCT bundle_id FROM public.bundle_components
             WHERE group_id = COALESCE(NEW.group_id, OLD.group_id) LOOP
    PERFORM public.recalc_bundle(bid);
  END LOOP;
  RETURN NULL;
END;
$$;

CREATE TRIGGER group_products_recalc
AFTER INSERT OR UPDATE OR DELETE ON public.substitution_group_products
FOR EACH ROW EXECUTE FUNCTION public.tg_group_products_recalc();

-- ============ Deduction on purchase ============
CREATE OR REPLACE FUNCTION public.deduct_bundle_inventory(_bundle_id uuid, _qty integer DEFAULT 1, _order_reference text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  b public.bundles%ROWTYPE;
  c public.bundle_components%ROWTYPE;
  resolved uuid;
  picks jsonb := '[]'::jsonb;
  need integer;
BEGIN
  SELECT * INTO b FROM public.bundles WHERE id = _bundle_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Bundle not found';
  END IF;

  FOR c IN SELECT * FROM public.bundle_components WHERE bundle_id = _bundle_id AND required = true ORDER BY sort_order LOOP
    need := c.quantity * _qty;
    IF c.component_type = 'product' THEN
      SELECT p.id INTO resolved FROM public.products p
      WHERE p.id = c.product_id AND p.quantity >= need FOR UPDATE;
    ELSE
      SELECT p.id INTO resolved
      FROM public.substitution_group_products sgp
      JOIN public.products p ON p.id = sgp.product_id
      WHERE sgp.group_id = c.group_id AND p.archived = false AND p.quantity >= need
      ORDER BY sgp.preference_order ASC, p.name ASC
      LIMIT 1 FOR UPDATE OF p;
    END IF;

    IF resolved IS NULL THEN
      RAISE EXCEPTION 'Insufficient inventory for bundle component %', COALESCE(c.display_label, c.id::text);
    END IF;

    UPDATE public.products SET quantity = quantity - need WHERE id = resolved;
    picks := picks || jsonb_build_object(
      'component_id', c.id,
      'product_id', resolved,
      'product_name', (SELECT name || COALESCE(' ' || size, '') FROM public.products WHERE id = resolved),
      'quantity', need
    );
  END LOOP;

  IF b.track_own_inventory THEN
    UPDATE public.bundles SET own_quantity = GREATEST(own_quantity - _qty, 0) WHERE id = _bundle_id;
  END IF;

  INSERT INTO public.bundle_fulfillments (bundle_id, bundle_name, order_reference, selections)
  VALUES (_bundle_id, b.name, _order_reference, picks);

  PERFORM public.recalc_bundle(_bundle_id);
  RETURN picks;
END;
$$;

REVOKE ALL ON FUNCTION public.deduct_bundle_inventory(uuid, integer, text) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.deduct_bundle_inventory(uuid, integer, text) TO service_role;