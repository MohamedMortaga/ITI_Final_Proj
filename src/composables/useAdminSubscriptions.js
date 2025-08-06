import { ref, computed } from 'vue';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  addDoc,
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/firebase/config';

export function useAdminSubscriptions() {
  const allSubscriptions = ref([]);
  const allUsers = ref([]);
  const plans = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const stats = ref({
    basic: 0,
    pro: 0,
    premium: 0,
    totalRevenue: 0
  });

  // Fetch all plans
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

  // Fetch all user subscriptions
  const fetchAllSubscriptions = async () => {
    try {
      loading.value = true;
      const subscriptionsRef = collection(db, 'user-subscriptions');
      const q = query(subscriptionsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      allSubscriptions.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching subscriptions:', err);
    } finally {
      loading.value = false;
    }
  };

  // Subscribe to all subscriptions changes
  const subscribeToAllSubscriptions = () => {
    const subscriptionsRef = collection(db, 'user-subscriptions');
    const q = query(subscriptionsRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      allSubscriptions.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      calculateStats();
    });
  };

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      loading.value = true;
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      allUsers.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching users:', err);
    } finally {
      loading.value = false;
    }
  };

  // Get user with subscription details
  const getUsersWithSubscriptions = computed(() => {
    return allUsers.value.map(user => {
      const userSubscription = allSubscriptions.value.find(sub => 
        sub.userId === user.id && sub.status === 'active'
      );
      
      return {
        ...user,
        currentPlan: userSubscription?.planName || 'Basic',
        subscriptionId: userSubscription?.id,
        subscriptionStatus: userSubscription?.status || 'none',
        subscriptionEndDate: userSubscription?.endDate,
        subscriptionPrice: userSubscription?.price || 0
      };
    });
  });

  // Filter users by plan
  const filterUsersByPlan = (planName) => {
    if (planName === 'all') {
      return getUsersWithSubscriptions.value;
    }
    return getUsersWithSubscriptions.value.filter(user => user.currentPlan === planName);
  };

  // Change user plan
  const changeUserPlan = async (userId, newPlanId) => {
    try {
      loading.value = true;
      
      // Get plan details
      const planDoc = await getDoc(doc(db, 'plans', newPlanId));
      if (!planDoc.exists()) {
        throw new Error('Plan not found');
      }
      
      const plan = planDoc.data();
      const now = new Date();
      let endDate = null;
      
      // Set end date based on plan type
      if (plan.name === 'Basic') {
        endDate = null;
      } else {
        endDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      }
      
      // Find existing active subscription
      const existingSubscription = allSubscriptions.value.find(sub => 
        sub.userId === userId && sub.status === 'active'
      );
      
      if (existingSubscription) {
        // Update existing subscription
        await updateDoc(doc(db, 'user-subscriptions', existingSubscription.id), {
          planId: newPlanId,
          planName: plan.name,
          startDate: now,
          endDate: endDate,
          price: plan.price,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new subscription
        const subscriptionData = {
          userId: userId,
          planId: newPlanId,
          planName: plan.name,
          startDate: now,
          endDate: endDate,
          status: 'active',
          price: plan.price,
          createdAt: serverTimestamp()
        };
        
        await addDoc(collection(db, 'user-subscriptions'), subscriptionData);
      }
      
    } catch (err) {
      error.value = err.message;
      console.error('Error changing user plan:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Calculate subscription statistics
  const calculateStats = () => {
    const activeSubscriptions = allSubscriptions.value.filter(sub => sub.status === 'active');
    
    stats.value = {
      basic: activeSubscriptions.filter(sub => sub.planName === 'Basic').length,
      pro: activeSubscriptions.filter(sub => sub.planName === 'Pro').length,
      premium: activeSubscriptions.filter(sub => sub.planName === 'Premium').length,
      totalRevenue: activeSubscriptions.reduce((total, sub) => {
        if (sub.planName === 'Basic') return total;
        return total + (sub.price || 0);
      }, 0)
    };
  };

  // Get monthly revenue
  const getMonthlyRevenue = computed(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlySubscriptions = allSubscriptions.value.filter(sub => {
      const startDate = sub.startDate?.toDate ? sub.startDate.toDate() : new Date(sub.startDate);
      return startDate >= firstDayOfMonth && sub.status === 'active';
    });
    
    return monthlySubscriptions.reduce((total, sub) => {
      if (sub.planName === 'Basic') return total;
      return total + (sub.price || 0);
    }, 0);
  });

  // Mark subscription as expired
  const markSubscriptionExpired = async (subscriptionId) => {
    try {
      await updateDoc(doc(db, 'user-subscriptions', subscriptionId), {
        status: 'expired',
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      error.value = err.message;
      console.error('Error marking subscription as expired:', err);
      throw err;
    }
  };

  // Renew subscription
  const renewSubscription = async (subscriptionId) => {
    try {
      const subscription = allSubscriptions.value.find(sub => sub.id === subscriptionId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }
      
      const now = new Date();
      let endDate = null;
      
      if (subscription.planName !== 'Basic') {
        endDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      }
      
      await updateDoc(doc(db, 'user-subscriptions', subscriptionId), {
        startDate: now,
        endDate: endDate,
        status: 'active',
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      error.value = err.message;
      console.error('Error renewing subscription:', err);
      throw err;
    }
  };

  return {
    allSubscriptions,
    allUsers,
    plans,
    loading,
    error,
    stats,
    fetchAllSubscriptions,
    subscribeToAllSubscriptions,
    fetchAllUsers,
    getUsersWithSubscriptions,
    filterUsersByPlan,
    changeUserPlan,
    calculateStats,
    getMonthlyRevenue,
    markSubscriptionExpired,
    renewSubscription,
    fetchPlans
  };
} 