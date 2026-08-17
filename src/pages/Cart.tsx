import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Seo from "@/components/Seo";

const SHIPPING_RATE = 10.0;
export const PENDING_ORDER_KEY = "vv_pending_order";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [discount, setDiscount] = useState<{ code: string; amount: number; label: string } | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const discountAmount = discount?.amount ?? 0;
  const orderTotal = Math.max(0, totalPrice - discountAmount) + SHIPPING_RATE;

  const handleApplyCode = async () => {
    setApplying(true);
    setCodeError(null);
    try {
      const { data, error } = await supabase.functions.invoke("validate-discount", {
        body: {
          code,
          email,
          items: items.map((item) => ({
            slug: item.id,
            category: item.category,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      });
      if (error) throw error;
      if (data?.valid) {
        setDiscount({ code: data.code, amount: data.discountAmount, label: data.label });
        toast.success(`${data.label} applied.`);
      } else {
        setDiscount(null);
        setCodeError(data?.reason || "This discount code is not valid.");
      }
    } catch {
      setCodeError("Could not check that code. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const successUrl = `${window.location.origin}/checkout/success`;

      // Snapshot the cart so inventory can be deducted once the customer
      // returns from Clover with a completed payment.
      const orderReference = `VV-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(
        PENDING_ORDER_KEY,
        JSON.stringify({
          orderReference,
          lines: items.map((item) => ({ slug: item.id, quantity: item.quantity })),
          subtotal: totalPrice,
          customer: email ? { email } : undefined,
          discount: discount ? { code: discount.code, amount: discount.amount } : undefined,
        })
      );

      const { data, error } = await supabase.functions.invoke("clover-checkout", {
        body: {
          items: items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          redirectUrl: successUrl,
          customerEmail: email || undefined,
          discount: discount
            ? { label: `Discount (${discount.code})`, amount: discount.amount }
            : undefined,
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
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Seo title="Your Cart | VeeVee Luscious" description="Review your luxury bath and body selections and check out securely with flat-rate shipping." path="/cart" noindex />
        <Navbar />
        <section className="pt-32 pb-24 px-6">
          <div className="container max-w-2xl mx-auto text-center">
            <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-6" />
            <h1 className="font-display text-3xl font-bold text-foreground">Your Cart is Empty</h1>
            <p className="font-body text-muted-foreground mt-4">Discover our handcrafted self-care essentials.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/shop" className="border border-primary text-primary font-body text-xs tracking-[0.15em] uppercase px-8 py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                Shop Products
              </Link>
              <Link to="/bundles" className="border border-primary text-primary font-body text-xs tracking-[0.15em] uppercase px-8 py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                Browse Bundles
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
    <Seo title="Your Cart | VeeVee Luscious" description="Review your luxury bath and body selections and check out securely with flat-rate shipping." path="/cart" noindex />
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="container max-w-4xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">
            Your Cart <span className="text-primary">({totalItems})</span>
          </h1>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-card border border-border p-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-semibold text-foreground truncate">{item.name}</h3>
                  {item.category && (
                    <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary">{item.category}</p>
                  )}
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-body text-primary font-semibold">${item.price}</span>
                    {item.originalPrice && (
                      <span className="font-body text-xs text-muted-foreground line-through">${item.originalPrice}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease quantity of ${item.name}`} className="w-8 h-8 border border-border flex items-center justify-center text-foreground hover:border-primary transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="font-body text-sm text-foreground w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase quantity of ${item.name}`} className="w-8 h-8 border border-border flex items-center justify-center text-foreground hover:border-primary transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name} from cart`} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-10 bg-card border border-border p-6">
            {/* Discount code */}
            <div className="mb-6 pb-6 border-b border-border">
              <p className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-3">
                Welcome Offer
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  aria-label="Email address for discount code"
                  className="flex-1 px-4 py-3 bg-background border border-border font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Discount code"
                  aria-label="Discount code"
                  className="sm:w-44 px-4 py-3 bg-background border border-border font-body text-sm tracking-widest text-foreground placeholder:text-muted-foreground placeholder:tracking-normal focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={handleApplyCode}
                  disabled={applying || !code.trim() || !email.trim()}
                  className="border border-primary text-primary font-body text-xs tracking-[0.15em] uppercase px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {applying ? "Checking..." : "Apply"}
                </button>
              </div>
              {codeError && (
                <p className="font-body text-xs text-destructive mt-3">{codeError}</p>
              )}
              {discount && (
                <p className="font-body text-xs text-primary mt-3">
                  {discount.code} applied — {discount.label}. One redemption per customer.
                </p>
              )}
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="font-body text-sm text-muted-foreground">Subtotal</span>
              <span className="font-body text-sm text-foreground">${totalPrice.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between items-center mb-2">
                <span className="font-body text-sm text-muted-foreground">Discount ({discount?.code})</span>
                <span className="font-body text-sm text-primary">-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <span className="font-body text-sm text-muted-foreground">Shipping</span>
              <span className="font-body text-sm text-foreground">${SHIPPING_RATE.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-4 flex justify-between items-center mb-6">
              <span className="font-display text-lg font-semibold text-foreground">Total</span>
              <span className="font-display text-2xl font-bold text-primary">${orderTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase py-4 hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </button>
            <p className="font-body text-[10px] text-muted-foreground text-center mt-3">Secure checkout powered by Clover</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Cart;
