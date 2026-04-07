const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="container max-w-6xl mx-auto text-center space-y-8">
        <div>
          <span className="font-display text-lg tracking-wider text-gradient-gold font-bold">
            VEEVEE LUSCIOUS AS YOU WANNA BE
          </span>
          <p className="font-body text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
            Luxury self-care that nourishes skin, calms the body, and elevates everyday care.
          </p>
        </div>

        <div>
          <h4 className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">
            Connect
          </h4>
          <div className="flex justify-center gap-6">
            {[
              { name: "Instagram", url: "https://www.instagram.com/lusciousasyouwannabe?igsh=c2Q1czFxMDVobGpo&utm_source=qr" },
              { name: "TikTok", url: "https://www.tiktok.com/@vee_vee_luscious?is_from_webapp=1&sender_device=pc" },
            ].map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors">
                {s.name}
              </a>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="font-body text-xs text-muted-foreground tracking-wider">
            © {new Date().getFullYear()} VeeVee Luscious As You Wanna Be. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
