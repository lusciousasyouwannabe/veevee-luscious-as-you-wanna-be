import { useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface SizeOption {
  size: string;
  price: number;
  image: string;
  id: string;
  soldOut?: boolean;
}

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    name: string;
    category: string;
    sizes: SizeOption[];
  };
}

const ProductDetailModal = ({ open, onOpenChange, product }: ProductDetailModalProps) => {
  const { addToCart } = useCart();
  const firstAvailable = useMemo(() => {
    const i = product.sizes.findIndex((s) => !s.soldOut);
    return i === -1 ? 0 : i;
  }, [product.sizes]);
  const [selectedIndex, setSelectedIndex] = useState(firstAvailable);
  const selected = product.sizes[selectedIndex] ?? product.sizes[0];
  const selectedSoldOut = !!selected?.soldOut;

  const handleAdd = () => {
    if (!selected || selectedSoldOut) return;
    addToCart({
      id: selected.id,
      name: `${product.name} ${selected.size}`,
      price: selected.price,
      image: selected.image,
      category: product.category,
    });
    toast.success(`${product.name} ${selected.size} added to cart`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 bg-card border-border overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image side */}
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={selected.image}
              alt={`${product.name} ${selected.size}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details side */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-2">
                {product.category}
              </p>
              <h2 className="font-display text-2xl font-bold text-foreground leading-tight">
                {product.name}
              </h2>
              <p className="font-body text-primary text-xl font-semibold mt-3 tracking-wider">
                ${selected.price}
              </p>

              {/* Size selector */}
              <div className="mt-6">
                <p className="font-body text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
                  Select Size
                </p>
                <div className="flex gap-3">
                  {product.sizes.map((sizeOpt, i) => (
                    <button
                      key={sizeOpt.id}
                      onClick={() => !sizeOpt.soldOut && setSelectedIndex(i)}
                      disabled={sizeOpt.soldOut}
                      aria-disabled={sizeOpt.soldOut}
                      className={`relative flex flex-col items-center gap-2 border p-3 transition-all duration-300 flex-1 ${
                        sizeOpt.soldOut
                          ? "border-border opacity-50 cursor-not-allowed"
                          : selectedIndex === i
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <img
                        src={sizeOpt.image}
                        alt={sizeOpt.size}
                        className={`w-16 h-16 object-cover rounded ${sizeOpt.soldOut ? "grayscale" : ""}`}
                      />
                      <span className="font-body text-xs font-semibold text-foreground">
                        {sizeOpt.size}
                      </span>
                      {sizeOpt.soldOut ? (
                        <span className="font-body text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                          Sold Out
                        </span>
                      ) : (
                        <span className="font-body text-xs text-primary">${sizeOpt.price}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={selectedSoldOut}
              className="mt-6 w-full border border-primary text-primary font-body text-xs tracking-[0.15em] uppercase py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary"
            >
              {selectedSoldOut ? "Sold Out" : "Add to Cart"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
