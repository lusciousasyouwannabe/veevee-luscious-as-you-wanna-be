# Inventory Management Module

Move product data out of hardcoded lists and into a database-backed inventory the admin controls, then hide the eight named Bath Bars from the public Shop.

## What changes for you

- The Shop page keeps showing products exactly as it does today, but the list now comes from your backend instead of code.
- A new **Inventory** tab in the Admin Dashboard lists every product (Bath Bars, Bath Soaks, Body Butters, Body Scrubs) with: name, category, size/variant, price, stock quantity, and a Published switch.
- The eight bath bars you named (Ohh Honey, Cool Citronella, Crème Brûlée, The Gentleman, Classic Man, Beach Boys, Strawberry & Cream, Mardi Gras) start as **unpublished** — they disappear from the Shop but stay fully editable in Inventory so you can bring any of them back with one toggle.
- Good Girl Luxury Bath Bar stays live, so the Bath Bars category still appears in the Shop.
- Admin can edit price, stock, and published state inline; changes appear on the storefront on next load.

## Build steps

1. **Database**: create `public.products` with `slug` (unique), `name`, `category`, `price`, `size` (nullable), `variant_key` (nullable), `image_key`, `stock_quantity`, `is_published`, `sort_order`, timestamps. Grant read to anon/authenticated for published rows; full write restricted to the admin email used by the existing email-template policies. Add an `updated_at` trigger.
2. **Seed**: insert every current product and variant from `Shop.tsx` (28 base products plus their 4oz/8oz variants), with the eight named bath bars set to `is_published = false`.
3. **Image mapping**: keep the existing imported image assets in a small `src/data/productImages.ts` map keyed by `image_key`, so the database stores a key and the app resolves the bundled asset — no image re-upload needed.
4. **Shop page**: replace the hardcoded `products` / `variantProducts` constants with a fetch of published rows, grouped into the same category filter and variant modal shapes. Loading and empty states included; cart behaviour unchanged.
5. **Admin Inventory tab**: new `src/components/InventoryManager.tsx` added as a third tab in `AdminDashboard.tsx` — category-grouped table, inline price/stock editing, publish toggle, and a filter for unpublished items.
6. **Product list page**: `/product-list` reads the same inventory so the copyable lists stay in sync, with unpublished items shown but marked.

## Technical notes

- Data access uses the existing Supabase client; the admin write policies mirror the pattern already used by `email_template_settings` (JWT email match).
- Stock quantity is recorded and displayed but does not block checkout in this pass; out-of-stock enforcement can be added later.
- Clover checkout and cart logic are untouched — they receive the same product shape they do today.
