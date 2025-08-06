<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          {{ $t('chooseYourPlan') }}
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          {{ $t('subscriptionDescription') }}
        </p>
      </div>

      <!-- Current Plan Status -->
      <div v-if="userSubscription" class="mb-8">
        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ $t('currentPlan') }}: {{ userSubscription.planName }}
              </h3>
              <p class="text-gray-600 mt-1">
                <span v-if="userSubscription.planName === 'Basic'">
                  {{ $t('basicPlanPermanent') }}
                </span>
                <span v-else>
                  {{ $t('expiresOn') }}: {{ formatDate(userSubscription.endDate) }}
                  <span v-if="getRemainingDays !== null" class="ml-2 text-blue-600">
                    ({{ getRemainingDays }} {{ $t('daysLeft') }})
                  </span>
                </span>
              </p>
            </div>
            <div class="text-right">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :class="isSubscriptionExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">
                {{ isSubscriptionExpired ? $t('expired') : $t('active') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Plans Grid -->
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <div v-for="plan in plans" :key="plan.id" 
             class="relative bg-white rounded-lg shadow-lg overflow-hidden"
             :class="plan.isPopular ? 'ring-2 ring-blue-500' : ''">
          
          <!-- Popular Badge -->
          <div v-if="plan.isPopular" 
               class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span class="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              {{ $t('mostPopular') }}
            </span>
          </div>

          <!-- Plan Header -->
          <div class="p-8">
            <div class="text-center">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ plan.name }}</h3>
              <div class="mb-6">
                <span class="text-4xl font-bold text-gray-900">{{ plan.price }}</span>
                <span class="text-gray-600 ml-1">{{ $t('egp') }}</span>
                <span v-if="plan.name !== 'Basic'" class="text-gray-500 text-sm block mt-1">
                  {{ $t('perMonth') }}
                </span>
                <span v-else class="text-gray-500 text-sm block mt-1">
                  {{ $t('freeForever') }}
                </span>
              </div>
            </div>

            <!-- Features List -->
            <ul class="space-y-4 mb-8">
              <li v-for="feature in plan.features" :key="feature" 
                  class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-700">{{ feature }}</span>
              </li>
            </ul>

            <!-- Action Button -->
            <router-link 
              v-if="!userSubscription || userSubscription.planId !== plan.id"
              :to="`/subscription-plan/${plan.id}`"
              class="w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 inline-block text-center"
              :class="getButtonClasses(plan)">
              {{ plan.name === 'Basic' ? $t('startFree') : $t('choosePlan') }}
            </router-link>
            <div 
              v-else
              class="w-full py-3 px-6 rounded-lg font-semibold bg-green-500 text-white cursor-not-allowed text-center">
              {{ $t('currentPlan') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Features Comparison -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
          {{ $t('planComparison') }}
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-4 px-6 font-semibold text-gray-900">{{ $t('feature') }}</th>
                <th class="text-center py-4 px-6 font-semibold text-gray-900">Basic</th>
                <th class="text-center py-4 px-6 font-semibold text-gray-900">Pro</th>
                <th class="text-center py-4 px-6 font-semibold text-gray-900">Premium</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="py-4 px-6 text-gray-700">{{ $t('bookingFee') }}</td>
                <td class="text-center py-4 px-6 text-gray-900">60 {{ $t('egp') }}</td>
                <td class="text-center py-4 px-6 text-green-600 font-semibold">{{ $t('free') }}</td>
                <td class="text-center py-4 px-6 text-green-600 font-semibold">{{ $t('free') }}</td>
              </tr>
              <tr>
                <td class="py-4 px-6 text-gray-700">{{ $t('basicTools') }}</td>
                <td class="text-center py-4 px-6">
                  <svg class="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </td>
                <td class="text-center py-4 px-6">
                  <svg class="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </td>
                <td class="text-center py-4 px-6">
                  <svg class="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td class="py-4 px-6 text-gray-700">{{ $t('prioritySupport') }}</td>
                <td class="text-center py-4 px-6">
                  <svg class="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </td>
                <td class="text-center py-4 px-6">
                  <svg class="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </td>
                <td class="text-center py-4 px-6">
                  <svg class="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td class="py-4 px-6 text-gray-700">{{ $t('exclusiveTools') }}</td>
                <td class="text-center py-4 px-6">
                  <svg class="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </td>
                <td class="text-center py-4 px-6">
                  <svg class="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </td>
                <td class="text-center py-4 px-6">
                  <svg class="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td class="py-4 px-6 text-gray-700">{{ $t('analyticsDashboard') }}</td>
                <td class="text-center py-4 px-6">
                  <svg class="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </td>
                <td class="text-center py-4 px-6">
                  <svg class="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </td>
                <td class="text-center py-4 px-6">
                  <svg class="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td class="py-4 px-6 text-gray-700">{{ $t('dedicatedSupport') }}</td>
                <td class="text-center py-4 px-6">
                  <svg class="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </td>
                <td class="text-center py-4 px-6">
                  <svg class="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </td>
                <td class="text-center py-4 px-6">
                  <svg class="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useSubscriptions } from '@/composables/useSubscriptions';
import { getAuth } from 'firebase/auth';
import Swal from 'sweetalert2';

const {
  plans,
  userSubscription,
  loading,
  error,
  fetchPlans,
  fetchUserSubscription,
  subscribeToUserSubscription,
  startSubscription,
  isSubscriptionExpired,
  getRemainingDays
} = useSubscriptions();

let unsubscribe = null;

onMounted(async () => {
  const auth = getAuth();
  
  // Fetch plans
  await fetchPlans();
  
  // Fetch and subscribe to user subscription
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

const getButtonClasses = (plan) => {
  if (loading) {
    return 'bg-gray-400 text-white cursor-not-allowed';
  }
  
  if (userSubscription && userSubscription.planId === plan.id) {
    return 'bg-green-500 text-white cursor-not-allowed';
  }
  
  if (plan.isPopular) {
    return 'bg-blue-600 hover:bg-blue-700 text-white';
  }
  
  return 'bg-gray-800 hover:bg-gray-900 text-white';
};
</script> 