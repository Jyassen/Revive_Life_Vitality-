# Stripe Migration Guide

## 🎯 Overview

This guide walks you through completing the migration from Clover to Stripe payment processing.

## ✅ What's Been Implemented

### 1. **Core Infrastructure**
- ✅ Stripe SDK installed (`@stripe/stripe-js`, `stripe`)
- ✅ Server-side Stripe utilities (`src/lib/stripe.ts`)
- ✅ Client-side Stripe utilities (`src/lib/stripe-client.ts`)
- ✅ Type definitions updated for Stripe

### 2. **Components**
- ✅ New `StripePaymentForm` component with Stripe Elements
- ✅ Full PCI compliance (card data never touches your server)
- ✅ Beautiful UI matching your brand
- ✅ Support for cards, Apple Pay, Google Pay

### 3. **API Routes**
- ✅ `/api/stripe/create-payment-intent` - Initialize payments
- ✅ `/api/stripe/confirm-payment` - Confirm and complete payments
- ✅ `/api/stripe/webhook` - Handle Stripe webhooks

### 4. **Checkout Flow**
- ✅ New checkout page with embedded Stripe payment (`src/app/checkout/page-stripe.tsx`)
- ✅ Two-step flow: Information → Payment
- ✅ Progress indicator
- ✅ Full validation

## 🚀 Steps to Complete Migration

### Step 1: Get Your Stripe API Keys

1. **Sign up/Login to Stripe**: https://dashboard.stripe.com/register
2. **Get your API keys**:
   - Go to: https://dashboard.stripe.com/test/apikeys
   - Copy your **Publishable key** (starts with `pk_test_`)
   - Copy your **Secret key** (starts with `sk_test_`)

### Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Stripe Keys (TEST MODE)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Webhook Secret (we'll add this in Step 4)
# STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Disable payment links to use embedded checkout
NEXT_PUBLIC_USE_PAYMENT_LINKS=false
```

### Step 3: Replace Checkout Page

```bash
# Backup old checkout page
mv src/app/checkout/page.tsx src/app/checkout/page-clover-backup.tsx

# Activate new Stripe checkout page
mv src/app/checkout/page-stripe.tsx src/app/checkout/page.tsx
```

### Step 4: Set Up Stripe Webhooks

Webhooks allow Stripe to notify your server about payment events.

#### For Development (using Stripe CLI):

1. **Install Stripe CLI**: https://stripe.com/docs/stripe-cli
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server**:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   
   This will output a webhook secret like `whsec_...`. Add it to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

#### For Production:

1. **Go to Stripe Webhooks**: https://dashboard.stripe.com/webhooks
2. **Click "Add endpoint"**
3. **Enter your URL**: `https://yourdomain.com/api/stripe/webhook`
4. **Select events to listen for**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `charge.refunded`
   - `charge.dispute.created`
5. **Copy the signing secret** and add to your production environment variables

### Step 5: Test the Integration

#### Test Cards for Development:

| Card Number | Brand | Test Scenario |
|-------------|-------|---------------|
| `4242 4242 4242 4242` | Visa | Success |
| `4000 0025 0000 3155` | Visa | 3D Secure required |
| `4000 0000 0000 9995` | Visa | Declined |
| `5555 5555 5555 4444` | Mastercard | Success |
| `3782 822463 10005` | Amex | Success |

- Use any future expiration date
- Use any 3-digit CVV (4 digits for Amex)
- Use any postal code

#### Testing Checklist:

- [ ] Customer can enter shipping information
- [ ] Payment form loads correctly
- [ ] Can enter test card and complete payment
- [ ] Success page shows after payment
- [ ] Cart is cleared after successful payment
- [ ] Webhook events are received (check server logs)
- [ ] Order appears in Stripe Dashboard

### Step 6: Update Email Notifications

You have `resend` installed. Update your email sending logic to trigger on successful payments.

**Recommended approach:** Use the webhook handler to send emails.

Edit `src/app/api/stripe/webhook/route.ts`:

```typescript
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Your existing audit log code...
  
  // Send confirmation email
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  await resend.emails.send({
    from: 'orders@yourdomain.com',
    to: paymentIntent.receipt_email || '',
    subject: 'Order Confirmation',
    html: `<p>Your order has been confirmed!</p>`
  })
}
```

### Step 7: Deploy to Production

1. **Switch to Live Mode** in Stripe Dashboard
2. **Get Live API keys**: https://dashboard.stripe.com/apikeys
3. **Update production environment variables**:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```
4. **Set up production webhook** (see Step 4)
5. **Deploy your application**

### Step 8: Clean Up Old Clover Code

Once everything is working with Stripe:

```bash
# Remove old Clover files
rm src/lib/clover.ts
rm src/lib/clover-secure.ts
rm src/components/payment/PaymentForm.tsx
rm src/app/api/payment/charge/route.ts
rm src/app/api/payment/hosted-checkout/route.ts
rm src/app/checkout/page-clover-backup.tsx

# Remove old Clover environment variables from .env.local
# CLOVER_API_KEY
# CLOVER_ENVIRONMENT
# NEXT_PUBLIC_CLOVER_PAKMS_KEY
```

## 🔒 Security Best Practices

✅ **Already Implemented:**
- Card data never touches your server (handled by Stripe Elements)
- All sensitive data encrypted in transit
- PCI DSS compliance maintained through Stripe
- Webhook signature verification
- Server-side payment verification
- Audit logging for all payment events

## 📊 Monitoring & Analytics

### Stripe Dashboard
View real-time payment data: https://dashboard.stripe.com/

**Key sections:**
- **Payments**: View all transactions
- **Customers**: Manage customer data
- **Disputes**: Handle chargebacks
- **Logs**: Debug integration issues
- **Webhooks**: Monitor webhook delivery

### Recommended Integrations

1. **Stripe Radar** (Fraud Protection): Already included
2. **Stripe Billing** (Subscriptions): Available if needed
3. **Stripe Tax** (Automated Tax): Available if needed

## 🆘 Troubleshooting

### Payment Intent Creation Fails
- **Check**: API keys are correct in `.env.local`
- **Check**: Secret key starts with `sk_test_` or `sk_live_`
- **Check**: Server logs for detailed error messages

### Payment Element Not Loading
- **Check**: Publishable key is correct
- **Check**: Publishable key starts with `pk_test_` or `pk_live_`
- **Check**: Client secret is being passed to component
- **Check**: Browser console for errors

### Webhook Events Not Received
- **Development**: Make sure Stripe CLI is running
- **Production**: Verify webhook endpoint is accessible
- **Check**: Webhook secret matches environment variable
- **Check**: Webhook logs in Stripe Dashboard

### 3D Secure Not Working
- **Check**: Using test card that requires 3D Secure
- **Check**: Stripe Elements is properly configured
- **Note**: Stripe automatically handles 3D Secure authentication

## 💰 Pricing

### Stripe Fees (as of 2024)
- **Online payments**: 2.9% + $0.30 per successful charge
- **No setup fees, monthly fees, or hidden costs**
- **Instant payouts available** (additional 1%)
- **Volume discounts available**

Compare to Clover's pricing to see your savings!

## 📚 Additional Resources

- **Stripe Docs**: https://stripe.com/docs
- **Payment Intents API**: https://stripe.com/docs/payments/payment-intents
- **Stripe Elements**: https://stripe.com/docs/payments/elements
- **Testing**: https://stripe.com/docs/testing
- **Webhooks**: https://stripe.com/docs/webhooks
- **Support**: https://support.stripe.com

## ✅ Go-Live Checklist

Before going live with Stripe:

- [ ] Test all payment scenarios (success, decline, 3D Secure)
- [ ] Verify webhooks are working
- [ ] Set up production webhook endpoint
- [ ] Switch to live API keys
- [ ] Test a live payment (you can refund it)
- [ ] Verify email notifications work
- [ ] Update terms of service with Stripe payment mention
- [ ] Remove old Clover code
- [ ] Document internal processes for refunds/disputes

## 🎉 You're Ready!

Your Stripe integration is complete and ready for testing. The implementation follows industry best practices and provides a superior payment experience compared to Clover.

**Need help?** Check the Stripe Dashboard logs or reach out to Stripe support - they're excellent!


