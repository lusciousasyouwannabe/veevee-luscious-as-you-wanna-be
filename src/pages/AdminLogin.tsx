import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Seo from "@/components/Seo";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/admin/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin/dashboard");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Account created! You're now signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
    <Seo title="Admin Access | VeeVee Luscious" description="Administrator sign in." path="/admin" noindex />
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">Admin Access</h1>
        <p className="font-body text-sm text-muted-foreground text-center mb-8">VeeVee Luscious</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 bg-background border border-border font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 bg-background border border-border font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-gold text-primary-foreground font-body font-semibold text-sm tracking-[0.15em] uppercase px-8 py-3 hover:opacity-90 transition-opacity shadow-gold disabled:opacity-50"
          >
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isSignUp ? "Already have an account? Sign in" : "First time? Create account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
