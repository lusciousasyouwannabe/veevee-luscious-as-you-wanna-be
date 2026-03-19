import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CLOVER_API_KEY = Deno.env.get("CLOVER_API_KEY");
    const CLOVER_MERCHANT_ID = Deno.env.get("CLOVER_MERCHANT_ID");

    if (!CLOVER_API_KEY) {
      throw new Error("CLOVER_API_KEY is not configured");
    }
    if (!CLOVER_MERCHANT_ID) {
      throw new Error("CLOVER_MERCHANT_ID is not configured");
    }

    const { source, amount, currency, description, email } = await req.json();

    if (!source || !amount) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: source, amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create charge via Clover Ecommerce API (production)
    const chargeRes = await fetch(
      `https://scl.clover.com/v1/charges`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLOVER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount), // amount in cents
          currency: currency || "usd",
          source,
          description: description || "VeeVee Luscious order",
          receipt_email: email || undefined,
        }),
      }
    );

    const chargeData = await chargeRes.json();

    if (!chargeRes.ok) {
      console.error("Clover charge failed:", chargeData);
      return new Response(
        JSON.stringify({
          error: chargeData.message || "Payment failed",
          details: chargeData,
        }),
        {
          status: chargeRes.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ success: true, charge: chargeData }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Clover charge error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
