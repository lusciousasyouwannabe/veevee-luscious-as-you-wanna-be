import { Sparkles, Droplets, Heart } from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "Radiant Glow",
    description: "Our nutrient-rich formulas reveal your skin's natural luminosity, leaving you with a golden-hour glow all day.",
  },
  {
    icon: Droplets,
    title: "Deep Softness",
    description: "Whipped butters and oils melt into your skin, delivering intense moisture that lasts from morning to night.",
  },
  {
    icon: Heart,
    title: "Total Relaxation",
    description: "Aromatherapy-infused blends calm the nervous system, turning your bathroom into a personal sanctuary.",
  },
];

const TransformationSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-primary">
            The Transformation
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Feel the Difference
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto">
            Every product is designed to create visible, tangible results you can see and feel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="text-center p-8 bg-card border border-border hover:border-primary/30 transition-all duration-500"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <benefit.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground mt-3 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransformationSection;
