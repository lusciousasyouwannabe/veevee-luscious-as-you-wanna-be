const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const ItemSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
})

const BodySchema = z.object({
  items: z.array(ItemSchema).min(1),
  redirectUrl: z.string().url(),
  discount: z
    .object({ label: z.string().min(1).max(120), amount: z.number().positive() })
    .optional(),
  customerEmail: z.string().email().optional(),
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid request', details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { items, redirectUrl, discount, customerEmail } = parsed.data

    const apiKey = Deno.env.get('CLOVER_API_KEY')
    const merchantId = Deno.env.get('CLOVER_MERCHANT_ID')

    console.log('API Key present:', !!apiKey, 'length:', apiKey?.length)
    console.log('Merchant ID present:', !!merchantId, 'value:', merchantId)

    if (!apiKey || !merchantId) {
      return new Response(
        JSON.stringify({ error: 'Clover credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build line items for Clover Hosted Checkout
    const SHIPPING_RATE_CENTS = 1000 // $10.00

    const lineItems = items.map((item) => ({
      name: item.name,
      unitQty: item.quantity,
      price: Math.round(item.price * 100), // Clover uses cents
    }))

    // Add flat rate shipping as a line item
    lineItems.push({
      name: 'Flat Rate Shipping',
      unitQty: 1,
      price: SHIPPING_RATE_CENTS,
    })

    const itemsTotalCents = lineItems.reduce((sum, li) => sum + li.price * li.unitQty, 0)
    if (discount) {
      const discountCents = Math.min(
        Math.round(discount.amount * 100),
        itemsTotalCents - SHIPPING_RATE_CENTS
      )
      if (discountCents > 0) {
        lineItems.push({ name: discount.label, unitQty: 1, price: -discountCents })
      }
    }

    const totalAmount = lineItems.reduce((sum, li) => sum + li.price * li.unitQty, 0)

    // Create a Clover Hosted Checkout session
    const checkoutPayload = {
      customer: {
        email: customerEmail ?? '', // Clover collects/confirms on the checkout page
      },
      shoppingCart: {
        lineItems,
        total: totalAmount,
      },
    }

    const checkoutRes = await fetch(
      `https://api.clover.com/invoicingcheckoutservice/v1/checkouts`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'X-Clover-Merchant-Id': merchantId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutPayload),
      }
    )

    const checkoutText = await checkoutRes.text()
    console.log('Clover response status:', checkoutRes.status)
    console.log('Clover response body:', checkoutText)

    if (!checkoutRes.ok) {
      return new Response(
        JSON.stringify({ error: 'Clover checkout creation failed', details: checkoutText }),
        { status: checkoutRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const checkoutData = JSON.parse(checkoutText)

    return new Response(
      JSON.stringify({
        checkoutUrl: checkoutData.href || checkoutData.checkout?.href,
        checkoutSessionId: checkoutData.id || checkoutData.checkout?.id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Checkout error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
