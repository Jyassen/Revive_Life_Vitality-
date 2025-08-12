import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { formatAmountForClover } from '@/lib/clover'

const createHostedCheckoutSchema = z.object({
  items: z.array(
    z.object({
      name: z.string().min(1),
      price: z.number().nonnegative(), // dollars
      quantity: z.number().int().positive().default(1),
      note: z.string().optional(),
    })
  ).min(1),
  customer: z.object({
    email: z.string().email().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
  }).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createHostedCheckoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({
        error: 'Invalid checkout data',
        details: parsed.error.errors,
      }, { status: 400 })
    }

    const CLOVER_API_KEY = process.env.CLOVER_API_KEY
    const CLOVER_ENVIRONMENT = process.env.CLOVER_ENVIRONMENT
    const CLOVER_MERCHANT_ID = process.env.CLOVER_MERCHANT_ID

    if (!CLOVER_API_KEY || !CLOVER_MERCHANT_ID) {
      return NextResponse.json({
        error: 'Clover configuration missing',
        message: 'CLOVER_API_KEY and CLOVER_MERCHANT_ID are required'
      }, { status: 503 })
    }

    const isProduction = CLOVER_ENVIRONMENT === 'production'
    const base = isProduction
      ? 'https://api.clover.com'
      : 'https://apisandbox.dev.clover.com'
    const url = `${base}/invoicingcheckoutservice/v1/checkouts`

    const { items, customer } = parsed.data
    const lineItems = items.map(item => ({
      name: item.name,
      price: formatAmountForClover(item.price),
      unitQty: item.quantity,
      note: item.note,
    }))

    const payload: Record<string, unknown> = {
      shoppingCart: { lineItems },
    }
    if (customer) payload.customer = customer

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': `Bearer ${CLOVER_API_KEY}`,
        'X-Clover-Merchant-Id': CLOVER_MERCHANT_ID,
      },
      body: JSON.stringify(payload),
    })

    const data = await resp.json().catch(() => ({}))

    if (!resp.ok) {
      return NextResponse.json({
        error: 'Failed to create hosted checkout session',
        status: resp.status,
        message: data?.message || data?.error || 'Unknown error',
      }, { status: resp.status })
    }

    return NextResponse.json({ success: true, href: data.href, checkoutSessionId: data.checkoutSessionId })
  } catch (err) {
    console.error('Hosted checkout error:', err)
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Unable to create hosted checkout session',
    }, { status: 500 })
  }
}


