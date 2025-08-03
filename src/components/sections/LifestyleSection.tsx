'use client';

import React from 'react';
import Image from 'next/image';

type UsageStep = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const steps: UsageStep[] = [
  {
    title: "Chill & Shake",
    description: "Store your shots in the fridge. Give it a quick shake – this awakens all the ingredients.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    )
  },
  {
    title: "Shoot or Sip",
    description: "Take it in one go if you're brave, or sip slowly if you enjoy the taste. Either way, 2 ounces is gone in seconds.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 01-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    )
  },
  {
    title: "Feel the Boost",
    description: "Within minutes, feel rejuvenated – whether it's powering through a workout or staying focused at work.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    )
  }
];

const LifestyleSection: React.FC = () => {
  const handleShopNowClick = () => {
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-brand-beige">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">Your Daily Vitality Ritual</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            No prep needed, no messy powders – just unscrew the cap, shoot it back, and go! Make Revive shots part of your daily wellness routine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col">
            <h3 className="text-xl font-medium text-brand-dark mb-3">Morning: Immunity</h3>
            <p className="text-gray-600 mb-4 flex-shrink-0">
              Start your morning with <span className="font-medium">Manuka Honey Immune Boost</span> – on an empty stomach or with your breakfast smoothie. It&apos;s like your daily wellness shot to kickstart immunity.
            </p>
            <div className="relative w-full flex-grow">
              <Image
                src="/images/morning-immunity-ritual.jpg"
                alt="Morning immunity shot ritual"
                width={800}
                height={500}
                className="object-cover rounded-lg w-full h-full min-h-[280px]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col">
            <h3 className="text-xl font-medium text-brand-dark mb-3">Pre-workout or Afternoon: Energy</h3>
            <p className="text-gray-600 mb-4 flex-shrink-0">
              Use <span className="font-medium">Red Beet Heat</span> 30 minutes before a workout or whenever you need an energy lift. Feel that natural rush of stamina without reaching for coffee or energy drinks.
            </p>
            <div className="relative w-full flex-grow">
              <Image
                src="/images/pre-workout-energy-ritual.jpg"
                alt="Pre-workout energy shot ritual"
                width={800}
                height={500}
                className="object-cover rounded-lg w-full h-full min-h-[280px]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm mb-12">
          <h3 className="text-xl font-medium text-brand-dark text-center mb-8">How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-brand-brown">{step.icon}</div>
                </div>
                <h4 className="text-lg font-medium text-brand-dark mb-2">{index + 1}. {step.title}</h4>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg text-brand-dark mb-6">You&apos;ve got goals – we make them easier. Just a few seconds each day can build your immunity and fuel your workouts.</p>
          <button 
            onClick={handleShopNowClick}
            className="btn-primary py-3 px-8"
            aria-label="Shop for wellness shots"
          >
            Ready to make Revive shots part of your routine?
          </button>
        </div>
      </div>
    </section>
  );
};

export default LifestyleSection; 