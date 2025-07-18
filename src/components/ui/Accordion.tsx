'use client'; // This component uses client-side state (useState)

import React, { useState, KeyboardEvent } from 'react';

type AccordionItemProps = {
  title: string;
  children: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItemProps[];
};

const AccordionItem: React.FC<AccordionItemProps & { isOpen: boolean; onClick: () => void }> = ({
  title,
  children,
  isOpen,
  onClick,
}) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div className="border-b border-gray-200">
      <h3>
        <button
          type="button"
          className="flex justify-between items-center w-full py-4 px-5 text-left font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-green"
          onClick={onClick}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls={`accordion-panel-${title.replace(/\s+/g, '-')}`}
          id={`accordion-button-${title.replace(/\s+/g, '-')}`}
        >
          <span>{title}</span>
          <svg
            className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </h3>
      <div
        id={`accordion-panel-${title.replace(/\s+/g, '-')}`}
        role="region"
        aria-labelledby={`accordion-button-${title.replace(/\s+/g, '-')}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="py-4 px-5 text-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
};


const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleItemClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="border border-gray-200 rounded-md">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openIndex === index}
          onClick={() => handleItemClick(index)}
        >
          {item.children}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion; 