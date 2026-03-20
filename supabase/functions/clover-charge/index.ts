// Clover Hosted Checkout - v2
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

    if (!CLOVER_API_KEY) throw new Error("CLOVER_API_KEY is not configured");
    if (!CLOVER_MERCHANT_ID) throw new Error("CLOVER_MERCHANT_ID is not configured");

    const { items, email, returnUrl } = await req.json();

    if (!items || !items.length) {
      return new Response(
        JSON.stringify({ error: "Cart is empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build shopping cart for Clover Hosted Checkout
    const shoppingCart = {
      lineItems: items.map((item: any) => ({
        name: item.name,
        unitQty: item.quantity,
        price: Math.round(item.price * 100), // convert to cents
      })),
    };

    const body: any = {
      customer: email ? { email } : {},
      shoppingCart,
    };

    // Create Hosted Checkout session
    const checkoutRes = await fetch(
      `https://api.clover.com/invoicingcheckoutservice/v1/checkouts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLOVER_API_KEY}`,
          "Content-Type": "application/json",
          "X-Clover-Merchant-Id": CLOVER_MERCHANT_ID,
        },
        body: JSON.stringify(body),
      }
    );

    const checkoutData = await checkoutRes.json();

    if (!checkoutRes.ok) {
      console.error("Clover checkout session failed:", checkoutData);
      return new Response(
        JSON.stringify({ error: checkoutData.message || "Failed to create checkout session", details: checkoutData }),
        { status: checkoutRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, checkoutUrl: checkoutData.href }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Clover checkout error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
