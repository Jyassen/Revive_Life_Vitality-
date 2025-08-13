'use client'; // Needed for DOM interaction (scrollIntoView) in button handler

import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button'; // Updated path alias
import ProductCard from '@/components/ui/ProductCard';
import { useCart } from '@/context/CartContext';

const products = [
  {
    id: 'red-beet-heat',
    name: 'Red Beet Heat',
    price: '$12.99',
    category: 'Energy',
    image: '/images/site pics/Red Beet Heat Finished.png',
    description: 'Fuel your workouts and power through the day with Red Beet Heat, a 2oz natural pre-workout shot packed with organic beets, ginger, turmeric, and cayenne. Formulated to boost circulation and metabolism, it\'s perfect for an afternoon slump or a gym session. No jitters, no crash – just plant-powered vitality. Earthy-sweet with a zesty bite, you\'ll feel the invigorating kick in minutes.',
    benefits: [
      'Energy & Circulation Boost',
      'Supports Healthy Blood Flow (Nitrates)',
      'Metabolism-Boosting Kick (Cayenne)',
      'Anti-inflammatory Support (Turmeric & Ginger)',
      'Ideal Pre-Workout or Pick-Me-Up',
    ],
    bgColor: 'bg-red-50', // Light red background
    textColor: 'text-red-600',
  },
  {
    id: 'vitality-boost',
    name: 'Vitality Boost',
    price: '$13.99',
    category: 'Wellness',
    image: '/images/product-vitality.png',
    description: 'A revitalizing blend of leafy greens, adaptogens, and essential nutrients designed to enhance your natural energy levels and promote overall wellness.',
    benefits: [
      'Natural Energy Enhancement',
      'Stress Reduction & Adaptation',
      'Nutrient-Dense Superfood Blend',
      'Supports Mental Clarity',
      'Perfect Daily Wellness Ritual',
    ],
    bgColor: 'bg-green-50', // Light green background
    textColor: 'text-brand-green',
  },
  {
    id: 'manuka-honey-immune',
    name: 'Manuka Honey Immune Boost',
    price: '$14.99',
    category: 'Immunity',
    image: '/images/site pics/Manuka Honey Finished.png',
    description: 'A nurturing, golden blend featuring Manuka Honey, Golden Beets, Turmeric, Ginger, Mint, Wheatgrass, and Lemon Juice. Formulated to fortify the immune system.',
    benefits: [
      'Immune Support & Wellness Maintenance',
      'Potent Antibacterial Activity (Manuka Honey)',
      'Supports Circulation (Golden Beets)',
      'Soothes Digestion (Ginger & Mint)',
      'Delicious Daily Defense Elixir',
    ],
    bgColor: 'bg-yellow-50', // Light yellow/gold background
    textColor: 'text-yellow-600',
  },
];

// Additional products to showcase in a grid at the bottom
const additionalProducts = [
  {
    id: 'turmeric-ginger',
    name: 'Turmeric Ginger',
    price: '$12.99',
    image: '/images/product-turmeric.png',
    category: 'Anti-inflammatory',
    description: 'A potent blend of turmeric, ginger and black pepper to fight inflammation and support joint health.'
  },
  {
    id: 'green-detox',
    name: 'Green Detox',
    price: '$13.99',
    image: '/images/product-green-juice.png',
    category: 'Cleanse',
    description: 'A cleansing blend of spirulina, chlorella, wheatgrass and mint to support your body\'s natural detoxification.'
  },
  {
    id: 'immunity-booster',
    name: 'Immunity Booster',
    price: '$14.99',
    image: '/images/product-immunity.png',
    category: 'Immunity',
    description: 'A powerful blend of vitamin C, zinc, elderberry and echinacea to strengthen your immune system.'
  }
];

const ProductShowcaseSection: React.FC = () => {
  const { addItem } = useCart();

  const handleAddToCart = (productId: string) => {
    // Find product in either the main products array or additional products
    const product = products.find(p => p.id === productId) || 
                   additionalProducts.find(p => p.id === productId);
    
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      });
    }
  };

  const handleQuickView = (productId: string) => {
    console.log(`Quick view clicked for ${productId}`);
    // In a real app, this would show a modal with product details
  };

  return (
    <section id="products" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-green mb-3">
                Our Signature Elixirs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Potent blends, meticulously crafted for your daily vitality.
            </p>
        </div>

        {/* Featured products with alternating layout */}
        {products.map((product, index) => (
          <div key={product.id} className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${product.bgColor} p-8 rounded-lg shadow-sm`}>
            {/* Image - alternate sides */}
            <div className={`relative h-80 md:h-96 ${index % 2 === 0 ? 'md:order-last' : ''}`}>
              <Image
                src={product.image}
                alt={`${product.name} wellness shot bottle`}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Text Content */}
            <div className={index % 2 === 0 ? 'md:order-first' : ''}>
              <h3 className={`text-3xl font-bold mb-3 ${product.textColor}`}>
                {product.name}
              </h3>
              <p className="text-gray-700 mb-6">
                {product.description}
              </p>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Key Benefits:</h4>
              <ul className="space-y-2 mb-8">
                {product.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start">
                    <svg className={`flex-shrink-0 h-5 w-5 mr-2 ${product.textColor}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleAddToCart(product.id)}
                variant={product.id === 'red-beet-heat' ? 'primary' : 'secondary'} // Use red for beet, green for immune
                size="md"
                ariaLabel={`Add ${product.name} to cart`}
              >
                Add to Cart
              </Button>
               <p className="text-sm text-gray-500 mt-3">Only 50-54 calories per shot, no added sugar.</p>
            </div>
          </div>
        ))}

        {/* Additional Products Section */}
        <div className="mt-20 pt-10 border-t border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-3">
              More Products You&apos;ll Love
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our complete range of wellness shots for every need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
                description={product.description}
                onQuickView={handleQuickView}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button
              onClick={() => {
                const shopSection = document.getElementById('shop');
                if (shopSection) {
                  shopSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              variant="outline"
              size="md"
              ariaLabel="View all products"
            >
              View All Products
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseSection; 