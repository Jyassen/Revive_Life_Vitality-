'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import Button from '@/components/ui/Button'
import ConfiguredPackageDisplay from '@/components/cart/ConfiguredPackageDisplay'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, totalPrice, updateQuantity, removeItem } = useCart()

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-200 ${
          isOpen ? 'opacity-30' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Cart Modal */}
      <div className={`absolute top-20 right-4 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl transform transition-all duration-200 ease-out ${
        isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
      } flex flex-col max-h-[calc(100vh-6rem)]`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-brown/20">
          <h2 className="font-playfair text-2xl text-brand-dark">
            Your Cart ({items.reduce((sum, item) => sum + item.quantity, 0)})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-beige rounded-lg transition-colors duration-200"
            aria-label="Close cart"
          >
            <X className="w-6 h-6 text-brand-brown" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-6 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-brand-brown" />
              <p className="text-brand-brown text-lg mb-4">Your cart is empty</p>
              <Button
                onClick={onClose}
                variant="outline"
                size="md"
                ariaLabel="Continue shopping"
                className="btn-outline"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-brand-brown/10 last:border-b-0">
                  <div className="relative w-16 h-16 bg-brand-beige rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-brand-dark mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-brand-brown uppercase tracking-wider mb-2">
                      {item.category}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-6 h-6 rounded-full border border-brand-brown hover:bg-brand-brown hover:text-white transition-colors duration-200 flex items-center justify-center"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        
                        <span className="w-8 text-center text-sm font-medium text-brand-dark">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full border border-brand-brown hover:bg-brand-brown hover:text-white transition-colors duration-200 flex items-center justify-center"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium text-brand-dark">
                          ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-brand-brown hover:text-red-500 transition-colors duration-200"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    {/* Show package configuration details if it's a configured package */}
                    <ConfiguredPackageDisplay item={item} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-brand-brown/20 bg-brand-beige/50">
            <div className="mb-4">
              <div className="flex justify-between text-lg font-medium text-brand-dark mb-2">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <p className="text-xs text-brand-brown text-center">
                Shipping and taxes calculated at checkout
              </p>
            </div>
            
            <div className="space-y-3">
              <Link href="/checkout" onClick={onClose} className="block">
                <Button 
                  variant="primary" 
                  size="lg"
                  ariaLabel="Proceed to checkout"
                  className="w-full btn-primary text-center"
                >
                  Checkout
                </Button>
              </Link>
              
              <Link href="/cart" onClick={onClose} className="block">
                <Button 
                  variant="outline" 
                  size="md"
                  ariaLabel="View cart"
                  className="w-full btn-outline text-center"
                >
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartDrawer