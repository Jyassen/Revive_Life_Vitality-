'use client'; // Add client directive for useState hook

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

const Header: React.FC = () => {
  // Navigation items
  const navItems = [
    { name: 'Shop', href: '#shop' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { totalCount } = useCart();

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-beige/95 backdrop-blur-md border-b border-brand-cream/50">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 hover:scale-105 transition-transform duration-200">
            <Image
              src="/images/logo.png"
              alt="Revive Life Vitality"
              width={180}
              height={72}
              priority
              className="h-10 w-auto max-w-[140px] sm:h-12 sm:max-w-[160px] md:h-14 md:max-w-[180px] lg:h-16 lg:max-w-[200px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-brand-dark hover:text-brand-brown transition-all duration-200 font-medium text-lg relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-brown transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Icons: Account and Cart */}
          <div className="flex items-center space-x-6">
            <Link href="/account" className="text-brand-dark hover:text-brand-brown transition-all duration-200 hover:scale-110">
              <span className="sr-only">Account</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
            <Link href="/cart" className="text-brand-dark hover:text-brand-brown transition-all duration-200 hover:scale-110 relative">
              <span className="sr-only">Cart</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-brand-brown text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{totalCount}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden text-brand-dark hover:text-brand-brown transition-all duration-200 p-2 hover:bg-brand-cream rounded-md"
              onClick={handleMobileMenuToggle}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-beige/95 backdrop-blur-md border-t border-brand-cream/50 animate-fade-in">
          <div className="container-custom py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 text-brand-dark hover:text-brand-brown text-lg font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 