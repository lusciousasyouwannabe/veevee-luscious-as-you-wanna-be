import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      // One merged customer profile per email — the same welcome code is sent
      // once, no matter which signup form it came from.
      const { data, error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email: email.trim(), source: "newsletter" },
      });

      if (error) throw error;
      setAlreadySubscribed(!!data?.alreadySubscribed);

      setSubmitted(true);
      setEmail("");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
              {alreadySubscribed
                ? "You're already on the list — your welcome code LUSCIOUS10 is still waiting in your inbox."
                : "Check your inbox for your 10% off code."}
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
              aria-label="Email address"
              className="flex-1 px-5 py-3 bg-background border border-border font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-gold text-primary-foreground font-body font-semibold text-sm tracking-[0.15em] uppercase px-8 py-3 hover:opacity-90 transition-opacity shadow-gold whitespace-nowrap disabled:opacity-50"
            >
              {loading ? "Joining..." : "Become Luscious"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
