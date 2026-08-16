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
import type { ProductRow } from "@/hooks/useProducts";

interface Props {
  product: ProductRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

const RestockDialog = ({ product, open, onOpenChange, onSaved }: Props) => {
  const [amount, setAmount] = useState("");
  const [productionDate, setProductionDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setAmount("");
      setProductionDate(new Date().toISOString().slice(0, 10));
    }
  }, [open, product?.id]);

  if (!product) return null;

  const added = parseInt(amount, 10);
  const newTotal = product.quantity + (Number.isNaN(added) ? 0 : added);

  const save = async () => {
    if (Number.isNaN(added) || added <= 0) {
      toast.error("Enter a quantity greater than zero");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("products")
      .update({
        quantity: newTotal,
        manual_hidden: false,
        archived: false,
        last_production_date: productionDate || null,
      })
      .eq("id", product.id);
    setSaving(false);
    if (error) {
      toast.error("Could not restock: " + error.message);
      return;
    }
    toast.success(`${product.name} restocked — now live on the storefront`);
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Restock {product.name}</DialogTitle>
          <DialogDescription className="font-body">
            Adding stock sets the product back to Active and makes it visible on the website immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-body">Quantity produced</Label>
            <Input
              type="number"
              min={1}
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 24"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-body">Production date</Label>
            <Input
              type="date"
              value={productionDate}
              onChange={(e) => setProductionDate(e.target.value)}
            />
          </div>
          <p className="font-body text-sm text-muted-foreground">
            Current: {product.quantity} · New total:{" "}
            <span className="text-foreground font-medium">{newTotal}</span>
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save & Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RestockDialog;
