/**
 * Clover Secure Payment Integration
 * 
 * This module provides PCI-compliant payment tokenization using Clover's
 * hosted fields. Card data NEVER touches your server.
 * 
 * @see https://docs.clover.com/docs/ecommerce-accepting-payments
 */

// Clover SDK Types
export interface CloverSDK {
	elements: () => CloverElements
	createToken: () => Promise<CloverTokenResponse>
}

export interface CloverElements {
	create: (type: CloverFieldType) => CloverElement
}

export interface CloverElement {
	mount: (selector: string) => void
	addEventListener: (event: string, callback: (event: CloverFieldEvent) => void) => void
	clear: () => void
	destroy: () => void
}

export interface CloverFieldEvent {
	error?: {
		code: string
		message: string
	}
	empty: boolean
	complete: boolean
	focused: boolean
}

export type CloverFieldType = 
	| 'CARD_NUMBER'
	| 'CARD_DATE' 
	| 'CARD_CVV'
	| 'CARD_POSTAL_CODE'

export interface CloverTokenResponse {
	token?: string
	id?: string
	errors?: Array<{
		code: string
		message: string
	}>
}

export interface CloverConfig {
	publishableKey: string
	merchantId: string
	environment: 'sandbox' | 'production'
}

// Field validation state
export interface FieldState {
	cardNumber: boolean
	cardDate: boolean
	cardCvv: boolean
	cardPostal: boolean
}

/**
 * Initialize Clover SDK
 * 
 * @throws {Error} If Clover SDK is not loaded or configuration is invalid
 */
export function initializeClover(config: CloverConfig): CloverSDK {
	const windowWithClover = window as unknown as { Clover?: new (key: string, opts: { merchantId: string }) => CloverSDK }
	
	if (!windowWithClover.Clover) {
		throw new Error('Clover SDK not loaded. Ensure the Clover.js script is included.')
	}

	if (!config.publishableKey || !config.merchantId) {
		throw new Error('Invalid Clover configuration. publishableKey and merchantId are required.')
	}

	return new windowWithClover.Clover(config.publishableKey, {
		merchantId: config.merchantId,
	})
}

/**
 * Load Clover SDK script
 * 
 * @param environment - 'sandbox' or 'production'
 * @returns Promise that resolves when script is loaded
 */
export function loadCloverSDK(environment: 'sandbox' | 'production' = 'sandbox'): Promise<void> {
	return new Promise((resolve, reject) => {
		const scriptUrl = environment === 'production'
			? 'https://checkout.clover.com/sdk.js'
			: 'https://checkout.sandbox.dev.clover.com/sdk.js'

		// Check if already loaded
		const existing = document.querySelector(`script[src="${scriptUrl}"]`)
		if (existing) {
			resolve()
			return
		}

		const script = document.createElement('script')
		script.src = scriptUrl
		script.async = true
		
		script.onload = () => resolve()
		script.onerror = () => reject(new Error('Failed to load Clover SDK'))
		
		document.head.appendChild(script)
	})
}

/**
 * Create and mount Clover hosted fields
 * 
 * @param clover - Initialized Clover SDK instance
 * @param onFieldChange - Callback for field state changes
 * @returns Object containing mounted elements
 */
export function createHostedFields(
	clover: CloverSDK,
	onFieldChange?: (field: CloverFieldType, state: CloverFieldEvent) => void
): {
	elements: Record<CloverFieldType, CloverElement>
	destroy: () => void
} {
	const elements = clover.elements()
	
	const cardNumber = elements.create('CARD_NUMBER')
	const cardDate = elements.create('CARD_DATE')
	const cardCvv = elements.create('CARD_CVV')
	const cardPostal = elements.create('CARD_POSTAL_CODE')

	const fieldElements = {
		CARD_NUMBER: cardNumber,
		CARD_DATE: cardDate,
		CARD_CVV: cardCvv,
		CARD_POSTAL_CODE: cardPostal,
	}

	// Mount elements
	const mountField = (element: CloverElement, selector: string, fieldType: CloverFieldType) => {
		try {
			const container = document.querySelector(selector)
			if (!container) {
				throw new Error(`Container ${selector} not found`)
			}
			element.mount(selector)

			// Add event listeners if callback provided
			if (onFieldChange) {
				element.addEventListener('change', (event) => {
					onFieldChange(fieldType, event)
				})
				element.addEventListener('blur', (event) => {
					onFieldChange(fieldType, event)
				})
			}
		} catch (error) {
			console.error(`Failed to mount field ${fieldType}:`, error)
			throw error
		}
	}

	mountField(cardNumber, '#card-number', 'CARD_NUMBER')
	mountField(cardDate, '#card-date', 'CARD_DATE')
	mountField(cardCvv, '#card-cvv', 'CARD_CVV')
	mountField(cardPostal, '#card-postal', 'CARD_POSTAL_CODE')

	return {
		elements: fieldElements,
		destroy: () => {
			Object.values(fieldElements).forEach(el => {
				try {
					el.destroy()
				} catch (e) {
					console.warn('Error destroying field:', e)
				}
			})
		}
	}
}

/**
 * Tokenize payment using Clover hosted fields
 * 
 * This creates a secure token WITHOUT sending card data to your server.
 * 
 * @param clover - Initialized Clover SDK instance
 * @returns Promise resolving to secure token
 * @throws {Error} If tokenization fails
 */
export async function tokenizePayment(clover: CloverSDK): Promise<string> {
	try {
		const result = await clover.createToken()

		if (result.errors && result.errors.length > 0) {
			const error = result.errors[0]
			throw new Error(error.message || 'Tokenization failed')
		}

		const token = result.token || result.id
		
		if (!token) {
			throw new Error('No token returned from Clover')
		}

		return token
	} catch (error) {
		if (error instanceof Error) {
			throw error
		}
		throw new Error('Tokenization failed')
	}
}

/**
 * Get Clover configuration from environment variables
 * 
 * @throws {Error} If required environment variables are missing
 */
export function getCloverConfig(): CloverConfig {
	const publishableKey = process.env.NEXT_PUBLIC_CLOVER_PUBLISHABLE_KEY
	const merchantId = process.env.NEXT_PUBLIC_CLOVER_MERCHANT_ID
	const environment = process.env.NEXT_PUBLIC_CLOVER_ENVIRONMENT

	if (!publishableKey || !merchantId) {
		throw new Error(
			'Missing Clover configuration. Please set NEXT_PUBLIC_CLOVER_PUBLISHABLE_KEY and NEXT_PUBLIC_CLOVER_MERCHANT_ID'
		)
	}

	return {
		publishableKey,
		merchantId,
		environment: environment === 'production' ? 'production' : 'sandbox',
	}
}

/**
 * Validate that all hosted fields are complete
 */
export function validateFields(fieldStates: FieldState): boolean {
	return Object.values(fieldStates).every(complete => complete === true)
}

/**
 * Apply custom styling to Clover hosted fields
 * 
 * Note: Clover has limited styling options for security.
 * Use their provided CSS classes and customize the container.
 */
export const CLOVER_FIELD_STYLES = {
	container: 'border border-gray-300 rounded-lg px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-brand-brown focus-within:border-brand-brown transition-all',
	label: 'block text-sm font-medium text-brand-brown mb-2',
	error: 'text-red-600 text-sm mt-1',
	hint: 'text-gray-500 text-xs mt-1',
} as const

