<template>
  <div class="max-w-6xl mx-auto py-6 md:py-10 px-3 md:px-4">
    <!-- Search Bar and Title -->
    <div class="mb-4 md:mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-4">
      <p
        class="text-lg md:text-xl lg:text-2xl text-[var(--Color-Text-Text-Primary)] font-medium mb-2 md:mb-0"
      >
        {{ $t("My Rented Products") }}
      </p>
      <div class="relative w-full md:w-auto">
        <i
          class="fa-solid fa-magnifying-glass absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[var(--Color-Text-Text-Brand)] w-4 md:w-5 h-4 md:h-5 pointer-events-none"
        ></i>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('searchByTitle')"
          class="w-full md:w-[500px] pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-sm md:text-base text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)] bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)]"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <svg class="animate-spin w-8 h-8 mx-auto mb-4 text-blue-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Loading your rented products...</p>
    </div>

    <!-- No Products Message -->
    <div v-else-if="filteredRentals.length === 0" class="text-center py-8">
      <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <p class="text-gray-600">{{ $t("noRentedProducts") }}</p>
    </div>

    <!-- Products List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div
        v-for="rental in filteredRentals"
        :key="rental.id"
        class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
      >
        <!-- Product Image -->
        <div class="relative h-48 bg-gray-100">
          <img
            :src="rental.productImage || '/src/assets/default.png'"
            :alt="rental.productTitle"
            class="w-full h-full object-cover"
            @error="$event.target.src = '/src/assets/default.png'"
          />
          <div class="absolute top-2 right-2">
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-semibold',
                getStatusBadgeClass(rental.status)
              ]"
            >
              {{ $t(rental.status) }}
            </span>
          </div>
        </div>

        <!-- Product Info -->
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ rental.productTitle }}</h3>
          <p class="text-sm text-gray-600 mb-3">{{ rental.productDetails }}</p>
          
          <!-- Rental Details -->
          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">{{ $t("renter") }}:</span>
              <span class="font-medium">{{ rental.userName || 'Unknown' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">{{ $t("startDate") }}:</span>
              <span class="font-medium">{{ formatDate(rental.startDate) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">{{ $t("endDate") }}:</span>
              <span class="font-medium">{{ formatDate(rental.endDate) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">{{ $t("totalPrice") }}:</span>
              <span class="font-medium text-green-600">EGP {{ rental.productPrice }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2">
            <!-- Owner can return product to available -->
            <button
              v-if="rental.status === 'active'"
              @click="returnProductToAvailable(rental.id, rental.productId)"
              class="w-full bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-1"
              title="Return product to available for rent"
            >
              <i class="fas fa-undo"></i>
              {{ $t("returnToAvailable") }}
            </button>
          </div>
          
          <!-- Status History -->
          <div v-if="rental.statusHistory && rental.statusHistory.length > 0" class="mt-3 pt-3 border-t border-gray-200">
            <h5 class="text-xs font-medium text-gray-600 mb-2">{{ $t("statusHistory") }}:</h5>
            <div class="space-y-1">
              <div v-for="(history, index) in rental.statusHistory.slice(-3)" :key="index" class="flex items-center gap-2 text-xs">
                <span class="text-gray-500">{{ formatDate(history.timestamp) }}:</span>
                <span class="font-medium" :class="getStatusColor(history.status)">{{ $t(history.status) }}</span>
                <span class="text-gray-500">({{ history.updatedBy }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { db, auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { useGlobalRealTime } from "@/composables/useGlobalRealTime";
import { useRentalStatus } from "@/composables/useRentalStatus";
import Swal from "sweetalert2";

const { t } = useI18n();

// Initialize real-time data
const { bookings } = useGlobalRealTime();

// Initialize rental status composable
const { updateRentalStatusWithUI } = useRentalStatus();

const searchQuery = ref("");
const userId = ref(null);
const loading = ref(true);

// Computed property to filter bookings for products owned by current user
const ownerRentals = computed(() => {
  if (!userId.value || !bookings.value) return [];
  return bookings.value.filter((booking) => booking.sellerId === userId.value);
});

// Computed property for filtered rentals
const filteredRentals = computed(() => {
  if (!searchQuery.value) return ownerRentals.value;
  const q = searchQuery.value.toLowerCase();
  return ownerRentals.value.filter((r) => r.productTitle.toLowerCase().includes(q));
});

// Helper functions
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'text-yellow-600';
    case 'active':
      return 'text-green-600';
    case 'completed':
      return 'text-blue-600';
    case 'cancelled':
      return 'text-red-600';
    case 'rejected':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};



const updateRentalStatus = async (bookingId, newStatus, updatedBy) => {
  return await updateRentalStatusWithUI(bookingId, newStatus, updatedBy, t);
};

// Function to return product to available for rent
const returnProductToAvailable = async (bookingId, productId) => {
  try {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Return Product to Available?',
      text: 'Are you sure you want to return this product to available for rent? This will mark the rental as completed.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Return to Available',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true
    });

    if (!result.isConfirmed) {
      return;
    }

    // Show loading state
    Swal.fire({
      title: 'Processing...',
      text: 'Returning product to available status',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Update booking status to completed
    await updateDoc(doc(db, "bookings", bookingId), {
      status: "completed",
      lastUpdated: new Date()
    });

    // Update product status to free (available for rent)
    if (productId) {
      await updateDoc(doc(db, "products", productId), {
        status: "free"
      });
    }

    // Close loading dialog
    Swal.close();
    
    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Product Returned Successfully',
      text: 'The product is now available for rent again.',
      timer: 2000,
      showConfirmButton: false,
      position: 'top-end'
    });

  } catch (error) {
    console.error('Error returning product to available:', error);
    Swal.close(); // Close loading dialog
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to return product to available. Please try again.',
      confirmButtonText: 'OK'
    });
  }
};

// Initialize user on mount
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userId.value = user.uid;
      loading.value = false;
    }
  });
});
</script> 