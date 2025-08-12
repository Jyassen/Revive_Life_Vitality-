'use client'

import React, { useState } from 'react'
import { useCheckout } from '@/context/CheckoutContext'
import FormField from '@/components/forms/FormField'
import Button from '@/components/ui/Button'
import { customerInfoSchema } from '@/lib/validations/checkout'

const CustomerInfo: React.FC = () => {
  const { customerInfo, setCustomerInfo, nextStep, errors, setError, clearErrors } = useCheckout()
  
  const [formData, setFormData] = useState({
    firstName: customerInfo?.firstName || '',
    lastName: customerInfo?.lastName || '',
    email: customerInfo?.email || '',
    phone: customerInfo?.phone || '',
    marketingConsent: customerInfo?.marketingConsent || false
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      clearErrors()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()

    try {
      const validatedData = customerInfoSchema.parse(formData)
      setCustomerInfo(validatedData)
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
          Contact Information
        </h2>
        <p className="text-brand-brown">
          We&apos;ll use this information to send you order updates and receipts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Marketing Consent */}
        <div className="flex items-start gap-3 pt-4">
          <input
            id="marketingConsent"
            name="marketingConsent"
            type="checkbox"
            checked={formData.marketingConsent}
            onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
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

        {/* Guest Checkout Notice */}
        <div className="bg-brand-beige rounded-lg p-4 border-l-4 border-brand-brown">
          <p className="text-sm text-brand-dark">
            <strong>Guest Checkout:</strong> You&apos;re checking out as a guest. 
            Create an account after your purchase to track orders and save your preferences.
          </p>
        </div>

        <div className="pt-6">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            ariaLabel="Continue to shipping information"
            className="w-full btn-primary"
          >
            Continue to Shipping
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CustomerInfo