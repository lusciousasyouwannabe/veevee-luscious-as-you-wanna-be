import { useState } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-24 px-6 bg-secondary">
      <div className="container max-w-2xl mx-auto text-center">
        <p className="font-body text-sm tracking-[0.3em] uppercase text-primary">
          Exclusive Access
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">
          Join the List
        </h2>
        <p className="font-body text-muted-foreground mt-4">
          Be the first to know about new launches, VIP offers, and beauty secrets.
        </p>

        {submitted ? (
          <p className="mt-10 font-body text-primary font-semibold tracking-wide">
            ✨ Welcome to the VV Luscious family!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-5 py-3 bg-background border border-border font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              className="bg-gradient-gold text-primary-foreground font-body font-semibold text-sm tracking-[0.15em] uppercase px-8 py-3 hover:opacity-90 transition-opacity shadow-gold whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
