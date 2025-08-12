// Credit card number formatting
export function formatCreditCardNumber(value: string): string {
  // Remove all non-digits
  const cleaned = value.replace(/\D/g, '')
  
  // Limit to 19 digits maximum
  const limited = cleaned.slice(0, 19)
  
  // Add spaces every 4 digits
  return limited.replace(/(\d{4})(?=\d)/g, '$1 ')
}

// Expiry date formatting (MM/YY)
export function formatExpiryDate(value: string): string {
  // Remove all non-digits
  const cleaned = value.replace(/\D/g, '')
  
  // Limit to 4 digits
  const limited = cleaned.slice(0, 4)
  
  // Add slash after MM
  if (limited.length >= 2) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`
  }
  
  return limited
}

// Phone number formatting
export function formatPhoneNumber(value: string): string {
  // Remove all non-digits
  const cleaned = value.replace(/\D/g, '')
  
  // Limit to 10 digits
  const limited = cleaned.slice(0, 10)
  
  // Format as (XXX) XXX-XXXX
  if (limited.length >= 6) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`
  } else if (limited.length >= 3) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3)}`
  } else if (limited.length > 0) {
    return `(${limited}`
  }
  
  return ''
}

// Currency formatting
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Zip code formatting
export function formatZipCode(value: string): string {
  // Remove all non-digits and hyphens
  const cleaned = value.replace(/[^\d-]/g, '')
  
  // Handle different zip code formats
  if (cleaned.length <= 5) {
    return cleaned
  } else if (cleaned.length <= 9) {
    // Format as XXXXX-XXXX
    const base = cleaned.slice(0, 5)
    const extension = cleaned.slice(5)
    return `${base}-${extension}`
  }
  
  // Limit to 10 characters (XXXXX-XXXX)
  return cleaned.slice(0, 10)
}

// Card brand detection
export function detectCardBrand(number: string): string {
  const cleaned = number.replace(/\s/g, '')
  
  if (/^4/.test(cleaned)) return 'visa'
  if (/^5[1-5]/.test(cleaned)) return 'mastercard'
  if (/^2[2-7]/.test(cleaned)) return 'mastercard' // New mastercard range
  if (/^3[47]/.test(cleaned)) return 'amex'
  if (/^6/.test(cleaned)) return 'discover'
  if (/^35/.test(cleaned)) return 'jcb'
  
  return 'unknown'
}

// Credit card validation
export function validateCreditCardNumber(number: string): boolean {
  const cleaned = number.replace(/\s/g, '')
  
  // Check if it's all digits and has valid length
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false
  }
  
  // Luhn algorithm check
  let sum = 0
  let shouldDouble = false
  
  // Loop through digits from right to left
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i])
    
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    shouldDouble = !shouldDouble
  }
  
  return sum % 10 === 0
}

// CVV validation based on card brand
export function validateCVV(cvv: string, cardBrand: string): boolean {
  const cleaned = cvv.replace(/\D/g, '')
  
  if (cardBrand === 'amex') {
    return cleaned.length === 4
  } else {
    return cleaned.length === 3
  }
}

// Expiry date validation
export function validateExpiryDate(month: string, year: string): boolean {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100 // Get last 2 digits
  const currentMonth = currentDate.getMonth() + 1 // 1-based month
  
  const expMonth = parseInt(month)
  const expYear = parseInt(year)
  
  // Check if month is valid
  if (expMonth < 1 || expMonth > 12) {
    return false
  }
  
  // Check if year is valid (not in the past)
  if (expYear < currentYear) {
    return false
  }
  
  // If same year, check if month is not in the past
  if (expYear === currentYear && expMonth < currentMonth) {
    return false
  }
  
  return true
}

// Name validation (for cardholder name)
export function validateCardholderName(name: string): boolean {
  // Should contain at least 2 characters and only letters, spaces, hyphens, and apostrophes
  const cleaned = name.trim()
  return cleaned.length >= 2 && /^[a-zA-Z\s\-']+$/.test(cleaned)
}