import { CheckCircle, ShoppingBag, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";

const CheckoutSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="container max-w-2xl mx-auto text-center">
          <CheckCircle size={72} className="mx-auto text-primary mb-6" />
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Thank You for Your Order!
          </h1>
          <p className="font-body text-muted-foreground mt-4 max-w-md mx-auto">
            Your payment was successful. We're preparing your luxurious self-care essentials with love and care.
          </p>
          <p className="font-body text-sm text-muted-foreground mt-2">
            A confirmation will be sent to your email shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 border border-primary text-primary font-body text-xs tracking-[0.15em] uppercase px-8 py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Home size={16} />
              Back to Home
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-body text-xs tracking-[0.15em] uppercase px-8 py-3 hover:bg-primary/90 transition-all duration-300"
            >
              <ShoppingBag size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
