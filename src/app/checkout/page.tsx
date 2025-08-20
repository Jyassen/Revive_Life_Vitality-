'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { CheckoutProvider, useCheckout } from '@/context/CheckoutContext'
import ConfiguredPackageDisplay from '@/components/cart/ConfiguredPackageDisplay'
import FormField from '@/components/forms/FormField'
import Button from '@/components/ui/Button'
// Payment form imports removed for payment-link-only flow
import Image from 'next/image'
import { customerInfoSchema, addressSchema, OrderSummary } from '@/lib/validations/checkout'

interface CheckoutFormData {
  // Customer Info
  firstName: string
  lastName: string
  email: string
  phone: string
  marketingConsent: boolean
  // Shipping Address
  shippingFirstName: string
  shippingLastName: string
  address1: string
  address2: string
  city: string
  state: string
  zipCode: string
  country: string
  // Additional fields
  specialInstructions: string
}

function CheckoutContent() {
  const { items, totalPrice } = useCart()
  const { 
    customerInfo, 
    setCustomerInfo,
    shippingAddress, 
    setShippingAddress,
    // billing state not used in payment link flow
    orderSummary,
    setOrderSummary,
    // paymentStatus,
    errors, 
    setError, 
    clearErrors,
    isLoading,
    setLoading,
    // embedded/hosted payments and coupons removed in payment link flow
  } = useCheckout()
  const router = useRouter()

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items.length, router])

  // Calculate order summary (no coupon, no tax)
  useEffect(() => {
    const subtotal = totalPrice
    const shipping = 10.00 // Flat $10 shipping fee
    const discount = 0
    const tax = 0
    const total = Math.max(0, subtotal - discount) + shipping
    const summary: OrderSummary = { subtotal, tax, shipping, discount, total }
    setOrderSummary(summary)
    // NOTE: Do not include setOrderSummary in deps; its identity may change per render via context
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPrice])

  // No embedded payment used in payment-link flow

  // Form state
  const [formData, setFormData] = useState<CheckoutFormData>({
    // Customer Info
    firstName: customerInfo?.firstName || '',
    lastName: customerInfo?.lastName || '',
    email: customerInfo?.email || '',
    phone: customerInfo?.phone || '',
    marketingConsent: customerInfo?.marketingConsent || false,
    // Shipping Address
    shippingFirstName: shippingAddress?.firstName || '',
    shippingLastName: shippingAddress?.lastName || '',
    address1: shippingAddress?.address1 || '',
    address2: shippingAddress?.address2 || '',
    city: shippingAddress?.city || '',
    state: shippingAddress?.state || '',
    zipCode: shippingAddress?.zipCode || '',
    country: shippingAddress?.country || 'US',
    // Additional fields
    specialInstructions: ''
  })

  const states = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev: CheckoutFormData) => ({ ...prev, [field]: value }))
    // Clear field-specific error if it exists, but don't call setError if there's no error
    // This prevents infinite loops
  }

  // Auto-fill shipping name from customer info
  const copyCustomerNameToShipping = () => {
    setFormData((prev: CheckoutFormData) => ({
      ...prev,
      shippingFirstName: prev.firstName,
      shippingLastName: prev.lastName
    }))
  }

  // No embedded payment handling

  // Billing address not used in payment-link flow

  // No external submit; redirect occurs after shipping form submit

  const startPaymentLinkRedirect = async () => {
    try {
      setLoading(true)
      const customerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        marketingConsent: formData.marketingConsent
      }
      const shippingData = {
        firstName: formData.shippingFirstName || formData.firstName,
        lastName: formData.shippingLastName || formData.lastName,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      }
      const resp = await fetch('/api/payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            id: i.id,
            name: i.name,
            price: parseFloat(i.price.replace('$', '')),
            quantity: i.quantity,
            image: i.image,
          })),
          customer: customerData,
          shippingAddress: shippingData,
          summary: orderSummary,
          packageId: (items[0] && 'packageConfig' in items[0] && (items[0] as { packageConfig?: { packageId?: string } }).packageConfig?.packageId) || items[0]?.id,
        }),
      })
      const data = await resp.json()
      if (!resp.ok || !data?.href) {
        setError('payment', data?.error || 'Unable to start payment')
      } else {
        window.location.href = data.href as string
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCustomerShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()

    let hasErrors = false

    try {
      // Validate customer info
      const customerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        marketingConsent: formData.marketingConsent
      }
      customerInfoSchema.parse(customerData)
      
    } catch (error: unknown) {
      hasErrors = true
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: Array<{ path: string[]; message: string }> }
        zodError.errors.forEach((err) => {
          setError(err.path[0], err.message)
        })
      }
    }

    try {
      // Validate shipping address
      const shippingData = {
        firstName: formData.shippingFirstName || formData.firstName,
        lastName: formData.shippingLastName || formData.lastName,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      }
      addressSchema.parse(shippingData)
      
    } catch (error: unknown) {
      hasErrors = true
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: Array<{ path: string[]; message: string }> }
        zodError.errors.forEach((err) => {
          const fieldPath = err.path[0]
          // Map shipping address validation errors to correct form field names
          let errorField = fieldPath
          if (fieldPath === 'firstName' && !formData.shippingFirstName) {
            errorField = 'shippingFirstName'
          } else if (fieldPath === 'lastName' && !formData.shippingLastName) {
            errorField = 'shippingLastName'
          }
          setError(errorField, err.message)
        })
      }
    }

    if (!hasErrors) {
      // Save validated data to context
      const customerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        marketingConsent: formData.marketingConsent
      }
      const shippingData = {
        firstName: formData.shippingFirstName || formData.firstName,
        lastName: formData.shippingLastName || formData.lastName,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      }
      
      setCustomerInfo(customerData)
      setShippingAddress(shippingData)

      // If using payment links, email order + redirect immediately (skip card section)
      if (process.env.NEXT_PUBLIC_USE_PAYMENT_LINKS === 'true') {
        try {
          setLoading(true)
          const resp = await fetch('/api/payment-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: items.map(i => ({
                id: i.id,
                name: i.name,
                price: parseFloat(i.price.replace('$', '')),
                quantity: i.quantity,
                image: i.image,
              })),
              customer: customerData,
              shippingAddress: shippingData,
              summary: orderSummary,
              packageId: (items[0] && 'packageConfig' in items[0] && (items[0] as { packageConfig?: { packageId?: string } }).packageConfig?.packageId) || items[0]?.id,
            }),
          })
          const data = await resp.json()
          if (!resp.ok || !data?.href) {
            setError('payment', data?.error || 'Unable to start payment')
          } else {
            window.location.href = data.href as string
          }
        } finally {
          setLoading(false)
        }
        return
      }
    }
  }

  // Check if customer and shipping info are completed
  const isCustomerShippingComplete = customerInfo && shippingAddress

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-brand-beige">
      <div className="container-custom section-padding">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-playfair text-4xl lg:text-5xl mb-8 text-center text-brand-dark">
            Checkout
          </h1>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleCustomerShippingSubmit} className="space-y-8">
                {/* Contact Information Section */}
                <div className="bg-white rounded-2xl p-8 shadow-soft">
                  <div className="mb-6">
                    <h2 className="font-playfair text-2xl text-brand-dark mb-2">
                      Contact Information
                    </h2>
                    <p className="text-brand-brown">
                      We&apos;ll use this information to send you order updates and receipts.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <FormField
                      label="First Name"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(value) => handleInputChange('firstName', value)}
                      error={errors.firstName}
                      required
                    />
                    
                    <FormField
                      label="Last Name"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(value) => handleInputChange('lastName', value)}
                      error={errors.lastName}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <FormField
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(value) => handleInputChange('email', value)}
                      error={errors.email}
                      required
                    />

                    <FormField
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(value) => handleInputChange('phone', value)}
                      error={errors.phone}
                    />
                  </div>

                  {/* Marketing Consent */}
                  <div className="flex items-start gap-3 pt-2">
                    <input
                      id="marketingConsent"
                      name="marketingConsent"
                      type="checkbox"
                      checked={formData.marketingConsent}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('marketingConsent', e.target.checked)}
                      className="mt-1 w-4 h-4 text-brand-brown bg-white border-brand-brown/30 rounded focus:ring-brand-brown/50 focus:ring-2"
                    />
                    <label 
                      htmlFor="marketingConsent"
                      className="text-sm text-brand-brown leading-relaxed cursor-pointer"
                    >
                      I&apos;d like to receive email updates about new products, wellness tips, and exclusive offers. 
                      You can unsubscribe at any time.
                    </label>
                  </div>
                </div>

                {/* Shipping Address Section */}
                <div className="bg-white rounded-2xl p-8 shadow-soft">
                  <div className="mb-6">
                    <h2 className="font-playfair text-2xl text-brand-dark mb-2">
                      Shipping Address
                    </h2>
                    <p className="text-brand-brown">
                      Where would you like your wellness shots delivered?
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <FormField
                      label="First Name"
                      name="shippingFirstName"
                      placeholder={formData.firstName || "John"}
                      value={formData.shippingFirstName}
                      onChange={(value) => handleInputChange('shippingFirstName', value)}
                      error={errors.shippingFirstName}
                      required
                    />

                    <FormField
                      label="Last Name"
                      name="shippingLastName"
                      placeholder={formData.lastName || "Doe"}
                      value={formData.shippingLastName}
                      onChange={(value) => handleInputChange('shippingLastName', value)}
                      error={errors.shippingLastName}
                      required
                    />
                  </div>

                  {/* Quick fill button */}
                  {formData.firstName && formData.lastName && (
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={copyCustomerNameToShipping}
                        className="text-sm text-brand-brown hover:text-brand-dark underline"
                      >
                        Use same name as contact information
                      </button>
                    </div>
                  )}

                  <div className="space-y-6">
                    <FormField
                      label="Street Address"
                      name="address1"
                      placeholder="123 Main Street"
                      value={formData.address1}
                      onChange={(value) => handleInputChange('address1', value)}
                      error={errors.address1}
                      required
                    />

                    <FormField
                      label="Apartment, suite, etc."
                      name="address2"
                      placeholder="Apt 4B (optional)"
                      value={formData.address2}
                      onChange={(value) => handleInputChange('address2', value)}
                      error={errors.address2}
                    />

                    <div className="grid md:grid-cols-3 gap-6">
                      <FormField
                        label="City"
                        name="city"
                        placeholder="San Francisco"
                        value={formData.city}
                        onChange={(value) => handleInputChange('city', value)}
                        error={errors.city}
                        required
                      />

                      <FormField
                        label="State"
                        name="state"
                        type="select"
                        placeholder="Select state"
                        value={formData.state}
                        onChange={(value) => handleInputChange('state', value)}
                        error={errors.state}
                        options={states}
                        required
                      />

                      <FormField
                        label="ZIP Code"
                        name="zipCode"
                        placeholder="12345"
                        value={formData.zipCode}
                        onChange={(value) => handleInputChange('zipCode', value)}
                        error={errors.zipCode}
                        required
                      />
                    </div>
                  </div>

                  {/* Shipping Notice */}
                  <div className="mt-6 bg-brand-beige rounded-lg p-4 border-l-4 border-brand-green">
                    <p className="text-sm text-brand-dark">
                      Your order will be carefully packaged to maintain freshness and quality.
                    </p>
                  </div>
                </div>

                {/* Special Instructions Section */}
                <div className="bg-white rounded-2xl p-8 shadow-soft">
                  <div className="mb-6">
                    <h2 className="font-playfair text-2xl text-brand-dark mb-2">
                      Special Instructions
                    </h2>
                    <p className="text-brand-brown">
                      Any special delivery instructions or notes for us?
                    </p>
                  </div>

                  <FormField
                    label="Delivery Instructions"
                    name="specialInstructions"
                    type="textarea"
                    placeholder="Leave at front door, ring doorbell, etc. (optional)"
                    value={formData.specialInstructions}
                    onChange={(value) => handleInputChange('specialInstructions', value)}
                    rows={3}
                  />
                </div>

                {/* Continue Button for Customer/Shipping Info */}
                {!isCustomerShippingComplete && (
                  <div className="bg-white rounded-2xl p-8 shadow-soft">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isLoading}
                      ariaLabel="Continue to payment"
                      className="w-full btn-primary text-lg py-4"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                )}

                {/* Fallback button if validation succeeded but redirect failed or was blocked */}
                {isCustomerShippingComplete && (
                  <div className="bg-white rounded-2xl p-8 shadow-soft">
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      disabled={isLoading}
                      ariaLabel="Continue to payment"
                      className="w-full btn-primary text-lg py-4"
                      onClick={startPaymentLinkRedirect}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                )}

              </form>

              {/* Payment Section removed in payment-link flow */}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 shadow-soft sticky top-8">
                <h2 className="font-playfair text-2xl mb-6 text-brand-dark">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="border-b border-brand-brown/10 pb-4 last:border-b-0">
                      <div className="flex gap-4">
                        <div className="relative w-16 h-16 bg-brand-beige rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm text-brand-dark mb-1">
                            {item.name}
                          </h3>
                          <p className="text-xs text-brand-brown mb-1">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-brand-dark">
                            ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Show package configuration details if it's a configured package */}
                      <ConfiguredPackageDisplay item={item} />
                    </div>
                  ))}
                </div>

                {/* Order Totals (no tax, coupon removed) */}
                <div className="space-y-3 pt-6 border-t border-brand-brown/20">
                  <div className="flex justify-between text-brand-dark">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${orderSummary?.subtotal.toFixed(2) || totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-brand-brown">
                    <span>Shipping</span>
                    <span>${orderSummary?.shipping.toFixed(2) || '10.00'}</span>
                  </div>

                  {/* Final displayed amount as Subtotal (price + shipping) */}
                  <div className="border-t border-brand-brown/20 pt-3">
                    <div className="flex justify-between text-xl font-medium text-brand-dark">
                      <span>Subtotal</span>
                      <span>${orderSummary?.total.toFixed(2) || (totalPrice + 10).toFixed(2)}</span>
                    </div>
                  </div>

                </div>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-brand-brown/20 text-center">
                  <p className="text-xs text-brand-brown">
                    🔒 Your information is secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  )
}