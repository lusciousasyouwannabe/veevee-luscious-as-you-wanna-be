import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LogRow {
  id: string;
  product_name: string;
  sku: string | null;
  action: string;
  quantity_before: number | null;
  quantity_after: number | null;
  quantity_added: number;
  quantity_sold: number;
  status_after: string | null;
  changed_by_email: string | null;
  created_at: string;
}

const fmt = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

const actionLabels: Record<string, string> = {
  created: "Created",
  restocked: "Restocked",
  sold_out: "Sold Out",
  quantity_decreased: "Quantity Reduced",
  archived: "Archived",
  unarchived: "Unarchived",
  hidden: "Hidden",
  restored: "Restored",
};

const InventoryHistory = () => {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("inventory_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      setLogs((data as LogRow[]) || []);
      setLoading(false);
    })();
  }, []);

  const filtered = logs.filter(
    (l) =>
      !search ||
      l.product_name.toLowerCase().includes(search.toLowerCase()) ||
      (l.sku || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return <p className="font-body text-muted-foreground text-center py-10">Loading history...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="font-body text-sm text-muted-foreground">
          Permanent record of every inventory change. Nothing here is ever deleted.
        </p>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product or SKU"
          className="font-body text-sm bg-background border border-border rounded-md px-3 py-2 w-56"
        />
      </div>

      <div className="border border-border rounded-md overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-secondary">
            <tr>
              {["Date", "Product", "SKU", "Change", "Added", "Sold", "Current Qty", "Status", "User"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left font-body font-semibold text-xs uppercase tracking-wider text-muted-foreground px-4 py-3 whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="font-body text-sm text-muted-foreground text-center py-8">
                  No history entries yet.
                </td>
              </tr>
            )}
            {filtered.map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="px-4 py-3 font-body text-sm text-muted-foreground whitespace-nowrap">
                  {fmt(l.created_at)}
                </td>
                <td className="px-4 py-3 font-body text-sm text-foreground">{l.product_name}</td>
                <td className="px-4 py-3 font-body text-xs text-muted-foreground">{l.sku || "—"}</td>
                <td className="px-4 py-3 font-body text-sm text-foreground">
                  {actionLabels[l.action] || l.action}
                </td>
                <td className="px-4 py-3 font-body text-sm text-muted-foreground">
                  {l.quantity_added || "—"}
                </td>
                <td className="px-4 py-3 font-body text-sm text-muted-foreground">
                  {l.quantity_sold || "—"}
                </td>
                <td className="px-4 py-3 font-body text-sm text-foreground">{l.quantity_after ?? "—"}</td>
                <td className="px-4 py-3 font-body text-sm text-muted-foreground">
                  {l.status_after || "—"}
                </td>
                <td className="px-4 py-3 font-body text-xs text-muted-foreground">
                  {l.changed_by_email || "system"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryHistory;