import { NextRequest, NextResponse } from 'next/server'
import { CloverAPI, CloverAPIError } from '@/lib/clover'

interface RouteContext {
  params: Promise<{
    orderId: string
  }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { orderId } = await context.params

    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      )
    }

    // Initialize Clover API
    const clover = new CloverAPI()

    // Retrieve order from Clover
    const order = await clover.getOrder(orderId)

    // Format response
    const formattedOrder = {
      id: order.id,
      state: order.state,
      total: order.total / 100, // Convert from cents to dollars
      items: order.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price / 100, // Convert from cents to dollars
        quantity: item.quantity,
      })),
      metadata: order.metadata,
      created: new Date(order.created * 1000).toISOString(),
    }

    return NextResponse.json({
      success: true,
      order: formattedOrder
    })

  } catch (error) {
    console.error('Order retrieval error:', error)

    if (error instanceof CloverAPIError) {
      if (error.status === 404) {
        return NextResponse.json(
          { 
            error: 'Order not found',
            message: 'The requested order could not be found' 
          },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { 
          error: 'Order service error', 
          message: error.message 
        },
        { status: error.status }
      )
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to retrieve order' 
      },
      { status: 500 }
    )
  }
}