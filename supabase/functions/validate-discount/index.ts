import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

interface Item { slug?: string; category?: string; price: number; quantity: number }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json().catch(() => ({}))
    const code = String(body?.code || '').trim().toUpperCase().slice(0, 40)
    const email = String(body?.email || '').trim().toLowerCase().slice(0, 320)
    const items: Item[] = Array.isArray(body?.items) ? body.items : []

    if (!code) return json({ valid: false, reason: 'Please enter a discount code.' }, 200)
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ valid: false, reason: 'Please enter a valid email address.' }, 200)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    )

    const { data: dc } = await supabase
      .from('discount_codes').select('*').eq('code', code).maybeSingle()

    if (!dc || !dc.active) return json({ valid: false, reason: 'This discount code is not valid.' })
    if (dc.expires_at && new Date(dc.expires_at) < new Date()) {
      return json({ valid: false, reason: 'This discount code has expired.' })
    }

    // Already redeemed by this email?
    const { data: prior } = await supabase
      .from('discount_redemptions').select('id').eq('code', code).ilike('email', email).maybeSingle()
    if (prior) {
      return json({ valid: false, reason: 'This discount has already been used with this email address.' })
    }

    // First-order-only rule
    const { data: profile } = await supabase
      .from('customer_profiles').select('*').ilike('email', email).maybeSingle()

    if (dc.first_order_only && profile && (profile.completed_orders > 0 || profile.first_order_date)) {
      return json({ valid: false, reason: 'This discount is valid for first-time customers only.' })
    }
    if (profile?.flagged_for_review) {
      return json({ valid: false, reason: 'This discount is unavailable for this account. Please contact us.' })
    }

    // Eligible subtotal (categories / excluded products)
    const eligible = items.filter((i) => {
      if (dc.excluded_slugs?.length && i.slug && dc.excluded_slugs.includes(i.slug)) return false
      if (dc.eligible_categories?.length) return i.category ? dc.eligible_categories.includes(i.category) : false
      return true
    })
    const eligibleSubtotal = eligible.reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0)
    const fullSubtotal = items.reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0)

    if (eligibleSubtotal <= 0) {
      return json({ valid: false, reason: 'This discount does not apply to the items in your cart.' })
    }
    if (Number(dc.min_purchase) > 0 && fullSubtotal < Number(dc.min_purchase)) {
      return json({ valid: false, reason: `Add $${(Number(dc.min_purchase) - fullSubtotal).toFixed(2)} more to use this discount.` })
    }

    const raw = dc.discount_type === 'fixed'
      ? Number(dc.amount)
      : (eligibleSubtotal * Number(dc.amount)) / 100
    const discountAmount = Math.min(Math.round(raw * 100) / 100, eligibleSubtotal)

    return json({
      valid: true,
      code,
      discountAmount,
      discountType: dc.discount_type,
      amount: Number(dc.amount),
      stackable: dc.stackable,
      label: dc.discount_type === 'fixed' ? `$${Number(dc.amount).toFixed(2)} off` : `${Number(dc.amount)}% off`,
    })
  } catch (err) {
    console.error('validate-discount error:', err)
    return json({ error: 'Internal server error' }, 500)
  }
})
