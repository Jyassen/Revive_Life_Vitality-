import { NextRequest, NextResponse } from 'next/server'
import { StripeAPI, formatAmountForStripe, createPaymentMetadata, getStripeInstance } from '@/lib/stripe'
import { z } from 'zod'
import Stripe from 'stripe'

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
	promotionCode: z.string().optional(),
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

		const { items, customer, summary, promotionCode, couponCode, specialInstructions } = validationResult.data

		// Initialize Stripe
		const stripe = new StripeAPI()
		const stripeInstance = getStripeInstance()

		// Apply promotion code discount if provided
		let finalTotal = summary.total
		let discountAmount = 0
		let appliedCoupon: Stripe.Coupon | null = null

		if (promotionCode) {
			try {
				const promotionCodes = await stripeInstance.promotionCodes.list({
					code: promotionCode,
					limit: 1,
					expand: ['data.coupon'],
				})
				
				if (promotionCodes.data.length > 0 && promotionCodes.data[0].active) {
					const promoCode = promotionCodes.data[0] as Stripe.PromotionCode & { 
						coupon: Stripe.Coupon 
					}
					appliedCoupon = promoCode.coupon

					// Calculate discount based on coupon type
					if (appliedCoupon.percent_off) {
						discountAmount = (summary.subtotal * appliedCoupon.percent_off) / 100
					} else if (appliedCoupon.amount_off) {
						discountAmount = appliedCoupon.amount_off / 100 // Convert cents to dollars
					}

					// Apply discount to total
					finalTotal = Math.max(0, summary.total - discountAmount)
				}
			} catch (err) {
				console.warn('Promotion code lookup failed:', err)
			}
		}

		// Validate amount (must be non-negative)
		if (finalTotal < 0) {
			return NextResponse.json(
				{ error: 'Invalid payment amount' },
				{ status: 400 }
			)
		}

		// If total is $0 after discount, return success without payment
		if (finalTotal === 0) {
			return NextResponse.json({
				clientSecret: 'no_payment_required',
				paymentIntentId: 'free_order',
				amount: 0,
				discount: discountAmount,
			})
		}

		// Create payment metadata
		const metadata = createPaymentMetadata({
			items,
			customer,
			summary,
			couponCode: promotionCode || couponCode,
			specialInstructions,
		})

		// Add discount info to metadata
		if (appliedCoupon) {
			metadata.coupon_code = promotionCode || ''
			metadata.discount = discountAmount.toFixed(2)
		}

		// Create Payment Intent
		const paymentIntent = await stripe.createPaymentIntent({
			amount: formatAmountForStripe(finalTotal),
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
			amount: finalTotal,
			discount: discountAmount > 0 ? discountAmount.toFixed(2) : undefined,
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

