import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Seo from "@/components/Seo";

type Status = "loading" | "valid" | "already_unsubscribed" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: anonKey } }
        );
        const data = await res.json();
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already_unsubscribed");
        } else if (data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("error");
      }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    setProcessing(true);
    try {
      const { data } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (data?.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
    <Seo title="Email Preferences | VeeVee Luscious" description="Manage your VeeVee Luscious email preferences." path="/unsubscribe" noindex />
      <div className="max-w-md w-full text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">
          Email Preferences
        </h1>

        {status === "loading" && (
          <p className="font-body text-muted-foreground">Verifying...</p>
        )}

        {status === "valid" && (
          <div>
            <p className="font-body text-muted-foreground mb-6">
              Would you like to unsubscribe from VeeVee Luscious emails?
            </p>
            <button
              onClick={handleUnsubscribe}
              disabled={processing}
              className="bg-primary text-primary-foreground font-body font-semibold text-sm tracking-[0.15em] uppercase px-8 py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {processing ? "Processing..." : "Confirm Unsubscribe"}
            </button>
          </div>
        )}

        {status === "success" && (
          <p className="font-body text-muted-foreground">
            You've been successfully unsubscribed. We're sorry to see you go. 💛
          </p>
        )}

        {status === "already_unsubscribed" && (
          <p className="font-body text-muted-foreground">
            You're already unsubscribed from our emails.
          </p>
        )}

        {status === "invalid" && (
          <p className="font-body text-muted-foreground">
            This unsubscribe link is invalid or has expired.
          </p>
        )}

        {status === "error" && (
          <p className="font-body text-destructive">
            Something went wrong. Please try again later.
          </p>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
