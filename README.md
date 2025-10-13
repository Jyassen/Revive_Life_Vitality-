# Revive Life Vitality

Organic wellness shots for optimal vitality and wellbeing.

This is a [Next.js](https://nextjs.org) e-commerce application with **PCI-compliant** payment processing powered by Clover.

## 🔒 Security & PCI Compliance

This application implements **industry-standard security** for payment processing:

- ✅ **PCI DSS Compliant** - Card data never touches our servers
- ✅ **Client-side tokenization** - Clover hosted fields handle all sensitive data
- ✅ **Security middleware** - Automatic blocking of card data patterns
- ✅ **Rate limiting** - Protection against abuse
- ✅ **Security headers** - CSP, HSTS, and more

**Important**: Card data is tokenized directly by Clover in the browser. Only secure tokens reach our server.

📖 Read the full [Security Documentation](./SECURITY.md)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Clover merchant account (sandbox for testing)

### Setup

1. **Clone and install**
```bash
git clone <repository-url>
cd revive_life_vitality
npm install
```

2. **Configure environment variables**

Create `.env.local` in the project root:

```bash
# Clover Configuration (Required)
NEXT_PUBLIC_CLOVER_PUBLISHABLE_KEY=your_publishable_key
NEXT_PUBLIC_CLOVER_MERCHANT_ID=your_merchant_id
NEXT_PUBLIC_CLOVER_ENVIRONMENT=sandbox

CLOVER_API_KEY=your_private_api_key
CLOVER_ENVIRONMENT=sandbox
```

📖 See detailed setup instructions in [SETUP.md](./SETUP.md)

3. **Run development server**
```bash
npm run dev
```

4. **Open your browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
revive_life_vitality/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   │   └── payment/  # Payment endpoints
│   │   ├── checkout/     # Checkout flow
│   │   └── page.tsx      # Homepage
│   ├── components/       # React components
│   │   ├── payment/      # Payment-related components
│   │   ├── sections/     # Page sections
│   │   └── ui/           # UI components
│   ├── lib/              # Utilities and configurations
│   │   ├── clover-secure.ts  # PCI-compliant Clover integration
│   │   └── validations/  # Zod schemas
│   ├── types/            # TypeScript types
│   └── middleware.ts     # Security middleware
├── public/               # Static assets
├── SECURITY.md           # Security documentation
├── SETUP.md              # Setup guide
└── README.md             # This file
```

## 🔐 Payment Security

### How It Works

```
User enters card → Clover hosted fields (iframe) → Clover servers
                                                        ↓
                                                   Secure token
                                                        ↓
                                              Your server receives token
                                                        ↓
                                                 Charge is created
```

**Key Points**:
- Card data flows directly to Clover (never your server)
- Only secure, non-reversible tokens are transmitted to your backend
- Hosted fields are PCI-compliant iframes from Clover
- Automatic security scanning on all API requests

### Security Features

1. **Client-Side Tokenization** (`src/lib/clover-secure.ts`)
   - Secure card data handling
   - Direct Clover SDK integration
   - No sensitive data in your code

2. **Security Middleware** (`src/middleware.ts`)
   - Blocks requests with card data patterns
   - Rate limiting (10 req/min per IP)
   - Security headers on all responses

3. **Payment Form** (`src/components/payment/PaymentForm.tsx`)
   - Only uses Clover hosted fields
   - No manual card entry
   - Validates all fields client-side

## 🧪 Testing

### Test Cards (Sandbox Only)

| Card | Number | Result |
|------|--------|--------|
| Visa | 4005 5192 0000 0004 | Success |
| Visa | 4000 0000 0000 0002 | Declined |
| Mastercard | 5496 9810 0000 0000 | Success |

Use any future expiry date, any CVV, any postal code.

### Running Tests

```bash
# Run development with sandbox credentials
npm run dev

# Test payment flow
# 1. Add items to cart
# 2. Proceed to checkout
# 3. Fill in customer info
# 4. Use test card in payment form
# 5. Verify successful charge
```

## 🌐 Deployment

### Environment Variables

Set these in your hosting platform:

**Required**:
- `NEXT_PUBLIC_CLOVER_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLOVER_MERCHANT_ID`
- `NEXT_PUBLIC_CLOVER_ENVIRONMENT`
- `CLOVER_API_KEY`
- `CLOVER_ENVIRONMENT`

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard under **Settings** → **Environment Variables**.

### Production Checklist

- [ ] Switch to production Clover credentials
- [ ] Enable HTTPS (required for production)
- [ ] Set `NEXT_PUBLIC_CLOVER_ENVIRONMENT=production`
- [ ] Test with real cards in production mode
- [ ] Monitor payment logs
- [ ] Set up error alerting
- [ ] Review security headers
- [ ] Perform security audit

## 📚 Documentation

- [Security Documentation](./SECURITY.md) - Complete security guide
- [Setup Guide](./SETUP.md) - Detailed environment setup
- [Clover Docs](https://docs.clover.com/) - Official Clover documentation
- [Next.js Docs](https://nextjs.org/docs) - Next.js documentation

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Payments**: Clover (PCI-compliant)
- **Validation**: Zod
- **Deployment**: Vercel-ready

## 🛡️ Security Contact

For security issues, please see [SECURITY.md](./SECURITY.md) for responsible disclosure guidelines.

## 📝 License

[Your License Here]

---

**⚠️ Important**: Never commit `.env.local` or API keys to version control!
