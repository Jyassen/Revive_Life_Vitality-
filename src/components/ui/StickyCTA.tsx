'use client';

import React, { useState, useEffect } from 'react';

const StickyCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past hero section (roughly 100vh)
      const scrollPosition = window.scrollY;
      const shouldShow = scrollPosition > window.innerHeight * 0.8;
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial scroll position
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const purchaseSection = document.getElementById('purchase-options');
    if (purchaseSection) {
      purchaseSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
      <button
        onClick={handleClick}
        className="group bg-brand-brown hover:bg-brand-brown/90 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-brown/50 focus:ring-offset-2"
        aria-label="Shop wellness shots now"
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm">Shop Now</span>
          <svg 
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default StickyCTA;