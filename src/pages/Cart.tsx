import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  const handleCheckout = () => {
    // Clover integration placeholder — will be connected once API keys are provided
    alert("Clover checkout integration will be connected once API keys are configured. Your cart total is $" + totalPrice.toFixed(2));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
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
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 border border-border flex items-center justify-center text-foreground hover:border-primary transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="font-body text-sm text-foreground w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 border border-border flex items-center justify-center text-foreground hover:border-primary transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-10 bg-card border border-border p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="font-display text-lg font-semibold text-foreground">Total</span>
              <span className="font-display text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase py-4 hover:bg-primary/90 transition-all duration-300"
            >
              Proceed to Checkout
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
