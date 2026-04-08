

## Plan: Add Email Preview Tab to Admin Dashboard

### What we're building
A new "Email Templates" tab in the admin dashboard that renders a live preview of the newsletter welcome email directly in the browser. You'll be able to see exactly what subscribers receive, right alongside your existing Subscribers tab.

### How it works

The email template lives in an Edge Function directory using Deno-specific imports (`npm:react`, `npm:@react-email/components`) that can't run in the browser. So we'll call the existing `preview-transactional-email` Edge Function, which renders the template server-side and returns the HTML. The dashboard will display it in an iframe.

### Changes

**1. Update `AdminDashboard.tsx`**
- Add Tabs (Subscribers | Email Templates) using the existing `@/components/ui/tabs` component
- Move the current signups table into a "Subscribers" tab
- Add an "Email Templates" tab that:
  - Calls the `preview-transactional-email` Edge Function on load
  - Shows a list of templates on the left (currently just "Newsletter Welcome")
  - Renders the selected template's HTML in an iframe on the right
  - Shows a loading/error state while fetching

**2. No new files or database changes needed**
- The `preview-transactional-email` function already exists and returns rendered HTML
- The Tabs UI component already exists
- Auth protection already covers the dashboard

### Technical note
The Edge Function is gated by `LOVABLE_API_KEY`, so we'll call it via `supabase.functions.invoke()` which automatically handles auth headers. If that doesn't match the expected key, we'll fall back to rendering a static HTML version of the email inline.

