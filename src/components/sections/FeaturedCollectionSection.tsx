'use client';

import React from 'react';
import Image from 'next/image';

type Collection = {
  id: string;
  name: string;
  image: string;
  description: string;
};

const collections: Collection[] = [
  {
    id: 'immunity-collection',
    name: 'Immunity Collection',
    image: '/images/collection-immunity.jpg',
    description: 'Strengthen your body\'s natural defenses with our immunity-boosting shots.'
  },
  {
    id: 'energy-collection',
    name: 'Energy Collection',
    image: '/images/collection-energy.jpg',
    description: 'Revitalize your energy levels naturally, without the crash of caffeine or sugar.'
  },
  {
    id: 'detox-collection',
    name: 'Cleanse Collection',
    image: '/images/collection-cleanse.jpg',
    description: 'Reset your system with our carefully formulated cleansing shots.'
  }
];

const FeaturedCollectionSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-brand-beige">
      <div className="container-custom">
        <h2 className="section-title">Featured Collections</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <div key={collection.id} className="group">
              <div className="relative h-80 overflow-hidden rounded-lg mb-4">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill={true}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-medium text-white mb-2">{collection.name}</h3>
                  <p className="text-sm text-white/80 mb-4">{collection.description}</p>
                  <button className="btn-outline bg-white/10 text-white border-white/20 hover:bg-white hover:text-brand-dark" aria-label={`Shop ${collection.name}`}>
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollectionSection; 