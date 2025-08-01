<template>
  <div class="max-w-6xl mx-auto py-10 px-4">
    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <p class="text-xl md:text-2xl font-medium text-[var(--Color-Text-Text-Primary)]">
        {{ $t("Your Rentals") }}
      </p>
      <div class="relative w-full md:w-auto">
        <i
          class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[var(--Color-Text-Text-Brand)] w-5 h-5 pointer-events-none"
        ></i>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('searchByTitle')"
          class="w-full md:w-[500px] pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-base text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)] bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)]"
        />
      </div>
    </div>

    <!-- Product Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="border rounded-lg p-4  bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)]"
      >
        <img
          :src="product.productImage"
          alt="Product"
          class="w-full h-48 object-cover rounded-lg mb-3"
        />
        <h2 class="text-lg font-semibold mb-1">{{ product.productTitle }}</h2>
        <p class="text-sm text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)] mb-2">
          Return in:
          <span
            class="font-medium"
            :class="{
              'text-[var(--Colors-Error-400)]': getRemainingTime(product.endDate) === 'Expired',
              'text-[var(--Color-Text-Text-Brand)]': getRemainingTime(product.endDate) !== 'Expired',
            }"
          >
            {{ getRemainingTime(product.endDate) }}
          </span>
        </p>



        <!-- Rental Status Management Section -->
        <div class="mt-4 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]">
          <h4 class="font-semibold text-[var(--Color-Text-Text-Primary)] text-sm mb-3">
            {{ $t("rentalStatusManagement") }}
          </h4>
          
          <!-- Current Status Display -->
          <div class="flex items-center gap-2 mb-3">
            <span class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t("currentStatus") }}:</span>
            <span class="font-medium px-2 py-1 rounded text-xs" :class="getStatusColor(product.status)">
              {{ $t(product.status) }}
            </span>
          </div>
          
          <!-- Status Update Buttons -->
          <div class="flex gap-2 flex-wrap">
            <!-- Renter can confirm Active when receiving item -->
            <button
              v-if="product.status === 'pending'"
              @click="updateRentalStatus(product.id, 'active', 'renter')"
              class="bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
              title="Confirm Active when receiving the item"
            >
              <i class="fas fa-check-double"></i>
              {{ $t("confirmReceived") }}
            </button>
            
            <!-- Renter can confirm completion -->
            <button
              v-if="product.status === 'active'"
              @click="updateRentalStatus(product.id, 'completed', 'renter')"
              class="bg-purple-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
              title="Confirm completion as renter"
            >
              <i class="fas fa-check-circle"></i>
              {{ $t("confirmCompletion") }}
            </button>
            
            <!-- Renter can reject the rental -->
            <button
              v-if="product.status === 'pending'"
              @click="updateRentalStatus(product.id, 'rejected', 'renter')"
              class="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
              title="Reject this rental"
            >
              <i class="fas fa-times"></i>
              {{ $t("rejectRental") }}
            </button>
            
            <!-- Reset to Pending if needed -->
            <button
              v-if="product.status === 'rejected'"
              @click="updateRentalStatus(product.id, 'pending', 'renter')"
              class="bg-yellow-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-yellow-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
              title="Reset to Pending status"
            >
              <i class="fas fa-undo"></i>
              {{ $t("resetToPending") }}
            </button>
          </div>
          
                      <!-- Dual Confirmation Status Display -->
            <div v-if="product.status === 'active' && (product.sellerConfirmed || product.renterConfirmed)" class="mt-3 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]">
              <h5 class="text-xs font-medium text-[var(--Color-Text-Text-Secondary)] mb-2">{{ $t("completionConfirmation") }}:</h5>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-xs">
                  <i class="fas fa-user-tie text-blue-500"></i>
                  <span class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("seller") }}:</span>
                  <span v-if="product.sellerConfirmed" class="text-green-600 font-medium">{{ $t("confirmed") }}</span>
                  <span v-else class="text-gray-500">{{ $t("pending") }}</span>
                </div>
                <div class="flex items-center gap-2 text-xs">
                  <i class="fas fa-user text-blue-500"></i>
                  <span class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("renter") }}:</span>
                  <span v-if="product.renterConfirmed" class="text-green-600 font-medium">{{ $t("confirmed") }}</span>
                  <span v-else class="text-gray-500">{{ $t("pending") }}</span>
                </div>
                <div v-if="product.fullyCompleted" class="flex items-center gap-2 text-xs">
                  <i class="fas fa-check-circle text-green-500"></i>
                  <span class="text-green-600 font-medium">{{ $t("rentalCompleted") }}</span>
                </div>
              </div>
            </div>
            
            <!-- Status History -->
            <div v-if="product.statusHistory && product.statusHistory.length > 0" class="mt-3 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]">
              <h5 class="text-xs font-medium text-[var(--Color-Text-Text-Secondary)] mb-2">{{ $t("statusHistory") }}:</h5>
              <div class="space-y-1">
                <div v-for="(history, index) in product.statusHistory.slice(-3)" :key="index" class="flex items-center gap-2 text-xs">
                  <span class="text-[var(--Color-Text-Text-Secondary)]">{{ formatDate(history.timestamp) }}:</span>
                  <span class="font-medium" :class="getStatusColor(history.status)">{{ $t(history.status) }}</span>
                  <span class="text-[var(--Color-Text-Text-Secondary)]">({{ history.updatedBy }})</span>
                </div>
              </div>
            </div>
        </div>

        <!-- Cancel Button (after 10 hours from startDate and not expired) -->
        <button
          v-if="
            isCancelable(product.startDate) &&
            getRemainingTime(product.endDate) !== 'Expired' &&
            product.status === 'pending'
          "
          @click="
            cancelBooking(
              product.id,
              product.productPrice,
              product.startDate,
              product.endDate
            )
          "
          class="mt-2 px-4 py-2 bg-[var(--Colors-Error-400)] text-white rounded hover:bg-[var(--Colors-Error-500)]"
        >
          Cancel Booking
        </button>

        <!-- Hide Button for Expired -->
        <button
          v-if="getRemainingTime(product.endDate) === 'Expired'"
          @click="hideBooking(product.id)"
          class="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Remove from My Rentals
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { db, auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { updateDoc, doc, getDoc, setDoc } from "firebase/firestore";
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

// Computed property to filter bookings for current user
const userBookings = computed(() => {
  if (!userId.value || !bookings.value) return [];
  return bookings.value
    .filter((booking) => booking.userId === userId.value)
    .filter((booking) => booking.hiddenForUser !== true);
});

// Computed property for filtered products
const filteredProducts = computed(() => {
  if (!searchQuery.value) return userBookings.value;
  const q = searchQuery.value.toLowerCase();
  return userBookings.value.filter((p) => p.productTitle.toLowerCase().includes(q));
});
// Methods
const getRemainingTime = (endDateStr) => {
  const [year, month, day] = endDateStr.split("-").map(Number);
  const returnDate = new Date(year, month - 1, day, 0, 0, 0);
  const now = new Date();
  const diffMs = returnDate - now;
  if (diffMs <= 0) return "Expired";
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  return `${days}d ${hours}h ${minutes}m`;
};

const isCancelable = (startDateStr) => {
  const [year, month, day] = startDateStr.split("-").map(Number);
  const startDate = new Date(year, month - 1, day, 0, 0, 0);
  const now = new Date();
  const diffMs = now - startDate;
  const hoursPassed = diffMs / (1000 * 60 * 60);
  return hoursPassed > 10; // Show button only after 10 hours
};

const cancelBooking = async (id, productPrice, startDateStr, endDateStr) => {
  try {
    await updateDoc(doc(db, "bookings", id), {
      hiddenForUser: true,
    });

    // Calculate number of days rented
    const [startYear, startMonth, startDay] = startDateStr.split("-").map(Number);
    const [endYear, endMonth, endDay] = endDateStr.split("-").map(Number);
    const startDate = new Date(startYear, startMonth - 1, startDay, 0, 0, 0);
    const endDate = new Date(endYear, endMonth - 1, endDay, 0, 0, 0);
    const diffMs = endDate - startDate;
    const daysRented = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // Refund 50% of the per-day price
    const perDayPrice = Number(productPrice) / daysRented;
    const refundAmount = perDayPrice * 0.5;

    const userBalanceRef = doc(db, "userbalance", userId.value);
    const userBalanceSnap = await getDoc(userBalanceRef);

    let currentBalance = 0;
    if (userBalanceSnap.exists()) {
      currentBalance = Number(userBalanceSnap.data().balance) || 0;
    }

    // Subtract the refund amount from the balance (assuming balance is what user owes)
    await setDoc(
      userBalanceRef,
      {
        userid: userId.value,
        balance: currentBalance - refundAmount, // Changed to subtract refund
        lastUpdated: new Date(),
      },
      { merge: true }
    );

    // Note: No need to manually filter bookings as real-time updates will handle this
  } catch (error) {
    console.error("Error canceling booking:", error);
  }
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

// Helper functions for rental status management
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

const hideBooking = async (id) => {
  try {
    await updateDoc(doc(db, "bookings", id), {
      hiddenForUser: true,
    });
    // Note: No need to manually filter bookings as real-time updates will handle this
  } catch (error) {
    console.error("Error hiding booking:", error);
  }
};




// Initialize user on mount
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userId.value = user.uid;
    }
  });
});
</script>
