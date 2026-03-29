import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

import citronellaEdited from "@/assets/product-citronella-edited.png";
import cremeBruleeBathbar from "@/assets/product-creme-brulee-bathbar.png";
import cremeBrulee1 from "@/assets/product-creme-brulee-1.png";
import cremeBrulee2 from "@/assets/product-creme-brulee-2.png";
import gentlemanBathbar from "@/assets/product-gentleman-bathbar.png";
import classicManBathbar from "@/assets/product-classic-man-bathbar.png";
import lovelyLotusBathsoak from "@/assets/product-lovely-lotus-bathsoak.png";
import frenchVanillaBathsoak from "@/assets/product-french-vanilla-bathsoak.png";
import beachBoysBathbar from "@/assets/product-beach-boys-bathbar.png";
import luxMyrtilleButter from "@/assets/product-lux-myrtille-butter.png";
import cremeBruleeScrub from "@/assets/product-creme-brulee-scrub.png";
import luxMyrtilleScrub from "@/assets/product-lux-myrtille-scrub.png";
import veryBerryScrub from "@/assets/product-very-berry-scrub.jpg";

const products = [
  { id: "citronella-1", name: "Cool Citronella Luxury Bath Bar", category: "Bath Bars", price: 15, image: citronellaEdited },
  { id: "creme-brulee-bathbar", name: "Crème Brûlée Luxury Bath Bar", category: "Bath Bars", price: 15, image: cremeBruleeBathbar },
  { id: "gentleman-bathbar", name: "The Gentleman Luxury Bath Bar", category: "Bath Bars", price: 15, image: gentlemanBathbar },
  { id: "classic-man-bathbar", name: "Classic Man Luxury Bath Bar", category: "Bath Bars", price: 15, image: classicManBathbar },
  { id: "beach-boys-bathbar", name: "Beach Boys Luxury Bath Bar", category: "Bath Bars", price: 15, image: beachBoysBathbar },
  { id: "creme-brulee-1", name: "Crème Brûlée Cream & Butter Botanical Bath Soak", category: "Bath Soaks", price: 22, image: cremeBrulee1 },
  { id: "creme-brulee-2", name: "Crème Brûlée Cream & Butter Botanical Bath Soak", category: "Bath Soaks", price: 22, image: cremeBrulee2 },
  { id: "lovely-lotus-bathsoak", name: "Lovely Lotus Luxury Bath Soak", category: "Bath Soaks", price: 22, image: lovelyLotusBathsoak },
  { id: "french-vanilla-bathsoak", name: "French Vanilla & Oatmeal Luxury Bath Soak", category: "Bath Soaks", price: 22, image: frenchVanillaBathsoak },
  { id: "lux-myrtille-butter", name: "Lux Myrtille Butter 4oz", category: "Body Butters", price: 25, image: luxMyrtilleButter },
  { id: "creme-brulee-scrub", name: "Crème Brûlée Sugar Scrub 8oz", category: "Body Scrubs", price: 35, image: cremeBruleeScrub },
  { id: "lux-myrtille-scrub", name: "Lux Myrtille Body Scrub 4oz", category: "Body Scrubs", price: 25, image: luxMyrtilleScrub },
  { id: "very-berry-scrub-8oz", name: "Luxe Very Berry Body Scrub 8oz", category: "Body Scrubs", price: 35, image: veryBerryScrub },
  { id: "very-berry-scrub-4oz", name: "Luxe Very Berry Body Scrub 4oz", category: "Body Scrubs", price: 25, image: veryBerryScrub },
];

const Shop = () => {
  const { addToCart } = useCart();
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = filter === "All" ? products : products.filter((p) => p.category === filter);

  const handleAdd = (product: typeof products[0]) => {
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
                  filter === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product) => (
              <div key={product.id} className="group bg-card border border-border overflow-hidden hover:border-primary/40 transition-all duration-500">
                <div className="relative aspect-square overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground font-body text-[10px] font-bold tracking-wider uppercase px-3 py-1">
                    {product.category}
                  </span>
                </div>
                <div className="p-5">
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-1">{product.category}</p>
                  <h3 className="font-display text-lg font-semibold text-foreground">{product.name}</h3>
                  <p className="font-body text-primary font-semibold mt-1 tracking-wider">${product.price}</p>
                  <button
                    onClick={() => handleAdd(product)}
                    className="mt-4 w-full border border-primary text-primary font-body text-xs tracking-[0.15em] uppercase py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
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
