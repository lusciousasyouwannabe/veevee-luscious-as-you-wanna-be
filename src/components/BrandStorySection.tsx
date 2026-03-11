const BrandStorySection = () => {
  return (
    <section id="about" className="py-24 px-6 bg-secondary">
      <div className="container max-w-3xl mx-auto">
        <div className="text-center">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-primary">
            Our Story
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground leading-tight">
            Crafted with Love,
            <br />
            <span className="text-gradient-gold italic">by Two Mothers</span>
          </h2>
          <div className="mt-8 space-y-5 text-muted-foreground font-body leading-relaxed text-sm md:text-base text-left md:text-center">
            <p>
              VeeVee Luscious was born from a simple belief: self-care should be
              more than a routine — it should be an experience. As mothers, we know
              what it means to pour into everyone else. We created this brand so
              you can pour back into yourself.
            </p>
            <p>
              Every product is handcrafted with intention, using premium natural
              ingredients that nourish your skin, calm your nervous system, and
              reconnect you with softness. Because you deserve to feel as
              luscious as you wanna be.
            </p>
          </div>
          <div className="mt-8 w-24 h-px bg-gradient-gold mx-auto" />
          <a
            href="#products"
            className="inline-block mt-8 bg-gradient-gold text-primary-foreground font-body font-semibold text-sm tracking-[0.15em] uppercase px-8 py-3 hover:opacity-90 transition-opacity shadow-gold"
          >
            Reveal Your Glow
          </a>
        </div>
      </div>
    </section>
  );
};

export default BrandStorySection;