import { NextRequest, NextResponse } from 'next/server'
import { CloverAPI, CloverAPIError, formatAmountForClover, formatCustomerForClover, formatAddressForClover } from '@/lib/clover'
import { createOrderSchema } from '@/lib/validations/checkout'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = createOrderSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid order data', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const {
      items,
      customer,
      shippingAddress,
      billingAddress,
      paymentToken,
      summary,
      specialInstructions,
      couponCode
    } = validationResult.data

    // Initialize Clover API
    const clover = new CloverAPI()

    // Prepare charge request
    const chargeRequest = {
      amount: formatAmountForClover(summary.total),
      currency: 'USD',
      source: paymentToken,
      capture: true,
      description: `Order for ${items.length} item(s)`,
      customer: formatCustomerForClover(customer),
      shipping: formatAddressForClover(shippingAddress),
      metadata: {
        order_type: 'wellness_shots',
        item_count: items.length.toString(),
        subtotal: formatAmountForClover(summary.subtotal).toString(),
        tax: formatAmountForClover(summary.tax).toString(),
        shipping_cost: formatAmountForClover(summary.shipping).toString(),
        discount: formatAmountForClover(summary.discount).toString(),
        ...(couponCode && { coupon_code: couponCode }),
        ...(specialInstructions && { special_instructions: specialInstructions }),
      }
    }

    // Process payment with Clover
    const charge = await clover.createCharge(chargeRequest)

    // Check if payment was successful
    if (charge.status !== 'succeeded') {
      return NextResponse.json(
        { 
          error: 'Payment failed', 
          message: charge.failure_message || 'Payment could not be processed',
          charge_id: charge.id
        },
        { status: 402 }
      )
    }

    // Create order in Clover
    const orderRequest = {
      state: 'open' as const,
      items: items.map(item => ({
        name: item.name,
        price: formatAmountForClover(item.price),
        quantity: item.quantity,
      })),
      metadata: {
        charge_id: charge.id,
        customer_email: customer.email,
        customer_name: `${customer.firstName} ${customer.lastName}`,
        shipping_address: JSON.stringify(shippingAddress),
        ...(billingAddress && { billing_address: JSON.stringify(billingAddress) }),
        ...(specialInstructions && { special_instructions: specialInstructions }),
        ...(couponCode && { coupon_code: couponCode }),
      }
    }

    const order = await clover.createOrder(orderRequest)

    // Return success response
    return NextResponse.json({
      success: true,
      charge_id: charge.id,
      order_id: order.id,
      amount: summary.total,
      payment_method: {
        brand: charge.source.brand,
        last4: charge.source.last4,
      },
      order: {
        id: order.id,
        status: 'confirmed',
        items: items,
        customer: customer,
        shippingAddress: shippingAddress,
        summary: summary,
        createdAt: new Date().toISOString(),
      }
    })

  } catch (error) {
    console.error('Payment processing error:', error)

    if (error instanceof CloverAPIError) {
      // Handle specific Clover API errors
      const errorMessage = getCloverErrorMessage(error)
      return NextResponse.json(
        { 
          error: 'Payment processing failed', 
          message: errorMessage,
          code: error.details && typeof error.details === 'object' && 'code' in error.details ? (error.details as { code: string }).code : undefined 
        },
        { status: error.status }
      )
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process payment' 
      },
      { status: 500 }
    )
  }
}

// Helper function to get user-friendly error messages
function getCloverErrorMessage(error: CloverAPIError): string {
  const code = error.details && typeof error.details === 'object' && 'code' in error.details ? (error.details as { code: string }).code : undefined

  switch (code) {
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
    case 'rate_limit':
      return 'Too many requests. Please wait a moment and try again.'
    case 'invalid_request':
      return 'Invalid payment information. Please check your details and try again.'
    default:
      return error.message || 'Payment failed. Please check your payment information and try again.'
  }
}