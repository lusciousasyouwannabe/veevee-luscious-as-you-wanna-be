import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import type { ProductRow } from "@/hooks/useProducts";
import type { SubstitutionGroup } from "@/hooks/useBundles";

const field = "font-body text-sm bg-background border border-border rounded-md px-3 py-2";

interface Props {
  groups: SubstitutionGroup[];
  products: ProductRow[];
  refetch: () => void;
}

const SubstitutionGroups = ({ groups, products, refetch }: Props) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [busy, setBusy] = useState(false);
  const byId = (id: string) => products.find((p) => p.id === id);

  const run = async (fn: () => Promise<{ error: unknown }>, msg: string) => {
    setBusy(true);
    const { error } = await fn();
    setBusy(false);
    if (error) toast.error((error as { message?: string }).message || "Something went wrong");
    else { toast.success(msg); refetch(); }
  };

  const createGroup = () => {
    if (!name.trim()) return toast.error("Give the group a name");
    run(() => supabase.from("substitution_groups").insert({ name: name.trim(), category: category.trim() || null }), "Group created");
    setName(""); setCategory("");
  };

  const addProduct = (groupId: string, productId: string, order: number) => {
    if (!productId) return;
    run(
      () => supabase.from("substitution_group_products").insert({ group_id: groupId, product_id: productId, preference_order: order }),
      "Product added to group"
    );
  };

  const move = (memberId: string, order: number) =>
    run(() => supabase.from("substitution_group_products").update({ preference_order: order }).eq("id", memberId), "Order updated");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3 border border-border rounded-md p-4">
        <input className={field} placeholder="Group name (e.g. Bath Bar Group)" value={name} onChange={(e) => setName(e.target.value)} />
        <input className={field} placeholder="Category (optional)" value={category} onChange={(e) => setCategory(e.target.value)} />
        <Button size="sm" onClick={createGroup} disabled={busy}>Create group</Button>
      </div>

      {groups.length === 0 && (
        <p className="font-body text-sm text-muted-foreground">
          No substitution groups yet. Create one to let bundles swap in any in-stock scent.
        </p>
      )}

      {groups.map((g) => {
        const members = [...(g.members || [])].sort((a, b) => a.preference_order - b.preference_order);
        return (
          <div key={g.id} className="border border-border rounded-md p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="font-display text-base font-semibold text-foreground">{g.name}</h4>
                {g.category && <p className="font-body text-xs text-muted-foreground">{g.category}</p>}
              </div>
              <Button size="sm" variant="ghost" disabled={busy}
                onClick={() => run(() => supabase.from("substitution_groups").delete().eq("id", g.id), "Group deleted")}>
                <Trash2 size={16} />
              </Button>
            </div>

            <ul className="space-y-2">
              {members.map((m, i) => {
                const p = byId(m.product_id);
                return (
                  <li key={m.id} className="flex flex-wrap items-center gap-3 font-body text-sm text-foreground">
                    <span className="text-muted-foreground w-6">{i + 1}.</span>
                    <span className="flex-1 min-w-40">{p ? `${p.name}${p.size ? ` ${p.size}` : ""}` : "Unknown product"}</span>
                    <span className={`text-xs ${p && p.quantity > 0 ? "text-primary" : "text-destructive"}`}>
                      {p ? (p.quantity > 0 ? `${p.quantity} in stock` : "Sold out") : ""}
                    </span>
                    <Button size="sm" variant="ghost" disabled={busy || i === 0} onClick={() => move(m.id, m.preference_order - 1)}>↑</Button>
                    <Button size="sm" variant="ghost" disabled={busy} onClick={() => move(m.id, m.preference_order + 1)}>↓</Button>
                    <Button size="sm" variant="ghost" disabled={busy}
                      onClick={() => run(() => supabase.from("substitution_group_products").delete().eq("id", m.id), "Removed from group")}>
                      <Trash2 size={14} />
                    </Button>
                  </li>
                );
              })}
            </ul>

            <select className={field} value="" disabled={busy}
              onChange={(e) => addProduct(g.id, e.target.value, members.length)}>
              <option value="">+ Add product to this group</option>
              {products
                .filter((p) => !members.some((m) => m.product_id === p.id))
                .map((p) => (
                  <option key={p.id} value={p.id}>{p.name}{p.size ? ` ${p.size}` : ""}</option>
                ))}
            </select>
          </div>
        );
      })}
    </div>
  );
};

export default SubstitutionGroups;
