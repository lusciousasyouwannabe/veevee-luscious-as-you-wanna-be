import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";
import Seo from "@/components/Seo";

interface CategoryList {
  title: string;
  items: { name: string; published: boolean }[];
}

const buildFullText = (categories: CategoryList[]) =>
  categories
    .map(
      (c) =>
        `${c.title}\n${"-".repeat(c.title.length)}\n${c.items
          .map((n, i) => `${i + 1}. ${n.name}`)
          .join("\n")}`
    )
    .join("\n\n");

const ProductList = () => {
  const { rows, loading } = useProducts(false);
  const categories = useMemo<CategoryList[]>(() => {
    const map = new Map<string, Map<string, boolean>>();
    for (const row of rows) {
      if (!map.has(row.category)) map.set(row.category, new Map());
      const items = map.get(row.category)!;
      items.set(row.name, (items.get(row.name) ?? false) || row.is_visible);
    }
    return Array.from(map.entries()).map(([title, items]) => ({
      title,
      items: Array.from(items.entries()).map(([name, published]) => ({ name, published })),
    }));
  }, [rows]);

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
    <Seo title="Product List | VeeVee Luscious" description="Internal product list utility for VeeVee Luscious." path="/product-list" noindex />
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
              onClick={() => copy(buildFullText(categories), "all")}
              className="inline-flex items-center gap-2 border border-primary text-primary font-body text-xs tracking-[0.2em] uppercase px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedAll ? "Copied" : "Copy Full List"}
            </button>
          </div>

          {loading && (
            <p className="font-body text-center text-muted-foreground py-10">Loading catalog...</p>
          )}

          <div className="space-y-12">
            {categories.map((cat) => {
              const text = `${cat.title}\n${cat.items
                .map((n, i) => `${i + 1}. ${n.name}`)
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
                    {cat.items.map((item) => (
                      <li key={item.name} className="leading-relaxed">
                        {item.name}
                        {!item.published && (
                          <span className="ml-2 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                            Hidden
                          </span>
                        )}
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