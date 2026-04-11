import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import subscriptionImage from "@/assets/product-presale-bundle.jpg";

const SubscriptionSection = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinSubscription = async () => {
    setIsLoading(true);
    try {
      const successUrl = `${window.location.origin}/checkout/success`;

      const { data, error } = await supabase.functions.invoke("clover-checkout", {
        body: {
          items: [
            {
              name: "Luscious Monthly Subscription — Pre-Sale",
              price: 55,
              quantity: 1,
            },
          ],
          redirectUrl: successUrl,
        },
      });

      if (error) {
        console.error("Checkout error:", error);
        toast.error("Checkout failed. Please try again.");
        return;
      }

      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.error("Unable to create checkout session. Please try again.");
        console.error("No checkout URL returned:", data);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="subscription" className="py-24 px-6 bg-secondary">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <img
              src={subscriptionImage}
              alt="VeeVee Luscious curated monthly subscription box"
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 border border-primary/20" />
          </div>

          <div className="order-1 lg:order-2">
            <p className="font-body text-xs tracking-[0.4em] uppercase text-primary">
              Monthly Ritual Box
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground leading-tight">
              This Weekend Only — 48-Hour Sale
            </h2>
            <p className="font-body text-muted-foreground mt-4 max-w-lg">
              Join the curated monthly box subscription and get handpicked VeeVee Luscious self-care favorites delivered every month. Don't miss this weekend-only deal!
            </p>

            <div className="mt-8 p-6 bg-card border border-border space-y-4">
              <div className="flex items-end gap-3 flex-wrap">
                <p className="font-display text-4xl text-primary font-bold">$55/mo</p>
                <p className="font-body text-sm text-muted-foreground line-through">$75/mo</p>
              </div>
              <p className="font-body text-sm text-foreground uppercase tracking-[0.15em]">
                This weekend only — 48-hour sale pricing
              </p>
              <p className="font-body text-sm text-muted-foreground">
                After pre-sale ends, monthly subscription returns to $75.
              </p>
              <button
                onClick={handleJoinSubscription}
                disabled={isLoading}
                className="mt-2 w-full border border-primary text-primary font-body text-xs tracking-[0.15em] uppercase py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Join Pre-Sale Subscription"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
