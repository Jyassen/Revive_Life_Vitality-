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
  specialInstructions?: string
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
  },
  specialInstructions?: string
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
    createdAt: new Date(),
    specialInstructions
  }
}

export function formatOrderForEmail(orderData: OrderData): string {
  const itemsList = orderData.items
    .map(item => `${item.name} (Qty: ${item.quantity}) - ${item.price}`)
    .join('\n')
  const special = orderData.specialInstructions
    ? `\nSpecial Instructions:\n${orderData.specialInstructions}\n`
    : ''

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

${special}Your order will be shipped within 1-2 business days.

Thank you for choosing Revive Life Vitality!
`.trim()
}

// Vendor-facing email with full configuration details
export function formatOrderForVendorEmail(orderData: OrderData): string {
  // Friendly names for configured product IDs
  const productNames: Record<string, string> = {
    'red-beet-heat': 'Red Beet Heat',
    'manuka-honey-immune': 'Manuka Honey Immune Boost',
  }

  const itemBlocks = orderData.items.map(item => {
    const cfg = (item as any).packageConfig as
      | {
          packageName: string
          quantity: number
          totalShots: number
          selectedProducts: { productId: string; quantity: number }[]
          subscription?: { frequency: 'weekly' | 'monthly'; discount: number }
        }
      | undefined

    if (!cfg) {
      return [
        `- Item: ${item.name}`,
        `- Quantity: ${item.quantity}`,
        `- Price: ${item.price}`,
      ].join('\n')
    }

    const selections = cfg.selectedProducts
      .map(s => `  - ${productNames[s.productId] || s.productId}: ${s.quantity}x`)
      .join('\n')

    const sub = cfg.subscription
      ? `- Subscription: ${cfg.subscription.frequency} (${cfg.subscription.discount}% off)`
      : ''

    return [
      `- Pack: ${cfg.packageName}`,
      `- Packages ordered: ${cfg.quantity}`,
      `- Shots per package: ${cfg.totalShots}`,
      '- Selections:',
      selections,
      sub,
    ]
      .filter(Boolean)
      .join('\n')
  }).join('\n\n')

  const lines = [
    'New order received.',
    '',
    'Action: Please confirm payment in Clover for this order before fulfillment.',
    '',
    'Customer',
    `- Name: ${orderData.customer.fullName}`,
    `- Email: ${orderData.customer.email}`,
    ...(orderData.customer.phone ? [`- Phone: ${orderData.customer.phone}`] : []),
    '',
    'Shipping Address',
    `${orderData.customer.fullName}`,
    `${orderData.shippingAddress.address1}`,
    `${orderData.shippingAddress.address2 ? orderData.shippingAddress.address2 : ''}`.trim(),
    `${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}`,
    '',
    'Order Details',
    itemBlocks,
    '',
    'Order Summary',
    `- Items: $${orderData.subtotal.toFixed(2)}`,
    `- Shipping: $${orderData.shipping.toFixed(2)}`,
    `- Subtotal: $${(orderData.subtotal + orderData.shipping).toFixed(2)}`,
  ]

  if (orderData.specialInstructions) {
    lines.push('', 'Special Instructions', orderData.specialInstructions)
  }

  lines.push('', 'Created At', orderData.createdAt.toISOString())

  return lines.join('\n').trim()
}