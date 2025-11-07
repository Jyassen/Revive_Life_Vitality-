import { z } from 'zod'

export const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code'),
  country: z.string().default('US')
})

export const customerInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number').optional(),
  marketingConsent: z.boolean().default(false)
})

// Payment validation schemas
export const creditCardSchema = z.object({
  number: z.string().min(13, 'Card number must be at least 13 digits').max(19, 'Card number cannot exceed 19 digits'),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Invalid month'),
  expiryYear: z.string().regex(/^\d{2}$/, 'Invalid year'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Invalid security code'),
  name: z.string().min(1, 'Cardholder name is required')
})

export const paymentInfoSchema = z.object({
  paymentMethod: z.enum(['card', 'apple_pay', 'google_pay'], { required_error: 'Payment method is required' }),
  token: z.string().optional(), // Stripe handles payment method directly
  billingAddress: addressSchema.nullable().optional(), // Stripe collects billing address
  sameAsShipping: z.boolean().default(true)
})

export const checkoutSchema = z.object({
  customer: customerInfoSchema,
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  sameAsBilling: z.boolean().default(true),
  paymentMethod: z.enum(['card', 'apple_pay', 'google_pay']),
  paymentInfo: paymentInfoSchema,
  shippingMethod: z.string(),
  specialInstructions: z.string().max(500).optional(),
  couponCode: z.string().optional()
})

// Order processing schemas
export const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.string().url().optional()
})

export const orderSummarySchema = z.object({
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  shipping: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  total: z.number().positive()
})

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
  customer: customerInfoSchema,
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  paymentToken: z.string().optional(), // Optional for Stripe Payment Intents
  paymentIntentId: z.string().optional(), // For Stripe Payment Intents
  summary: orderSummarySchema,
  specialInstructions: z.string().max(500).optional(),
  couponCode: z.string().optional()
})

export type Address = z.infer<typeof addressSchema>
export type CustomerInfo = z.infer<typeof customerInfoSchema>
export type CreditCard = z.infer<typeof creditCardSchema>
export type PaymentInfo = z.infer<typeof paymentInfoSchema>
export type CheckoutData = z.infer<typeof checkoutSchema>
export type OrderItem = z.infer<typeof orderItemSchema>
export type OrderSummary = z.infer<typeof orderSummarySchema>
export type CreateOrderData = z.infer<typeof createOrderSchema>