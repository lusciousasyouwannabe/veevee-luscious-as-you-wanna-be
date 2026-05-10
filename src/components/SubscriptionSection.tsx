import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import PresaleBundleModal from "@/components/PresaleBundleModal";
import subscriptionImage from "@/assets/product-presale-bundle.jpg";

const SubscriptionSection = () => {
  const [presaleModalOpen, setPresaleModalOpen] = useState(false);
  const { addToCart } = useCart();

  const handleJoinSubscription = () => {
    addToCart({
      id: "mothers-day-subscription",
      name: "Luscious Monthly Subscription — Mother's Day",
      price: 55,
      image: subscriptionImage,
      category: "Subscription",
    });
    toast.success("Mother's Day Subscription added to cart");
    setPresaleModalOpen(true);
  };

  return (
    <>
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
                Limited Edition — Mother's Day Bundle
              </h2>
              <p className="font-body text-muted-foreground mt-4 max-w-lg">
                Join the curated monthly box subscription and get handpicked VeeVee Luscious self-care favorites delivered every month. Don't miss this Mother's Day special!
              </p>

              <div className="mt-8 p-6 bg-card border border-border space-y-4">
                <div className="flex items-end gap-3 flex-wrap">
                  <p className="font-display text-4xl text-primary font-bold">$55/mo</p>
                  <p className="font-body text-sm text-muted-foreground line-through">$75/mo</p>
                </div>
                <p className="font-body text-sm text-foreground uppercase tracking-[0.15em]">
                  Limited edition — Mother's Day pricing
                </p>
                <p className="font-body text-sm text-muted-foreground">
                  After Mother's Day ends, monthly subscription returns to $75.
                </p>
                <button
                  onClick={handleJoinSubscription}
                  className="mt-2 w-full border border-primary text-primary font-body text-xs tracking-[0.15em] uppercase py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Join Mother's Day Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PresaleBundleModal
        open={presaleModalOpen}
        onClose={() => setPresaleModalOpen(false)}
        bundleImage={subscriptionImage}
        presalePrice={55}
        regularPrice={75}
      />
    </>
  );
};

export default SubscriptionSection;
