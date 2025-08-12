# Payment Testing Guide

## Clover Sandbox Test Cards

Use these test card numbers to test different payment scenarios:

### ✅ **Successful Payments**
```
Card Number: 4005 5192 0000 0004
Expiry: Any future date (e.g., 12/25)
CVV: Any 3 digits (e.g., 123)
Name: Any name

Card Number: 5555 5555 5555 4444 
Expiry: Any future date (e.g., 12/25)
CVV: Any 3 digits (e.g., 123)
Name: Any name
```

### ❌ **Test Decline Scenarios**
```
Card Declined: 4000 0000 0000 0002
Insufficient Funds: 4000 0000 0000 9995
Expired Card: 4000 0000 0000 0069
Invalid CVV: 4000 0000 0000 0127
```

## Testing Steps

1. **Add items to cart** (go to homepage → Configure Package)
2. **Go to checkout** 
3. **Fill customer info** (use any valid email/phone)
4. **Fill shipping address** (use any valid US address)
5. **Enter test card details** from above
6. **Click "Complete Order"**
7. **Check console/network tab** for API responses

## Expected Results

### Successful Payment:
- Order processes successfully
- Redirects to success page
- Shows order number and confirmation
- Customer receives order details

### Failed Payment:
- Shows error message
- Stays on payment page
- Allows retry with different card

## API Endpoints Being Tested

- `POST /api/payment/tokenize` - Card tokenization
- `POST /api/payment/charge` - Payment processing  
- `GET /api/orders/[orderId]` - Order retrieval

## Debugging Tips

1. **Open Developer Tools** (F12)
2. **Check Network tab** for API calls
3. **Check Console** for any errors
4. **Use test cards exactly as shown** (spaces will be automatically formatted)