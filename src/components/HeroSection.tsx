import heroImage from "@/assets/hero-ritual.jpg";
import logo from "@/assets/logo.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="VeeVee Luscious luxury self-care"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6 animate-fade-up">
          <img
            src={logo}
            alt="VeeVee Luscious logo"
            className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover"
          />
        </div>
        <p className="font-body text-xs tracking-[0.5em] uppercase text-primary animate-fade-up">
          Luxury Self-Care
        </p>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mt-6 leading-[1] animate-fade-up-delay-1">
          <span className="text-gradient-gold">VeeVee Luscious</span>
          <br />
          <span className="text-foreground italic font-medium text-3xl md:text-5xl lg:text-6xl">
            As You Wanna Be
          </span>
        </h1>
        <p className="font-body text-sm md:text-base text-muted-foreground mt-6 max-w-xl mx-auto leading-relaxed animate-fade-up-delay-2">
          Crafted by two mothers. Designed to nourish skin, calm the body, and elevate everyday care.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up-delay-3">
          <a
            href="#bestsellers"
            className="inline-block bg-gradient-gold text-primary-foreground font-body font-semibold text-sm tracking-[0.15em] uppercase px-10 py-4 hover:opacity-90 transition-opacity shadow-gold"
          >
            Begin Your Journey
          </a>
          <a
            href="#bestsellers"
            className="inline-block border border-primary text-primary font-body font-semibold text-sm tracking-[0.15em] uppercase px-10 py-4 hover:bg-primary hover:text-primary-foreground transition-all"
          >
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
