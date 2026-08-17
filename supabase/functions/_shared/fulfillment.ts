import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0'

export interface Line {
  slug: string
  quantity: number
  selections?: { component_id: string; product_id: string }[]
}

export interface FulfillInput {
  orderReference: string
  lines: Line[]
  customer?: {
    email?: string
    phone?: string
    shippingAddress?: string
    billingAddress?: string
  }
  discount?: { code?: string; amount?: number }
  subtotal?: number
}

export function serviceClient(): SupabaseClient {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } }
  )
}

/**
 * Deducts inventory and records the discount redemption for a completed order.
 * Idempotent per order reference.
 */
export async function fulfillOrder(
  supabase: SupabaseClient,
  input: FulfillInput
): Promise<{ status: 'ok' | 'already_processed'; results: unknown[] }> {
  const orderReference = String(input.orderReference || '').slice(0, 100)
  const lines = Array.isArray(input.lines) ? input.lines : []
  const customer = input.customer ?? {}
  const email = String(customer.email || '').trim().toLowerCase().slice(0, 320)
  const phone = String(customer.phone || '').trim().slice(0, 40) || null
  const shippingAddress = String(customer.shippingAddress || '').trim().slice(0, 500) || null
  const billingAddress = String(customer.billingAddress || '').trim().slice(0, 500) || null
  const discountCode = String(input.discount?.code || '').trim().toUpperCase().slice(0, 40)
  const discountAmount = Number(input.discount?.amount) || 0
  const orderSubtotal = Number(input.subtotal) || 0

  // Idempotency: claim the order reference first. A duplicate key means this
  // order was already fulfilled (page refresh, webhook retry, or both paths).
  const { error: claimErr } = await supabase
    .from('processed_orders')
    .insert({ order_reference: orderReference, line_items: lines })
  if (claimErr) {
    if ((claimErr as { code?: string }).code === '23505') {
      return { status: 'already_processed', results: [] }
    }
    throw claimErr
  }

  const results: unknown[] = []

  for (const line of lines) {
    const qty = Math.max(1, Math.min(999, Number(line.quantity) || 1))
    if (!line.slug) continue

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

  return { status: 'ok', results }
}
