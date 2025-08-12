'use client'

import React from 'react'
import { Address } from '@/lib/validations/checkout'
import FormField from '@/components/forms/FormField'

interface BillingAddressFormProps {
  address: Address
  onChange: (address: Address) => void
  errors?: Record<string, string>
  className?: string
}

export default function BillingAddressForm({
  address,
  onChange,
  errors = {},
  className = ''
}: BillingAddressFormProps) {
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

  const handleFieldChange = (field: keyof Address, value: string) => {
    onChange({
      ...address,
      [field]: value
    })
  }

  return (
    <div className={`bg-white rounded-2xl p-8 shadow-soft ${className}`}>
      <div className="mb-6">
        <h2 className="font-playfair text-2xl text-brand-dark mb-2">
          Billing Address
        </h2>
        <p className="text-brand-brown">
          Enter the address associated with your payment method.
        </p>
      </div>

      <div className="space-y-6">
        {/* Name Fields */}
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            label="First Name"
            name="billingFirstName"
            placeholder="John"
            value={address.firstName}
            onChange={(value) => handleFieldChange('firstName', value)}
            error={errors.firstName}
            required
          />

          <FormField
            label="Last Name"
            name="billingLastName"
            placeholder="Doe"
            value={address.lastName}
            onChange={(value) => handleFieldChange('lastName', value)}
            error={errors.lastName}
            required
          />
        </div>

        {/* Address Fields */}
        <FormField
          label="Street Address"
          name="billingAddress1"
          placeholder="123 Main Street"
          value={address.address1}
          onChange={(value) => handleFieldChange('address1', value)}
          error={errors.address1}
          required
        />

        <FormField
          label="Apartment, suite, etc."
          name="billingAddress2"
          placeholder="Apt 4B (optional)"
          value={address.address2 || ''}
          onChange={(value) => handleFieldChange('address2', value)}
          error={errors.address2}
        />

        {/* City, State, ZIP */}
        <div className="grid md:grid-cols-3 gap-6">
          <FormField
            label="City"
            name="billingCity"
            placeholder="San Francisco"
            value={address.city}
            onChange={(value) => handleFieldChange('city', value)}
            error={errors.city}
            required
          />

          <FormField
            label="State"
            name="billingState"
            type="select"
            placeholder="Select state"
            value={address.state}
            onChange={(value) => handleFieldChange('state', value)}
            error={errors.state}
            options={states}
            required
          />

          <FormField
            label="ZIP Code"
            name="billingZipCode"
            placeholder="12345"
            value={address.zipCode}
            onChange={(value) => handleFieldChange('zipCode', value)}
            error={errors.zipCode}
            required
          />
        </div>
      </div>
    </div>
  )
}