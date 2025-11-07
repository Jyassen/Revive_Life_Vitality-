import { NextRequest, NextResponse } from 'next/server'
import { StripeAPI, getStripeInstance, formatCustomerForStripe, formatAddressForStripe } from '@/lib/stripe'
import { z } from 'zod'

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

		const { priceId, customer, shippingAddress, metadata, trialPeriodDays } = validationResult.data

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

		// Create subscription with incomplete status
		// This creates the subscription and invoice but doesn't charge yet
		const subscription = await stripe.subscriptions.create({
			customer: stripeCustomer.id,
			items: [{ price: priceId }],
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
			},
			...(trialPeriodDays && { trial_period_days: trialPeriodDays }),
		})

		// Extract invoice ID from the subscription
		const invoice = subscription.latest_invoice as Stripe.Invoice
		
		if (!invoice?.id) {
			throw new Error('Subscription created but no invoice found')
		}

		// Retrieve the invoice with payment_intent expanded
		// This is the proper way to get the payment intent for a subscription's first payment
		const fullInvoice = await stripe.invoices.retrieve(invoice.id, {
			expand: ['payment_intent'],
		})

		// Extract the payment intent
		const paymentIntent = fullInvoice.payment_intent as Stripe.PaymentIntent | null
		
		if (!paymentIntent?.client_secret) {
			throw new Error('Payment intent not created for subscription invoice')
		}

		const clientSecret = paymentIntent.client_secret

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

