import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { productImageKeys } from "@/data/productImages";
import type { ProductRow } from "@/hooks/useProducts";
import type { BundleRow, BundleComponent, SubstitutionGroup } from "@/hooks/useBundles";

interface Props {
  bundle: BundleRow | null;
  products: ProductRow[];
  groups: SubstitutionGroup[];
  onClose: () => void;
  onSaved: () => void;
}

type Draft = Partial<BundleRow>;
type CompDraft = Partial<BundleComponent> & { _key: string };

const field = "font-body text-sm bg-background border border-border rounded-md px-3 py-2 w-full";
const labelCls = "font-body text-[11px] tracking-[0.15em] uppercase text-muted-foreground";

const BundleEditDialog = ({ bundle, products, groups, onClose, onSaved }: Props) => {
  const [draft, setDraft] = useState<Draft>({});
  const [comps, setComps] = useState<CompDraft[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!bundle) return;
    setDraft({ ...bundle });
    setComps((bundle.components || []).map((c, i) => ({ ...c, _key: c.id || `c${i}` })));
  }, [bundle]);

  if (!bundle) return null;
  const set = (patch: Draft) => setDraft((d) => ({ ...d, ...patch }));
  const setComp = (key: string, patch: Partial<BundleComponent>) =>
    setComps((list) => list.map((c) => (c._key === key ? { ...c, ...patch } : c)));

  const addComp = () =>
    setComps((list) => [
      ...list,
      {
        _key: `new-${Date.now()}-${list.length}`,
        component_type: "product",
        quantity: 1,
        substitution_mode: "automatic",
        customer_choice: false,
        required: true,
        sort_order: list.length,
      },
    ]);

  const save = async () => {
    if (!draft.name?.trim()) return toast.error("Bundle name is required");
    setBusy(true);
    const payload = {
      name: draft.name,
      slug: (draft.slug || draft.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      description: draft.description || null,
      category: draft.category || "Collections",
      image_key: draft.image_key || "",
      price: Number(draft.price) || 0,
      original_price: draft.original_price ? Number(draft.original_price) : null,
      savings_label: draft.savings_label || null,
      surprise_mode: !!draft.surprise_mode,
      track_own_inventory: !!draft.track_own_inventory,
      own_quantity: Number(draft.own_quantity) || 0,
      manual_hidden: !!draft.manual_hidden,
      notes: draft.notes || null,
      sort_order: Number(draft.sort_order) || 0,
    };

    let bundleId = bundle.id;
    if (bundleId) {
      const { error } = await supabase.from("bundles").update(payload).eq("id", bundleId);
      if (error) { setBusy(false); return toast.error(error.message); }
    } else {
      const { data, error } = await supabase.from("bundles").insert(payload).select("id").single();
      if (error || !data) { setBusy(false); return toast.error(error?.message || "Could not create bundle"); }
      bundleId = data.id;
    }

    // Replace components wholesale — the database recalculates availability.
    await supabase.from("bundle_components").delete().eq("bundle_id", bundleId);
    const rows = comps
      .filter((c) => (c.component_type === "group" ? c.group_id : c.product_id))
      .map((c, i) => ({
        bundle_id: bundleId,
        component_type: c.component_type || "product",
        product_id: c.component_type === "group" ? null : c.product_id || null,
        group_id: c.component_type === "group" ? c.group_id || null : null,
        quantity: Number(c.quantity) || 1,
        substitution_mode: c.substitution_mode || "automatic",
        display_label: c.display_label || null,
        customer_choice: !!c.customer_choice,
        required: c.required !== false,
        sort_order: i,
      }));
    if (rows.length) {
      const { error } = await supabase.from("bundle_components").insert(rows);
      if (error) { setBusy(false); return toast.error(error.message); }
    }

    setBusy(false);
    toast.success("Bundle saved");
    onSaved();
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{bundle.id ? "Edit Bundle" : "New Bundle"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="space-y-1"><span className={labelCls}>Name</span>
            <input className={field} value={draft.name || ""} onChange={(e) => set({ name: e.target.value })} /></label>
          <label className="space-y-1"><span className={labelCls}>Category</span>
            <input className={field} value={draft.category || ""} onChange={(e) => set({ category: e.target.value })} /></label>
          <label className="space-y-1"><span className={labelCls}>Price</span>
            <input type="number" className={field} value={draft.price ?? 0} onChange={(e) => set({ price: Number(e.target.value) })} /></label>
          <label className="space-y-1"><span className={labelCls}>Compare-at price</span>
            <input type="number" className={field} value={draft.original_price ?? ""} onChange={(e) => set({ original_price: e.target.value ? Number(e.target.value) : null })} /></label>
          <label className="space-y-1"><span className={labelCls}>Savings label</span>
            <input className={field} value={draft.savings_label || ""} onChange={(e) => set({ savings_label: e.target.value })} /></label>
          <label className="space-y-1"><span className={labelCls}>Image</span>
            <select className={field} value={draft.image_key || ""} onChange={(e) => set({ image_key: e.target.value })}>
              <option value="">— none —</option>
              {productImageKeys.map((k) => <option key={k} value={k}>{k}</option>)}
            </select></label>
          <label className="space-y-1 sm:col-span-2"><span className={labelCls}>Description</span>
            <textarea rows={2} className={field} value={draft.description || ""} onChange={(e) => set({ description: e.target.value })} /></label>
          <label className="space-y-1 sm:col-span-2"><span className={labelCls}>Admin notes</span>
            <input className={field} value={draft.notes || ""} onChange={(e) => set({ notes: e.target.value })} /></label>

          <label className="flex items-center gap-2 font-body text-sm text-foreground">
            <input type="checkbox" checked={!!draft.surprise_mode} onChange={(e) => set({ surprise_mode: e.target.checked })} />
            Surprise / curated gift box (hide exact scents)
          </label>
          <label className="flex items-center gap-2 font-body text-sm text-foreground">
            <input type="checkbox" checked={!!draft.manual_hidden} onChange={(e) => set({ manual_hidden: e.target.checked })} />
            Manually hidden from storefront
          </label>
          <label className="flex items-center gap-2 font-body text-sm text-foreground">
            <input type="checkbox" checked={!!draft.track_own_inventory} onChange={(e) => set({ track_own_inventory: e.target.checked })} />
            Track separate bundle stock
          </label>
          {draft.track_own_inventory && (
            <label className="space-y-1"><span className={labelCls}>Bundle stock</span>
              <input type="number" className={field} value={draft.own_quantity ?? 0} onChange={(e) => set({ own_quantity: Number(e.target.value) })} /></label>
          )}
        </div>

        {/* Components */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-base font-semibold text-foreground">What's inside</h4>
            <Button size="sm" variant="outline" onClick={addComp}>Add item</Button>
          </div>
          {comps.length === 0 && (
            <p className="font-body text-sm text-muted-foreground">Add at least one item so availability can be tracked.</p>
          )}
          {comps.map((c) => (
            <div key={c._key} className="border border-border rounded-md p-3 grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
              <label className="sm:col-span-3 space-y-1"><span className={labelCls}>Type</span>
                <select className={field} value={c.component_type} onChange={(e) => setComp(c._key, { component_type: e.target.value as any })}>
                  <option value="product">Exact product / variant</option>
                  <option value="group">Substitution group</option>
                </select></label>
              {c.component_type === "group" ? (
                <label className="sm:col-span-4 space-y-1"><span className={labelCls}>Group</span>
                  <select className={field} value={c.group_id || ""} onChange={(e) => setComp(c._key, { group_id: e.target.value })}>
                    <option value="">— select —</option>
                    {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select></label>
              ) : (
                <label className="sm:col-span-4 space-y-1"><span className={labelCls}>Product</span>
                  <select className={field} value={c.product_id || ""} onChange={(e) => setComp(c._key, { product_id: e.target.value })}>
                    <option value="">— select —</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}{p.size ? ` ${p.size}` : ""}</option>
                    ))}
                  </select></label>
              )}
              <label className="sm:col-span-2 space-y-1"><span className={labelCls}>Qty</span>
                <input type="number" min={1} className={field} value={c.quantity ?? 1} onChange={(e) => setComp(c._key, { quantity: Number(e.target.value) })} /></label>
              <label className="sm:col-span-2 space-y-1"><span className={labelCls}>Substitution</span>
                <select className={field} value={c.substitution_mode} onChange={(e) => setComp(c._key, { substitution_mode: e.target.value as any })}>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual approval</option>
                </select></label>
              <div className="sm:col-span-1 flex justify-end">
                <Button size="icon" variant="ghost" onClick={() => setComps((l) => l.filter((x) => x._key !== c._key))}>
                  <Trash2 size={16} />
                </Button>
              </div>
              <label className="sm:col-span-6 space-y-1"><span className={labelCls}>Customer-facing label (optional)</span>
                <input className={field} placeholder="Includes one handcrafted bath bar (scent may vary)"
                  value={c.display_label || ""} onChange={(e) => setComp(c._key, { display_label: e.target.value })} /></label>
              <label className="sm:col-span-3 flex items-center gap-2 font-body text-xs text-foreground">
                <input type="checkbox" checked={!!c.customer_choice} onChange={(e) => setComp(c._key, { customer_choice: e.target.checked })} />
                Customer picks scent
              </label>
              <label className="sm:col-span-3 flex items-center gap-2 font-body text-xs text-foreground">
                <input type="checkbox" checked={c.required !== false} onChange={(e) => setComp(c._key, { required: e.target.checked })} />
                Required for availability
              </label>
            </div>
          ))}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button onClick={save} disabled={busy}>{busy ? "Saving..." : "Save bundle"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BundleEditDialog;
