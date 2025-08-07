'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { CheckoutProvider, useCheckout } from '@/context/CheckoutContext'
import CheckoutProgress from '@/components/checkout/CheckoutProgress'
import CustomerInfo from '@/components/checkout/CustomerInfo'
import ShippingInfo from '@/components/checkout/ShippingInfo'
import ConfiguredPackageDisplay from '@/components/cart/ConfiguredPackageDisplay'
import Image from 'next/image'

function CheckoutContent() {
  const { items, totalPrice } = useCart()
  const { step } = useCheckout()
  const router = useRouter()

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items.length, router])

  if (items.length === 0) {
    return null
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <CustomerInfo />
      case 2:
        return <ShippingInfo />
      case 3:
        return (
          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <h2 className="font-playfair text-3xl text-brand-dark mb-4">
              Payment Information
            </h2>
            <div className="bg-brand-beige rounded-lg p-6 text-center">
              <p className="text-brand-brown">
                Payment integration coming soon with Clover
              </p>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <h2 className="font-playfair text-3xl text-brand-dark mb-4">
              Review Your Order
            </h2>
            <div className="bg-brand-beige rounded-lg p-6 text-center">
              <p className="text-brand-brown">
                Order review coming soon
              </p>
            </div>
          </div>
        )
      default:
        return <CustomerInfo />
    }
  }

  return (
    <div className="min-h-screen bg-brand-beige">
      <div className="container-custom section-padding">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-playfair text-4xl lg:text-5xl mb-8 text-center text-brand-dark">
            Checkout
          </h1>

          <CheckoutProgress currentStep={step} />

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {renderStep()}
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

                {/* Order Totals */}
                <div className="space-y-3 pt-6 border-t border-brand-brown/20">
                  <div className="flex justify-between text-brand-dark">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-brand-brown">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <div className="flex justify-between text-brand-brown">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <div className="border-t border-brand-brown/20 pt-3">
                    <div className="flex justify-between text-xl font-medium text-brand-dark">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
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