# Security Documentation

## PCI DSS Compliance

This application implements **PCI-compliant** payment processing using Clover's secure hosted fields. Here's how we ensure compliance:

### ✅ What We Do

1. **Client-Side Tokenization Only**
   - All card data (number, CVV, expiry) is tokenized directly by Clover's SDK
   - Card data NEVER touches our servers
   - We only receive secure tokens from Clover

2. **Secure Hosted Fields**
   - Clover's iframed fields handle all sensitive card input
   - Fields are isolated from the main application
   - Direct communication between browser and Clover's PCI-compliant servers

3. **Security Middleware**
   - Automatically blocks any requests containing card data patterns
   - Prevents accidental transmission of sensitive data
   - Logs security alerts for monitoring

4. **Rate Limiting**
   - Payment endpoints are rate-limited (10 requests/minute)
   - Prevents brute force attacks
   - Protects against DDoS

5. **Security Headers**
   - Content Security Policy (CSP)
   - Strict Transport Security (HSTS)
   - X-Frame-Options
   - X-Content-Type-Options
   - Referrer-Policy

### 🔒 Payment Flow

```
User enters card → Clover hosted fields → Clover servers → Token generated
                                                               ↓
                                          Token sent to our server → Charge created
```

**Key Point**: Raw card data flows directly from the user's browser to Clover's servers. We only handle secure tokens.

## Secure Architecture

### Client-Side (Browser)
- Loads Clover SDK from Clover's CDN
- Mounts secure hosted fields in iframes
- Tokenizes card data client-side
- Sends only tokens to our server

### Server-Side (Next.js API)
- Receives only secure tokens (never raw card data)
- Uses Clover API to create charges with tokens
- Validates all requests
- Blocks suspicious patterns
- Rate limits requests

## Security Checklist

Before going to production, ensure:

- [ ] Using production Clover credentials
- [ ] HTTPS enabled on all pages
- [ ] Environment variables properly set
- [ ] No card data in logs
- [ ] Rate limiting active
- [ ] CSP headers configured
- [ ] Error messages don't leak sensitive info
- [ ] Regular security audits scheduled
- [ ] Incident response plan in place

## Environment Variables Security

### Public Variables (NEXT_PUBLIC_*)
These are safe to expose in the browser:
- `NEXT_PUBLIC_CLOVER_PUBLISHABLE_KEY` - Client-side tokenization only
- `NEXT_PUBLIC_CLOVER_MERCHANT_ID` - Public identifier
- `NEXT_PUBLIC_CLOVER_ENVIRONMENT` - 'sandbox' or 'production'

### Private Variables (Server-only)
NEVER expose these to the client:
- `CLOVER_API_KEY` - Server-side API calls only
- `CLOVER_ENVIRONMENT` - Server configuration

## What Data We Store

### ✅ Safe to Store
- Customer name, email, phone
- Shipping/billing addresses
- Order details and history
- Payment tokens (encrypted, non-reversible)
- Last 4 digits of card (for display)
- Card brand (Visa, Mastercard, etc.)

### ❌ NEVER Store
- Full card numbers
- CVV/CVC codes
- Card expiration dates (full)
- Any raw card data

## Security Middleware

The application includes automatic security middleware that:

1. **Scans all API requests** for card data patterns
2. **Blocks requests** containing sensitive data
3. **Logs security alerts** for monitoring
4. **Rate limits** payment endpoints
5. **Adds security headers** to all responses

### Card Data Patterns Blocked

- Credit card numbers (13-19 digits)
- CVV/CVC codes
- Card expiry data in request bodies
- Any field names suggesting card data

### Example Blocked Patterns

```json
// ❌ These will be blocked:
{
  "cardNumber": "4111111111111111",
  "cvv": "123"
}

// ✅ This is allowed:
{
  "token": "tok_abc123xyz",
  "last4": "1111"
}
```

## Rate Limiting

Payment endpoints are rate-limited to prevent abuse:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/payment/*` | 10 requests | 1 minute |

Rate limit headers included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in window
- `Retry-After`: Seconds until reset (when limited)

## Incident Response

If you suspect a security breach:

1. **Immediately rotate** all API keys
2. **Review logs** for suspicious activity
3. **Contact Clover support** at security@clover.com
4. **Document the incident** with timestamps
5. **Update affected customers** if data was compromised

## Compliance Standards

This implementation follows:

- **PCI DSS** (Payment Card Industry Data Security Standard)
- **OWASP Top 10** security best practices
- **GDPR** data protection (for EU customers)
- **CCPA** privacy rights (for California customers)

## Regular Security Maintenance

### Monthly
- [ ] Review access logs
- [ ] Check for security updates
- [ ] Verify rate limits are effective

### Quarterly
- [ ] Security audit
- [ ] Penetration testing
- [ ] Update dependencies

### Annually
- [ ] Full PCI compliance review
- [ ] Third-party security assessment
- [ ] Update security policies

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. **DO NOT** share details publicly
3. **Email security contact** (add your email here)
4. **Include details**: reproduction steps, impact, fix suggestions

## Additional Resources

- [Clover Security Best Practices](https://docs.clover.com/docs/security-best-practices)
- [PCI DSS Requirements](https://www.pcisecuritystandards.org/)
- [OWASP Guidelines](https://owasp.org/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)

## Contact

For security concerns:
- Security Email: [your-security-email@domain.com]
- Emergency: [your-emergency-contact]

---

**Last Updated**: October 2025  
**Next Review**: January 2026

