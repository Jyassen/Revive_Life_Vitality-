'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import {
	PaymentElement,
	useStripe,
	useElements,
	Elements,
} from '@stripe/react-stripe-js'
import { getStripe, handleStripeError } from '@/lib/stripe-client'
import { PaymentInfo } from '@/lib/validations/checkout'
import Button from '@/components/ui/Button'

interface StripePaymentFormInnerProps {
	onSubmit: (paymentInfo: PaymentInfo) => Promise<void>
	isLoading?: boolean
	errors?: Record<string, string>
	showSubmitButton?: boolean
	onPaymentReady?: (submitFunction: () => Promise<void>) => void
	customerEmail?: string
}

/**
 * Inner component that has access to Stripe context
 */
function StripePaymentFormInner({
	onSubmit,
	isLoading = false,
	errors = {},
	showSubmitButton = true,
	onPaymentReady,
	customerEmail,
}: StripePaymentFormInnerProps) {
	const stripe = useStripe()
	const elements = useElements()
	const [isProcessing, setIsProcessing] = useState(false)
	const [paymentError, setPaymentError] = useState<string>('')
	const [isPaymentReady, setIsPaymentReady] = useState(false)

	// Expose submit function to parent
	useEffect(() => {
		if (onPaymentReady && stripe && elements && isPaymentReady) {
			onPaymentReady(submitPayment)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stripe, elements, isPaymentReady, onPaymentReady])

	// Handle payment element ready state
	const handlePaymentElementReady = () => {
		setIsPaymentReady(true)
	}

	// Handle payment element change
	const handlePaymentElementChange = (event: { complete: boolean }) => {
		if (paymentError) {
			setPaymentError('')
		}
		setIsPaymentReady(event.complete)
	}

	const submitPayment = async () => {
		if (!stripe || !elements || isLoading || isProcessing) {
			return
		}

		setIsProcessing(true)
		setPaymentError('')

		try {
			// Step 1: Validate the payment form
			const { error: submitError } = await elements.submit()

			if (submitError) {
				setPaymentError(handleStripeError(submitError))
				setIsProcessing(false)
				return
			}

			// Step 2: Confirm the payment with Stripe
			// This actually processes the payment and handles 3D Secure if needed
			const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/checkout/success`,
				},
				redirect: 'if_required', // Only redirect if 3D Secure is required
			})

			if (confirmError) {
				setPaymentError(handleStripeError(confirmError))
				setIsProcessing(false)
				return
			}

			// Payment confirmed successfully!
			// The webhook will now fire (payment_intent.succeeded) and activate the subscription
			const paymentInfo: PaymentInfo = {
				paymentMethod: 'card',
				token: paymentIntent?.id || '',
				billingAddress: null,
				sameAsShipping: false,
			}

			// Step 3: Call parent's onSubmit to verify subscription activation
			await onSubmit(paymentInfo)

		} catch (error) {
			const message = error instanceof Error ? error.message : 'An unexpected error occurred'
			setPaymentError(message)
			console.error('Payment submission error:', error)
		} finally {
			setIsProcessing(false)
		}
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		await submitPayment()
	}

	return (
		<div className="bg-white rounded-2xl p-8 shadow-soft">
			<div className="mb-6">
				<h2 className="font-playfair text-2xl text-brand-dark mb-2">
					Payment Information
				</h2>
				<p className="text-brand-brown">
					Your payment information is secure and encrypted. Card data is processed directly by Stripe.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Loading State */}
				{!stripe || !elements ? (
					<div className="flex items-center justify-center py-8">
						<div className="text-center">
							<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-brown mb-2"></div>
							<p className="text-sm text-brand-brown">Loading secure payment system...</p>
						</div>
					</div>
				) : (
					<>
						{/* Stripe Payment Element */}
						<div className="space-y-4">
							<p className="text-sm font-medium text-brand-brown mb-4">
								🔒 Secure Payment (PCI DSS Level 1 Certified)
							</p>
							
							<PaymentElement
								id="payment-element"
								onReady={handlePaymentElementReady}
								onChange={handlePaymentElementChange}
								options={{
									layout: 'tabs',
									defaultValues: {
										...(customerEmail && {
											billingDetails: {
												email: customerEmail,
											},
										}),
									},
								}}
							/>
						</div>

						{/* Error Display */}
						{(paymentError || errors.payment) && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-4">
								<p className="text-red-600 text-sm">
									{paymentError || errors.payment}
								</p>
							</div>
						)}

						{/* Security Notice */}
						<div className="bg-green-50 border border-green-200 rounded-lg p-4">
							<div className="flex items-start gap-3 text-green-800">
								<span className="text-xl">✓</span>
								<div>
									<p className="text-sm font-semibold mb-1">
										Industry-Leading Security
									</p>
									<p className="text-xs text-green-700">
										Powered by Stripe, trusted by millions of businesses worldwide. 
										Your payment information is encrypted end-to-end and never stored on our servers.
									</p>
								</div>
							</div>
						</div>

						{/* Test Card Helper (Development Only) */}
						{process.env.NODE_ENV === 'development' && (
							<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
								<h4 className="text-sm font-medium text-blue-800 mb-2">
									💳 Test Cards (Development)
								</h4>
								<div className="text-xs text-blue-700 space-y-1">
									<p><strong>Visa:</strong> 4242 4242 4242 4242</p>
									<p><strong>Mastercard:</strong> 5555 5555 5555 4444</p>
									<p><strong>Amex:</strong> 3782 822463 10005</p>
									<p>
										<em>Use any future date for expiry, any 3-digit CVV (4 for Amex), any postal code</em>
									</p>
								</div>
							</div>
						)}

						{/* Submit Button */}
						{showSubmitButton && (
							<Button
								type="submit"
								variant="primary"
								size="lg"
								disabled={!stripe || !elements || !isPaymentReady || isLoading || isProcessing}
								ariaLabel="Complete payment and place order"
								className="w-full"
							>
								{isProcessing 
									? 'Processing Payment...' 
									: isLoading 
									? 'Activating Subscription...' 
									: 'Complete Order'}
							</Button>
						)}
					</>
				)}
			</form>
		</div>
	)
}

interface StripePaymentFormProps extends StripePaymentFormInnerProps {
	clientSecret: string
}

/**
 * Stripe Payment Form Component
 * Wraps the inner form with Stripe Elements provider
 */
export default function StripePaymentForm({
	clientSecret,
	customerEmail,
	...props
}: StripePaymentFormProps) {
	const [stripePromise] = useState(() => getStripe())

	if (!clientSecret) {
		return (
			<div className="bg-white rounded-2xl p-8 shadow-soft">
				<div className="flex items-center justify-center py-8">
					<div className="text-center">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-brown mb-2"></div>
						<p className="text-sm text-brand-brown">Initializing payment...</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<Elements
			stripe={stripePromise}
			options={{
				clientSecret,
				appearance: {
					theme: 'stripe',
					variables: {
						colorPrimary: '#8B7355',
						colorBackground: '#ffffff',
						colorText: '#2C1810',
						colorDanger: '#df1b41',
						fontFamily: 'system-ui, -apple-system, sans-serif',
						spacingUnit: '4px',
						borderRadius: '8px',
						fontSizeBase: '16px',
					},
					rules: {
						'.Input': {
							border: '1px solid rgba(139, 115, 85, 0.3)',
							padding: '12px',
							boxShadow: 'none',
						},
						'.Input:focus': {
							border: '1px solid #8B7355',
							boxShadow: '0 0 0 3px rgba(139, 115, 85, 0.1)',
						},
						'.Input--invalid': {
							border: '1px solid #df1b41',
						},
						'.Label': {
							fontSize: '14px',
							fontWeight: '500',
							color: '#8B7355',
							marginBottom: '8px',
						},
					},
				},
			}}
		>
			<StripePaymentFormInner customerEmail={customerEmail} {...props} />
		</Elements>
	)
}

