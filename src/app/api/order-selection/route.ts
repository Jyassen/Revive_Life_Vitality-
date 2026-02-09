import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createOrderData, formatOrderForVendorEmail } from '@/lib/order'
import { sendEmail } from '@/lib/email'

/**
 * POST /api/order-selection
 *
 * Called right after checkout Step 1 (customer info + shipping) to send
 * a business notification email with the order details, before the
 * customer proceeds to payment.
 */

const orderSelectionSchema = z.object({
	items: z.array(z.object({
		id: z.string(),
		name: z.string(),
		price: z.number(),
		quantity: z.number().int().positive(),
		image: z.string().optional(),
		packageConfig: z.object({
			packageId: z.string(),
			packageName: z.string(),
			packagePrice: z.string(),
			packageImage: z.string(),
			totalShots: z.number().int().positive(),
			quantity: z.number().int().positive(),
			selectedProducts: z.array(z.object({
				productId: z.string(),
				quantity: z.number().int().nonnegative(),
			})),
			subscription: z.object({
				frequency: z.enum(['weekly', 'monthly']),
				discount: z.number().nonnegative(),
			}).optional(),
		}).optional(),
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
		country: z.string().default('US'),
	}),
	summary: z.object({
		subtotal: z.number(),
		shipping: z.number(),
		tax: z.number(),
		discount: z.number().optional(),
		total: z.number(),
	}),
	specialInstructions: z.string().max(500).optional(),
})

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const parsed = orderSelectionSchema.safeParse(body)

		if (!parsed.success) {
			return NextResponse.json(
				{ error: 'Invalid payload', details: parsed.error.errors },
				{ status: 400 },
			)
		}

		const { items, customer, shippingAddress, summary, specialInstructions } = parsed.data

		// Build order data using shared utility
		const orderData = createOrderData(
			{
				firstName: customer.firstName,
				lastName: customer.lastName,
				email: customer.email,
				phone: customer.phone,
				marketingConsent: customer.marketingConsent ?? false,
			},
			shippingAddress,
			items.map(i => ({
				id: i.id,
				name: i.name,
				price: `$${i.price.toFixed(2)}`,
				image: i.image || '',
				quantity: i.quantity,
				...(i.packageConfig ? { packageConfig: i.packageConfig } : {}),
			})),
			{
				subtotal: summary.subtotal,
				shipping: summary.shipping,
				tax: summary.tax,
				total: summary.total,
			},
			specialInstructions,
		)

		// Format vendor email body
		const emailBody = formatOrderForVendorEmail(orderData)
		const notify = process.env.ORDER_NOTIFY_EMAIL || 'revivelifevitality@gmail.com'

		let emailSent = false
		try {
			await sendEmail(
				notify,
				`New Order Selection - ${orderData.orderNumber}`,
				emailBody,
			)
			emailSent = true
		} catch (emailError) {
			// Log but don't fail the whole request — checkout should proceed
			console.error('Order selection email failed:', emailError)
		}

		return NextResponse.json({
			orderNumber: orderData.orderNumber,
			emailSent,
		})
	} catch (error) {
		console.error('Order selection route error:', error)
		return NextResponse.json(
			{ error: 'Server error' },
			{ status: 500 },
		)
	}
}
