import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Security Middleware
 * 
 * Implements multiple layers of protection:
 * 1. Blocks requests containing card data patterns (PCI compliance)
 * 2. Rate limiting for payment endpoints
 * 3. Request validation
 */

// Card data patterns that should NEVER be in request bodies
const SENSITIVE_PATTERNS = [
	// Credit card numbers (13-19 digits with optional spaces/dashes)
	/\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{3,4}\b/,
	// CVV patterns
	/\b(cvv|cvc|cvd|cid)[\s\:]*\d{3,4}\b/i,
	// Explicit card number keys
	/"(card_?number|cardNumber|card_no|cardNo|pan)"[\s\:]*"?\d+/i,
	// Card expiry patterns
	/"(exp_?(month|year)|expiryMonth|expiryYear)"[\s\:]*"?\d+/i,
]

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10 // max requests per window

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

/**
 * Get client identifier for rate limiting
 */
function getClientId(request: NextRequest): string {
	// Use IP address from headers (Vercel/serverless environments)
	const forwarded = request.headers.get('x-forwarded-for')
	const realIp = request.headers.get('x-real-ip')
	const ip = forwarded ? forwarded.split(',')[0].trim() : realIp || 'unknown'
	return ip
}

/**
 * Check rate limit for client
 */
function checkRateLimit(clientId: string): { allowed: boolean; remaining: number } {
	const now = Date.now()
	const record = rateLimitStore.get(clientId)

	// Clean up expired entries
	if (record && now > record.resetAt) {
		rateLimitStore.delete(clientId)
	}

	const currentRecord = rateLimitStore.get(clientId)

	if (!currentRecord) {
		rateLimitStore.set(clientId, {
			count: 1,
			resetAt: now + RATE_LIMIT_WINDOW,
		})
		return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 }
	}

	if (currentRecord.count >= RATE_LIMIT_MAX_REQUESTS) {
		return { allowed: false, remaining: 0 }
	}

	currentRecord.count++
	return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - currentRecord.count }
}

/**
 * Scan request body for sensitive card data
 * 
 * This is a security layer to catch any attempts to send card data to the server.
 * Card data should ONLY be tokenized client-side via Clover hosted fields.
 */
async function scanForSensitiveData(request: NextRequest): Promise<boolean> {
	try {
		// Only check POST/PUT/PATCH requests with JSON bodies
		const contentType = request.headers.get('content-type') || ''
		if (!contentType.includes('application/json')) {
			return false
		}

		const method = request.method
		if (!['POST', 'PUT', 'PATCH'].includes(method)) {
			return false
		}

		// Clone request to read body without consuming it
		const clone = request.clone()
		const body = await clone.text()

		// Check for sensitive patterns
		for (const pattern of SENSITIVE_PATTERNS) {
			if (pattern.test(body)) {
				const alertData = {
					type: 'SENSITIVE_DATA_BLOCKED',
					severity: 'HIGH',
					url: request.url,
					method: request.method,
					timestamp: new Date().toISOString(),
					clientId: getClientId(request),
				}
				
				// Log to console
				console.error('🚨 SECURITY ALERT: Sensitive card data detected in request', alertData)
				
				// Audit log for security event
				console.info('AUDIT_LOG', {
					event: 'SECURITY_VIOLATION',
					...alertData,
				})
				
				return true
			}
		}

		return false
	} catch (error) {
		console.error('Error scanning request:', error)
		return false
	}
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// CRITICAL: Skip all middleware processing for Stripe webhooks
	// Webhooks require raw, unmodified request body for signature verification
	if (pathname === '/api/stripe/webhook') {
		return NextResponse.next()
	}

	// Apply rate limiting to payment endpoints
	if (pathname.startsWith('/api/payment/')) {
		const clientId = getClientId(request)
		const { allowed, remaining } = checkRateLimit(clientId)

		if (!allowed) {
			// Audit log for rate limit violation
			console.info('AUDIT_LOG', {
				event: 'RATE_LIMIT_EXCEEDED',
				timestamp: new Date().toISOString(),
				clientId: clientId,
				path: pathname,
			})
			
			return NextResponse.json(
				{
					error: 'Too many requests',
					message: 'Rate limit exceeded. Please try again later.',
				},
				{
					status: 429,
					headers: {
						'X-RateLimit-Limit': String(RATE_LIMIT_MAX_REQUESTS),
						'X-RateLimit-Remaining': '0',
						'Retry-After': String(Math.ceil(RATE_LIMIT_WINDOW / 1000)),
					},
				}
			)
		}

		// Add rate limit headers to response
		const response = NextResponse.next()
		response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS))
		response.headers.set('X-RateLimit-Remaining', String(remaining))
	}

	// Scan ALL API requests for sensitive card data (PCI compliance)
	if (pathname.startsWith('/api/')) {
		const hasSensitiveData = await scanForSensitiveData(request)

		if (hasSensitiveData) {
			return NextResponse.json(
				{
					error: 'Invalid request',
					message: 'Request contains sensitive data that must not be transmitted. Use Clover hosted fields for card data.',
					code: 'SENSITIVE_DATA_BLOCKED',
				},
				{
					status: 400,
					headers: {
						'X-Security-Alert': 'sensitive-data-detected',
					},
				}
			)
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Match all API routes
		 */
		'/api/:path*',
	],
}

