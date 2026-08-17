import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  amount: number;
  expires_at: string | null;
  min_purchase: number;
  eligible_categories: string[];
  excluded_slugs: string[];
  stackable: boolean;
  first_order_only: boolean;
  active: boolean;
}

interface Profile {
  id: string;
  email: string;
  newsletter_subscriber: boolean;
  welcome_discount_sent: boolean;
  welcome_discount_sent_at: string | null;
  redemption_date: string | null;
  first_order_date: string | null;
  completed_orders: number;
  flagged_for_review: boolean;
  flag_reason: string | null;
}

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="border border-border p-5">
    <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    <p className="font-display text-3xl font-bold text-primary mt-2">{value}</p>
  </div>
);

const DiscountManager = () => {
  const [code, setCode] = useState<DiscountCode | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: codes }, { data: people }] = await Promise.all([
      supabase.from("discount_codes").select("*").eq("code", "LUSCIOUS10").maybeSingle(),
      supabase.from("customer_profiles").select("*").order("created_at", { ascending: false }),
    ]);
    setCode((codes as DiscountCode) ?? null);
    setProfiles((people as Profile[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const sent = profiles.filter((p) => p.welcome_discount_sent).length;
  const redeemed = profiles.filter((p) => p.redemption_date).length;
  const conversion = sent > 0 ? Math.round((redeemed / sent) * 100) : 0;
  const neverRedeemed = profiles.filter((p) => p.welcome_discount_sent && !p.redemption_date);
  const redeemers = profiles.filter((p) => p.redemption_date);

  const update = (patch: Partial<DiscountCode>) =>
    setCode((c) => (c ? { ...c, ...patch } : c));

  const save = async () => {
    if (!code) return;
    setSaving(true);
    const { error } = await supabase.from("discount_codes").update({
      discount_type: code.discount_type,
      amount: Number(code.amount) || 0,
      expires_at: code.expires_at || null,
      min_purchase: Number(code.min_purchase) || 0,
      eligible_categories: code.eligible_categories,
      excluded_slugs: code.excluded_slugs,
      stackable: code.stackable,
      first_order_only: code.first_order_only,
      active: code.active,
    }).eq("id", code.id);
    setSaving(false);
    if (error) toast.error("Could not save settings");
    else toast.success("Discount settings saved");
  };

  const inputCls =
    "w-full px-4 py-2 bg-background border border-border font-body text-sm text-foreground focus:outline-none focus:border-primary";

  if (loading) return <p className="font-body text-muted-foreground text-center py-10">Loading...</p>;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Codes Sent" value={sent} />
        <Stat label="Redeemed" value={redeemed} />
        <Stat label="Conversion" value={`${conversion}%`} />
        <Stat label="Subscribers" value={profiles.filter((p) => p.newsletter_subscriber).length} />
      </div>

      {code && (
        <section className="border border-border p-6">
          <h2 className="font-display text-xl font-bold text-foreground mb-1">
            {code.code} Settings
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-6">
            One shared code, redeemable once per customer email.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            <label className="block">
              <span className="font-body text-xs uppercase tracking-wider text-muted-foreground">Discount type</span>
              <select
                value={code.discount_type}
                onChange={(e) => update({ discount_type: e.target.value })}
                className={inputCls + " mt-1"}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed dollar amount</option>
              </select>
            </label>
            <label className="block">
              <span className="font-body text-xs uppercase tracking-wider text-muted-foreground">
                Amount ({code.discount_type === "fixed" ? "$" : "%"})
              </span>
              <input type="number" min={0} step="0.01" value={code.amount}
                onChange={(e) => update({ amount: Number(e.target.value) })}
                className={inputCls + " mt-1"} />
            </label>
            <label className="block">
              <span className="font-body text-xs uppercase tracking-wider text-muted-foreground">Expiration (optional)</span>
              <input type="date"
                value={code.expires_at ? code.expires_at.slice(0, 10) : ""}
                onChange={(e) => update({ expires_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                className={inputCls + " mt-1"} />
            </label>
            <label className="block">
              <span className="font-body text-xs uppercase tracking-wider text-muted-foreground">Minimum purchase ($)</span>
              <input type="number" min={0} step="0.01" value={code.min_purchase}
                onChange={(e) => update({ min_purchase: Number(e.target.value) })}
                className={inputCls + " mt-1"} />
            </label>
            <label className="block">
              <span className="font-body text-xs uppercase tracking-wider text-muted-foreground">Eligible categories (comma separated, blank = all)</span>
              <input type="text" value={code.eligible_categories.join(", ")}
                onChange={(e) => update({ eligible_categories: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                className={inputCls + " mt-1"} />
            </label>
            <label className="block">
              <span className="font-body text-xs uppercase tracking-wider text-muted-foreground">Excluded product slugs (comma separated)</span>
              <input type="text" value={code.excluded_slugs.join(", ")}
                onChange={(e) => update({ excluded_slugs: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                className={inputCls + " mt-1"} />
            </label>
          </div>

          <div className="flex flex-wrap gap-6 mt-6">
            <label className="flex items-center gap-2 font-body text-sm text-foreground">
              <input type="checkbox" checked={code.stackable} onChange={(e) => update({ stackable: e.target.checked })} />
              Stacks with other promotions
            </label>
            <label className="flex items-center gap-2 font-body text-sm text-foreground">
              <input type="checkbox" checked={code.first_order_only} onChange={(e) => update({ first_order_only: e.target.checked })} />
              First-time customers only
            </label>
            <label className="flex items-center gap-2 font-body text-sm text-foreground">
              <input type="checkbox" checked={code.active} onChange={(e) => update({ active: e.target.checked })} />
              Code active
            </label>
          </div>

          <button onClick={save} disabled={saving}
            className="mt-6 bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase px-8 py-3 hover:bg-primary/90 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </section>
      )}

      <section>
        <h3 className="font-display text-lg font-semibold text-foreground mb-3">Customers who redeemed ({redeemers.length})</h3>
        <div className="border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary">
                <th className="text-left font-body text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Email</th>
                <th className="text-left font-body text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Redeemed</th>
                <th className="text-left font-body text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Orders</th>
                <th className="text-left font-body text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Flag</th>
              </tr>
            </thead>
            <tbody>
              {redeemers.length === 0 ? (
                <tr><td colSpan={4} className="font-body text-sm text-muted-foreground px-5 py-6">No redemptions yet.</td></tr>
              ) : redeemers.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="font-body text-sm text-foreground px-5 py-3">{p.email}</td>
                  <td className="font-body text-sm text-muted-foreground px-5 py-3">
                    {p.redemption_date ? new Date(p.redemption_date).toLocaleDateString() : "—"}
                  </td>
                  <td className="font-body text-sm text-muted-foreground px-5 py-3">{p.completed_orders}</td>
                  <td className="font-body text-sm px-5 py-3">
                    {p.flagged_for_review
                      ? <span className="text-destructive">{p.flag_reason || "Review"}</span>
                      : <span className="text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="font-display text-lg font-semibold text-foreground mb-3">Subscribed but never redeemed ({neverRedeemed.length})</h3>
        <div className="border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary">
                <th className="text-left font-body text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Email</th>
                <th className="text-left font-body text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Code sent</th>
              </tr>
            </thead>
            <tbody>
              {neverRedeemed.length === 0 ? (
                <tr><td colSpan={2} className="font-body text-sm text-muted-foreground px-5 py-6">Everyone has redeemed.</td></tr>
              ) : neverRedeemed.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="font-body text-sm text-foreground px-5 py-3">{p.email}</td>
                  <td className="font-body text-sm text-muted-foreground px-5 py-3">
                    {p.welcome_discount_sent_at ? new Date(p.welcome_discount_sent_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DiscountManager;
