import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { CloverAPIError } from '@/lib/clover'

// Validation schema for tokenization request
const tokenizeSchema = z.object({
  number: z.string().min(13).max(19),
  exp_month: z.string().regex(/^(0[1-9]|1[0-2])$/),
  exp_year: z.string().regex(/^\d{2}$/),
  cvv: z.string().regex(/^\d{3,4}$/),
  name: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = tokenizeSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid card data', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const { number, exp_month, exp_year } = validationResult.data

    // NOTE: In production, card tokenization should happen client-side using Clover's 
    // secure iframe or SDK. This server-side tokenization is for demo purposes only.

    // This is a mock response - in production, use Clover's tokenization
    const mockToken = {
      id: `tok_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      card: {
        brand: detectCardBrand(number),
        last4: number.slice(-4),
        exp_month: parseInt(exp_month),
        exp_year: 2000 + parseInt(exp_year),
      }
    }

    return NextResponse.json({
      success: true,
      token: mockToken
    })

  } catch (error) {
    console.error('Tokenization error:', error)

    if (error instanceof CloverAPIError) {
      return NextResponse.json(
        { 
          error: 'Payment service error', 
          message: error.message 
        },
        { status: error.status }
      )
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process payment information' 
      },
      { status: 500 }
    )
  }
}

// Utility function to detect card brand
function detectCardBrand(number: string): string {
  const num = number.replace(/\s/g, '')
  
  if (/^4/.test(num)) return 'visa'
  if (/^5[1-5]/.test(num)) return 'mastercard'
  if (/^3[47]/.test(num)) return 'amex'
  if (/^6/.test(num)) return 'discover'
  
  return 'unknown'
}