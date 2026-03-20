import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CloverCheckoutFormProps {
  totalCents: number;
  onSuccess: () => void;
  onCancel: () => void;
  itemSummary: string;
}

declare global {
  interface Window {
    Clover?: any;
  }
}

const CloverCheckoutForm = ({ totalCents, onSuccess, onCancel, itemSummary }: CloverCheckoutFormProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const cloverRef = useRef<any>(null);
  const cardMountedRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const pakmsId = "4dfd746c22cd9272176c5e5d13285095";

    if (!window.Clover) {
      setError("Clover SDK failed to load. Please refresh the page.");
      return;
    }

    if (cardMountedRef.current) return;

    const clover = new window.Clover(pakmsId);
    cloverRef.current = clover;
    const elements = clover.elements();
    const card = elements.create("CARD");
    card.mount(cardRef.current);
    cardMountedRef.current = true;
    setMounted(true);

    return () => {
      card.unmount();
      cardMountedRef.current = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloverRef.current || loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = await cloverRef.current.createToken();
      if (result.errors) {
        setError(Object.values(result.errors).join(", "));
        setLoading(false);
        return;
      }

      const { data, error: fnError } = await supabase.functions.invoke("clover-charge", {
        body: {
          source: result.token,
          amount: totalCents,
          currency: "usd",
          description: itemSummary,
          email,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Payment Details</h2>
        <button
          onClick={onCancel}
          className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to cart
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2">
            Email (for receipt)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full border border-border bg-background text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2">
            Card Information
          </label>
          <div
            ref={cardRef}
            className="w-full border border-border bg-background px-4 py-3 min-h-[48px] relative overflow-hidden"
            style={{ position: "relative", zIndex: 1 }}
          />
        </div>

        {error && (
          <p className="font-body text-sm text-destructive">{error}</p>
        )}

        <div className="flex justify-between items-center pt-2">
          <span className="font-display text-xl font-bold text-primary">
            ${(totalCents / 100).toFixed(2)}
          </span>
          <button
            type="submit"
            disabled={loading || !mounted}
            className="bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>

        <p className="font-body text-[10px] text-muted-foreground text-center">
          Secure checkout powered by Clover · Your card details are encrypted
        </p>
      </form>
    </div>
  );
};

export default CloverCheckoutForm;
