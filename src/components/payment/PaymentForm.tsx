'use client'

import React, { useState, useEffect, useRef } from 'react'
import { PaymentInfo } from '@/lib/validations/checkout'
import FormField from '@/components/forms/FormField'
import Button from '@/components/ui/Button'
import { Address } from '@/lib/validations/checkout'
import {
	loadCloverSDK,
	initializeClover,
	createHostedFields,
	tokenizePayment,
	getCloverConfig,
	validateFields,
	CloverSDK,
	CloverElement,
	FieldState,
	CloverFieldType,
	CloverFieldEvent,
	CLOVER_FIELD_STYLES
} from '@/lib/clover-secure'

interface PaymentFormProps {
	onSubmit: (paymentInfo: PaymentInfo) => Promise<void>
	isLoading?: boolean
	errors?: Record<string, string>
	billingAddress?: Address | null
	sameAsShipping?: boolean
	onBillingAddressChange?: (address: Address) => void
	onSameAsShippingChange?: (same: boolean) => void
	showSubmitButton?: boolean
	onPaymentReady?: (submitFunction: () => Promise<void>) => void
}

export default function PaymentForm({
	onSubmit,
	isLoading = false,
	errors = {},
	billingAddress,
	sameAsShipping = true,
	onSameAsShippingChange,
	showSubmitButton = true,
	onPaymentReady
}: PaymentFormProps) {
	const [isSDKLoaded, setIsSDKLoaded] = useState(false)
	const [isFieldsReady, setIsFieldsReady] = useState(false)
	const [isTokenizing, setIsTokenizing] = useState(false)
	const [tokenError, setTokenError] = useState<string>('')
	const [cardholderName, setCardholderName] = useState('')
	const [fieldStates, setFieldStates] = useState<FieldState>({
		cardNumber: false,
		cardDate: false,
		cardCvv: false,
		cardPostal: false,
	})

	const cloverRef = useRef<CloverSDK | null>(null)
	const fieldsRef = useRef<{ elements: Record<CloverFieldType, CloverElement>; destroy: () => void } | null>(null)

	// Load Clover SDK on mount
	useEffect(() => {
		let mounted = true

		async function loadSDK() {
			try {
				const config = getCloverConfig()
				await loadCloverSDK(config.environment)
				
				if (!mounted) return

				setIsSDKLoaded(true)
			} catch (error) {
				if (!mounted) return
				
				const message = error instanceof Error ? error.message : 'Failed to load payment system'
				setTokenError(message)
				console.error('Clover SDK load error:', error)
			}
		}

		loadSDK()

		return () => {
			mounted = false
		}
	}, [])

	// Initialize Clover and create hosted fields when SDK is loaded
	useEffect(() => {
		if (!isSDKLoaded) return
		if (fieldsRef.current) return // Already initialized

		let mounted = true

		async function initializeFields() {
			try {
				const config = getCloverConfig()
				const clover = initializeClover(config)
				
				if (!mounted) return

				cloverRef.current = clover

				// Wait for DOM elements to be ready
				await new Promise(resolve => setTimeout(resolve, 100))

				const handleFieldChange = (fieldType: CloverFieldType, event: CloverFieldEvent) => {
					if (!mounted) return

					// Map field type to state key
					const fieldMap: Record<CloverFieldType, keyof FieldState> = {
						'CARD_NUMBER': 'cardNumber',
						'CARD_DATE': 'cardDate',
						'CARD_CVV': 'cardCvv',
						'CARD_POSTAL_CODE': 'cardPostal',
					}

					const stateKey = fieldMap[fieldType]
					
					setFieldStates(prev => ({
						...prev,
						[stateKey]: event.complete && !event.error,
					}))

					// Clear error when user starts typing
					if (tokenError) {
						setTokenError('')
					}
				}

				const fields = createHostedFields(clover, handleFieldChange)
				
				if (!mounted) return

				fieldsRef.current = fields
				setIsFieldsReady(true)

			} catch (error) {
				if (!mounted) return
				
				const message = error instanceof Error ? error.message : 'Failed to initialize payment fields'
				setTokenError(message)
				console.error('Clover initialization error:', error)
			}
		}

		initializeFields()

		return () => {
			mounted = false
			if (fieldsRef.current) {
				fieldsRef.current.destroy()
				fieldsRef.current = null
			}
		}
	}, [isSDKLoaded, tokenError])

	// Tokenize and submit payment
	const submitPayment = async () => {
		if (isLoading || isTokenizing || !isFieldsReady) return

		// Validate all fields are complete
		if (!validateFields(fieldStates)) {
			setTokenError('Please complete all payment fields')
			return
		}

		// Validate cardholder name
		if (!cardholderName.trim()) {
			setTokenError('Cardholder name is required')
			return
		}

		// Ensure billing address is provided
		if (!billingAddress) {
			setTokenError('Billing address is required')
			return
		}

		setIsTokenizing(true)
		setTokenError('')

		try {
			if (!cloverRef.current) {
				throw new Error('Payment system not initialized')
			}

			// Tokenize using Clover hosted fields (card data NEVER touches your server)
			const token = await tokenizePayment(cloverRef.current)

			// Prepare payment info with only the secure token
			const paymentInfo: PaymentInfo = {
				paymentMethod: 'card',
				token: token,
				billingAddress: billingAddress,
				sameAsShipping: sameAsShipping
			}

			// Submit payment info to your server
			await onSubmit(paymentInfo)

			// Clear cardholder name after successful submission
			setCardholderName('')
			setFieldStates({
				cardNumber: false,
				cardDate: false,
				cardCvv: false,
				cardPostal: false,
			})

		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to process payment'
			setTokenError(message)
			console.error('Payment submission error:', error)
		} finally {
			setIsTokenizing(false)
		}
	}

	// Expose submit function to parent
	useEffect(() => {
		if (onPaymentReady && isFieldsReady) {
			onPaymentReady(submitPayment)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFieldsReady, onPaymentReady])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await submitPayment()
	}

	const isFormValid = validateFields(fieldStates) && cardholderName.trim().length > 0

	return (
		<div className="bg-white rounded-2xl p-8 shadow-soft">
			<div className="mb-6">
				<h2 className="font-playfair text-2xl text-brand-dark mb-2">
					Payment Information
				</h2>
				<p className="text-brand-brown">
					Your payment information is secure and encrypted. Card data never touches our servers.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Loading State */}
				{!isSDKLoaded && (
					<div className="flex items-center justify-center py-8">
						<div className="text-center">
							<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-brown mb-2"></div>
							<p className="text-sm text-brand-brown">Loading secure payment system...</p>
						</div>
					</div>
				)}

				{/* Secure Hosted Fields */}
				{isSDKLoaded && (
					<>
						<div className="space-y-4">
							<p className="text-sm font-medium text-brand-brown mb-4">🔒 Secure Card Entry (PCI Compliant)</p>
							
							<div className="grid md:grid-cols-2 gap-4">
								<div className="md:col-span-2">
									<label className={CLOVER_FIELD_STYLES.label}>
										Card Number
									</label>
									<div 
										id="card-number" 
										className={CLOVER_FIELD_STYLES.container}
										style={{ minHeight: '48px' }}
									/>
								</div>
								
								<div>
									<label className={CLOVER_FIELD_STYLES.label}>
										Expiration Date
									</label>
									<div 
										id="card-date" 
										className={CLOVER_FIELD_STYLES.container}
										style={{ minHeight: '48px' }}
									/>
								</div>
								
								<div>
									<label className={CLOVER_FIELD_STYLES.label}>
										CVV
									</label>
									<div 
										id="card-cvv" 
										className={CLOVER_FIELD_STYLES.container}
										style={{ minHeight: '48px' }}
									/>
								</div>
								
								<div className="md:col-span-2">
									<label className={CLOVER_FIELD_STYLES.label}>
										Billing Postal Code
									</label>
									<div 
										id="card-postal" 
										className={CLOVER_FIELD_STYLES.container}
										style={{ minHeight: '48px' }}
									/>
								</div>
							</div>

							{!isFieldsReady && isSDKLoaded && (
								<p className="text-xs text-brand-brown">Initializing secure payment fields...</p>
							)}
						</div>

						{/* Cardholder Name - only non-sensitive field we collect */}
						<FormField
							label="Cardholder Name"
							name="cardholderName"
							placeholder="John Doe"
							value={cardholderName}
							onChange={(value) => setCardholderName(value)}
							error={errors.cardholderName}
							required
						/>
					</>
				)}

				{/* Billing Address Toggle */}
				<div className="pt-4 border-t border-brand-brown/20">
					<div className="flex items-start gap-3">
						<input
							id="sameAsShipping"
							name="sameAsShipping"
							type="checkbox"
							checked={sameAsShipping}
							onChange={(e) => onSameAsShippingChange?.(e.target.checked)}
							className="mt-1 w-4 h-4 text-brand-brown bg-white border-brand-brown/30 rounded focus:ring-brand-brown/50 focus:ring-2"
						/>
						<label 
							htmlFor="sameAsShipping"
							className="text-sm text-brand-brown leading-relaxed cursor-pointer"
						>
							Billing address same as shipping address
						</label>
					</div>
				</div>

				{/* Error Display */}
				{tokenError && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4">
						<p className="text-red-600 text-sm">{tokenError}</p>
					</div>
				)}

				{/* Security Notice */}
				<div className="bg-green-50 border border-green-200 rounded-lg p-4">
					<div className="flex items-start gap-3 text-green-800">
						<span className="text-xl">✓</span>
						<div>
							<p className="text-sm font-semibold mb-1">PCI Compliant Secure Payment</p>
							<p className="text-xs text-green-700">
								Your card information is encrypted and tokenized directly by Clover. 
								Card data never passes through our servers, ensuring maximum security.
							</p>
						</div>
					</div>
				</div>

				{/* Test Card Helper (Development Only) */}
				{process.env.NODE_ENV === 'development' && (
					<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
						<h4 className="text-sm font-medium text-blue-800 mb-2">💳 Test Cards (Development)</h4>
						<div className="text-xs text-blue-700 space-y-1">
							<p><strong>Visa:</strong> 4005 5192 0000 0004</p>
							<p><strong>Mastercard:</strong> 5496 9810 0000 0000</p>
							<p><em>Use any future date for expiry, any 3-digit CVV, any postal code</em></p>
						</div>
					</div>
				)}

				{/* Submit Button */}
				{showSubmitButton && (
					<Button
						type="submit"
						variant="primary"
						size="lg"
						disabled={!isFormValid || isLoading || isTokenizing || !isFieldsReady}
						ariaLabel="Complete payment and place order"
						className="w-full"
					>
						{isTokenizing ? 'Securing Payment...' : isLoading ? 'Processing...' : 'Complete Order'}
					</Button>
				)}
			</form>
		</div>
	)
}