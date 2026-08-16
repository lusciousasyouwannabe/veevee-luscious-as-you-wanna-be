import { AlertTriangle } from "lucide-react";
import type { ProductRow } from "@/hooks/useProducts";

interface Props {
  rows: ProductRow[];
}

const alertLevel = (qty: number) => {
  if (qty <= 1) return { label: "Critical", tone: "text-destructive border-destructive/40 bg-destructive/10" };
  if (qty <= 5) return { label: "Very low", tone: "text-primary border-primary/40 bg-primary/10" };
  return { label: "Low", tone: "text-muted-foreground border-border bg-secondary" };
};

const InventoryStats = ({ rows }: Props) => {
  const active = rows.filter((r) => r.status === "Active").length;
  const soldOut = rows.filter((r) => r.status === "Out of Stock").length;
  const low = rows.filter((r) => !r.archived && r.quantity > 0 && r.quantity < 5).length;
  const archived = rows.filter((r) => r.archived).length;

  const alerts = rows
    .filter((r) => !r.archived && r.quantity > 0 && r.quantity <= 10)
    .sort((a, b) => a.quantity - b.quantity);

  const cards = [
    { label: "Products Active", value: active },
    { label: "Products Sold Out", value: soldOut },
    { label: "Low Inventory (<5)", value: low },
    { label: "Archived Products", value: archived },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="border border-border rounded-md p-4 bg-card">
            <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground">
              {c.label}
            </p>
            <p className="font-display text-3xl font-bold text-foreground mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {alerts.length > 0 && (
        <div className="border border-border rounded-md p-4 bg-card">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-primary" />
            <h3 className="font-display text-sm font-semibold text-foreground">
              Inventory Alerts ({alerts.length})
            </h3>
          </div>
          <ul className="space-y-2">
            {alerts.map((r) => {
              const level = alertLevel(r.quantity);
              return (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 font-body text-sm"
                >
                  <span className="text-foreground">
                    {r.name}
                    {r.size ? ` · ${r.size}` : ""}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded border ${level.tone}`}>
                    {level.label} — {r.quantity} remaining
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InventoryStats;