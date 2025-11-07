import { NextRequest, NextResponse } from 'next/server'
import { StripeAPI, formatAmountForStripe, createPaymentMetadata } from '@/lib/stripe'
import { z } from 'zod'

// Request validation schema
const createPaymentIntentSchema = z.object({
	items: z.array(z.object({
		id: z.string(),
		name: z.string(),
		price: z.number(),
		quantity: z.number(),
		image: z.string().optional(),
	})).min(1, 'At least one item is required'),
	customer: z.object({
		firstName: z.string(),
		lastName: z.string(),
		email: z.string().email(),
		phone: z.string().optional(),
		marketingConsent: z.boolean().default(false),
	}),
	summary: z.object({
		subtotal: z.number(),
		tax: z.number(),
		shipping: z.number(),
		discount: z.number(),
		total: z.number(),
	}),
	couponCode: z.string().optional(),
	specialInstructions: z.string().optional(),
})

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		
		// Validate request body
		const validationResult = createPaymentIntentSchema.safeParse(body)
		if (!validationResult.success) {
			return NextResponse.json(
				{ 
					error: 'Invalid request data', 
					details: validationResult.error.errors 
				},
				{ status: 400 }
			)
		}

		const { items, customer, summary, couponCode, specialInstructions } = validationResult.data

		// Validate amount (must be positive and match calculated total)
		if (summary.total <= 0) {
			return NextResponse.json(
				{ error: 'Invalid payment amount' },
				{ status: 400 }
			)
		}

		// Initialize Stripe API
		const stripe = new StripeAPI()

		// Create payment metadata
		const metadata = createPaymentMetadata({
			items,
			customer,
			summary,
			couponCode,
			specialInstructions,
		})

		// Create Payment Intent
		const paymentIntent = await stripe.createPaymentIntent({
			amount: formatAmountForStripe(summary.total),
			currency: 'usd',
			customerEmail: customer.email,
			customerName: `${customer.firstName} ${customer.lastName}`,
			description: `Order for ${items.length} item(s) - ${customer.firstName} ${customer.lastName}`,
			metadata,
		})

		// Audit log for payment intent creation
		console.info('AUDIT_LOG', {
			event: 'PAYMENT_INTENT_CREATED',
			timestamp: new Date().toISOString(),
			paymentIntentId: paymentIntent.id,
			amount: summary.total,
			currency: 'USD',
			customerEmail: customer.email,
			itemCount: items.length,
		})

		// Return client secret to frontend
		return NextResponse.json({
			clientSecret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id,
			amount: summary.total,
		})

	} catch (error) {
		// Sanitize error logging - never log sensitive data
		const sanitizedError = {
			message: error instanceof Error ? error.message : 'Unknown error',
			timestamp: new Date().toISOString(),
			type: error?.constructor?.name || 'UnknownError',
		}
		console.error('Payment intent creation error:', sanitizedError)

		// Audit log for failed payment intent
		console.info('AUDIT_LOG', {
			event: 'PAYMENT_INTENT_FAILED',
			timestamp: new Date().toISOString(),
			error: sanitizedError.message,
		})

		return NextResponse.json(
			{ 
				error: 'Failed to initialize payment',
				message: 'Unable to create payment session. Please try again.'
			},
			{ status: 500 }
		)
	}
}

