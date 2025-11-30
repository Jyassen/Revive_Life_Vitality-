import { NextRequest, NextResponse } from 'next/server'
import { StripeAPI, getStripeInstance, formatCustomerForStripe, formatAddressForStripe } from '@/lib/stripe'
import { z } from 'zod'
import Stripe from 'stripe'

// Request validation schema for subscription
const createSubscriptionSchema = z.object({
	priceId: z.string().startsWith('price_', 'Invalid Stripe Price ID'),
	customer: z.object({
		firstName: z.string(),
		lastName: z.string(),
		email: z.string().email(),
		phone: z.string().optional(),
		marketingConsent: z.boolean().default(false),
	}),
	shippingAddress: z.object({
		firstName: z.string(),
		lastName: z.string(),
		address1: z.string(),
		address2: z.string().optional(),
		city: z.string(),
		state: z.string(),
		zipCode: z.string(),
		country: z.string(),
	}),
	promotionCode: z.string().optional(),
	metadata: z.record(z.string()).optional(),
	trialPeriodDays: z.number().optional(),
})

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		
		// Validate request body
		const validationResult = createSubscriptionSchema.safeParse(body)
		if (!validationResult.success) {
			return NextResponse.json(
				{ 
					error: 'Invalid request data', 
					details: validationResult.error.errors 
				},
				{ status: 400 }
			)
		}

		const { priceId, customer, shippingAddress, promotionCode, metadata, trialPeriodDays } = validationResult.data

		// Initialize Stripe API
		const stripeAPI = new StripeAPI()
		const stripe = getStripeInstance()

		// Create or retrieve customer
		const customerData = formatCustomerForStripe(customer)
		const stripeCustomer = await stripeAPI.createCustomer({
			email: customerData.email,
			name: customerData.name,
			phone: customerData.phone,
			address: formatAddressForStripe(shippingAddress),
			metadata: {
				...metadata,
				customer_type: 'subscription',
			},
		})

		// If promotion code provided, retrieve it to get the coupon ID
		let couponId: string | undefined
		if (promotionCode) {
			try {
				const promotionCodes = await stripe.promotionCodes.list({
					code: promotionCode,
					limit: 1,
					expand: ['data.coupon'],
				})
				if (promotionCodes.data.length > 0 && promotionCodes.data[0].active) {
					const promoCode = promotionCodes.data[0] as Stripe.PromotionCode & { 
						coupon: Stripe.Coupon 
					}
					couponId = promoCode.coupon.id
				}
			} catch (err) {
				console.warn('Promotion code lookup failed:', err)
			}
		}

	// Create subscription with incomplete status
	// payment_behavior: 'default_incomplete' creates subscription + invoice but NOT payment intent
	// We need to manually create the payment intent for the invoice
	type ExpandedSubscription = Stripe.Subscription & {
		latest_invoice?: Stripe.Invoice
	}

	const subscription = await stripe.subscriptions.create({
		customer: stripeCustomer.id,
		items: [
			{ price: priceId }, // Now $48/week (includes $38 product + $10 shipping)
		],
		payment_behavior: 'default_incomplete',
		payment_settings: {
			payment_method_types: ['card'],
			save_default_payment_method: 'on_subscription',
		},
		expand: ['latest_invoice'],
		metadata: {
			...metadata,
			customer_name: customerData.name,
			shipping_address: JSON.stringify(shippingAddress),
			shipping_cost: '10.00',
			...(promotionCode && { promotion_code: promotionCode }),
		},
		...(couponId && { coupon: couponId }),
		...(trialPeriodDays && { trial_period_days: trialPeriodDays }),
	}) as unknown as ExpandedSubscription

	// Extract invoice from subscription
	const invoice = subscription.latest_invoice
	
	if (!invoice?.id || typeof invoice.id !== 'string') {
		throw new Error('Subscription created but no invoice found')
	}

	// If amount is $0 (100% discount), mark subscription as active and skip payment
	let clientSecret: string | null = null
	if (invoice.amount_due === 0) {
		// Pay the $0 invoice to activate the subscription
		await stripe.invoices.pay(invoice.id)
		// Return a special indicator that no payment is needed
		clientSecret = 'no_payment_required'
	} else {
		// Create a payment intent for the invoice amount
		// We create a standalone payment intent and link it to the subscription/invoice via metadata
		// When the payment succeeds, we'll handle it in the webhook to update the subscription
		const paymentIntent = await stripe.paymentIntents.create({
			amount: invoice.amount_due,
			currency: invoice.currency || 'usd',
			customer: stripeCustomer.id,
			description: `Subscription payment for ${customer.email}`,
			receipt_email: customer.email,
			metadata: {
				subscription_id: subscription.id,
				invoice_id: invoice.id,
				customer_id: stripeCustomer.id,
				customer_email: customer.email,
				...metadata,
			},
			automatic_payment_methods: {
				enabled: true,
			},
		})

		if (!paymentIntent.client_secret) {
			throw new Error('Failed to create payment intent')
		}

		clientSecret = paymentIntent.client_secret
	}

	// Audit log for subscription creation
	console.info('AUDIT_LOG', {
		event: 'SUBSCRIPTION_CREATED',
		timestamp: new Date().toISOString(),
		subscriptionId: subscription.id,
		customerId: stripeCustomer.id,
		priceId: priceId,
		customerEmail: customer.email,
		status: subscription.status,
	})

	// Return client secret and subscription details
	return NextResponse.json({
		subscriptionId: subscription.id,
		clientSecret: clientSecret,
		customerId: stripeCustomer.id,
		status: subscription.status,
	})

	} catch (error) {
		// Sanitize error logging
		const sanitizedError = {
			message: error instanceof Error ? error.message : 'Unknown error',
			timestamp: new Date().toISOString(),
			type: error?.constructor?.name || 'UnknownError',
		}
		console.error('Subscription creation error:', sanitizedError)

		// Audit log for failed subscription
		console.info('AUDIT_LOG', {
			event: 'SUBSCRIPTION_CREATION_FAILED',
			timestamp: new Date().toISOString(),
			error: sanitizedError.message,
		})

		return NextResponse.json(
			{ 
				error: 'Failed to create subscription',
				message: 'Unable to create subscription. Please try again.'
			},
			{ status: 500 }
		)
	}
}

