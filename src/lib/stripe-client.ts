'use client'

import { loadStripe, Stripe, StripeElements, StripeElementsOptions } from '@stripe/stripe-js'
import { STRIPE_CONFIG } from './stripe'

let stripePromise: Promise<Stripe | null> | null = null

/**
 * Load Stripe.js library (client-side only)
 * This ensures we only load Stripe once and reuse the same instance
 */
export function getStripe(): Promise<Stripe | null> {
	if (!stripePromise) {
		if (!STRIPE_CONFIG.publishableKey) {
			console.error('Stripe publishable key is not configured')
			return Promise.resolve(null)
		}
		
		stripePromise = loadStripe(STRIPE_CONFIG.publishableKey)
	}
	
	return stripePromise
}

/**
 * Stripe Elements appearance configuration
 * Customize to match your brand
 */
export const stripeElementsAppearance = {
	theme: 'stripe' as const,
	variables: {
		colorPrimary: '#8B7355', // brand-brown
		colorBackground: '#ffffff',
		colorText: '#2C1810', // brand-dark
		colorDanger: '#df1b41',
		fontFamily: 'system-ui, -apple-system, sans-serif',
		spacingUnit: '4px',
		borderRadius: '8px',
		fontSizeBase: '16px',
	},
	rules: {
		'.Input': {
			border: '1px solid rgba(139, 115, 85, 0.3)',
			padding: '12px',
			boxShadow: 'none',
		},
		'.Input:focus': {
			border: '1px solid #8B7355',
			boxShadow: '0 0 0 3px rgba(139, 115, 85, 0.1)',
		},
		'.Input--invalid': {
			border: '1px solid #df1b41',
		},
		'.Label': {
			fontSize: '14px',
			fontWeight: '500',
			color: '#8B7355',
			marginBottom: '8px',
		},
		'.Error': {
			fontSize: '14px',
			color: '#df1b41',
		},
	},
}

/**
 * Create Stripe Elements options
 */
export function createElementsOptions(
	clientSecret: string,
	customerEmail?: string
): StripeElementsOptions {
	return {
		clientSecret,
		appearance: stripeElementsAppearance,
		...(customerEmail && {
			defaultValues: {
				billingDetails: {
					email: customerEmail,
				},
			},
		}),
	}
}

/**
 * Handle Stripe confirmation errors
 */
export function handleStripeError(error: { type: string; message: string }): string {
	switch (error.type) {
		case 'card_error':
		case 'validation_error':
			return error.message
		case 'invalid_request_error':
			return 'Invalid payment request. Please refresh and try again.'
		case 'api_error':
			return 'Payment service temporarily unavailable. Please try again.'
		case 'authentication_error':
			return 'Payment authentication failed. Please try again.'
		case 'rate_limit_error':
			return 'Too many requests. Please wait a moment and try again.'
		default:
			return 'An unexpected error occurred. Please try again.'
	}
}

/**
 * Format card brand for display
 */
export function formatCardBrand(brand: string): string {
	const brands: Record<string, string> = {
		'visa': 'Visa',
		'mastercard': 'Mastercard',
		'amex': 'American Express',
		'discover': 'Discover',
		'diners': 'Diners Club',
		'jcb': 'JCB',
		'unionpay': 'UnionPay',
	}
	
	return brands[brand.toLowerCase()] || brand
}

/**
 * Check if Stripe is loaded
 */
export async function isStripeLoaded(): Promise<boolean> {
	const stripe = await getStripe()
	return stripe !== null
}

