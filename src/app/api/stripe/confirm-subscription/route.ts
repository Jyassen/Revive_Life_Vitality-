import { NextRequest, NextResponse } from 'next/server'
import { getStripeInstance, StripeAPIError, getStripeErrorMessage } from '@/lib/stripe'
import { z } from 'zod'
import Stripe from 'stripe'

// Request validation schema
const confirmSubscriptionSchema = z.object({
	subscriptionId: z.string().startsWith('sub_', 'Invalid subscription ID'),
	customerId: z.string().startsWith('cus_', 'Invalid customer ID'),
	customer: z.object({
		firstName: z.string(),
		lastName: z.string(),
		email: z.string().email(),
		phone: z.string().optional(),
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
})

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		
		// Validate request body
		const validationResult = confirmSubscriptionSchema.safeParse(body)
		if (!validationResult.success) {
			return NextResponse.json(
				{ 
					error: 'Invalid request data', 
					details: validationResult.error.errors 
				},
				{ status: 400 }
			)
		}

		const { subscriptionId, customer, shippingAddress } = validationResult.data

		// Initialize Stripe instance
		const stripe = getStripeInstance()

		// Retrieve the subscription to verify payment was successful
		type ExpandedSubscription = Stripe.Subscription & {
			current_period_end: number
			created: number
		}
		
		const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
			expand: ['latest_invoice.payment_intent.payment_method'],
		}) as ExpandedSubscription

		// Verify subscription is active (payment succeeded)
		if (subscription.status !== 'active' && subscription.status !== 'trialing') {
			console.warn('AUDIT_LOG', {
				event: 'SUBSCRIPTION_NOT_ACTIVE',
				timestamp: new Date().toISOString(),
				subscriptionId: subscription.id,
				status: subscription.status,
				customerEmail: customer.email,
			})

			return NextResponse.json(
				{ 
					error: 'Subscription not activated',
					message: 'Subscription payment was not successful',
					status: subscription.status,
				},
				{ status: 402 }
			)
		}

		// Extract payment method details from the expanded invoice
		type ExpandedInvoice = Stripe.Invoice & {
			payment_intent?: Stripe.PaymentIntent & {
				payment_method?: Stripe.PaymentMethod
			}
		}
		
		const invoice = subscription.latest_invoice as ExpandedInvoice
		const paymentIntent = invoice?.payment_intent
		const paymentMethod = paymentIntent?.payment_method
		const card = paymentMethod?.card
		
		const paymentDetails = {
			brand: card?.brand || 'card',
			last4: card?.last4 || '****',
		}

		// Create order reference
		const orderId = `SUB-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`

		// Get subscription details for response
		const priceAmount = subscription.items.data[0]?.price?.unit_amount || 0
		const currency = subscription.items.data[0]?.price?.currency || 'usd'
		const interval = subscription.items.data[0]?.price?.recurring?.interval || 'week'
		const intervalCount = subscription.items.data[0]?.price?.recurring?.interval_count || 1

		// Extract customer ID
		const customerId = typeof subscription.customer === 'string' 
			? subscription.customer 
			: subscription.customer?.id || ''

		// Audit log for successful subscription activation
		console.info('AUDIT_LOG', {
			event: 'SUBSCRIPTION_ACTIVATED',
			timestamp: new Date().toISOString(),
			subscriptionId: subscription.id,
			customerId,
			orderId,
			amount: priceAmount / 100,
			currency: currency.toUpperCase(),
			interval: `${intervalCount} ${interval}(s)`,
			status: subscription.status,
			paymentBrand: paymentDetails.brand,
			last4: paymentDetails.last4,
			customerEmail: customer.email,
		})

		// Return success response

		return NextResponse.json({
			success: true,
			orderId,
			subscriptionId: subscription.id,
			customerId,
			status: subscription.status,
			amount: priceAmount / 100,
			currency: currency.toUpperCase(),
			billingInterval: `${intervalCount} ${interval}(s)`,
			currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
			paymentMethod: paymentDetails,
			subscription: {
				id: subscription.id,
				status: subscription.status,
				customer: customer,
				shippingAddress: shippingAddress,
				createdAt: new Date(subscription.created * 1000).toISOString(),
				currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
			}
		})

	} catch (error) {
		// Sanitize error logging
		const sanitizedError = {
			message: error instanceof Error ? error.message : 'Unknown error',
			code: error instanceof StripeAPIError ? error.code : 'unknown',
			timestamp: new Date().toISOString(),
			type: error?.constructor?.name || 'UnknownError',
		}
		console.error('Subscription confirmation error:', sanitizedError)

		// Audit log for error
		console.info('AUDIT_LOG', {
			event: 'SUBSCRIPTION_CONFIRMATION_ERROR',
			timestamp: new Date().toISOString(),
			errorCode: sanitizedError.code,
			errorMessage: sanitizedError.message,
		})

		if (error instanceof StripeAPIError) {
			const errorMessage = getStripeErrorMessage(error)
			
			return NextResponse.json(
				{ 
					error: 'Subscription confirmation failed', 
					message: errorMessage,
					code: error.code,
				},
				{ status: error.statusCode }
			)
		}

		return NextResponse.json(
			{ 
				error: 'Internal server error',
				message: 'Failed to confirm subscription. Please contact support if you were charged.'
			},
			{ status: 500 }
		)
	}
}

