import { useMemo, useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import ProductDetailModal from "@/components/ProductDetailModal";
import { useProducts, buildCatalog, type ShopCard } from "@/hooks/useProducts";

const Shop = () => {
  const { addToCart } = useCart();
  const { rows, loading } = useProducts(true);
  const { cards, groups, categories } = useMemo(() => buildCatalog(rows), [rows]);

  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [activeVariantKey, setActiveVariantKey] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const activeFilter = filter && categories.includes(filter) ? filter : categories[0];
  const filtered = cards.filter((p) => p.category === activeFilter);
  const activeVariant = activeVariantKey ? groups[activeVariantKey] : null;

  const openVariantModal = (key: string) => {
    setActiveVariantKey(key);
    setVariantModalOpen(true);
  };

  const handleAdd = (product: ShopCard) => {
    if (product.hasVariants && product.variantKey) {
      openVariantModal(product.variantKey);
      return;
    }
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-body text-xs tracking-[0.4em] uppercase text-primary">Individual Products</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">Shop</h1>
            <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto">Handcrafted self-care essentials made with love.</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-body text-[11px] tracking-[0.2em] uppercase px-5 py-2 border transition-all duration-300 ${
                  activeFilter === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="font-body text-center text-muted-foreground py-20">Loading our collection...</p>
          ) : filtered.length === 0 ? (
            <p className="font-body text-center text-muted-foreground py-20">
              This collection is being restocked. Please check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="group bg-card border border-border overflow-hidden hover:border-primary/40 transition-all duration-500 cursor-pointer"
                  onClick={() => product.hasVariants && product.variantKey && openVariantModal(product.variantKey)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    <span className="absolute top-4 left-4 bg-primary text-primary-foreground font-body text-[10px] font-bold tracking-wider uppercase px-3 py-1">
                      {product.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-1">{product.category}</p>
                    <h3 className="font-display text-lg font-semibold text-foreground">{product.name}</h3>
                    <p className="font-body text-primary font-semibold mt-1 tracking-wider">
                      {product.hasVariants ? `From $${product.price}` : `$${product.price}`}
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAdd(product); }}
                      className="mt-4 w-full border border-primary text-primary font-body text-xs tracking-[0.15em] uppercase py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      {product.hasVariants ? "Select Size" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {activeVariant && (
        <ProductDetailModal
          key={activeVariantKey}
          open={variantModalOpen}
          onOpenChange={setVariantModalOpen}
          product={activeVariant}
        />
      )}
      <Footer />
    </div>
  );
};

export default Shop;
