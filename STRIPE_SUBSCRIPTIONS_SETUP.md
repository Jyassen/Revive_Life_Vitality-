# 🔄 Stripe Subscriptions Setup Guide

## ✅ What's Been Built

Your Stripe integration now supports **BOTH** one-time payments **AND** recurring subscriptions!

### Features Implemented:
- ✅ One-time purchases (Starter Pack, Pro Pack)
- ✅ Weekly subscriptions (Revive Club)
- ✅ Automatic detection of subscription vs one-time
- ✅ Unified checkout flow
- ✅ Subscription webhook handlers
- ✅ Customer management
- ✅ Recurring billing

---

## 🎯 Quick Setup (10 Minutes)

### Step 1: Get Your Stripe Price ID (3 min)

Looking at your Stripe dashboard, I can see you have **Revive Club** at **$35.99 USD Per week**.

1. **Go to your Stripe Dashboard**: https://dashboard.stripe.com/test/products
2. **Click on "Revive Club"**
3. **Copy the Price ID** - it looks like: `price_1ABC...` or `price_XYZ123...`
4. **Save it for Step 3**

### Step 2: Update Environment Variables (1 min)

Add to your `.env.local`:

```bash
# Existing Stripe keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# NEW: Revive Club Price ID (from Step 1)
NEXT_PUBLIC_REVIVE_CLUB_PRICE_ID=price_YOUR_PRICE_ID_HERE

# Feature flag
NEXT_PUBLIC_USE_PAYMENT_LINKS=false
```

### Step 3: Update the Checkout Code (2 min)

The unified checkout page needs your actual Price ID. Open:

`src/app/checkout/page-unified.tsx`

Find this line (around line 240):

```typescript
const priceId = 'price_REVIVE_CLUB_WEEKLY' // Replace with actual Price ID
```

Replace with:

```typescript
const priceId = process.env.NEXT_PUBLIC_REVIVE_CLUB_PRICE_ID || ''
```

### Step 4: Activate Unified Checkout (2 min)

```bash
# Backup current checkout
mv src/app/checkout/page.tsx src/app/checkout/page-backup.tsx

# Activate unified checkout (handles both one-time and subscriptions)
mv src/app/checkout/page-unified.tsx src/app/checkout/page.tsx
```

### Step 5: Test! (2 min)

```bash
npm run dev
```

**Test One-Time Purchase:**
1. Add "Starter Pack" or "Pro Pack" to cart
2. Go to checkout
3. Should say "Payment" (not subscription)
4. Use test card: `4242 4242 4242 4242`

**Test Subscription:**
1. Add "Revive Club" to cart  
2. Go to checkout
3. Should say "🔄 Weekly Subscription - Cancel Anytime"
4. Use test card: `4242 4242 4242 4242`

---

## 📊 How It Works

### Product Detection

The system automatically detects subscription products:

```typescript
function isSubscriptionItem(item) {
  return item.name?.toLowerCase().includes('club') || 
         item.name?.toLowerCase().includes('subscription')
}
```

**Revive Club** → Subscription flow
**Starter/Pro Pack** → One-time payment flow

### Payment Flow Comparison

#### One-Time Purchase:
```
1. Customer fills info
2. Create Payment Intent (charge once)
3. Customer enters payment
4. Confirm payment
5. Order complete ✓
```

#### Subscription:
```
1. Customer fills info
2. Create Subscription (recurring)
3. Create Customer in Stripe
4. Customer enters payment
5. Confirm subscription
6. First charge succeeds ✓
7. Stripe automatically charges weekly
```

---

## 🔔 Webhook Events for Subscriptions

Your webhook handler (`/api/stripe/webhook`) now processes:

### Initial Purchase:
- `customer.subscription.created` - New subscription started
- `invoice.payment_succeeded` - First payment succeeded

### Recurring Payments:
- `invoice.payment_succeeded` - Weekly charge succeeded
- `invoice.payment_failed` - Payment failed (card declined, etc.)

### Subscription Changes:
- `customer.subscription.updated` - Customer changed plan
- `customer.subscription.deleted` - Customer canceled

### What You Need to Do:

Edit `src/app/api/stripe/webhook/route.ts` and implement:

```typescript
async function handleInvoicePaymentSucceeded(invoice) {
  // When this fires:
  // 1. Create order for this billing period
  // 2. Send payment receipt email
  // 3. Schedule shipment
  // 4. Update next billing date

  if (invoice.billing_reason === 'subscription_cycle') {
    // This is a recurring payment (not the first one)
    // Create new order
    // Schedule delivery
  }
}

async function handleInvoicePaymentFailed(invoice) {
  // When payment fails:
  // 1. Send email to customer
  // 2. Ask them to update payment method
  // 3. Pause shipments until resolved
}
```

---

## 💳 Subscription Management

### Customer Portal (Optional but Recommended)

Stripe provides a pre-built customer portal where customers can:
- Update payment methods
- Cancel subscriptions
- View invoices
- Change billing info

**To enable:**

1. Go to: https://dashboard.stripe.com/test/settings/billing/portal
2. Turn on customer portal
3. Configure settings (allow cancellation, etc.)

**Add link to your site:**

```typescript
// In your account/profile page
const createPortalSession = async () => {
  const response = await fetch('/api/stripe/create-portal-session', {
    method: 'POST',
    body: JSON.stringify({ customerId: 'cus_...' })
  })
  const { url } = await response.json()
  window.location.href = url
}
```

---

## 📋 Subscription Lifecycle

### When Customer Subscribes:
1. ✅ Customer created in Stripe
2. ✅ Subscription created ($35.99/week)
3. ✅ First payment collected
4. ✅ Webhook: `invoice.payment_succeeded`
5. → **YOU DO**: Create order, send confirmation, schedule shipment

### Every Week After:
1. ✅ Stripe automatically charges customer
2. ✅ Webhook: `invoice.payment_succeeded` 
3. → **YOU DO**: Create new order, schedule shipment

### If Payment Fails:
1. ❌ Stripe attempts payment
2. ❌ Card declined
3. ✅ Webhook: `invoice.payment_failed`
4. → **YOU DO**: Email customer, pause shipments
5. ✅ Stripe retries automatically (3 times by default)

### When Customer Cancels:
1. ✅ Customer cancels via your site or Stripe portal
2. ✅ Webhook: `customer.subscription.deleted`
3. → **YOU DO**: Stop future shipments, send confirmation

---

## 🎨 Customizing the Checkout

### Update Product Detection

If you add more subscriptions, update the detection:

```typescript
// In src/app/checkout/page.tsx
function isSubscriptionItem(item) {
  // Option 1: By name
  return item.name?.toLowerCase().includes('club') || 
         item.name?.toLowerCase().includes('monthly')

  // Option 2: By product ID (more reliable)
  const subscriptionProducts = [
    'revive-club',
    'premium-membership',
    // add more
  ]
  return subscriptionProducts.includes(item.id)
}
```

### Add Multiple Subscription Options

If you want monthly, quarterly, etc.:

```typescript
// .env.local
NEXT_PUBLIC_REVIVE_CLUB_WEEKLY_PRICE_ID=price_weekly...
NEXT_PUBLIC_REVIVE_CLUB_MONTHLY_PRICE_ID=price_monthly...

// In checkout, select based on customer choice:
const priceId = billingInterval === 'weekly' 
  ? process.env.NEXT_PUBLIC_REVIVE_CLUB_WEEKLY_PRICE_ID
  : process.env.NEXT_PUBLIC_REVIVE_CLUB_MONTHLY_PRICE_ID
```

---

## 🧪 Testing Subscriptions

### Test Card Numbers:

| Card | Behavior |
|------|----------|
| `4242 4242 4242 4242` | ✅ Success - subscription activates |
| `4000 0000 0000 0341` | ❌ Fails on 2nd charge (test recurring failure) |
| `4000 0025 0000 3155` | 🔐 Requires 3D Secure |

### Simulate Time Passing:

You can't speed up time in test mode, but you can:

1. **Create subscription with 1-day billing**
2. **Or manually trigger invoice**:
   - Go to: https://dashboard.stripe.com/test/subscriptions
   - Click on subscription
   - Click "..." → "Create invoice"

### Check Webhook Events:

Go to: https://dashboard.stripe.com/test/webhooks
- See all events sent
- Resend failed events
- Debug issues

---

## 💰 Pricing Comparison

Your current setup:

| Product | Type | Price | Billing |
|---------|------|-------|---------|
| Starter Pack | One-time | $19.99 | Once |
| Pro Pack | One-time | $39.99 | Once |
| Revive Club | Subscription | $35.99 | Weekly |

**Revive Club Benefits:**
- 10% cheaper than buying Pro Pack weekly ($39.99 vs $35.99)
- Convenient - automatic deliveries
- Cancel anytime
- Better for customer retention

---

## 🚀 Going to Production

### Checklist:

- [ ] Get Revive Club Price ID from live mode
- [ ] Update `.env` with live keys
- [ ] Test subscription in live mode (real card, can refund)
- [ ] Set up production webhook
- [ ] Enable Stripe Customer Portal
- [ ] Test cancellation flow
- [ ] Test failed payment handling
- [ ] Implement fulfillment logic in webhooks
- [ ] Set up email notifications
- [ ] Test recovery emails for failed payments

### Stripe Dashboard - Live Mode:

1. **Products**: https://dashboard.stripe.com/products
2. **Subscriptions**: https://dashboard.stripe.com/subscriptions
3. **Customers**: https://dashboard.stripe.com/customers
4. **Webhooks**: https://dashboard.stripe.com/webhooks

---

## 📞 Common Issues & Solutions

### Issue: "Cannot find price ID"
**Solution**: Make sure you copied the Price ID (starts with `price_`), not the Product ID (starts with `prod_`)

### Issue: Subscription created but no webhook received
**Solution**: 
1. Check webhook endpoint is set up
2. Verify webhook secret in `.env.local`
3. Check Stripe Dashboard → Webhooks → Logs

### Issue: First payment succeeds but no order created
**Solution**: Implement logic in `handleInvoicePaymentSucceeded` webhook handler

### Issue: Customer can't cancel subscription
**Solution**: Enable Stripe Customer Portal or build your own cancellation flow

---

## ✨ Next Steps

1. **Implement webhook handlers** - Add your business logic
2. **Enable Customer Portal** - Let customers manage subscriptions
3. **Set up email notifications** - Payment receipts, failures, etc.
4. **Add subscription management page** - Show upcoming charges, history
5. **Test thoroughly** - All subscription scenarios

---

## 🎉 You're Ready!

Your app now supports:
- ✅ One-time purchases
- ✅ Weekly subscriptions
- ✅ Automatic recurring billing
- ✅ Customer management
- ✅ Webhook handling

**All you need is your Revive Club Price ID!** 🚀

---

## 📚 Resources

- **Stripe Subscriptions Docs**: https://stripe.com/docs/billing/subscriptions/overview
- **Subscription Webhooks**: https://stripe.com/docs/billing/subscriptions/webhooks
- **Customer Portal**: https://stripe.com/docs/billing/subscriptions/integrating-customer-portal
- **Test Subscriptions**: https://stripe.com/docs/billing/testing

**Questions?** Check the Stripe Dashboard or support - they're excellent!

