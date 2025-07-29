<template>
  <div class="min-h-screen p-8">
    <!-- Top Bar -->
    <TopBar
      title="Withdrawal Management"
      searchPlaceholder="Search withdrawals..."
      @update:search="handleSearch"
      @update:sort="handleSort"
      @filter="handleFilter"
    />

    <!-- Withdrawals Table -->
    <div class="bg-white rounded-xl shadow border mt-4">
      <table class="min-w-full divide-y">
        <thead>
          <tr>
            <th class="px-4 py-3">User</th>
            <th class="px-4 py-3">Amount</th>
            <th class="px-4 py-3">Withdrawal Fee</th>
            <th class="px-4 py-3">Payment Method</th>
            <th class="px-4 py-3">Payment Details</th>
            <th class="px-4 py-3">Date</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="withdrawal in filteredWithdrawals" :key="withdrawal.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <div class="flex items-center space-x-3">
                <img 
                  :src="getUserImage(withdrawal.userId)" 
                  alt="User" 
                  class="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div class="font-medium">{{ getUserName(withdrawal.userId) }}</div>
                  <div class="text-sm text-gray-500">{{ getUserEmail(withdrawal.userId) }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 font-bold text-green-600">EGP {{ withdrawal.amount.toFixed(2) }}</td>
            <td class="px-4 py-3 text-gray-600">EGP {{ (withdrawal.withdrawalFee || 0).toFixed(2) }}</td>
            <td class="px-4 py-3">{{ formatPaymentMethod(withdrawal.paymentMethod) }}</td>
            <td class="px-4 py-3 text-sm">{{ maskPaymentDetails(withdrawal.paymentDetails, withdrawal.paymentMethod) }}</td>
            <td class="px-4 py-3 text-sm">{{ formatDate(withdrawal.timestamp) }}</td>
            <td class="px-4 py-3">
              <span :class="[
                'px-2 py-1 rounded-full text-xs font-bold',
                withdrawal.status === 'completed' ? 'bg-green-100 text-green-700' :
                withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                withdrawal.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              ]">
                {{ withdrawal.status }}
              </span>
            </td>
            <td class="px-4 py-3 flex items-center space-x-2 justify-center">
              <select
                v-model="withdrawal.status"
                @change="updateStatus(withdrawal.id, withdrawal.status)"
                class="px-2 py-1 text-sm border rounded"
                :disabled="withdrawal.status === 'completed'"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                @click="viewDetails(withdrawal)"
                class="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                title="View Details"
              >
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- No Withdrawals Fallback -->
      <div v-if="!filteredWithdrawals.length && !loading" class="text-gray-600 mt-8 text-center">
        <p>No withdrawal requests found.</p>
      </div>
    </div>

    <!-- Withdrawal Details Modal -->
    <div
      v-if="selectedWithdrawal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Withdrawal Details</h2>
          <button
            @click="selectedWithdrawal = null"
            class="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div class="space-y-4">
          <!-- User Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-800 mb-2">User Information</h3>
            <div class="flex items-center space-x-3">
              <img 
                :src="getUserImage(selectedWithdrawal.userId)" 
                alt="User" 
                class="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div class="font-medium">{{ getUserName(selectedWithdrawal.userId) }}</div>
                <div class="text-sm text-gray-500">{{ getUserEmail(selectedWithdrawal.userId) }}</div>
                <div class="text-sm text-gray-500">{{ getUserPhone(selectedWithdrawal.userId) }}</div>
              </div>
            </div>
          </div>

          <!-- Withdrawal Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-800 mb-2">Withdrawal Information</h3>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-600">Amount</label>
                <div class="text-lg font-bold text-green-600">EGP {{ selectedWithdrawal.amount.toFixed(2) }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">Withdrawal Fee (15%)</label>
                <div class="text-lg font-medium text-gray-700">EGP {{ (selectedWithdrawal.withdrawalFee || 0).toFixed(2) }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">Status</label>
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-bold',
                  selectedWithdrawal.status === 'completed' ? 'bg-green-100 text-green-700' :
                  selectedWithdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  selectedWithdrawal.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                ]">
                  {{ selectedWithdrawal.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-800 mb-2">Payment Information</h3>
            <div class="space-y-2">
              <div>
                <label class="block text-sm font-medium text-gray-600">Payment Method</label>
                <div class="font-medium">{{ formatPaymentMethod(selectedWithdrawal.paymentMethod) }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">Payment Details</label>
                <div class="text-sm">{{ maskPaymentDetails(selectedWithdrawal.paymentDetails, selectedWithdrawal.paymentMethod) }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">Request Date</label>
                <div class="text-sm">{{ formatDate(selectedWithdrawal.timestamp) }}</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button
              @click="selectedWithdrawal = null"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            <button
              v-if="selectedWithdrawal.status === 'pending'"
              @click="approveWithdrawal(selectedWithdrawal.id)"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Approve
            </button>
            <button
              v-if="selectedWithdrawal.status === 'pending'"
              @click="rejectWithdrawal(selectedWithdrawal.id)"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import TopBar from '@/components/admin/TopBar.vue'
import { doc, getDoc, updateDoc, setDoc, collection, getDocs, query, orderBy, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/config'
import Swal from 'sweetalert2'
import { useAdminRealTime } from '@/composables/useAdminRealTime'

// Initialize real-time data
const { users, initializeRealTimeData, cleanup } = useAdminRealTime()

const withdrawals = ref([])
const selectedWithdrawal = ref(null)
const searchQuery = ref('')
const sortOption = ref('Newest First')
const loading = ref(true)

// Computed properties
const filteredWithdrawals = computed(() => {
  let filtered = withdrawals.value;
  
  // Search functionality
  if (searchQuery.value) {
    filtered = filtered.filter(withdrawal => {
      const userName = getUserName(withdrawal.userId).toLowerCase();
      const userEmail = getUserEmail(withdrawal.userId).toLowerCase();
      const paymentMethod = withdrawal.paymentMethod.toLowerCase();
      const searchTerm = searchQuery.value.toLowerCase();
      
      return userName.includes(searchTerm) || 
             userEmail.includes(searchTerm) || 
             paymentMethod.includes(searchTerm);
    });
  }
  
  // Sort functionality
  filtered = [...filtered].sort((a, b) => {
    if (sortOption.value === 'Newest First') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    } else if (sortOption.value === 'Oldest First') {
      return new Date(a.timestamp) - new Date(b.timestamp);
    } else if (sortOption.value === 'Amount High to Low') {
      return b.amount - a.amount;
    } else if (sortOption.value === 'Amount Low to High') {
      return a.amount - b.amount;
    }
    return 0;
  });
  
  return filtered;
});

// User data helpers
const getUserName = (userId) => {
  const withdrawal = withdrawals.value.find(w => w.userId === userId);
  return withdrawal?.userDisplayName || 'Unknown User';
};

const getUserEmail = (userId) => {
  const withdrawal = withdrawals.value.find(w => w.userId === userId);
  return withdrawal?.userEmail || 'No email';
};

const getUserPhone = (userId) => {
  const withdrawal = withdrawals.value.find(w => w.userId === userId);
  return withdrawal?.userPhone || 'No phone';
};

const getUserImage = (userId) => {
  const user = users.value.find(u => u.id === userId);
  return user?.imageUrl || '/src/assets/default.png';
};

// Format functions
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

// Event handlers
const handleSearch = (query) => {
  searchQuery.value = query;
};

const handleSort = (option) => {
  sortOption.value = option;
};

const handleFilter = () => {
  Swal.fire({
    title: 'Filter by Status',
    input: 'select',
    inputOptions: {
      pending: 'Pending',
      completed: 'Completed',
      rejected: 'Rejected',
    },
    inputPlaceholder: 'Select status',
    showCancelButton: true,
    confirmButtonText: 'Apply',
  }).then(result => {
    if (result.isConfirmed) {
      // Implement status filtering if needed
      console.log('Filter by status:', result.value);
    }
  });
};

const viewDetails = (withdrawal) => {
  selectedWithdrawal.value = withdrawal;
};

const updateStatus = async (withdrawalId, newStatus) => {
  try {
    console.log('Updating withdrawal status:', { withdrawalId, newStatus });
    
    const updateData = { 
      status: newStatus,
      processedAt: serverTimestamp()
    };
    
    // Add admin note for completed/rejected withdrawals
    if (newStatus === 'completed') {
      updateData.adminNote = 'Withdrawal approved and processed';
    } else if (newStatus === 'rejected') {
      updateData.adminNote = 'Withdrawal rejected';
    }
    
    console.log('Update data:', updateData);
    
    const withdrawalRef = doc(db, 'withdrawalHistory', withdrawalId);
    console.log('Updating document:', withdrawalRef.path);
    
    await updateDoc(withdrawalRef, updateData);
    console.log('Document updated successfully');
    
    // Update local state
    const withdrawal = withdrawals.value.find(w => w.id === withdrawalId);
    if (withdrawal) {
      withdrawal.status = newStatus;
      withdrawal.processedAt = new Date();
      console.log('Local state updated');
    }
    
    // If withdrawal is completed, update user's balance (deduct from remaining balance)
    if (newStatus === 'completed' && withdrawal) {
      try {
        console.log('Processing completed withdrawal - deducting from balance');
        
        // Get current user balance
        const userBalanceRef = doc(db, "userbalance", withdrawal.userId);
        const userBalanceDoc = await getDoc(userBalanceRef);
        
        if (userBalanceDoc.exists()) {
          const currentBalance = userBalanceDoc.data();
          const newTotalWithdrawn = (currentBalance.totalWithdrawn || 0) + withdrawal.amount;
          const calculatedRemainingBalance = currentBalance.profit - newTotalWithdrawn;
          const newRemainingBalance = calculatedRemainingBalance * (1 - 0.15); // Apply 15% withdrawal fee
          
          console.log('Balance update for completed withdrawal:', {
            currentTotalWithdrawn: currentBalance.totalWithdrawn,
            newTotalWithdrawn,
            currentRemainingBalance: currentBalance.remainingBalance,
            newRemainingBalance,
            withdrawalAmount: withdrawal.amount
          });
          
          // Update user balance
          await setDoc(
            userBalanceRef,
            {
              ...currentBalance,
              totalWithdrawn: newTotalWithdrawn,
              remainingBalance: newRemainingBalance,
            },
            { merge: true }
          );
          
          // Update profit record
          const profitRef = doc(db, "ourprofite", withdrawal.userId);
          await setDoc(
            profitRef,
            {
              balance: currentBalance.serviceFee,
              sellersProfit: currentBalance.profit,
              totalWithdrawn: newTotalWithdrawn,
              remainingBalance: newRemainingBalance,
            },
            { merge: true }
          );
          
          console.log('User balance updated for completed withdrawal');
        }
      } catch (balanceError) {
        console.error('Error updating user balance for completed withdrawal:', balanceError);
      }
    }
    
    // If withdrawal is rejected, return money to user's balance
    if (newStatus === 'rejected' && withdrawal) {
      try {
        console.log('Processing rejected withdrawal - returning money to balance');
        
        // Get current user balance
        const userBalanceRef = doc(db, "userbalance", withdrawal.userId);
        const userBalanceDoc = await getDoc(userBalanceRef);
        
        if (userBalanceDoc.exists()) {
          const currentBalance = userBalanceDoc.data();
          const newTotalWithdrawn = Math.max(0, (currentBalance.totalWithdrawn || 0) - withdrawal.amount);
          const calculatedRemainingBalance = currentBalance.profit - newTotalWithdrawn;
          const newRemainingBalance = calculatedRemainingBalance * (1 - 0.15); // Apply 15% withdrawal fee
          
          console.log('Balance update for rejected withdrawal:', {
            currentTotalWithdrawn: currentBalance.totalWithdrawn,
            newTotalWithdrawn,
            currentRemainingBalance: currentBalance.remainingBalance,
            newRemainingBalance,
            withdrawalAmount: withdrawal.amount
          });
          
          // Update user balance (return money)
          await setDoc(
            userBalanceRef,
            {
              ...currentBalance,
              totalWithdrawn: newTotalWithdrawn,
              remainingBalance: newRemainingBalance,
            },
            { merge: true }
          );
          
          // Update profit record
          const profitRef = doc(db, "ourprofite", withdrawal.userId);
          await setDoc(
            profitRef,
            {
              balance: currentBalance.serviceFee,
              sellersProfit: currentBalance.profit,
              totalWithdrawn: newTotalWithdrawn,
              remainingBalance: newRemainingBalance,
            },
            { merge: true }
          );
          
          console.log('User balance updated for rejected withdrawal - money returned');
        }
      } catch (balanceError) {
        console.error('Error updating user balance for rejected withdrawal:', balanceError);
      }
    }
    
    const statusMessage = newStatus === 'completed' ? 'Withdrawal approved and processed successfully.' : 
                        newStatus === 'rejected' ? 'Withdrawal rejected.' : 
                        'Withdrawal status updated successfully.';
    
    Swal.fire('Updated!', statusMessage, 'success');
  } catch (error) {
    console.error('Error updating withdrawal status:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      withdrawalId,
      newStatus
    });
    
    let errorMessage = 'Failed to update withdrawal status.';
    if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied. You may not have admin access.';
    } else if (error.code === 'not-found') {
      errorMessage = 'Withdrawal not found. It may have been deleted.';
    } else if (error.code === 'unavailable') {
      errorMessage = 'Service temporarily unavailable. Please try again.';
    }
    
    Swal.fire('Error!', errorMessage, 'error');
  }
};

const approveWithdrawal = async (withdrawalId) => {
  const result = await Swal.fire({
    title: 'Approve Withdrawal',
    text: 'Are you sure you want to approve this withdrawal request?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, approve it!',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    await updateStatus(withdrawalId, 'completed');
    selectedWithdrawal.value = null;
  }
};

const rejectWithdrawal = async (withdrawalId) => {
  const result = await Swal.fire({
    title: 'Reject Withdrawal',
    text: 'Are you sure you want to reject this withdrawal request?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, reject it!',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    await updateStatus(withdrawalId, 'rejected');
    selectedWithdrawal.value = null;
  }
};

// Load withdrawals
const loadWithdrawals = async () => {
  try {
    loading.value = true;
    const withdrawalsRef = collection(db, 'withdrawalHistory');
    const q = query(withdrawalsRef, orderBy('timestamp', 'desc'));
    
    // First, load initial data
    const querySnapshot = await getDocs(q);
    
    withdrawals.value = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Raw admin withdrawal data:', data);
      
      return {
        id: doc.id,
        userId: data.userId || '',
        amount: parseFloat(data.amount) || 0,
        totalAmount: parseFloat(data.totalAmount) || parseFloat(data.amount) || 0,
        withdrawalFee: parseFloat(data.withdrawalFee) || 0,
        paymentMethod: data.paymentMethod || '',
        paymentDetails: data.paymentDetails || '',
        status: data.status || 'pending',
        timestamp: data.timestamp || data.submittedAt || new Date(),
        submittedAt: data.submittedAt || data.timestamp || new Date(),
        userDisplayName: data.userDisplayName || '',
        userEmail: data.userEmail || '',
        userPhone: data.userPhone || '',
        processedAt: data.processedAt || null,
        adminNote: data.adminNote || ''
      };
    });
    
    console.log('Loaded all withdrawals:', withdrawals.value);
    
    // Set up real-time listener for updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      withdrawals.value = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Real-time withdrawal update:', data);
        
        return {
          id: doc.id,
          userId: data.userId || '',
          amount: parseFloat(data.amount) || 0,
          totalAmount: parseFloat(data.totalAmount) || parseFloat(data.amount) || 0,
          withdrawalFee: parseFloat(data.withdrawalFee) || 0,
          paymentMethod: data.paymentMethod || '',
          paymentDetails: data.paymentDetails || '',
          status: data.status || 'pending',
          timestamp: data.timestamp || data.submittedAt || new Date(),
          submittedAt: data.submittedAt || data.timestamp || new Date(),
          userDisplayName: data.userDisplayName || '',
          userEmail: data.userEmail || '',
          userPhone: data.userPhone || '',
          processedAt: data.processedAt || null,
          adminNote: data.adminNote || ''
        };
      });
      
      console.log('Real-time withdrawals updated:', withdrawals.value);
    }, (error) => {
      console.error('Error in withdrawal listener:', error);
    });
    
    // Store unsubscribe function for cleanup
    window.withdrawalsUnsubscribe = unsubscribe;
    
  } catch (error) {
    console.error('Error loading withdrawals:', error);
    Swal.fire('Error!', 'Failed to load withdrawal requests.', 'error');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  initializeRealTimeData();
  loadWithdrawals();
});

onBeforeUnmount(() => {
  cleanup();
  if (window.withdrawalsUnsubscribe) {
    window.withdrawalsUnsubscribe();
    console.log('Cleaned up withdrawal listener');
  }
});
</script>

<style scoped>
/* Optional custom styling */
</style> 