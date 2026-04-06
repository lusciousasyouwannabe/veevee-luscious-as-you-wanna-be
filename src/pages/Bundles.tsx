import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Clock, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import PresaleBundleModal from "@/components/PresaleBundleModal";

import glowCollection from "@/assets/product-glow-collection-edited.jpg";
import presaleBundle from "@/assets/product-presale-bundle.jpg";
import lavenderCollection from "@/assets/bundle-good-girl-collection.jpg";
import glowTopview from "@/assets/product-glow-topview-edited.jpg";
import selfcareSet from "@/assets/product-selfcare-edited.jpg";
import gentlemanSet from "@/assets/product-gentleman-set.jpg";
import oceanSet from "@/assets/product-ocean-edited.jpg";
import greenScrub from "@/assets/product-green-edited.jpg";
import blueberryChamomile from "@/assets/product-blueberry-chamomile.png";
import myrtilleChamomileBundle from "@/assets/product-myrtille-chamomile-bundle.jpg";
import cremeBruleeBundle from "@/assets/product-creme-brulee-bundle.jpg";
import classicManSet from "@/assets/product-classic-man-set.jpg";

interface BundleItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  savings?: string;
  image: string;
  includes: string[];
  category: string;
}

const bundles: BundleItem[] = [
  // Collections
  {
    id: "ohh-honey-collection",
    name: "Ohh Honey Collection",
    price: 120,
    image: glowCollection,
    includes: ["Body butter", "Body scrub", "Bath soak", "Bath bar"],
    category: "Collections",
  },
  {
    id: "good-girl-collection",
    name: "Good Girl Collection",
    price: 120,
    image: lavenderCollection,
    includes: ["Body butter", "Body scrub", "Bath soak", "Bath bar"],
    category: "Collections",
  },
  {
    id: "beach-boy-collection",
    name: "The Beach Boy Collection",
    price: 40,
    image: gentlemanSet,
    includes: ["Creamy body scrub", "Bath bar"],
    category: "Collections",
  },
  // Self Care Sets
  {
    id: "selfcare-medium",
    name: "The Luxury Gentlemen's Self Care Set",
    price: 102,
    savings: "Save $10",
    image: selfcareSet,
    includes: ["Massage oil", "Body butter", "Scrub", "Bath soak", "Bath bar"],
    category: "Sets",
  },
  {
    id: "selfcare-large",
    name: "Luxury Ohh Honey Self Care Set — Large",
    price: 120,
    savings: "Save $10",
    image: glowTopview,
    includes: ["Massage oil", "Body butter", "Scrub", "Bath soak", "Bath bar"],
    category: "Sets",
  },
  {
    id: "myrtille-chamomile-bundle",
    name: "Luxury Myrtille Chamomile",
    price: 95,
    originalPrice: 107,
    savings: "Save $12",
    image: myrtilleChamomileBundle,
    includes: ["Body scrub", "Bath soak", "Body butter", "Massage oil"],
    category: "Sets",
  },
  {
    id: "creme-brulee-bundle",
    name: "Luxury Crème Brûlée Bundle",
    price: 95,
    originalPrice: 107,
    savings: "Save $12",
    image: cremeBruleeBundle,
    includes: ["Body butter", "Body scrub", "Bath soak", "Bath bar", "Massage oil"],
    category: "Sets",
  },
  {
    id: "classic-man-set",
    name: "Classic Man Set",
    price: 120,
    image: classicManSet,
    includes: ["Body butter", "Body scrub", "Body butter", "Massage oil", "Bath bar"],
    category: "Sets",
  },
];

const subscriptions = [
  { id: "sub-large", name: "Luscious Monthly — Large", price: 115, label: "/month" },
  { id: "sub-medium", name: "Luscious Monthly — Medium", price: 97, label: "/month" },
  
];

const subscriptionIncludes = ["Bath bar", "Body scrub", "Body butter", "Massage oil"];

const specialOffer = {
  id: "special-48hr",
  name: "Presale Bundle",
  presalePrice: 55,
  regularPrice: 65,
  image: presaleBundle,
  includes: ["4oz Body butter", "4oz Body scrub", "Bath bar"],
};

const Bundles = () => {
  const { addToCart } = useCart();
  const [filter, setFilter] = useState("All");
  const [presaleModalOpen, setPresaleModalOpen] = useState(false);

  const categories = ["All", "Collections", "Sets"];
  const filtered = filter === "All" ? bundles : bundles.filter((b) => b.category === filter);

  const handleAdd = (item: BundleItem) => {
    addToCart({ id: item.id, name: item.name, price: item.price, originalPrice: item.originalPrice, image: item.image, category: item.category });
    toast.success(`${item.name} added to cart`);
  };

  const handleAddSubscription = (sub: typeof subscriptions[0]) => {
    addToCart({ id: sub.id, name: sub.name, price: sub.price, image: glowTopview, category: "Subscription" });
    toast.success(`${sub.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-16 px-6">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-body text-xs tracking-[0.4em] uppercase text-primary">Curated Sets & Collections</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">Bundles</h1>
            <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto">Thoughtfully paired collections for every kind of self-care moment.</p>
          </div>

          {/* Special Offer */}
          <div className="mb-16 border border-primary/40 bg-card overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square md:aspect-auto overflow-hidden">
                <img src={specialOffer.image} alt={specialOffer.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-primary mb-3">
                  <Clock size={16} />
                  <span className="font-body text-xs tracking-[0.3em] uppercase font-semibold">48-Hour Pre-Sale</span>
                </div>
                <h2 className="font-display text-3xl font-bold text-foreground">{specialOffer.name}</h2>
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="font-display text-4xl font-bold text-primary">${specialOffer.presalePrice}</span>
                  <span className="font-body text-lg text-muted-foreground line-through">${specialOffer.regularPrice}</span>
                    <span className="bg-primary/20 text-primary font-body text-xs font-bold px-3 py-1 tracking-wider uppercase">
                      Save {Math.round(((specialOffer.regularPrice - specialOffer.presalePrice) / specialOffer.regularPrice) * 100)}%
                    </span>
                </div>
                <ul className="mt-6 space-y-2">
                  {specialOffer.includes.map((item) => (
                    <li key={item} className="font-body text-sm text-muted-foreground flex items-center gap-2">
                      <Sparkles size={12} className="text-primary" /> {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setPresaleModalOpen(true)}
                  className="mt-8 w-full md:w-auto px-10 bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase py-4 hover:bg-primary/90 transition-all duration-300"
                >
                  Grab This Deal
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-body text-[11px] tracking-[0.2em] uppercase px-5 py-2 border transition-all duration-300 ${
                  filter === cat ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Bundle Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((bundle) => (
              <div key={bundle.id} className="group bg-card border border-border overflow-hidden hover:border-primary/40 transition-all duration-500">
                <div className="relative aspect-square overflow-hidden">
                  <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground font-body text-[10px] font-bold tracking-wider uppercase px-3 py-1">
                    {bundle.category}
                  </span>
                  {bundle.savings && (
                    <span className="absolute top-4 right-4 bg-card/90 text-primary font-body text-[10px] font-bold tracking-wider uppercase px-3 py-1 border border-primary/30">
                      {bundle.savings}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-1">{bundle.category}</p>
                  <h3 className="font-display text-lg font-semibold text-foreground">{bundle.name}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-body text-primary font-semibold tracking-wider">${bundle.price}</span>
                    {bundle.originalPrice && (
                      <span className="font-body text-xs text-muted-foreground line-through">${bundle.originalPrice}</span>
                    )}
                  </div>
                  <ul className="mt-3 space-y-1">
                    {bundle.includes.map((item) => (
                      <li key={item} className="font-body text-[11px] text-muted-foreground">• {item}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleAdd(bundle)}
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

      {/* Subscriptions */}
      <section className="py-24 px-6 bg-secondary">
        <div className="container max-w-4xl mx-auto text-center">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-primary">Monthly Self-Care</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 text-foreground">Subscription Bundles</h2>
          <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto">
            A curated box of indulgence delivered to your door every month. Each tier includes: {subscriptionIncludes.join(", ").toLowerCase()}.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 max-w-2xl mx-auto">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="bg-card border border-border p-8 hover:border-primary/40 transition-all duration-300">
                <h3 className="font-display text-xl font-semibold text-foreground">{sub.name.replace("Luscious Monthly — ", "")}</h3>
                <div className="mt-4">
                  <span className="font-display text-3xl font-bold text-primary">${sub.price}</span>
                  <span className="font-body text-sm text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-2 text-left">
                  {subscriptionIncludes.map((item) => (
                    <li key={item} className="font-body text-xs text-muted-foreground flex items-center gap-2">
                      <Sparkles size={10} className="text-primary shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleAddSubscription(sub)}
                  className="mt-6 w-full border border-primary text-primary font-body text-xs tracking-[0.15em] uppercase py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  Subscribe
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PresaleBundleModal
        open={presaleModalOpen}
        onClose={() => setPresaleModalOpen(false)}
        bundleImage={presaleBundle}
        presalePrice={specialOffer.presalePrice}
        regularPrice={specialOffer.regularPrice}
      />
      <Footer />
    </div>
  );
};

export default Bundles;
