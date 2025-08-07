'use client'

import React from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'

export type ProductCardProps = {
  id: string
  name: string
  price: string
  image: string
  category: string
  description?: string
  onQuickView?: (productId: string) => void
  onAddToCart?: (productId: string) => void
  className?: string
  showActions?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  category,
  description,
  onQuickView,
  onAddToCart,
  className = '',
  showActions = true
}) => {
  const { addItem } = useCart()
  
  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      image,
      category
    })
    if (onAddToCart) {
      onAddToCart(id)
    }
  }

  return (
    <div className={`product-card ${className}`}>
      <div className="p-4 relative group">
        <div className="relative h-60 w-full mb-4 bg-brand-beige rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            src={image}
            alt={name}
            width={150}
            height={250}
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
          
          {showActions && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
              <Button 
                className="mb-2" 
                variant="primary"
                size="sm"
                onClick={handleAddToCart}
                ariaLabel={`Add ${name} to cart`}
              >
                Add to Cart
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={() => onQuickView && onQuickView(id)}
                ariaLabel={`Quick view of ${name}`}
                className="bg-white hover:bg-brand-cream"
              >
                Quick View
              </Button>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <p className="text-xs text-brand-brown uppercase tracking-wider mb-1">{category}</p>
          <h3 className="text-base font-medium text-brand-dark mb-1">{name}</h3>
          <p className="text-brand-dark font-medium">{price}</p>
          
          {description && !showActions && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard 