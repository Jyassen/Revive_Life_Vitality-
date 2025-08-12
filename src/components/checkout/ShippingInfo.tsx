'use client'

import React, { useState, useEffect } from 'react'
import { useCheckout } from '@/context/CheckoutContext'
import FormField from '@/components/forms/FormField'
import Button from '@/components/ui/Button'
import { addressSchema } from '@/lib/validations/checkout'

const ShippingInfo: React.FC = () => {
  const { 
    customerInfo,
    shippingAddress, 
    setShippingAddress, 
    nextStep, 
    prevStep, 
    errors, 
    setError, 
    clearErrors 
  } = useCheckout()
  
  const [formData, setFormData] = useState({
    firstName: shippingAddress?.firstName || customerInfo?.firstName || '',
    lastName: shippingAddress?.lastName || customerInfo?.lastName || '',
    address1: shippingAddress?.address1 || '',
    address2: shippingAddress?.address2 || '',
    city: shippingAddress?.city || '',
    state: shippingAddress?.state || '',
    zipCode: shippingAddress?.zipCode || '',
    country: shippingAddress?.country || 'US'
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

  // Update form data when customer info becomes available
  useEffect(() => {
    if (customerInfo && (!formData.firstName || !formData.lastName)) {
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || customerInfo.firstName || '',
        lastName: prev.lastName || customerInfo.lastName || ''
      }))
    }
  }, [customerInfo, formData.firstName, formData.lastName])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      clearErrors()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()

    try {
      const validatedData = addressSchema.parse(formData)
      setShippingAddress(validatedData)
      nextStep()
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: Array<{ path: string[]; message: string }> }
        zodError.errors.forEach((err) => {
          setError(err.path[0], err.message)
        })
      }
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-soft">
      <div className="mb-8">
        <h2 className="font-playfair text-3xl text-brand-dark mb-2">
          Shipping Address
        </h2>
        <p className="text-brand-brown">
          Where would you like your wellness shots delivered?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            label="First Name"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={(value) => handleInputChange('firstName', value)}
            error={errors.firstName}
            required
          />

          <FormField
            label="Last Name"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(value) => handleInputChange('lastName', value)}
            error={errors.lastName}
            required
          />
        </div>

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

        {/* Shipping Notice */}
        <div className="bg-brand-beige rounded-lg p-4 border-l-4 border-brand-green">
          <p className="text-sm text-brand-dark">
            Your order will be carefully packaged to maintain freshness and quality.
          </p>
        </div>

        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            onClick={prevStep}
            variant="outline"
            size="lg"
            ariaLabel="Go back to customer information"
            className="btn-outline"
          >
            Back
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            ariaLabel="Continue to payment information"
            className="flex-1 btn-primary"
          >
            Continue to Payment
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ShippingInfo