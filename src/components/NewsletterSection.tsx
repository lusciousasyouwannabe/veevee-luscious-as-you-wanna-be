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
        <p className="font-body text-xs tracking-[0.4em] uppercase text-primary">
          Exclusive Access
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">
          Become Luscious
        </h2>
        <p className="font-body text-muted-foreground mt-4">
          Join our inner circle and get 10% off your first order, plus early access to new launches and VIP offers.
        </p>

        {submitted ? (
          <div className="mt-10">
            <p className="font-display text-xl text-primary font-semibold">
              ✨ Welcome to the family.
            </p>
            <p className="font-body text-sm text-muted-foreground mt-2">
              Check your inbox for your 10% off code.
            </p>
          </div>
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
              Become Luscious
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
