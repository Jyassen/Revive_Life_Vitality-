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

		if (!promoCode.active) {
			return NextResponse.json({
				valid: false,
				message: 'Promo code is no longer active',
			})
		}

		// Get the coupon - it might be a string ID or expanded object
		const promoCoupon = (promoCode as Stripe.Response<Stripe.PromotionCode> & { coupon: Stripe.Coupon | string }).coupon
		let coupon: Stripe.Coupon
		if (typeof promoCoupon === 'string') {
			// Coupon wasn't expanded, fetch it
			coupon = await stripe.coupons.retrieve(promoCoupon)
		} else {
			coupon = promoCoupon
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

