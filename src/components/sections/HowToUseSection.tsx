'use client';

import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Refrigerate',
    description: 'Keep your shots cold and fresh in the refrigerator. Best enjoyed chilled.'
  },
  {
    number: '02',
    title: 'Shake Well',
    description: 'Give your shot a quick shake to mix all the ingredients for maximum potency.'
  },
  {
    number: '03',
    title: 'Shoot It Back',
    description: 'Unscrew the cap and take the entire shot at once for the full experience.'
  },
  {
    number: '04',
    title: 'Feel the Difference',
    description: 'Experience the benefits throughout your day. Best taken daily for optimal results.'
  }
];

const HowToUseSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <h2 className="text-4xl md:text-5xl font-medium text-center text-brand-dark mb-6">Simple to Use, Powerful Results</h2>
        
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16">
          Our wellness shots are designed for convenience and effectiveness. No mixing, no mess - just grab and go vitality.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-beige text-brand-dark text-2xl font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-medium text-brand-dark mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUseSection; 