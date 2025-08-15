import { NextRequest, NextResponse } from 'next/server'
import { validateCoupon } from '@/lib/coupons'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const code = (body?.code || '').toString()
    const subtotal = Number(body?.subtotal || 0)
    const result = validateCoupon(code, subtotal)
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ valid: false, discount: 0, message: 'Invalid request' }, { status: 400 })
  }
}


