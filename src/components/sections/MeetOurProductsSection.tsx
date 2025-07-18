'use client'; // Needed for DOM interaction (scrollIntoView)

import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button'; // Updated path alias

const MeetOurProductsSection: React.FC = () => {
  const handleShopAllClick = () => {
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.warn('Shop section (#shop) not found for scrolling.');
    }
  };

  return (
    // Added overflow-hidden to the parent section to contain the bleeding image
    <section className="bg-brand-off-white py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-green leading-tight mb-4">
            Meet Our Cold-Pressed Juices, Wellness Shots & Functional Blends.
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Each one hits more notes than Mariah and has more depth than your ex. It's just how we do things around here :)
          </p>
          <Button
            onClick={handleShopAllClick}
            variant="secondary" // Matches the green button in the sample image
            size="md"
            ariaLabel="Shop all Revive Life Vitality products"
            className="inline-flex items-center group"
          >
            Shop All
            <svg className="ml-2 -mr-1 w-5 h-5 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </div>

        {/* Image Content - Positioned to bleed off-screen slightly */}
        <div className="relative h-80 md:h-full min-h-[350px] md:min-h-[450px]">
            {/* Ensure meet-our-products-visual.png is in /public/images */}
            {/* Use a slightly larger image to allow for bleeding effect if needed */}
            <Image
                src="/images/meet-our-products-visual.png"
                alt="Fresh ingredients like kale, ginger, and lemon spilling out"
                fill
                style={{ objectFit: 'contain', objectPosition: 'center right' }} // Adjust object position
                sizes="(max-width: 768px) 100vw, 50vw"
            />
        </div>
      </div>
    </section>
  );
};

export default MeetOurProductsSection; 