'use client'

import React, { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'
import { Minus, Plus, ArrowLeft } from 'lucide-react'
import type { ProductChoice, PackageConfig } from '@/types/package'

const availableProducts: ProductChoice[] = [
  {
    id: 'red-beet-heat',
    name: 'Red Beet Heat',
    image: '/images/site pics/Red Beet Heat Finished.png',
    description: 'Energy & circulation boost with red beets, turmeric, and cayenne'
  },
  {
    id: 'manuka-honey-immune',
    name: 'Manuka Honey Immune Boost',
    image: '/images/site pics/Manuka Honey Finished.png',
    description: 'Immune support with premium Manuka honey and golden beets'
  }
]

interface PackageDetailsType {
  name: string
  price: string
  image: string
  totalShots: number
  description: string
  subscription?: {
    frequency: 'weekly' | 'monthly'
    discount: number
  }
}

const packageDetails: Record<string, PackageDetailsType> = {
  'starter-pack': {
    name: 'Starter Pack',
    price: '$19.99',
    image: '/images/Starter Pack.png',
    totalShots: 3,
    description: 'Perfect for trying our wellness shots!'
  },
  'pro-pack': {
    name: 'Pro Pack',
    price: '$43.00',
    image: '/images/Pro Pack.png',
    totalShots: 7,
    description: 'Get more value with our popular pro option.'
  },
  'revive-club': {
    name: 'Revive Club',
    price: '$38.00',
    image: '/images/Revive club.png',
    totalShots: 7,
    description: 'Weekly subscription with exclusive savings!',
    subscription: {
      frequency: 'weekly' as const,
      discount: 12
    }
  }
}

export default function ConfigurePackagePage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  
  const packageId = params.packageId as string
  const packageInfo = packageDetails[packageId]
  
  const [quantity, setQuantity] = useState(1)
  const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: number }>({})
  
  const totalSelectedShots = useMemo(() => 
    Object.values(selectedProducts).reduce((sum, qty) => sum + qty, 0), 
    [selectedProducts]
  )
  const requiredShots = useMemo(() => 
    packageInfo ? packageInfo.totalShots * quantity : 0, 
    [packageInfo, quantity]
  )
  const isConfigurationValid = useMemo(() => 
    totalSelectedShots === requiredShots, 
    [totalSelectedShots, requiredShots]
  )

  if (!packageInfo) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-4xl text-brand-dark mb-4">Package Not Found</h1>
          <Button
            onClick={() => router.push('/')}
            variant="primary"
            size="lg"
            ariaLabel="Go back home"
            className="btn-primary"
          >
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  const handleProductQuantityChange = (productId: string, change: number) => {
    setSelectedProducts(prev => {
      const newQuantity = Math.max(0, (prev[productId] || 0) + change)
      if (newQuantity === 0) {
        const { [productId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [productId]: newQuantity }
    })
  }

  const handleAddToCart = () => {
    if (!isConfigurationValid) return

    const packageConfig: PackageConfig = {
      packageId,
      packageName: packageInfo.name,
      packagePrice: packageInfo.price,
      packageImage: packageInfo.image,
      totalShots: packageInfo.totalShots,
      quantity,
      selectedProducts: Object.entries(selectedProducts).map(([productId, qty]) => ({
        productId,
        quantity: qty
      })),
      subscription: packageInfo.subscription
    }

    // Create a configured package item
    const configuredItem = {
      id: `${packageId}-configured-${Date.now()}`,
      name: `${packageInfo.name} (${quantity}x)`,
      price: packageInfo.price,
      image: packageInfo.image,
      category: 'Configured Package',
      quantity: 1, // The quantity is handled within the package config
      packageConfig
    }

    addItem(configuredItem)
    router.push('/cart')
  }

  return (
    <div className="min-h-screen bg-brand-beige">
      <div className="container-custom section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-brand-brown hover:text-brand-dark transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Package Info */}
              <div>
                <div className="relative h-64 mb-6 bg-brand-beige rounded-lg overflow-hidden">
                  <Image
                    src={packageInfo.image}
                    alt={packageInfo.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={true}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyb21llHqvqDMoIIIOCDkHqKt5xaWuofxKzs5GhkJJMsSmTrHsUIFHZh2ks7qjKMqygEHcOyDgdCDXCJPUGmMsj8z+HrJJTzP8AxY\\\\"
                    className="object-contain p-4"
                  />
                </div>
                
                <h1 className="font-playfair text-3xl text-brand-dark mb-4">
                  Configure Your {packageInfo.name}
                </h1>
                <p className="text-brand-brown mb-6">
                  {packageInfo.description}
                </p>

                {/* Package Quantity */}
                <div className="mb-8">
                  <h3 className="font-medium text-brand-dark mb-4">Package Quantity</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full border-2 border-brand-brown hover:bg-brand-brown hover:text-white transition-colors duration-200 flex items-center justify-center"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    
                    <span className="text-xl font-medium text-brand-dark w-12 text-center">
                      {quantity}
                    </span>
                    
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full border-2 border-brand-brown hover:bg-brand-brown hover:text-white transition-colors duration-200 flex items-center justify-center"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-brand-beige/50 rounded-lg p-4">
                  <h4 className="font-medium text-brand-dark mb-2">Configuration Summary</h4>
                  <div className="text-sm text-brand-brown space-y-1">
                    <p>Packages: {quantity}x {packageInfo.name}</p>
                    <p>Total shots needed: {requiredShots}</p>
                    <p>Selected shots: {totalSelectedShots}</p>
                    <p className="font-medium text-lg text-brand-dark mt-2">
                      Total: {packageInfo.price}
                      {quantity > 1 && ` x ${quantity} = $${(parseFloat(packageInfo.price.replace('$', '')) * quantity).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Selection */}
              <div>
                <h3 className="font-medium text-brand-dark mb-6">
                  Choose Your Wellness Shots
                  <span className="text-sm text-brand-brown ml-2">
                    ({totalSelectedShots}/{requiredShots} selected)
                  </span>
                </h3>

                <div className="space-y-4 mb-8">
                  {availableProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border border-brand-brown/20 rounded-lg p-4 hover:border-brand-brown/40 transition-colors"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-16 h-16 bg-brand-beige rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="64px"
                            loading="lazy"
                            className="object-contain p-1"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-brand-dark mb-1">
                            {product.name}
                          </h4>
                          <p className="text-sm text-brand-brown mb-3">
                            {product.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleProductQuantityChange(product.id, -1)}
                                className="w-8 h-8 rounded-full border border-brand-brown hover:bg-brand-brown hover:text-white transition-colors duration-200 flex items-center justify-center"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              
                              <span className="w-8 text-center font-medium text-brand-dark">
                                {selectedProducts[product.id] || 0}
                              </span>
                              
                              <button
                                onClick={() => handleProductQuantityChange(product.id, 1)}
                                className="w-8 h-8 rounded-full border border-brand-brown hover:bg-brand-brown hover:text-white transition-colors duration-200 flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={!isConfigurationValid}
                  variant="primary"
                  size="lg"
                  ariaLabel="Add configured package to cart"
                  className={`w-full btn-primary ${!isConfigurationValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isConfigurationValid ? 'Add to Cart' : `Select ${requiredShots - totalSelectedShots} more shots`}
                </Button>

                {packageInfo.subscription && (
                  <p className="text-sm text-brand-brown text-center mt-4">
                    🔄 This is a {packageInfo.subscription.frequency} subscription with {packageInfo.subscription.discount}% savings
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}