import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Signup {
  id: string;
  email: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/admin");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/admin");
      } else {
        fetchSignups();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchSignups = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("newsletter_signups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load signups");
    } else {
      setSignups(data || []);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Newsletter Signups</h1>
          <p className="font-body text-sm text-muted-foreground">VeeVee Luscious Admin</p>
        </div>
        <button
          onClick={handleLogout}
          className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign Out
        </button>
      </header>

      <main className="container max-w-4xl mx-auto px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-body text-sm text-muted-foreground">
            {signups.length} subscriber{signups.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={fetchSignups}
            className="font-body text-sm text-primary hover:underline"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="font-body text-muted-foreground text-center py-10">Loading...</p>
        ) : signups.length === 0 ? (
          <p className="font-body text-muted-foreground text-center py-10">No signups yet.</p>
        ) : (
          <div className="border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary">
                  <th className="text-left font-body font-semibold text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Email</th>
                  <th className="text-left font-body font-semibold text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {signups.map((s) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="font-body text-sm text-foreground px-5 py-3">{s.email}</td>
                    <td className="font-body text-sm text-muted-foreground px-5 py-3">
                      {new Date(s.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
