'use client';

import React from 'react';
import Image from 'next/image';

type GalleryItem = {
  id: string;
  image: string;
  title: string;
  link: string;
};

const galleryItems: GalleryItem[] = [
  {
    id: 'immunity-boost',
    image: '/images/gallery-immunity.jpg',
    title: 'Immunity Boost',
    link: '#shop'
  },
  {
    id: 'daily-energy',
    image: '/images/gallery-energy.jpg',
    title: 'Daily Energy',
    link: '#shop'
  },
  {
    id: 'natural-detox',
    image: '/images/gallery-detox.jpg',
    title: 'Natural Detox',
    link: '#shop'
  }
];

const GallerySection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <h2 className="section-title">Beauty Gallery</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg">
              <div className="relative h-80 md:h-96">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill={true}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-medium text-white mb-3">{item.title}</h3>
                  <a 
                    href={item.link} 
                    className="inline-block text-white border-b border-white pb-1 hover:border-brand-cream transition-colors"
                    aria-label={`View ${item.title}`}
                  >
                    View More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="#shop" className="btn-outline" aria-label="View all gallery items">
            View All
          </a>
        </div>
      </div>
    </section>
  );
};

export default GallerySection; 