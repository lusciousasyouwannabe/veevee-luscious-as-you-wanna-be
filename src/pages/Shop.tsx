import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import berryVanilla1 from "@/assets/product-berry-vanilla-1.jpg";
import berryVanilla2 from "@/assets/product-berry-vanilla-2.jpg";
import berryVanilla3 from "@/assets/product-berry-vanilla-3.jpg";
import berryVanilla4 from "@/assets/product-berry-vanilla-4.jpg";
import berryVanilla5 from "@/assets/product-berry-vanilla-5.jpg";
import berryVanilla6 from "@/assets/product-berry-vanilla-6.jpg";
import citronella1 from "@/assets/product-citronella-1.jpg";
import citronella2 from "@/assets/product-citronella-2.jpg";
import citronella3 from "@/assets/product-citronella-3.jpg";

const products = [
  {
    name: "Very Berry Vanilla Milk & Botanical Bath Soak",
    category: "Bath Soaks",
    price: "$28",
    images: [berryVanilla1, berryVanilla2, berryVanilla3, berryVanilla4, berryVanilla5, berryVanilla6],
  },
  {
    name: "Cool Citronella Luxury Bath Bar",
    category: "Bath Bars",
    price: "$14",
    images: [citronella1, citronella2, citronella3],
  },
];

const Shop = () => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});

  const getActiveImage = (productIndex: number) => {
    return activeImageIndex[productIndex] || 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.4em] uppercase text-primary">
              Our Products
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">
              Shop
            </h1>
            <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto">
              Handcrafted self-care essentials made with love.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, productIndex) => (
              <div
                key={product.name}
                className="group bg-card border border-border overflow-hidden hover:border-primary/40 transition-all duration-500"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.images[getActiveImage(productIndex)]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground font-body text-[10px] font-bold tracking-wider uppercase px-3 py-1">
                    {product.category}
                  </span>
                </div>

                {/* Thumbnail strip */}
                {product.images.length > 1 && (
                  <div className="flex gap-1 p-2 overflow-x-auto">
                    {product.images.map((img, imgIndex) => (
                      <button
                        key={imgIndex}
                        onClick={() =>
                          setActiveImageIndex((prev) => ({ ...prev, [productIndex]: imgIndex }))
                        }
                        className={`w-12 h-12 shrink-0 overflow-hidden border-2 transition-all ${
                          getActiveImage(productIndex) === imgIndex
                            ? "border-primary"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-5">
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-1">
                    {product.category}
                  </p>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {product.name}
                  </h3>
                  <p className="font-body text-primary font-semibold mt-1 tracking-wider">
                    {product.price}
                  </p>
                  <button className="mt-4 w-full border border-primary text-primary font-body text-xs tracking-[0.15em] uppercase py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Shop;
