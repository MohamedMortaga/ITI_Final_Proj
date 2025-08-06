<template>
  <section class="py-16 bg-[var(--Color-Surface-Surface-Primary)]">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-[var(--Color-Text-Text-Primary)] mb-4">
          Choose Your Plan
        </h2>
        <p class="text-xl text-[var(--Color-Text-Text-Secondary)] max-w-2xl mx-auto">
          Unlock premium features and maximize your rental experience with our flexible subscription plans.
        </p>
      </div>

      <!-- Authentication Warning -->
      <div v-if="!isAuthenticated" class="bg-[var(--Colors-Warning-25)] border border-[var(--Colors-Warning-200)] rounded-[var(--Radius-Radius-SemiRounded)] p-6 mb-8 max-w-2xl mx-auto">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-[var(--Colors-Warning-500)] mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-[var(--Colors-Warning-700)]">Authentication Required</h3>
            <p class="text-[var(--Colors-Warning-600)]">Please log in to subscribe to a plan.</p>
          </div>
        </div>
        <div class="mt-4">
          <router-link
            to="/login"
            class="inline-flex items-center px-4 py-2 bg-[var(--Colors-Warning-500)] hover:bg-[var(--Colors-Warning-600)] text-white font-semibold rounded-[var(--Radius-Radius-Minimal)] transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Go to Login
          </router-link>
        </div>
      </div>

      <!-- Plans Grid -->
      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- Magic Plan -->
        <div class="relative bg-[var(--Color-Surface-Surface-Primary)] rounded-[var(--Radius-Radius-SemiRounded)] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--Color-Boarder-Border-Primary)] cursor-pointer" @click="startPlan('Magic')">
          <!-- Plan Header -->
          <div class="p-8 text-center">
            <h3 class="text-2xl font-bold text-[var(--Color-Text-Text-Primary)] mb-2">
              MAGIC
            </h3>
            <div class="mb-6">
              <span class="text-4xl font-bold text-[var(--Color-Text-Text-Primary)]">
                {{ getPlanPrice('Magic') }} EGP
              </span>
              <span class="text-[var(--Color-Text-Text-Secondary)] ml-2">
                forever
              </span>
            </div>
          </div>

          <!-- Features List -->
          <div class="px-8 pb-8">
            <ul class="space-y-4">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">Access to all rental tools</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">Standard customer support</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">Basic email reminders</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">24-hour rental periods</span>
              </li>
            </ul>
          </div>


        </div>

        <!-- Pro Plan -->
        <div class="relative bg-[var(--Color-Surface-Surface-Primary)] rounded-[var(--Radius-Radius-SemiRounded)] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--Color-Boarder-Border-Primary)] ring-2 ring-[var(--Color-Surface-Surface-Brand)] scale-105 cursor-pointer" @click="startPlan('Pro')">
          <!-- Popular Badge -->
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[var(--Color-Surface-Surface-Brand)] to-[var(--Colors-Primary-600)] text-white px-6 py-2 rounded-[var(--Radius-Radius-Fullyrounded)] text-sm font-semibold">
            Most Popular
          </div>

          <!-- Plan Header -->
          <div class="p-8 text-center">
            <h3 class="text-2xl font-bold text-[var(--Color-Text-Text-Primary)] mb-2">
              Pro
            </h3>
            <div class="mb-6">
              <span class="text-4xl font-bold text-[var(--Color-Text-Text-Primary)]">
                {{ getPlanPrice('Pro') }} EGP
              </span>
              <span class="text-[var(--Color-Text-Text-Secondary)] ml-2">
                /month
              </span>
            </div>
          </div>

          <!-- Features List -->
          <div class="px-8 pb-8">
            <ul class="space-y-4">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">Everything in Magic</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">Priority customer support</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">Comprehensive insurance</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">Flexible rental periods</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">No booking fees</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">Early access to new tools</span>
              </li>
            </ul>
          </div>


        </div>

        <!-- Premium Plan -->
        <div class="relative bg-[var(--Color-Surface-Surface-Primary)] rounded-[var(--Radius-Radius-SemiRounded)] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--Color-Boarder-Border-Primary)] cursor-pointer" @click="startPlan('Premium')">
          <!-- Plan Header -->
          <div class="p-8 text-center">
            <h3 class="text-2xl font-bold text-[var(--Color-Text-Text-Primary)] mb-2">
              Premium
            </h3>
            <div class="mb-6">
              <span class="text-4xl font-bold text-[var(--Color-Text-Text-Primary)]">
                {{ getPlanPrice('Premium') }} EGP
              </span>
              <span class="text-[var(--Color-Text-Text-Secondary)] ml-2">
                /month
              </span>
            </div>
          </div>

          <!-- Features List -->
          <div class="px-8 pb-8">
            <ul class="space-y-4">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">Everything in Pro</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">24/7 dedicated support</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">Premium insurance</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">Unlimited rental periods</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">Priority booking</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">Exclusive beta access</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-[var(--Color-Text-Text-Primary)]">Analytics dashboard</span>
              </li>
            </ul>
          </div>


        </div>
      </div>

      <!-- Current Plan Status -->
      <div v-if="userSubscription" class="mt-12 text-center">
        <div class="bg-[var(--Color-Surface-Surface-Primary)] rounded-[var(--Radius-Radius-Minimal)] shadow-md p-6 max-w-md mx-auto border border-[var(--Color-Boarder-Border-Primary)]">
          <h3 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">
            Current Plan
          </h3>
          <div class="space-y-2">
            <p class="text-lg font-medium text-[var(--Color-Text-Text-Primary)]">
              {{ userSubscription.planName }}
            </p>
            <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
              Status: 
              <span :class="userSubscription.status === 'active' ? 'text-[var(--Colors-Success-500)]' : 'text-[var(--Colors-Error-500)]'">
                {{ userSubscription.status }}
              </span>
            </p>
            <p v-if="getRemainingDays > 0" class="text-sm text-[var(--Color-Text-Text-Secondary)]">
              {{ getRemainingDays }} days remaining
            </p>
            <p v-else-if="userSubscription.planId === 'Magic'" class="text-sm text-[var(--Colors-Success-500)]">
              Permanent
            </p>
          </div>
        </div>
      </div>

      <!-- View All Plans Link -->
      <div class="text-center mt-8">
        <router-link
          to="/subscriptions"
          class="inline-flex items-center text-[var(--Color-Text-Text-Brand)] hover:text-[var(--Colors-Primary-600)] font-semibold"
        >
          View All Plans
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSubscriptions } from '@/composables/useSubscriptions'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Swal from 'sweetalert2'

const router = useRouter()
const auth = getAuth()
const isAuthenticated = ref(false)

const {
  plans,
  userSubscription,
  loading,
  error,
  fetchPlans,
  fetchUserSubscription,
  startSubscription,
  getRemainingDays
} = useSubscriptions()

onMounted(async () => {
  // Check authentication status
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user;
    if (user) {
      fetchUserSubscription(user.uid);
    }
  });
  
  await fetchPlans()
})

const getPlanPrice = (planName) => {
  const plan = plans.value.find(p => p.name === planName);
  return plan ? plan.price : 0;
}

const startPlan = async (planId) => {
  if (!isAuthenticated.value) {
    Swal.fire({
      title: 'Authentication Required',
      text: 'Please log in to subscribe to a plan',
      icon: 'warning',
      confirmButtonText: 'Go to Login',
      showCancelButton: true,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/login')
      }
    })
    return
  }

  // Redirect to the payment page for the specific plan
  router.push(`/subscription-plan/${planId}`)
}
</script> 