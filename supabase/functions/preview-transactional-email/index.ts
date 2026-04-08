import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { TEMPLATES } from '../_shared/transactional-email-templates/registry.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const apiKey = Deno.env.get('LOVABLE_API_KEY')
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '')
  let authorized = token === apiKey

  if (!authorized && token) {
    try {
      const sbUrl = Deno.env.get('SUPABASE_URL')!
      const sbKey = Deno.env.get('SUPABASE_ANON_KEY')!
      const sb = createClient(sbUrl, sbKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      })
      const { data: { user } } = await sb.auth.getUser()
      if (user) authorized = true
    } catch { /* not a valid JWT */ }
  }

  if (!authorized) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Read saved settings from DB
  const sbUrl = Deno.env.get('SUPABASE_URL')!
  const sbServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const adminSb = createClient(sbUrl, sbServiceKey)

  const { data: allSettings } = await adminSb
    .from('email_template_settings')
    .select('template_name, settings')

  const settingsMap: Record<string, Record<string, any>> = {}
  if (allSettings) {
    for (const row of allSettings) {
      settingsMap[row.template_name] = row.settings as Record<string, any>
    }
  }

  const templateNames = Object.keys(TEMPLATES)
  const results: Array<{
    templateName: string
    displayName: string
    subject: string
    html: string
    status: 'ready' | 'preview_data_required' | 'render_failed'
    errorMessage?: string
    editableFields?: Array<{ key: string; label: string; type: string }>
    defaults?: Record<string, any>
    savedSettings?: Record<string, any>
  }> = []

  for (const name of templateNames) {
    const entry = TEMPLATES[name]
    const displayName = entry.displayName || name
    const savedSettings = settingsMap[name] || {}

    // Merge defaults with saved settings for rendering
    const renderData = { ...(entry.previewData || {}), ...savedSettings }

    try {
      const html = await renderAsync(
        React.createElement(entry.component, renderData)
      )
      const resolvedSubject =
        typeof entry.subject === 'function'
          ? entry.subject(renderData)
          : entry.subject

      results.push({
        templateName: name,
        displayName,
        subject: resolvedSubject,
        html,
        status: 'ready',
        editableFields: entry.editableFields,
        defaults: entry.defaults,
        savedSettings,
      })
    } catch (err) {
      console.error('Failed to render template for preview', { template: name, error: err })
      results.push({
        templateName: name,
        displayName,
        subject: '',
        html: '',
        status: 'render_failed',
        errorMessage: err instanceof Error ? err.message : String(err),
        editableFields: entry.editableFields,
        defaults: entry.defaults,
        savedSettings,
      })
    }
  }

  return new Response(JSON.stringify({ templates: results }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
