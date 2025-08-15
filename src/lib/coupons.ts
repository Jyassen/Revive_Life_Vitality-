export type CouponType = 'percent' | 'amount'

export interface CouponDefinition {
  code: string
  type: CouponType
  value: number
  active: boolean
  startDate?: string
  endDate?: string
  minSubtotal?: number
  maxDiscount?: number
}

// Example coupons. Replace or load from DB/ENV in production.
const COUPONS: CouponDefinition[] = [
  {
    code: 'REVIVE10',
    type: 'percent',
    value: 10,
    active: true,
  },
  {
    code: 'WELCOME5',
    type: 'amount',
    value: 5,
    active: true,
    minSubtotal: 30,
  },
]

export function getCouponByCode(code: string): CouponDefinition | null {
  const normalized = (code || '').trim().toUpperCase()
  const found = COUPONS.find(c => c.code.toUpperCase() === normalized) || null
  return found && found.active ? found : null
}

export function calculateDiscountAmount(
  coupon: CouponDefinition,
  subtotal: number,
): number {
  if (!coupon) return 0
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) return 0
  let discount = 0
  if (coupon.type === 'percent') {
    discount = (subtotal * coupon.value) / 100
  } else {
    discount = coupon.value
  }
  if (coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount)
  }
  return Math.max(0, Number(discount.toFixed(2)))
}

export function validateCoupon(
  code: string,
  subtotal: number,
): { valid: boolean; discount: number; message?: string; coupon?: CouponDefinition } {
  const coupon = getCouponByCode(code)
  if (!coupon) return { valid: false, discount: 0, message: 'Invalid or inactive code' }
  const discount = calculateDiscountAmount(coupon, subtotal)
  if (discount <= 0) {
    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum subtotal of $${coupon.minSubtotal.toFixed(2)} required`,
      }
    }
    return { valid: false, discount: 0, message: 'Code not applicable' }
  }
  return { valid: true, discount, coupon }
}


