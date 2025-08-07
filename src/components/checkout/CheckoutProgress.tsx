'use client'

import React from 'react'
import { Check } from 'lucide-react'

interface CheckoutProgressProps {
  currentStep: number
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Customer Info' },
    { id: 2, name: 'Shipping' },
    { id: 3, name: 'Payment' },
    { id: 4, name: 'Review' }
  ]

  return (
    <div className="w-full mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm
                  transition-all duration-300
                  ${currentStep > step.id
                    ? 'bg-brand-green text-white'
                    : currentStep === step.id
                    ? 'bg-brand-brown text-white'
                    : 'bg-white border-2 border-brand-brown/30 text-brand-brown'
                  }
                `}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              
              {/* Step Name */}
              <div className="ml-3 hidden sm:block">
                <p
                  className={`
                    text-sm font-medium
                    ${currentStep >= step.id ? 'text-brand-dark' : 'text-brand-brown/60'}
                  `}
                >
                  {step.name}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 mx-4 sm:mx-8 h-0.5 transition-all duration-300
                  ${currentStep > step.id ? 'bg-brand-green' : 'bg-brand-brown/20'}
                `}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Mobile Step Names */}
      <div className="sm:hidden mt-4 text-center">
        <p className="text-sm font-medium text-brand-dark">
          Step {currentStep}: {steps.find(step => step.id === currentStep)?.name}
        </p>
      </div>
    </div>
  )
}

export default CheckoutProgress