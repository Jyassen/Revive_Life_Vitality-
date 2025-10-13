# PCI-Compliant Setup Guide

## Environment Variables Configuration

This guide will help you set up secure, PCI-compliant payment processing with Clover.

### Required Environment Variables

Create a `.env.local` file in your project root with these variables:

```bash
# ==========================================
# CLOVER PAYMENT CONFIGURATION (PCI Compliant)
# ==========================================

# PUBLIC CLIENT-SIDE KEYS
# These are safe to expose in the browser
NEXT_PUBLIC_CLOVER_PUBLISHABLE_KEY=your_publishable_key_here
NEXT_PUBLIC_CLOVER_MERCHANT_ID=your_merchant_id_here
NEXT_PUBLIC_CLOVER_ENVIRONMENT=sandbox

# PRIVATE SERVER-SIDE KEYS
# NEVER expose these in client-side code!
CLOVER_API_KEY=your_private_api_key_here
CLOVER_ENVIRONMENT=sandbox

# ==========================================
# OPTIONAL: EMAIL CONFIGURATION
# ==========================================
RESEND_API_KEY=your_resend_api_key_here

# ==========================================
# APPLICATION CONFIGURATION
# ==========================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### How to Get Clover Credentials

#### Sandbox (Testing)

1. Go to [Clover Sandbox](https://sandbox.dev.clover.com/developer-home)
2. Create a test merchant account
3. Navigate to **Developer Home** → **Your Apps**
4. Create a new app or select existing app
5. Go to **API Tokens** section
6. Generate or copy your tokens:
   - **Publishable Key** → Use for `NEXT_PUBLIC_CLOVER_PUBLISHABLE_KEY`
   - **API Token** → Use for `CLOVER_API_KEY`
   - **Merchant ID** → Use for `NEXT_PUBLIC_CLOVER_MERCHANT_ID`

#### Production (Live Transactions)

1. Sign up for a [Clover merchant account](https://www.clover.com/)
2. Complete merchant verification
3. Install your app in the Clover App Market
4. Get production credentials from merchant dashboard
5. Update environment variables:
   ```bash
   NEXT_PUBLIC_CLOVER_ENVIRONMENT=production
   CLOVER_ENVIRONMENT=production
   ```

### Security Best Practices

#### ✅ DO:
- Use sandbox keys for development
- Use production keys only on HTTPS-enabled sites
- Rotate API keys regularly (every 90 days)
- Store keys in environment variables, never in code
- Use different keys for staging and production
- Restrict API key permissions to minimum needed

#### ❌ DON'T:
- Commit `.env.local` to version control
- Share API keys in chat/email
- Use production keys in development
- Expose private keys in client-side code
- Store keys in frontend code or config files

### Environment-Specific Configuration

#### Development
```bash
# .env.local (development)
NEXT_PUBLIC_CLOVER_ENVIRONMENT=sandbox
CLOVER_ENVIRONMENT=sandbox
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Staging
```bash
# Vercel/Netlify environment variables
NEXT_PUBLIC_CLOVER_ENVIRONMENT=sandbox
CLOVER_ENVIRONMENT=sandbox
NEXT_PUBLIC_SITE_URL=https://staging.yourdomain.com
```

#### Production
```bash
# Vercel/Netlify environment variables
NEXT_PUBLIC_CLOVER_ENVIRONMENT=production
CLOVER_ENVIRONMENT=production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Testing

#### Test Card Numbers (Sandbox Only)

Use these test cards in sandbox environment:

| Card Type | Number | Result |
|-----------|--------|--------|
| Visa | 4005 5192 0000 0004 | Success |
| Visa | 4000 0000 0000 0002 | Declined |
| Mastercard | 5496 9810 0000 0000 | Success |
| Amex | 3782 822463 10005 | Success |

**For all test cards:**
- Use any future expiration date (e.g., 12/25)
- Use any 3-digit CVV (e.g., 123)
- Use any postal code (e.g., 12345)

### Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add each variable:
   - Name: `NEXT_PUBLIC_CLOVER_PUBLISHABLE_KEY`
   - Value: Your publishable key
   - Environment: Production (or select environments)
4. Repeat for all required variables
5. Redeploy your application

### Netlify Deployment

1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Click **Edit variables**
3. Add each variable and value
4. Click **Save**
5. Redeploy your site

### Verification

After setup, verify everything works:

```bash
# 1. Start development server
npm run dev

# 2. Visit checkout page
# 3. Check browser console for errors
# 4. Test payment with test card
# 5. Verify token is created successfully
```

#### Checklist
- [ ] Environment variables set correctly
- [ ] Clover SDK loads without errors
- [ ] Hosted fields appear on payment form
- [ ] Test payment completes successfully
- [ ] No card data in network requests
- [ ] Security middleware is active

### Troubleshooting

#### "Clover SDK not loaded"
- Check `NEXT_PUBLIC_CLOVER_PUBLISHABLE_KEY` is set
- Verify key is correct for environment (sandbox/production)
- Check browser console for script loading errors

#### "Missing Clover configuration"
- Ensure all `NEXT_PUBLIC_*` variables are set
- Restart development server after adding variables
- Check for typos in variable names

#### "Payment declined"
- Use correct test card numbers for sandbox
- Verify you're using sandbox credentials
- Check Clover dashboard for error details

#### "Token creation failed"
- Ensure all hosted fields are filled
- Check for validation errors in console
- Verify merchant ID matches API key

### Next Steps

1. **Review Security**: Read [SECURITY.md](./SECURITY.md)
2. **Test Thoroughly**: Use all test cards
3. **Monitor Logs**: Check for security alerts
4. **Go Live**: Switch to production credentials
5. **Enable HTTPS**: Required for production
6. **Regular Audits**: Schedule security reviews

### Support

- **Clover Documentation**: https://docs.clover.com/
- **Clover Support**: https://www.clover.com/support
- **Security Issues**: See [SECURITY.md](./SECURITY.md)

---

**⚠️ Important**: Never commit real API keys to version control. Add `.env.local` to your `.gitignore` file.

**✅ PCI Compliance**: This setup ensures card data never touches your server, maintaining PCI compliance.

