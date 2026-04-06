const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div>
            <span className="font-display text-lg tracking-wider text-gradient-gold font-bold">
              VEEVEE LUSCIOUS AS YOU WANNA BE
            </span>
            <p className="font-body text-xs text-muted-foreground mt-2 max-w-xs">
              Luxury self-care that nourishes skin, calms the body, and elevates everyday care.
            </p>
          </div>


          <div>
            <h4 className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Connect
            </h4>
            <div className="space-y-2">
              {["Instagram", "TikTok", "Facebook", "Pinterest"].map((s) => (
                <a key={s} href="#" className="block font-body text-xs text-muted-foreground hover:text-primary transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="font-body text-xs text-muted-foreground tracking-wider">
            © {new Date().getFullYear()} VeeVee Luscious As You Wanna Be. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
