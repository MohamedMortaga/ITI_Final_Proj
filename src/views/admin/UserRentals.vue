<template>
  <div class="min-h-screen p-8">
    <!-- Top Bar -->
    <TopBar
      title="User Rentals"
      searchPlaceholder="Search rentals..."
      @update:search="handleSearch"
      @update:sort="handleSort"
    />

    <!-- Rentals Table -->
    <div class="bg-white rounded-xl shadow border mt-4">
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import TopBar from '@/components/admin/TopBar.vue'
import { useRoute } from 'vue-router'
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'
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
    } else {
      userName.value = 'User'
    }
  } catch (error) {
    console.error("Error fetching user name:", error)
    userName.value = 'User'
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

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
})
</script>

<style scoped>
/* Optional custom styling */
</style>
