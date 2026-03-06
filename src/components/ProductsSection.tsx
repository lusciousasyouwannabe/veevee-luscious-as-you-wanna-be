import productLipstick from "@/assets/product-lipstick.jpg";
import productHighlighter from "@/assets/product-highlighter.jpg";
import productLipgloss from "@/assets/product-lipgloss.jpg";

const products = [
  {
    name: "Velvet Matte Lipstick",
    price: "$28",
    image: productLipstick,
    tag: "Bestseller",
  },
  {
    name: "Golden Hour Highlighter",
    price: "$34",
    image: productHighlighter,
    tag: "New",
  },
  {
    name: "Luscious Lip Gloss",
    price: "$22",
    image: productLipgloss,
    tag: "Fan Favorite",
  },
];

const ProductsSection = () => {
  return (
    <section id="products" className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary">
            The Collection
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Signature Favorites
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.name}
              className="group bg-card border border-border overflow-hidden hover:border-primary/30 transition-all duration-500"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground font-body text-xs font-semibold tracking-wider uppercase px-3 py-1">
                  {product.tag}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {product.name}
                </h3>
                <p className="font-body text-primary font-semibold mt-2 tracking-wider">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
