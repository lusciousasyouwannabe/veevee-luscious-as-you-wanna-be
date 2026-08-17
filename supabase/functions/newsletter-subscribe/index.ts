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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json().catch(() => ({}))
    const email = String(body?.email || '').trim().toLowerCase().slice(0, 320)
    const source = String(body?.source || 'newsletter').slice(0, 40)

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ error: 'Please enter a valid email address.' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    )

    await supabase.from('newsletter_signups').insert({ email })

    // Merge every signup source into a single customer profile keyed by email.
    const { data: existing } = await supabase
      .from('customer_profiles').select('*').ilike('email', email).maybeSingle()

    let profile = existing
    if (!profile) {
      const { data: created } = await supabase
        .from('customer_profiles')
        .insert({ email, newsletter_subscriber: true })
        .select().maybeSingle()
      profile = created
    } else if (!profile.newsletter_subscriber) {
      await supabase.from('customer_profiles')
        .update({ newsletter_subscriber: true }).eq('id', profile.id)
    }

    const alreadySent = !!profile?.welcome_discount_sent
    const { data: dc } = await supabase
      .from('discount_codes').select('code, active').eq('code', 'LUSCIOUS10').maybeSingle()
    const code = dc?.active ? dc.code : null

    if (!alreadySent && profile) {
      try {
        await supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'newsletter-welcome',
            recipientEmail: email,
            idempotencyKey: `newsletter-welcome-${profile.id}`,
          },
        })
        await supabase.from('customer_profiles').update({
          welcome_discount_sent: true,
          welcome_discount_sent_at: new Date().toISOString(),
        }).eq('id', profile.id)
      } catch (err) {
        console.error('welcome email failed', err)
      }
    }

    return json({ status: 'ok', code, alreadySubscribed: alreadySent, source })
  } catch (err) {
    console.error('newsletter-subscribe error:', err)
    return json({ error: 'Internal server error' }, 500)
  }
})
