'use client'; // Needed for button onClick handlers

import React from 'react';
import Button from '@/components/ui/Button'; // Updated path alias
// TODO: Import Stripe components when ready
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import CheckoutForm from '../checkout/CheckoutForm';

// Placeholder for Stripe public key (replace with actual environment variable)
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'your_test_publishable_key');


// Placeholder product options from PRD
const purchaseOptions = [
    { id: 'starter', name: 'Starter Pack', description: '4 shots (2 of each)', price: '$19.99', note: 'Great for first-timers!', bestValue: false },
    { id: 'weekly', name: '1-Week Supply', description: '7 shots (your choice)', price: '$34.99', note: 'Feel the difference!', bestValue: false },
    { id: 'monthly', name: 'Monthly Vitality Subscription', description: '30 shots (mixed or your choice)', price: '$129.99/month', note: 'Save 15% + Free Shipping!', bestValue: true },
];


const CallToActionSection: React.FC = () => {

    // Placeholder function for handling subscription/purchase
    const handlePurchase = (optionId: string) => {
        console.log(`Purchase/Subscribe clicked for: ${optionId}`);
        // TODO: Later: Integrate Stripe checkout flow here
        // Might involve setting state, redirecting, or calling an API route
    };

  return (
    <section id="shop" className="py-16 bg-brand-green-light/50 border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green-dark mb-3">
            Ready to Revive Your Vitality?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the pack that's right for you and start your journey to better wellness today. Free shipping on orders over $50!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {purchaseOptions.map(option => (
                 <div key={option.id} className={`relative bg-white p-6 rounded-lg shadow-md border ${option.bestValue ? 'border-brand-yellow border-2' : 'border-gray-200'} flex flex-col`}>
                    {option.bestValue && (
                        <div className="absolute -top-3 right-4 bg-brand-yellow text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            Best Value
                        </div>
                    )}
                    <h3 className="text-xl font-semibold text-brand-green-dark mb-2 text-center mt-2">{option.name}</h3>
                    <p className="text-gray-600 text-sm text-center mb-4">{option.description}</p>
                    <p className="text-3xl font-bold text-gray-800 text-center my-4 flex-grow flex items-center justify-center">{option.price}</p>
                    <p className="text-center text-sm text-gray-500 mb-6 h-8">{option.note}</p> { /* Fixed height to help alignment */}
                    <Button
                        onClick={() => handlePurchase(option.id)}
                        // Use green for best value, red otherwise
                        variant={option.bestValue ? 'secondary' : 'primary'}
                        size="md"
                        className="w-full mt-auto"
                        ariaLabel={`Select ${option.name} - ${option.price}`}
                    >
                        {option.id === 'monthly' ? 'Subscribe & Save' : 'Add to Cart'}
                    </Button>
                 </div>
            ))}
        </div>

         {/* Placeholder for Stripe Elements integration */}
         {/* <div className="mt-12 max-w-md mx-auto">
             <h3 className="text-lg font-medium text-center text-gray-700 mb-4">Secure Checkout powered by Stripe</h3>
             <Elements stripe={stripePromise}>
                 <CheckoutForm />
             </Elements>
         </div> */}
          <p className="text-center text-sm text-gray-500 mt-8">Money-back guarantee on your first order.</p>
      </div>
    </section>
  );
};

export default CallToActionSection; 