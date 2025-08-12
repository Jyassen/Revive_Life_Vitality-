'use client'; // Needed for DOM interaction (scrollIntoView)

import React, { useState } from 'react';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  const [isPromoVisible, setIsPromoVisible] = useState(true);
  
  const handlePromoClose = () => {
    setIsPromoVisible(false);
  };
  
  const handleShopNowClick = () => {
    console.log('Shop Now button clicked!');
    // Find the purchase options section and scroll to it
    const purchaseSection = document.getElementById('purchase-options');
    if (purchaseSection) {
      console.log('Found purchase section, scrolling...');
      purchaseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn('Purchase options section (#purchase-options) not found for scrolling.');
      // Fallback - try to find any purchase-related section
      const fallbackSection = document.querySelector('[id*="purchase"], [id*="shop"]');
      if (fallbackSection) {
        console.log('Using fallback section for scrolling');
        fallbackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleLearnMoreClick = () => {
    console.log('Learn More button clicked!');
    // Find the comparison section and scroll to it
    const comparisonSection = document.getElementById('comparison');
    if (comparisonSection) {
      console.log('Found comparison section, scrolling...');
      comparisonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn('Comparison section (#comparison) not found for scrolling.');
      // Fallback - try to find any comparison or about section
      const fallbackSection = document.querySelector('[id*="comparison"], [id*="about"]');
      if (fallbackSection) {
        console.log('Using fallback section for scrolling');
        fallbackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
      
      <section className="relative min-h-screen flex items-center pt-20 pb-16 bg-gradient-to-br from-brand-beige to-brand-cream overflow-hidden">
        <div className="container-custom">
          {/* Mobile Layout: Title -> Image -> Content */}
          <div className="lg:hidden">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-normal text-brand-dark leading-tight font-playfair">
                Small Shots,<br /><span className="text-brand-brown">Big Vitality</span>
              </h1>
            </div>
            
            {/* Mobile Image */}
            <div className="relative flex justify-center items-center mb-8 animate-slide-up">
              <div className="relative h-[400px] w-full max-w-md mx-auto">
                <Image
                  src="/images/Hero_Final.png"
                  alt="Revive Life Vitality wellness shot bottles"
                  fill
                  priority
                  className="object-contain relative z-10"
                  sizes="100vw"
                />
              </div>
            </div>

            {/* Mobile Content */}
            <div className="text-center animate-fade-in">
              <p className="text-gray-700 mb-8 text-base md:text-lg leading-relaxed">
                Two potent 2oz shots - crafted by nutritionists from organic superfoods - to energize your body and fortify your immunity. All organic. Zero junk. Real results.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
                <button 
                  onClick={handleShopNowClick}
                  className="btn-primary px-8 py-4 text-base hover:scale-105 transform transition-all duration-200"
                  aria-label="Shop now for wellness shots"
                >
                  Shop Now
                </button>
                <button 
                  onClick={handleLearnMoreClick}
                  className="btn-outline px-8 py-4 text-base hover:scale-105 transform transition-all duration-200"
                  aria-label="Learn more about why Revive stands out"
                >
                  Learn More
                </button>
              </div>
              
              {/* Mobile Feature Icons */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-6 italic">
                  Our formula is the result of meticulous research, combining ancient herbal wisdom with modern nutritional science.
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="flex items-center justify-center sm:justify-start">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-brand-brown">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">100% Organic</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-brand-brown">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Cold-Pressed</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-brand-brown">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Science-Backed</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-brand-brown">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">No Added Sugar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout: Side by Side */}
          <div className="hidden lg:grid grid-cols-2 gap-12 items-center">
            {/* Desktop Text Content */}
            <div className="z-10 relative animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-brand-dark leading-tight mb-8 font-playfair">
                Small Shots,<br /><span className="text-brand-brown">Big Vitality</span>
              </h1>
              <p className="text-gray-700 mb-10 max-w-lg text-base md:text-lg leading-relaxed">
                Two potent 2oz shots - crafted by nutritionists from organic superfoods - to energize your body and fortify your immunity. All organic. Zero junk. Real results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button 
                  onClick={handleShopNowClick}
                  className="btn-primary px-8 py-4 text-base hover:scale-105 transform transition-all duration-200"
                  aria-label="Shop now for wellness shots"
                >
                  Shop Now
                </button>
                <button 
                  onClick={handleLearnMoreClick}
                  className="btn-outline px-8 py-4 text-base hover:scale-105 transform transition-all duration-200"
                  aria-label="Learn more about why Revive stands out"
                >
                  Learn More
                </button>
              </div>
              
              {/* Desktop Feature Icons */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-6 italic max-w-md">
                  Our formula is the result of meticulous research, combining ancient herbal wisdom with modern nutritional science.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-brand-brown">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">100% Organic</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-brand-brown">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Cold-Pressed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-brand-brown">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Science-Backed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-brand-brown">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">No Added Sugar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Featured Product Image */}
            <div className="relative flex justify-center items-center lg:justify-end animate-slide-up">
              <div className="relative h-[600px] w-full max-w-xl mx-auto lg:mr-0">
                <Image
                  src="/images/Hero_Final.png"
                  alt="Revive Life Vitality wellness shot bottles"
                  fill
                  priority
                  className="object-contain relative z-10"
                  sizes="50vw"
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