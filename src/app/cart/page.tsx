'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import Button from '@/components/ui/Button'
import ConfiguredPackageDisplay from '@/components/cart/ConfiguredPackageDisplay'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-beige">
        <div className="container-custom section-padding">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-brand-brown" />
            <h1 className="font-playfair text-4xl mb-6 text-brand-dark">Your Cart is Empty</h1>
            <p className="text-brand-brown mb-8 text-lg">
              Discover our wellness shots and add some vitality to your cart!
            </p>
            <Link href="/">
              <Button 
                variant="primary" 
                size="lg"
                ariaLabel="Continue shopping"
                className="btn-primary"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-beige">
      <div className="container-custom section-padding">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-playfair text-4xl lg:text-5xl mb-12 text-center text-brand-dark">
            Your Cart
          </h1>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {items.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex gap-6">
                      <div className="relative w-24 h-24 bg-brand-beige rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium text-lg text-brand-dark mb-1">
                              {item.name}
                            </h3>
                            <p className="text-brand-brown text-sm uppercase tracking-wider">
                              {item.category}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-brand-brown hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 rounded-full border border-brand-brown hover:bg-brand-brown hover:text-white transition-colors duration-200 flex items-center justify-center"
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            
                            <span className="w-12 text-center font-medium text-brand-dark">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-brand-brown hover:bg-brand-brown hover:text-white transition-colors duration-200 flex items-center justify-center"
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-medium text-brand-dark">
                              ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-brand-brown">
                              {item.price} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Show package configuration details if it's a configured package */}
                    <ConfiguredPackageDisplay item={item} />
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-brand-brown/20">
                <button
                  onClick={clearCart}
                  className="text-brand-brown hover:text-red-500 transition-colors duration-200 font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 shadow-soft sticky top-8">
                <h2 className="font-playfair text-2xl mb-6 text-brand-dark">
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-brand-dark">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-brand-brown">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  
                  <div className="flex justify-between text-brand-brown">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  
                  <div className="border-t border-brand-brown/20 pt-4">
                    <div className="flex justify-between text-xl font-medium text-brand-dark">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <Link href="/checkout" className="block">
                  <Button 
                    variant="primary" 
                    size="lg"
                    ariaLabel="Proceed to checkout"
                    className="w-full btn-primary text-center"
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Link href="/" className="block mt-4">
                  <Button 
                    variant="outline" 
                    size="md"
                    ariaLabel="Continue shopping"
                    className="w-full btn-outline text-center"
                  >
                    Continue Shopping
                  </Button>
                </Link>
                
                <div className="mt-6 pt-6 border-t border-brand-brown/20">
                  <p className="text-sm text-brand-brown text-center">
                    Free shipping on orders over $50
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}