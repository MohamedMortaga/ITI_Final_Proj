<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">
        {{ $t('subscriptionStatus') }}
      </h3>
      <router-link 
        to="/subscriptions"
        class="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        {{ $t('manageSubscription') }}
      </router-link>
    </div>
    
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
    
    <div v-else-if="userSubscription" class="space-y-4">
      <!-- Current Plan -->
      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 class="font-medium text-gray-900">{{ $t('currentPlan') }}</h4>
          <p class="text-sm text-gray-600">{{ userSubscription.planName }}</p>
        </div>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="getPlanBadgeClasses(userSubscription.planName)">
          {{ userSubscription.planName }}
        </span>
      </div>
      
      <!-- Status -->
      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 class="font-medium text-gray-900">{{ $t('status') }}</h4>
          <p class="text-sm text-gray-600">
            <span v-if="userSubscription.planName === 'Basic'">
              {{ $t('permanent') }}
            </span>
            <span v-else>
              {{ isSubscriptionExpired ? $t('expired') : $t('active') }}
            </span>
          </p>
        </div>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="getStatusBadgeClasses()">
          {{ isSubscriptionExpired ? $t('expired') : $t('active') }}
        </span>
      </div>
      
      <!-- Expiry Date -->
      <div v-if="userSubscription.planName !== 'Basic'" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 class="font-medium text-gray-900">{{ $t('expiryDate') }}</h4>
          <p class="text-sm text-gray-600">
            {{ formatDate(userSubscription.endDate) }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-600">{{ $t('daysLeft') }}</p>
          <p class="text-lg font-semibold" :class="getRemainingDaysColor()">
            {{ getRemainingDays }}
          </p>
        </div>
      </div>
      
      <!-- Features -->
      <div class="p-4 bg-gray-50 rounded-lg">
        <h4 class="font-medium text-gray-900 mb-3">{{ $t('planFeatures') }}</h4>
        <ul class="space-y-2">
          <li v-for="feature in getCurrentPlanFeatures" :key="feature" 
              class="flex items-center text-sm text-gray-700">
            <svg class="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            {{ feature }}
          </li>
        </ul>
      </div>
      
      <!-- Upgrade CTA -->
      <div v-if="userSubscription.planName === 'Basic'" class="p-4 bg-blue-50 rounded-lg">
        <h4 class="font-medium text-blue-900 mb-2">{{ $t('upgradeToPro') }}</h4>
        <p class="text-sm text-blue-700 mb-3">{{ $t('upgradeDescription') }}</p>
        <router-link 
          to="/subscriptions"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          {{ $t('upgradeNow') }}
        </router-link>
      </div>
      
      <!-- Renew CTA -->
      <div v-if="isSubscriptionExpired && userSubscription.planName !== 'Basic'" class="p-4 bg-yellow-50 rounded-lg">
        <h4 class="font-medium text-yellow-900 mb-2">{{ $t('subscriptionExpired') }}</h4>
        <p class="text-sm text-yellow-700 mb-3">{{ $t('renewDescription') }}</p>
        <router-link 
          to="/subscriptions"
          class="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700"
        >
          {{ $t('renewNow') }}
        </router-link>
      </div>
    </div>
    
    <div v-else class="text-center py-8">
      <div class="text-gray-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h4 class="text-lg font-medium text-gray-900 mb-2">{{ $t('noSubscription') }}</h4>
      <p class="text-gray-600 mb-4">{{ $t('noSubscriptionDescription') }}</p>
      <router-link 
        to="/subscriptions"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
      >
        {{ $t('choosePlan') }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useSubscriptions } from '@/composables/useSubscriptions';
import { getAuth } from 'firebase/auth';

const {
  userSubscription,
  loading,
  fetchUserSubscription,
  subscribeToUserSubscription,
  isSubscriptionExpired,
  getRemainingDays,
  getCurrentPlanFeatures
} = useSubscriptions();

let unsubscribe = null;

onMounted(async () => {
  const auth = getAuth();
  if (auth.currentUser) {
    await fetchUserSubscription(auth.currentUser.uid);
    unsubscribe = subscribeToUserSubscription(auth.currentUser.uid);
  }
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

const formatDate = (date) => {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString();
};

const getPlanBadgeClasses = (plan) => {
  switch (plan) {
    case 'Basic':
      return 'bg-gray-100 text-gray-800';
    case 'Pro':
      return 'bg-green-100 text-green-800';
    case 'Premium':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusBadgeClasses = () => {
  if (isSubscriptionExpired.value) {
    return 'bg-red-100 text-red-800';
  }
  return 'bg-green-100 text-green-800';
};

const getRemainingDaysColor = () => {
  const days = getRemainingDays.value;
  if (days === null) return 'text-gray-900';
  if (days <= 7) return 'text-red-600';
  if (days <= 14) return 'text-yellow-600';
  return 'text-green-600';
};
</script> 