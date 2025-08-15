'use client'

import React, { useState, useEffect } from 'react'
import { CreditCard, PaymentInfo } from '@/lib/validations/checkout'
import FormField from '@/components/forms/FormField'
import Button from '@/components/ui/Button'
import { formatCreditCardNumber } from '@/lib/utils/formatters'

import { Address } from '@/lib/validations/checkout'

interface PaymentFormProps {
  onSubmit: (paymentInfo: PaymentInfo) => Promise<void>
  isLoading?: boolean
  errors?: Record<string, string>
  billingAddress?: Address | null
  sameAsShipping?: boolean
  onBillingAddressChange?: (address: Address) => void
  onSameAsShippingChange?: (same: boolean) => void
  showSubmitButton?: boolean
  onPaymentReady?: (submitFunction: () => Promise<void>) => void
}

export default function PaymentForm({
  onSubmit,
  isLoading = false,
  errors = {},
  billingAddress,
  sameAsShipping = true,
  onSameAsShippingChange,
  showSubmitButton = true,
  onPaymentReady
}: PaymentFormProps) {
  const useHostedFields = process.env.NEXT_PUBLIC_USE_CLOVER_HOSTED === 'true'
  const cloverJsUrl = process.env.NEXT_PUBLIC_CLOVER_JS_URL
  const [hostedReady, setHostedReady] = useState(false)
  const [forceManual, setForceManual] = useState(false)

  // Load Clover JS when hosted fields are enabled and initialize elements
  useEffect(() => {
    if (!useHostedFields) return
    if (!cloverJsUrl) {
      setTokenError('Clover hosted fields not configured: missing NEXT_PUBLIC_CLOVER_JS_URL')
      return
    }
    const onLoaded = () => {
      try {
        const anyWindow = window as unknown as {
          Clover?: {
            new (key: string, opts: { merchantId: string }): CloverInstance
          } & ((key: string, opts: { merchantId: string }) => CloverInstance)
          cloverCreateToken?: () => Promise<{ id: string }>
        }
        if (!anyWindow.Clover) {
          throw new Error('Clover SDK not available')
        }
        const publishable = process.env.NEXT_PUBLIC_CLOVER_PUBLISHABLE_KEY
        const merchantId = process.env.NEXT_PUBLIC_CLOVER_MERCHANT_ID
        if (!publishable || !merchantId) {
          throw new Error('Missing Clover publishable key or merchant id')
        }
        const clover = new (anyWindow.Clover as unknown as CloverCtor)(publishable, { merchantId })
        const elements = clover.elements()
        const numberEl = elements.create('CARD_NUMBER')
        const dateEl = elements.create('CARD_DATE')
        const cvvEl = elements.create('CARD_CVV')
        const postalEl = elements.create('CARD_POSTAL_CODE')
        const mountAndCatch = (el: CloverElement, id: string) => {
          const node = document.getElementById(id)
          if (node) el.mount(`#${id}`)
        }
        mountAndCatch(numberEl, 'card-number')
        mountAndCatch(dateEl, 'card-date')
        mountAndCatch(cvvEl, 'card-cvv')
        mountAndCatch(postalEl, 'card-postal-code')
        ;(window as unknown as { cloverCreateToken?: () => Promise<string> }).cloverCreateToken = async (): Promise<string> => {
          const result = await clover.createToken()
          if (result?.errors) throw new Error('Tokenization failed')
          const token = (result?.token?.id || result?.token || result?.id) as string
          if (!token) throw new Error('Missing token from Clover')
          return token
        }
        setHostedReady(true)
        setForceManual(false)
      } catch (e) {
        setTokenError(e instanceof Error ? e.message : 'Failed to initialize Clover hosted fields')
        setForceManual(true)
      }
    }

    const existing = document.querySelector(`script[src=\"${cloverJsUrl}\"]`)
    if (existing) {
      onLoaded()
      return
    }
    const script = document.createElement('script')
    script.src = cloverJsUrl
    script.async = true
    script.onload = onLoaded
    script.onerror = () => { 
      setTokenError('Failed to load Clover hosted fields script')
      setForceManual(true)
    }
    document.head.appendChild(script)
    return () => {
      script.onload = null
      script.onerror = null
    }
  }, [useHostedFields, cloverJsUrl])

  // Timeout fallback: switch to manual entry if hosted fields don't become ready
  useEffect(() => {
    if (!useHostedFields || hostedReady || forceManual) return
    const t = setTimeout(() => {
      if (!hostedReady) {
        setTokenError((prev) => prev || 'Hosted fields timed out, using secure manual entry')
        setForceManual(true)
      }
    }, 7000)
    return () => clearTimeout(t)
  }, [useHostedFields, hostedReady, forceManual])
  const [cardData, setCardData] = useState<CreditCard>({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    name: ''
  })

  const [isTokenizing, setIsTokenizing] = useState(false)
  const [tokenError, setTokenError] = useState<string>('')

  const submitPayment = async () => {
    if (isLoading || isTokenizing) return

    // Basic client-side guard before tokenization
    const sanitizedNumber = cardData.number.replace(/\D/g, '')
    const rawMonth = cardData.expiryMonth.replace(/\D/g, '')
    const rawYear = cardData.expiryYear.replace(/\D/g, '')
    const monthTwoDigits = rawMonth.padStart(2, '0')
    const yearTwoDigits = rawYear.padStart(2, '0')
    const cvvDigits = cardData.cvv.replace(/\D/g, '')

    const monthValid = /^(0[1-9]|1[0-2])$/.test(monthTwoDigits)
    const yearValid = /^\d{2}$/.test(yearTwoDigits)
    const numberLengthValid = sanitizedNumber.length >= 13 && sanitizedNumber.length <= 19
    const luhnValid = luhnCheck(sanitizedNumber)
    const cvvValid = cvvDigits.length >= 3
    const nameValid = cardData.name.trim().length > 0

    const hasValidBasics =
      numberLengthValid && monthValid && yearValid && cvvValid && nameValid && luhnValid

    if (!hasValidBasics) {
      setTokenError('Please enter complete and valid card details')
      return
    }

    try {
      // Tokenize: prefer hosted fields when enabled and ready; gracefully
      // fall back to server tokenization if hosted fields are unavailable
      let token: string
      if (useHostedFields) {
        try {
          if (!hostedReady) throw new Error('Hosted fields not ready')
          token = await tokenizeHosted()
        } catch {
          token = await tokenizeCard({
            ...cardData,
            expiryMonth: monthTwoDigits,
            expiryYear: yearTwoDigits,
            number: sanitizedNumber,
          })
        }
      } else {
        token = await tokenizeCard({
          ...cardData,
          expiryMonth: monthTwoDigits,
          expiryYear: yearTwoDigits,
          number: sanitizedNumber,
        })
      }

      // Ensure billing address is provided
      if (!billingAddress) {
        setTokenError('Billing address is required')
        return
      }

      // Prepare payment info
      const paymentInfo: PaymentInfo = {
        paymentMethod: 'card',
        token: token,
        billingAddress: billingAddress,
        sameAsShipping: sameAsShipping
      }

      // Submit payment info
      await onSubmit(paymentInfo)

      // Clear sensitive card data after successful submission
      setCardData({
        number: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        name: ''
      })

    } catch (error) {
      console.error('Payment submission error:', error)
    }
  }

  function luhnCheck(value: string): boolean {
    if (!value) return false
    let sum = 0
    let shouldDouble = false
    for (let i = value.length - 1; i >= 0; i--) {
      let digit = parseInt(value.charAt(i), 10)
      if (Number.isNaN(digit)) return false
      if (shouldDouble) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
      shouldDouble = !shouldDouble
    }
    return sum % 10 === 0
  }

  // Expose submit function to parent only once
  useEffect(() => {
    if (onPaymentReady) {
      onPaymentReady(submitPayment)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Minimal types for Clover SDK to avoid any
  type CloverElement = { mount: (selector: string) => void }
  type CloverElements = { create: (type: 'CARD_NUMBER'|'CARD_DATE'|'CARD_CVV'|'CARD_POSTAL_CODE') => CloverElement }
  type CloverInstance = { elements: () => CloverElements; createToken: () => Promise<{ token?: { id?: string }, id?: string, errors?: unknown }> }
  type CloverCtor = new (key: string, opts: { merchantId: string }) => CloverInstance

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitPayment()
  }

  const handleCardFieldChange = (field: keyof CreditCard, value: string) => {
    let formattedValue = value

    // Format card number
    if (field === 'number') {
      formattedValue = formatCreditCardNumber(value)
    }

    // Format expiry date
    if (field === 'expiryMonth' || field === 'expiryYear') {
      if (field === 'expiryMonth') {
        // Ensure month is zero-padded and valid
        const month = value.replace(/\D/g, '').slice(0, 2)
        if (month.length === 1) {
          // Auto zero-pad single digits except for 1 which could become 10,11,12
          if (parseInt(month) > 1) {
            formattedValue = '0' + month
          } else {
            formattedValue = month
          }
        } else if (month.length === 2) {
          if (parseInt(month) > 12) {
            formattedValue = '12'
          } else if (parseInt(month) === 0) {
            formattedValue = '01'
          } else {
            formattedValue = month
          }
        } else {
          formattedValue = month
        }
      } else {
        // Year field - only allow 2 digits
        formattedValue = value.replace(/\D/g, '').slice(0, 2)
      }
    }

    // Format CVV
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4)
    }

    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }))

    // Clear any existing token error when user types without causing loops
    if (tokenError) setTokenError('')
  }

  const tokenizeCard = async (card: CreditCard): Promise<string> => {
    setIsTokenizing(true)
    setTokenError('')

    try {
      const response = await fetch('/api/payment/tokenize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: card.number.replace(/\s/g, ''),
          exp_month: card.expiryMonth.padStart(2, '0'),
          exp_year: card.expiryYear.padStart(2, '0'),
          cvv: card.cvv,
          name: card.name,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Failed to process payment information')
      }

      if (!result.success || !result.token?.id) {
        throw new Error('Invalid tokenization response')
      }

      return result.token.id
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process payment information'
      setTokenError(errorMessage)
      throw error
    } finally {
      setIsTokenizing(false)
    }
  }

  // Hosted fields tokenization (requires proper Clover JS integration)
  const tokenizeHosted = async (): Promise<string> => {
    setIsTokenizing(true)
    setTokenError('')
    try {
      // Expect a global hosted fields integration to expose a tokenization function.
      // Replace this with Clover's actual SDK call when configured, e.g.,
      // const { token } = await window.Clover.cardForm.createToken()
      const anyWindow = window as unknown as { cloverCreateToken?: () => Promise<{ id: string }> }
      if (!anyWindow.cloverCreateToken) {
        throw new Error('Clover hosted fields not initialized')
      }
      const result = await anyWindow.cloverCreateToken()
      if (!result?.id) throw new Error('Invalid token response from hosted fields')
      return result.id
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Hosted fields tokenization failed'
      setTokenError(msg)
      throw err
    } finally {
      setIsTokenizing(false)
    }
  }


  const getCardBrand = (number: string): string => {
    const num = number.replace(/\s/g, '')
    if (/^4/.test(num)) return 'Visa'
    if (/^5[1-5]/.test(num)) return 'Mastercard'
    if (/^3[47]/.test(num)) return 'American Express'
    if (/^6/.test(num)) return 'Discover'
    return ''
  }

  const cardBrand = getCardBrand(cardData.number)
  const isFormValid = cardData.number.replace(/\s/g, '').length >= 13 &&
                      cardData.expiryMonth &&
                      cardData.expiryYear &&
                      cardData.cvv.length >= 3 &&
                      cardData.name.trim()

  return (
    <div className="bg-white rounded-2xl p-8 shadow-soft">
      <div className="mb-6">
        <h2 className="font-playfair text-2xl text-brand-dark mb-2">
          Payment Information
        </h2>
        <p className="text-brand-brown">
          Your payment information is secure and encrypted.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {useHostedFields && !forceManual ? (
          <>
            <div className="mb-4">
              <p className="text-sm text-brand-brown mb-2">Secure Card Entry</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-brand-brown mb-1">Card Number</label>
                  <div id="card-number" className="border rounded-lg px-3 py-2 h-12 bg-brand-beige/30" />
                </div>
                <div>
                  <label className="block text-xs text-brand-brown mb-1">Expiration</label>
                  <div id="card-date" className="border rounded-lg px-3 py-2 h-12 bg-brand-beige/30" />
                </div>
                <div>
                  <label className="block text-xs text-brand-brown mb-1">CVV</label>
                  <div id="card-cvv" className="border rounded-lg px-3 py-2 h-12 bg-brand-beige/30" />
                </div>
                <div>
                  <label className="block text-xs text-brand-brown mb-1">Postal Code</label>
                  <div id="card-postal-code" className="border rounded-lg px-3 py-2 h-12 bg-brand-beige/30" />
                </div>
              </div>
              {!hostedReady && (
                <p className="text-xs text-brand-brown mt-2">Loading secure card fields…</p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Card Number */}
            <div className="relative">
              <FormField
                label="Card Number"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardData.number}
                onChange={(value) => handleCardFieldChange('number', value)}
                error={errors.cardNumber}
                required
              />
              {cardBrand && (
                <div className="absolute right-3 top-10 text-sm text-brand-brown font-medium">
                  {cardBrand}
                </div>
              )}
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                label="Month"
                name="expiryMonth"
                placeholder="MM"
                value={cardData.expiryMonth}
                onChange={(value) => handleCardFieldChange('expiryMonth', value)}
                error={errors.expiryMonth}
                required
              />
              
              <FormField
                label="Year"
                name="expiryYear"
                placeholder="YY"
                value={cardData.expiryYear}
                onChange={(value) => handleCardFieldChange('expiryYear', value)}
                error={errors.expiryYear}
                required
              />

              <FormField
                label="CVV"
                name="cvv"
                placeholder="123"
                value={cardData.cvv}
                onChange={(value) => handleCardFieldChange('cvv', value)}
                error={errors.cvv}
                required
              />
            </div>
          </>
        )}

        {/* Cardholder Name (shown for both hosted and manual) */}
        <FormField
          label="Cardholder Name"
          name="cardholderName"
          placeholder="John Doe"
          value={cardData.name}
          onChange={(value) => handleCardFieldChange('name', value)}
          error={errors.cardholderName}
          required
        />

        {/* Billing Address Toggle */}
        <div className="pt-4 border-t border-brand-brown/20">
          <div className="flex items-start gap-3">
            <input
              id="sameAsShipping"
              name="sameAsShipping"
              type="checkbox"
              checked={sameAsShipping}
              onChange={(e) => onSameAsShippingChange?.(e.target.checked)}
              className="mt-1 w-4 h-4 text-brand-brown bg-white border-brand-brown/30 rounded focus:ring-brand-brown/50 focus:ring-2"
            />
            <label 
              htmlFor="sameAsShipping"
              className="text-sm text-brand-brown leading-relaxed cursor-pointer"
            >
              Billing address same as shipping address
            </label>
          </div>
        </div>

        {/* Error Display */}
        {tokenError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{tokenError}</p>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-brand-beige rounded-lg p-4">
          <div className="flex items-center gap-2 text-brand-dark">
            <span className="text-lg">🔒</span>
            <div>
              <p className="text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-brand-brown">
                Your card information is encrypted and secure. We never store your card details.
              </p>
            </div>
          </div>
        </div>

        {/* Test Card Helper (Development Only) */}
        {!useHostedFields && process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">💳 Test Cards (Development)</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Successful:</strong> 4005 5192 0000 0004</p>
              <p><strong>Declined:</strong> 4000 0000 0000 0002</p>
              <p><em>Use any future date for expiry, any CVV</em></p>
            </div>
          </div>
        )}

        {/* Submit Button - conditionally shown */}
        {showSubmitButton && (
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!isFormValid || isLoading || isTokenizing}
            ariaLabel="Complete payment and place order"
            className="w-full"
          >
            {isTokenizing ? 'Securing Payment...' : isLoading ? 'Processing...' : 'Complete Order'}
          </Button>
        )}
      </form>
    </div>
  )
}