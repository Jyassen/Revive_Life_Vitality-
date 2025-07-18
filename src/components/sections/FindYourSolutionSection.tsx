import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const solutions = [
  {
    name: 'Detox and Reset',
    image: '/images/solution-detox.jpg', // Ensure image exists in /public/images
    href: '#products',
  },
  {
    name: 'Gut Health',
    image: '/images/solution-gut.jpg', // Ensure image exists in /public/images
    href: '#products',
  },
  {
    name: 'Immunity',
    image: '/images/solution-immunity.jpg', // Ensure image exists in /public/images
    href: '#products',
  },
  {
    name: 'Hydration and Recovery',
    image: '/images/solution-hydration.jpg', // Ensure image exists in /public/images
    href: '#products',
  },
];

const FindYourSolutionSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green-dark mb-3">
            Find Your Wellness Solution
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the perfect solution for your needs with our essential wellness categories.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutions.map((solution) => (
            <div key={solution.name} className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              {/* Use Link for potential internal navigation, fallback to <a> for anchors */}
              <Link href={solution.href} className="block" aria-label={`Learn more about ${solution.name}`}>
                <div className="relative h-64 w-full">
                  <Image
                    src={solution.image}
                    alt={`${solution.name} wellness solution category`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" // Add sizes prop for optimization
                  />
                   {/* Optional: Add a subtle overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-xl font-semibold text-white text-center">
                     {solution.name}
                    </h3>
                    {/* Underline effect */}
                    <div className="mt-2 h-0.5 w-12 bg-brand-yellow mx-auto scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        {/* Optional: Add a small separator like the one in the image */}
        <div className="text-center mt-8">
            <span className="inline-block h-1 w-10 bg-gray-300 rounded"></span>
        </div>
      </div>
    </section>
  );
};

export default FindYourSolutionSection; 