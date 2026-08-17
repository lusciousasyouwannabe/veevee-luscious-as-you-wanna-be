import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SubstitutionGroup {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  members: { id: string; product_id: string; preference_order: number }[];
}

export interface BundleComponent {
  id: string;
  bundle_id: string;
  component_type: "product" | "group";
  product_id: string | null;
  group_id: string | null;
  quantity: number;
  substitution_mode: "automatic" | "manual";
  display_label: string | null;
  customer_choice: boolean;
  required: boolean;
  sort_order: number;
}

export interface BundleRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  image_key: string;
  price: number;
  original_price: number | null;
  savings_label: string | null;
  surprise_mode: boolean;
  track_own_inventory: boolean;
  own_quantity: number;
  status: string;
  is_visible: boolean;
  manual_hidden: boolean;
  archived: boolean;
  blocking_item: string | null;
  notes: string | null;
  sort_order: number;
  updated_at: string;
  components: BundleComponent[];
}

/** Fetches bundles with their components. `visibleOnly` powers the storefront. */
export const useBundles = (visibleOnly = true) => {
  const [bundles, setBundles] = useState<BundleRow[]>([]);
  const [groups, setGroups] = useState<SubstitutionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from("bundles")
      .select("*, components:bundle_components(*)")
      .order("sort_order", { ascending: true });
    if (visibleOnly) q = q.eq("is_visible", true).eq("archived", false);

    const [{ data, error: bErr }, groupRes] = await Promise.all([
      q,
      supabase.from("substitution_groups").select("*, members:substitution_group_products(*)").order("name"),
    ]);

    if (bErr) setError(bErr.message);
    else {
      setError(null);
      setBundles(
        ((data as any[]) || []).map((b) => ({
          ...b,
          price: Number(b.price),
          original_price: b.original_price === null ? null : Number(b.original_price),
          components: (b.components || []).sort((a: any, c: any) => a.sort_order - c.sort_order),
        }))
      );
    }
    setGroups(((groupRes.data as any[]) || []) as SubstitutionGroup[]);
    setLoading(false);
  }, [visibleOnly]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { bundles, groups, loading, error, refetch };
};

/** Customer-facing line describing a bundle component. */
export const componentLabel = (
  c: BundleComponent,
  productName: (id: string | null) => string,
  groupName: (id: string | null) => string,
  surprise: boolean
) => {
  if (c.display_label) return c.display_label;
  const qty = c.quantity > 1 ? `${c.quantity}x ` : "";
  if (c.component_type === "product") return `${qty}${productName(c.product_id)}`;
  const g = groupName(c.group_id);
  return surprise ? `${qty}One ${g} (scent may vary)` : `${qty}${g} (your choice of available scents)`;
};
