'use client';

import React from 'react';
import Image from 'next/image';

const DailyRitualSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-brand-beige">
      <div className="container-custom">
        <h2 className="text-4xl md:text-5xl font-medium text-center text-brand-dark mb-6">Your Daily Vitality Ritual</h2>
        
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          No prep needed, no messy powders – just unscrew the cap, shoot it back, and go! Make
          Revive shots part of your daily wellness routine.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Morning: Immunity Card */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-medium text-brand-dark mb-4">Morning: Immunity</h3>
            
            <p className="text-gray-600 mb-6">
              Start your morning with Manuka Honey Immune Boost – on an
              empty stomach or with your breakfast smoothie. It's like your daily
              wellness shot to kickstart immunity.
            </p>
            
            <div className="relative h-[250px] w-full">
              <Image
                src="/images/morning-immunity-ritual.jpg"
                alt="Morning immunity shot ritual"
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          
          {/* Pre-workout Card */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-medium text-brand-dark mb-4">Pre-workout or Afternoon: Energy</h3>
            
            <p className="text-gray-600 mb-6">
              Use Red Beet Heat 30 minutes before a workout or whenever you
              need an energy lift. Feel that natural rush of stamina without
              reaching for coffee or energy drinks.
            </p>
            
            <div className="relative h-[250px] w-full">
              <Image
                src="/images/pre-workout-energy-ritual.jpg"
                alt="Pre-workout energy shot ritual"
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyRitualSection; 