const Footer = () => {
  return (
    <footer className="py-10 px-6 border-t border-border">
      <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display text-lg tracking-wider text-gradient-gold font-bold">
          VV LUSCIOUS
        </span>
        <p className="font-body text-xs text-muted-foreground tracking-wider">
          © {new Date().getFullYear()} VV Luscious As You Wanna Be. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
