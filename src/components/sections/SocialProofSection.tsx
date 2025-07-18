import React from 'react';
import Image from 'next/image';

// Placeholder testimonials based on PRD examples
const testimonials = [
  {
    quote: "I've been taking Revive shots every morning for a month, and I feel unstoppable – no more mid-day energy crashes!",
    name: "Jane D.",
    location: "NYC",
    image: "/images/placeholder-user1.jpg", // Ensure image exists in /public/images
  },
  {
    quote: "As an athlete, recovery is key. Red Beet Heat has noticeably reduced my post-workout soreness. Love the natural ingredients!",
    name: "Mike R.",
    location: "California",
    image: "/images/placeholder-user2.jpg", // Ensure image exists in /public/images
  },
  {
    quote: "The Manuka Honey Immune Boost is my go-to during cold season. Tastes great and I feel more resilient.",
    name: "Sarah K.",
    location: "Wellness Blogger",
    image: "/images/placeholder-user3.jpg", // Ensure image exists in /public/images
  },
];

// Placeholder logos
const featuredLogos = [
    // Ensure these logos exist in /public/images
    { name: "Health & Wellness Mag", src: "/images/logo-placeholder-mag.png"},
    { name: "Organic Life", src: "/images/logo-placeholder-blog.png"},
    { name: "Fit Pro Daily", src: "/images/logo-placeholder-fit.png"},
];


const SocialProofSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 bg-brand-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green-dark mb-3">
            Loved by Wellness Enthusiasts
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. See what real customers are saying.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
              <div className="relative w-20 h-20 mb-4">
                <Image
                  src={testimonial.image}
                  alt={`Photo of ${testimonial.name}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-full"
                  sizes="80px"
                />
              </div>
              <blockquote className="text-gray-700 italic mb-4 flex-grow">
                <p>"{testimonial.quote}"</p>
              </blockquote>
              <footer className="mt-auto">
                 <p className="font-semibold text-brand-green-dark">{testimonial.name}</p>
                 <p className="text-sm text-gray-500">{testimonial.location}</p>
              </footer>
            </div>
          ))}
        </div>

         {/* As Seen In / Logos (Optional) */}
         <div className="text-center border-t border-gray-200 pt-10">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 uppercase tracking-wider text-gray-500">As Featured In</h3>
            <div className="flex justify-center items-center space-x-8 md:space-x-12 flex-wrap gap-4">
                {featuredLogos.map(logo => (
                    <div key={logo.name} className="relative h-10 w-32 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition duration-300 m-2">
                        <Image
                          src={logo.src}
                          alt={logo.name}
                          fill
                          style={{ objectFit: 'contain' }}
                          sizes="128px"
                         />
                    </div>
                ))}
            </div>
         </div>

      </div>
    </section>
  );
};

export default SocialProofSection; 