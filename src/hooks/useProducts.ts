import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveProductImage } from "@/data/productImages";

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  size: string | null;
  variant_key: string | null;
  image_key: string;
  quantity: number;
  is_visible: boolean;
  status: string;
  archived: boolean;
  manual_hidden: boolean;
  sku: string | null;
  description: string | null;
  ingredients: string | null;
  tags: string[];
  notes: string | null;
  seo_title: string | null;
  seo_description: string | null;
  sold_out_at: string | null;
  restocked_at: string | null;
  last_production_date: string | null;
  sort_order: number;
}

export interface ShopCard {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  hasVariants: boolean;
  variantKey?: string;
}

export interface VariantGroup {
  name: string;
  category: string;
  sizes: { size: string; price: number; image: string; id: string }[];
}

const mapRow = (r: any): ProductRow => ({ ...r, price: Number(r.price), tags: r.tags || [] });

/** Fetches inventory rows. `visibleOnly` powers the storefront. */
export const useProducts = (visibleOnly = true) => {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("products").select("*").order("sort_order", { ascending: true });
    if (visibleOnly) query = query.eq("is_visible", true).gt("quantity", 0);
    const { data, error } = await query;
    if (error) setError(error.message);
    else {
      setError(null);
      setRows((data || []).map(mapRow));
    }
    setLoading(false);
  }, [visibleOnly]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { rows, loading, error, refetch, setRows };
};

/** Turns flat inventory rows into shop cards + variant groups. */
export const buildCatalog = (rows: ProductRow[]) => {
  const cards: ShopCard[] = [];
  const groups: Record<string, VariantGroup> = {};

  for (const row of rows) {
    const image = resolveProductImage(row.image_key);
    if (!row.variant_key) {
      cards.push({
        id: row.slug,
        name: row.name,
        category: row.category,
        price: row.price,
        image,
        hasVariants: false,
      });
      continue;
    }

    if (!groups[row.variant_key]) {
      groups[row.variant_key] = { name: row.name, category: row.category, sizes: [] };
      cards.push({
        id: row.variant_key,
        name: row.name,
        category: row.category,
        price: row.price,
        image,
        hasVariants: true,
        variantKey: row.variant_key,
      });
    }
    groups[row.variant_key].sizes.push({
      size: row.size || "",
      price: row.price,
      image,
      id: row.slug,
    });
  }

  const categories = Array.from(new Set(cards.map((c) => c.category)));
  return { cards, groups, categories };
};
