<template>
  <div class="min-h-screen p-8">
    <!-- Top Bar -->
    <TopBar
      title="User Rentals"
      searchPlaceholder="Search rentals..."
      @update:search="handleSearch"
      @update:sort="handleSort"
    />

    <!-- User Balance Summary -->
    <div class="bg-white rounded-xl shadow border mt-4">
      <div class="px-6 py-4 border-b">
        <h2 class="text-xl font-semibold text-gray-800">User Balance Summary</h2>
        <p class="text-sm text-gray-600 mt-1">Complete financial overview for {{ userName }}</p>
      </div>
      
      <div class="p-6">
        <div v-if="loadingBalance" class="text-center py-8">
          <svg class="animate-spin w-8 h-8 mx-auto mb-4 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Loading balance information...</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-blue-800">Total Income</h3>
            <p class="text-2xl font-bold text-blue-900">EGP {{ userBalance.totalIncome.toFixed(2) }}</p>
            <p class="text-xs text-blue-600 mt-1">From all rentals</p>
          </div>
          
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-orange-800">Service Fees</h3>
            <p class="text-2xl font-bold text-orange-900">EGP {{ userBalance.totalServiceFee.toFixed(2) }}</p>
            <p class="text-xs text-orange-600 mt-1">Platform commission</p>
          </div>
          
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-green-800">Total Profit</h3>
            <p class="text-2xl font-bold text-green-900">EGP {{ userBalance.totalProfit.toFixed(2) }}</p>
            <p class="text-xs text-green-600 mt-1">User's earnings</p>
          </div>
          
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-purple-800">Total Withdrawn</h3>
            <p class="text-2xl font-bold text-purple-900">EGP {{ userBalance.totalWithdrawn.toFixed(2) }}</p>
            <p class="text-xs text-purple-600 mt-1">Withdrawal history</p>
          </div>
          
          <div class="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-teal-800">Remaining Balance</h3>
            <p class="text-2xl font-bold text-teal-900">EGP {{ userBalance.remainingBalance.toFixed(2) }}</p>
            <p class="text-xs text-teal-600 mt-1">Available for withdrawal</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add New Rental Section -->
    <div class="bg-white rounded-xl shadow border mt-4">
      <div class="px-6 py-4 border-b">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800">User Rentals</h2>
        </div>
        <p class="text-sm text-gray-600 mt-1">Manage rentals for {{ userName }}</p>
      </div>
      
      <!-- Rental Summary -->
      <div class="bg-gray-50 p-4 rounded-lg mb-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ filteredRentals.length }}</div>
            <div class="text-sm text-gray-600">Total Rentals</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ filteredRentals.filter(r => r.status === 'active').length }}
            </div>
            <div class="text-sm text-gray-600">Active Rentals</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">
              {{ filteredRentals.filter(r => r.status === 'pending').length }}
            </div>
            <div class="text-sm text-gray-600">Pending Rentals</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">
              EGP {{ filteredRentals.reduce((sum, r) => sum + (r.totalPrice || 0), 0).toFixed(2) }}
            </div>
            <div class="text-sm text-gray-600">Total Value</div>
          </div>
        </div>
      </div>
      
      <!-- Rentals Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y">
          <thead>
            <tr>
              <th class="px-4 py-3">Product</th>
              <th class="px-4 py-3">Total Price</th>
              <th class="px-4 py-3">Start Date</th>
              <th class="px-4 py-3">End Date</th>
              <th class="px-4 py-3">Payment Method</th>
              <th class="px-4 py-3">Phone Number</th>
              <th class="px-4 py-3">Card Holder</th>
              <th class="px-4 py-3">Card</th>
              <th class="px-4 py-3">Expiry</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3 text-center"><i class="fas fa-ellipsis-v"></i></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rental in filteredRentals" :key="rental.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ rental.productTitle }}</td>
              <td class="px-4 py-3">{{ rental.totalPrice }} EGP</td>
              <td class="px-4 py-3">{{ formatDate(rental.startDate) }}</td>
              <td class="px-4 py-3">{{ formatDate(rental.endDate) }}</td>
              <td class="px-4 py-3">{{ rental.paymentMethod }}</td>
              <td class="px-4 py-3">
                <span v-if="['vodafone_cash', 'phone', 'etisalat_cash'].includes(rental.paymentMethod) && rental.phoneNumber">
                  {{ rental.phoneNumber }}
                </span>
                <span v-else>-</span>
              </td>
              <td class="px-4 py-3">{{ rental.cardHolderName || '-' }}</td>
              <td class="px-4 py-3">{{ rental.cardNumber ? '**** **** **** ' + rental.cardNumber.slice(-4) : '-' }}</td>
              <td class="px-4 py-3">{{ rental.expiryDate || '-' }}</td>
              <td class="px-4 py-3">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-bold',
                  rental.status === 'active' ? 'bg-green-100 text-green-700' :
                    rental.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                ]">
                  {{ rental.status }}
                </span>
              </td>
              <td class="px-4 py-3 flex items-center space-x-2 justify-center">
                <select
                  v-model="rental.status"
                  @change="updateStatus(rental.id, rental.status)"
                  class="px-2 py-1 text-sm border rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  @click="deleteRental(rental.id)"
                  class="text-red-500 hover:text-red-700 text-sm font-semibold"
                >
                  Cancel Booking
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- No Rentals Fallback -->
        <div v-if="!filteredRentals.length && !loading" class="text-gray-600 mt-8 text-center">
          <p>No rentals found for this user.</p>
        </div>
      </div>
    </div>

    <!-- Withdrawal History Section -->
    <div class="bg-white rounded-xl shadow border mt-6">
      <div class="px-6 py-4 border-b">
        <h2 class="text-xl font-semibold text-gray-800">Withdrawal History</h2>
        <p class="text-sm text-gray-600 mt-1">Track all withdrawal requests and transactions for this user</p>
      </div>
      
      <div class="p-6">
        <div v-if="loadingWithdrawals" class="text-center py-8">
          <svg class="animate-spin w-8 h-8 mx-auto mb-4 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Loading withdrawal history...</p>
        </div>
        
        <div v-else-if="userWithdrawals.length === 0" class="text-center py-8">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="text-gray-600">No withdrawal history found for this user.</p>
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="withdrawal in userWithdrawals" :key="withdrawal.id" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ formatPaymentMethod(withdrawal.paymentMethod) }}</h3>
                    <p class="text-sm text-gray-500">{{ formatWithdrawalDate(withdrawal.timestamp) }}</p>
                  </div>
                </div>
                <div class="text-sm text-gray-600 space-y-1">
                  <p><span class="font-medium">Amount:</span> EGP {{ withdrawal.amount.toFixed(2) }}</p>
                  <p><span class="font-medium">Withdrawal Fee:</span> EGP {{ (withdrawal.withdrawalFee || 0).toFixed(2) }}</p>
                  <p><span class="font-medium">Date:</span> {{ formatWithdrawalDate(withdrawal.timestamp) }}</p>
                  <p><span class="font-medium">Method:</span> {{ formatPaymentMethod(withdrawal.paymentMethod) }}</p>
                  <p v-if="withdrawal.paymentDetails" class="text-xs text-gray-500 mt-1">{{ maskPaymentDetails(withdrawal.paymentDetails, withdrawal.paymentMethod) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-green-600">EGP {{ withdrawal.amount.toFixed(2) }}</p>
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  withdrawal.status === 'completed' ? 'bg-green-100 text-green-700' :
                  withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                ]">
                  {{ withdrawal.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, watch } from 'vue'
import TopBar from '@/components/admin/TopBar.vue'
import { useRoute } from 'vue-router'
import { doc, getDoc, deleteDoc, updateDoc, collection, query, where, orderBy, getDocs, onSnapshot, addDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import Swal from 'sweetalert2'
import { useAdminRealTime } from '@/composables/useAdminRealTime'

const route = useRoute()
const userId = route.params.userId

// Initialize real-time data
const { bookings, users, initializeRealTimeData, cleanup } = useAdminRealTime()

const userName = ref('')
const searchQuery = ref('')
const sortOption = ref('Newest First')

// Withdrawal history
const userWithdrawals = ref([])
const loadingWithdrawals = ref(false)

// User balance
const userBalance = ref({
  totalIncome: 0,
  totalServiceFee: 0,
  totalProfit: 0,
  totalWithdrawn: 0,
  remainingBalance: 0
})
const loadingBalance = ref(false)

// Computed property to filter bookings for this user
const rentals = computed(() => {
  return bookings.value.filter(booking => booking.userId === userId)
})

// Loading state based on real-time data
const loading = computed(() => {
  return bookings.value.length === 0 && true // Show loading until data is loaded
})

// Filtered and sorted rentals
const filteredRentals = computed(() => {
  let filtered = rentals.value;
  
  // Search functionality
  if (searchQuery.value) {
    filtered = filtered.filter(rental =>
      (rental.productTitle || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (rental.paymentMethod || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  // Sort functionality
  filtered = [...filtered].sort((a, b) => {
    if (sortOption.value === 'Newest First') {
      // Sort by start date, newest first
      return new Date(b.startDate) - new Date(a.startDate);
    } else if (sortOption.value === 'Oldest First') {
      // Sort by start date, oldest first
      return new Date(a.startDate) - new Date(b.startDate);
    } else if (sortOption.value === 'Price High to Low') {
      // Sort by price, high to low
      return (b.totalPrice || 0) - (a.totalPrice || 0);
    } else if (sortOption.value === 'Price Low to High') {
      // Sort by price, low to high
      return (a.totalPrice || 0) - (b.totalPrice || 0);
    }
    return 0;
  });
  
  return filtered;
});

const handleSearch = (query) => {
  searchQuery.value = query;
};

const handleSort = (option) => {
  sortOption.value = option;
};

// Fetch user name
const fetchUserName = async () => {
  try {
    const userDocRef = doc(db, 'users', userId)
    const userDocSnap = await getDoc(userDocRef)
    if (userDocSnap.exists()) {
      userName.value = userDocSnap.data().displayName || 'User'
      // Set user details for new rental
      // newRental.value.userName = userDocSnap.data().displayName || 'User'
      // newRental.value.userEmail = userDocSnap.data().email || ''
    } else {
      userName.value = 'User'
      // newRental.value.userName = 'User'
      // newRental.value.userEmail = ''
    }
  } catch (error) {
    console.error("Error fetching user name:", error)
    userName.value = 'User'
    // newRental.value.userName = 'User'
    // newRental.value.userEmail = ''
  }
}

// Load available products
const loadAvailableProducts = async () => {
  try {
    const productsRef = collection(db, 'products')
    const q = query(productsRef, where('isApproved', '==', true))
    const querySnapshot = await getDocs(q)
    // availableProducts.value = querySnapshot.docs.map(doc => ({
    //   id: doc.id,
    //   ...doc.data()
    // }))
  } catch (error) {
    console.error('Error loading available products:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load available products'
    })
  }
}

// Get selected product title
const getSelectedProductTitle = () => {
  // const product = availableProducts.value.find(p => p.id === newRental.value.productId)
  // return product ? product.title : 'No product selected'
  return 'No product selected'
}

// Calculate rental days
const calculateRentalDays = () => {
  // if (!newRental.value.startDate || !newRental.value.endDate) return 0
  // const start = new Date(newRental.value.startDate)
  // const end = new Date(newRental.value.endDate)
  // const diffTime = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  // return Math.max(1, diffTime + 1)
  return 0
}

// Calculate rental total
const calculateRentalTotal = () => {
  // const product = availableProducts.value.find(p => p.id === newRental.value.productId)
  // if (!product) return 0
  // const days = calculateRentalDays()
  // const deliveryFee = 10 // Fixed delivery fee
  // return (product.price * days) + deliveryFee
  return 0
}

// Add new rental
const addNewRental = async () => {
  // try {
  //   const product = availableProducts.value.find(p => p.id === newRental.value.productId)
  //   if (!product) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: 'Please select a valid product'
  //     })
  //     return
  //   }

  //   const days = calculateRentalDays()
  //   const deliveryFee = 10
  //   const totalPrice = (product.price * days) + deliveryFee

  //   const rentalData = {
  //     ...newRental.value,
  //     productTitle: product.title,
  //     productPrice: product.price,
  //     productId: product.id,
  //     sellerId: product.userId || product.sellerId,
  //     sellerName: product.ownerName || 'Unknown',
  //     totalPrice: totalPrice,
  //     deliveryFee: deliveryFee,
  //     timestamp: new Date(),
  //     createdAt: new Date()
  //   }

  //   // Add to bookings collection
  //   const bookingsRef = collection(db, 'bookings')
  //   await addDoc(bookingsRef, rentalData)

  //   // Reset form
  //   newRental.value = {
  //     productId: '',
  //     startDate: '',
  //     endDate: '',
  //     paymentMethod: '',
  //     phoneNumber: '',
  //     cardNumber: '',
  //     cardHolderName: '',
  //     expiryDate: '',
  //     cvv: '',
  //     status: 'pending',
  //     userId: userId,
  //     userName: newRental.value.userName,
  //     userEmail: newRental.value.userEmail,
  //     totalPrice: 0,
  //     deliveryFee: 0
  //   }

  //   showAddRentalForm.value = false

  //   Swal.fire({
  //     icon: 'success',
  //     title: 'Success',
  //     text: 'Rental added successfully!',
  //     timer: 2000,
  //     showConfirmButton: false
  //   })

  // } catch (error) {
  //   console.error('Error adding rental:', error)
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'Error',
  //     text: 'Failed to add rental. Please try again.'
  //   })
  // }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const formatWithdrawalDate = (timestamp) => {
  if (!timestamp) return '';
  
  let date;
  if (timestamp.toDate) {
    date = timestamp.toDate();
  } else if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else {
    date = new Date(timestamp);
  }
  
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

const formatPaymentMethod = (method) => {
  const methods = {
    'vodafone_cash': 'Vodafone Cash',
    'etisalat_cash': 'Etisalat Cash',
    'bank_transfer': 'Credit Card',
    'paypal': 'PayPal'
  };
  return methods[method] || method;
};

// Mask payment details for security
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

const loadUserWithdrawals = async () => {
  try {
    loadingWithdrawals.value = true;
    console.log('Loading withdrawal history for user:', userId);
    
    const withdrawalsRef = collection(db, 'withdrawalHistory');
    
    // Use simple query without orderBy to avoid index requirement
    const q = query(withdrawalsRef, where('userId', '==', userId));
    
    // First, load initial data
    const initialSnapshot = await getDocs(q);
    
    // Sort manually since we're not using orderBy in the query
    const docs = initialSnapshot.docs.sort((a, b) => {
      const aTime = a.data().timestamp?.toDate?.() || a.data().timestamp || new Date(0);
      const bTime = b.data().timestamp?.toDate?.() || b.data().timestamp || new Date(0);
      return bTime - aTime; // Descending order
    });
    
    userWithdrawals.value = docs.map(doc => {
      const data = doc.data();
      console.log('User withdrawal data:', data);
      
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
    
    console.log('User withdrawal history loaded:', userWithdrawals.value);
    
    // Set up real-time listener for updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // Sort manually since we're not using orderBy in the query
      const realTimeDocs = querySnapshot.docs.sort((a, b) => {
        const aTime = a.data().timestamp?.toDate?.() || a.data().timestamp || new Date(0);
        const bTime = b.data().timestamp?.toDate?.() || b.data().timestamp || new Date(0);
        return bTime - aTime; // Descending order
      });
      
      userWithdrawals.value = realTimeDocs.map(doc => {
        const data = doc.data();
        console.log('Real-time user withdrawal data:', data);
        
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
      
      console.log('Real-time user withdrawal history updated:', userWithdrawals.value);
    }, (error) => {
      console.error('Error in user withdrawal history listener:', error);
    });
    
    // Store unsubscribe function for cleanup
    window.userWithdrawalsUnsubscribe = unsubscribe;
    
  } catch (error) {
    console.error('Error loading user withdrawal history:', error);
    // Fallback: try without orderBy
    try {
      console.log('Trying fallback query without orderBy...');
      const withdrawalsRef = collection(db, 'withdrawalHistory');
      const fallbackQuery = query(withdrawalsRef, where('userId', '==', userId));
      const fallbackSnapshot = await getDocs(fallbackQuery);
      
      userWithdrawals.value = fallbackSnapshot.docs
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
      
      console.log('Fallback user withdrawal history loaded:', userWithdrawals.value);
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }
  } finally {
    loadingWithdrawals.value = false;
  }
};

const loadUserBalance = async () => {
  try {
    loadingBalance.value = true;
    console.log('Loading balance for user:', userId);
    
    // Try to load actual balance data from database first
    try {
      const userBalanceRef = doc(db, "userbalance", userId);
      const userBalanceDoc = await getDoc(userBalanceRef);
      
      if (userBalanceDoc.exists()) {
        const balanceData = userBalanceDoc.data();
        console.log('Found user balance data:', balanceData);
        
        userBalance.value = {
          totalIncome: balanceData.balance || 0,
          totalServiceFee: balanceData.serviceFee || 0,
          totalProfit: balanceData.profit || 0,
          totalWithdrawn: balanceData.totalWithdrawn || 0,
          remainingBalance: balanceData.remainingBalance || 0
        };
        
        console.log('Loaded user balance from database:', userBalance.value);
        return;
      }
    } catch (dbError) {
      console.log('No user balance data found, calculating from rentals:', dbError);
    }
    
    // Fallback: Calculate from rentals
    let totalIncome = 0;
    let totalServiceFee = 0;
    let totalProfit = 0;
    
    // Get user's rentals (as seller/owner)
    const userRentals = bookings.value.filter(booking => 
      booking.sellerId === userId || booking.userId === userId
    );
    
    console.log('Found user rentals:', userRentals.length);
    console.log('All bookings:', bookings.value.length);
    console.log('User ID:', userId);
    
    userRentals.forEach(rental => {
      const price = Number(rental.productPrice || rental.totalPrice || 0);
      const fee = Number(rental.deliveryFee || 0);
      const profit = price - fee;
      
      console.log('Rental:', {
        id: rental.id,
        price,
        fee,
        profit,
        sellerId: rental.sellerId,
        userId: rental.userId
      });
      
      totalIncome += price;
      totalServiceFee += fee;
      totalProfit += profit;
    });
    
    // Get withdrawal data
    let totalWithdrawn = 0;
    console.log('User withdrawals found:', userWithdrawals.value.length);
    
    userWithdrawals.value.forEach(withdrawal => {
      const amount = parseFloat(withdrawal.amount) || 0;
      totalWithdrawn += amount;
      console.log('Withdrawal:', {
        id: withdrawal.id,
        amount,
        status: withdrawal.status,
        userId: withdrawal.userId
      });
    });
    
    // Calculate remaining balance
    const remainingBalance = totalProfit - totalWithdrawn;
    
    userBalance.value = {
      totalIncome,
      totalServiceFee,
      totalProfit,
      totalWithdrawn,
      remainingBalance
    };
    
    console.log('User balance calculated from rentals:', userBalance.value);
    
  } catch (error) {
    console.error('Error loading user balance:', error);
  } finally {
    loadingBalance.value = false;
  }
};

// Delete
const deleteRental = async (rentalId) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to cancel this booking?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, cancel it!',
    cancelButtonText: 'No, keep it'
  })

  if (result.isConfirmed) {
    try {
      await deleteDoc(doc(db, 'bookings', rentalId))
      Swal.fire('Cancelled!', 'The booking has been cancelled.', 'success')
    } catch (error) {
      console.error("Error deleting rental:", error)
      Swal.fire({ icon: 'error', title: 'Error cancelling booking', text: error.message })
    }
  }
}

// Update Status
const updateStatus = async (rentalId, newStatus) => {
  try {
    await updateDoc(doc(db, 'bookings', rentalId), { status: newStatus })
    Swal.fire('Updated!', 'Booking status updated.', 'success')
  } catch (error) {
    console.error("Error updating status:", error)
    Swal.fire({ icon: 'error', title: 'Error updating status', text: error.message })
  }
}

const handleExport = () => {
  if (!rentals.value.length) return;
  const headers = [
    'Product', 'Total Price', 'Start Date', 'End Date', 'Payment Method', 'Card Holder', 'Card', 'Expiry', 'Status'
  ];
  const rows = rentals.value.map(rental => [
    rental.productTitle,
    rental.totalPrice,
    formatDate(rental.startDate),
    formatDate(rental.endDate),
    rental.paymentMethod,
    rental.cardHolderName || '-',
    rental.cardNumber ? '**** **** **** ' + rental.cardNumber.slice(-4) : '-',
    rental.expiryDate || '-',
    rental.status
  ]);
  const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `user_rentals_${userName.value}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

onMounted(() => {
  initializeRealTimeData()
  fetchUserName()
  loadUserWithdrawals()
  loadUserBalance()
})

// Watch for changes in bookings and withdrawals to update balance
watch([bookings, userWithdrawals], () => {
  loadUserBalance()
}, { deep: true })

onBeforeUnmount(() => {
  cleanup()
  if (window.userWithdrawalsUnsubscribe) {
    window.userWithdrawalsUnsubscribe()
    console.log('Cleaned up user withdrawal history listener')
  }
})
</script>

<style scoped>
/* Optional custom styling */
</style>
