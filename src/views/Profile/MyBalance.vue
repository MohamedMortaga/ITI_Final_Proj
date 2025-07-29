<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl text-[var(--Color-Text-Text-Primary)] font-medium dark:text-[var(--Color-Text-Text-Primary)] mb-4">{{ $t("balanceOverview") }}</h1>

    <!-- User Information Section -->
    <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">{{ $t("userInformation") }}</h2>
      <div class="flex items-center space-x-4 mb-4">
        <img 
          :src="userData.imageUrl || '/src/assets/default.png'" 
          alt="User Profile" 
          class="w-16 h-16 rounded-full object-cover border-2 border-[var(--Color-Boarder-Border-Primary)]"
        />
        <div>
          <h3 class="text-lg font-medium text-[var(--Color-Text-Text-Primary)]">{{ userData.displayName || 'User' }}</h3>
          <p class="text-[var(--Color-Text-Text-Secondary)]">{{ userData.email || 'No email' }}</p>
          <p class="text-[var(--Color-Text-Text-Secondary)]">{{ userData.phone || 'No phone' }}</p>
        </div>
      </div>
    </div>

                    <!-- Balance Summary -->
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)]">
                  <div>
                    <label>Total Income</label>
                    <input
                      type="text"
                      class="w-full p-2 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] focus:outline-none"
                      :value="`EGP ${totalIncome.toFixed(2)}`"
                      readonly
                    />
                  </div>
                  <div>
                    <label>Total Service Fee (Our Profit)</label>
                    <input
                      type="text"
                      class="w-full p-2 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] focus:outline-none"
                      :value="`EGP ${totalServiceFee.toFixed(2)}`"
                      readonly
                    />
                  </div>
                  <div>
                    <label>Total Profit (You)</label>
                    <input
                      type="text"
                      class="w-full p-2 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] focus:outline-none"
                      :value="`EGP ${totalProfit.toFixed(2)}`"
                      readonly
                    />
                  </div>
                  <div>
                    <label>Total Withdrawn</label>
                    <input
                      type="text"
                      class="w-full p-2 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] focus:outline-none"
                      :value="`EGP ${totalWithdrawn.toFixed(2)}`"
                      readonly
                    />
                  </div>
                  <div>
                    <label>Available Balance</label>
                    <input
                      type="text"
                      class="w-full p-2 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] focus:outline-none"
                      :value="`EGP ${remainingBalance.toFixed(2)}`"
                      readonly
                    />
                  </div>
                </div>

    <!-- Withdrawal Section -->
    <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">{{ $t("withdrawal") }}</h2>
      
      <!-- Testing Environment Notice -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-yellow-800 font-medium">{{ $t("testingEnvironment") }}</span>
        </div>
                  <p class="text-yellow-700 mt-2 text-sm">
            {{ $t("testingEnvironmentDesc") }}
          </p>
      </div>

      <!-- Available Balance for Withdrawal -->
      <div class="mb-4">
        <label class="block text-[var(--Color-Text-Text-Primary)] font-medium mb-2">{{ $t("availableBalance") }}</label>
        <div class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)]">
          EGP {{ remainingBalance.toFixed(2) }}
        </div>
        <p class="text-sm text-[var(--Color-Text-Text-Secondary)] mt-1">
          {{ $t("withdrawableAmountDesc") }}
        </p>
      </div>

      <!-- Withdrawal Form -->
      <div class="space-y-4">
        <div>
          <label class="block text-[var(--Color-Text-Text-Primary)] font-medium mb-2">Withdrawal Amount</label>
          <input
            v-model="withdrawalAmount"
            type="number"
            min="0"
            :max="availableForWithdrawal"
            step="0.01"
            class="w-full p-3 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
            placeholder="Enter amount to withdraw"
          />
        </div>

        <div>
          <label class="block text-[var(--Color-Text-Text-Primary)] font-medium mb-2">Payment Method</label>
          <select
            v-model="selectedPaymentMethod"
            class="w-full p-3 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
          >
            <option value="">Select payment method</option>
            <option value="vodafone_cash">Vodafone Cash</option>
            <option value="etisalat_cash">Etisalat Cash</option>
            <option value="bank_transfer">Credit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        <div v-if="selectedPaymentMethod === 'vodafone_cash' || selectedPaymentMethod === 'etisalat_cash'">
          <label class="block text-[var(--Color-Text-Text-Primary)] font-medium mb-2">Phone Number</label>
          <input
            v-model="phoneNumber"
            type="tel"
            class="w-full p-3 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
            placeholder="Enter phone number"
          />
        </div>

        <div v-if="selectedPaymentMethod === 'bank_transfer'">
          <label class="block text-[var(--Color-Text-Text-Primary)] font-medium mb-2">Credit Card Details</label>
          
          <!-- Card Number -->
          <div class="mb-4">
            <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">Card Number</label>
            <input
              v-model="cardNumber"
              type="text"
              maxlength="19"
              class="w-full p-3 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
              placeholder="1234 5678 9012 3456"
              @input="formatCardNumber"
            />
          </div>
          
          <!-- Expiry Date and CVV -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">Expiry Date</label>
              <input
                v-model="cardExpiry"
                type="text"
                maxlength="5"
                class="w-full p-3 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
                placeholder="MM/YY"
                @input="formatExpiryDate"
              />
            </div>
            <div>
              <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">CVV</label>
              <input
                v-model="cardCvv"
                type="text"
                maxlength="4"
                class="w-full p-3 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
                placeholder="123"
                @input="formatCvv"
              />
            </div>
          </div>
        </div>

        <div v-if="selectedPaymentMethod === 'paypal'">
          <label class="block text-[var(--Color-Text-Text-Primary)] font-medium mb-2">PayPal Email</label>
          <input
            v-model="paypalEmail"
            type="email"
            class="w-full p-3 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
            placeholder="Enter PayPal email"
          />
        </div>

        <!-- Withdrawal Summary -->
        <div v-if="withdrawalAmount > 0" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 class="font-medium text-[var(--Color-Text-Text-Primary)] mb-2">Withdrawal Summary</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between border-t pt-2">
              <span class="text-[var(--Color-Text-Text-Primary)] font-medium">Withdrawal Amount:</span>
              <span class="text-[var(--Color-Text-Text-Brand)] font-bold">EGP {{ totalWithdrawalAmount.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Withdraw Button -->
        <button
          @click="processWithdrawal"
          :disabled="!canWithdraw"
          class="w-full bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] py-3 px-6 rounded-lg font-semibold hover:bg-[var(--Color-Text-Text-Brand)] hover:text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {{ withdrawButtonText }}
        </button>
      </div>
    </div>

          <!-- Withdrawal History -->
      <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-lg p-6">
        <h2 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">{{ $t("withdrawalHistory") }}</h2>
                        <div v-if="loadingWithdrawalHistory" class="text-center text-[var(--Color-Text-Text-Secondary)] py-8">
                    <svg class="animate-spin w-8 h-8 mx-auto mb-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p>Loading withdrawal history...</p>
                  </div>
                  <div v-else-if="withdrawalHistory.length === 0" class="text-center text-[var(--Color-Text-Text-Secondary)] py-8">
                    <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p>{{ $t("noWithdrawals") }}</p>
                  </div>
      <div v-else class="space-y-4">
        <div v-for="transaction in withdrawalHistory" :key="transaction.id" class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ formatPaymentMethod(transaction.paymentMethod) }}</h3>
                  <p class="text-sm text-gray-500">{{ formatDate(transaction.timestamp) }}</p>
                </div>
              </div>
                                      <div class="text-sm text-gray-600">
                          <p><span class="font-medium">Amount:</span> EGP {{ transaction.amount.toFixed(2) }}</p>
                          <p><span class="font-medium">Withdrawal Fee:</span> EGP {{ (transaction.withdrawalFee || 0).toFixed(2) }}</p>
                          <p><span class="font-medium">Date:</span> {{ formatDate(transaction.timestamp) }}</p>
                          <p><span class="font-medium">Method:</span> {{ formatPaymentMethod(transaction.paymentMethod) }}</p>
                          <p v-if="transaction.paymentDetails" class="text-xs text-gray-500 mt-1">{{ maskPaymentDetails(transaction.paymentDetails, transaction.paymentMethod) }}</p>
                        </div>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-green-600">EGP {{ transaction.amount.toFixed(2) }}</p>
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              ]">
                {{ transaction.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Listings -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div v-for="item in items" :key="item.id" class="border p-4 rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)]">
        <img :src="item.img" class="w-full h-40 object-cover mb-2" />
        <h2 class="text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] font-medium">{{ item.title }}</h2>
        <p class="text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)]">Price/Day: {{ item.pricePerDay }}</p>
        <p class="text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)]">Service Fee: {{ item.serviceFee }}</p>
        <p class="text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)]">Total Profit: {{ item.totalProfit }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { db } from "@/firebase/config";
import { collection, getDocs, doc, setDoc, getDoc, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

            const items = ref([]);
            const totalIncome = ref(0);
            const totalServiceFee = ref(0);
            const totalProfit = ref(0);
            const totalWithdrawn = ref(0);
            const remainingBalance = ref(0);
            const userData = ref({});
            const withdrawalHistory = ref([]);
            const loadingWithdrawalHistory = ref(false);

// Withdrawal form data
const withdrawalAmount = ref(0);
const selectedPaymentMethod = ref('');
const phoneNumber = ref('');
const cardNumber = ref('');
const cardExpiry = ref('');
const cardCvv = ref('');
const paypalEmail = ref('');

            // Withdrawal service fee rate (15%)
            const withdrawalServiceFeeRate = 0.15;
            
            // Computed properties
            const withdrawableAmount = computed(() => {
              return remainingBalance.value;
            });
            
            const availableForWithdrawal = computed(() => {
              return remainingBalance.value;
            });
            
            // Update remaining balance to match available balance
            const updateRemainingBalance = () => {
              remainingBalance.value = availableForWithdrawal.value;
            };
            
            const totalWithdrawalAmount = computed(() => {
              return parseFloat(withdrawalAmount.value);
            });

            const canWithdraw = computed(() => {
              const hasValidAmount = withdrawalAmount.value > 0 && withdrawalAmount.value <= remainingBalance.value;
              const hasValidPaymentMethod = selectedPaymentMethod.value;
              
              // Check payment method specific requirements
              let hasValidPaymentDetails = false;
              switch (selectedPaymentMethod.value) {
                case 'vodafone_cash':
                case 'etisalat_cash':
                  hasValidPaymentDetails = phoneNumber.value.trim().length > 0;
                  break;
                case 'bank_transfer':
                  hasValidPaymentDetails = cardNumber.value.replace(/\s/g, '').length === 16 && 
                                         cardExpiry.value.length === 5 && 
                                         cardCvv.value.length >= 3;
                  break;
                case 'paypal':
                  hasValidPaymentDetails = paypalEmail.value.trim().length > 0;
                  break;
                default:
                  hasValidPaymentDetails = false;
              }
              
              return hasValidAmount && hasValidPaymentMethod && hasValidPaymentDetails;
            });

const withdrawButtonText = computed(() => {
  if (!withdrawalAmount.value) return 'Enter withdrawal amount';
  if (withdrawalAmount.value > remainingBalance.value) return 'Amount exceeds available balance';
  if (!selectedPaymentMethod.value) return 'Select payment method';
  
  // Check payment method specific requirements
  switch (selectedPaymentMethod.value) {
    case 'vodafone_cash':
    case 'etisalat_cash':
      if (!phoneNumber.value.trim()) return 'Enter phone number';
      break;
    case 'bank_transfer':
      if (cardNumber.value.replace(/\s/g, '').length !== 16) return 'Enter valid card number (16 digits)';
      if (cardExpiry.value.length !== 5) return 'Enter valid expiry date (MM/YY)';
      if (cardCvv.value.length < 3) return 'Enter valid CVV (3-4 digits)';
      break;
    case 'paypal':
      if (!paypalEmail.value.trim()) return 'Enter PayPal email';
      break;
  }
  
  return 'Process Withdrawal';
});

            // Format date
            const formatDate = (timestamp) => {
              if (!timestamp) return '';
              
              let date;
              if (timestamp.toDate) {
                // Firestore timestamp
                date = timestamp.toDate();
              } else if (timestamp.seconds) {
                // Firestore timestamp object
                date = new Date(timestamp.seconds * 1000);
              } else if (typeof timestamp === 'string') {
                // ISO string
                date = new Date(timestamp);
              } else {
                // Regular date object or timestamp
                date = new Date(timestamp);
              }
              
              // Check if date is valid
              if (isNaN(date.getTime())) {
                console.warn('Invalid timestamp:', timestamp);
                return 'Invalid Date';
              }
              
              return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
            };
            
            // Format payment method
            const formatPaymentMethod = (method) => {
              const methods = {
                'vodafone_cash': 'Vodafone Cash',
                'etisalat_cash': 'Etisalat Cash',
                'bank_transfer': 'Credit Card',
                'paypal': 'PayPal'
              };
              return methods[method] || method;
            };

// Process withdrawal
const processWithdrawal = async () => {
  if (!canWithdraw.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Withdrawal',
      text: 'Please check your withdrawal details and try again.',
    });
    return;
  }

  try {
                    // Create withdrawal transaction
                const withdrawalData = {
                  userId: userData.value.uid,
                  amount: parseFloat(withdrawalAmount.value),
                  totalAmount: totalWithdrawalAmount.value,
                  withdrawalFee: parseFloat(withdrawalAmount.value) * withdrawalServiceFeeRate,
                  paymentMethod: selectedPaymentMethod.value,
                  paymentDetails: getPaymentDetails(),
                  status: 'pending', // Initial status - waiting for admin approval
                  timestamp: serverTimestamp(),
                  submittedAt: serverTimestamp(),
                  userDisplayName: userData.value.displayName || 'Unknown User',
                  userEmail: userData.value.email || '',
                  userPhone: userData.value.phone || '',
                };

                    // Add to withdrawal history
                console.log('Saving withdrawal data:', withdrawalData);
                const withdrawalRef = await addDoc(collection(db, 'withdrawalHistory'), withdrawalData);
                console.log('Withdrawal saved with ID:', withdrawalRef.id);
                
                // Update local state
                withdrawalHistory.value.unshift({
                  id: withdrawalRef.id,
                  ...withdrawalData,
                  timestamp: new Date()
                });
                
                // Update withdrawal tracking
                totalWithdrawn.value += parseFloat(withdrawalAmount.value);
                // Calculate remaining balance and apply withdrawal fee
                const calculatedRemainingBalance = totalProfit.value - totalWithdrawn.value;
                remainingBalance.value = calculatedRemainingBalance * (1 - withdrawalServiceFeeRate);
                
                // Update user balance in Firestore
                const userBalanceRef = doc(db, "userbalance", userData.value.uid);
                await setDoc(
                  userBalanceRef,
                  {
                    userid: userData.value.uid,
                    balance: totalIncome.value,
                    profit: totalProfit.value,
                    serviceFee: totalServiceFee.value,
                    totalWithdrawn: totalWithdrawn.value,
                    remainingBalance: remainingBalance.value,
                    ...userData.value,
                  },
                  { merge: true }
                );
                
                // Update profit record
                const profitRef = doc(db, "ourprofite", userData.value.uid);
                await setDoc(
                  profitRef,
                  {
                    balance: totalServiceFee.value,
                    sellersProfit: totalProfit.value,
                    totalWithdrawn: totalWithdrawn.value,
                    remainingBalance: remainingBalance.value,
                  },
                  { merge: true }
                );
            
                // Reset form
                withdrawalAmount.value = 0;
                selectedPaymentMethod.value = '';
                phoneNumber.value = '';
                cardNumber.value = '';
                cardExpiry.value = '';
                cardCvv.value = '';
                paypalEmail.value = '';

                    // Show success message
                Swal.fire({
                  icon: 'success',
                  title: 'Withdrawal Request Submitted',
                  text: 'Your withdrawal request has been submitted successfully. Your balance has been updated accordingly.',
                  timer: 3000,
                  showConfirmButton: false
                });

  } catch (error) {
    console.error('Error processing withdrawal:', error);
    Swal.fire({
      icon: 'error',
      title: 'Withdrawal Failed',
      text: 'There was an error processing your withdrawal. Please try again.',
    });
  }
};

// Format card number with spaces
const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
  if (value.length > 16) value = value.slice(0, 16);
  cardNumber.value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
};

// Format expiry date
const formatExpiryDate = (event) => {
  let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
  if (value.length > 4) value = value.slice(0, 4);
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2);
  }
  cardExpiry.value = value;
};

// Format CVV
const formatCvv = (event) => {
  let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
  if (value.length > 4) value = value.slice(0, 4);
  cardCvv.value = value;
};

// Mask card number for security
const maskCardNumber = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  if (cleanNumber.length < 4) return cleanNumber;
  return cleanNumber.slice(0, 4) + ' **** **** ' + cleanNumber.slice(-4);
};

// Mask payment details for security display
const maskPaymentDetails = (paymentDetails, paymentMethod) => {
  if (!paymentDetails) return '';
  
  if (paymentMethod === 'bank_transfer') {
    // Extract card information and mask it
    const cardMatch = paymentDetails.match(/Card: (\d{4})\s\*\*\*\*\s\*\*\*\*\s(\d{4})/);
    if (cardMatch) {
      return `Card: ${cardMatch[1]} **** **** ${cardMatch[2]} | Expiry: **/** | CVV: ***`;
    }
    // If not already masked, mask it
    const cardNumberMatch = paymentDetails.match(/Card: (\d{16})/);
    if (cardNumberMatch) {
      const cardNumber = cardNumberMatch[1];
      return `Card: ${cardNumber.slice(0, 4)} **** **** ${cardNumber.slice(-4)} | Expiry: **/** | CVV: ***`;
    }
  }
  
  return paymentDetails;
};

// Get payment details based on selected method
const getPaymentDetails = () => {
  switch (selectedPaymentMethod.value) {
    case 'vodafone_cash':
    case 'etisalat_cash':
      return `Phone: ${phoneNumber.value}`;
    case 'bank_transfer':
      return `Card: ${maskCardNumber(cardNumber.value)} | Expiry: ${cardExpiry.value} | CVV: ***`;
    case 'paypal':
      return `Email: ${paypalEmail.value}`;
    default:
      return '';
  }
};

// Load user data
const loadUserData = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      userData.value = {
        uid: userId,
        ...userDocSnap.data()
      };
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
};

            // Load withdrawal history with real-time updates
            const loadWithdrawalHistory = async (userId) => {
              try {
                loadingWithdrawalHistory.value = true;
                console.log('Loading withdrawal history for user:', userId);
                console.log('User ID type:', typeof userId);
                console.log('User ID length:', userId.length);
                const withdrawalsRef = collection(db, 'withdrawalHistory');
                
                // Use simple query without orderBy to avoid index requirement
                const q = query(withdrawalsRef, where('userId', '==', userId));
                
                // Debug: Try to get all documents first to see if collection exists
                try {
                  const allDocs = await getDocs(withdrawalsRef);
                  console.log('All documents in withdrawalHistory collection:', allDocs.docs.length);
                  allDocs.docs.forEach(doc => {
                    console.log('Doc ID:', doc.id, 'Data:', doc.data());
                  });
                } catch (error) {
                  console.error('Error accessing withdrawalHistory collection:', error);
                }
                
                // First, load initial data
                const initialSnapshot = await getDocs(q);
                console.log('Initial snapshot size:', initialSnapshot.docs.length);
                console.log('Initial snapshot docs:', initialSnapshot.docs);
                
                // Sort manually since we're not using orderBy in the query
                const docs = initialSnapshot.docs.sort((a, b) => {
                  const aTime = a.data().timestamp?.toDate?.() || a.data().timestamp || new Date(0);
                  const bTime = b.data().timestamp?.toDate?.() || b.data().timestamp || new Date(0);
                  return bTime - aTime; // Descending order
                });
                
                withdrawalHistory.value = docs.map(doc => {
                  const data = doc.data();
                  console.log('Initial withdrawal data:', data);
                  console.log('Processing doc ID:', doc.id);
                  
                  const processedData = {
                    id: doc.id,
                    amount: parseFloat(data.amount) || 0,
                    paymentMethod: data.paymentMethod || '',
                    paymentDetails: data.paymentDetails || '',
                    status: data.status || 'pending',
                    timestamp: data.timestamp || data.submittedAt || new Date(),
                    withdrawalFee: parseFloat(data.withdrawalFee) || 0,
                    totalAmount: parseFloat(data.totalAmount) || parseFloat(data.amount) || 0,
                    userDisplayName: data.userDisplayName || '',
                    userEmail: data.userEmail || '',
                    userPhone: data.userPhone || '',
                    userId: data.userId || ''
                  };
                  
                  console.log('Processed withdrawal data:', processedData);
                  return processedData;
                });
                
                console.log('Initial withdrawal history loaded:', withdrawalHistory.value);
                console.log('Withdrawal history length:', withdrawalHistory.value.length);
                
                // Then set up real-time listener for updates
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                  console.log('Real-time snapshot size:', querySnapshot.docs.length);
                  
                  // Sort manually since we're not using orderBy in the query
                  const realTimeDocs = querySnapshot.docs.sort((a, b) => {
                    const aTime = a.data().timestamp?.toDate?.() || a.data().timestamp || new Date(0);
                    const bTime = b.data().timestamp?.toDate?.() || b.data().timestamp || new Date(0);
                    return bTime - aTime; // Descending order
                  });
                  
                  withdrawalHistory.value = realTimeDocs.map(doc => {
                    const data = doc.data();
                    console.log('Real-time withdrawal data:', data);
                    
                    return {
                      id: doc.id,
                      amount: parseFloat(data.amount) || 0,
                      paymentMethod: data.paymentMethod || '',
                      paymentDetails: data.paymentDetails || '',
                      status: data.status || 'pending',
                      timestamp: data.timestamp || data.submittedAt || new Date(),
                      withdrawalFee: parseFloat(data.withdrawalFee) || 0,
                      totalAmount: parseFloat(data.totalAmount) || parseFloat(data.amount) || 0,
                      userDisplayName: data.userDisplayName || '',
                      userEmail: data.userEmail || '',
                      userPhone: data.userPhone || '',
                      userId: data.userId || ''
                    };
                  });
                  
                  console.log('Real-time withdrawal history updated:', withdrawalHistory.value);
                  console.log('Updated withdrawal history length:', withdrawalHistory.value.length);
                }, (error) => {
                  console.error('Error in withdrawal history listener:', error);
                });
                
                // Store unsubscribe function for cleanup
                window.withdrawalHistoryUnsubscribe = unsubscribe;
                
                              } catch (error) {
                  console.error('Error loading withdrawal history:', error);
                  // Fallback: try without orderBy
                  try {
                    console.log('Trying fallback query without orderBy...');
                    const withdrawalsRef = collection(db, 'withdrawalHistory');
                    const fallbackQuery = query(withdrawalsRef, where('userId', '==', userId));
                    const fallbackSnapshot = await getDocs(fallbackQuery);
                    
                    withdrawalHistory.value = fallbackSnapshot.docs
                      .sort((a, b) => {
                        const aTime = a.data().timestamp?.toDate?.() || a.data().timestamp || new Date(0);
                        const bTime = b.data().timestamp?.toDate?.() || b.data().timestamp || new Date(0);
                        return bTime - aTime;
                      })
                      .map(doc => {
                        const data = doc.data();
                        return {
                          id: doc.id,
                          amount: parseFloat(data.amount) || 0,
                          paymentMethod: data.paymentMethod || '',
                          paymentDetails: data.paymentDetails || '',
                          status: data.status || 'pending',
                          timestamp: data.timestamp || data.submittedAt || new Date(),
                          withdrawalFee: parseFloat(data.withdrawalFee) || 0,
                          totalAmount: parseFloat(data.totalAmount) || parseFloat(data.amount) || 0,
                          userDisplayName: data.userDisplayName || '',
                          userEmail: data.userEmail || '',
                          userPhone: data.userPhone || '',
                          userId: data.userId || ''
                        };
                      });
                    
                    console.log('Fallback withdrawal history loaded:', withdrawalHistory.value);
                  } catch (fallbackError) {
                    console.error('Fallback also failed:', fallbackError);
                  }
                } finally {
                  loadingWithdrawalHistory.value = false;
                }
            };

            onMounted(() => {
              const auth = getAuth();
            
              onAuthStateChanged(auth, async (user) => {
                if (!user) {
                  console.warn("User not logged in");
                  return;
                }
            
                const currentUserId = user.uid;
                console.log('User authenticated:', currentUserId);
            
                try {
                  // Load user data
                  await loadUserData(currentUserId);
                  
                  // Load withdrawal history with real-time updates
                  await loadWithdrawalHistory(currentUserId);
                  
                  // Get bookings only
                  const bookingsSnap = await getDocs(collection(db, "bookings"));

                  for (const docSnap of bookingsSnap.docs) {
                    const booking = docSnap.data();
                    const sellerId = booking.sellerId || booking.userId || "unknown";

                    // ⚠️ Only show current user's bookings
                    if (sellerId !== currentUserId) continue;

                    const price = Number(booking.productPrice ?? 0);
                    const fee = Number(booking.deliveryFee ?? 0);
                    const sellerProfit = price - fee;

                    items.value.push({
                      id: docSnap.id,
                      img: booking.productImage,
                      title: booking.productTitle,
                      pricePerDay: `EGP ${price.toFixed(2)}`,
                      serviceFee: `EGP ${fee.toFixed(2)}`,
                      totalProfit: `EGP ${sellerProfit.toFixed(2)}`,
                    });

                    totalIncome.value += price;
                    totalServiceFee.value += fee;
                    totalProfit.value += sellerProfit;
                  }

                  // Load balance data
                  const userBalanceRef = doc(db, "userbalance", currentUserId);
                  const userBalanceDoc = await getDoc(userBalanceRef);
                  
                  if (userBalanceDoc.exists()) {
                    const balanceData = userBalanceDoc.data();
                    totalWithdrawn.value = balanceData.totalWithdrawn || 0;
                    // Calculate remaining balance as total profit minus total withdrawn
                    const calculatedRemainingBalance = totalProfit.value - totalWithdrawn.value;
                    // Apply the withdrawal fee to get the actual available balance
                    remainingBalance.value = calculatedRemainingBalance * (1 - withdrawalServiceFeeRate);
                  } else {
                    totalWithdrawn.value = 0;
                    // Apply the withdrawal fee to get the actual available balance
                    remainingBalance.value = totalProfit.value * (1 - withdrawalServiceFeeRate);
                  }
                  
                  // Update balance records
                  await setDoc(
                    userBalanceRef,
                    {
                      userid: currentUserId,
                      balance: totalIncome.value,
                      profit: totalProfit.value,
                      serviceFee: totalServiceFee.value,
                      totalWithdrawn: totalWithdrawn.value,
                      remainingBalance: remainingBalance.value,
                      ...userData.value,
                    },
                    { merge: true }
                  );
              
                  const profitRef = doc(db, "ourprofite", currentUserId);
                  await setDoc(
                    profitRef,
                    {
                      balance: totalServiceFee.value,
                      sellersProfit: totalProfit.value,
                      totalWithdrawn: totalWithdrawn.value,
                      remainingBalance: remainingBalance.value,
                    },
                    { merge: true }
                  );
                  
                  console.log('All data loaded successfully');
                  
                } catch (error) {
                  console.error('Error loading user data:', error);
                }

                    // Load existing balance data
                const userBalanceRef = doc(db, "userbalance", currentUserId);
                const userBalanceDoc = await getDoc(userBalanceRef);
                
                if (userBalanceDoc.exists()) {
                  const balanceData = userBalanceDoc.data();
                  totalWithdrawn.value = balanceData.totalWithdrawn || 0;
                  remainingBalance.value = balanceData.remainingBalance || totalProfit.value;
                } else {
                  // First time user - initialize withdrawal tracking
                  totalWithdrawn.value = 0;
                  remainingBalance.value = totalProfit.value;
                }
                
                // Save balance for this user
                await setDoc(
                  userBalanceRef,
                  {
                    userid: currentUserId,
                    balance: totalIncome.value,
                    profit: totalProfit.value,
                    serviceFee: totalServiceFee.value,
                    totalWithdrawn: totalWithdrawn.value,
                    remainingBalance: remainingBalance.value,
                    ...userData.value,
                  },
                  { merge: true }
                );
            
                // Save profit record
                const profitRef = doc(db, "ourprofite", currentUserId);
                await setDoc(
                  profitRef,
                  {
                    balance: totalServiceFee.value,
                    sellersProfit: totalProfit.value,
                    totalWithdrawn: totalWithdrawn.value,
                    remainingBalance: remainingBalance.value,
                  },
                  { merge: true }
                                );
              });
            });
            
            // Cleanup real-time listeners when component unmounts
            onBeforeUnmount(() => {
              if (window.withdrawalHistoryUnsubscribe) {
                window.withdrawalHistoryUnsubscribe();
                console.log('Cleaned up withdrawal history listener');
              }
            });
</script>
