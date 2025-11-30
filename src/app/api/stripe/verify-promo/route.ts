import { NextRequest, NextResponse } from 'next/server'
import { getStripeInstance } from '@/lib/stripe'
import { z } from 'zod'
import Stripe from 'stripe'

const verifyPromoSchema = z.object({
	code: z.string().min(1),
})

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		
		const validationResult = verifyPromoSchema.safeParse(body)
		if (!validationResult.success) {
			return NextResponse.json(
				{ valid: false, message: 'Invalid request' },
				{ status: 400 }
			)
		}

		const { code } = validationResult.data
		const stripe = getStripeInstance()

		// Look up the promotion code in Stripe - try both original and uppercase
		let promotionCodes = await stripe.promotionCodes.list({
			code: code,
			limit: 1,
			active: true,
		})

		// If not found, try uppercase
		if (promotionCodes.data.length === 0) {
			promotionCodes = await stripe.promotionCodes.list({
				code: code.toUpperCase(),
				limit: 1,
				active: true,
			})
		}

		if (promotionCodes.data.length === 0) {
			return NextResponse.json({
				valid: false,
				message: 'Promo code not found',
			})
		}

		const promoCode = promotionCodes.data[0]
		
		// Debug log
		console.log('Promo code object:', JSON.stringify(promoCode, null, 2))

		if (!promoCode.active) {
			return NextResponse.json({
				valid: false,
				message: 'Promo code is no longer active',
			})
		}

		// The coupon field should be directly on the promotion code object
		// In Stripe's API, it's always included (not needing expansion)
		const couponData = promoCode.coupon
		
		if (!couponData) {
			// Fallback: try to get coupon ID from restrictions or metadata
			console.log('No coupon on promo code, raw object:', promoCode)
			return NextResponse.json({
				valid: false,
				message: 'Coupon configuration error',
			})
		}

		// couponData could be a string ID or full Coupon object
		let coupon: Stripe.Coupon
		if (typeof couponData === 'string') {
			coupon = await stripe.coupons.retrieve(couponData)
		} else {
			coupon = couponData
		}

		// Return success with coupon details
		let discountDescription = ''
		if (coupon.percent_off) {
			discountDescription = `${coupon.percent_off}% off`
		} else if (coupon.amount_off) {
			discountDescription = `$${(coupon.amount_off / 100).toFixed(2)} off`
		}

		return NextResponse.json({
			valid: true,
			message: `Valid! ${discountDescription}`,
			discount: discountDescription,
			promoId: promoCode.id,
		})

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		console.error('Promo verification error:', errorMessage, error)
		return NextResponse.json(
			{ 
				valid: false,
				message: `Error: ${errorMessage}`
			},
			{ status: 500 }
		)
	}
}

