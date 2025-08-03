'use client';

import React from 'react';
import Image from 'next/image';

type ProductFeatureProps = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  benefits: string[];
  image: string;
  backgroundColor: string;
};

const ProductFeature: React.FC<ProductFeatureProps> = ({
  id,
  name,
  tagline,
  description,
  benefits,
  image,
  backgroundColor,
}) => {

  const cardClassName = `h-full flex flex-col ${backgroundColor} rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 p-4 lg:p-6 group`;

  return (
    <div className="w-full flex-1 p-4">
      <div className={cardClassName}>
        {/* Header Section */}
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-playfair font-normal text-brand-dark mb-2 leading-tight">{tagline}</h2>
          <h3 className="text-base md:text-lg text-brand-brown mb-3 font-medium">{name}</h3>
        </div>

        {/* Image and Text Layout */}
        <div className="mb-4 overflow-hidden">
          {/* Product Image */}
          <div className="relative h-[260px] w-full lg:w-[320px] lg:h-[260px] float-left mr-6 mb-4">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover rounded-xl relative z-10 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </div>

          {/* Product Description wrapping around image */}
          <div className="text-gray-700 text-sm md:text-base leading-relaxed">
            <p>{description}</p>
          </div>
          
          {/* Clear float and add button */}
          <div className="clear-both pt-4">
            <a 
              href="#purchase-options"
              className="btn-primary inline-block text-center px-6 py-3 text-sm font-medium"
              aria-label={`Get ${name} now`}
            >
              Shop Now
            </a>
          </div>
        </div>

        {/* Key Benefits Section - Full Width */}
        <div className="w-full">
          <h4 className="font-medium text-brand-dark mb-3 text-base">Key Benefits:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {benefits.map((benefit, index) => {
              const [title, description] = benefit.includes(':') ? benefit.split(': ') : [benefit, ''];
              let icon;
              
              // Choose icon based on benefit type
              if (title.toLowerCase().includes('clean energy')) {
                icon = (
                  <svg className="w-6 h-6 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                );
              } else if (title.toLowerCase().includes('energy') || title.toLowerCase().includes('stamina')) {
                icon = (
                  <svg className="w-6 h-6 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                );
              } else if (title.toLowerCase().includes('metabolism') || title.toLowerCase().includes('boost')) {
                icon = (
                  <svg className="w-6 h-6 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                );
              } else if (title.toLowerCase().includes('recovery') || title.toLowerCase().includes('workout')) {
                icon = (
                  <svg className="w-6 h-6 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                );
              } else if (title.toLowerCase().includes('immune')) {
                icon = (
                  <svg className="w-6 h-6 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                );
              } else if (title.toLowerCase().includes('gut') || title.toLowerCase().includes('throat') || title.toLowerCase().includes('sooth')) {
                icon = (
                  <svg className="w-6 h-6 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2M12 19v2M8 7h8a2 2 0 012 2v0a2 2 0 01-2 2H6a2 2 0 00-2 2v0a2 2 0 002 2h8a2 2 0 012 2v0a2 2 0 01-2 2H8" />
                  </svg>
                );
              } else if (title.toLowerCase().includes('clean') || title.toLowerCase().includes('natural')) {
                icon = (
                  <svg className="w-6 h-6 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L8 6h3v9l-3-3M12 2l4 4h-3v9l3-3M9 21h6" />
                  </svg>
                );
              } else {
                // Default icon
                icon = (
                  <svg className="w-6 h-6 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                );
              }
              
              return (
                <div key={index} className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    {icon}
                  </div>
                  <div>
                    <h5 className="font-medium text-brand-dark text-sm mb-0.5">{title}</h5>
                    {description && (
                      <p className="text-gray-600 text-xs leading-relaxed">{description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Combined Products Section
export const ProductFeaturesSection: React.FC = () => {
  return (
    <section id="shop" className="section-padding bg-gradient-to-b from-white to-brand-cream/20">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title text-brand-dark mb-4">
            Our <span className="text-gradient">Signature</span> Wellness Shots
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Two powerful formulations designed to elevate your daily wellness routine
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <ProductFeature
            id="red-beet-heat"
            name="Red Beet Heat – Energizing Wellness Shot"
            tagline="Naturally Fire Up Your Energy"
            description="Meet Red Beet Heat – a 2oz powerhouse that gives you a natural pre-workout kick. This nutritious red shot blends organic beets, ginger, and a dash of cayenne for a spicy kick. Formulated to boost circulation and metabolism, it's perfect for an afternoon slump or a gym session. No jitters, no crash – just plant-powered vitality. Earthy-sweet with a zesty bite, you'll feel the invigorating kick in minutes."
            benefits={[
              "Energy & Stamina: Increases blood flow for improved endurance (thanks to nitrate-rich beets)",
              "Metabolism Boost: Naturally boosts metabolism with cayenne & ginger for calorie burn",
              "Post-Workout Recovery: Fights inflammation with turmeric and antioxidants, aiding recovery"
            ]}
            image="/images/Red Beet Heat Nice.png"
            backgroundColor="bg-white"
          />
          <ProductFeature
            id="manuka-honey"
            name="Manuka Honey Immune Boost – Immune Support Shot"
            tagline="Your Daily Immunity Shield"
            description="Manuka Honey Immune Boost is your delicious daily defense. Made with genuine Manuka honey, revered for its natural antibacterial power, plus golden beets, turmeric and wheatgrass. This golden shot fortifies your immune system and reduces inflammation, helping you stay healthy year-round. Slightly sweet and soothing, with a zing of ginger – it's the tasty way to get your antioxidants and vitamins."
            benefits={[
              "Immune Support: Strengthens immunity with high-potency antioxidants (turmeric, wheatgrass) and antibacterial Manuka",
              "Gut & Throat Soothing: Soothes the gut and throat – ginger and honey calm digestion and irritation",
              "Clean Energy: Natural energy and focus from B-vitamins in wheatgrass and vitamin C in lemon, without caffeine"
            ]}
            image="/images/Manuka Honey Nice.png"
            backgroundColor="bg-brand-beige"
          />
        </div>
      </div>
    </section>
  );
};

// Keeping individual exports for backward compatibility
export const RedBeetHeatFeature: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="flex flex-wrap -mx-4">
          <ProductFeature
            id="red-beet-heat"
            name="Red Beet Heat – Energizing Wellness Shot"
            tagline="Naturally Fire Up Your Energy"
            description="Meet Red Beet Heat – a 2oz powerhouse that gives you a natural pre-workout kick. This nutritious red shot blends organic beets, ginger, and a dash of cayenne for a spicy kick. Formulated to boost circulation and metabolism, it's perfect for an afternoon slump or a gym session. No jitters, no crash – just plant-powered vitality. Earthy-sweet with a zesty bite, you'll feel the invigorating kick in minutes."
            benefits={[
              "Energy & Stamina: Increases blood flow for improved endurance (thanks to nitrate-rich beets)",
              "Metabolism Boost: Naturally boosts metabolism with cayenne & ginger for calorie burn",
              "Post-Workout Recovery: Fights inflammation with turmeric and antioxidants, aiding recovery"
            ]}
            image="/images/Red Beet Heat Nice.png"
            backgroundColor="bg-white"
          />
        </div>
      </div>
    </section>
  );
};

export const ManukaHoneyFeature: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-brand-beige">
      <div className="container-custom">
        <div className="flex flex-wrap -mx-4">
          <ProductFeature
            id="manuka-honey"
            name="Manuka Honey Immune Boost – Immune Support Shot"
            tagline="Your Daily Immunity Shield"
            description="Manuka Honey Immune Boost is your delicious daily defense. Made with genuine Manuka honey, revered for its natural antibacterial power, plus golden beets, turmeric and wheatgrass. This golden shot fortifies your immune system and reduces inflammation, helping you stay healthy year-round. Slightly sweet and soothing, with a zing of ginger – it's the tasty way to get your antioxidants and vitamins."
            benefits={[
              "Immune Support: Strengthens immunity with high-potency antioxidants (turmeric, wheatgrass) and antibacterial Manuka",
              "Gut & Throat Soothing: Soothes the gut and throat – ginger and honey calm digestion and irritation",
              "Clean Energy: Natural energy and focus from B-vitamins in wheatgrass and vitamin C in lemon, without caffeine"
            ]}
            image="/images/Manuka Honey Nice.png"
            backgroundColor="bg-brand-beige"
          />
        </div>
      </div>
    </section>
  );
}; 