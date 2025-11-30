import { NextRequest, NextResponse } from 'next/server'
import { getStripeInstance } from '@/lib/stripe'
import { z } from 'zod'
import Stripe from 'stripe'

// Extended type for PromotionCode with coupon included
interface PromotionCodeWithCoupon extends Stripe.PromotionCode {
	coupon: Stripe.Coupon
}

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
		// List all active promotion codes and find the matching one
		const promotionCodes = await stripe.promotionCodes.list({
			active: true,
			limit: 100,
		})

		// Find the matching code (case-insensitive)
		const promoCodeRaw = promotionCodes.data.find(
			pc => pc.code.toUpperCase() === code.toUpperCase()
		)

		if (!promoCodeRaw) {
			console.log('Available codes:', promotionCodes.data.map(pc => pc.code))
			return NextResponse.json({
				valid: false,
				message: 'Promo code not found',
			})
		}

		// Cast to include coupon (always present in Stripe API response)
		const promoCode = promoCodeRaw as PromotionCodeWithCoupon
		
		// Debug log
		console.log('Promo code found:', promoCode.code, 'ID:', promoCode.id)

		if (!promoCode.active) {
			return NextResponse.json({
				valid: false,
				message: 'Promo code is no longer active',
			})
		}

		// Get the coupon from the promo code
		const coupon = promoCode.coupon
		
		if (!coupon) {
			console.log('No coupon on promo code, raw object:', promoCode)
			return NextResponse.json({
				valid: false,
				message: 'Coupon configuration error',
			})
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

