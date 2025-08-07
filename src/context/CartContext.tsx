'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

import type { PackageConfig } from '@/types/package'

// Cart item interface
export interface CartItem {
	id: string
	name: string
	price: string
	image: string
	quantity: number
	category?: string
	packageConfig?: PackageConfig
}

// Cart state interface
interface CartState {
	items: CartItem[]
	totalCount: number
	totalPrice: number
}

// Cart actions
type CartAction =
	| { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
	| { type: 'REMOVE_ITEM'; payload: { id: string } }
	| { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
	| { type: 'CLEAR_CART' }

// Cart context interface
interface CartContextType extends CartState {
	addItem: (item: Omit<CartItem, 'quantity'>) => void
	removeItem: (id: string) => void
	updateQuantity: (id: string, quantity: number) => void
	clearCart: () => void
}

// Initial state
const initialState: CartState = {
	items: [],
	totalCount: 0,
	totalPrice: 0,
}

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
	const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
	const totalPrice = items.reduce((sum, item) => {
		const price = parseFloat(item.price.replace('$', ''))
		return sum + price * item.quantity
	}, 0)
	
	return { totalCount, totalPrice }
}

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
	switch (action.type) {
		case 'ADD_ITEM': {
			const existingItemIndex = state.items.findIndex(
				item => item.id === action.payload.id
			)
			
			let newItems: CartItem[]
			
			if (existingItemIndex >= 0) {
				// Item exists, increase quantity
				newItems = state.items.map((item, index) =>
					index === existingItemIndex
						? { ...item, quantity: item.quantity + 1 }
						: item
				)
			} else {
				// New item, add to cart
				newItems = [...state.items, { ...action.payload, quantity: 1 }]
			}
			
			const { totalCount, totalPrice } = calculateTotals(newItems)
			
			return {
				items: newItems,
				totalCount,
				totalPrice,
			}
		}
		
		case 'REMOVE_ITEM': {
			const newItems = state.items.filter(item => item.id !== action.payload.id)
			const { totalCount, totalPrice } = calculateTotals(newItems)
			
			return {
				items: newItems,
				totalCount,
				totalPrice,
			}
		}
		
		case 'UPDATE_QUANTITY': {
			const newItems = state.items
				.map(item =>
					item.id === action.payload.id
						? { ...item, quantity: action.payload.quantity }
						: item
				)
				.filter(item => item.quantity > 0) // Remove items with quantity 0
			
			const { totalCount, totalPrice } = calculateTotals(newItems)
			
			return {
				items: newItems,
				totalCount,
				totalPrice,
			}
		}
		
		case 'CLEAR_CART': {
			return initialState
		}
		
		default:
			return state
	}
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart provider component
interface CartProviderProps {
	children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, initialState)
	
	const addItem = (item: Omit<CartItem, 'quantity'>) => {
		dispatch({ type: 'ADD_ITEM', payload: item })
	}
	
	const removeItem = (id: string) => {
		dispatch({ type: 'REMOVE_ITEM', payload: { id } })
	}
	
	const updateQuantity = (id: string, quantity: number) => {
		dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
	}
	
	const clearCart = () => {
		dispatch({ type: 'CLEAR_CART' })
	}
	
	const contextValue: CartContextType = {
		...state,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
	}
	
	return (
		<CartContext.Provider value={contextValue}>
			{children}
		</CartContext.Provider>
	)
}

// Custom hook to use cart context
export const useCart = (): CartContextType => {
	const context = useContext(CartContext)
	if (context === undefined) {
		throw new Error('useCart must be used within a CartProvider')
	}
	return context
} 