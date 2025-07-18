'use client';

import React, { useState } from 'react';
import Image from 'next/image';

type PackageOption = {
  id: string;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  savings?: string;
  isRecommended?: boolean;
  image: string;
  features?: string[];
};

const packageOptions: PackageOption[] = [
  {
    id: 'starter-pack',
    title: 'Starter Pack',
    description: 'Great for first-timers: try both flavors!',
    price: '$19.99',
    image: '/images/package-starter.png',
    features: ['Includes 2 Red Beet Heat + 2 Manuka Honey Immune Boost', 'Easy introduction to our products', 'One-time purchase']
  },
  {
    id: 'one-week',
    title: '7-Day Wellness Pack',
    description: 'One full week of daily shots to feel the difference.',
    price: '$34.99',
    originalPrice: '$41.99',
    savings: 'Save 15%',
    isRecommended: true,
    image: '/images/package-weekly.png',
    features: ['7 shots total (customize any mix)', 'Free shipping', 'One-time purchase', 'Experience real results']
  },
  {
    id: 'monthly',
    title: 'Monthly Subscription',
    description: 'Your daily wellness, delivered monthly. Set it and forget it!',
    price: '$99/month',
    originalPrice: '$129.99',
    savings: 'Save 25%',
    image: '/images/package-monthly.png',
    features: ['30 shots monthly (customize your mix)', 'Best value at ~$3.30/shot', 'Free priority shipping', 'Skip or cancel anytime']
  }
];

const PurchaseOptionsSection: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handleAddToCart = (packageId: string) => {
    setSelectedPackage(packageId);
    console.log(`Adding ${packageId} to cart`);
    // TODO: Implement actual cart functionality
  };

  return (
    <section id="shop" className="py-16 md:py-24 bg-brand-beige">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Get Revived – Choose Your Package</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the package that fits your wellness journey. All packages include our premium organic wellness shots with free shipping on orders over $30.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {packageOptions.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 ${
                pkg.isRecommended ? 'ring-2 ring-brand-brown relative transform hover:-translate-y-1' : 'hover:shadow-md hover:-translate-y-1'
              }`}
            >
              {pkg.isRecommended && (
                <div className="absolute top-0 right-0 bg-brand-brown text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                  Best Value
                </div>
              )}
              
              <div className="p-6">
                <div className="h-48 relative mb-6">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-contain"
                  />
                </div>
                
                <h3 className="text-xl font-medium text-brand-dark mb-2">{pkg.title}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-brand-dark">{pkg.price}</span>
                  {pkg.originalPrice && (
                    <span className="ml-2 text-sm text-gray-500 line-through">{pkg.originalPrice}</span>
                  )}
                  {pkg.savings && (
                    <span className="ml-2 text-sm text-green-600 font-medium">{pkg.savings}</span>
                  )}
                </div>
                
                {pkg.features && (
                  <ul className="mb-6 space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                <button
                  onClick={() => handleAddToCart(pkg.id)}
                  className={`w-full py-3 px-4 rounded-md font-medium text-center ${
                    pkg.id === 'monthly' 
                      ? 'bg-brand-brown text-white hover:bg-brand-brown/90'
                      : 'bg-brand-dark text-white hover:bg-brand-dark/90'
                  }`}
                >
                  {pkg.id === 'monthly' ? 'Subscribe & Save' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center space-x-6">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm text-gray-600">Secure Checkout</span>
          </div>
          <div className="flex items-center">
            <svg className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-sm text-gray-600">Credit Cards & PayPal</span>
          </div>
          <div className="flex items-center">
            <svg className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm text-gray-600">100% Money-back Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PurchaseOptionsSection; 