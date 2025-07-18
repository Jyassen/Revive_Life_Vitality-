'use client';

import React from 'react';
import Image from 'next/image';

type Testimonial = {
  id: string;
  text: string;
  author: string;
  role: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    text: `love how I feel after taking  Revive Life Vitality Shots. It gives my body energy and every shot is made with high quality fresh natural ingredients — you can actually taste the difference. Juggling a demanding career and family schedule can weigh me down but adding the daily shots to my routine keeps me going!`,
    author: 'Nicole Johnson',
    role: 'News Reporter-WPIX-TV',
    avatar: '/images/testimonial-1.jpg',
  },
  {
    id: 'testimonial-2',
    text: `I recently tried Revive Life's vitality wellness shots, and I couldn't be more impressed! Not only do these shots provide me with incredible energy and focus, but they're made with all-natural ingredients that I can trust. It's refreshing to find a product that aligns with my health goals and genuinely makes a difference in my daily routine. I highly recommend Revive Life to anyone who is serious about taking their health to the next level—this is a game-changer! 💪🏽`,
    author: 'Sean Ringgold',
    role: 'Actor',
    avatar: '/images/testimonial-2.jpg',
  }
];

const TestimonialSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-brand-cream">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Customers Love Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - see what real customers are saying about our wellness shots.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex flex-col">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-brand-brown">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-6 flex-grow">{testimonial.text}</p>
                  <div className="flex items-center">
                    <div>
                      <p className="font-medium text-brand-dark">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection; 