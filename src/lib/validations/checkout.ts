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
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number').optional(),
  marketingConsent: z.boolean().default(false)
})

export const checkoutSchema = z.object({
  customer: customerInfoSchema,
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  sameAsBilling: z.boolean().default(true),
  paymentMethod: z.enum(['card', 'apple_pay', 'google_pay']),
  shippingMethod: z.string(),
  specialInstructions: z.string().max(500).optional(),
  couponCode: z.string().optional()
})

export type Address = z.infer<typeof addressSchema>
export type CustomerInfo = z.infer<typeof customerInfoSchema>
export type CheckoutData = z.infer<typeof checkoutSchema>