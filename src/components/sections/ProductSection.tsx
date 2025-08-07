'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ProductCard from '@/components/ui/ProductCard';
import { useCart } from '@/context/CartContext';

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  description?: string;
  benefits?: string[];
};

const products: Product[] = [
  {
    id: 'red-beet-heat',
    name: 'Red Beet Heat',
    price: '$12.99',
    image: '/images/site pics/Red Beet Heat Finished.png',
    category: 'Energy',
    description: 'A powerful energy shot with organic red beet, cayenne, and B vitamins to enhance physical performance and mental focus.',
    benefits: ['Boosts blood flow', 'Enhances workout performance', 'Improves endurance']
  },
  {
    id: 'manuka-honey',
    name: 'Manuka Honey Boost',
    price: '$14.99',
    image: '/images/site pics/Manuka Honey Finished.png',
    category: 'Immunity',
    description: 'Premium Manuka honey blended with echinacea and elderberry to support your immune system year-round.',
    benefits: ['Supports immune function', 'Soothes sore throat', 'Rich in antioxidants']
  },
  {
    id: 'vitality-boost',
    name: 'Vitality Boost',
    price: '$13.99',
    image: '/images/product-vitality.png',
    category: 'Wellness',
    description: 'Our signature wellness formula with ginseng, maca root and essential B vitamins to restore energy and vitality.',
    benefits: ['Combats fatigue', 'Improves mental clarity', 'Enhances overall wellness']
  },
  {
    id: 'turmeric-ginger',
    name: 'Turmeric Ginger',
    price: '$12.99',
    image: '/images/product-turmeric.png',
    category: 'Anti-inflammatory',
    description: 'A potent blend of turmeric, ginger and black pepper to fight inflammation and support joint health.',
    benefits: ['Reduces inflammation', 'Supports joint mobility', 'Aids digestion']
  },
  {
    id: 'green-detox',
    name: 'Green Detox',
    price: '$13.99',
    image: '/images/product-green.png',
    category: 'Cleanse',
    description: 'A cleansing blend of spirulina, chlorella, wheatgrass and mint to support your body\'s natural detoxification.',
    benefits: ['Supports detoxification', 'Alkalizes the body', 'Rich in chlorophyll']
  }
];

// Extract unique categories for filtering
const categories = ['All', ...Array.from(new Set(products.map(product => product.category)))];

const ProductSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCart();
  
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);
  
  const openQuickView = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsModalOpen(true);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
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
  
  const closeModal = () => {
    setIsModalOpen(false);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };
  
  return (
    <section id="shop" className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <h2 className="section-title">Best Selling Products</h2>
        
        {/* Category filters */}
        <div className="flex justify-center mb-12 space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-xs tracking-wider uppercase transition-colors duration-200 ${
                activeCategory === category
                  ? 'bg-brand-dark text-white'
                  : 'bg-brand-beige text-brand-dark hover:bg-brand-cream'
              }`}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
              description={product.description}
              onQuickView={openQuickView}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No products found in this category.</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <button className="btn-outline" aria-label="View all products">
            View All Products
          </button>
        </div>
      </div>
      
      {/* Quick View Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full rounded-lg overflow-hidden relative max-h-[90vh] flex flex-col">
            <button 
              onClick={closeModal} 
              className="absolute right-4 top-4 z-10"
              aria-label="Close quick view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="overflow-auto p-6 flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 flex items-center justify-center bg-brand-beige rounded-lg p-8">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  width={200}
                  height={300}
                  className="object-contain"
                />
              </div>
              
              <div className="md:w-1/2">
                <p className="text-sm text-brand-brown uppercase tracking-wider mb-2">{selectedProduct.category}</p>
                <h3 className="text-2xl font-medium text-brand-dark mb-2">{selectedProduct.name}</h3>
                <p className="text-xl font-medium text-brand-dark mb-4">{selectedProduct.price}</p>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                  
                  {selectedProduct.benefits && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Benefits:</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-600">
                        {selectedProduct.benefits.map((benefit, index) => (
                          <li key={index} className="mb-1">{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex border border-gray-300">
                    <button className="px-3 py-2 border-r border-gray-300">-</button>
                    <span className="px-4 py-2">1</span>
                    <button className="px-3 py-2 border-l border-gray-300">+</button>
                  </div>
                  <button 
                    className="btn-primary flex-grow"
                    onClick={() => handleAddToCart(selectedProduct.id)}
                    aria-label={`Add ${selectedProduct.name} to cart`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductSection; 