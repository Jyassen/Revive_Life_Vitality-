import React from 'react';
import Image from 'next/image';

const FounderStorySection: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Founder Image */}
          <div className="relative h-[500px] w-full">
            <div className="relative h-full w-full bg-gradient-to-br from-brand-cream to-brand-beige rounded-xl p-4 shadow-xl">
              <div className="relative h-full w-full bg-white rounded-lg shadow-inner overflow-hidden border-4 border-brand-brown/20">
                <div className="absolute inset-2 bg-gradient-to-br from-white to-gray-50 rounded shadow-inner">
                  <Image
                    src="/images/Founder pic.JPEG" 
                    alt="Everyl A. McMorris, PA-C - Founder of Revive Life Vitality"
                    fill
                    className="object-contain rounded p-2"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-brand-brown to-brand-brown/80 text-white text-center py-2 rounded shadow-lg">
                  <p className="text-sm font-medium">Everyl A. McMorris, PA-C</p>
                  <p className="text-xs opacity-90">Founder & Medical Expert</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Story Content */}
          <div>
            <h2 className="text-3xl font-medium text-brand-dark mb-6">Born from a Passion for Holistic Healing</h2>
            
            <h3 className="text-xl text-brand-brown mb-4">Everyl A. McMorris, PA-C</h3>
            <p className="text-sm text-gray-600 mb-6">Board-Certified Physician Assistant | Advocate for Integrative Wellness</p>
            
            <p className="text-gray-600 mb-6">
              With over 20 years of clinical experience across academic hospitals, urgent care, and concierge medicine, Everyl A. McMorris witnessed countless patients struggling with chronic fatigue and inflammation. Seeing them turn to quick fixes with long-term downsides sparked her mission: to blend her medical expertise with plant-based solutions that empower people to take control of their health naturally and effectively.
            </p>
            
            <blockquote className="border-l-4 border-brand-brown pl-4 italic mb-6">
              <p className="text-brand-dark">&quot;I created Revive to give people more than a quick fix-something real, effective, and grounded in both nature and evidence.&quot;</p>
              <footer className="text-brand-brown mt-2">– Everyl A. McMorris, PA-C, Founder</footer>
            </blockquote>
            
            <p className="text-gray-600">
              At Revive Life Vitality, Everyl&apos;s mission is simple yet powerful: To help you feel energized, resilient, and in control-using clean, potent ingredients that support your body&apos;s own healing potential.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderStorySection; 