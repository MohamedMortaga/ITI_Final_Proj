<template>
  <div class="min-h-screen p-8">
    <!-- Top Bar with Filter Button -->
    <TopBar title="Rental Dashboard" searchPlaceholder="Search Rentals?" @update:search="handleSearch"
      @update:sort="handleSort" @filter="handleFilter" />
    
    <!-- Balance Summary Dashboard -->
    <div class="bg-white rounded-xl shadow border mt-4 mb-6">
      <div class="px-6 py-4 border-b">
        <h2 class="text-xl font-semibold text-gray-800">Platform Balance Overview</h2>
        <p class="text-sm text-gray-600 mt-1">Complete financial summary of all transactions</p>
      </div>
      
      <div class="p-6">
        <div v-if="loadingBalance" class="text-center py-8">
          <svg class="animate-spin w-8 h-8 mx-auto mb-4 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Loading balance information...</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-blue-800">Total Revenue</h3>
            <p class="text-2xl font-bold text-blue-900">EGP {{ platformBalance.totalRevenue.toFixed(2) }}</p>
            <p class="text-xs text-blue-600 mt-1">From all rentals</p>
          </div>
          
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-orange-800">Service Fees</h3>
            <p class="text-2xl font-bold text-orange-900">EGP {{ platformBalance.totalServiceFees.toFixed(2) }}</p>
            <p class="text-xs text-orange-600 mt-1">Platform commission</p>
          </div>
          
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-green-800">User Profits</h3>
            <p class="text-2xl font-bold text-green-900">EGP {{ platformBalance.totalUserProfits.toFixed(2) }}</p>
            <p class="text-xs text-green-600 mt-1">Paid to users</p>
          </div>
          
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-purple-800">Total Withdrawn</h3>
            <p class="text-2xl font-bold text-purple-900">EGP {{ platformBalance.totalWithdrawn.toFixed(2) }}</p>
            <p class="text-xs text-purple-600 mt-1">By all users</p>
          </div>
          
          <div class="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-teal-800">Available Balance</h3>
            <p class="text-2xl font-bold text-teal-900">EGP {{ platformBalance.availableBalance.toFixed(2) }}</p>
            <p class="text-xs text-teal-600 mt-1">Remaining for users</p>
          </div>
          
          <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-indigo-800">Active Rentals</h3>
            <p class="text-2xl font-bold text-indigo-900">{{ platformBalance.activeRentals }}</p>
            <p class="text-xs text-indigo-600 mt-1">Currently active</p>
          </div>
        </div>
        
        <!-- Detailed Balance Breakdown -->
        <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Payment Data Breakdown</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Total Rental Revenue:</span>
                <span class="font-medium">EGP {{ platformBalance.totalRevenue.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Platform Service Fees:</span>
                <span class="font-medium">EGP {{ platformBalance.totalServiceFees.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">User Profits (Before Withdrawals):</span>
                <span class="font-medium">EGP {{ platformBalance.totalUserProfits.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total Withdrawn by Users:</span>
                <span class="font-medium">EGP {{ platformBalance.totalWithdrawn.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between border-t pt-2">
                <span class="font-semibold text-gray-800">Available Balance (After Withdrawals):</span>
                <span class="font-bold text-teal-600">EGP {{ platformBalance.availableBalance.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">User Balance Summary</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Total Users:</span>
                <span class="font-medium">{{ users.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Users with Balances:</span>
                <span class="font-medium">{{ platformBalance.usersWithBalances }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Average User Balance:</span>
                <span class="font-medium">EGP {{ platformBalance.averageUserBalance.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Pending Withdrawals:</span>
                <span class="font-medium">{{ platformBalance.pendingWithdrawals }}</span>
              </div>
              <div class="flex justify-between border-t pt-2">
                <span class="font-semibold text-gray-800">Total Available for Users:</span>
                <span class="font-bold text-green-600">EGP {{ platformBalance.availableBalance.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Rentals Table -->
    <div class="bg-white rounded-xl shadow border">
      <table class="min-w-full divide-y">
        <thead>
          <tr>
            <th class="px-4 py-3">Product</th>
            <th class="px-4 py-3">userImage</th>
            <th class="px-4 py-3">Rented By</th>
            <th class="px-4 py-3">Total Price</th>
            <th class="px-4 py-3">Delivery</th>
            <th class="px-4 py-3">Start Date</th>
            <th class="px-4 py-3">End Date</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3 text-center"><i class="fas fa-ellipsis-v"></i></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rental in paginatedRentals" :key="rental.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 flex items-center gap-2">
              <img :src="rental.productImage || require('@/assets/logo.png')" alt="Product Image"
                class="h-10 w-10 object-cover rounded-full" />
              <!-- <span class="font-medium">{{ rental.productTitle }}</span> -->
              <span class="font-medium">
                {{ rental.productTitle || 'Product #' + rental.productId.slice(0, 6) }}
              </span>


            </td>
            <!-- <td class="px-4 py-3">{{ rental.sellerName }}</td> -->
            <td class="px-4 py-3"> <img :src="rental.userImage || require('@/assets/default.png')"
                class="w-8 h-8 rounded-full object-cover" /></td>
            <td class="px-4 py-3">{{ rental.userName }}</td>
            <td class="px-4 py-3">{{ rental.totalPrice }} EGP</td>
            <td class="px-4 py-3">{{ rental.deliveryMethod }}</td>
            <td class="px-4 py-3">{{ formatDate(rental.startDate) }}</td>
            <td class="px-4 py-3">{{ formatDate(rental.endDate) }}</td>
            <td class="px-4 py-3 relative">
              <span :class="[
                'font-semibold px-2 py-1 rounded text-xs cursor-pointer select-none',
                rental.status === 'active' ? 'bg-green-100 text-green-700' :
                  rental.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    rental.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''
              ]" @click="openStatusDropdown(rental.id)">
                {{ rental.status }}
              </span>
              <div v-if="statusDropdownId === rental.id" class="absolute z-10 mt-2 bg-white border rounded shadow w-32">
                <ul>
                  <li v-for="option in statusOptions" :key="option" @click="changeStatus(rental, option)"
                    class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    {{ option.charAt(0).toUpperCase() + option.slice(1) }}
                  </li>
                </ul>
              </div>
            </td>
            <td class="px-4 py-3 flex items-center space-x-2 justify-center">
              <button @click="deleteRental(rental.id)" class="text-red-500 hover:text-red-700" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- No Rentals Fallback -->
      <div v-if="!paginatedRentals.length" class="text-gray-600 mt-8 text-center">
        <p>No rentals found.</p>
      </div>
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t">
        <button class="text-gray-500 flex items-center" :disabled="currentPage === 1" @click="currentPage--">
          <i class="fas fa-chevron-left mr-1"></i> Previous
        </button>
        <div class="flex items-center space-x-2">
          <button v-for="page in totalPages" :key="page" class="w-8 h-8 rounded"
            :class="{ 'bg-teal-500 text-white': currentPage === page, 'hover:bg-gray-200 text-gray-700': currentPage !== page }"
            @click="currentPage = page">
            {{ page }}
          </button>
        </div>
        <button class="text-gray-500 flex items-center" :disabled="currentPage === totalPages" @click="currentPage++">
          Next <i class="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopBar from '@/components/admin/TopBar.vue';
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { updateDoc, deleteDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Swal from 'sweetalert2';
import { useAdminRealTime } from '@/composables/useAdminRealTime';

// Initialize real-time data
const { bookings, users, initializeRealTimeData, cleanup } = useAdminRealTime();

const searchQuery = ref('');
const sortOption = ref('Newest First');
const filterStatus = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const statusDropdownId = ref(null);
const statusOptions = ['pending', 'active', 'cancelled'];

// Platform balance
const platformBalance = ref({
  totalRevenue: 0,
  totalServiceFees: 0,
  totalUserProfits: 0,
  totalWithdrawn: 0,
  availableBalance: 0,
  activeRentals: 0,
  usersWithBalances: 0,
  averageUserBalance: 0,
  pendingWithdrawals: 0
});
const loadingBalance = ref(false);
const withdrawals = ref([]);

// Computed property to enrich bookings with user data
const rentals = computed(() => {
  const usersMap = {};
  users.value.forEach(user => {
    usersMap[user.id] = user;
  });

  return bookings.value.map(booking => {
    const userInfo = usersMap[booking.userId] || {};
    return {
      ...booking,
      userName: userInfo.displayName || 'Unknown User',
      userImage: userInfo.imageUrl || '',
    };
  });
});
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const filteredRentals = computed(() => {
  let filtered = rentals.value;
  // Search by product title or rented by
  if (searchQuery.value) {
    filtered = filtered.filter(rental =>
      (rental.productTitle || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (rental.sellerName || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  // Filter by status
  if (filterStatus.value) {
    filtered = filtered.filter(rental =>
      (rental.status || '').toLowerCase() === filterStatus.value.toLowerCase()
    );
  }
  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortOption.value === 'Newest First') {
      return new Date(b.startDate) - new Date(a.startDate);
    } else {
      return new Date(a.startDate) - new Date(b.startDate);
    }
  });
  return filtered;
});

const totalPages = computed(() => {
  return Math.ceil(filteredRentals.value.length / itemsPerPage);
});

const paginatedRentals = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredRentals.value.slice(start, start + itemsPerPage);
});

const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1;
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
      active: 'Active',
      cancelled: 'Cancelled',
    },
    inputPlaceholder: 'Select status',
    showCancelButton: true,
    confirmButtonText: 'Apply',
  }).then(result => {
    if (result.isConfirmed) {
      filterStatus.value = result.value || '';
      currentPage.value = 1;
    }
  });
};

const loadWithdrawals = async () => {
  try {
    const withdrawalsRef = collection(db, 'withdrawalHistory');
    const withdrawalsSnapshot = await getDocs(withdrawalsRef);
    withdrawals.value = withdrawalsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error loading withdrawals:', error);
  }
};

const calculatePlatformBalance = async () => {
  try {
    loadingBalance.value = true;
    
    // Calculate from rentals
    let totalRevenue = 0;
    let totalServiceFees = 0;
    let totalUserProfits = 0;
    let activeRentals = 0;
    
    bookings.value.forEach(rental => {
      const price = Number(rental.productPrice || rental.totalPrice || 0);
      const fee = Number(rental.deliveryFee || 0);
      const profit = price - fee;
      
      totalRevenue += price;
      totalServiceFees += fee;
      totalUserProfits += profit;
      
      if (rental.status === 'active') {
        activeRentals++;
      }
    });
    
    // Calculate from withdrawals
    let totalWithdrawn = 0;
    let pendingWithdrawals = 0;
    
    withdrawals.value.forEach(withdrawal => {
      totalWithdrawn += parseFloat(withdrawal.amount) || 0;
      if (withdrawal.status === 'pending') {
        pendingWithdrawals++;
      }
    });
    
    // Calculate available balance
    const availableBalance = totalUserProfits - totalWithdrawn;
    
    // Calculate user statistics
    const usersWithBalances = users.value.filter(user => {
      const userRentals = bookings.value.filter(booking => booking.userId === user.id);
      const userProfit = userRentals.reduce((sum, rental) => {
        const price = Number(rental.productPrice || rental.totalPrice || 0);
        const fee = Number(rental.deliveryFee || 0);
        return sum + (price - fee);
      }, 0);
      return userProfit > 0;
    }).length;
    
    const averageUserBalance = usersWithBalances > 0 ? availableBalance / usersWithBalances : 0;
    
    platformBalance.value = {
      totalRevenue,
      totalServiceFees,
      totalUserProfits,
      totalWithdrawn,
      availableBalance,
      activeRentals,
      usersWithBalances,
      averageUserBalance,
      pendingWithdrawals
    };
    
    console.log('Platform balance calculated:', platformBalance.value);
    
  } catch (error) {
    console.error('Error calculating platform balance:', error);
  } finally {
    loadingBalance.value = false;
  }
};

function setStatusFilter(status) {
  filterStatus.value = status;
  currentPage.value = 1;
}
function clearStatusFilter() {
  filterStatus.value = '';
  currentPage.value = 1;
}

function openStatusDropdown(id) {
  statusDropdownId.value = statusDropdownId.value === id ? null : id;
}

async function changeStatus(rental, newStatus) {
  if (rental.status === newStatus) {
    statusDropdownId.value = null;
    return;
  }
  try {
    await updateDoc(doc(db, 'bookings', rental.id), { status: newStatus });
    statusDropdownId.value = null;
    Swal.fire('Updated', 'Booking status updated successfully.', 'success');
  } catch (error) {
    console.error('Error updating status:', error);
    Swal.fire('Error', 'Failed to update status.', 'error');
  }
}

// Delete rental
const deleteRental = async (rentalId) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This booking will be deleted permanently.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    try {
      await deleteDoc(doc(db, 'bookings', rentalId));
      Swal.fire('Deleted', 'Booking deleted successfully.', 'success');
    } catch (error) {
      console.error('Error deleting rental:', error);
      Swal.fire('Error', 'Failed to delete booking.', 'error');
    }
  }
};

// Close dropdown on click outside
function handleClickOutside(event) {
  const dropdown = document.querySelector('.relative.ml-2');
  if (dropdown && !dropdown.contains(event.target)) {
    showFilterDropdown.value = false;
  }
}

onMounted(() => {
  initializeRealTimeData();
  loadWithdrawals();
  calculatePlatformBalance();
  document.addEventListener('mousedown', handleClickOutside);
});

// Watch for changes in bookings, users, and withdrawals to update balance
watch([bookings, users, withdrawals], () => {
  calculatePlatformBalance();
}, { deep: true });

onBeforeUnmount(() => {
  cleanup();
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
/* You can enhance styles here if needed */
</style>
