'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

type Ingredient = {
  name: string;
  benefit: string;
  image: string;
};

const ingredients: Ingredient[] = [
  {
    name: 'Red and Golden Beets',
    benefit: 'Rich in nitrates to boost nitric oxide and improve circulation & endurance. Packed with antioxidants to support heart health and athletic performance.',
    image: '/images/red_and_golden_beets.jpg'
  },
  {
    name: 'Cayenne Peppers',
    benefit: 'Contains capsaicin to kickstart metabolism and increase calorie burn. A powerful metabolism booster that improves circulation and supports cardiovascular health.',
    image: '/images/cayenne_peppers.jpg'
  },
  {
    name: 'Turmeric',
    benefit: 'Powerful anti-inflammatory; curcumin helps reduce inflammation and supports recovery. Used for centuries in traditional medicine for its healing properties.',
    image: '/images/turmeric.jpg'
  },
  {
    name: 'Ginger',
    benefit: 'Natural immune booster and digestive aid that fights infections and soothes the stomach. Helps reduce inflammation, nausea, and supports overall wellness.',
    image: '/images/ginger.jpg'
  },
  {
    name: 'Manuka Honey',
    benefit: 'Rare New Zealand honey with potent antibacterial properties, helps fight bad bacteria and soothe the throat. A natural immune system supporter with antimicrobial benefits.',
    image: '/images/manuka_honey.jpg'
  },
  {
    name: 'Wheatgrass',
    benefit: 'Packed with nutrients including vitamins A, C, E, iron, magnesium, and amino acids. A powerful detoxifier that helps alkalize the body and boost red blood cell production.',
    image: '/images/wheatgrass.jpg'
  },
  {
    name: 'Mint Leaves',
    benefit: 'Refreshing herb that aids digestion, reduces inflammation, and provides natural breath freshening. Contains menthol that helps relieve headaches and digestive discomfort.',
    image: '/images/mint_leaves.jpg'
  },
  {
    name: 'Lemons',
    benefit: 'Rich in vitamin C and antioxidants that strengthen immunity and promote healthy skin. The natural acidity helps with digestion and balances the body\'s pH levels.',
    image: '/images/lemons.jpg'
  }
];

const IngredientSpotlightSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Set initial refs array
    imageRefs.current = imageRefs.current.slice(0, ingredients.length);
    
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const sectionTop = sectionRef.current.getBoundingClientRect().top;
      const scrollY = window.scrollY;
      
      imageRefs.current.forEach((imageDiv, index) => {
        if (!imageDiv) return;
        
        const rect = imageDiv.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const distance = scrollY - elementTop;
        const speed = 0.15; // Adjust for faster or slower parallax
        
        // Only apply parallax if the element is in view
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const translateY = distance * speed;
          imageDiv.style.transform = `translateY(${translateY}px) scale(1.1)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial positioning
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <h2 className="text-4xl md:text-5xl font-medium text-center text-brand-dark mb-6">Powered by Organic Ingredients</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          We believe in the power of real ingredients. Here's a look at the superfoods inside each Revive shot – and what they do for you.
        </p>

        <div>
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className={`relative mx-auto w-[90%] md:w-[80%] h-[400px] overflow-hidden${index !== ingredients.length - 1 ? ' border-b border-white/30' : ''}`}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0"
                ref={el => { imageRefs.current[index] = el; }}
              >
                <Image
                  src={ingredient.image}
                  alt={ingredient.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 80vw"
                />
                {/* Light gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              
              {/* Centered Text Content */}
              <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3 text-white">
                <h3 className="text-3xl md:text-4xl font-normal mb-4">{ingredient.name}</h3>
                <p className="text-lg md:text-xl">{ingredient.benefit}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 italic">
            No fillers, no chemicals – just pure plants and nutrients working synergistically to fuel you.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IngredientSpotlightSection; 