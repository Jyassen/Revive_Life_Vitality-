'use client';

import React from 'react';
import Image from 'next/image';

type ProductFeatureProps = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  benefits: string[];
  price: string;
  image: string;
  backgroundColor: string;
};

const ProductFeature: React.FC<ProductFeatureProps> = ({
  id,
  name,
  tagline,
  description,
  benefits,
  price,
  image,
  backgroundColor,
}) => {
  const handleAddToCart = () => {
    console.log(`Adding ${id} to cart`);
    // TODO: Implement actual cart functionality
  };

  return (
    <div className="w-full md:w-1/2 p-4">
      <div className={`h-full flex flex-col ${backgroundColor} rounded-lg shadow-sm p-6`}>
        {/* Product Image */}
        <div className="relative h-[300px] flex items-center justify-center mb-6">
          <Image
            src={image}
            alt={name}
            width={220}
            height={350}
            className="object-contain"
          />
        </div>

        {/* Product Info */}
        <div>
          <h2 className="text-2xl font-medium text-brand-dark mb-2">{tagline}</h2>
          <h3 className="text-lg text-brand-brown mb-4">{name}</h3>
          <p className="text-gray-600 mb-6 text-sm">{description}</p>
          
          <h4 className="font-medium text-brand-dark mb-3">Key Benefits:</h4>
          <ul className="space-y-2 mb-8">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-brand-brown mr-2">•</span>
                <span className="text-gray-600 text-sm">{benefit}</span>
              </li>
            ))}
          </ul>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto">
            <span className="text-xl font-medium text-brand-dark">{price}</span>
            <button 
              onClick={handleAddToCart}
              className="btn-primary py-3 px-8"
              aria-label={`Add ${name} to cart`}
            >
              Add to Cart
            </button>
            <span className="text-sm text-gray-500">100% Money-back guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Combined Products Section
export const ProductFeaturesSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="flex flex-wrap -mx-4">
          <ProductFeature
            id="red-beet-heat"
            name="Red Beet Heat – Energizing Wellness Shot"
            tagline="Naturally Fire Up Your Energy"
            description="Meet Red Beet Heat – a 2oz powerhouse that gives you a natural pre-workout kick. This ruby-red shot blends organic beets, ginger, and a dash of cayenne for a spicy kick. Formulated to boost circulation and metabolism, it's perfect for an afternoon slump or a gym session. No jitters, no crash – just plant-powered vitality. Earthy-sweet with a zesty bite, you'll feel the invigorating kick in minutes."
            benefits={[
              "Energy & Stamina: Increases blood flow for improved endurance (thanks to nitrate-rich beets)",
              "Metabolism Boost: Naturally boosts metabolism with cayenne & ginger for calorie burn",
              "Post-Workout Recovery: Fights inflammation with turmeric and antioxidants, aiding recovery"
            ]}
            price="$4.99"
            image="/images/site pics/Red Beet Heat Finished.png"
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
            price="$4.99"
            image="/images/site pics/Manuka Honey Finished.png"
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
            description="Meet Red Beet Heat – a 2oz powerhouse that gives you a natural pre-workout kick. This ruby-red shot blends organic beets, ginger, and a dash of cayenne for a spicy kick. Formulated to boost circulation and metabolism, it's perfect for an afternoon slump or a gym session. No jitters, no crash – just plant-powered vitality. Earthy-sweet with a zesty bite, you'll feel the invigorating kick in minutes."
            benefits={[
              "Energy & Stamina: Increases blood flow for improved endurance (thanks to nitrate-rich beets)",
              "Metabolism Boost: Naturally boosts metabolism with cayenne & ginger for calorie burn",
              "Post-Workout Recovery: Fights inflammation with turmeric and antioxidants, aiding recovery"
            ]}
            price="$4.99"
            image="/images/site pics/Red Beet Heat Finished.png"
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
            price="$4.99"
            image="/images/site pics/Manuka Honey Finished.png"
            backgroundColor="bg-brand-beige"
          />
        </div>
      </div>
    </section>
  );
}; 