import { Instagram, Facebook, Twitter } from "lucide-react";

const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "X / Twitter", href: "#" },
];

const SocialSection = () => {
  return (
    <section id="social" className="py-24 px-6">
      <div className="container max-w-4xl mx-auto text-center">
        <p className="font-body text-sm tracking-[0.3em] uppercase text-primary">
          Stay Connected
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">
          Follow the Glow
        </h2>
        <p className="font-body text-muted-foreground mt-4 max-w-md mx-auto">
          Join our community for beauty tips, new drops, and exclusive behind-the-scenes content.
        </p>

        <div className="flex justify-center gap-6 mt-10">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="w-14 h-14 flex items-center justify-center border border-border rounded-full text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300 hover:shadow-gold"
            >
              <s.icon size={22} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialSection;
