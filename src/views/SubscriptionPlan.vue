<template>
  <div class="min-h-screen bg-[var(--Color-Surface-Surface-Primary)] py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-[var(--Color-Text-Text-Primary)] mb-4">
          Subscribe to {{ planName }}
        </h1>
        <p class="text-xl text-[var(--Color-Text-Text-Secondary)] max-w-2xl mx-auto">
          Choose your preferred payment method and complete your subscription.
        </p>
      </div>

      <!-- Authentication Warning -->
      <div v-if="!isAuthenticated" class="bg-[var(--Colors-Warning-25)] border border-[var(--Colors-Warning-200)] rounded-[var(--Radius-Radius-SemiRounded)] p-6 mb-8">
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

      <!-- Plan Details -->
      <div v-if="plan" class="bg-[var(--Color-Surface-Surface-Primary)] rounded-[var(--Radius-Radius-SemiRounded)] shadow-xl p-8 mb-8 border border-[var(--Color-Boarder-Border-Primary)]">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Primary)] mb-2">{{ plan.name }}</h2>
          <div class="mb-6">
            <span class="text-5xl font-bold text-[var(--Color-Surface-Surface-Brand)]">Plan Not Found</span>
            <span class="text-[var(--Color-Text-Text-Secondary)] ml-2 text-xl">The requested subscription plan was not found.</span>
          </div>
        </div>

        <!-- Features List -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">Plan Features</h3>
          <ul class="space-y-3">
            <li v-for="feature in getPlanFeatures(plan.id)" :key="feature" class="flex items-start">
              <svg class="w-5 h-5 text-[var(--Colors-Success-500)] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="text-[var(--Color-Text-Text-Primary)]">{{ feature }}</span>
            </li>
          </ul>
        </div>

        <!-- Payment Options -->
        <div class="border-t border-[var(--Color-Boarder-Border-Primary)] pt-8">
          <h3 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-6">Payment Options</h3>
          
          <!-- Wallet Payment Option -->
          <div v-if="isAuthenticated && userBalance && userBalance.balance >= plan.price" class="mb-6">
            <div class="border border-[var(--Color-Boarder-Border-Primary)] rounded-[var(--Radius-Radius-Minimal)] p-6 bg-[var(--Colors-Success-25)]">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-[var(--Colors-Success-100)] rounded-full flex items-center justify-center mr-3">
                    <svg class="w-6 h-6 text-[var(--Colors-Success-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-[var(--Color-Text-Text-Primary)]">Pay with Wallet</h4>
                    <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">Available Balance: {{ userBalance.balance }} EGP</p>
                  </div>
                </div>
                <button
                  @click="payWithWallet"
                  :disabled="loading"
                  class="bg-[var(--Colors-Success-500)] hover:bg-[var(--Colors-Success-600)] text-white px-6 py-2 rounded-[var(--Radius-Radius-Minimal)] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="loading" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                  <span v-else>Pay with Wallet</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Payment Method Section -->
          <div class="border border-[var(--Color-Boarder-Border-Primary)] rounded-[var(--Radius-Radius-Minimal)] p-6 bg-[var(--Colors-Primary-25)]">
            <h4 class="text-lg font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">Payment Method</h4>
            
            <div class="space-y-3">
              <!-- Credit Card Option -->
              <label class="flex items-center space-x-4 cursor-pointer p-3 rounded-[var(--Radius-Radius-Minimal)] border border-[var(--Color-Boarder-Border-Primary)] hover:bg-[var(--Color-Surface-Surface-Primary)] transition-colors">
                <input
                  type="radio"
                  v-model="paymentMethod"
                  value="credit_card"
                  class="text-[var(--Color-Surface-Surface-Brand)] focus:ring-[var(--Color-Surface-Surface-Brand)]"
                />
                <div class="flex items-center space-x-3">
                  <img
                    src="@/assets/6963703.png"
                    alt="Credit Card"
                    class="w-6 h-6 object-contain flex-shrink-0"
                  />
                  <span class="text-[var(--Color-Text-Text-Primary)] font-medium">Credit Card</span>
                </div>
              </label>

              <!-- Vodafone Cash Option -->
              <label class="flex items-center space-x-4 cursor-pointer p-3 rounded-[var(--Radius-Radius-Minimal)] border border-[var(--Color-Boarder-Border-Primary)] hover:bg-[var(--Color-Surface-Surface-Primary)] transition-colors">
                <input
                  type="radio"
                  v-model="paymentMethod"
                  value="vodafone_cash"
                  class="text-[var(--Color-Surface-Surface-Brand)] focus:ring-[var(--Color-Surface-Surface-Brand)]"
                />
                <div class="flex items-center space-x-3">
                  <img
                    src="@/assets/vodafone-logo-2017-1024x768.png"
                    alt="Vodafone Cash"
                    class="w-6 h-6 object-contain flex-shrink-0"
                  />
                  <span class="text-[var(--Color-Text-Text-Primary)] font-medium">Vodafone Cash</span>
                </div>
              </label>

              <!-- Etisalat Wallet Option -->
              <label class="flex items-center space-x-4 cursor-pointer p-3 rounded-[var(--Radius-Radius-Minimal)] border border-[var(--Color-Boarder-Border-Primary)] hover:bg-[var(--Color-Surface-Surface-Primary)] transition-colors">
                <input
                  type="radio"
                  v-model="paymentMethod"
                  value="etisalat_wallet"
                  class="text-[var(--Color-Surface-Surface-Brand)] focus:ring-[var(--Color-Surface-Surface-Brand)]"
                />
                <div class="flex items-center space-x-3">
                  <img
                    src="@/assets/Etisalat-Logo.png"
                    alt="Etisalat"
                    class="w-6 h-6 object-contain flex-shrink-0"
                  />
                  <span class="text-[var(--Color-Text-Text-Primary)] font-medium">Etisalat Wallet</span>
                </div>
              </label>
            </div>

            <!-- Pay Now Button -->
            <div class="mt-6">
              <button
                @click="processPayment"
                :disabled="loading || !isAuthenticated || !paymentMethod"
                class="w-full bg-[var(--Color-Surface-Surface-Brand)] hover:bg-[var(--Colors-Primary-600)] text-white px-6 py-3 rounded-[var(--Radius-Radius-Minimal)] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else-if="!isAuthenticated">Login Required</span>
                <span v-else-if="!paymentMethod">Select Payment Method</span>
                <span v-else>Pay Now</span>
              </button>
            </div>
          </div>

          <!-- Insufficient Balance Warning -->
          <div v-if="isAuthenticated && userBalance && userBalance.balance < plan.price" class="mt-4 p-4 bg-[var(--Colors-Warning-25)] border border-[var(--Colors-Warning-200)] rounded-[var(--Radius-Radius-Minimal)]">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-[var(--Colors-Warning-500)] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span class="text-[var(--Colors-Warning-700)] text-sm">
                Insufficient balance. Current Balance: {{ userBalance.balance }} EGP, Required: {{ plan.price }} EGP
              </span>
            </div>
          </div>

          <!-- Authentication Required for Wallet -->
          <div v-if="!isAuthenticated" class="mt-4 p-4 bg-[var(--Colors-Primary-25)] border border-[var(--Colors-Primary-200)] rounded-[var(--Radius-Radius-Minimal)]">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-[var(--Colors-Primary-500)] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <span class="text-[var(--Colors-Primary-700)] text-sm">
                Please log in to access wallet payment and view your balance.
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- OTP Verification Modal -->
      <div
        v-if="showOTPModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-[var(--Color-Surface-Surface-Primary)] rounded-[var(--Radius-Radius-SemiRounded)] shadow-xl w-full max-w-md mx-4">
          <div class="p-8 text-center">
            <!-- Header Icon -->
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
            </div>

            <!-- Title -->
            <h2 class="text-2xl font-bold text-[var(--Color-Text-Text-Primary)] mb-2">
              Verify Payment
            </h2>

            <!-- Description -->
            <p class="text-[var(--Color-Text-Text-Secondary)] mb-6">
              Enter OTP sent to 
              <span class="font-medium text-[var(--Color-Text-Text-Primary)]">{{ userPhoneNumber }}</span>
            </p>

            <!-- OTP Input Fields -->
            <div class="flex justify-center space-x-2 mb-6">
              <input
                v-for="(digit, index) in 6"
                :key="index"
                v-model="otpDigits[index]"
                type="text"
                maxlength="1"
                @input="handleOtpInput($event, index)"
                @keydown="handleOtpKeydown($event, index)"
                @paste="handleOtpPaste"
                class="otp-input w-12 h-12 text-center text-lg font-semibold border-2 border-[var(--Color-Surface-Surface-Brand)] rounded-[var(--Radius-Radius-Minimal)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Surface-Surface-Brand)] focus:ring-opacity-50 transition-all"
                :class="{ 'border-[var(--Color-Surface-Surface-Brand)]': otpDigits[index], 'border-[var(--Color-Boarder-Border-Primary)]': !otpDigits[index] }"
              />
            </div>

            <!-- Timer -->
            <div class="text-sm text-[var(--Color-Text-Text-Secondary)] mb-6">
              OTP expires in 
              <span class="font-medium text-[var(--Color-Surface-Surface-Brand)]">{{ otpTimer }}</span>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <!-- Verify OTP Button -->
              <button
                @click="verifyOTP"
                :disabled="!isOtpComplete || otpTimer === '00'"
                class="w-full bg-[var(--Color-Surface-Surface-Brand)] text-white py-3 px-6 rounded-[var(--Radius-Radius-Minimal)] font-semibold hover:bg-[var(--Colors-Primary-600)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify OTP
              </button>

              <!-- Resend OTP Button -->
              <button
                @click="resendOTP"
                :disabled="otpTimer !== '00'"
                class="w-full border border-[var(--Color-Boarder-Border-Primary)] text-[var(--Color-Text-Text-Primary)] py-3 px-6 rounded-[var(--Radius-Radius-Minimal)] font-semibold hover:bg-[var(--Color-Surface-Surface-Secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend OTP
              </button>

              <!-- Cancel Button -->
              <button
                @click="closeOTPModal"
                class="w-full text-[var(--Color-Text-Text-Secondary)] py-2 px-6 rounded-[var(--Radius-Radius-Minimal)] font-medium hover:text-[var(--Color-Text-Text-Primary)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Back to Plans -->
      <div class="text-center">
        <router-link
          to="/subscriptions"
          class="inline-flex items-center text-[var(--Color-Text-Text-Brand)] hover:text-[var(--Colors-Primary-600)] font-semibold"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Plans
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSubscriptions } from '@/composables/useSubscriptions';
import useUsers from '@/composables/useUsers';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const auth = getAuth();

const {
  plans,
  loading,
  error,
  fetchPlans,
  startSubscription
} = useSubscriptions();

const {
  userBalance,
  fetchUserBalance
} = useUsers();

const plan = ref(null);
const planName = computed(() => plan.value?.name || '');
const isAuthenticated = ref(false);
const paymentMethod = ref('');
const showOTPModal = ref(false);
const otpDigits = ref(['', '', '', '', '', '']);
const otpTimer = ref('05:00');
const userPhoneNumber = ref('');

onMounted(async () => {
  const planId = route.params.planId;
  
  // Check authentication status
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user;
    if (user) {
      fetchUserBalance(user.uid);
      // Get user phone number from auth or user profile
      userPhoneNumber.value = user.phoneNumber || '+201234567890';
    }
  });
  
  // Fetch plans
  await fetchPlans();
  
  // Find the specific plan
  plan.value = plans.value.find(p => p.id === planId);
  
  if (!plan.value) {
    Swal.fire({
      icon: 'error',
      title: 'Plan Not Found',
      text: 'The requested subscription plan was not found.',
      confirmButtonText: 'OK'
    });
    router.push('/subscriptions');
    return;
  }
});

const getPlanFeatures = (planId) => {
  const features = {
    'Magic': [
      'Access to all rental tools',
      'Standard customer support',
      'Basic email reminders',
      '24-hour rental periods'
    ],
    'Pro': [
      'Everything in Magic',
      'Priority customer support',
      'Comprehensive insurance',
      'Flexible rental periods',
      'No booking fees',
      'Early access to new tools'
    ],
    'Premium': [
      'Everything in Pro',
      '24/7 dedicated support',
      'Premium insurance',
      'Unlimited rental periods',
      'Priority booking',
      'Exclusive beta access',
      'Analytics dashboard'
    ]
  }
  return features[planId] || []
};

const payWithWallet = async () => {
  if (!isAuthenticated.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Authentication Required',
      text: 'Please log in to subscribe to a plan.',
      confirmButtonText: 'Go to Login',
      showCancelButton: true,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/login');
      }
    });
    return;
  }

  if (!userBalance.value || userBalance.value.balance < plan.value.price) {
    Swal.fire({
      icon: 'error',
      title: 'Insufficient Balance',
      text: 'You do not have enough balance to purchase this plan.',
      confirmButtonText: 'OK'
    });
    return;
  }

  try {
    loading.value = true;
    
    // Start subscription with wallet payment
    await startSubscription(plan.value.id, 'wallet');
    
    Swal.fire({
      icon: 'success',
      title: 'Subscription Activated!',
      text: 'Your subscription has been activated successfully using your wallet balance.',
      timer: 2000,
      showConfirmButton: false
    });
    
    // Redirect to subscriptions page
    router.push('/subscriptions');
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Payment Failed',
      text: err.message || 'Failed to process payment. Please try again.',
      confirmButtonText: 'OK'
    });
  } finally {
    loading.value = false;
  }
};

const processPayment = async () => {
  if (!isAuthenticated.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Authentication Required',
      text: 'Please log in to subscribe to a plan.',
      confirmButtonText: 'Go to Login',
      showCancelButton: true,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/login');
      }
    });
    return;
  }

  if (!paymentMethod.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Payment Method Required',
      text: 'Please select a payment method.',
      confirmButtonText: 'OK'
    });
    return;
  }

  // Show OTP modal for mobile payment methods
  if (['vodafone_cash', 'etisalat_wallet'].includes(paymentMethod.value)) {
    showOTPModal.value = true;
    startOTPTimer();
    // Simulate sending OTP
    Swal.fire({
      icon: 'success',
      title: 'OTP Sent!',
      text: `A 6-digit OTP has been sent to ${userPhoneNumber.value}`,
      timer: 2000,
      showConfirmButton: false
    });
  } else {
    // For credit card, proceed directly
    await completePayment();
  }
};

const startOTPTimer = () => {
  let minutes = 5;
  let seconds = 0;
  
  const timer = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(timer);
        otpTimer.value = '00:00';
        return;
      }
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }
    
    otpTimer.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
};

const handleOtpInput = (event, index) => {
  const value = event.target.value;
  if (value.length <= 1) {
    otpDigits.value[index] = value;
    if (value && index < 5) {
      event.target.nextElementSibling?.focus();
    }
  }
};

const handleOtpKeydown = (event, index) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpDigits.value[index - 1] = '';
    event.target.previousElementSibling?.focus();
  }
};

const handleOtpPaste = (event) => {
  event.preventDefault();
  const pastedData = event.clipboardData.getData('text').slice(0, 6);
  if (/^\d{6}$/.test(pastedData)) {
    otpDigits.value = pastedData.split('');
  }
};

const isOtpComplete = computed(() => {
  return otpDigits.value.every(digit => digit !== '');
});

const verifyOTP = async () => {
  if (!isOtpComplete.value) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid OTP',
      text: 'Please enter the complete 6-digit OTP.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const otp = otpDigits.value.join('');
  
  // Simulate OTP verification
  if (otp === '123456') { // For demo purposes
    await completePayment();
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Invalid OTP',
      text: 'The OTP you entered is incorrect. Please try again.',
      confirmButtonText: 'OK'
    });
  }
};

const resendOTP = () => {
  otpDigits.value = ['', '', '', '', '', ''];
  otpTimer.value = '05:00';
  startOTPTimer();
  
  Swal.fire({
    icon: 'success',
    title: 'OTP Resent!',
    text: `A new 6-digit OTP has been sent to ${userPhoneNumber.value}`,
    timer: 2000,
    showConfirmButton: false
  });
};

const closeOTPModal = () => {
  showOTPModal.value = false;
  otpDigits.value = ['', '', '', '', '', ''];
  otpTimer.value = '05:00';
};

const completePayment = async () => {
  try {
    loading.value = true;
    
    // Start subscription with selected payment method
    await startSubscription(plan.value.id, paymentMethod.value);
    
    Swal.fire({
      icon: 'success',
      title: 'Payment Successful!',
      text: 'Your subscription has been activated successfully.',
      timer: 2000,
      showConfirmButton: false
    });
    
    // Close OTP modal if open
    showOTPModal.value = false;
    
    // Redirect to subscriptions page
    router.push('/subscriptions');
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Payment Failed',
      text: err.message || 'Failed to process payment. Please try again.',
      confirmButtonText: 'OK'
    });
  } finally {
    loading.value = false;
  }
};
</script> 