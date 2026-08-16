import { useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { useProducts, type ProductRow } from "@/hooks/useProducts";
import { resolveProductImage } from "@/data/productImages";

const InventoryManager = () => {
  const { rows, loading, error, refetch, setRows } = useProducts(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [onlyUnpublished, setOnlyUnpublished] = useState(false);
  const [search, setSearch] = useState("");

  const grouped = useMemo(() => {
    const filtered = rows.filter((r) => {
      if (onlyUnpublished && r.is_published) return false;
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    const map = new Map<string, ProductRow[]>();
    for (const r of filtered) {
      if (!map.has(r.category)) map.set(r.category, []);
      map.get(r.category)!.push(r);
    }
    return Array.from(map.entries());
  }, [rows, onlyUnpublished, search]);

  const patch = async (row: ProductRow, changes: Partial<ProductRow>) => {
    setSavingId(row.id);
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, ...changes } : r)));
    const { error } = await supabase.from("products").update(changes as any).eq("id", row.id);
    setSavingId(null);
    if (error) {
      toast.error("Could not save change");
      refetch();
    }
  };

  if (loading) return <p className="font-body text-muted-foreground text-center py-10">Loading inventory...</p>;
  if (error)
    return (
      <p className="font-body text-destructive text-center py-10">
        Could not load inventory: {error}
      </p>
    );

  const publishedCount = rows.filter((r) => r.is_published).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-body text-sm text-muted-foreground">
          {rows.length} items · {publishedCount} live in the Shop
        </p>
        <div className="flex items-center gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="font-body text-sm bg-background border border-border rounded-md px-3 py-2 w-52"
          />
          <label className="flex items-center gap-2 font-body text-sm text-muted-foreground">
            <Switch checked={onlyUnpublished} onCheckedChange={setOnlyUnpublished} />
            Hidden only
          </label>
        </div>
      </div>

      {grouped.length === 0 && (
        <p className="font-body text-muted-foreground text-center py-10">No products match.</p>
      )}

      {grouped.map(([category, items]) => (
        <div key={category} className="border border-border rounded-md overflow-hidden">
          <div className="bg-secondary px-5 py-3">
            <h3 className="font-display text-base font-semibold text-foreground">{category}</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Product", "Size", "Price", "Stock", "In Shop"].map((h) => (
                  <th
                    key={h}
                    className="text-left font-body font-semibold text-xs uppercase tracking-wider text-muted-foreground px-5 py-2"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className={`border-t border-border ${savingId === row.id ? "opacity-60" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={resolveProductImage(row.image_key)}
                        alt={row.name}
                        className="w-10 h-10 object-cover rounded"
                        loading="lazy"
                      />
                      <span className="font-body text-sm text-foreground">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-body text-sm text-muted-foreground">{row.size || "—"}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-body text-sm text-muted-foreground">$</span>
                      <input
                        type="number"
                        min={0}
                        step="1"
                        defaultValue={row.price}
                        onBlur={(e) => {
                          const value = Number(e.target.value);
                          if (!Number.isNaN(value) && value !== row.price) patch(row, { price: value });
                        }}
                        className="font-body text-sm bg-background border border-border rounded px-2 py-1 w-20"
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <input
                      type="number"
                      min={0}
                      step="1"
                      defaultValue={row.stock_quantity}
                      onBlur={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (!Number.isNaN(value) && value !== row.stock_quantity)
                          patch(row, { stock_quantity: value });
                      }}
                      className="font-body text-sm bg-background border border-border rounded px-2 py-1 w-20"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <Switch
                      checked={row.is_published}
                      onCheckedChange={(checked) => patch(row, { is_published: checked })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default InventoryManager;
