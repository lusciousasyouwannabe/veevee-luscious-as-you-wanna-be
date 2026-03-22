// Clover Hosted Checkout v2
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

    const { items, email } = await req.json();

    if (!items || !items.length) {
      return new Response(
        JSON.stringify({ error: "Cart is empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build shopping cart for Clover Hosted Checkout
    const shoppingCart = {
      lineItems: items.map((item: { name: string; quantity: number; price: number }) => ({
        name: item.name,
        unitQty: item.quantity,
        price: Math.round(item.price * 100), // convert to cents
      })),
    };

    const body = {
      customer: email ? { email } : {},
      shoppingCart,
    };

    // Create Hosted Checkout session
    const checkoutUrl = `https://api.clover.com/invoicingcheckoutservice/v1/checkouts`;
    console.log("Calling Clover API:", checkoutUrl);

    const checkoutRes = await fetch(checkoutUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLOVER_API_KEY}`,
        "Content-Type": "application/json",
        "X-Clover-Merchant-Id": CLOVER_MERCHANT_ID,
      },
      body: JSON.stringify(body),
    });

    const responseText = await checkoutRes.text();
    console.log("Clover response status:", checkoutRes.status, "body:", responseText);

    if (!checkoutRes.ok) {
      console.error("Clover checkout session failed:", responseText);
      let errorMessage = "Failed to create checkout session";
      try {
        const parsed = JSON.parse(responseText);
        errorMessage = parsed.message || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: checkoutRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let checkoutData;
    try {
      checkoutData = JSON.parse(responseText);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid response from payment provider" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
