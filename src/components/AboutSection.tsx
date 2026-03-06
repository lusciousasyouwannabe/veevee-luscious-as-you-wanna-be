const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-6 bg-secondary">
      <div className="container max-w-4xl mx-auto text-center">
        <p className="font-body text-sm tracking-[0.3em] uppercase text-primary">
          Our Story
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">
          Beauty Without Boundaries
        </h2>
        <div className="mt-8 space-y-6 text-muted-foreground font-body leading-relaxed text-base md:text-lg">
          <p>
            VV Luscious was born from a simple truth: every shade of beauty deserves
            to be celebrated. We craft luxurious cosmetics that empower you to
            express your boldest, most authentic self.
          </p>
          <p>
            From rich, velvety lipsticks to luminous highlighters that catch the
            light just right — every product is designed to make you feel as
            luscious as you wanna be.
          </p>
        </div>
        <div className="mt-10 w-24 h-px bg-gradient-gold mx-auto" />
      </div>
    </section>
  );
};

export default AboutSection;
