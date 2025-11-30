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

		// Look up the promotion code in Stripe
		const promotionCodes = await stripe.promotionCodes.list({
			code: code.toUpperCase(),
			limit: 1,
			expand: ['data.coupon'],
		})

		if (promotionCodes.data.length === 0) {
			return NextResponse.json({
				valid: false,
				message: 'Promo code not found',
			})
		}

		const promoCode = promotionCodes.data[0]
		
		// Debug log to see what we got
		console.log('Promo code found:', JSON.stringify(promoCode, null, 2))

		if (!promoCode.active) {
			return NextResponse.json({
				valid: false,
				message: 'Promo code is no longer active',
			})
		}

		// Get the coupon - handle all cases
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const promoCouponRaw = (promoCode as any).coupon
		
		if (!promoCouponRaw) {
			return NextResponse.json({
				valid: false,
				message: 'Coupon data not found',
			})
		}

		let coupon: Stripe.Coupon
		if (typeof promoCouponRaw === 'string') {
			// Coupon wasn't expanded, fetch it
			coupon = await stripe.coupons.retrieve(promoCouponRaw)
		} else {
			coupon = promoCouponRaw as Stripe.Coupon
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

