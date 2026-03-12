import ritualSetImage from "@/assets/product-selfcare-edited.jpg";

const bundles = [
  {
    name: "The Luscious Self-Care Set",
    description: "Body butter, scrub & bath soak — the complete self-care experience.",
    price: "$89",
    savings: "Save $9",
  },
  {
    name: "Glow Goddess Bundle",
    description: "Everything for luminous, radiant skin from head to toe.",
    price: "$72",
    savings: "Save $12",
  },
  {
    name: "Luscious Gentleman's Set",
    description: "Beard oil, hair oil & body butter crafted for the modern man.",
    price: "$68",
    savings: "Save $8",
  },
  {
    name: "Couples Kit",
    description: "Massage oil, bath soak & body butters for two. Connection redefined.",
    price: "$110",
    savings: "Save $15",
  },
];

const RitualBundlesSection = () => {
  return (
    <section id="bundles" className="py-24 px-6 bg-secondary">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-body text-xs tracking-[0.4em] uppercase text-primary">
              Curated Sets
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground leading-tight">
              Curated Bundles
            </h2>
            <p className="font-body text-muted-foreground mt-4 max-w-md">
              Thoughtfully paired collections for every kind of self-care moment.
            </p>

            <div className="mt-10 space-y-4">
              {bundles.map((bundle) => (
                <div
                  key={bundle.name}
                  className="flex items-center justify-between p-5 bg-card border border-border hover:border-primary/30 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex-1">
                    <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {bundle.name}
                    </h3>
                    <p className="font-body text-xs text-muted-foreground mt-1">
                      {bundle.description}
                    </p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className="font-body text-primary font-bold text-lg">
                      {bundle.price}
                    </p>
                    <p className="font-body text-xs text-primary/70">
                      {bundle.savings}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src={ritualSetImage}
              alt="VeeVee Luscious bundle set"
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 border border-primary/20" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RitualBundlesSection;

