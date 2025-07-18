'use client'; // Needed for DOM interaction (scrollIntoView)

import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button'; // Updated path alias

const WellnessShotsSection: React.FC = () => {
    const handleLearnMoreClick = () => {
        const ingredientsSection = document.getElementById('ingredients');
        if (ingredientsSection) {
          ingredientsSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.warn('Ingredients section (#ingredients) not found for scrolling.');
        }
    };

  return (
    <section className="bg-brand-beige py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className="relative flex justify-center h-80 md:h-auto">
          {/* Ensure wellness-shots-ingredients.png is in /public/images */}
          <Image
            src="/images/wellness-shots-ingredients.png"
            alt="Collage of wellness shot ingredients like ginger, turmeric, echinacea, pepper"
            width={500} // Adjust size as needed based on original image
            height={400} // Adjust size as needed based on original image
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Text Content */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-orange leading-tight mb-4 uppercase">
            Wellness Shots with all the Good Stuff, None of the Bad
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            We craft fresh pressed wellness shots from organic superfoods into a daily immunity boosting shot. It's a two ounce kick you need to be ready for anything!
          </p>
          <Button
            onClick={handleLearnMoreClick}
            variant="primary" // Matches the red button in the sample image
            size="lg"
            ariaLabel="Learn more about our wellness shot ingredients"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WellnessShotsSection; 