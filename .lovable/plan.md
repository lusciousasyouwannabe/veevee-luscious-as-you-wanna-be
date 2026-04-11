

## Plan: Add $10 Flat Rate Shipping to Checkout

### What changes

**1. Update `src/pages/Cart.tsx`**
- Add a `SHIPPING_RATE = 10.00` constant
- Show a "Shipping" line item in the order summary below the subtotal
- Update the displayed total to include shipping
- Pass the shipping fee to the Edge Function

**2. Update `supabase/functions/clover-checkout/index.ts`**
- Add a "Flat Rate Shipping" line item ($10.00 / 1000 cents) to the `lineItems` array sent to Clover
- Include it in the `totalAmount` calculation
- No schema changes needed — shipping is added server-side so it can't be bypassed

### How it will look in the cart summary

```text
Subtotal        $45.00
Shipping        $10.00
─────────────────────
Total           $55.00
```

### No database changes needed

