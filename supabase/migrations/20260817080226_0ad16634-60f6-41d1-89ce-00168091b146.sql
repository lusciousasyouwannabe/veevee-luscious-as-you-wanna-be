CREATE TABLE public.processed_orders (
  id uuid primary key default gen_random_uuid(),
  order_reference text not null unique,
  line_items jsonb not null default '[]'::jsonb,
  result jsonb,
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.processed_orders TO authenticated;
GRANT ALL ON public.processed_orders TO service_role;
ALTER TABLE public.processed_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can view processed orders" ON public.processed_orders
  FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'email') = 'lusciousasyouwannabe@gmail.com');