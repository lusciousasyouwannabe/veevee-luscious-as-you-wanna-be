CREATE TABLE public.pending_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_reference text NOT NULL UNIQUE,
  checkout_session_id text,
  lines jsonb NOT NULL DEFAULT '[]'::jsonb,
  customer jsonb,
  discount jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_pending_orders_session ON public.pending_orders (checkout_session_id);
CREATE INDEX idx_pending_orders_status ON public.pending_orders (status);

GRANT ALL ON public.pending_orders TO service_role;

ALTER TABLE public.pending_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages pending orders"
ON public.pending_orders FOR ALL
TO service_role
USING (true) WITH CHECK (true);

CREATE TRIGGER update_pending_orders_updated_at
BEFORE UPDATE ON public.pending_orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();