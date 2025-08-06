# Booking System Implementation

## Overview

This document describes the comprehensive booking system implementation for the Rento platform. The system allows customers to book products for specific date ranges, with automatic availability management and return confirmation functionality.

## Key Features

### 1. Availability Management
- **Real-time Calendar**: Visual calendar showing available and unavailable dates
- **Conflict Prevention**: Prevents double bookings for the same dates
- **Visual Indicators**: Different colors for available, unavailable, selected, and booked dates
- **Return-based Availability**: Products become available again only after return confirmation

### 2. Booking Process
- **Date Selection**: Interactive calendar for selecting start and end dates
- **Pricing Calculation**: Automatic calculation of total cost including fees
- **Contact Information**: Collection of customer details
- **Terms Agreement**: Required acceptance of terms and conditions

### 3. Return Management
- **Return Confirmation**: Customers must confirm when they return products
- **Return Details**: Collection of return condition, location, and notes
- **Status Updates**: Automatic status updates when returns are confirmed

## System Architecture

### Components

#### 1. `useBookingSystem.js` (Composable)
**Location**: `src/composables/useBookingSystem.js`

**Purpose**: Central booking system logic and Firebase integration

**Key Functions**:
- `createBooking(bookingData)`: Creates new booking in Firebase
- `updateBookingStatus(bookingId, status)`: Updates booking status
- `confirmReturn(bookingId)`: Confirms product return
- `checkAvailability(productId, startDate, endDate)`: Checks date availability
- `calculateUnavailableDates(productId)`: Calculates unavailable dates
- `getUserBookings(userId)`: Retrieves user's bookings
- `subscribeToBookings(productId)`: Real-time booking updates

**Booking Status Flow**:
```
pending → confirmed → active → completed → returned
```

#### 2. `BookingCalendar.vue` (Component)
**Location**: `src/components/BookingCalendar.vue`

**Purpose**: Interactive calendar for date selection

**Features**:
- Monthly navigation
- Visual availability indicators
- Date range selection
- Real-time updates
- Responsive design

**Color Coding**:
- **Green**: Available dates
- **Red**: Unavailable dates
- **Blue**: Selected dates
- **Orange**: Booked dates

#### 3. `BookingForm.vue` (Component)
**Location**: `src/components/BookingForm.vue`

**Purpose**: Complete booking form with calendar integration

**Features**:
- Integrated calendar component
- Contact information collection
- Pricing breakdown
- Terms agreement
- Form validation

#### 4. `ReturnConfirmation.vue` (Component)
**Location**: `src/components/ReturnConfirmation.vue`

**Purpose**: Return confirmation interface

**Features**:
- Return date selection
- Condition assessment
- Location tracking
- Notes collection
- Confirmation workflow

#### 5. `MyBookings.vue` (View)
**Location**: `src/views/Profile/MyBookings.vue`

**Purpose**: User booking management interface

**Features**:
- Booking list with filtering
- Status-based organization
- Return confirmation modal
- Booking cancellation
- Detailed view navigation

#### 6. `BookingConfirmation.vue` (View)
**Location**: `src/views/BookingConfirmation.vue`

**Purpose**: Post-booking confirmation page

**Features**:
- Booking details display
- Next steps guidance
- Contact information
- Action buttons

## Database Schema

### Bookings Collection
```javascript
{
  id: "booking_id",
  productId: "product_id",
  userId: "user_id",
  userEmail: "user@example.com",
  userName: "John Doe",
  userPhone: "+1234567890",
  startDate: "2024-01-10",
  endDate: "2024-01-12",
  totalAmount: 150.00,
  status: "pending", // pending, confirmed, active, completed, returned
  returnConfirmed: false,
  returnDate: null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Implementation Details

### Availability Logic

1. **Date Range Validation**:
   ```javascript
   const checkAvailability = (productId, startDate, endDate) => {
     const start = new Date(startDate)
     const end = new Date(endDate)
     
     const conflictingBookings = bookings.value.filter(booking => {
       if (booking.status === 'cancelled' || booking.status === 'returned') {
         return false
       }
       
       const bookingStart = new Date(booking.startDate)
       const bookingEnd = new Date(booking.endDate)
       
       return (start <= bookingEnd && end >= bookingStart)
     })
     
     return conflictingBookings.length === 0
   }
   ```

2. **Unavailable Dates Calculation**:
   ```javascript
   const calculateUnavailableDates = (productId) => {
     const unavailable = []
     
     bookings.value.forEach(booking => {
       if (booking.status === 'cancelled' || booking.status === 'returned') {
         return
       }
       
       const start = new Date(booking.startDate)
       const end = new Date(booking.endDate)
       
       for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
         unavailable.push(new Date(date).toISOString().split('T')[0])
       }
     })
     
     return [...new Set(unavailable)]
   }
   ```

### Return Confirmation Process

1. **Customer Confirms Return**:
   - Customer clicks "Confirm Return" button
   - Return confirmation modal opens
   - Customer fills return details
   - System updates booking status to "returned"

2. **Product Availability**:
   - Product becomes available for new bookings
   - Calendar updates in real-time
   - Other customers can now book the product

### Real-time Updates

The system uses Firebase's `onSnapshot` for real-time updates:

```javascript
const subscribeToBookings = (productId) => {
  const q = query(
    collection(db, 'bookings'),
    where('productId', '==', productId),
    orderBy('startDate', 'asc')
  )
  
  return onSnapshot(q, (snapshot) => {
    const bookingsList = []
    snapshot.forEach((doc) => {
      bookingsList.push({
        id: doc.id,
        ...doc.data()
      })
    })
    bookings.value = bookingsList
  })
}
```

## Usage Examples

### Creating a Booking
```javascript
const { createBooking } = useBookingSystem()

const bookingData = {
  productId: "product_123",
  userId: "user_456",
  userEmail: "customer@example.com",
  userName: "John Doe",
  userPhone: "+1234567890",
  startDate: "2024-01-10",
  endDate: "2024-01-12",
  totalAmount: 150.00,
  status: "pending"
}

const bookingId = await createBooking(bookingData)
```

### Checking Availability
```javascript
const { checkAvailability } = useBookingSystem()

const isAvailable = checkAvailability(
  "product_123",
  "2024-01-10",
  "2024-01-12"
)
```

### Confirming Return
```javascript
const { confirmReturn } = useBookingSystem()

await confirmReturn("booking_789")
```

## Integration with Existing System

### Product Details Page Integration
The booking form can be integrated into the product details page:

```vue
<template>
  <div class="product-details">
    <!-- Existing product information -->
    
    <!-- Booking Form -->
    <BookingForm
      :product-id="product.id"
      :product="product"
      @booking-created="handleBookingCreated"
    />
  </div>
</template>
```

### Profile Navigation
Add booking management to user profile:

```vue
<template>
  <div class="profile-navigation">
    <router-link to="/profile/my-bookings">
      My Bookings
    </router-link>
  </div>
</template>
```

## Localization

The system supports both English and Arabic translations:

### English Translations
```json
{
  "bookThisProduct": "Book This Product",
  "selectYourDates": "Select your preferred dates for booking",
  "bookingDetails": "Booking Details",
  "confirmReturn": "Confirm Return",
  "myBookings": "My Bookings"
}
```

### Arabic Translations
```json
{
  "bookThisProduct": "احجز هذا المنتج",
  "selectYourDates": "اختر التواريخ المفضلة للحجز",
  "bookingDetails": "تفاصيل الحجز",
  "confirmReturn": "تأكيد الإرجاع",
  "myBookings": "حجوزاتي"
}
```

## Security Considerations

1. **Authentication**: All booking operations require user authentication
2. **Authorization**: Users can only access their own bookings
3. **Data Validation**: All input data is validated before processing
4. **Real-time Updates**: Changes are reflected immediately across all users

## Performance Optimizations

1. **Caching**: Booking data is cached locally for faster access
2. **Pagination**: Large booking lists are paginated
3. **Lazy Loading**: Components are loaded only when needed
4. **Efficient Queries**: Firebase queries are optimized for performance

## Testing

### Unit Tests
```javascript
describe('Booking System', () => {
  test('should create booking successfully', async () => {
    const { createBooking } = useBookingSystem()
    const bookingId = await createBooking(mockBookingData)
    expect(bookingId).toBeDefined()
  })
  
  test('should check availability correctly', () => {
    const { checkAvailability } = useBookingSystem()
    const isAvailable = checkAvailability('product_1', '2024-01-10', '2024-01-12')
    expect(isAvailable).toBe(true)
  })
})
```

### Integration Tests
```javascript
describe('Booking Flow', () => {
  test('complete booking process', async () => {
    // 1. Select dates
    // 2. Fill form
    // 3. Submit booking
    // 4. Verify confirmation
    // 5. Check availability update
  })
})
```

## Future Enhancements

1. **Advanced Calendar Features**:
   - Multi-month view
   - Quick date selection
   - Recurring bookings

2. **Payment Integration**:
   - Secure payment processing
   - Multiple payment methods
   - Refund handling

3. **Notification System**:
   - Booking confirmations
   - Return reminders
   - Status updates

4. **Analytics Dashboard**:
   - Booking trends
   - Revenue reports
   - Popular products

## Troubleshooting

### Common Issues

1. **Calendar Not Loading**:
   - Check Firebase connection
   - Verify product ID
   - Check console for errors

2. **Availability Not Updating**:
   - Ensure real-time listeners are active
   - Check booking status values
   - Verify date format consistency

3. **Return Confirmation Failing**:
   - Check user permissions
   - Verify booking exists
   - Ensure proper status flow

### Debug Mode
Enable debug logging:

```javascript
const DEBUG_MODE = true

if (DEBUG_MODE) {
  console.log('Booking data:', bookingData)
  console.log('Availability check:', isAvailable)
}
```

## Conclusion

This booking system provides a comprehensive solution for managing product rentals with real-time availability tracking and return confirmation. The modular design allows for easy integration and future enhancements while maintaining security and performance standards. 