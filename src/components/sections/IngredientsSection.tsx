'use client'; // Needed for useState hook

import React, { useState } from 'react';

// Data based on PRD
const ingredients = [
  // TODO: Consider replacing placeholder icons with actual SVGs or images
  { name: 'Red Beets', benefit: 'Supports healthy blood flow & heart health (nitrates), aids liver detox.', icon: '🩸' },
  { name: 'Turmeric', benefit: 'Powerful anti-inflammatory & antioxidant (curcumin), supports brain health.', icon: '🧡' },
  { name: 'Ginger', benefit: 'Aids digestion, boosts immunity, anti-inflammatory properties.', icon: '🌿' },
  { name: 'Mint', benefit: 'Eases digestive issues (bloating, gas), refreshing flavor, helps clear sinuses.', icon: '🍃' },
  { name: 'Wheatgrass', benefit: 'Nutrient-dense detoxifier (chlorophyll, vitamins), supports immune function.', icon: '🌾' },
  { name: 'Cayenne Pepper', benefit: 'Metabolism booster (capsaicin), improves circulation.', icon: '🌶️' },
  { name: 'Lemon Juice', benefit: 'High in Vitamin C, aids digestion & detox, helps balance body pH.', icon: '🍋' },
  { name: 'Manuka Honey', benefit: 'Potent antibacterial activity (MGO), soothes throat, supports gut health.', icon: '🍯' },
  { name: 'Golden Beets', benefit: 'Similar benefits to red beets (nitrates, antioxidants) with a milder taste.', icon: '💛' },
];

const IngredientsSection: React.FC = () => {
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);

  return (
    <section id="ingredients" className="py-16 bg-brand-green-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green-dark mb-3">
            Why It Works: Powerful Ingredients
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Each shot is a synergistic blend of nature&apos;s finest, chosen for their proven wellness benefits. Hover over an ingredient to learn more.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 text-center">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.name}
              className="relative p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-default group"
              onMouseEnter={() => setHoveredIngredient(ingredient.name)}
              onMouseLeave={() => setHoveredIngredient(null)}
              // Added tabIndex for keyboard focus, and focus handlers for accessibility
              onFocus={() => setHoveredIngredient(ingredient.name)}
              onBlur={() => setHoveredIngredient(null)}
              tabIndex={0} // Make it focusable
              aria-label={`${ingredient.name}: ${ingredient.benefit}`} // Simple accessibility
            >
              {/* Icon or Image Placeholder */}
              <div className="text-4xl mb-3 mx-auto w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
                  {ingredient.icon}
                 {/* Or use Image component: <Image src={`/images/ingredients/${ingredient.name.toLowerCase().replace(' ', '-')}.png`} width={48} height={48} alt={ingredient.name} /> */}
              </div>
              <h4 className="text-base font-semibold text-brand-green-dark mb-1">{ingredient.name}</h4>
              {/* Tooltip/Popover on hover/focus */}
              <div
                 className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-60 p-3 bg-gray-800 text-white text-xs rounded-md shadow-lg transition-opacity duration-300 pointer-events-none z-10 ${
                   hoveredIngredient === ingredient.name ? 'opacity-100 visible' : 'opacity-0 invisible' // Use visibility for better accessibility
                 }`}
                 role="tooltip"
                 // Added id for potential aria-describedby linking (though maybe overkill here)
                 id={`tooltip-${ingredient.name.replace(/\s+/g, '-')}`}
               >
                {ingredient.benefit}
                 <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                 </svg>
              </div>
              {/* Subtle indicator on the item itself */}
               <p className="text-xs text-gray-500 group-hover:text-brand-green group-focus:text-brand-green transition-colors">Learn More</p>
            </div>
          ))}
        </div>
         <p className="text-center text-sm text-gray-500 mt-8 italic">
           *Ingredient benefits based on available research. Not evaluated by FDA.
         </p>
      </div>
    </section>
  );
};

export default IngredientsSection; 