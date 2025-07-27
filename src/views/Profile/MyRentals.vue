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
        class="border rounded-lg p-4 shadow-md bg-white dark:bg-gray-800"
      >
        <img
          :src="product.productImage"
          alt="Product"
          class="w-full h-48 object-cover rounded-lg mb-3"
        />
        <h2 class="text-lg font-semibold mb-1">{{ product.productTitle }}</h2>
        <p class="text-sm text-gray-500 mb-2">
          Return in:
          <span
            class="font-medium"
            :class="{
              'text-red-600': getRemainingTime(product.endDate) === 'Expired',
              'text-blue-600': getRemainingTime(product.endDate) !== 'Expired',
            }"
          >
            {{ getRemainingTime(product.endDate) }}
          </span>
        </p>

        <!-- Cancel Button (after 10 hours from startDate and not expired) -->
        <button
          v-if="
            isCancelable(product.startDate) &&
            getRemainingTime(product.endDate) !== 'Expired'
          "
          @click="
            cancelBooking(
              product.id,
              product.productPrice,
              product.startDate,
              product.endDate
            )
          "
          class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
import { db, auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { updateDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useGlobalRealTime } from "@/composables/useGlobalRealTime";

// Initialize real-time data
const { bookings } = useGlobalRealTime();

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
  console.log(`startDate: ${startDate}, hoursPassed: ${hoursPassed}`);
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
