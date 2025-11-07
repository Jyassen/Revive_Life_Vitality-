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

		// Create subscription with proper payment intent setup
		const subscription = await stripe.subscriptions.create({
			customer: stripeCustomer.id,
			items: [{ price: priceId }],
			payment_behavior: 'default_incomplete',
			payment_settings: {
				payment_method_types: ['card'],
				save_default_payment_method: 'on_subscription',
			},
			expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
			metadata: {
				...metadata,
				customer_name: customerData.name,
				shipping_address: JSON.stringify(shippingAddress),
			},
			...(trialPeriodDays && { trial_period_days: trialPeriodDays }),
		})

		// Get the client secret - check both payment_intent and setup_intent
		const latestInvoice = subscription.latest_invoice as any
		const pendingSetupIntent = subscription.pending_setup_intent as any
		let clientSecret: string | null = null

		// First try to get payment intent from invoice
		if (latestInvoice && typeof latestInvoice === 'object') {
			const paymentIntent = latestInvoice.payment_intent as any
			if (paymentIntent && typeof paymentIntent === 'object' && paymentIntent.client_secret) {
				clientSecret = paymentIntent.client_secret as string
				console.log('Using payment intent client secret')
			}
		}

		// If no payment intent, check for setup intent
		if (!clientSecret && pendingSetupIntent && typeof pendingSetupIntent === 'object') {
			if (pendingSetupIntent.client_secret) {
				clientSecret = pendingSetupIntent.client_secret as string
				console.log('Using setup intent client secret')
			}
		}

		// If still no client secret, we need to manually retrieve/create the payment intent
		if (!clientSecret && latestInvoice?.id) {
			console.log('Retrieving invoice to get payment intent...')
			const invoice = await stripe.invoices.retrieve(latestInvoice.id, {
				expand: ['payment_intent'],
			})
			
			const paymentIntent = invoice.payment_intent as any
			if (paymentIntent && typeof paymentIntent === 'object' && paymentIntent.client_secret) {
				clientSecret = paymentIntent.client_secret as string
				console.log('Retrieved payment intent from invoice')
			}
		}

		if (!clientSecret) {
			console.error('Failed to extract client secret from subscription:', {
				subscriptionId: subscription.id,
				subscriptionStatus: subscription.status,
				latestInvoiceId: latestInvoice?.id,
				latestInvoiceStatus: latestInvoice?.status,
				hasPendingSetupIntent: !!pendingSetupIntent,
			})
			throw new Error('Failed to get client secret for subscription payment')
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

