'use client'

import React from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { CheckCircle, Package, Mail, Home } from 'lucide-react'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-brand-beige">
      <div className="container-custom section-padding">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 mx-auto text-brand-green mb-6" />
            <h1 className="font-playfair text-4xl lg:text-5xl mb-4 text-brand-dark">
              Order Confirmed!
            </h1>
            <p className="text-xl text-brand-brown mb-8">
              Thank you for your order. We&apos;re preparing your wellness shots with care.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-2xl p-8 shadow-soft mb-8">
            <h2 className="font-playfair text-2xl text-brand-dark mb-6">
              What happens next?
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 text-left">
                <Mail className="w-6 h-6 text-brand-brown mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-brand-dark mb-1">
                    Order Confirmation
                  </h3>
                  <p className="text-sm text-brand-brown">
                    You&apos;ll receive an email confirmation with your order details shortly.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 text-left">
                <Package className="w-6 h-6 text-brand-brown mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-brand-dark mb-1">
                    Careful Preparation
                  </h3>
                  <p className="text-sm text-brand-brown">
                    Our team will carefully prepare and package your wellness shots to ensure freshness.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 text-left">
                <Home className="w-6 h-6 text-brand-brown mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-brand-dark mb-1">
                    Fast Delivery
                  </h3>
                  <p className="text-sm text-brand-brown">
                    Your order will be shipped within 1-2 business days and delivered fresh to your door.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link href="/" className="block">
              <Button 
                variant="primary" 
                size="lg"
                ariaLabel="Continue shopping"
                className="btn-primary"
              >
                Continue Shopping
              </Button>
            </Link>
            
            <div className="text-sm text-brand-brown">
              Questions about your order? Contact us at{' '}
              <a 
                href="mailto:hello@revivelifevitality.com" 
                className="text-brand-dark hover:text-brand-brown transition-colors"
              >
                hello@revivelifevitality.com
              </a>
            </div>
          </div>

          {/* Wellness Tips */}
          <div className="mt-12 bg-brand-beige/50 rounded-2xl p-8">
            <h3 className="font-playfair text-2xl text-brand-dark mb-4">
              While You Wait...
            </h3>
            <p className="text-brand-brown mb-4">
              Start preparing for your wellness journey! Here are some tips to maximize the benefits:
            </p>
            <ul className="text-left text-sm text-brand-brown space-y-2 max-w-md mx-auto">
              <li>• Take your shots on an empty stomach for best absorption</li>
              <li>• Store in the refrigerator and consume within 3 days</li>
              <li>• Follow up with plenty of water throughout the day</li>
              <li>• Consider taking photos to track your wellness journey</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}