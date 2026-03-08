import transformationImage from "@/assets/transformation-glow.jpg";

const FinalCTASection = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={transformationImage}
          alt="VeeVee Luscious luxury skincare collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <p className="font-body text-xs tracking-[0.4em] uppercase text-primary">
          Your Glow Awaits
        </p>
        <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 text-foreground leading-tight">
          Ready to Feel{" "}
          <span className="text-gradient-gold italic">Luscious</span>?
        </h2>
        <p className="font-body text-muted-foreground mt-6 max-w-md mx-auto">
          Nourish your skin. Calm your body. Reconnect with softness. Your ritual starts now.
        </p>
        <div className="mt-10">
          <a
            href="#bestsellers"
            className="inline-block bg-gradient-gold text-primary-foreground font-body font-semibold text-sm tracking-[0.15em] uppercase px-12 py-4 hover:opacity-90 transition-opacity shadow-gold"
          >
            Begin Your Ritual
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
