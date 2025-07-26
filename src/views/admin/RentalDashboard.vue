<template>
  <div class="min-h-screen p-8">
    <!-- Top Bar with Filter Button -->
    <TopBar title="Rental Dashboard" searchPlaceholder="Search Rentals?" @update:search="handleSearch"
      @update:sort="handleSort" @filter="handleFilter" />
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { updateDoc, deleteDoc, doc } from 'firebase/firestore';
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
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  cleanup();
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
/* You can enhance styles here if needed */
</style>
