import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createOrderData, formatOrderForEmail } from '@/lib/order'

const payloadSchema = z.object({
	items: z.array(z.object({
		id: z.string(),
		name: z.string(),
		price: z.number(),
		quantity: z.number().int().positive(),
		image: z.string().optional(),
	})).min(1),
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
		country: z.string().default('US'),
	}),
	summary: z.object({
		subtotal: z.number(),
		shipping: z.number(),
		tax: z.number(),
		total: z.number(),
		coupon: z.string().optional(),
	}),
	packageId: z.string().optional(),
})

function resolvePaymentLink(packageId?: string): string | null {
	const map: Record<string, string | undefined> = {
		'starter-pack': process.env.STARTER_PACK_LINK,
		'pro-pack': process.env.PRO_PACK_LINK,
		'revive-club': process.env.ELITE_PACK_LINK || process.env.REVIVE_CLUB_LINK,
	}
	return (packageId && map[packageId]) || null
}

async function sendEmail(to: string, subject: string, text: string) {
	// Prefer Resend if API key is available
	const resendKey = process.env.RESEND_API_KEY
	const from = process.env.EMAIL_FROM || process.env.SMTP_FROM || 'no-reply@revivelifevitality.com'
	if (resendKey) {
		const { Resend } = await import('resend')
		const resend = new Resend(resendKey)
		await resend.emails.send({ from, to, subject, text })
		return
	}
	// Fallback to SMTP if configured
	const host = process.env.SMTP_HOST
	const user = process.env.SMTP_USER
	const pass = process.env.SMTP_PASS
	if (host && user && pass) {
		const nodemailer = await import('nodemailer')
		const transporter = nodemailer.createTransport({
			host,
			port: Number(process.env.SMTP_PORT || 587),
			secure: false,
			auth: { user, pass },
		})
		await transporter.sendMail({ from, to, subject, text })
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const parsed = payloadSchema.safeParse(body)
		if (!parsed.success) {
			return NextResponse.json({ error: 'Invalid payload', details: parsed.error.errors }, { status: 400 })
		}
		const { items, customer, shippingAddress, summary, packageId } = parsed.data

		const orderData = createOrderData(
			{
				firstName: customer.firstName,
				lastName: customer.lastName,
				email: customer.email,
				phone: customer.phone,
				marketingConsent: false,
			},
			shippingAddress,
			items.map(i => ({ id: i.id, name: i.name, price: `$${i.price.toFixed(2)}`, image: i.image || '', quantity: i.quantity })),
			{ subtotal: summary.subtotal, shipping: summary.shipping, tax: summary.tax, total: summary.total }
		)
		const emailBody = formatOrderForEmail(orderData)
		const notify = process.env.ORDER_NOTIFY_EMAIL || 'revivelifevitality@gmail.com'
		await sendEmail(notify, `New Order (Payment Link) - ${orderData.orderNumber}`, emailBody)

		const link = resolvePaymentLink(packageId || items[0]?.id)
		if (!link) {
			return NextResponse.json({ error: 'Missing payment link for package' }, { status: 400 })
		}
		return NextResponse.json({ href: link, orderNumber: orderData.orderNumber })
	} catch (e) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 })
	}
}


