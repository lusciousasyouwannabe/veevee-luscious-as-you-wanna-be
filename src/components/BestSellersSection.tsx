import productBodyButter from "@/assets/product-body-butter.jpg";
import productBodyScrub from "@/assets/product-body-scrub.jpg";
import productBathSoak from "@/assets/product-bath-soak.jpg";
import productMassageOil from "@/assets/product-massage-oil.jpg";

const bestsellers = [
  {
    name: "Whipped Shea Body Butter",
    price: "$38",
    image: productBodyButter,
    tag: "Bestseller",
    collection: "Glow Collection",
  },
  {
    name: "Golden Glow Body Scrub",
    price: "$32",
    image: productBodyScrub,
    tag: "Fan Favorite",
    collection: "Soft Skin Collection",
  },
  {
    name: "Lavender Dream Bath Soak",
    price: "$28",
    image: productBathSoak,
    tag: "New",
    collection: "Bath Ritual",
  },
  {
    name: "Sensual Massage Oil",
    price: "$34",
    image: productMassageOil,
    tag: "Couples Pick",
    collection: "Couples Ritual",
  },
];

const BestSellersSection = () => {
  return (
    <section id="bestsellers" className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-primary">
            Most Loved
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Best Sellers
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto">
            The rituals our community can't stop raving about.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <div
              key={product.name}
              className="group bg-card border border-border overflow-hidden hover:border-primary/40 transition-all duration-500"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground font-body text-[10px] font-bold tracking-wider uppercase px-3 py-1">
                  {product.tag}
                </span>
              </div>
              <div className="p-5">
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-1">
                  {product.collection}
                </p>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {product.name}
                </h3>
                <p className="font-body text-primary font-semibold mt-1 tracking-wider">
                  {product.price}
                </p>
                <button className="mt-4 w-full border border-primary text-primary font-body text-xs tracking-[0.15em] uppercase py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                  Add to Ritual
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;
