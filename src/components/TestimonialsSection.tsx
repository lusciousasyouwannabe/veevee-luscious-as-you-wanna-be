import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jasmine R.",
    text: "The whipped body butter is like nothing I've ever felt. My skin literally glows the next morning. I'm obsessed.",
    rating: 5,
    product: "Whipped Shea Body Butter",
  },
  {
    name: "Marcus T.",
    text: "Finally, grooming products that feel luxurious without being overpowering. The beard oil is perfect — smooth, subtle, elevated.",
    rating: 5,
    product: "Gentleman's Beard Oil",
  },
  {
    name: "Keisha W.",
    text: "My husband and I do the couples ritual every Sunday. It's become our thing. The massage oil is divine.",
    rating: 5,
    product: "Couples Ritual Kit",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-primary">
            Real Results
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">
            What Our Community Says
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="p-8 bg-card border border-border"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-primary text-primary"
                  />
                ))}
              </div>
              <p className="font-body text-sm text-foreground leading-relaxed italic">
                "{testimonial.text}"
              </p>
              <div className="mt-6 pt-4 border-t border-border">
                <p className="font-display text-sm font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Purchased: {testimonial.product}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
