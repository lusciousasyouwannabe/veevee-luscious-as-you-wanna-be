import heroImage from "@/assets/hero-ritual.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="VeeVee Luscious luxury self-care ritual"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="font-body text-xs tracking-[0.5em] uppercase text-primary animate-fade-up">
          Luxury Self-Care
        </p>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mt-6 leading-[1] animate-fade-up-delay-1">
          <span className="text-gradient-gold">Luxury Self-Care</span>
          <br />
          <span className="text-foreground italic font-medium text-3xl md:text-5xl lg:text-6xl">
            That Feels As Good As It Works
          </span>
        </h1>
        <p className="font-body text-sm md:text-base text-muted-foreground mt-6 max-w-xl mx-auto leading-relaxed animate-fade-up-delay-2">
          Crafted by two mothers. Designed to nourish skin, calm the body, and turn everyday care into ritual.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up-delay-3">
          <a
            href="#bestsellers"
            className="inline-block bg-gradient-gold text-primary-foreground font-body font-semibold text-sm tracking-[0.15em] uppercase px-10 py-4 hover:opacity-90 transition-opacity shadow-gold"
          >
            Begin Your Ritual
          </a>
          <a
            href="#bestsellers"
            className="inline-block border border-primary text-primary font-body font-semibold text-sm tracking-[0.15em] uppercase px-10 py-4 hover:bg-primary hover:text-primary-foreground transition-all"
          >
            Shop the Ritual
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
