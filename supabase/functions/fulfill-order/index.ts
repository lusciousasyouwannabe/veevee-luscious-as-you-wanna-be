import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { fulfillOrder, serviceClient, type FulfillInput } from '../_shared/fulfillment.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = (await req.json()) as FulfillInput
    const orderReference = String(body?.orderReference || '').slice(0, 100)
    const lines = Array.isArray(body?.lines) ? body.lines : []

    if (!orderReference || lines.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = serviceClient()
    const outcome = await fulfillOrder(supabase, { ...body, orderReference, lines })

    await supabase.from('pending_orders')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('order_reference', orderReference)

    return new Response(JSON.stringify(outcome), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('fulfill-order error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
