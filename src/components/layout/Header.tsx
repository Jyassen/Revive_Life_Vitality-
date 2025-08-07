'use client'; // Add client directive for useState hook

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isCartPage = pathname === '/cart';
  const isConfigurePage = pathname.startsWith('/configure/');
  const isCheckoutPage = pathname === '/checkout';
  
  // Don't show cart drawer on cart, configure, or checkout pages
  const shouldShowCartDrawer = !isCartPage && !isConfigurePage && !isCheckoutPage;

  // Navigation items
  const navItems = [
    { name: 'Shop', href: '#purchase-options' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = React.useState(false);
  const { totalCount } = useCart();

  const handleNavClick = (href: string, event: React.MouseEvent) => {
    if (!isHomePage) {
      // If not on home page, navigate to home page with the anchor
      event.preventDefault();
      router.push(`/${href}`);
    }
    // If on home page, let the default anchor behavior work
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-beige/95 backdrop-blur-md border-b border-brand-cream/50">
      <div className="container-custom">
        <div className="flex items-center justify-between py-1">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 hover:scale-105 transition-transform duration-200">
            <Image
              src="/images/logo.png?v=2"
              alt="Revive Life Vitality"
              width={504}
              height={202}
              priority
              className="h-16 w-auto max-w-[280px] sm:h-18 sm:max-w-[320px] md:h-20 md:max-w-[360px] lg:h-24 lg:max-w-[400px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(item.href, e)}
                className="text-brand-dark hover:text-brand-brown transition-all duration-200 font-medium text-lg relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-brown transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => shouldShowCartDrawer ? setIsCartDrawerOpen(true) : router.push('/cart')}
              className="text-brand-dark hover:text-brand-brown transition-all duration-200 hover:scale-110 relative"
              aria-label={shouldShowCartDrawer ? "Open cart" : "View cart"}
            >
              <span className="sr-only">Cart</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-brown text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>

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
                onClick={(e) => {
                  handleNavClick(item.href, e);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {shouldShowCartDrawer && (
        <CartDrawer 
          isOpen={isCartDrawerOpen} 
          onClose={() => setIsCartDrawerOpen(false)} 
        />
      )}
    </header>
  );
};

export default Header; 