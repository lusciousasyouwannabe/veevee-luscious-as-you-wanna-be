import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import ProductDetailModal from "@/components/ProductDetailModal";

import citronellaEdited from "@/assets/product-citronella-edited.png";
import cremeBruleeBathbar from "@/assets/product-creme-brulee-bathbar.png";
import gentlemanBathbar from "@/assets/product-gentleman-bathbar.png";
import classicManBathbar from "@/assets/product-classic-man-bathbar.png";
import lovelyLotusBathsoak from "@/assets/product-lovely-lotus-bathsoak.png";
import frenchVanillaBathsoak from "@/assets/product-french-vanilla-bathsoak.png";
import cremeBruleeBathsoak from "@/assets/product-creme-brulee-bathsoak.jpg";
import beachBoysBathbar from "@/assets/product-beach-boys-bathbar.png";
import classicManBathsoak from "@/assets/product-classic-man-bathsoak.jpg";
import luxMyrtilleButter from "@/assets/product-lux-myrtille-butter.png";
import ohHoneyButter from "@/assets/product-oh-honey-butter.jpg";
import coolCitronellaButter from "@/assets/product-cool-citronella-butter.jpg";
import goodGirlBathbar from "@/assets/product-good-girl-bathbar.jpg";
import strawberryCreamBathbar from "@/assets/product-strawberry-cream-bathbar.jpg";
import mardiGrasBathbar from "@/assets/product-mardi-gras-bathbar.jpg";
import gentlemanButter from "@/assets/product-gentleman-butter.jpg";
import gentlemanBathsoak from "@/assets/product-gentleman-bathsoak.jpg";
import cremeBruleeScrub from "@/assets/product-creme-brulee-scrub.png";
import cremeBruleeScrub8oz from "@/assets/product-creme-brulee-scrub-8oz.jpg";
import cremeBruleeScrub4oz from "@/assets/product-creme-brulee-scrub-4oz.jpg";
import luxMyrtilleScrub from "@/assets/product-lux-myrtille-scrub.png";
import veryBerryScrub4oz from "@/assets/product-very-berry-scrub-4oz.jpg";
import veryBerryScrub8oz from "@/assets/product-very-berry-scrub-8oz.jpg";
import veryBerryBathsoak from "@/assets/product-very-berry-bathsoak.jpg";
import frenchVanillaScrub from "@/assets/product-french-vanilla-bodyscrub.jpg";
import goodGirlScrub from "@/assets/product-good-girl-scrub.jpg";
import beachBoysScrub from "@/assets/product-beach-boys-scrub.jpg";
import ohHoneyBathbar from "@/assets/product-oh-honey-bathbar.jpg";

const products = [
  { id: "oh-honey-bathbar", name: "Ohh Honey Luxury Bath Bar", category: "Bath Bars", price: 15, image: ohHoneyBathbar },
  { id: "citronella-1", name: "Cool Citronella Luxury Bath Bar", category: "Bath Bars", price: 15, image: citronellaEdited },
  { id: "creme-brulee-bathbar", name: "Crème Brûlée Luxury Bath Bar", category: "Bath Bars", price: 15, image: cremeBruleeBathbar },
  { id: "gentleman-bathbar", name: "The Gentleman Luxury Bath Bar", category: "Bath Bars", price: 15, image: gentlemanBathbar },
  { id: "classic-man-bathbar", name: "Classic Man Luxury Bath Bar", category: "Bath Bars", price: 15, image: classicManBathbar },
  { id: "beach-boys-bathbar", name: "Beach Boys Luxury Bath Bar", category: "Bath Bars", price: 15, image: beachBoysBathbar },
  { id: "good-girl-bathbar", name: "Good Girl Luxury Bath Bar", category: "Bath Bars", price: 15, image: goodGirlBathbar },
  { id: "strawberry-cream-bathbar", name: "Strawberry & Cream Luxury Bath Bar", category: "Bath Bars", price: 15, image: strawberryCreamBathbar },
  { id: "mardi-gras-bathbar", name: "Mardi Gras Luxury Bath Bar", category: "Bath Bars", price: 15, image: mardiGrasBathbar },
  { id: "lovely-lotus-bathsoak", name: "Lovely Lotus Luxury Bath Soak", category: "Bath Soaks", price: 25, image: lovelyLotusBathsoak, hasVariants: true, variantKey: "lovely-lotus-bathsoak" },
  { id: "french-vanilla-bathsoak", name: "French Vanilla & Oatmeal Luxury Bath Soak", category: "Bath Soaks", price: 25, image: frenchVanillaBathsoak, hasVariants: true, variantKey: "french-vanilla-bathsoak" },
  { id: "classic-man-bathsoak", name: "Classic Man Luxury Bath Soak", category: "Bath Soaks", price: 25, image: classicManBathsoak, hasVariants: true, variantKey: "classic-man-bathsoak" },
  { id: "creme-brulee-bathsoak", name: "Crème Brûlée Cream & Butter Botanical Bath Soak", category: "Bath Soaks", price: 25, image: cremeBruleeBathsoak, hasVariants: true, variantKey: "creme-brulee-bathsoak" },
  { id: "gentleman-bathsoak", name: "The Gentleman Luxury Bath Soak", category: "Bath Soaks", price: 25, image: gentlemanBathsoak, hasVariants: true, variantKey: "gentleman-bathsoak" },
  { id: "very-berry-bathsoak", name: "Very Berry Luxury Bath Soak", category: "Bath Soaks", price: 25, image: veryBerryBathsoak, hasVariants: true, variantKey: "very-berry-bathsoak" },
  { id: "lux-myrtille-butter", name: "Luxury Myrtille Body Butter", category: "Body Butters", price: 25, image: luxMyrtilleButter, hasVariants: true, variantKey: "lux-myrtille-butter" },
  { id: "cool-citronella-butter", name: "Cool Citronella Luxury Body Butter", category: "Body Butters", price: 25, image: coolCitronellaButter, hasVariants: true, variantKey: "cool-citronella-butter" },
  { id: "gentleman-butter", name: "The Gentleman Luxury Body Butter", category: "Body Butters", price: 25, image: gentlemanButter, hasVariants: true, variantKey: "gentleman-butter" },
  { id: "oh-honey-butter", name: "Ohh Honey Luxury Body Butter", category: "Body Butters", price: 25, image: ohHoneyButter, hasVariants: true, variantKey: "oh-honey-butter" },
  { id: "creme-brulee-scrub", name: "Crème Brûlée Sugar Scrub", category: "Body Scrubs", price: 25, image: cremeBruleeScrub, hasVariants: true, variantKey: "creme-brulee-scrub" },
  { id: "lux-myrtille-scrub", name: "Luxury Myrtille Body Scrub 4oz", category: "Body Scrubs", price: 25, image: luxMyrtilleScrub },
  { id: "very-berry-scrub", name: "Luxe Very Berry Body Scrub", category: "Body Scrubs", price: 25, image: veryBerryScrub4oz, hasVariants: true, variantKey: "very-berry-scrub" },
  { id: "french-vanilla-scrub", name: "French Vanilla Luxury Body Scrub", category: "Body Scrubs", price: 25, image: frenchVanillaScrub, hasVariants: true, variantKey: "french-vanilla-scrub" },
  { id: "good-girl-scrub", name: "Good Girl Luxury Body Scrub", category: "Body Scrubs", price: 25, image: goodGirlScrub, hasVariants: true, variantKey: "good-girl-scrub" },
  { id: "beach-boys-scrub", name: "Beach Boys Luxury Body Scrub", category: "Body Scrubs", price: 25, image: beachBoysScrub, hasVariants: true, variantKey: "beach-boys-scrub" },
];

const variantProducts: Record<string, { name: string; category: string; sizes: { size: string; price: number; image: string; id: string }[] }> = {
  "lux-myrtille-butter": {
    name: "Luxury Myrtille Body Butter",
    category: "Body Butters",
    sizes: [
      { size: "4oz", price: 25, image: luxMyrtilleButter, id: "lux-myrtille-butter-4oz" },
      { size: "8oz", price: 35, image: luxMyrtilleButter, id: "lux-myrtille-butter-8oz" },
    ],
  },
  "cool-citronella-butter": {
    name: "Cool Citronella Luxury Body Butter",
    category: "Body Butters",
    sizes: [
      { size: "4oz", price: 25, image: coolCitronellaButter, id: "cool-citronella-butter-4oz" },
      { size: "8oz", price: 35, image: coolCitronellaButter, id: "cool-citronella-butter-8oz" },
    ],
  },
  "gentleman-butter": {
    name: "The Gentleman Luxury Body Butter",
    category: "Body Butters",
    sizes: [
      { size: "4oz", price: 25, image: gentlemanButter, id: "gentleman-butter-4oz" },
      { size: "8oz", price: 35, image: gentlemanButter, id: "gentleman-butter-8oz" },
    ],
  },
  "lovely-lotus-bathsoak": {
    name: "Lovely Lotus Luxury Bath Soak",
    category: "Bath Soaks",
    sizes: [
      { size: "4oz", price: 25, image: lovelyLotusBathsoak, id: "lovely-lotus-bathsoak-4oz" },
      { size: "8oz", price: 35, image: lovelyLotusBathsoak, id: "lovely-lotus-bathsoak-8oz" },
    ],
  },
  "french-vanilla-bathsoak": {
    name: "French Vanilla & Oatmeal Luxury Bath Soak",
    category: "Bath Soaks",
    sizes: [
      { size: "4oz", price: 25, image: frenchVanillaBathsoak, id: "french-vanilla-bathsoak-4oz" },
      { size: "8oz", price: 35, image: frenchVanillaBathsoak, id: "french-vanilla-bathsoak-8oz" },
    ],
  },
  "classic-man-bathsoak": {
    name: "Classic Man Luxury Bath Soak",
    category: "Bath Soaks",
    sizes: [
      { size: "4oz", price: 25, image: classicManBathsoak, id: "classic-man-bathsoak-4oz" },
      { size: "8oz", price: 35, image: classicManBathsoak, id: "classic-man-bathsoak-8oz" },
    ],
  },
  "creme-brulee-bathsoak": {
    name: "Crème Brûlée Cream & Butter Botanical Bath Soak",
    category: "Bath Soaks",
    sizes: [
      { size: "4oz", price: 25, image: cremeBruleeBathsoak, id: "creme-brulee-bathsoak-4oz" },
      { size: "8oz", price: 35, image: cremeBruleeBathsoak, id: "creme-brulee-bathsoak-8oz" },
    ],
  },
  "gentleman-bathsoak": {
    name: "The Gentleman Luxury Bath Soak",
    category: "Bath Soaks",
    sizes: [
      { size: "4oz", price: 25, image: gentlemanBathsoak, id: "gentleman-bathsoak-4oz" },
      { size: "8oz", price: 35, image: gentlemanBathsoak, id: "gentleman-bathsoak-8oz" },
    ],
  },
  "very-berry-bathsoak": {
    name: "Very Berry Luxury Bath Soak",
    category: "Bath Soaks",
    sizes: [
      { size: "4oz", price: 25, image: veryBerryBathsoak, id: "very-berry-bathsoak-4oz" },
      { size: "8oz", price: 35, image: veryBerryBathsoak, id: "very-berry-bathsoak-8oz" },
    ],
  },
  "very-berry-scrub": {
    name: "Luxe Very Berry Body Scrub",
    category: "Body Scrubs",
    sizes: [
      { size: "4oz", price: 25, image: veryBerryScrub4oz, id: "very-berry-scrub-4oz" },
      { size: "8oz", price: 35, image: veryBerryScrub8oz, id: "very-berry-scrub-8oz" },
    ],
  },
  "creme-brulee-scrub": {
    name: "Crème Brûlée Sugar Scrub",
    category: "Body Scrubs",
    sizes: [
      { size: "4oz", price: 25, image: cremeBruleeScrub4oz, id: "creme-brulee-scrub-4oz" },
      { size: "8oz", price: 35, image: cremeBruleeScrub8oz, id: "creme-brulee-scrub-8oz" },
    ],
  },
  "french-vanilla-scrub": {
    name: "French Vanilla Luxury Body Scrub",
    category: "Body Scrubs",
    sizes: [
      { size: "4oz", price: 25, image: frenchVanillaScrub, id: "french-vanilla-scrub-4oz" },
      { size: "8oz", price: 35, image: frenchVanillaScrub, id: "french-vanilla-scrub-8oz" },
    ],
  },
  "good-girl-scrub": {
    name: "Good Girl Luxury Body Scrub",
    category: "Body Scrubs",
    sizes: [
      { size: "4oz", price: 25, image: goodGirlScrub, id: "good-girl-scrub-4oz" },
      { size: "8oz", price: 35, image: goodGirlScrub, id: "good-girl-scrub-8oz" },
    ],
  },
  "beach-boys-scrub": {
    name: "Beach Boys Luxury Body Scrub",
    category: "Body Scrubs",
    sizes: [
      { size: "4oz", price: 25, image: beachBoysScrub, id: "beach-boys-scrub-4oz" },
      { size: "8oz", price: 35, image: beachBoysScrub, id: "beach-boys-scrub-8oz" },
    ],
  },
};

const Shop = () => {
  const { addToCart } = useCart();
  const [filter, setFilter] = useState("All");
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [activeVariantKey, setActiveVariantKey] = useState<string>("very-berry-scrub");

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = filter === "All" ? products : products.filter((p) => p.category === filter);

  const openVariantModal = (key: string) => {
    setActiveVariantKey(key);
    setVariantModalOpen(true);
  };

  const handleAdd = (product: typeof products[0]) => {
    if ((product as any).hasVariants) {
      openVariantModal((product as any).variantKey);
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
              <div
                key={product.id}
                className="group bg-card border border-border overflow-hidden hover:border-primary/40 transition-all duration-500 cursor-pointer"
                onClick={() => (product as any).hasVariants && openVariantModal((product as any).variantKey)}
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
                    {(product as any).hasVariants ? "From $25" : `$${product.price}`}
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAdd(product); }}
                    className="mt-4 w-full border border-primary text-primary font-body text-xs tracking-[0.15em] uppercase py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    {(product as any).hasVariants ? "Select Size" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ProductDetailModal
        open={variantModalOpen}
        onOpenChange={setVariantModalOpen}
        product={variantProducts[activeVariantKey]}
      />
      <Footer />
    </div>
  );
};

export default Shop;
