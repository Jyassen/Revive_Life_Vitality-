import { NextRequest, NextResponse } from 'next/server'
import { StripeAPI, StripeAPIError } from '@/lib/stripe'
import Stripe from 'stripe'

/**
 * Stripe Webhook Handler
 * 
 * This endpoint handles webhook events from Stripe.
 * Important events to handle:
 * 
 * One-time Payments:
 * - payment_intent.succeeded: Payment completed successfully
 * - payment_intent.payment_failed: Payment failed
 * - payment_intent.canceled: Payment was canceled
 * - charge.refunded: A refund was issued
 * - charge.dispute.created: Customer disputed the charge
 * 
 * Subscriptions:
 * - customer.subscription.created: New subscription created
 * - customer.subscription.updated: Subscription updated
 * - customer.subscription.deleted: Subscription canceled
 * - invoice.payment_succeeded: Recurring payment succeeded
 * - invoice.payment_failed: Recurring payment failed
 * 
 * Setup Instructions:
 * 1. Add this URL to your Stripe Dashboard webhook endpoints
 * 2. Select the events you want to receive
 * 3. Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET env var
 */

export async function POST(request: NextRequest) {
	const body = await request.text()
	const signature = request.headers.get('stripe-signature')

	if (!signature) {
		return NextResponse.json(
			{ error: 'Missing stripe-signature header' },
			{ status: 400 }
		)
	}

	try {
		const stripe = new StripeAPI()
		const event = stripe.constructWebhookEvent(body, signature)

		// Log webhook receipt
		console.info('AUDIT_LOG', {
			event: 'WEBHOOK_RECEIVED',
			type: event.type,
			timestamp: new Date().toISOString(),
			eventId: event.id,
		})

		// Handle the event
		switch (event.type) {
			// One-time payment events
			case 'payment_intent.succeeded':
				await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
				break

			case 'payment_intent.payment_failed':
				await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
				break

			case 'payment_intent.canceled':
				await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent)
				break

			case 'charge.refunded':
				await handleChargeRefunded(event.data.object as Stripe.Charge)
				break

			case 'charge.dispute.created':
				await handleDisputeCreated(event.data.object as Stripe.Dispute)
				break

			case 'payment_intent.requires_action':
				await handlePaymentIntentRequiresAction(event.data.object as Stripe.PaymentIntent)
				break

			// Subscription events
			case 'customer.subscription.created':
				await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
				break

			case 'customer.subscription.updated':
				await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
				break

			case 'customer.subscription.deleted':
				await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
				break

			case 'invoice.payment_succeeded':
				await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
				break

			case 'invoice.payment_failed':
				await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
				break

			default:
				console.log(`Unhandled event type: ${event.type}`)
		}

		return NextResponse.json({ received: true })

	} catch (error) {
		console.error('Webhook error:', error)

		if (error instanceof StripeAPIError) {
			return NextResponse.json(
				{ error: 'Webhook signature verification failed' },
				{ status: 400 }
			)
		}

		return NextResponse.json(
			{ error: 'Webhook handler failed' },
			{ status: 500 }
		)
	}
}

/**
 * Handle successful payment
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
	console.info('AUDIT_LOG', {
		event: 'PAYMENT_INTENT_SUCCEEDED',
		timestamp: new Date().toISOString(),
		paymentIntentId: paymentIntent.id,
		amount: paymentIntent.amount / 100,
		currency: paymentIntent.currency.toUpperCase(),
		customerEmail: paymentIntent.receipt_email,
		metadata: paymentIntent.metadata,
	})

	// TODO: Implement your business logic here:
	// 1. Update order status in database
	// 2. Send confirmation email to customer
	// 3. Trigger fulfillment process
	// 4. Update inventory
	// 5. Send notification to admin

	// Example database update (implement based on your ORM/database):
	// await db.orders.update({
	//   where: { paymentIntentId: paymentIntent.id },
	//   data: { status: 'paid', paidAt: new Date() }
	// })
}

/**
 * Handle failed payment
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
	console.warn('AUDIT_LOG', {
		event: 'PAYMENT_INTENT_FAILED',
		timestamp: new Date().toISOString(),
		paymentIntentId: paymentIntent.id,
		amount: paymentIntent.amount / 100,
		currency: paymentIntent.currency.toUpperCase(),
		errorCode: paymentIntent.last_payment_error?.code,
		errorMessage: paymentIntent.last_payment_error?.message,
		metadata: paymentIntent.metadata,
	})

	// TODO: Implement your business logic here:
	// 1. Update order status to 'failed'
	// 2. Send payment failed notification to customer
	// 3. Notify admin of failed payment
	// 4. Trigger retry logic if applicable

	// Example notification:
	// await sendEmail({
	//   to: paymentIntent.receipt_email,
	//   subject: 'Payment Failed',
	//   body: 'Your payment could not be processed. Please try again.'
	// })
}

/**
 * Handle canceled payment
 */
async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
	console.info('AUDIT_LOG', {
		event: 'PAYMENT_INTENT_CANCELED',
		timestamp: new Date().toISOString(),
		paymentIntentId: paymentIntent.id,
		amount: paymentIntent.amount / 100,
		currency: paymentIntent.currency.toUpperCase(),
		metadata: paymentIntent.metadata,
	})

	// TODO: Implement your business logic here:
	// 1. Update order status to 'canceled'
	// 2. Release any held inventory
	// 3. Send cancellation notification if needed
}

/**
 * Handle refunded charge
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
	console.info('AUDIT_LOG', {
		event: 'CHARGE_REFUNDED',
		timestamp: new Date().toISOString(),
		chargeId: charge.id,
		paymentIntentId: charge.payment_intent,
		amount: charge.amount_refunded / 100,
		currency: charge.currency.toUpperCase(),
		refundStatus: charge.refunded ? 'full' : 'partial',
	})

	// TODO: Implement your business logic here:
	// 1. Update order status to 'refunded'
	// 2. Restore inventory if applicable
	// 3. Send refund confirmation email to customer
	// 4. Update accounting records
	// 5. Notify admin of refund

	// Example:
	// await db.orders.update({
	//   where: { paymentIntentId: charge.payment_intent as string },
	//   data: { 
	//     status: 'refunded',
	//     refundedAmount: charge.amount_refunded / 100,
	//     refundedAt: new Date()
	//   }
	// })
}

/**
 * Handle dispute created
 */
async function handleDisputeCreated(dispute: Stripe.Dispute) {
	console.warn('AUDIT_LOG', {
		event: 'DISPUTE_CREATED',
		timestamp: new Date().toISOString(),
		disputeId: dispute.id,
		chargeId: dispute.charge,
		amount: dispute.amount / 100,
		currency: dispute.currency.toUpperCase(),
		reason: dispute.reason,
		status: dispute.status,
	})

	// TODO: Implement your business logic here:
	// 1. Alert admin immediately about the dispute
	// 2. Gather evidence to respond to dispute
	// 3. Update order status to 'disputed'
	// 4. Notify relevant team members
	// 5. Set reminder to respond before deadline

	// Example urgent notification:
	// await sendUrgentNotification({
	//   to: 'admin@example.com',
	//   subject: `URGENT: Payment Dispute Created - ${dispute.id}`,
	//   body: `A customer has disputed a charge. You must respond by ${new Date(dispute.evidence_details.due_by * 1000)}`
	// })
}

/**
 * Handle payment requiring action (e.g., 3D Secure)
 */
async function handlePaymentIntentRequiresAction(paymentIntent: Stripe.PaymentIntent) {
	console.info('AUDIT_LOG', {
		event: 'PAYMENT_INTENT_REQUIRES_ACTION',
		timestamp: new Date().toISOString(),
		paymentIntentId: paymentIntent.id,
		amount: paymentIntent.amount / 100,
		currency: paymentIntent.currency.toUpperCase(),
		metadata: paymentIntent.metadata,
	})

	// TODO: Implement your business logic here:
	// 1. Log that additional authentication is required
	// 2. Monitor if action is completed within reasonable time
	// 3. Send reminder to customer if needed
}

/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
	console.info('AUDIT_LOG', {
		event: 'SUBSCRIPTION_CREATED',
		timestamp: new Date().toISOString(),
		subscriptionId: subscription.id,
		customerId: subscription.customer as string,
		status: subscription.status,
		priceId: subscription.items.data[0]?.price?.id,
	})

	// TODO: Implement your business logic here:
	// 1. Create subscription record in your database
	// 2. Send welcome email to customer
	// 3. Schedule first shipment
	// 4. Update customer status to 'subscriber'
}

/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
	console.info('AUDIT_LOG', {
		event: 'SUBSCRIPTION_UPDATED',
		timestamp: new Date().toISOString(),
		subscriptionId: subscription.id,
		customerId: subscription.customer as string,
		status: subscription.status,
		cancelAtPeriodEnd: subscription.cancel_at_period_end,
	})

	// TODO: Implement your business logic here:
	// 1. Update subscription status in database
	// 2. Handle plan changes
	// 3. Handle quantity changes
	// 4. Notify customer of changes if needed
}

/**
 * Handle subscription deleted (canceled)
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
	console.warn('AUDIT_LOG', {
		event: 'SUBSCRIPTION_DELETED',
		timestamp: new Date().toISOString(),
		subscriptionId: subscription.id,
		customerId: subscription.customer as string,
		canceledAt: subscription.canceled_at,
		endedAt: subscription.ended_at,
	})

	// TODO: Implement your business logic here:
	// 1. Update subscription status to 'canceled' in database
	// 2. Stop future shipments
	// 3. Send cancellation confirmation email
	// 4. Trigger win-back campaigns (optional)
	// 5. Request feedback on why they canceled
}

/**
 * Handle invoice payment succeeded (recurring payment)
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
	const invoiceData = invoice as Stripe.Invoice & { 
		subscription?: string | Stripe.Subscription
		billing_reason?: string
	}
	
	console.info('AUDIT_LOG', {
		event: 'INVOICE_PAYMENT_SUCCEEDED',
		timestamp: new Date().toISOString(),
		invoiceId: invoice.id,
		subscriptionId: typeof invoiceData.subscription === 'string' ? invoiceData.subscription : invoiceData.subscription?.id,
		customerId: invoice.customer as string,
		amount: invoice.amount_paid / 100,
		currency: invoice.currency.toUpperCase(),
		billingReason: invoiceData.billing_reason,
	})

	// TODO: Implement your business logic here:
	// 1. Create new order for this billing period
	// 2. Send payment receipt email
	// 3. Schedule shipment
	// 4. Update next billing date
	// 5. Thank customer for continued subscription

	// Example for recurring charges (not first payment):
	// if (invoice.billing_reason === 'subscription_cycle') {
	//   await createOrderForSubscription(invoice)
	//   await sendPaymentReceipt(invoice.customer_email)
	//   await scheduleShipment(invoice)
	// }
}

/**
 * Handle invoice payment failed (recurring payment failure)
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
	const invoiceData = invoice as Stripe.Invoice & { 
		subscription?: string | Stripe.Subscription
		attempt_count?: number
	}
	
	console.warn('AUDIT_LOG', {
		event: 'INVOICE_PAYMENT_FAILED',
		timestamp: new Date().toISOString(),
		invoiceId: invoice.id,
		subscriptionId: typeof invoiceData.subscription === 'string' ? invoiceData.subscription : invoiceData.subscription?.id,
		customerId: invoice.customer as string,
		amount: invoice.amount_due / 100,
		currency: invoice.currency.toUpperCase(),
		attemptCount: invoiceData.attempt_count,
	})

	// TODO: Implement your business logic here:
	// 1. Send payment failure notification to customer
	// 2. Provide link to update payment method
	// 3. Pause shipments until payment resolved
	// 4. Set up retry schedule
	// 5. If final attempt fails, cancel subscription

	// Example urgent notification:
	// await sendPaymentFailureEmail({
	//   to: invoice.customer_email,
	//   subject: 'Payment Failed - Update Your Payment Method',
	//   updateUrl: `https://yourdomain.com/account/payment-method?subscription=${invoice.subscription}`,
	//   attemptCount: invoice.attempt_count,
	//   nextRetry: invoice.next_payment_attempt
	// })
}

