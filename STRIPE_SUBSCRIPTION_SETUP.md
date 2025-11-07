# Stripe Subscription Setup Instructions

## Problem
The checkout shows "Failed to create subscription" because the Stripe Price ID is not configured.

## Solution

### Step 1: Create Product & Price in Stripe Dashboard

1. Go to [Stripe Dashboard - Products](https://dashboard.stripe.com/products)
2. Click **"+ Add product"**
3. Fill in the details:
   - **Name**: `Revive Club`
   - **Description**: `Weekly wellness shot subscription`
   - **Pricing model**: Select **"Recurring"**
   - **Price**: `$35.99`
   - **Billing period**: **"Weekly"**
   - **Currency**: **"USD"**
4. Click **"Save product"**
5. **Copy the Price ID** from the product page (it looks like: `price_1AbCdE2FgHiJkLmN`)

### Step 2: Add to Environment Variables

#### For Local Development:
Add to your `.env.local` file:
```bash
NEXT_PUBLIC_STRIPE_REVIVE_CLUB_PRICE_ID=price_YOUR_ACTUAL_PRICE_ID_HERE
```

#### For Vercel Production:
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add new variable:
   - **Name**: `NEXT_PUBLIC_STRIPE_REVIVE_CLUB_PRICE_ID`
   - **Value**: `price_YOUR_ACTUAL_PRICE_ID_HERE`
   - **Environment**: Select **Production**, **Preview**, and **Development**
4. Click **"Save"**
5. **Redeploy** your application for changes to take effect

### Step 3: Test the Subscription

1. Restart your development server (if running locally)
2. Go to the checkout page
3. Try to create a subscription
4. It should now work!

### Test Card Numbers (Development Mode)

Use these test cards in Stripe Test Mode:
- **Success**: `4242 4242 4242 4242`
- **3D Secure**: `4000 0025 0000 3155`
- **Decline**: `4000 0000 0000 0002`

Use any future expiry date, any 3-digit CVC, and any postal code.

---

## Current Status

✅ Marketing consent checkbox is working correctly
❌ Subscription Price ID needs to be configured
✅ Better error message added to help identify the issue

## Additional Notes

- The Price ID must start with `price_` to be valid
- Make sure you're using the correct Stripe account (Test vs Production)
- The weekly price should match what's shown in your cart: $35.99/week

