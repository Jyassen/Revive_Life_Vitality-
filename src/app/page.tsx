import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import DailyRitualSection from '@/components/sections/DailyRitualSection';
import HowToUseSection from '@/components/sections/HowToUseSection';
import IngredientSpotlightSection from '@/components/sections/IngredientSpotlightSection';
import { ProductFeaturesSection } from '@/components/sections/ProductFeatureSection';
import FounderStorySection from '@/components/sections/FounderStorySection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import ComparisonSection from '@/components/sections/ComparisonSection';
import PurchaseOptionsSection from '@/components/sections/PurchaseOptionsSection';
import ContactSection from '@/components/sections/ContactSection';

// Define metadata for the page (App Router convention)
// This replaces the <Head> component for static metadata
export const metadata = {
  title: 'Revive Life Vitality - Organic Wellness Shots',
  description: 'Experience potent, organic cold-pressed wellness shots. Boost immunity and energy with our premium ingredients. Natural vitality in every bottle.',
  // Add other metadata fields as needed (e.g., openGraph, twitter)
  openGraph: {
    title: 'Revive Life Vitality - Organic Wellness Shots',
    description: 'Boost immunity and energy with our science-backed, cold-pressed elixirs.',
    url: 'https://revivelifevitality.com',
    images: [
      {
        url: '/images/og-image-placeholder.jpg',
        width: 1200,
        height: 630,
        alt: 'Revive Life Vitality Wellness Shots',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revive Life Vitality - Organic Wellness Shots',
    description: 'Boost immunity and energy with our science-backed, cold-pressed elixirs.',
    images: ['/images/og-image-placeholder.jpg'],
  },
  // Add favicon link in root layout (src/app/layout.tsx) instead
  // icons: {
  //   icon: '/favicon.ico',
  // },
};


const HomePage: React.FC = () => {
  // App Router uses a different structure - layout is handled in layout.tsx
  // We just return the page content here.
  return (
    <main>
      <HeroSection />
      <ProductFeaturesSection />
      <DailyRitualSection />
      <HowToUseSection />
      <IngredientSpotlightSection />
      <FounderStorySection />
      <ComparisonSection />
      <TestimonialSection />
      <PurchaseOptionsSection />
      <ContactSection />
    </main>
  );
};

export default HomePage;
