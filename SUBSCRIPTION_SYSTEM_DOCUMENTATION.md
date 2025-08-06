# Subscription System Documentation

## Overview
This document describes the comprehensive subscription system implemented for the rental platform, including user subscriptions, admin management, and plan-based features.

## 🏗️ Architecture

### Firestore Collections

#### 1. `plans` Collection
Stores subscription plan configurations:
```javascript
{
  id: "basic|pro|premium",
  name: "Basic|Pro|Premium",
  price: 0|600|1550,
  features: ["feature1", "feature2", ...],
  isPopular: boolean,
  createdAt: timestamp
}
```

#### 2. `user-subscriptions` Collection
Stores user subscription data:
```javascript
{
  userId: "user_uid",
  planId: "plan_id",
  planName: "Basic|Pro|Premium",
  startDate: timestamp,
  endDate: timestamp|null,
  status: "active|expired",
  price: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 📋 Subscription Plans

### Basic Plan (0 EGP)
- **Price**: Free (permanent)
- **Features**:
  - Access to basic tools
  - Basic insurance
  - Booking fee: 60 EGP
  - Standard support

### Pro Plan (600 EGP)
- **Price**: 600 EGP (30 days)
- **Features**:
  - Everything in Basic
  - Priority support
  - No booking fees
  - Enhanced tools access

### Premium Plan (1550 EGP)
- **Price**: 1550 EGP (30 days)
- **Features**:
  - Everything in Pro
  - Exclusive tools
  - Analytics dashboard
  - 24/7 dedicated support
  - Advanced features

## 🔧 Implementation Components

### 1. Composables

#### `useSubscriptions.js`
Main subscription management composable:
- `fetchPlans()` - Get all available plans
- `fetchUserSubscription(userId)` - Get user's current subscription
- `startSubscription(planId)` - Start a new subscription
- `isSubscriptionExpired` - Check if subscription is expired
- `getRemainingDays` - Get days remaining
- `getBookingFee` - Calculate booking fee based on plan

#### `useAdminSubscriptions.js`
Admin subscription management:
- `fetchAllSubscriptions()` - Get all user subscriptions
- `changeUserPlan(userId, planId)` - Change user's plan
- `calculateStats()` - Calculate subscription statistics
- `getMonthlyRevenue` - Get monthly revenue

#### `useSubscriptionMiddleware.js`
Subscription permission checks:
- `hasPremiumAccess` - Check premium access
- `hasProAccess` - Check pro access
- `calculateBookingFee(amount)` - Calculate fees
- `needsUpgradeFor(feature)` - Check if upgrade needed

### 2. Vue Components

#### `Subscriptions.vue`
Main subscription page with:
- Plan comparison table
- Current plan status
- Plan selection interface
- Feature comparison

#### `SubscriptionManagement.vue`
Admin management page with:
- User subscription overview
- Statistics dashboard
- Plan change functionality
- Revenue tracking

#### `SubscriptionStatus.vue`
User profile component showing:
- Current plan status
- Expiry information
- Plan features
- Upgrade/renewal CTAs

### 3. Routes
```javascript
// User routes
{ path: '/subscriptions', name: 'Subscriptions', component: Subscriptions }

// Admin routes
{ path: '/admin/subscriptions', name: 'SubscriptionManagement', component: SubscriptionManagement }
```

## 🎯 Features

### User Features
1. **Plan Selection**: Choose from Basic, Pro, or Premium plans
2. **Current Status**: View current plan and expiry information
3. **Automatic Expiry**: Pro/Premium plans expire after 30 days
4. **Plan Switching**: Users can switch plans anytime
5. **Booking Fee Calculation**: Automatic fee calculation based on plan

### Admin Features
1. **User Management**: View all users with their subscription status
2. **Plan Changes**: Manually change user plans
3. **Statistics**: View subscription statistics and revenue
4. **Filtering**: Filter users by plan type
5. **Renewal Management**: Renew expired subscriptions

### Plan Permissions
1. **Basic Plan**: Standard access with booking fees
2. **Pro Plan**: Priority support, no booking fees
3. **Premium Plan**: Exclusive tools, analytics, dedicated support

## 🔄 Business Logic

### Subscription Rules
1. **Basic Plan**: Permanent, no expiry
2. **Pro/Premium Plans**: 30-day expiry
3. **Auto-downgrade**: Expired plans revert to Basic
4. **Plan Switching**: Immediate effect, new expiry date

### Booking Fee Logic
1. **Basic Plan**: 60 EGP booking fee
2. **Pro/Premium Plans**: No booking fees
3. **Automatic Calculation**: Applied during checkout

### Expiry Handling
1. **Real-time Monitoring**: Check expiry status
2. **Automatic Status Update**: Mark as expired
3. **Feature Restrictions**: Limit access for expired plans

## 🚀 Setup Instructions

### 1. Initialize Plans
Run the setup script to create plans in Firestore:
```bash
node setup-subscription-plans.js
```

### 2. Add Routes
Routes are already added to the router configuration.

### 3. Add Navigation Links
- Admin sidebar: "Subscription Management"
- User profile: "Subscriptions"

### 4. Import Components
Components are ready to use in the application.

## 📊 Usage Examples

### Checking User Permissions
```javascript
import { useSubscriptionMiddleware } from '@/composables/useSubscriptionMiddleware';

const { hasPremiumAccess, hasProAccess, calculateBookingFee } = useSubscriptionMiddleware();

// Check if user can access premium features
if (hasPremiumAccess.value) {
  // Show premium features
}

// Calculate booking fee
const feeInfo = calculateBookingFee(100);
console.log(feeInfo.fee); // 60 for Basic, 0 for Pro/Premium
```

### Starting a Subscription
```javascript
import { useSubscriptions } from '@/composables/useSubscriptions';

const { startSubscription } = useSubscriptions();

// Start a Pro subscription
await startSubscription('pro');
```

### Admin Plan Management
```javascript
import { useAdminSubscriptions } from '@/composables/useAdminSubscriptions';

const { changeUserPlan, getMonthlyRevenue } = useAdminSubscriptions();

// Change user to Premium plan
await changeUserPlan(userId, 'premium');

// Get monthly revenue
console.log(getMonthlyRevenue.value);
```

## 🔒 Security Considerations

1. **Authentication Required**: All subscription operations require user authentication
2. **Admin Authorization**: Admin features require admin role
3. **Data Validation**: All subscription data is validated before storage
4. **Real-time Updates**: Subscription changes are reflected immediately

## 📈 Monitoring & Analytics

### Key Metrics
1. **Subscription Counts**: Users per plan
2. **Revenue Tracking**: Monthly and total revenue
3. **Expiry Monitoring**: Track expiring subscriptions
4. **Plan Changes**: Monitor plan switching patterns

### Admin Dashboard Features
1. **Statistics Cards**: Basic, Pro, Premium user counts
2. **Revenue Display**: Monthly revenue calculation
3. **User Filtering**: Filter by plan type
4. **Plan Management**: Change user plans

## 🛠️ Maintenance

### Daily Tasks
1. **Expiry Check**: Monitor expiring subscriptions
2. **Status Updates**: Update expired subscription status
3. **Revenue Calculation**: Update monthly revenue

### Monthly Tasks
1. **Revenue Reports**: Generate monthly revenue reports
2. **User Analytics**: Analyze subscription patterns
3. **Plan Performance**: Evaluate plan popularity

## 🔧 Troubleshooting

### Common Issues
1. **Subscription Not Loading**: Check Firebase connection
2. **Plan Changes Not Reflecting**: Verify real-time listeners
3. **Booking Fees Not Applied**: Check plan status
4. **Admin Access Issues**: Verify admin role

### Debug Tools
1. **Firebase Console**: Monitor Firestore collections
2. **Browser Console**: Check for JavaScript errors
3. **Network Tab**: Verify API calls

## 📝 Future Enhancements

### Planned Features
1. **Payment Integration**: Real payment processing
2. **Auto-renewal**: Automatic subscription renewal
3. **Trial Periods**: Free trial for new users
4. **Custom Plans**: Admin-created custom plans
5. **Analytics Dashboard**: Detailed subscription analytics
6. **Email Notifications**: Expiry and renewal notifications

### Technical Improvements
1. **Caching**: Implement subscription data caching
2. **Offline Support**: Handle offline subscription status
3. **Performance**: Optimize real-time listeners
4. **Testing**: Comprehensive unit and integration tests

## 📞 Support

For technical support or questions about the subscription system:
1. Check the Firebase console for data issues
2. Review browser console for JavaScript errors
3. Verify user authentication status
4. Check admin role permissions

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready 