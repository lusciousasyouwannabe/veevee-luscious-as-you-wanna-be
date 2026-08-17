import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useBundles, type BundleRow } from "@/hooks/useBundles";
import type { ProductRow } from "@/hooks/useProducts";
import BundleEditDialog from "@/components/inventory/BundleEditDialog";
import SubstitutionGroups from "@/components/inventory/SubstitutionGroups";

const fmt = (v: string | null) =>
  v ? new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const emptyBundle = (): BundleRow => ({
  id: "", slug: "", name: "", description: null, category: "Collections", image_key: "",
  price: 0, original_price: null, savings_label: null, surprise_mode: false,
  track_own_inventory: false, own_quantity: 0, status: "Active", is_visible: true,
  manual_hidden: false, archived: false, blocking_item: null, notes: null, sort_order: 0,
  updated_at: new Date().toISOString(), components: [],
});

const BundleManager = ({ products }: { products: ProductRow[] }) => {
  const { bundles, groups, loading, error, refetch } = useBundles(false);
  const [editTarget, setEditTarget] = useState<BundleRow | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const productName = (id: string | null) => {
    const p = products.find((x) => x.id === id);
    return p ? `${p.name}${p.size ? ` ${p.size}` : ""}` : "Unknown product";
  };
  const groupName = (id: string | null) => groups.find((g) => g.id === id)?.name || "Group";

  const unavailable = useMemo(
    () => bundles.filter((b) => !b.archived && b.blocking_item),
    [bundles]
  );

  const run = async (fn: () => PromiseLike<{ error: unknown }>, msg: string) => {
    setBusy(true);
    const { error: err } = await fn();
    setBusy(false);
    if (err) toast.error((err as { message?: string }).message || "Something went wrong");
    else { toast.success(msg); refetch(); }
  };

  const duplicate = async (b: BundleRow) => {
    setBusy(true);
    const suffix = Math.random().toString(36).slice(2, 6);
    const { data, error: err } = await supabase.from("bundles").insert({
      slug: `${b.slug}-copy-${suffix}`, name: `${b.name} (Copy)`, description: b.description,
      category: b.category, image_key: b.image_key, price: b.price, original_price: b.original_price,
      savings_label: b.savings_label, surprise_mode: b.surprise_mode,
      track_own_inventory: b.track_own_inventory, own_quantity: 0, manual_hidden: true,
      notes: b.notes, sort_order: b.sort_order,
    }).select("id").single();
    if (err || !data) { setBusy(false); return toast.error(err?.message || "Could not duplicate"); }
    if (b.components.length) {
      await supabase.from("bundle_components").insert(
        b.components.map((c, i) => ({
          bundle_id: data.id, component_type: c.component_type, product_id: c.product_id,
          group_id: c.group_id, quantity: c.quantity, substitution_mode: c.substitution_mode,
          display_label: c.display_label, customer_choice: c.customer_choice, required: c.required,
          sort_order: i,
        }))
      );
    }
    setBusy(false);
    toast.success("Bundle duplicated as a hidden draft");
    refetch();
  };

  if (loading) return <p className="font-body text-muted-foreground text-center py-10">Loading bundles...</p>;
  if (error) return <p className="font-body text-destructive text-center py-10">Could not load bundles: {error}</p>;

  return (
    <Tabs defaultValue="bundles" className="space-y-4">
      <TabsList>
        <TabsTrigger value="bundles">Bundles</TabsTrigger>
        <TabsTrigger value="groups">Substitution Groups</TabsTrigger>
      </TabsList>

      <TabsContent value="bundles" className="space-y-4">
        {unavailable.length > 0 && (
          <div className="border border-destructive/40 bg-destructive/10 rounded-md p-4 space-y-1">
            {unavailable.map((b) => (
              <p key={b.id} className="font-body text-sm text-destructive flex items-center gap-2">
                <AlertTriangle size={14} />
                {b.name} is unavailable because {b.blocking_item} is out of stock.
              </p>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <Button size="sm" onClick={() => setEditTarget(emptyBundle())}>New bundle</Button>
        </div>

        <div className="overflow-x-auto border border-border rounded-md">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-secondary">
              <tr className="font-body text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
                {["Bundle", "Included", "Availability", "Blocking Item", "Last Updated", ""].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bundles.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center font-body text-sm text-muted-foreground">
                  No bundles yet. Create one to link it to your product inventory.
                </td></tr>
              )}
              {bundles.map((b) => (
                <tr key={b.id} className="border-t border-border align-top">
                  <td className="px-4 py-3">
                    <p className="font-body text-sm font-semibold text-foreground">{b.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{b.category} · ${b.price}</p>
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-muted-foreground">
                    <ul className="space-y-0.5">
                      {b.components.map((c) => (
                        <li key={c.id}>
                          {c.quantity}x {c.component_type === "group" ? `${groupName(c.group_id)} (group)` : productName(c.product_id)}
                          {c.substitution_mode === "manual" && c.component_type === "group" ? " · manual approval" : ""}
                        </li>
                      ))}
                      {b.components.length === 0 && <li>No components</li>}
                    </ul>
                    {expanded === b.id && (
                      <ul className="mt-2 space-y-0.5 text-foreground">
                        {b.components.map((c) => {
                          if (c.component_type === "product") {
                            const p = products.find((x) => x.id === c.product_id);
                            return <li key={c.id}>{productName(c.product_id)} — {p ? `${p.quantity} in stock` : "missing"}</li>;
                          }
                          const g = groups.find((x) => x.id === c.group_id);
                          return (
                            <li key={c.id}>
                              {groupName(c.group_id)}:{" "}
                              {(g?.members || [])
                                .map((m) => products.find((p) => p.id === m.product_id))
                                .filter(Boolean)
                                .map((p) => `${p!.name}${p!.size ? ` ${p!.size}` : ""} (${p!.quantity})`)
                                .join(", ") || "no members"}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-body text-[11px] uppercase tracking-wider px-2 py-1 border rounded ${
                      b.archived ? "border-border text-muted-foreground bg-secondary"
                      : b.blocking_item ? "border-destructive/40 text-destructive bg-destructive/10"
                      : b.manual_hidden ? "border-border text-muted-foreground bg-secondary"
                      : "border-primary/40 text-primary bg-primary/10"}`}>
                      {b.archived ? "Archived" : b.blocking_item ? "Unavailable" : b.manual_hidden ? "Hidden" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-muted-foreground">{b.blocking_item || "—"}</td>
                  <td className="px-4 py-3 font-body text-xs text-muted-foreground">{fmt(b.updated_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost"><MoreHorizontal size={16} /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditTarget(b)}>Edit bundle</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicate(b)}>Duplicate bundle</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setExpanded(expanded === b.id ? null : b.id)}>
                          {expanded === b.id ? "Hide" : "View"} component inventory
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {b.archived ? (
                          <DropdownMenuItem disabled={busy}
                            onClick={() => run(() => supabase.from("bundles").update({ archived: false, manual_hidden: false }).eq("id", b.id), "Bundle restored")}>
                            Restore bundle
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem disabled={busy}
                            onClick={() => run(() => supabase.from("bundles").update({ archived: true, is_visible: false, status: "Archived" }).eq("id", b.id), "Bundle archived")}>
                            Archive bundle
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="groups">
        <SubstitutionGroups groups={groups} products={products} refetch={refetch} />
      </TabsContent>

      {editTarget && (
        <BundleEditDialog
          bundle={editTarget}
          products={products}
          groups={groups}
          onClose={() => setEditTarget(null)}
          onSaved={refetch}
        />
      )}
    </Tabs>
  );
};

export default BundleManager;
