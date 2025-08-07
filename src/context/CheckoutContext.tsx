'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import type { Address, CustomerInfo } from '@/lib/validations/checkout'
import type { ShippingMethod, PaymentMethod } from '@/types/checkout'

interface CheckoutState {
  step: number
  customerInfo: CustomerInfo | null
  shippingAddress: Address | null
  billingAddress: Address | null
  sameAsBilling: boolean
  shippingMethod: ShippingMethod | null
  paymentMethod: PaymentMethod | null
  specialInstructions: string
  couponCode: string
  isLoading: boolean
  errors: Record<string, string>
}

type CheckoutAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_CUSTOMER_INFO'; payload: CustomerInfo }
  | { type: 'SET_SHIPPING_ADDRESS'; payload: Address }
  | { type: 'SET_BILLING_ADDRESS'; payload: Address | null }
  | { type: 'SET_SAME_AS_BILLING'; payload: boolean }
  | { type: 'SET_SHIPPING_METHOD'; payload: ShippingMethod }
  | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod }
  | { type: 'SET_SPECIAL_INSTRUCTIONS'; payload: string }
  | { type: 'SET_COUPON_CODE'; payload: string }
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
  setShippingMethod: (method: ShippingMethod) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setSpecialInstructions: (instructions: string) => void
  setCouponCode: (code: string) => void
  setLoading: (loading: boolean) => void
  setError: (field: string, message: string) => void
  clearErrors: () => void
  resetCheckout: () => void
  nextStep: () => void
  prevStep: () => void
}

const initialState: CheckoutState = {
  step: 1,
  customerInfo: null,
  shippingAddress: null,
  billingAddress: null,
  sameAsBilling: true,
  shippingMethod: null,
  paymentMethod: null,
  specialInstructions: '',
  couponCode: '',
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
    case 'SET_SHIPPING_METHOD':
      return { ...state, shippingMethod: action.payload }
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload }
    case 'SET_SPECIAL_INSTRUCTIONS':
      return { ...state, specialInstructions: action.payload }
    case 'SET_COUPON_CODE':
      return { ...state, couponCode: action.payload }
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

  const setShippingMethod = (method: ShippingMethod) => {
    dispatch({ type: 'SET_SHIPPING_METHOD', payload: method })
  }

  const setPaymentMethod = (method: PaymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method })
  }

  const setSpecialInstructions = (instructions: string) => {
    dispatch({ type: 'SET_SPECIAL_INSTRUCTIONS', payload: instructions })
  }

  const setCouponCode = (code: string) => {
    dispatch({ type: 'SET_COUPON_CODE', payload: code })
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

  const contextValue: CheckoutContextType = {
    ...state,
    setStep,
    setCustomerInfo,
    setShippingAddress,
    setBillingAddress,
    setSameAsBilling,
    setShippingMethod,
    setPaymentMethod,
    setSpecialInstructions,
    setCouponCode,
    setLoading,
    setError,
    clearErrors,
    resetCheckout,
    nextStep,
    prevStep,
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