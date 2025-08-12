import { Address, CustomerInfo } from '@/lib/validations/checkout'

// Clover API Types
export interface CloverPaymentToken {
  id: string
  card?: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
}

export interface CloverChargeRequest {
  amount: number // in cents
  currency?: string
  source: string // token id
  capture?: boolean
  metadata?: Record<string, string>
  description?: string
  customer?: {
    email?: string
    name?: string
    phone?: string
  }
  shipping?: {
    name?: string
    address?: {
      line1: string
      line2?: string
      city: string
      state: string
      postal_code: string
      country: string
    }
  }
}

export interface CloverChargeResponse {
  id: string
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed'
  source: {
    id: string
    brand?: string
    last4?: string
  }
  created: number
  captured: boolean
  failure_code?: string
  failure_message?: string
  metadata?: Record<string, string>
}

export interface CloverError {
  type: string
  code: string
  message: string
  param?: string
}

export interface CloverOrderRequest {
  state: 'open' | 'locked'
  items: Array<{
    name: string
    price: number // in cents
    quantity?: number
    taxRates?: Array<{
      name: string
      rate: number
    }>
  }>
  metadata?: Record<string, string>
}

export interface CloverOrderResponse {
  id: string
  state: string
  total: number
  created: number
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  metadata?: Record<string, string>
}

// Clover API Configuration
export const CLOVER_CONFIG = {
  baseURL: process.env.CLOVER_ENVIRONMENT === 'production' 
    ? 'https://api.clover.com' 
    : 'https://sandbox.dev.clover.com',
  apiKey: process.env.CLOVER_API_KEY,
  version: 'v1'
} as const

// API Helper Functions
export class CloverAPI {
  private baseURL: string
  private apiKey: string

  constructor() {
    this.baseURL = CLOVER_CONFIG.baseURL
    this.apiKey = CLOVER_CONFIG.apiKey || ''
    
    if (!this.apiKey) {
      throw new Error('Clover API key is not configured')
    }
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/${CLOVER_CONFIG.version}/${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new CloverAPIError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    return response.json()
  }

  async createCharge(request: CloverChargeRequest): Promise<CloverChargeResponse> {
    return this.makeRequest<CloverChargeResponse>('charges', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getCharge(chargeId: string): Promise<CloverChargeResponse> {
    return this.makeRequest<CloverChargeResponse>(`charges/${chargeId}`)
  }

  async createOrder(request: CloverOrderRequest): Promise<CloverOrderResponse> {
    return this.makeRequest<CloverOrderResponse>('orders', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getOrder(orderId: string): Promise<CloverOrderResponse> {
    return this.makeRequest<CloverOrderResponse>(`orders/${orderId}`)
  }
}

// Custom Error Class
export class CloverAPIError extends Error {
  public status: number
  public details: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'CloverAPIError'
    this.status = status
    this.details = details
  }
}

// Utility Functions
export function formatAddressForClover(address: Address) {
  return {
    name: `${address.firstName} ${address.lastName}`,
    address: {
      line1: address.address1,
      line2: address.address2 || undefined,
      city: address.city,
      state: address.state,
      postal_code: address.zipCode,
      country: address.country || 'US',
    }
  }
}

export function formatCustomerForClover(customer: CustomerInfo) {
  return {
    email: customer.email,
    name: `${customer.firstName} ${customer.lastName}`,
    phone: customer.phone,
  }
}

export function formatAmountForClover(amount: number): number {
  // Convert dollar amount to cents
  return Math.round(amount * 100)
}

export function formatAmountFromClover(amount: number): number {
  // Convert cents to dollars
  return amount / 100
}

// Validation Functions
export function validateCloverConfig(): boolean {
  const { apiKey, baseURL } = CLOVER_CONFIG
  return Boolean(apiKey && baseURL)
}

export function isCloverError(error: unknown): error is CloverError {
  return !!(error && typeof error === 'object' && 'type' in error && 'code' in error)
}

// Payment Status Helpers
export function isPaymentSuccessful(charge: CloverChargeResponse): boolean {
  return charge.status === 'succeeded' && charge.captured
}

export function getPaymentFailureMessage(charge: CloverChargeResponse): string {
  if (charge.failure_message) {
    return charge.failure_message
  }
  
  switch (charge.failure_code) {
    case 'card_declined':
      return 'Your card was declined. Please try a different payment method.'
    case 'insufficient_funds':
      return 'Insufficient funds. Please check your account balance or try a different card.'
    case 'expired_card':
      return 'Your card has expired. Please update your payment information.'
    case 'incorrect_cvc':
      return 'The security code is incorrect. Please check and try again.'
    case 'processing_error':
      return 'There was an error processing your payment. Please try again.'
    default:
      return 'Payment failed. Please check your payment information and try again.'
  }
}