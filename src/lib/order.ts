import type { CustomerInfo, Address } from '@/lib/validations/checkout'
import type { CartItem } from '@/context/CartContext'

export interface OrderData {
  orderNumber: string
  customer: {
    firstName: string
    lastName: string
    fullName: string
    email: string
    phone?: string
  }
  shippingAddress: Address
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  createdAt: Date
}

export function createOrderData(
  customerInfo: CustomerInfo,
  shippingAddress: Address,
  items: CartItem[],
  pricing: {
    subtotal: number
    shipping: number
    tax: number
    total: number
  }
): OrderData {
  const orderNumber = `RLV-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`
  
  return {
    orderNumber,
    customer: {
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName,
      fullName: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
      email: customerInfo.email,
      phone: customerInfo.phone
    },
    shippingAddress,
    items,
    subtotal: pricing.subtotal,
    shipping: pricing.shipping,
    tax: pricing.tax,
    total: pricing.total,
    createdAt: new Date()
  }
}

export function formatOrderForEmail(orderData: OrderData): string {
  const itemsList = orderData.items
    .map(item => `${item.name} (Qty: ${item.quantity}) - ${item.price}`)
    .join('\n')

  return `
Order Confirmation - ${orderData.orderNumber}

Dear ${orderData.customer.firstName},

Thank you for your order! Your wellness shots are being prepared with care.

Order Details:
${itemsList}

Shipping Address:
${orderData.customer.fullName}
${orderData.shippingAddress.address1}
${orderData.shippingAddress.address2 ? orderData.shippingAddress.address2 + '\n' : ''}${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}

Order Summary:
Items: $${orderData.subtotal.toFixed(2)}
Shipping: $${orderData.shipping.toFixed(2)}
Subtotal: $${(orderData.subtotal + orderData.shipping).toFixed(2)}

Your order will be shipped within 1-2 business days.

Thank you for choosing Revive Life Vitality!
`.trim()
}