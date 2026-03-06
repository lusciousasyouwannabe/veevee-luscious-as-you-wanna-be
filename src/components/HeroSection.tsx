import heroImage from "@/assets/hero-beauty.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="VV Luscious luxury cosmetics collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p className="font-body text-sm tracking-[0.4em] uppercase text-primary animate-fade-up">
          Luxury Beauty Redefined
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mt-4 leading-[0.95] animate-fade-up-delay-1">
          <span className="text-gradient-gold">Luscious</span>
          <br />
          <span className="text-foreground italic font-medium">As You Wanna Be</span>
        </h1>
        <p className="font-body text-base md:text-lg text-muted-foreground mt-6 max-w-lg mx-auto leading-relaxed animate-fade-up-delay-2">
          Indulge in beauty that celebrates you. Bold shades, luxurious textures, unapologetic glamour.
        </p>
        <div className="mt-10 animate-fade-up-delay-3">
          <a
            href="#products"
            className="inline-block bg-gradient-gold text-primary-foreground font-body font-semibold text-sm tracking-[0.15em] uppercase px-10 py-4 hover:opacity-90 transition-opacity shadow-gold"
          >
            Explore the Collection
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
