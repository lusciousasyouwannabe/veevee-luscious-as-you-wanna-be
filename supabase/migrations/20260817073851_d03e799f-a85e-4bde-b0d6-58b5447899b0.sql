REVOKE ALL ON FUNCTION public.resolve_bundle_component(uuid) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.recalc_bundle(uuid) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.recalc_bundles_for_product(uuid) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.tg_products_recalc_bundles() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.tg_bundle_components_recalc() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.tg_group_products_recalc() FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.resolve_bundle_component(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.recalc_bundle(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.recalc_bundles_for_product(uuid) TO service_role;