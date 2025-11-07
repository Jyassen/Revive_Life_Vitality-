'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { CheckoutProvider, useCheckout } from '@/context/CheckoutContext'
import ConfiguredPackageDisplay from '@/components/cart/ConfiguredPackageDisplay'
import FormField from '@/components/forms/FormField'
import Button from '@/components/ui/Button'
import StripePaymentForm from '@/components/payment/StripePaymentForm'
import Image from 'next/image'
import { customerInfoSchema, addressSchema, OrderSummary, PaymentInfo } from '@/lib/validations/checkout'

interface CheckoutFormData {
	firstName: string
	lastName: string
	email: string
	phone: string
	marketingConsent: boolean
	shippingFirstName: string
	shippingLastName: string
	address1: string
	address2: string
	city: string
	state: string
	zipCode: string
	country: string
	specialInstructions: string
}

interface CartItem {
	id: string
	name: string
	price: string
	quantity: number
	image?: string
	recurring?: boolean
	type?: string
}

// Helper function to detect if item is a subscription
function isSubscriptionItem(item: CartItem): boolean {
	// Check if item has subscription metadata or specific product name
	return item.name?.toLowerCase().includes('club') || 
	       item.name?.toLowerCase().includes('subscription') ||
	       item.recurring === true ||
	       item.type === 'subscription'
}

function CheckoutContent() {
	const { items, totalPrice, clearCart } = useCart()
	const { 
		customerInfo, 
		setCustomerInfo,
		shippingAddress, 
		setShippingAddress,
		orderSummary,
		setOrderSummary,
		errors, 
		setError, 
		clearErrors,
		isLoading,
		setLoading,
	} = useCheckout()
	const router = useRouter()

	const [currentStep, setCurrentStep] = useState<'info' | 'payment'>('info')
	const [clientSecret, setClientSecret] = useState<string>('')
	const [paymentIntentId, setPaymentIntentId] = useState<string>('')
	const [subscriptionId, setSubscriptionId] = useState<string>('')
	const [customerId, setCustomerId] = useState<string>('')
	const [isSubscription, setIsSubscription] = useState(false)
	const [loadingMessage, setLoadingMessage] = useState<string>('')

	useEffect(() => {
		if (items.length === 0) {
			router.push('/cart')
		} else {
			// Detect if this is a subscription checkout
			const hasSubscription = items.some(item => isSubscriptionItem(item))
			setIsSubscription(hasSubscription)
		}
	}, [items, router])

	// Calculate order summary
	useEffect(() => {
		const subtotal = totalPrice
		const shipping = 10.00
		const discount = 0
		const tax = 0
		const total = Math.max(0, subtotal - discount) + shipping
		const summary: OrderSummary = { subtotal, tax, shipping, discount, total }
		setOrderSummary(summary)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalPrice])

	const [formData, setFormData] = useState<CheckoutFormData>({
		firstName: customerInfo?.firstName || '',
		lastName: customerInfo?.lastName || '',
		email: customerInfo?.email || '',
		phone: customerInfo?.phone || '',
		marketingConsent: customerInfo?.marketingConsent || false,
		shippingFirstName: shippingAddress?.firstName || '',
		shippingLastName: shippingAddress?.lastName || '',
		address1: shippingAddress?.address1 || '',
		address2: shippingAddress?.address2 || '',
		city: shippingAddress?.city || '',
		state: shippingAddress?.state || '',
		zipCode: shippingAddress?.zipCode || '',
		country: shippingAddress?.country || 'US',
		specialInstructions: ''
	})

	const states = [
		{ value: 'AL', label: 'Alabama' },
		{ value: 'AK', label: 'Alaska' },
		{ value: 'AZ', label: 'Arizona' },
		{ value: 'AR', label: 'Arkansas' },
		{ value: 'CA', label: 'California' },
		{ value: 'CO', label: 'Colorado' },
		{ value: 'CT', label: 'Connecticut' },
		{ value: 'DE', label: 'Delaware' },
		{ value: 'FL', label: 'Florida' },
		{ value: 'GA', label: 'Georgia' },
		{ value: 'HI', label: 'Hawaii' },
		{ value: 'ID', label: 'Idaho' },
		{ value: 'IL', label: 'Illinois' },
		{ value: 'IN', label: 'Indiana' },
		{ value: 'IA', label: 'Iowa' },
		{ value: 'KS', label: 'Kansas' },
		{ value: 'KY', label: 'Kentucky' },
		{ value: 'LA', label: 'Louisiana' },
		{ value: 'ME', label: 'Maine' },
		{ value: 'MD', label: 'Maryland' },
		{ value: 'MA', label: 'Massachusetts' },
		{ value: 'MI', label: 'Michigan' },
		{ value: 'MN', label: 'Minnesota' },
		{ value: 'MS', label: 'Mississippi' },
		{ value: 'MO', label: 'Missouri' },
		{ value: 'MT', label: 'Montana' },
		{ value: 'NE', label: 'Nebraska' },
		{ value: 'NV', label: 'Nevada' },
		{ value: 'NH', label: 'New Hampshire' },
		{ value: 'NJ', label: 'New Jersey' },
		{ value: 'NM', label: 'New Mexico' },
		{ value: 'NY', label: 'New York' },
		{ value: 'NC', label: 'North Carolina' },
		{ value: 'ND', label: 'North Dakota' },
		{ value: 'OH', label: 'Ohio' },
		{ value: 'OK', label: 'Oklahoma' },
		{ value: 'OR', label: 'Oregon' },
		{ value: 'PA', label: 'Pennsylvania' },
		{ value: 'RI', label: 'Rhode Island' },
		{ value: 'SC', label: 'South Carolina' },
		{ value: 'SD', label: 'South Dakota' },
		{ value: 'TN', label: 'Tennessee' },
		{ value: 'TX', label: 'Texas' },
		{ value: 'UT', label: 'Utah' },
		{ value: 'VT', label: 'Vermont' },
		{ value: 'VA', label: 'Virginia' },
		{ value: 'WA', label: 'Washington' },
		{ value: 'WV', label: 'West Virginia' },
		{ value: 'WI', label: 'Wisconsin' },
		{ value: 'WY', label: 'Wyoming' }
	]

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev: CheckoutFormData) => ({ ...prev, [field]: value }))
	}

	const copyCustomerNameToShipping = () => {
		setFormData((prev: CheckoutFormData) => ({
			...prev,
			shippingFirstName: prev.firstName,
			shippingLastName: prev.lastName
		}))
	}

	const handleCustomerShippingSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		clearErrors()

		let hasErrors = false

		try {
			const customerData = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				phone: formData.phone,
				marketingConsent: formData.marketingConsent
			}
			customerInfoSchema.parse(customerData)
		} catch (error: unknown) {
			hasErrors = true
			if (error && typeof error === 'object' && 'errors' in error) {
				const zodError = error as { errors: Array<{ path: string[]; message: string }> }
				zodError.errors.forEach((err) => {
					setError(err.path[0], err.message)
				})
			}
		}

		try {
			const shippingData = {
				firstName: formData.shippingFirstName || formData.firstName,
				lastName: formData.shippingLastName || formData.lastName,
				address1: formData.address1,
				address2: formData.address2,
				city: formData.city,
				state: formData.state,
				zipCode: formData.zipCode,
				country: formData.country
			}
			addressSchema.parse(shippingData)
		} catch (error: unknown) {
			hasErrors = true
			if (error && typeof error === 'object' && 'errors' in error) {
				const zodError = error as { errors: Array<{ path: string[]; message: string }> }
				zodError.errors.forEach((err) => {
					const fieldPath = err.path[0]
					let errorField = fieldPath
					if (fieldPath === 'firstName' && !formData.shippingFirstName) {
						errorField = 'shippingFirstName'
					} else if (fieldPath === 'lastName' && !formData.shippingLastName) {
						errorField = 'shippingLastName'
					}
					setError(errorField, err.message)
				})
			}
		}

		if (!hasErrors) {
			const customerData = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				phone: formData.phone,
				marketingConsent: formData.marketingConsent
			}
			const shippingData = {
				firstName: formData.shippingFirstName || formData.firstName,
				lastName: formData.shippingLastName || formData.lastName,
				address1: formData.address1,
				address2: formData.address2,
				city: formData.city,
				state: formData.state,
				zipCode: formData.zipCode,
				country: formData.country
			}
			
			setCustomerInfo(customerData)
			setShippingAddress(shippingData)

			// Create appropriate payment flow
			if (isSubscription) {
				await createSubscription(customerData, shippingData)
			} else {
				await createPaymentIntent(customerData, shippingData)
			}
		}
	}

	// Create Payment Intent for one-time purchase
	const createPaymentIntent = async (customerData: typeof customerInfo, _shippingData: typeof shippingAddress) => {
		try {
			setLoading(true)
			
			const response = await fetch('/api/stripe/create-payment-intent', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					items: items.map(i => ({
						id: i.id,
						name: i.name,
						price: parseFloat(i.price.replace('$', '')),
						quantity: i.quantity,
						image: i.image,
					})),
					customer: customerData,
					summary: orderSummary,
					specialInstructions: formData.specialInstructions || undefined,
				}),
			})

			const data = await response.json()

			if (!response.ok || !data?.clientSecret) {
				setError('payment', data?.error || data?.message || 'Unable to initialize payment')
				return
			}

			setClientSecret(data.clientSecret)
			setPaymentIntentId(data.paymentIntentId)
			setCurrentStep('payment')

		} catch (error) {
			console.error('Payment intent creation error:', error)
			setError('payment', 'Failed to initialize payment. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	// Create Subscription for recurring purchase
	const createSubscription = async (customerData: typeof customerInfo, shippingData: typeof shippingAddress) => {
		try {
			setLoading(true)
			
			// Get Price ID from environment variable or use placeholder for development
			const priceId = process.env.NEXT_PUBLIC_REVIVE_CLUB_PRICE_ID || 'price_REVIVE_CLUB_WEEKLY'
			
			if (priceId === 'price_REVIVE_CLUB_WEEKLY') {
				setError('payment', 'Subscription product not configured. Please contact support.')
				setLoading(false)
				return
			}

			const response = await fetch('/api/stripe/create-subscription', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					priceId: priceId,
					customer: customerData,
					shippingAddress: shippingData,
					metadata: {
						product_name: items[0]?.name || 'Revive Club',
						special_instructions: formData.specialInstructions || '',
					},
				}),
			})

			const data = await response.json()

			if (!response.ok || !data?.clientSecret) {
				setError('payment', data?.error || data?.message || 'Unable to initialize subscription')
				return
			}

			setClientSecret(data.clientSecret)
			setSubscriptionId(data.subscriptionId)
			setCustomerId(data.customerId)
			setCurrentStep('payment')

		} catch (error) {
			console.error('Subscription creation error:', error)
			setError('payment', 'Failed to initialize subscription. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	// Handle payment submission (works for both one-time and subscription)
	const handlePaymentSubmit = async (_paymentInfo: PaymentInfo) => {
		try {
			setLoading(true)
			clearErrors()

			const endpoint = isSubscription ? '/api/stripe/confirm-subscription' : '/api/stripe/confirm-payment'
			const payload = isSubscription ? {
				subscriptionId: subscriptionId,
				customerId: customerId,
				customer: customerInfo,
				shippingAddress: shippingAddress,
			} : {
				paymentIntentId: paymentIntentId,
				items: items.map(i => ({
					id: i.id,
					name: i.name,
					price: parseFloat(i.price.replace('$', '')),
					quantity: i.quantity,
					image: i.image,
				})),
				customer: customerInfo,
				shippingAddress: shippingAddress,
				summary: orderSummary,
				specialInstructions: formData.specialInstructions || undefined,
			}

			// For subscriptions, we need to poll until the webhook activates it
			if (isSubscription) {
				let attempts = 0
				const maxAttempts = 10
				const baseDelay = 1000 // 1 second

				// Initial loading message
				setLoadingMessage('Processing payment...')

				while (attempts < maxAttempts) {
					// Update loading message based on attempts
					if (attempts === 0) {
						setLoadingMessage('Processing payment...')
					} else if (attempts < 3) {
						setLoadingMessage('Activating subscription...')
					} else {
						setLoadingMessage('Finalizing your subscription...')
					}

					const response = await fetch(endpoint, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload),
					})

					const data = await response.json()

					if (response.ok) {
						// Success! Subscription is now active
						setLoadingMessage('Success! Redirecting...')
						clearCart()
						router.push(`/checkout/success?order_id=${data.orderId || data.subscriptionId}&subscription=true`)
						return
					} else if (response.status === 402 && data.status === 'incomplete') {
						// Subscription is still being processed by webhook
						// Wait with exponential backoff and retry
						attempts++
						if (attempts < maxAttempts) {
							const delay = baseDelay * Math.pow(1.5, attempts)
							await new Promise(resolve => setTimeout(resolve, delay))
							continue
						} else {
							// Timeout - webhook might be slow
							setLoadingMessage('')
							setError('payment', 'Subscription is being activated. Please check your email for confirmation or refresh this page in a moment.')
							return
						}
					} else {
						// Other error (not just incomplete status)
						setLoadingMessage('')
						setError('payment', data?.message || 'Subscription activation failed')
						return
					}
				}
			} else {
				// One-time payment - no polling needed
				const response = await fetch(endpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				})

				const data = await response.json()

				if (!response.ok) {
					setError('payment', data?.message || 'Payment failed')
					return
				}

				// Success! Clear cart and redirect
				clearCart()
				router.push(`/checkout/success?order_id=${data.orderId || data.subscriptionId}`)
			}

		} catch (error) {
			console.error('Payment confirmation error:', error)
			setError('payment', 'Failed to process payment. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	if (items.length === 0) {
		return null
	}

	return (
		<div className="min-h-screen bg-brand-beige">
			<div className="container-custom section-padding">
				<div className="max-w-6xl mx-auto">
					<h1 className="font-playfair text-4xl lg:text-5xl mb-8 text-center text-brand-dark">
						Checkout
					</h1>

					{/* Progress Indicator */}
					<div className="mb-8">
						<div className="flex items-center justify-center gap-4">
							<div className={`flex items-center ${currentStep === 'info' ? 'text-brand-brown' : 'text-brand-green'}`}>
								<div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${currentStep === 'info' ? 'bg-brand-brown' : 'bg-brand-green'}`}>
									{currentStep === 'payment' ? '✓' : '1'}
								</div>
								<span className="ml-2 font-medium">Information</span>
							</div>
							<div className="w-12 h-0.5 bg-brand-brown/30"></div>
							<div className={`flex items-center ${currentStep === 'payment' ? 'text-brand-brown' : 'text-brand-brown/40'}`}>
								<div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${currentStep === 'payment' ? 'bg-brand-brown' : 'bg-brand-brown/40'}`}>
									2
								</div>
								<span className="ml-2 font-medium">Payment</span>
							</div>
						</div>
					</div>

					{/* Subscription Badge */}
					{isSubscription && (
						<div className="mb-6 text-center">
							<div className="inline-block bg-brand-green text-white px-4 py-2 rounded-full text-sm font-medium">
								🔄 Weekly Subscription - Cancel Anytime
							</div>
						</div>
					)}

					<div className="grid lg:grid-cols-3 gap-12">
						{/* Checkout Form */}
						<div className="lg:col-span-2">
							{currentStep === 'info' && (
								<form onSubmit={handleCustomerShippingSubmit} className="space-y-8">
									{/* Contact Information */}
									<div className="bg-white rounded-2xl p-8 shadow-soft">
										<div className="mb-6">
											<h2 className="font-playfair text-2xl text-brand-dark mb-2">
												Contact Information
											</h2>
											<p className="text-brand-brown">
												We&apos;ll use this information to send you order updates and receipts.
											</p>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
											<FormField
												label="First Name"
												name="firstName"
												type="text"
												placeholder="John"
												value={formData.firstName}
												onChange={(value) => handleInputChange('firstName', value)}
												error={errors.firstName}
												required
											/>
											
											<FormField
												label="Last Name"
												name="lastName"
												type="text"
												placeholder="Doe"
												value={formData.lastName}
												onChange={(value) => handleInputChange('lastName', value)}
												error={errors.lastName}
												required
											/>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
											<FormField
												label="Email Address"
												name="email"
												type="email"
												placeholder="your@email.com"
												value={formData.email}
												onChange={(value) => handleInputChange('email', value)}
												error={errors.email}
												required
											/>

											<FormField
												label="Phone Number"
												name="phone"
												type="tel"
												placeholder="(555) 123-4567"
												value={formData.phone}
												onChange={(value) => handleInputChange('phone', value)}
												error={errors.phone}
											/>
										</div>

										<div className="flex items-start gap-3 pt-2">
											<input
												id="marketingConsent"
												name="marketingConsent"
												type="checkbox"
												checked={formData.marketingConsent}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('marketingConsent', e.target.checked)}
												className="mt-1 w-4 h-4 text-brand-brown bg-white border-brand-brown/30 rounded focus:ring-brand-brown/50 focus:ring-2"
											/>
											<label 
												htmlFor="marketingConsent"
												className="text-sm text-brand-brown leading-relaxed cursor-pointer"
											>
												I&apos;d like to receive email updates about new products, wellness tips, and exclusive offers. 
												You can unsubscribe at any time.
											</label>
										</div>
									</div>

									{/* Shipping Address - rest of form stays the same... */}
									<div className="bg-white rounded-2xl p-8 shadow-soft">
										<div className="mb-6">
											<h2 className="font-playfair text-2xl text-brand-dark mb-2">
												Shipping Address
											</h2>
											<p className="text-brand-brown">
												Where would you like your wellness shots delivered?
											</p>
										</div>

										<div className="grid md:grid-cols-2 gap-6 mb-6">
											<FormField
												label="First Name"
												name="shippingFirstName"
												placeholder={formData.firstName || 'John'}
												value={formData.shippingFirstName}
												onChange={(value) => handleInputChange('shippingFirstName', value)}
												error={errors.shippingFirstName}
												required
											/>

											<FormField
												label="Last Name"
												name="shippingLastName"
												placeholder={formData.lastName || 'Doe'}
												value={formData.shippingLastName}
												onChange={(value) => handleInputChange('shippingLastName', value)}
												error={errors.shippingLastName}
												required
											/>
										</div>

										{formData.firstName && formData.lastName && (
											<div className="mb-4">
												<button
													type="button"
													onClick={copyCustomerNameToShipping}
													className="text-sm text-brand-brown hover:text-brand-dark underline"
												>
													Use same name as contact information
												</button>
											</div>
										)}

										<div className="space-y-6">
											<FormField
												label="Street Address"
												name="address1"
												placeholder="123 Main Street"
												value={formData.address1}
												onChange={(value) => handleInputChange('address1', value)}
												error={errors.address1}
												required
											/>

											<FormField
												label="Apartment, suite, etc."
												name="address2"
												placeholder="Apt 4B (optional)"
												value={formData.address2}
												onChange={(value) => handleInputChange('address2', value)}
												error={errors.address2}
											/>

											<div className="grid md:grid-cols-3 gap-6">
												<FormField
													label="City"
													name="city"
													placeholder="San Francisco"
													value={formData.city}
													onChange={(value) => handleInputChange('city', value)}
													error={errors.city}
													required
												/>

												<FormField
													label="State"
													name="state"
													type="select"
													placeholder="Select state"
													value={formData.state}
													onChange={(value) => handleInputChange('state', value)}
													error={errors.state}
													options={states}
													required
												/>

												<FormField
													label="ZIP Code"
													name="zipCode"
													placeholder="12345"
													value={formData.zipCode}
													onChange={(value) => handleInputChange('zipCode', value)}
													error={errors.zipCode}
													required
												/>
											</div>
										</div>
									</div>

									{/* Continue Button */}
									<div className="bg-white rounded-2xl p-8 shadow-soft">
									<Button
										type="submit"
										variant="primary"
										size="lg"
										disabled={isLoading}
										ariaLabel="Continue to payment"
										className="w-full btn-primary text-lg py-4"
									>
										{isLoading ? (loadingMessage || 'Processing...') : 'Continue to Payment'}
									</Button>
									</div>

									{errors.payment && (
										<div className="bg-red-50 border border-red-200 rounded-lg p-4">
											<p className="text-red-600 text-sm">{errors.payment}</p>
										</div>
									)}
								</form>
							)}

							{/* Payment Step */}
							{currentStep === 'payment' && clientSecret && (
								<div className="space-y-8">
									<button
										onClick={() => setCurrentStep('info')}
										className="text-brand-brown hover:text-brand-dark flex items-center gap-2 mb-4"
									>
										← Back to information
									</button>

									<StripePaymentForm
										clientSecret={clientSecret}
										customerEmail={customerInfo?.email}
										onSubmit={handlePaymentSubmit}
										isLoading={isLoading}
										errors={errors}
										showSubmitButton={true}
									/>
								</div>
							)}
						</div>

						{/* Order Summary Sidebar */}
						<div className="lg:col-span-1">
							<div className="bg-white rounded-2xl p-8 shadow-soft sticky top-8">
								<h2 className="font-playfair text-2xl mb-6 text-brand-dark">
									Order Summary
								</h2>

								<div className="space-y-4 mb-6">
									{items.map((item) => (
										<div key={item.id} className="border-b border-brand-brown/10 pb-4 last:border-b-0">
											<div className="flex gap-4">
												<div className="relative w-16 h-16 bg-brand-beige rounded-lg overflow-hidden flex-shrink-0">
													<Image
														src={item.image}
														alt={item.name}
														fill
														sizes="64px"
														className="object-contain p-1"
													/>
												</div>
												<div className="flex-1">
													<h3 className="font-medium text-sm text-brand-dark mb-1">
														{item.name}
													</h3>
													{isSubscription && (
														<p className="text-xs text-brand-green mb-1">
															🔄 Weekly Subscription
														</p>
													)}
													<p className="text-xs text-brand-brown mb-1">
														Qty: {item.quantity}
													</p>
													<p className="text-sm font-medium text-brand-dark">
														${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
														{isSubscription && <span className="text-xs">/week</span>}
													</p>
												</div>
											</div>
											<ConfiguredPackageDisplay item={item} />
										</div>
									))}
								</div>

								<div className="space-y-3 pt-6 border-t border-brand-brown/20">
									<div className="flex justify-between text-brand-dark">
										<span>Subtotal</span>
										<span>${orderSummary?.subtotal.toFixed(2) || totalPrice.toFixed(2)}</span>
									</div>

									<div className="flex justify-between text-brand-brown">
										<span>Shipping</span>
										<span>${orderSummary?.shipping.toFixed(2) || '10.00'}</span>
									</div>

									<div className="border-t border-brand-brown/20 pt-3">
										<div className="flex justify-between text-xl font-medium text-brand-dark">
											<span>Total</span>
											<span>
												${orderSummary?.total.toFixed(2) || (totalPrice + 10).toFixed(2)}
												{isSubscription && <span className="text-sm">/week</span>}
											</span>
										</div>
									</div>

									{isSubscription && (
										<div className="mt-4 p-3 bg-brand-beige rounded-lg">
											<p className="text-xs text-brand-dark">
												✓ Cancel anytime<br/>
												✓ Pause or skip deliveries<br/>
												✓ Save 10% vs one-time purchases
											</p>
										</div>
									)}
								</div>

								<div className="mt-6 pt-6 border-t border-brand-brown/20 text-center">
									<p className="text-xs text-brand-brown">
										🔒 Secured by Stripe - Industry standard encryption
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default function CheckoutPage() {
	return (
		<CheckoutProvider>
			<CheckoutContent />
		</CheckoutProvider>
	)
}

