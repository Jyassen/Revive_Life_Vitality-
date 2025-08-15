'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import type { Address, CustomerInfo, PaymentInfo, OrderSummary, CreateOrderData } from '@/lib/validations/checkout'
import type { ShippingMethod, PaymentMethod } from '@/types/checkout'

interface CartItem {
  id: string
  name: string
  price: string
  quantity: number
  image: string
}

interface CheckoutState {
  step: number
  customerInfo: CustomerInfo | null
  shippingAddress: Address | null
  billingAddress: Address | null
  sameAsBilling: boolean
  sameAsShipping: boolean
  shippingMethod: ShippingMethod | null
  paymentMethod: PaymentMethod | null
  paymentInfo: PaymentInfo | null
  specialInstructions: string
  couponCode: string
  appliedCouponCode: string
  orderSummary: OrderSummary | null
  orderId: string | null
  paymentStatus: 'idle' | 'processing' | 'succeeded' | 'failed'
  isLoading: boolean
  errors: Record<string, string>
}

type CheckoutAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_CUSTOMER_INFO'; payload: CustomerInfo }
  | { type: 'SET_SHIPPING_ADDRESS'; payload: Address }
  | { type: 'SET_BILLING_ADDRESS'; payload: Address | null }
  | { type: 'SET_SAME_AS_BILLING'; payload: boolean }
  | { type: 'SET_SAME_AS_SHIPPING'; payload: boolean }
  | { type: 'SET_SHIPPING_METHOD'; payload: ShippingMethod }
  | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod }
  | { type: 'SET_PAYMENT_INFO'; payload: PaymentInfo }
  | { type: 'SET_SPECIAL_INSTRUCTIONS'; payload: string }
  | { type: 'SET_COUPON_CODE'; payload: string }
  | { type: 'SET_APPLIED_COUPON'; payload: string }
  | { type: 'SET_ORDER_SUMMARY'; payload: OrderSummary }
  | { type: 'SET_ORDER_ID'; payload: string }
  | { type: 'SET_PAYMENT_STATUS'; payload: 'idle' | 'processing' | 'succeeded' | 'failed' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { field: string; message: string } }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'RESET_CHECKOUT' }

interface CheckoutContextType extends CheckoutState {
  setStep: (step: number) => void
  setCustomerInfo: (info: CustomerInfo) => void
  setShippingAddress: (address: Address) => void
  setBillingAddress: (address: Address | null) => void
  setSameAsBilling: (same: boolean) => void
  setSameAsShipping: (same: boolean) => void
  setShippingMethod: (method: ShippingMethod) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setPaymentInfo: (info: PaymentInfo) => void
  setSpecialInstructions: (instructions: string) => void
  setCouponCode: (code: string) => void
  setAppliedCouponCode: (code: string) => void
  setOrderSummary: (summary: OrderSummary) => void
  setOrderId: (id: string) => void
  setPaymentStatus: (status: 'idle' | 'processing' | 'succeeded' | 'failed') => void
  setLoading: (loading: boolean) => void
  setError: (field: string, message: string) => void
  clearErrors: () => void
  resetCheckout: () => void
  nextStep: () => void
  prevStep: () => void
  processPayment: (items: CartItem[]) => Promise<void>
  startHostedCheckout: (items: CartItem[]) => Promise<string>
}

const initialState: CheckoutState = {
  step: 1,
  customerInfo: null,
  shippingAddress: null,
  billingAddress: null,
  sameAsBilling: true,
  sameAsShipping: true,
  shippingMethod: null,
  paymentMethod: null,
  paymentInfo: null,
  specialInstructions: '',
  couponCode: '',
  appliedCouponCode: '',
  orderSummary: null,
  orderId: null,
  paymentStatus: 'idle',
  isLoading: false,
  errors: {},
}

const checkoutReducer = (state: CheckoutState, action: CheckoutAction): CheckoutState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload }
    case 'SET_CUSTOMER_INFO':
      return { ...state, customerInfo: action.payload }
    case 'SET_SHIPPING_ADDRESS':
      return { ...state, shippingAddress: action.payload }
    case 'SET_BILLING_ADDRESS':
      return { ...state, billingAddress: action.payload }
    case 'SET_SAME_AS_BILLING':
      return { ...state, sameAsBilling: action.payload }
    case 'SET_SAME_AS_SHIPPING':
      return { ...state, sameAsShipping: action.payload }
    case 'SET_SHIPPING_METHOD':
      return { ...state, shippingMethod: action.payload }
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload }
    case 'SET_PAYMENT_INFO':
      return { ...state, paymentInfo: action.payload }
    case 'SET_SPECIAL_INSTRUCTIONS':
      return { ...state, specialInstructions: action.payload }
    case 'SET_COUPON_CODE':
      return { ...state, couponCode: action.payload }
    case 'SET_APPLIED_COUPON':
      return { ...state, appliedCouponCode: action.payload }
    case 'SET_ORDER_SUMMARY':
      return { ...state, orderSummary: action.payload }
    case 'SET_ORDER_ID':
      return { ...state, orderId: action.payload }
    case 'SET_PAYMENT_STATUS':
      return { ...state, paymentStatus: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { 
        ...state, 
        errors: { ...state.errors, [action.payload.field]: action.payload.message }
      }
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} }
    case 'RESET_CHECKOUT':
      return initialState
    default:
      return state
  }
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

interface CheckoutProviderProps {
  children: ReactNode
}

export const CheckoutProvider: React.FC<CheckoutProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(checkoutReducer, initialState)

  const setStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step })
  }

  const setCustomerInfo = (info: CustomerInfo) => {
    dispatch({ type: 'SET_CUSTOMER_INFO', payload: info })
  }

  const setShippingAddress = (address: Address) => {
    dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: address })
  }

  const setBillingAddress = (address: Address | null) => {
    dispatch({ type: 'SET_BILLING_ADDRESS', payload: address })
  }

  const setSameAsBilling = (same: boolean) => {
    dispatch({ type: 'SET_SAME_AS_BILLING', payload: same })
  }

  const setSameAsShipping = (same: boolean) => {
    dispatch({ type: 'SET_SAME_AS_SHIPPING', payload: same })
  }

  const setShippingMethod = (method: ShippingMethod) => {
    dispatch({ type: 'SET_SHIPPING_METHOD', payload: method })
  }

  const setPaymentMethod = (method: PaymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method })
  }

  const setPaymentInfo = (info: PaymentInfo) => {
    dispatch({ type: 'SET_PAYMENT_INFO', payload: info })
  }

  const setSpecialInstructions = (instructions: string) => {
    dispatch({ type: 'SET_SPECIAL_INSTRUCTIONS', payload: instructions })
  }

  const setCouponCode = (code: string) => {
    dispatch({ type: 'SET_COUPON_CODE', payload: code })
  }

  const setAppliedCouponCode = (code: string) => {
    dispatch({ type: 'SET_APPLIED_COUPON', payload: code })
  }

  const setOrderSummary = (summary: OrderSummary) => {
    dispatch({ type: 'SET_ORDER_SUMMARY', payload: summary })
  }

  const setOrderId = (id: string) => {
    dispatch({ type: 'SET_ORDER_ID', payload: id })
  }

  const setPaymentStatus = (status: 'idle' | 'processing' | 'succeeded' | 'failed') => {
    dispatch({ type: 'SET_PAYMENT_STATUS', payload: status })
  }

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const setError = (field: string, message: string) => {
    dispatch({ type: 'SET_ERROR', payload: { field, message } })
  }

  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' })
  }

  const resetCheckout = () => {
    dispatch({ type: 'RESET_CHECKOUT' })
  }

  const nextStep = () => {
    if (state.step < 4) {
      dispatch({ type: 'SET_STEP', payload: state.step + 1 })
    }
  }

  const prevStep = () => {
    if (state.step > 1) {
      dispatch({ type: 'SET_STEP', payload: state.step - 1 })
    }
  }

  const processPayment = async (items: CartItem[]) => {
    if (!state.customerInfo || !state.shippingAddress || !state.paymentInfo || !state.orderSummary) {
      throw new Error('Missing required checkout information')
    }

    setPaymentStatus('processing')
    setLoading(true)
    clearErrors()

    try {
      const orderData: CreateOrderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price.replace('$', '')),
          quantity: item.quantity,
          image: item.image,
        })),
        customer: state.customerInfo,
        shippingAddress: state.shippingAddress,
        billingAddress: state.billingAddress || undefined,
        paymentToken: state.paymentInfo.token,
        summary: state.orderSummary,
        specialInstructions: state.specialInstructions || undefined,
        couponCode: state.appliedCouponCode || undefined,
      }

      const response = await fetch('/api/payment/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Payment failed')
      }

      if (!result.success) {
        throw new Error(result.message || 'Payment processing failed')
      }

      // Payment successful
      setOrderId(result.order_id)
      setPaymentStatus('succeeded')
      
    } catch (error) {
      console.error('Payment processing error:', error)
      setPaymentStatus('failed')
      
      const errorMessage = error instanceof Error ? error.message : 'Payment failed'
      setError('payment', errorMessage)
      
      throw error
    } finally {
      setLoading(false)
    }
  }

  const startHostedCheckout = async (items: CartItem[]): Promise<string> => {
    if (!state.customerInfo || !state.shippingAddress || !state.orderSummary) {
      throw new Error('Missing required checkout information')
    }

    setLoading(true)
    clearErrors()
    try {
      const response = await fetch('/api/payment/hosted-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            name: item.name,
            price: parseFloat(item.price.replace('$', '')),
            quantity: item.quantity,
          })),
          customer: {
            email: state.customerInfo.email,
            firstName: state.customerInfo.firstName,
            lastName: state.customerInfo.lastName,
            phoneNumber: state.customerInfo.phone,
          },
        }),
      })
      const result = await response.json()
      if (!response.ok || !result?.href) {
        const msg = result?.message || result?.error || 'Failed to create hosted checkout session'
        setError('payment', msg)
        throw new Error(msg)
      }
      return result.href as string
    } finally {
      setLoading(false)
    }
  }

  const contextValue: CheckoutContextType = {
    ...state,
    setStep,
    setCustomerInfo,
    setShippingAddress,
    setBillingAddress,
    setSameAsBilling,
    setSameAsShipping,
    setShippingMethod,
    setPaymentMethod,
    setPaymentInfo,
    setSpecialInstructions,
    setCouponCode,
    setAppliedCouponCode,
    setOrderSummary,
    setOrderId,
    setPaymentStatus,
    setLoading,
    setError,
    clearErrors,
    resetCheckout,
    nextStep,
    prevStep,
    processPayment,
    startHostedCheckout,
  }

  return (
    <CheckoutContext.Provider value={contextValue}>
      {children}
    </CheckoutContext.Provider>
  )
}

export const useCheckout = (): CheckoutContextType => {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider')
  }
  return context
}