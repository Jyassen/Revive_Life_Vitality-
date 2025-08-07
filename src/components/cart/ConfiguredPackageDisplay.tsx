'use client'

import React from 'react'
import type { CartItem } from '@/context/CartContext'

interface ConfiguredPackageDisplayProps {
  item: CartItem
}

const ConfiguredPackageDisplay: React.FC<ConfiguredPackageDisplayProps> = ({ item }) => {
  if (!item.packageConfig) return null

  const { packageConfig } = item

  return (
    <div className="mt-3 p-3 bg-brand-beige/50 rounded-lg">
      <div className="text-xs text-brand-brown uppercase tracking-wider mb-2">
        Package Contents:
      </div>
      
      <div className="space-y-2">
        {packageConfig.selectedProducts.map((selected) => {
          // Product names for the two available options
          const productNames = {
            'red-beet-heat': 'Red Beet Heat',
            'manuka-honey-immune': 'Manuka Honey Immune Boost'
          }
          
          return (
            <div key={selected.productId} className="flex justify-between text-sm">
              <span className="text-brand-dark">
                {productNames[selected.productId as keyof typeof productNames] || selected.productId}
              </span>
              <span className="text-brand-brown">
                {selected.quantity}x
              </span>
            </div>
          )
        })}
      </div>
      
      <div className="flex justify-between text-xs text-brand-brown mt-2 pt-2 border-t border-brand-brown/20">
        <span>Total shots per package:</span>
        <span>{packageConfig.totalShots}</span>
      </div>
      
      {packageConfig.subscription && (
        <div className="text-xs text-green-600 mt-1">
          🔄 {packageConfig.subscription.frequency} subscription ({packageConfig.subscription.discount}% off)
        </div>
      )}
    </div>
  )
}

export default ConfiguredPackageDisplay