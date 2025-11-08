# Stripe Integration Fixes - Systematic Plan

**Date**: November 8, 2025  
**Status**: 🔴 CRITICAL - Subscriptions are currently broken in production

---

## Executive Summary

Two critical issues identified:
1. **BLOCKING**: Subscription checkout failing with 400 error
2. **Missing Feature**: Tax not calculated or displayed

---

## Issue 1: Subscription Creation Failure (CRITICAL)

### Problem
**Error**: `Received unknown parameter: items[1][price_data][product_data]`

**Root Cause**: Stripe's Subscription API does not support inline product creation using `product_data`. You can only reference existing products by their Price ID.

**Current Code** (lines 76-90 in `create-subscription/route.ts`):
```typescript
{
  price_data: {
    currency: 'usd',
    product_data: {  // ❌ NOT ALLOWED in subscriptions
      name: 'Shipping & Handling',
      description: 'Weekly shipping fee',
    },
    unit_amount: 1000,
    recurring: { interval: 'week' }
  }
}
```

### Solution Options

#### Option A: Create Shipping Product in Stripe (RECOMMENDED)
**Pros**:
- Clean separation of product vs shipping
- Transparent in Stripe Dashboard
- Can be reused across subscriptions
- Customer sees itemized breakdown

**Cons**:
- Requires Stripe Dashboard setup
- Need to manage another Price ID

**Steps**:
1. Create "Shipping & Handling" product in Stripe Dashboard
2. Create $10/week recurring price
3. Copy Price ID
4. Add to environment variables
5. Update code to use Price ID

#### Option B: Create Single Combined Price
**Pros**:
- Simplest implementation
- No additional products needed
- One Price ID to manage

**Cons**:
- Less transparent ($48/week with no itemization)
- Can't adjust shipping independently
- Doesn't match one-time purchase pattern

**Steps**:
1. Update existing Revive Club price to $48/week in Stripe
2. Remove shipping line item from code
3. Update UI to show shipping is included

#### Option C: Remove Recurring Shipping (TEMPORARY WORKAROUND)
**Pros**:
- Immediate fix
- No Stripe Dashboard changes

**Cons**:
- ❌ Customers don't pay shipping ($38/week only)
- ❌ Revenue loss
- ❌ Inconsistent with one-time purchases
- Not a permanent solution

**Steps**:
1. Remove shipping line item from code
2. Update UI to show "Free shipping on subscriptions"
3. Plan to add back shipping later

---

## Issue 2: Tax Calculation & Display

### Problem
Tax shows as $0.00 in checkout. Need to determine tax strategy.

### Solution Options

#### Option A: Stripe Tax (RECOMMENDED for US businesses)
**Pros**:
- Automatic calculation based on customer location
- Handles all US states + international
- Updates automatically when tax laws change
- Stripe manages compliance
- Shows correct rates in checkout

**Cons**:
- Additional cost (~$0.50 per transaction)
- Requires Stripe Tax activation
- Need to configure tax settings

**Cost**: $0.50 per transaction + actual tax collected

**Steps**:
1. Enable Stripe Tax in Dashboard
2. Configure business address
3. Set product tax codes
4. Add `automatic_tax: { enabled: true }` to payment intents
5. Update UI to show calculated tax

#### Option B: Manual Tax Calculation
**Pros**:
- No additional Stripe fees
- Full control over rates
- Can implement custom rules

**Cons**:
- Need to maintain tax rate database
- Must update when laws change
- More complex code
- Potential compliance issues
- Need to handle nexus rules

**Steps**:
1. Create tax rate database (by state/zip)
2. Implement calculation logic
3. Update checkout summary
4. Handle edge cases (APO, territories, etc.)

#### Option C: No Tax (Keep Current)
**Pros**:
- Simplest approach
- No additional cost
- No complexity

**Cons**:
- ⚠️ May be legally required depending on:
  - Your business location
  - Sales volume
  - States you sell to
  - Economic nexus thresholds
- Customer confusion (price vs final amount)
- Potential audit issues

**Recommendation**: Check with accountant/tax advisor

---

## Recommended Implementation Plan

### Phase 1: Emergency Fix (15 minutes)
**Goal**: Get subscriptions working immediately

**Action**: Option C - Remove shipping temporarily
1. Comment out shipping line item in code
2. Deploy to production
3. Test subscription flow
4. Customer pays $38/week (no shipping)

**Files to modify**:
- `src/app/api/stripe/create-subscription/route.ts` (lines 76-90)

### Phase 2: Proper Shipping Fix (30 minutes)
**Goal**: Add shipping back correctly

**Action**: Option A - Create shipping product

**Steps**:
1. **Stripe Dashboard** (10 min)
   - Navigate to Products
   - Click "Add product"
   - Name: "Subscription Shipping & Handling"
   - Description: "Weekly shipping fee for subscription orders"
   - Pricing: Recurring
   - Amount: $10.00
   - Interval: Weekly
   - Copy Price ID (e.g., `price_ABC123...`)

2. **Environment Variables** (2 min)
   - Add to Vercel: `NEXT_PUBLIC_SUBSCRIPTION_SHIPPING_PRICE_ID`
   - Add to `.env.local`: same

3. **Code Update** (5 min)
   - Replace inline `price_data` with Price ID reference
   - Test locally
   - Deploy

4. **Testing** (10 min)
   - Test subscription checkout
   - Verify Stripe Dashboard shows 2 line items
   - Verify customer charged $48/week
   - Verify email receipt shows breakdown

**Files to modify**:
- `src/app/api/stripe/create-subscription/route.ts`
- Environment variables (Vercel + local)

### Phase 3: Tax Implementation (1-2 hours)
**Goal**: Add tax calculation

**Action**: Option A - Stripe Tax (recommended)

**Steps**:
1. **Stripe Dashboard Setup** (30 min)
   - Settings → Tax
   - Click "Enable Stripe Tax"
   - Add business address
   - Configure tax settings
   - Set product tax codes (General - Tangible Goods)

2. **Code Updates** (20 min)
   - Add `automatic_tax: { enabled: true }` to:
     - Payment intents (`create-payment-intent/route.ts`)
     - Subscriptions (`create-subscription/route.ts`)
   - Update checkout UI to display tax line
   - Test tax calculation

3. **Testing** (20 min)
   - Test with various US states
   - Verify tax shows in checkout
   - Verify tax shows in Stripe Dashboard
   - Verify correct rates applied

**Files to modify**:
- `src/app/api/stripe/create-payment-intent/route.ts`
- `src/app/api/stripe/create-subscription/route.ts`
- `src/app/checkout/page.tsx` (display tax in UI)

---

## Detailed Code Changes

### Phase 1: Emergency Fix

**File**: `src/app/api/stripe/create-subscription/route.ts`

**Change** (line 74):
```typescript
// BEFORE:
items: [
  { price: priceId },
  {
    // @ts-expect-error - Stripe API supports product_data but TypeScript definitions are incomplete
    product_data: { ... }
  }
],

// AFTER:
items: [
  { price: priceId }
],
```

### Phase 2: Proper Shipping Fix

**File**: `src/app/api/stripe/create-subscription/route.ts`

**Change** (line 74):
```typescript
// Get shipping price ID from environment
const shippingPriceId = process.env.NEXT_PUBLIC_SUBSCRIPTION_SHIPPING_PRICE_ID

const subscription = await stripe.subscriptions.create({
  customer: stripeCustomer.id,
  items: [
    { price: priceId },
    { price: shippingPriceId }, // ✅ Use existing price ID
  ],
  // ... rest of config
})
```

### Phase 3: Tax Implementation

**File**: `src/app/api/stripe/create-payment-intent/route.ts`

**Add** (after line 71):
```typescript
const paymentIntent = await stripe.createPaymentIntent({
  amount: formatAmountForStripe(summary.total),
  currency: 'usd',
  customerEmail: customer.email,
  customerName: `${customer.firstName} ${customer.lastName}`,
  description: `Order for ${items.length} item(s)`,
  automatic_tax: { enabled: true }, // ← ADD THIS
  metadata,
})
```

**File**: `src/app/api/stripe/create-subscription/route.ts`

**Add** (after line 91):
```typescript
const subscription = await stripe.subscriptions.create({
  customer: stripeCustomer.id,
  items: [{ price: priceId }, { price: shippingPriceId }],
  automatic_tax: { enabled: true }, // ← ADD THIS
  payment_behavior: 'default_incomplete',
  // ... rest
})
```

---

## Testing Checklist

### After Phase 1 (Emergency Fix):
- [ ] Subscription checkout completes without errors
- [ ] Customer charged $38/week (no shipping)
- [ ] Subscription appears in Stripe Dashboard
- [ ] Customer receives email receipt

### After Phase 2 (Shipping Fix):
- [ ] Subscription checkout completes
- [ ] Customer charged $48/week total
- [ ] Stripe Dashboard shows 2 line items:
  - [ ] Revive Club: $38.00/week
  - [ ] Shipping & Handling: $10.00/week
- [ ] Email receipt shows both items
- [ ] Recurring charges include both items

### After Phase 3 (Tax):
- [ ] Tax calculated correctly for various states
- [ ] Tax line appears in checkout UI
- [ ] Total includes tax
- [ ] Stripe Dashboard shows tax collected
- [ ] Email receipt shows tax amount

---

## Environment Variables Needed

Add to Vercel and `.env.local`:

```bash
# Phase 2: Shipping Price ID
NEXT_PUBLIC_SUBSCRIPTION_SHIPPING_PRICE_ID=price_YOUR_SHIPPING_PRICE_ID_HERE

# Already configured:
NEXT_PUBLIC_REVIVE_CLUB_PRICE_ID=price_1SR9mKDtjUNrsKAbYk6yyHtY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

---

## Rollback Plan

If any phase fails:

**Phase 1 rollback**:
- Revert code changes
- Redeploy previous version
- Subscriptions will still be broken but no worse

**Phase 2 rollback**:
- Remove shipping price ID from environment
- Keep Phase 1 changes (no shipping)
- Customers pay $38/week

**Phase 3 rollback**:
- Remove `automatic_tax` from code
- Redeploy
- Tax shows as $0 again

---

## Timeline Estimate

| Phase | Time | Can Deploy Independently |
|-------|------|-------------------------|
| Phase 1: Emergency | 15 min | ✅ Yes - Deploy ASAP |
| Phase 2: Shipping | 30 min | ✅ Yes - Deploy after testing |
| Phase 3: Tax | 1-2 hrs | ✅ Yes - Can wait |

**Recommended**: Deploy Phase 1 immediately, then work on Phase 2.

---

## Success Metrics

**Phase 1**:
- ✅ Subscription conversion rate > 0%
- ✅ Zero 400 errors on `/api/stripe/create-subscription`

**Phase 2**:
- ✅ Revenue per subscription = $48/week
- ✅ Shipping costs covered

**Phase 3**:
- ✅ Tax compliance
- ✅ Accurate tax collection per state
- ✅ Clear pricing transparency

---

## Questions to Answer

Before proceeding:

1. **Immediate Action**: Deploy Phase 1 emergency fix now? (Yes/No)
2. **Shipping Strategy**: Which option for Phase 2? (A: Product ID / B: Combined Price)
3. **Tax Strategy**: Which option for Phase 3? (A: Stripe Tax / B: Manual / C: None)
4. **Do you have Stripe live mode access** to create products?

---

## Next Steps

Please confirm:
1. Should I deploy Phase 1 emergency fix immediately?
2. Can you create the Shipping product in Stripe Dashboard, or should I walk you through it?
3. What's your tax situation - do you need to collect sales tax?

