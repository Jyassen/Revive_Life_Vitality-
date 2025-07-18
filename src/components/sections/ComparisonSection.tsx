import React from 'react';

type ComparisonFeature = {
  feature: string;
  revive: string;
  others: string;
  reviveCheck: boolean;
  othersCheck: boolean;
};

const comparisonFeatures: ComparisonFeature[] = [
  {
    feature: "Ingredients Quality",
    revive: "100% organic, whole-food ingredients",
    others: "Artificial ingredients, chemicals or low-quality extracts",
    reviveCheck: true,
    othersCheck: false
  },
  {
    feature: "No Added Sugar",
    revive: "No added sugar (sweetened only with fruit & honey)",
    others: "High in refined sugar or artificial sweeteners",
    reviveCheck: true,
    othersCheck: false
  },
  {
    feature: "Science-Backed Benefits",
    revive: "Formulated based on scientific research on superfoods",
    others: "Unproven claims or excessive caffeine without nutrient benefits",
    reviveCheck: true,
    othersCheck: false
  },
  {
    feature: "Immediate Impact",
    revive: "Fast-acting nutrients you can feel (nitric oxide boost, etc.)",
    others: "Slow or unclear results (pills take time to digest, etc.)",
    reviveCheck: true,
    othersCheck: false
  },
  {
    feature: "Taste & Format",
    revive: "Delicious 2oz shot, easy to take",
    others: "Large pills or overly sweet 12oz+ drinks",
    reviveCheck: true,
    othersCheck: false
  },
  {
    feature: "Clean-Label",
    revive: "No artificial preservatives or colors",
    others: "Often use preservatives for shelf life",
    reviveCheck: true,
    othersCheck: false
  }
];

const ComparisonSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Why Revive Stands Out</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            With Revive, you get real nutrition and none of the nonsense. Unlike sugary energy drinks or pills, our shots check all the boxes for what smart consumers want.
          </p>
        </div>

        {/* Desktop Comparison Table */}
        <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 mb-10">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-brand-beige">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-brand-dark uppercase tracking-wider w-1/3">
                  Feature
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-brand-dark uppercase tracking-wider w-1/3">
                  Revive Shots
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-brand-dark uppercase tracking-wider w-1/3">
                  Typical Alternatives
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparisonFeatures.map((feature, index) => (
                <tr key={index} className={index === 1 ? 'bg-brand-beige/20' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-dark">
                    {feature.feature}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-start">
                      <span className="mr-2 text-green-500 flex-shrink-0">
                        {feature.reviveCheck ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      {feature.revive}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-start">
                      <span className="mr-2 text-red-500 flex-shrink-0">
                        {feature.othersCheck ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      {feature.others}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Comparison Cards */}
        <div className="md:hidden space-y-6">
          {comparisonFeatures.map((feature, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-brand-beige px-4 py-3">
                <h3 className="font-medium text-brand-dark">{feature.feature}</h3>
              </div>
              <div className="p-4 border-b">
                <div className="flex items-start">
                  <span className="mr-2 text-green-500 flex-shrink-0 mt-1">
                    {feature.reviveCheck ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  <div>
                    <span className="font-medium text-brand-dark block mb-1">Revive Shots:</span>
                    <p className="text-gray-600">{feature.revive}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start">
                  <span className="mr-2 text-red-500 flex-shrink-0 mt-1">
                    {feature.othersCheck ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  <div>
                    <span className="font-medium text-brand-dark block mb-1">Typical Alternatives:</span>
                    <p className="text-gray-600">{feature.others}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-brand-dark font-medium">
            In short, Revive Life Vitality offers what others can't: <span className="font-bold">clean, effective, and enjoyable</span> wellness in a shot.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection; 