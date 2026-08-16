import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { productImageKeys, resolveProductImage } from "@/data/productImages";
import type { ProductRow } from "@/hooks/useProducts";

interface Props {
  product: ProductRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

type Draft = {
  name: string;
  sku: string;
  category: string;
  price: string;
  size: string;
  quantity: string;
  image_key: string;
  description: string;
  ingredients: string;
  tags: string;
  notes: string;
  seo_title: string;
  seo_description: string;
  last_production_date: string;
};

const toDraft = (p: ProductRow): Draft => ({
  name: p.name,
  sku: p.sku || "",
  category: p.category,
  price: String(p.price),
  size: p.size || "",
  quantity: String(p.quantity),
  image_key: p.image_key || "",
  description: p.description || "",
  ingredients: p.ingredients || "",
  tags: (p.tags || []).join(", "),
  notes: p.notes || "",
  seo_title: p.seo_title || "",
  seo_description: p.seo_description || "",
  last_production_date: p.last_production_date || "",
});

const ProductEditDialog = ({ product, open, onOpenChange, onSaved }: Props) => {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && product) setDraft(toDraft(product));
  }, [open, product?.id]);

  if (!product || !draft) return null;

  const set = (key: keyof Draft, value: string) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  const save = async () => {
    if (!draft.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("products")
      .update({
        name: draft.name.trim(),
        sku: draft.sku.trim() || null,
        category: draft.category.trim(),
        price: Number(draft.price) || 0,
        size: draft.size.trim() || null,
        quantity: parseInt(draft.quantity, 10) || 0,
        image_key: draft.image_key.trim(),
        description: draft.description.trim() || null,
        ingredients: draft.ingredients.trim() || null,
        tags: draft.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        notes: draft.notes.trim() || null,
        seo_title: draft.seo_title.trim() || null,
        seo_description: draft.seo_description.trim() || null,
        last_production_date: draft.last_production_date || null,
      })
      .eq("id", product.id);
    setSaving(false);
    if (error) {
      toast.error("Could not save: " + error.message);
      return;
    }
    toast.success("Product updated");
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Edit Product</DialogTitle>
          <DialogDescription className="font-body">
            All product information is preserved — nothing is deleted when an item sells out.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label className="font-body">Product name</Label>
            <Input value={draft.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="font-body">SKU</Label>
            <Input value={draft.sku} onChange={(e) => set("sku", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="font-body">Category</Label>
            <Input value={draft.category} onChange={(e) => set("category", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="font-body">Price ($)</Label>
            <Input
              type="number"
              min={0}
              value={draft.price}
              onChange={(e) => set("price", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="font-body">Size / variant</Label>
            <Input value={draft.size} onChange={(e) => set("size", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="font-body">Quantity</Label>
            <Input
              type="number"
              min={0}
              value={draft.quantity}
              onChange={(e) => set("quantity", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="font-body">Last production date</Label>
            <Input
              type="date"
              value={draft.last_production_date}
              onChange={(e) => set("last_production_date", e.target.value)}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="font-body">Photo</Label>
            <div className="flex items-center gap-3">
              <img
                src={resolveProductImage(draft.image_key)}
                alt={draft.name}
                className="w-16 h-16 object-cover rounded border border-border"
              />
              <div className="flex-1 space-y-2">
                <select
                  value={productImageKeys.includes(draft.image_key) ? draft.image_key : ""}
                  onChange={(e) => e.target.value && set("image_key", e.target.value)}
                  className="w-full font-body text-sm bg-background border border-border rounded-md px-3 py-2"
                >
                  <option value="">Choose from photo library…</option>
                  {productImageKeys.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                <Input
                  value={draft.image_key}
                  onChange={(e) => set("image_key", e.target.value)}
                  placeholder="…or paste an image URL"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="font-body">Description</Label>
            <Textarea
              rows={3}
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="font-body">Ingredients</Label>
            <Textarea
              rows={3}
              value={draft.ingredients}
              onChange={(e) => set("ingredients", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="font-body">Tags (comma separated)</Label>
            <Input value={draft.tags} onChange={(e) => set("tags", e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="font-body">Internal notes</Label>
            <Textarea rows={2} value={draft.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="font-body">SEO title</Label>
            <Input value={draft.seo_title} onChange={(e) => set("seo_title", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="font-body">SEO description</Label>
            <Input
              value={draft.seo_description}
              onChange={(e) => set("seo_description", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditDialog;