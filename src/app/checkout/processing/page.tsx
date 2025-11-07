'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStripe } from '@stripe/react-stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe-client'

function ProcessingContent() {
	const stripe = useStripe()
	const router = useRouter()
	const searchParams = useSearchParams()
	const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
	const [message, setMessage] = useState('Processing your payment...')

	useEffect(() => {
		if (!stripe) {
			return
		}

		const clientSecret = searchParams.get('payment_intent_client_secret')

		if (!clientSecret) {
			setStatus('error')
			setMessage('Payment information not found. Please try again.')
			return
		}

		// Retrieve the PaymentIntent to check its status
		stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
			if (!paymentIntent) {
				setStatus('error')
				setMessage('Payment not found.')
				return
			}

			switch (paymentIntent.status) {
				case 'succeeded':
					setStatus('success')
					setMessage('Payment successful! Activating your subscription...')
					
					// Get subscription details from metadata
					const subscriptionId = paymentIntent.metadata?.subscription_id
					const customerId = paymentIntent.metadata?.customer_id
					
					if (subscriptionId) {
						// Poll for subscription activation
						pollSubscriptionStatus(subscriptionId, customerId || '')
					} else {
						// Fallback: just redirect to success
						setTimeout(() => {
							router.push('/checkout/success')
						}, 2000)
					}
					break

				case 'processing':
					setMessage('Your payment is being processed. Please wait...')
					// Check again in a few seconds
					setTimeout(() => {
						window.location.reload()
					}, 3000)
					break

				case 'requires_payment_method':
					setStatus('error')
					setMessage('Payment failed. Please try another payment method.')
					setTimeout(() => {
						router.push('/checkout')
					}, 3000)
					break

				default:
					setStatus('error')
					setMessage('Something went wrong with your payment.')
					setTimeout(() => {
						router.push('/checkout')
					}, 3000)
					break
			}
		})
	}, [stripe, searchParams, router])

	const pollSubscriptionStatus = async (subscriptionId: string, customerId: string) => {
		const maxAttempts = 10
		const baseDelay = 1000

		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			try {
				const response = await fetch('/api/stripe/confirm-subscription', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						subscriptionId,
						customerId,
						customer: {
							firstName: '',
							lastName: '',
							email: '',
						},
						shippingAddress: {
							firstName: '',
							lastName: '',
							address1: '',
							address2: '',
							city: '',
							state: '',
							zipCode: '',
							country: 'US',
						},
					}),
				})

				const data = await response.json()

				if (response.ok) {
					// Success!
					setMessage('Subscription activated! Redirecting...')
					setTimeout(() => {
						router.push(`/checkout/success?order_id=${subscriptionId}&subscription=true`)
					}, 1000)
					return
				} else if (response.status === 402 && data.status === 'incomplete') {
					// Still processing, wait and retry
					const delay = baseDelay * Math.pow(1.5, attempt)
					await new Promise(resolve => setTimeout(resolve, delay))
					continue
				} else {
					// Other error
					setStatus('error')
					setMessage(data?.message || 'Failed to activate subscription')
					return
				}
			} catch (error) {
				console.error('Error polling subscription:', error)
			}
		}

		// Timeout
		setStatus('error')
		setMessage('Subscription activation is taking longer than expected. Please check your email for confirmation.')
	}

	return (
		<div className="min-h-screen bg-brand-beige flex items-center justify-center">
			<div className="container-custom section-padding">
				<div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-soft text-center">
					{status === 'processing' && (
						<>
							<div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-brand-brown mb-4"></div>
							<h1 className="font-playfair text-2xl text-brand-dark mb-2">
								Processing Payment
							</h1>
							<p className="text-brand-brown">
								{message}
							</p>
							<p className="text-sm text-brand-brown/60 mt-4">
								Please do not close this window or press the back button.
							</p>
						</>
					)}

					{status === 'success' && (
						<>
							<div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<h1 className="font-playfair text-2xl text-brand-dark mb-2">
								Payment Successful!
							</h1>
							<p className="text-brand-brown">
								{message}
							</p>
						</>
					)}

					{status === 'error' && (
						<>
							<div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</div>
							<h1 className="font-playfair text-2xl text-brand-dark mb-2">
								Payment Issue
							</h1>
							<p className="text-brand-brown">
								{message}
							</p>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default function ProcessingPage() {
	const [stripePromise] = useState(() => getStripe())

	return (
		<Elements stripe={stripePromise}>
			<ProcessingContent />
		</Elements>
	)
}

