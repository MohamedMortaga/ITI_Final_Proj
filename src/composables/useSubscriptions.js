import { ref, computed } from 'vue';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { getAuth } from 'firebase/auth';

export function useSubscriptions() {
  const plans = ref([]);
  const userSubscription = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Get all plans
  const fetchPlans = async () => {
    try {
      loading.value = true;
      const plansRef = collection(db, 'plans');
      const snapshot = await getDocs(plansRef);
      plans.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching plans:', err);
    } finally {
      loading.value = false;
    }
  };

  // Get user's current subscription
  const fetchUserSubscription = async (userId) => {
    if (!userId) return;
    
    try {
      loading.value = true;
      const subscriptionsRef = collection(db, 'user-subscriptions');
      const q = query(
        subscriptionsRef,
        where('userId', '==', userId),
        where('status', 'in', ['active', 'expired']),
        orderBy('startDate', 'desc')
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        userSubscription.value = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        };
      } else {
        userSubscription.value = null;
      }
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching user subscription:', err);
    } finally {
      loading.value = false;
    }
  };

  // Subscribe to user subscription changes
  const subscribeToUserSubscription = (userId) => {
    if (!userId) return () => {};
    
    const subscriptionsRef = collection(db, 'user-subscriptions');
    const q = query(
      subscriptionsRef,
      where('userId', '==', userId),
      where('status', 'in', ['active', 'expired']),
      orderBy('startDate', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        userSubscription.value = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        };
      } else {
        userSubscription.value = null;
      }
    });
  };

  // Start a new subscription
  const startSubscription = async (planId, paymentMethod = 'normal') => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      loading.value = true;
      
      // Get plan details
      const planDoc = await getDoc(doc(db, 'plans', planId));
      if (!planDoc.exists()) {
        throw new Error('Plan not found');
      }
      
      const plan = planDoc.data();
      const now = new Date();
      let endDate = null;
      
      // Set end date based on plan type
      if (plan.name === 'Basic') {
        // Basic plan is permanent
        endDate = null;
      } else {
        // Pro and Premium expire after 30 days
        endDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      }
      
      // Handle wallet payment
      if (paymentMethod === 'wallet' && plan.price > 0) {
        // Get user balance
        const userBalanceDoc = await getDoc(doc(db, 'userbalance', user.uid));
        if (!userBalanceDoc.exists()) {
          throw new Error('User balance not found');
        }
        
        const userBalance = userBalanceDoc.data();
        if (userBalance.balance < plan.price) {
          throw new Error('Insufficient balance');
        }
        
        // Deduct amount from wallet
        const newBalance = userBalance.balance - plan.price;
        await updateDoc(doc(db, 'userbalance', user.uid), {
          balance: newBalance,
          lastUpdated: serverTimestamp()
        });
      }
      
      // Create subscription document
      const subscriptionData = {
        userId: user.uid,
        planId: planId,
        planName: plan.name,
        startDate: now,
        endDate: endDate,
        status: 'active',
        price: plan.price,
        paymentMethod: paymentMethod,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'user-subscriptions'), subscriptionData);
      
      // Update user subscription ref
      userSubscription.value = {
        id: docRef.id,
        ...subscriptionData
      };
      
      return docRef.id;
    } catch (err) {
      error.value = err.message;
      console.error('Error starting subscription:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Check if subscription is expired
  const isSubscriptionExpired = computed(() => {
    if (!userSubscription.value || userSubscription.value.planName === 'Basic') {
      return false;
    }
    
    if (!userSubscription.value.endDate) {
      return false;
    }
    
    const endDate = userSubscription.value.endDate.toDate ? 
      userSubscription.value.endDate.toDate() : 
      new Date(userSubscription.value.endDate);
    
    return new Date() > endDate;
  });

  // Get remaining days
  const getRemainingDays = computed(() => {
    if (!userSubscription.value || userSubscription.value.planName === 'Basic') {
      return null;
    }
    
    if (!userSubscription.value.endDate) {
      return null;
    }
    
    const endDate = userSubscription.value.endDate.toDate ? 
      userSubscription.value.endDate.toDate() : 
      new Date(userSubscription.value.endDate);
    
    const now = new Date();
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  });

  // Get current plan features
  const getCurrentPlanFeatures = computed(() => {
    if (!userSubscription.value) {
      return plans.value.find(p => p.name === 'Basic')?.features || [];
    }
    
    const currentPlan = plans.value.find(p => p.id === userSubscription.value.planId);
    return currentPlan?.features || [];
  });

  // Check if user has specific feature
  const hasFeature = (featureName) => {
    const features = getCurrentPlanFeatures.value;
    return features.includes(featureName);
  };

  // Calculate booking fee based on plan
  const getBookingFee = computed(() => {
    if (!userSubscription.value || userSubscription.value.planName === 'Basic') {
      return 60; // Basic plan has 60 EGP booking fee
    }
    return 0; // Pro and Premium have no booking fees
  });

  return {
    plans,
    userSubscription,
    loading,
    error,
    fetchPlans,
    fetchUserSubscription,
    subscribeToUserSubscription,
    startSubscription,
    isSubscriptionExpired,
    getRemainingDays,
    getCurrentPlanFeatures,
    hasFeature,
    getBookingFee
  };
} 