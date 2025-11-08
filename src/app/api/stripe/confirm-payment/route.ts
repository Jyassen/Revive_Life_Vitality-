import { NextRequest, NextResponse } from 'next/server'
import {
	StripeAPI,
	StripeAPIError,
	isPaymentSuccessful,
	getStripeErrorMessage,
	formatAmountFromStripe,
} from '@/lib/stripe'
import { z } from 'zod'

// Request validation schema
const confirmPaymentSchema = z.object({
	paymentIntentId: z.string().startsWith('pi_', 'Invalid payment intent ID'),
	items: z.array(z.object({
		id: z.string(),
		name: z.string(),
		price: z.number(),
		quantity: z.number(),
		image: z.string().optional(),
	})).min(1),
	customer: z.object({
		firstName: z.string(),
		lastName: z.string(),
		email: z.string().email(),
		phone: z.string().optional(),
		marketingConsent: z.boolean().optional(),
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
	summary: z.object({
		subtotal: z.number(),
		tax: z.number(),
		shipping: z.number(),
		discount: z.number(),
		total: z.number(),
	}),
	specialInstructions: z.string().optional(),
	couponCode: z.string().optional(),
})

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		
		// Validate request body
		const validationResult = confirmPaymentSchema.safeParse(body)
		if (!validationResult.success) {
			return NextResponse.json(
				{ 
					error: 'Invalid request data', 
					details: validationResult.error.errors 
				},
				{ status: 400 }
			)
		}

		const {
			paymentIntentId,
			items,
			customer,
			shippingAddress,
			summary,
			specialInstructions,
			couponCode,
		} = validationResult.data

		// Initialize Stripe API
		const stripe = new StripeAPI()

		// Retrieve the payment intent to verify its status
		const paymentIntent = await stripe.retrievePaymentIntent(paymentIntentId)

		// Check if payment was successful
		if (!isPaymentSuccessful(paymentIntent)) {
			// Audit log for failed payment
			console.info('AUDIT_LOG', {
				event: 'PAYMENT_FAILED',
				timestamp: new Date().toISOString(),
				paymentIntentId: paymentIntent.id,
				status: paymentIntent.status,
				customerEmail: customer.email,
			})

			return NextResponse.json(
				{ 
					error: 'Payment not completed',
					message: paymentIntent.last_payment_error?.message || 'Payment was not successful',
					status: paymentIntent.status,
				},
				{ status: 402 }
			)
		}

		// Extract payment method details
		const paymentMethod = paymentIntent.payment_method
		let paymentDetails = {
			brand: 'card',
			last4: '****',
		}

		if (typeof paymentMethod === 'string') {
			// If payment method is just an ID, we'd need to retrieve it
			// For now, use defaults
		} else if (paymentMethod && 'card' in paymentMethod) {
			paymentDetails = {
				brand: paymentMethod.card?.brand || 'card',
				last4: paymentMethod.card?.last4 || '****',
			}
		}

		// Create order data
		const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`
		
		// Here you would typically:
		// 1. Save order to your database
		// 2. Send confirmation email
		// 3. Trigger fulfillment process
		// 4. Update inventory
		
		// For now, we'll return the order confirmation
		const orderData = {
			id: orderId,
			status: 'confirmed',
			items,
			customer,
			shippingAddress,
			summary,
			specialInstructions,
			couponCode,
			paymentIntentId: paymentIntent.id,
			createdAt: new Date().toISOString(),
		}

		// Audit log for successful payment
		console.info('AUDIT_LOG', {
			event: 'PAYMENT_COMPLETED',
			timestamp: new Date().toISOString(),
			paymentIntentId: paymentIntent.id,
			orderId,
			amount: formatAmountFromStripe(paymentIntent.amount),
			currency: paymentIntent.currency.toUpperCase(),
			status: 'succeeded',
			paymentBrand: paymentDetails.brand,
			last4: paymentDetails.last4,
			customerEmail: customer.email,
			itemCount: items.length,
		})

		// Return success response
		return NextResponse.json({
			success: true,
			orderId,
			paymentIntentId: paymentIntent.id,
			amount: formatAmountFromStripe(paymentIntent.amount),
			currency: paymentIntent.currency.toUpperCase(),
			paymentMethod: paymentDetails,
			order: orderData,
		})

	} catch (error) {
		// Sanitize error logging - never log sensitive data
		const sanitizedError = {
			message: error instanceof Error ? error.message : 'Unknown error',
			code: error instanceof StripeAPIError ? error.code : 'unknown',
			timestamp: new Date().toISOString(),
			type: error?.constructor?.name || 'UnknownError',
		}
		console.error('Payment confirmation error:', sanitizedError)

		// Audit log for error
		console.info('AUDIT_LOG', {
			event: 'PAYMENT_CONFIRMATION_ERROR',
			timestamp: new Date().toISOString(),
			errorCode: sanitizedError.code,
			errorMessage: sanitizedError.message,
		})

		if (error instanceof StripeAPIError) {
			const errorMessage = getStripeErrorMessage(error)
			
			return NextResponse.json(
				{ 
					error: 'Payment confirmation failed', 
					message: errorMessage,
					code: error.code,
				},
				{ status: error.statusCode }
			)
		}

		return NextResponse.json(
			{ 
				error: 'Internal server error',
				message: 'Failed to confirm payment. Please contact support if you were charged.'
			},
			{ status: 500 }
		)
	}
}


