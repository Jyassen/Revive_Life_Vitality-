export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'apple_pay' | 'google_pay'
  name: string
}

export interface CheckoutStep {
  id: number
  name: string
  completed: boolean
  current: boolean
}

export interface OrderSummary {
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  couponCode?: string
}

export interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  customer: {
    email: string
    firstName: string
    lastName: string
  }
  shippingAddress: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  summary: OrderSummary
  createdAt: Date
  updatedAt: Date
}