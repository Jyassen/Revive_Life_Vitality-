'use client'; // Needed for DOM interaction (scrollIntoView)

import React, { useState } from 'react';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  const [isPromoVisible, setIsPromoVisible] = useState(true);
  
  const handlePromoClose = () => {
    setIsPromoVisible(false);
  };
  
  const handleShopNowClick = () => {
    // Find the shop section and scroll to it
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn('Shop section (#shop) not found for scrolling.');
    }
  };

  return (
    <>
      {isPromoVisible && (
        <div className="bg-brand-brown text-white py-2 px-4 text-center relative">
          <p className="text-sm">
            <span className="font-medium">15% OFF</span> your first order with code{' '}
            <span className="font-bold tracking-wider">REVIVEME</span>
          </p>
          <button 
            onClick={handlePromoClose}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
            aria-label="Close promotion banner"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      <section className="pt-8 pb-0 bg-brand-beige overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="z-10 relative">
              <h1 className="text-3xl md:text-4xl font-normal text-brand-dark leading-tight mb-6 font-serif">
                Small Shots, Big Vitality
              </h1>
              <p className="text-gray-600 mb-8 max-w-md text-sm">
                Two potent 2oz shots — crafted by nutritionists from organic superfoods — to energize your body and fortify your immunity. All organic. Zero junk. Real results.
              </p>
              <button 
                onClick={handleShopNowClick}
                className="btn-primary mb-8"
                aria-label="Shop now for wellness shots"
              >
                shop now
              </button>
              
              {/* Feature Icons */}
              <div className="mt-2 mb-6">
                <p className="text-sm text-gray-500 mb-5 italic">
                  Our formula is the result of meticulous research, combining ancient herbal wisdom with modern nutritional science.
                </p>
                <div className="flex flex-wrap gap-y-4">
                  <div className="flex items-center w-1/2">
                    <div className="w-8 h-8 bg-brand-cream rounded-full flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4 text-brand-brown">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700 uppercase tracking-wide">100% Organic</span>
                  </div>
                  <div className="flex items-center w-1/2">
                    <div className="w-8 h-8 bg-brand-cream rounded-full flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4 text-brand-brown">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700 uppercase tracking-wide">Cold-Pressed</span>
                  </div>
                  <div className="flex items-center w-1/2">
                    <div className="w-8 h-8 bg-brand-cream rounded-full flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4 text-brand-brown">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700 uppercase tracking-wide">Science-Backed</span>
                  </div>
                  <div className="flex items-center w-1/2">
                    <div className="w-8 h-8 bg-brand-cream rounded-full flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4 text-brand-brown">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700 uppercase tracking-wide">No Added Sugar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Product Image */}
            <div className="relative flex justify-center items-center md:justify-end">
              <div className="relative h-[550px] w-full max-w-lg mx-auto md:mr-0">
                <Image
                  src="/images/hero.png"
                  alt="Revive Life Vitality wellness shot bottles"
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection; 