import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Line {
  slug: string
  quantity: number
  selections?: { component_id: string; product_id: string }[]
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json()
    const orderReference: string = String(body?.orderReference || '').slice(0, 100)
    const lines: Line[] = Array.isArray(body?.lines) ? body.lines : []
    const customer = body?.customer ?? {}
    const email = String(customer?.email || '').trim().toLowerCase().slice(0, 320)
    const phone = String(customer?.phone || '').trim().slice(0, 40) || null
    const shippingAddress = String(customer?.shippingAddress || '').trim().slice(0, 500) || null
    const billingAddress = String(customer?.billingAddress || '').trim().slice(0, 500) || null
    const discountCode = String(body?.discount?.code || '').trim().toUpperCase().slice(0, 40)
    const discountAmount = Number(body?.discount?.amount) || 0
    const orderSubtotal = Number(body?.subtotal) || 0

    if (!orderReference || lines.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    )

    // Idempotency: claim the order reference first. A duplicate key means this
    // order was already fulfilled (e.g. the customer refreshed the page).
    const { error: claimErr } = await supabase
      .from('processed_orders')
      .insert({ order_reference: orderReference, line_items: lines })
    if (claimErr) {
      if ((claimErr as { code?: string }).code === '23505') {
        return new Response(JSON.stringify({ status: 'already_processed' }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      throw claimErr
    }

    const results: unknown[] = []

    for (const line of lines) {
      const qty = Math.max(1, Math.min(999, Number(line.quantity) || 1))
      if (!line.slug) continue

      // Bundles first – they deduct from their component products.
      const { data: bundle } = await supabase
        .from('bundles').select('id').eq('slug', line.slug).maybeSingle()

      if (bundle) {
        const { data, error } = await supabase.rpc('deduct_bundle_inventory', {
          _bundle_id: bundle.id, _qty: qty, _order_reference: orderReference,
        })
        results.push({ slug: line.slug, type: 'bundle', data, error: error?.message ?? null })
        continue
      }

      const { data: product } = await supabase
        .from('products').select('id, quantity, name').eq('slug', line.slug).maybeSingle()

      if (!product) {
        results.push({ slug: line.slug, type: 'unknown', skipped: true })
        continue
      }

      const next = Math.max(0, (product.quantity ?? 0) - qty)
      const { error } = await supabase
        .from('products').update({ quantity: next }).eq('id', product.id)
      results.push({ slug: line.slug, type: 'product', from: product.quantity, to: next, error: error?.message ?? null })
    }

    await supabase.from('processed_orders')
      .update({ result: results }).eq('order_reference', orderReference)

    // ── Customer profile + one-time discount redemption ──
    if (email) {
      const nowIso = new Date().toISOString()
      const { data: existing } = await supabase
        .from('customer_profiles').select('*').ilike('email', email).maybeSingle()

      let profile = existing
      if (!profile) {
        const { data: created } = await supabase.from('customer_profiles').insert({
          email, phone, shipping_address: shippingAddress, billing_address: billingAddress,
          completed_orders: 1, first_order_date: nowIso,
        }).select().maybeSingle()
        profile = created
      } else {
        await supabase.from('customer_profiles').update({
          phone: phone ?? profile.phone,
          shipping_address: shippingAddress ?? profile.shipping_address,
          billing_address: billingAddress ?? profile.billing_address,
          completed_orders: (profile.completed_orders ?? 0) + 1,
          first_order_date: profile.first_order_date ?? nowIso,
        }).eq('id', profile.id)
      }

      if (discountCode && discountAmount > 0 && profile) {
        // Fraud signal: same phone or shipping address already used this code
        let flagged = false
        let flagReason: string | null = null
        const orFilters: string[] = []
        if (phone) orFilters.push(`phone.eq.${phone}`)
        if (shippingAddress) orFilters.push(`shipping_address.eq.${shippingAddress}`)
        if (orFilters.length) {
          const { data: dupes } = await supabase
            .from('discount_redemptions').select('id').eq('code', discountCode).or(orFilters.join(','))
          if (dupes && dupes.length > 0) {
            flagged = true
            flagReason = 'Same phone or shipping address already redeemed this code'
          }
        }

        const { error: redeemErr } = await supabase.from('discount_redemptions').insert({
          code: discountCode, email, customer_id: profile.id, order_reference: orderReference,
          phone, shipping_address: shippingAddress, billing_address: billingAddress,
          discount_amount: discountAmount, order_subtotal: orderSubtotal,
          flagged, flag_reason: flagReason,
        })

        if (!redeemErr) {
          await supabase.from('customer_profiles').update({
            redemption_date: nowIso,
            flagged_for_review: flagged,
            flag_reason: flagReason,
          }).eq('id', profile.id)
        }
      }
    }

    return new Response(JSON.stringify({ status: 'ok', results }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('fulfill-order error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
