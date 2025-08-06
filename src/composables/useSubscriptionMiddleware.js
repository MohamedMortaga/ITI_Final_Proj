import { ref, computed } from 'vue';
import { useSubscriptions } from './useSubscriptions';
import { getAuth } from 'firebase/auth';

export function useSubscriptionMiddleware() {
  const { userSubscription, hasFeature, getBookingFee, isSubscriptionExpired } = useSubscriptions();
  
  // Check if user has access to premium features
  const hasPremiumAccess = computed(() => {
    if (!userSubscription.value) return false;
    if (isSubscriptionExpired.value) return false;
    return userSubscription.value.planName === 'Premium';
  });
  
  // Check if user has access to pro features
  const hasProAccess = computed(() => {
    if (!userSubscription.value) return false;
    if (isSubscriptionExpired.value) return false;
    return userSubscription.value.planName === 'Pro' || userSubscription.value.planName === 'Premium';
  });
  
  // Check if user has access to basic features
  const hasBasicAccess = computed(() => {
    if (!userSubscription.value) return false;
    if (isSubscriptionExpired.value) return false;
    return true; // All active subscriptions have basic access
  });
  
  // Calculate booking fee for a rental
  const calculateBookingFee = (rentalAmount) => {
    const fee = getBookingFee.value;
    return {
      fee: fee,
      total: rentalAmount + fee,
      isFree: fee === 0
    };
  };
  
  // Check if user can access exclusive tools
  const canAccessExclusiveTools = computed(() => {
    return hasPremiumAccess.value;
  });
  
  // Check if user can access analytics
  const canAccessAnalytics = computed(() => {
    return hasPremiumAccess.value;
  });
  
  // Check if user has priority support
  const hasPrioritySupport = computed(() => {
    return hasProAccess.value;
  });
  
  // Check if user has dedicated support
  const hasDedicatedSupport = computed(() => {
    return hasPremiumAccess.value;
  });
  
  // Get user's current plan name
  const getCurrentPlanName = computed(() => {
    if (!userSubscription.value) return 'Basic';
    if (isSubscriptionExpired.value) return 'Basic';
    return userSubscription.value.planName;
  });
  
  // Check if user needs to upgrade for a specific feature
  const needsUpgradeFor = (feature) => {
    switch (feature) {
      case 'exclusive_tools':
      case 'analytics':
      case 'dedicated_support':
        return !hasPremiumAccess.value;
      case 'priority_support':
      case 'no_booking_fees':
        return !hasProAccess.value;
      default:
        return false;
    }
  };
  
  // Get upgrade recommendation
  const getUpgradeRecommendation = (feature) => {
    if (needsUpgradeFor(feature)) {
      if (feature === 'exclusive_tools' || feature === 'analytics' || feature === 'dedicated_support') {
        return {
          plan: 'Premium',
          price: 1550,
          message: 'Upgrade to Premium to access this feature'
        };
      } else if (feature === 'priority_support' || feature === 'no_booking_fees') {
        return {
          plan: 'Pro',
          price: 600,
          message: 'Upgrade to Pro to access this feature'
        };
      }
    }
    return null;
  };
  
  // Check if user is authenticated
  const isAuthenticated = computed(() => {
    const auth = getAuth();
    return !!auth.currentUser;
  });
  
  return {
    // Access checks
    hasBasicAccess,
    hasProAccess,
    hasPremiumAccess,
    canAccessExclusiveTools,
    canAccessAnalytics,
    hasPrioritySupport,
    hasDedicatedSupport,
    
    // Plan information
    getCurrentPlanName,
    userSubscription,
    isSubscriptionExpired,
    
    // Fee calculations
    calculateBookingFee,
    getBookingFee,
    
    // Upgrade functionality
    needsUpgradeFor,
    getUpgradeRecommendation,
    
    // Authentication
    isAuthenticated
  };
} 