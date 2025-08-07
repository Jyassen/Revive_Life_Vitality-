export interface ProductChoice {
  id: string
  name: string
  image: string
  description: string
}

export interface PackageConfig {
  packageId: string
  packageName: string
  packagePrice: string
  packageImage: string
  totalShots: number
  quantity: number
  selectedProducts: {
    productId: string
    quantity: number
  }[]
  subscription?: {
    frequency: 'weekly' | 'monthly'
    discount: number
  }
}

export interface ConfiguredPackageItem {
  id: string
  name: string
  price: string
  image: string
  category: string
  quantity: number
  packageConfig: PackageConfig
}