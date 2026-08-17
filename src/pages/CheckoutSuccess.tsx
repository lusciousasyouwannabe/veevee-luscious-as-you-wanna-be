import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { PENDING_ORDER_KEY } from "@/pages/Cart";

const CheckoutSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();

    // Deduct inventory for the completed order (bundles deduct from their
    // component products). The backend is idempotent per order reference.
    const raw = localStorage.getItem(PENDING_ORDER_KEY);
    if (!raw) return;
    localStorage.removeItem(PENDING_ORDER_KEY);
    try {
      const pending = JSON.parse(raw);
      if (pending?.orderReference && pending?.lines?.length) {
        supabase.functions
          .invoke("fulfill-order", { body: pending })
          .catch((err) => console.error("Inventory deduction failed:", err));
      }
    } catch (err) {
      console.error("Could not read pending order:", err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="container max-w-2xl mx-auto text-center">
          <CheckCircle size={64} className="mx-auto text-primary mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground">Thank You for Your Order!</h1>
          <p className="font-body text-muted-foreground mt-4">
            Your payment was successful. We're preparing your luxurious self-care essentials with love.
          </p>
          <p className="font-body text-sm text-muted-foreground mt-2">
            A confirmation email will be sent to you shortly.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-8 border border-primary text-primary font-body text-xs tracking-[0.15em] uppercase px-8 py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
