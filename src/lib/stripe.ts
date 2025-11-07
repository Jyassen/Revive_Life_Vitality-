import Stripe from 'stripe'
import { Address, CustomerInfo } from '@/lib/validations/checkout'

// Stripe Configuration
export const STRIPE_CONFIG = {
	publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
	secretKey: process.env.STRIPE_SECRET_KEY || '',
	webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
	apiVersion: '2024-11-20.acacia' as const,
} as const

// Initialize Stripe instance (server-side only)
let stripeInstance: Stripe | null = null

export function getStripeInstance(): Stripe {
	if (!stripeInstance) {
		if (!STRIPE_CONFIG.secretKey) {
			throw new Error('Stripe secret key is not configured')
		}
		
		stripeInstance = new Stripe(STRIPE_CONFIG.secretKey, {
			apiVersion: STRIPE_CONFIG.apiVersion,
			typescript: true,
		})
	}
	
	return stripeInstance
}

// Stripe API Types Extensions
export interface StripePaymentIntentMetadata {
	order_type: string
	item_count: string
	subtotal: string
	tax: string
	shipping_cost: string
	discount: string
	coupon_code?: string
	special_instructions?: string
	customer_name?: string
}

export interface CreatePaymentIntentRequest {
	amount: number // in cents
	currency?: string
	customerEmail?: string
	customerName?: string
	metadata?: StripePaymentIntentMetadata
	description?: string
}

export interface ConfirmPaymentRequest {
	paymentIntentId: string
	paymentMethodId?: string
}

export interface CreateCustomerRequest {
	email: string
	name: string
	phone?: string
	address?: Stripe.AddressParam
	metadata?: Record<string, string>
}

// Custom Error Class
export class StripeAPIError extends Error {
	public code: string
	public statusCode: number
	public type: string
	public details: unknown

	constructor(error: Stripe.StripeRawError) {
		super(error.message)
		this.name = 'StripeAPIError'
		this.code = error.code || 'unknown'
		this.statusCode = error.statusCode || 500
		this.type = error.type || 'api_error'
		this.details = error
	}
}

// Stripe API Helper Functions
export class StripeAPI {
	private stripe: Stripe

	constructor() {
		this.stripe = getStripeInstance()
	}

	// Payment Intents
	async createPaymentIntent(
		request: CreatePaymentIntentRequest
	): Promise<Stripe.PaymentIntent> {
		try {
			const paymentIntent = await this.stripe.paymentIntents.create({
				amount: request.amount,
				currency: request.currency || 'usd',
				automatic_payment_methods: {
					enabled: true,
				},
				description: request.description,
				metadata: request.metadata as Record<string, string>,
				...(request.customerEmail && {
					receipt_email: request.customerEmail,
				}),
			})

			return paymentIntent
		} catch (error) {
			if (this.isStripeError(error)) {
				throw new StripeAPIError(error)
			}
			throw error
		}
	}

	async updatePaymentIntent(
		paymentIntentId: string,
		updates: Partial<Stripe.PaymentIntentUpdateParams>
	): Promise<Stripe.PaymentIntent> {
		try {
			return await this.stripe.paymentIntents.update(paymentIntentId, updates)
		} catch (error) {
			if (this.isStripeError(error)) {
				throw new StripeAPIError(error)
			}
			throw error
		}
	}

	async confirmPaymentIntent(
		paymentIntentId: string,
		params?: Stripe.PaymentIntentConfirmParams
	): Promise<Stripe.PaymentIntent> {
		try {
			return await this.stripe.paymentIntents.confirm(paymentIntentId, params)
		} catch (error) {
			if (this.isStripeError(error)) {
				throw new StripeAPIError(error)
			}
			throw error
		}
	}

	async retrievePaymentIntent(
		paymentIntentId: string
	): Promise<Stripe.PaymentIntent> {
		try {
			return await this.stripe.paymentIntents.retrieve(paymentIntentId)
		} catch (error) {
			if (this.isStripeError(error)) {
				throw new StripeAPIError(error)
			}
			throw error
		}
	}

	async capturePaymentIntent(
		paymentIntentId: string,
		amountToCapture?: number
	): Promise<Stripe.PaymentIntent> {
		try {
			return await this.stripe.paymentIntents.capture(paymentIntentId, {
				...(amountToCapture && { amount_to_capture: amountToCapture }),
			})
		} catch (error) {
			if (this.isStripeError(error)) {
				throw new StripeAPIError(error)
			}
			throw error
		}
	}

	async cancelPaymentIntent(
		paymentIntentId: string
	): Promise<Stripe.PaymentIntent> {
		try {
			return await this.stripe.paymentIntents.cancel(paymentIntentId)
		} catch (error) {
			if (this.isStripeError(error)) {
				throw new StripeAPIError(error)
			}
			throw error
		}
	}

	// Customers
	async createCustomer(
		request: CreateCustomerRequest
	): Promise<Stripe.Customer> {
		try {
			return await this.stripe.customers.create({
				email: request.email,
				name: request.name,
				phone: request.phone,
				address: request.address,
				metadata: request.metadata,
			})
		} catch (error) {
			if (this.isStripeError(error)) {
				throw new StripeAPIError(error)
			}
			throw error
		}
	}

	async retrieveCustomer(customerId: string): Promise<Stripe.Customer> {
		try {
			const customer = await this.stripe.customers.retrieve(customerId)
			if (customer.deleted) {
				throw new Error('Customer has been deleted')
			}
			return customer as Stripe.Customer
		} catch (error) {
			if (this.isStripeError(error)) {
				throw new StripeAPIError(error)
			}
			throw error
		}
	}

	async updateCustomer(
		customerId: string,
		updates: Stripe.CustomerUpdateParams
	): Promise<Stripe.Customer> {
		try {
			return await this.stripe.customers.update(customerId, updates)
		} catch (error) {
			if (this.isStripeError(error)) {
				throw new StripeAPIError(error)
			}
			throw error
		}
	}

	// Refunds
	async createRefund(
		paymentIntentId: string,
		amount?: number,
		reason?: Stripe.RefundCreateParams.Reason
	): Promise<Stripe.Refund> {
		try {
			return await this.stripe.refunds.create({
				payment_intent: paymentIntentId,
				...(amount && { amount }),
				...(reason && { reason }),
			})
		} catch (error) {
			if (this.isStripeError(error)) {
				throw new StripeAPIError(error)
			}
			throw error
		}
	}

	// Webhooks
	constructWebhookEvent(
		payload: string | Buffer,
		signature: string
	): Stripe.Event {
		try {
			if (!STRIPE_CONFIG.webhookSecret) {
				throw new Error('Stripe webhook secret is not configured')
			}

			return this.stripe.webhooks.constructEvent(
				payload,
				signature,
				STRIPE_CONFIG.webhookSecret
			)
		} catch (error) {
			if (this.isStripeError(error)) {
				throw new StripeAPIError(error)
			}
			throw error
		}
	}

	// Type guard
	private isStripeError(error: unknown): error is Stripe.StripeRawError {
		return (
			typeof error === 'object' &&
			error !== null &&
			'type' in error &&
			'message' in error
		)
	}
}

// Utility Functions
export function formatAddressForStripe(address: Address): Stripe.AddressParam {
	return {
		line1: address.address1,
		line2: address.address2 || undefined,
		city: address.city,
		state: address.state,
		postal_code: address.zipCode,
		country: address.country || 'US',
	}
}

export function formatCustomerForStripe(customer: CustomerInfo) {
	return {
		email: customer.email,
		name: `${customer.firstName} ${customer.lastName}`,
		phone: customer.phone || undefined,
	}
}

export function formatAmountForStripe(amount: number): number {
	// Convert dollar amount to cents
	return Math.round(amount * 100)
}

export function formatAmountFromStripe(amount: number): number {
	// Convert cents to dollars
	return amount / 100
}

// Validation Functions
export function validateStripeConfig(): boolean {
	return Boolean(
		STRIPE_CONFIG.publishableKey &&
		STRIPE_CONFIG.secretKey &&
		STRIPE_CONFIG.publishableKey.startsWith('pk_') &&
		STRIPE_CONFIG.secretKey.startsWith('sk_')
	)
}

export function isStripeError(error: unknown): error is Stripe.StripeRawError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'type' in error &&
		'message' in error
	)
}

// Payment Status Helpers
export function isPaymentSuccessful(
	paymentIntent: Stripe.PaymentIntent
): boolean {
	return paymentIntent.status === 'succeeded'
}

export function isPaymentProcessing(
	paymentIntent: Stripe.PaymentIntent
): boolean {
	return paymentIntent.status === 'processing'
}

export function requiresAction(paymentIntent: Stripe.PaymentIntent): boolean {
	return paymentIntent.status === 'requires_action'
}

export function getPaymentFailureMessage(
	paymentIntent: Stripe.PaymentIntent
): string {
	const lastError = paymentIntent.last_payment_error

	if (!lastError) {
		return 'Payment failed. Please try again.'
	}

	const code = lastError.code
	const message = lastError.message

	switch (code) {
		case 'card_declined':
			return 'Your card was declined. Please try a different payment method.'
		case 'insufficient_funds':
			return 'Insufficient funds. Please check your account balance or try a different card.'
		case 'expired_card':
			return 'Your card has expired. Please update your payment information.'
		case 'incorrect_cvc':
			return 'The security code is incorrect. Please check and try again.'
		case 'processing_error':
			return 'There was an error processing your payment. Please try again.'
		case 'authentication_required':
			return 'Additional authentication is required. Please try again.'
		default:
			return message || 'Payment failed. Please check your payment information and try again.'
	}
}

// Get user-friendly error message from Stripe error
export function getStripeErrorMessage(error: StripeAPIError): string {
	switch (error.code) {
		case 'card_declined':
			return 'Your card was declined. Please try a different payment method.'
		case 'insufficient_funds':
			return 'Insufficient funds. Please check your account balance or try a different card.'
		case 'expired_card':
			return 'Your card has expired. Please update your payment information.'
		case 'incorrect_cvc':
			return 'The security code is incorrect. Please check and try again.'
		case 'incorrect_number':
			return 'Your card number is incorrect. Please check and try again.'
		case 'invalid_expiry_month':
		case 'invalid_expiry_year':
			return 'The expiration date is invalid. Please check and try again.'
		case 'processing_error':
			return 'There was an error processing your payment. Please try again.'
		case 'rate_limit':
			return 'Too many requests. Please wait a moment and try again.'
		case 'invalid_request_error':
			return 'Invalid payment information. Please check your details and try again.'
		case 'authentication_required':
			return 'Additional authentication is required. Please complete the verification.'
		case 'payment_intent_authentication_failure':
			return 'Authentication failed. Please try again.'
		default:
			return error.message || 'Payment failed. Please check your payment information and try again.'
	}
}

// Create payment metadata helper
export function createPaymentMetadata(data: {
	items: Array<{ id: string; name: string; quantity: number; price: number }>
	customer: CustomerInfo
	summary: {
		subtotal: number
		tax: number
		shipping: number
		discount: number
		total: number
	}
	couponCode?: string
	specialInstructions?: string
}): StripePaymentIntentMetadata {
	return {
		order_type: 'wellness_shots',
		item_count: data.items.length.toString(),
		subtotal: formatAmountForStripe(data.summary.subtotal).toString(),
		tax: formatAmountForStripe(data.summary.tax).toString(),
		shipping_cost: formatAmountForStripe(data.summary.shipping).toString(),
		discount: formatAmountForStripe(data.summary.discount).toString(),
		customer_name: `${data.customer.firstName} ${data.customer.lastName}`,
		...(data.couponCode && { coupon_code: data.couponCode }),
		...(data.specialInstructions && {
			special_instructions: data.specialInstructions,
		}),
	}
}

