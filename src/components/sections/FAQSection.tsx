import React from 'react';
import Accordion from '@/components/ui/Accordion'; // Updated path alias

// FAQ data from PRD
const faqItems = [
  {
    title: "When and how should I take these shots?",
    children: "Anytime! Enjoy chilled first thing in the morning for a fresh start, pre-workout for an energy boost, or as an afternoon pick-me-up. Drink the 2 oz shot straight, or dilute in water/juice if you prefer. Shake well before enjoying.",
  },
  {
    title: "Do they need refrigeration?",
    children: "Yes, please keep your Revive Life Vitality shots refrigerated to maintain optimal freshness, taste, and nutrient integrity. Our High Pressure Processing (HPP) helps extend shelf life in the fridge.",
  },
  {
    title: "Is it suitable for specific diets?",
    children: "Our shots are 100% plant-based, gluten-free, dairy-free, soy-free, and contain no added sugars or artificial ingredients. Red Beet Heat is vegan. Manuka Honey Immune Boost contains honey, so it is not strictly vegan. Both contain wheatgrass, which is generally considered gluten-free, but consult your doctor if you have severe wheat allergies.",
  },
   {
    title: "What is the shelf life?",
    children: "Thanks to HPP, our shots have a generous refrigerated shelf life. Please check the expiration date printed on each bottle.",
  },
  {
    title: "What if I'm not satisfied?", // Corrected typo
    children: "We stand behind our products! If you're not completely satisfied with your purchase, please contact our customer service team at revivelifevitality@gmail.com, and we'll work to make it right, which may include a refund or replacement.",
  },
];

const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-16 bg-brand-green-light/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green-dark mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Have questions? We&apos;ve got answers.
          </p>
        </div>

        {/* Accordion component handles its own client-side logic */}
        <Accordion items={faqItems} />

      </div>
    </section>
  );
};

export default FAQSection; 