import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const categories: { title: string; items: string[] }[] = [
  {
    title: "Bath Bars",
    items: [
      "Ohh Honey Luxury Bath Bar",
      "Cool Citronella Luxury Bath Bar",
      "Crème Brûlée Luxury Bath Bar",
      "The Gentleman Luxury Bath Bar",
      "Classic Man Luxury Bath Bar",
      "Beach Boys Luxury Bath Bar",
      "Good Girl Luxury Bath Bar",
      "Strawberry & Cream Luxury Bath Bar",
      "Mardi Gras Luxury Bath Bar",
    ],
  },
  {
    title: "Bath Soaks",
    items: [
      "Lovely Lotus Luxury Bath Soak",
      "French Vanilla & Oatmeal Luxury Bath Soak",
      "Classic Man Luxury Bath Soak",
      "Crème Brûlée Cream & Butter Botanical Bath Soak",
      "The Gentleman Luxury Bath Soak",
      "Very Berry Luxury Bath Soak",
      "Amber Luxury Bath Soak",
      "Luxury Myrtille Bath Soak",
    ],
  },
  {
    title: "Body Butters",
    items: [
      "Luxury Myrtille Body Butter",
      "Cool Citronella Luxury Body Butter",
      "The Gentleman Luxury Body Butter",
      "Ohh Honey Luxury Body Butter",
      "Crème Brûlée Body Butter",
    ],
  },
  {
    title: "Body Scrubs",
    items: [
      "Crème Brûlée Sugar Scrub",
      "Luxury Myrtille Body Scrub",
      "Luxe Very Berry Body Scrub",
      "French Vanilla Luxury Body Scrub",
      "Good Girl Luxury Body Scrub",
      "Beach Boys Luxury Body Scrub",
    ],
  },
];

const buildFullText = () =>
  categories
    .map(
      (c) =>
        `${c.title}\n${"-".repeat(c.title.length)}\n${c.items
          .map((n, i) => `${i + 1}. ${n}`)
          .join("\n")}`
    )
    .join("\n\n");

const ProductList = () => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (key === "all") {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      } else {
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
      }
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-body text-xs tracking-[0.4em] uppercase text-primary">
              Catalog
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">
              Product List
            </h1>
          </div>

          <div className="flex justify-center mb-12">
            <button
              onClick={() => copy(buildFullText(), "all")}
              className="inline-flex items-center gap-2 border border-primary text-primary font-body text-xs tracking-[0.2em] uppercase px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedAll ? "Copied" : "Copy Full List"}
            </button>
          </div>

          <div className="space-y-12">
            {categories.map((cat) => {
              const text = `${cat.title}\n${cat.items
                .map((n, i) => `${i + 1}. ${n}`)
                .join("\n")}`;
              const isCopied = copiedKey === cat.title;
              return (
                <div
                  key={cat.title}
                  className="bg-card border border-border p-6 md:p-8"
                >
                  <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                    <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                      {cat.title}
                    </h2>
                    <button
                      onClick={() => copy(text, cat.title)}
                      className="inline-flex items-center gap-2 text-primary font-body text-[10px] tracking-[0.2em] uppercase hover:opacity-80 transition"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {isCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <ol className="space-y-2 font-body text-foreground list-decimal list-inside">
                    {cat.items.map((name) => (
                      <li key={name} className="leading-relaxed">
                        {name}
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductList;