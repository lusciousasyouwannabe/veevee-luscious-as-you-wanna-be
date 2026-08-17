import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { fulfillOrder, serviceClient } from '../_shared/fulfillment.ts'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

/**
 * Order-confirmation hook.
 *
 * Clover (or any payment/ops system) posts here when an order is completed.
 * The pending order recorded at checkout is looked up by order reference or
 * checkout session id, then inventory deduction + discount redemption run.
 * Fulfillment is idempotent, so webhook retries are safe.
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const raw = await req.text()
    const payload = raw ? JSON.parse(raw) : {}

    // Clover sends a one-time verification code when the webhook URL is saved.
    if (payload?.verificationCode) {
      console.log('Clover webhook verification code:', payload.verificationCode)
      return json({ status: 'verification_received' })
    }

    // Optional shared-secret check when configured.
    const expected = Deno.env.get('CLOVER_WEBHOOK_SECRET')
    if (expected) {
      const provided = req.headers.get('x-clover-auth') ?? req.headers.get('x-webhook-secret')
      if (provided !== expected) return json({ error: 'Unauthorized' }, 401)
    }

    const supabase = serviceClient()

    const orderReference = String(
      payload?.orderReference ?? payload?.order_reference ?? payload?.metadata?.orderReference ?? ''
    ).slice(0, 100)
    const sessionId = String(
      payload?.checkoutSessionId ?? payload?.checkout_session_id ?? payload?.checkoutId ?? ''
    ).slice(0, 120)

    const status = String(payload?.status ?? payload?.type ?? 'completed').toLowerCase()
    const isCompleted = /complete|paid|success|approved|captur/.test(status)
    if (!isCompleted) {
      console.log('Ignoring non-completed order event:', status)
      return json({ status: 'ignored', reason: status })
    }

    if (!orderReference && !sessionId) return json({ error: 'Missing order identifier' }, 400)

    let query = supabase.from('pending_orders').select('*').limit(1)
    query = orderReference
      ? query.eq('order_reference', orderReference)
      : query.eq('checkout_session_id', sessionId)
    const { data: pending, error: lookupErr } = await query.maybeSingle()
    if (lookupErr) throw lookupErr

    if (!pending) {
      console.warn('No pending order found for', orderReference || sessionId)
      return json({ status: 'not_found' }, 404)
    }

    const webhookCustomer = payload?.customer ?? {}
    const outcome = await fulfillOrder(supabase, {
      orderReference: pending.order_reference,
      lines: (pending.lines ?? []) as { slug: string; quantity: number }[],
      subtotal: Number(pending.subtotal) || 0,
      discount: (pending.discount ?? undefined) as { code?: string; amount?: number } | undefined,
      customer: {
        ...(pending.customer ?? {}),
        ...(webhookCustomer.email ? { email: webhookCustomer.email } : {}),
        ...(webhookCustomer.phone ? { phone: webhookCustomer.phone } : {}),
        ...(webhookCustomer.shippingAddress ? { shippingAddress: webhookCustomer.shippingAddress } : {}),
        ...(webhookCustomer.billingAddress ? { billingAddress: webhookCustomer.billingAddress } : {}),
      },
    })

    await supabase.from('pending_orders')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', pending.id)

    return json(outcome)
  } catch (err) {
    console.error('clover-order-webhook error:', err)
    return json({ error: 'Internal server error' }, 500)
  }
})
