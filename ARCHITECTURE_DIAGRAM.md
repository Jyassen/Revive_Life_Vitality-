# Security Architecture Diagram

## 🏗️ PCI-Compliant Payment Architecture

### Overview
This diagram shows how payment data flows through the system, demonstrating that card data NEVER touches your server.

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Your Payment Page (React)                    │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │         Clover Hosted Fields (iframes)             │  │  │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────┐ ┌──────────┐  │  │  │
│  │  │  │Card Number│ │ Expiry   │ │ CVV  │ │ Postal   │  │  │  │
│  │  │  │  Field    │ │  Field   │ │Field │ │  Code    │  │  │  │
│  │  │  └──────────┘ └──────────┘ └──────┘ └──────────┘  │  │  │
│  │  │                                                     │  │  │
│  │  │  ⚠️  These fields are ISOLATED from your code     │  │  │
│  │  │  ✅  Served directly from clover.com domains      │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  Regular Input Field (non-sensitive):                    │  │
│  │  ┌──────────────────────────────┐                       │  │
│  │  │ Cardholder Name              │ ← Safe to collect     │  │
│  │  └──────────────────────────────┘                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  When user clicks "Pay":                                       │
│  Step 1: Clover SDK tokenizes card data                       │
│  Step 2: Token returned to your page                          │
│  Step 3: Token sent to your API                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ CARD DATA FLOW ─────────┐
                                ├─────────────────────────┼──────┐
                                ↓                         ↓      │
                      ┌─────────────────────┐            │      │
                      │   Clover Servers    │            │      │
                      │   (PCI Level 1)     │            │      │
                      │                     │            │      │
                      │  🔐 Tokenization    │            │      │
                      │     happens here    │            │      │
                      └─────────────────────┘            │      │
                                │                        │      │
                                │ Returns Token          │      │
                                │ (tok_abc123...)        │      │
                                ↓                        │      │
                      ┌─────────────────────┐            │      │
                      │   Your Browser      │            │      │
                      │   (has token)       │            │      │
                      └─────────────────────┘            │      │
                                │                        │      │
                                │ Sends token only       │      │
                                ↓                        │      │
        ┌───────────────────────────────────────────┐    │      │
        │         YOUR SERVER (Next.js API)         │    │      │
        │                                           │    │      │
        │  ┌─────────────────────────────────────┐  │    │      │
        │  │    Security Middleware              │  │    │      │
        │  │  ✅ Scans all requests              │  │    │      │
        │  │  ✅ Blocks card data patterns       │  │    │      │
        │  │  ✅ Rate limiting active            │  │    │      │
        │  └─────────────────────────────────────┘  │    │      │
        │                    ↓                      │    │      │
        │  ┌─────────────────────────────────────┐  │    │      │
        │  │    /api/payment/charge              │  │    │      │
        │  │  ✅ Receives: token only            │  │    │      │
        │  │  ❌ Never receives: card data       │  │    │      │
        │  └─────────────────────────────────────┘  │    │      │
        │                    │                      │    │      │
        │                    │ Uses token to        │    │      │
        │                    │ create charge        │    │      │
        └────────────────────┼──────────────────────┘    │      │
                             ↓                           │      │
                   ┌─────────────────────┐               │      │
                   │   Clover API        │               │      │
                   │   charges/{id}      │               │      │
                   │                     │               │      │
                   │  ✅ Validates token │               │      │
                   │  ✅ Creates charge  │               │      │
                   └─────────────────────┘               │      │
                             │                           │      │
                             │ Returns result            │      │
                             ↓                           │      │
                   ┌─────────────────────┐               │      │
                   │   Your API          │               │      │
                   │   Returns success   │               │      │
                   └─────────────────────┘               │      │
                             │                           │      │
                             ↓                           │      │
                   ┌─────────────────────┐               │      │
                   │   Browser           │               │      │
                   │   Shows success     │               │      │
                   └─────────────────────┘               │      │
                                                         │      │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┿━━━━━━┥
                                                         │      │
  CARD DATA PATH: Browser → Clover (direct) ────────────┘      │
  TOKEN PATH: Browser → Your Server → Clover API ──────────────┘

  🔴 Card data NEVER goes to your server
  🟢 Only secure tokens reach your server
```

## 📊 Data Classification

### ❌ Sensitive Data (NEVER on your server)
- Full card number (PAN)
- CVV/CVC security code
- Card expiration date (full)
- Magnetic stripe data
- PIN numbers

### ✅ Non-Sensitive Data (Safe to handle)
- Payment token (from Clover)
- Last 4 digits of card
- Card brand (Visa, Mastercard, etc.)
- Cardholder name
- Billing address
- Transaction amount
- Order details

## 🔒 Security Layers

### Layer 1: Client-Side Protection
```
┌────────────────────────────────────────┐
│  Clover Hosted Fields (iframes)        │
│  • Isolated from your code             │
│  • Served from clover.com              │
│  • Direct communication with Clover    │
│  • No JavaScript access to card data   │
└────────────────────────────────────────┘
```

### Layer 2: Network Security
```
┌────────────────────────────────────────┐
│  Browser → Clover (HTTPS)              │
│  • End-to-end encryption               │
│  • TLS 1.2+                            │
│  • Certificate validation              │
└────────────────────────────────────────┘
```

### Layer 3: Server Security
```
┌────────────────────────────────────────┐
│  Security Middleware                   │
│  • Pattern blocking                    │
│  • Rate limiting                       │
│  • Request validation                  │
│  • Security headers                    │
└────────────────────────────────────────┘
```

### Layer 4: Application Security
```
┌────────────────────────────────────────┐
│  API Design                            │
│  • Token-only endpoints                │
│  • No card data parameters             │
│  • Strict validation                   │
│  • Error message sanitization          │
└────────────────────────────────────────┘
```

## 🎯 PCI Scope

### In Scope (Your Responsibility)
- ✅ Implementing Clover hosted fields correctly
- ✅ Protecting API keys
- ✅ Secure token transmission
- ✅ Security headers
- ✅ Access controls

### Out of Scope (Clover's Responsibility)
- ✅ Card data encryption
- ✅ Tokenization process
- ✅ Card data storage
- ✅ PCI Level 1 compliance
- ✅ Fraud detection

## 📝 Evidence for Audits

### For Clover Support
Show this diagram to prove:
1. Card data never enters your environment
2. Hosted fields are properly implemented
3. Only tokens reach your server
4. Multiple security layers in place

### For PCI Auditors
This architecture qualifies for:
- **SAQ A** (simplest questionnaire)
- **Reduced compliance scope**
- **No CDE** (Cardholder Data Environment)
- **Lower audit costs**

## 🔍 Verification

### How to Verify This Architecture

1. **Browser DevTools Test**
   ```
   Open DevTools → Network tab
   Complete a payment
   Search for: "4111" or "5555" (card numbers)
   Result: Should find ZERO matches in requests to your domain
   ```

2. **Iframe Inspection**
   ```
   Inspect card number field
   Element should show: <iframe src="https://checkout.clover.com/...">
   NOT a regular input field
   ```

3. **Middleware Test**
   ```bash
   curl -X POST https://yoursite.com/api/payment/charge \
     -d '{"cardNumber": "4111111111111111"}'
   
   Result: 400 Bad Request - "sensitive-data-detected"
   ```

4. **Token Verification**
   ```
   Complete a payment
   Check your API logs
   Should see: "tok_..." tokens
   Should NOT see: full card numbers
   ```

## 🚨 Common False Positives

### Scanner Detects "Card Data"
**Reason**: Scanner sees the word "card" in code  
**Reality**: References to "card brand" or "last 4 digits" (safe)

### Scanner Detects Server Software
**Reason**: Scanning infrastructure, not your app  
**Reality**: Hosting provider's servers (Vercel, etc.)

### Scanner Finds Old CVEs
**Reason**: Detecting base OS or web server  
**Reality**: Infrastructure managed by hosting provider

## 📞 Share This With

1. **Clover Support** - To explain your architecture
2. **PCI Auditors** - To show compliance
3. **Your Team** - To understand security
4. **Stakeholders** - To demonstrate due diligence

---

**This architecture ensures PCI compliance by keeping card data completely out of your environment.**

