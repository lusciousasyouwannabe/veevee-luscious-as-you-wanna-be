import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProducts, type ProductRow } from "@/hooks/useProducts";
import { resolveProductImage } from "@/data/productImages";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import InventoryStats from "@/components/inventory/InventoryStats";
import InventoryHistory from "@/components/inventory/InventoryHistory";
import RestockDialog from "@/components/inventory/RestockDialog";
import ProductEditDialog from "@/components/inventory/ProductEditDialog";

type SortKey = "name" | "sku" | "category" | "quantity" | "sold_out_at" | "last_production_date" | "status";
const PAGE_SIZE = 15;

const fmtDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

const statusTone = (status: string) => {
  switch (status) {
    case "Active":
      return "border-primary/40 text-primary bg-primary/10";
    case "Out of Stock":
      return "border-destructive/40 text-destructive bg-destructive/10";
    case "Archived":
      return "border-border text-muted-foreground bg-secondary";
    default:
      return "border-border text-muted-foreground bg-secondary";
  }
};

const InventoryManager = () => {
  const { rows, loading, error, refetch } = useProducts(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [soldOutFrom, setSoldOutFrom] = useState("");
  const [restockedFrom, setRestockedFrom] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "name", dir: "asc" });
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const [restockTarget, setRestockTarget] = useState<ProductRow | null>(null);
  const [editTarget, setEditTarget] = useState<ProductRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductRow | "bulk" | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(rows.map((r) => r.category))).sort(),
    [rows]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = rows.filter((r) => {
      if (term && !r.name.toLowerCase().includes(term) && !(r.sku || "").toLowerCase().includes(term))
        return false;
      if (category !== "all" && r.category !== category) return false;
      if (status === "sold_out" && r.status !== "Out of Stock") return false;
      if (status === "active" && r.status !== "Active") return false;
      if (status === "hidden" && r.status !== "Hidden") return false;
      if (status === "archived" && !r.archived) return false;
      if (soldOutFrom && (!r.sold_out_at || r.sold_out_at < soldOutFrom)) return false;
      if (restockedFrom && (!r.restocked_at || r.restocked_at < restockedFrom)) return false;
      return true;
    });

    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      const av = a[sort.key] ?? "";
      const bv = b[sort.key] ?? "";
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [rows, search, category, status, soldOutFrom, restockedFrom, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const paged = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);
  const allOnPageSelected = paged.length > 0 && paged.every((r) => selected.includes(r.id));

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));

  const run = async (
    fn: () => PromiseLike<{ error: { message: string } | null }>,
    successMsg: string
  ) => {
    setBusy(true);
    const { error } = await fn();
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(successMsg);
    setSelected([]);
    refetch();
  };

  const restore = (ids: string[]) =>
    run(
      () => supabase.from("products").update({ manual_hidden: false, archived: false }).in("id", ids),
      "Product restored — visible again once quantity is above zero"
    );

  const hide = (ids: string[]) =>
    run(() => supabase.from("products").update({ manual_hidden: true }).in("id", ids), "Hidden from storefront");

  const archive = (ids: string[]) =>
    run(() => supabase.from("products").update({ archived: true }).in("id", ids), "Archived");

  const remove = (ids: string[]) =>
    run(
      () => supabase.from("products").delete().in("id", ids),
      "Deleted permanently (inventory history kept)"
    );

  const duplicate = async (row: ProductRow) => {
    const suffix = Math.random().toString(36).slice(2, 7);
    const { id, ...rest } = row as any;
    delete rest.status;
    delete rest.is_visible;
    delete rest.sold_out_at;
    delete rest.restocked_at;
    await run(
      () =>
        supabase.from("products").insert({
          ...rest,
          name: `${row.name} (Copy)`,
          slug: `${row.slug}-copy-${suffix}`,
          sku: row.sku ? `${row.sku}_COPY_${suffix.toUpperCase()}` : null,
          quantity: 0,
          manual_hidden: true,
          archived: false,
        }),
      "Product duplicated as a hidden draft"
    );
  };

  const exportCsv = () => {
    const headers = [
      "Name",
      "SKU",
      "Category",
      "Size",
      "Price",
      "Quantity",
      "Status",
      "Visible",
      "Date Sold Out",
      "Last Production Date",
      "Notes",
    ];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      headers.join(","),
      ...filtered.map((r) =>
        [
          r.name,
          r.sku,
          r.category,
          r.size,
          r.price,
          r.quantity,
          r.status,
          r.is_visible ? "Yes" : "No",
          r.sold_out_at ? new Date(r.sold_out_at).toISOString().slice(0, 10) : "",
          r.last_production_date || "",
          r.notes,
        ]
          .map(escape)
          .join(",")
      ),
    ].join("\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `veevee-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading)
    return <p className="font-body text-muted-foreground text-center py-10">Loading inventory...</p>;
  if (error)
    return (
      <p className="font-body text-destructive text-center py-10">Could not load inventory: {error}</p>
    );

  const columns: { key: SortKey | null; label: string }[] = [
    { key: null, label: "Image" },
    { key: "name", label: "Product" },
    { key: "sku", label: "SKU" },
    { key: "category", label: "Category" },
    { key: "quantity", label: "Qty Remaining" },
    { key: "sold_out_at", label: "Date Sold Out" },
    { key: "last_production_date", label: "Last Production" },
    { key: "status", label: "Status" },
    { key: null, label: "Notes" },
    { key: null, label: "" },
  ];

  return (
    <div className="space-y-6">
      <InventoryStats rows={rows} />

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Products</TabsTrigger>
          <TabsTrigger value="history">Inventory History</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-end gap-3">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search by name or SKU"
              className="font-body text-sm bg-background border border-border rounded-md px-3 py-2 w-full sm:w-60"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="font-body text-sm bg-background border border-border rounded-md px-3 py-2"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="font-body text-sm bg-background border border-border rounded-md px-3 py-2"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="sold_out">Out of Stock</option>
              <option value="hidden">Hidden</option>
              <option value="archived">Archived</option>
            </select>
            <label className="font-body text-xs text-muted-foreground flex flex-col gap-1">
              Sold out since
              <input
                type="date"
                value={soldOutFrom}
                onChange={(e) => setSoldOutFrom(e.target.value)}
                className="font-body text-sm bg-background border border-border rounded-md px-3 py-2"
              />
            </label>
            <label className="font-body text-xs text-muted-foreground flex flex-col gap-1">
              Restocked since
              <input
                type="date"
                value={restockedFrom}
                onChange={(e) => setRestockedFrom(e.target.value)}
                className="font-body text-sm bg-background border border-border rounded-md px-3 py-2"
              />
            </label>
            <Button variant="outline" size="sm" onClick={exportCsv}>
              Export CSV
            </Button>
          </div>

          {/* Bulk actions */}
          {selected.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 border border-border rounded-md px-4 py-3 bg-secondary">
              <span className="font-body text-sm text-foreground">{selected.length} selected</span>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => restore(selected)}>
                Restore
              </Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => hide(selected)}>
                Hide
              </Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => archive(selected)}>
                Archive
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={busy}
                onClick={() => setDeleteTarget("bulk")}
              >
                Delete
              </Button>
              <button
                onClick={() => setSelected([])}
                className="font-body text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            </div>
          )}

          {/* Table */}
          <div className="border border-border rounded-md overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <Checkbox
                      checked={allOnPageSelected}
                      onCheckedChange={(checked) =>
                        setSelected((prev) =>
                          checked
                            ? Array.from(new Set([...prev, ...paged.map((r) => r.id)]))
                            : prev.filter((id) => !paged.some((r) => r.id === id))
                        )
                      }
                      aria-label="Select all on page"
                    />
                  </th>
                  {columns.map((c) => (
                    <th
                      key={c.label || "actions"}
                      onClick={() => c.key && toggleSort(c.key)}
                      className={`text-left font-body font-semibold text-xs uppercase tracking-wider text-muted-foreground px-4 py-3 whitespace-nowrap ${
                        c.key ? "cursor-pointer select-none hover:text-foreground" : ""
                      }`}
                    >
                      {c.label}
                      {sort.key === c.key && (sort.dir === "asc" ? " ↑" : " ↓")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={11} className="font-body text-sm text-muted-foreground text-center py-10">
                      No products match these filters.
                    </td>
                  </tr>
                )}
                {paged.map((row) => (
                  <tr key={row.id} className="border-t border-border align-middle">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selected.includes(row.id)}
                        onCheckedChange={(checked) =>
                          setSelected((prev) =>
                            checked ? [...prev, row.id] : prev.filter((id) => id !== row.id)
                          )
                        }
                        aria-label={`Select ${row.name}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <img
                        src={resolveProductImage(row.image_key)}
                        alt={row.name}
                        className="w-11 h-11 object-cover rounded border border-border"
                        loading="lazy"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-body text-sm text-foreground">{row.name}</p>
                      <p className="font-body text-xs text-muted-foreground">
                        {row.size ? `${row.size} · ` : ""}${row.price}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-muted-foreground">{row.sku || "—"}</td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground">{row.category}</td>
                    <td className="px-4 py-3 font-body text-sm text-foreground">{row.quantity}</td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground whitespace-nowrap">
                      {fmtDate(row.sold_out_at)}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground whitespace-nowrap">
                      {fmtDate(row.last_production_date)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-body text-[11px] uppercase tracking-wider px-2 py-1 rounded border whitespace-nowrap ${statusTone(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-muted-foreground max-w-[180px] truncate">
                      {row.notes || "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="Product actions">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover z-50">
                          <DropdownMenuItem onClick={() => setRestockTarget(row)}>Restock</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => restore([row.id])}>
                            Restore Product
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditTarget(row)}>Edit Product</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicate(row)}>Duplicate Product</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {!row.archived && (
                            <DropdownMenuItem onClick={() => hide([row.id])}>
                              Hide from Storefront
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => archive([row.id])}>
                            Archive Permanently
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget(row)}
                          >
                            Delete Permanently
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-body text-sm text-muted-foreground">
              Showing {paged.length} of {filtered.length} products
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={current === 0}
                onClick={() => setPage(current - 1)}
              >
                Previous
              </Button>
              <span className="font-body text-sm text-muted-foreground">
                Page {current + 1} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={current >= pageCount - 1}
                onClick={() => setPage(current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <InventoryHistory />
        </TabsContent>
      </Tabs>

      <RestockDialog
        product={restockTarget}
        open={!!restockTarget}
        onOpenChange={(o) => !o && setRestockTarget(null)}
        onSaved={refetch}
      />
      <ProductEditDialog
        product={editTarget}
        open={!!editTarget}
        onOpenChange={(o) => !o && setEditTarget(null)}
        onSaved={refetch}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete permanently?</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              {deleteTarget === "bulk"
                ? `${selected.length} products will be permanently removed.`
                : `"${typeof deleteTarget === "object" && deleteTarget?.name}" will be permanently removed.`}{" "}
              This cannot be undone. Inventory history is always kept. Consider archiving instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                const ids =
                  deleteTarget === "bulk" ? selected : deleteTarget ? [deleteTarget.id] : [];
                setDeleteTarget(null);
                if (ids.length) remove(ids);
              }}
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InventoryManager;
