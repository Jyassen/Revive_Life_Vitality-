import { NextRequest, NextResponse } from 'next/server'
import { getStripeInstance } from '@/lib/stripe'
import { z } from 'zod'

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

		// Debug log
		console.log('Promo code found:', promoCodeRaw.code, 'ID:', promoCodeRaw.id)

		if (!promoCodeRaw.active) {
			return NextResponse.json({
				valid: false,
				message: 'Promo code is no longer active',
			})
		}

		// Get the coupon ID from promotion.coupon (Stripe's actual structure)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const promoCodeAny = promoCodeRaw as any
		const couponId = promoCodeAny.promotion?.coupon as string | undefined
		
		if (!couponId) {
			console.log('No coupon ID on promo code, raw object:', promoCodeRaw)
			return NextResponse.json({
				valid: false,
				message: 'Coupon configuration error',
			})
		}

		// Fetch the full coupon object from Stripe
		const coupon = await stripe.coupons.retrieve(couponId)
		console.log('Coupon retrieved:', coupon.id, 'percent_off:', coupon.percent_off)

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
			promoId: promoCodeRaw.id,
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

