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
        class="border rounded-lg p-4 bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)]"
      >
        <img
          :src="product.productImage"
          alt="Product"
          class="w-full h-48 object-cover rounded-lg mb-3"
        />
        <h2 class="text-lg font-semibold mb-1">{{ product.productTitle }}</h2>
        <p
          class="text-sm text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)] mb-2"
        >
          Return in:
          <span
            class="font-medium"
            :class="{
              'text-[var(--Colors-Error-400)]':
                getRemainingTime(product.endDate) === 'Expired',
              'text-[var(--Color-Text-Text-Brand)]':
                getRemainingTime(product.endDate) !== 'Expired',
            }"
          >
            {{ getRemainingTime(product.endDate) }}
          </span>
        </p>

        <!-- Penalty Warning Section -->
        <div
          v-if="getRemainingTime(product.endDate) === 'Expired'"
          class="mb-3 p-3 bg-red-50 rounded-lg border border-red-100"
        >
          <div class="flex items-center text-red-600 mb-1">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <span class="font-medium">Rental Expired</span>
          </div>

          <div class="text-xs space-y-1">
            <div v-if="product.hoursExpired <= 48" class="text-yellow-700">
              <i class="fas fa-clock mr-1"></i>
              {{ product.hoursExpired }} hour(s) overdue -
              <strong>EGP {{ calculatePenalty(getProductPrice(product), 30) }}</strong>
              (30%) penalty will apply in {{ 48 - product.hoursExpired }} hour(s)
              <div class="text-xs mt-1">
                <span class="font-medium">Actual Price:</span> EGP
                {{ formatPrice(getProductPrice(product)) }}
              </div>
              <div v-if="product.penaltyPending" class="text-xs text-gray-500 mt-1">
                <i class="fas fa-spinner fa-spin mr-1"></i>
                Processing penalty...
              </div>
            </div>
            <div v-else-if="product.hoursExpired <= 96" class="text-orange-600">
              <i class="fas fa-exclamation-circle mr-1"></i>
              30% penalty (<strong
                >EGP {{ calculatePenalty(getProductPrice(product), 30) }}</strong
              >) applied - Additional
              <strong>EGP {{ calculatePenalty(getProductPrice(product), 20) }}</strong>
              (20%) in {{ 96 - product.hoursExpired }} hour(s)
              <div class="text-xs mt-1">
                <span class="font-medium">Total potential penalty:</span> EGP
                {{ calculatePenalty(getProductPrice(product), 50) }} (50%)
              </div>
            </div>
            <div v-else class="text-red-700 font-semibold">
              <i class="fas fa-gavel mr-1"></i>
              Total 50% penalty (<strong
                >EGP {{ calculatePenalty(getProductPrice(product), 50) }}</strong
              >) applied - Legal action may be taken
            </div>
          </div>
        </div>

        <!-- Rental Status Management Section -->
        <div class="mt-4 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]">
          <h4 class="font-semibold text-[var(--Color-Text-Text-Primary)] text-sm mb-3">
            {{ $t("rentalStatusManagement") }}
          </h4>

          <!-- Current Status Display -->
          <div class="flex items-center gap-2 mb-3">
            <span class="text-sm text-[var(--Color-Text-Text-Secondary)]"
              >{{ $t("currentStatus") }}:</span
            >
            <span
              class="font-medium px-2 py-1 rounded text-xs"
              :class="getStatusColor(product.status)"
            >
              {{ $t(product.status) }}
            </span>
          </div>

          <!-- Status Update Buttons -->
          <div class="flex gap-2 flex-wrap">
            <button
              v-if="product.status === 'pending'"
              @click="updateRentalStatus(product.id, 'active', 'renter')"
              class="bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
            >
              <i class="fas fa-check-double"></i>
              {{ $t("confirmReceived") }}
            </button>

            <button
              v-if="product.status === 'active'"
              @click="updateRentalStatus(product.id, 'completed', 'renter')"
              class="bg-purple-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
            >
              <i class="fas fa-check-circle"></i>
              {{ $t("confirmCompletion") }}
            </button>

            <button
              v-if="product.status === 'pending'"
              @click="updateRentalStatus(product.id, 'rejected', 'renter')"
              class="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
            >
              <i class="fas fa-times"></i>
              {{ $t("rejectRental") }}
            </button>

            <button
              v-if="product.status === 'rejected'"
              @click="updateRentalStatus(product.id, 'pending', 'renter')"
              class="bg-yellow-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-yellow-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
            >
              <i class="fas fa-undo"></i>
              {{ $t("resetToPending") }}
            </button>
          </div>

          <!-- Dual Confirmation Status Display -->
          <div
            v-if="product.status === 'active'"
            class="mt-3 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]"
          >
            <h5 class="text-xs font-medium text-[var(--Color-Text-Text-Secondary)] mb-2">
              {{ $t("completionConfirmation") }}:
            </h5>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-xs">
                <i class="fas fa-user-tie text-blue-500"></i>
                <span class="text-[var(--Color-Text-Text-Secondary)]"
                  >{{ $t("seller") }}:</span
                >
                <span v-if="product.sellerConfirmed" class="text-green-600 font-medium">{{
                  $t("confirmed")
                }}</span>
                <span v-else class="text-gray-500">{{ $t("pending") }}</span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <i class="fas fa-user text-blue-500"></i>
                <span class="text-[var(--Color-Text-Text-Secondary)]"
                  >{{ $t("renter") }}:</span
                >
                <span v-if="product.renterConfirmed" class="text-green-600 font-medium">{{
                  $t("confirmed")
                }}</span>
                <span v-else class="text-gray-500">{{ $t("pending") }}</span>
              </div>
            </div>
          </div>

          <!-- Status History -->
          <div
            v-if="product.statusHistory && product.statusHistory.length > 0"
            class="mt-3 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]"
          >
            <h5 class="text-xs font-medium text-[var(--Color-Text-Text-Secondary)] mb-2">
              {{ $t("statusHistory") }}:
            </h5>
            <div class="space-y-1">
              <div
                v-for="(history, index) in product.statusHistory
                  .slice()
                  .reverse()
                  .slice(0, 3)"
                :key="index"
                class="flex items-baseline gap-2 text-xs"
              >
                <span class="text-[var(--Color-Text-Text-Secondary)]">{{
                  formatDate(history.timestamp)
                }}</span>
                <span class="font-medium" :class="getStatusColor(history.status)">{{
                  $t(history.status)
                }}</span>
                <span class="text-[var(--Color-Text-Text-Secondary)] text-xxs"
                  >({{ history.updatedBy }})</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Cancel Button -->
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { db, auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import {
  updateDoc,
  doc,
  getDoc,
  setDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { useGlobalRealTime } from "@/composables/useGlobalRealTime";
import { useRentalStatus } from "@/composables/useRentalStatus";
import Swal from "sweetalert2";

const { t } = useI18n();
const { bookings } = useGlobalRealTime();
const { updateRentalStatusWithUI } = useRentalStatus();

const searchQuery = ref("");
const userId = ref(null);
const penaltyCheckInterval = ref(null);
const pendingPenalties = ref({});
const productPrices = ref({});

// Fetch product prices when bookings change
watch(
  bookings,
  async (newBookings) => {
    if (!newBookings || !userId.value) return;

    const userBookings = newBookings.filter(
      (booking) => booking.userId === userId.value && booking.hiddenForUser !== true
    );

    for (const booking of userBookings) {
      if (!booking.productId || productPrices.value[booking.productId]) continue;

      try {
        const productRef = doc(db, "products", booking.productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          productPrices.value[booking.productId] = Number(productSnap.data().actualPrice);
        }
      } catch (error) {
        console.error("Error fetching product price:", error);
      }
    }
  },
  { immediate: true }
);

// Helper to get correct price
const getProductPrice = (product) => {
  return product.productId
    ? productPrices.value[product.productId] ||
        product.actualPrice ||
        product.productPrice ||
        0
    : product.actualPrice || product.productPrice || 0;
};

// Computed properties
const userBookings = computed(() => {
  if (!userId.value || !bookings.value) return [];

  return bookings.value
    .filter(
      (booking) => booking.userId === userId.value && booking.hiddenForUser !== true
    )
    .map((booking) => {
      const remainingTime = getRemainingTime(booking.endDate);
      const isExpired = remainingTime === "Expired";

      if (!isExpired) return booking;

      const expiredDate = new Date(booking.endDate);
      const now = new Date();
      const timeDiff = now - expiredDate;
      const hoursExpired = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60)));

      return {
        ...booking,
        hoursExpired,
        penaltyPhase:
          hoursExpired <= 48 ? "first" : hoursExpired <= 96 ? "second" : "final",
        penaltyPending: pendingPenalties.value[booking.id],
        penaltyAmount: booking.penaltyAmount || 0,
        penaltyPercentage: booking.penaltyPercentage || 0,
      };
    });
});

const filteredProducts = computed(() => {
  if (!searchQuery.value) return userBookings.value;
  const q = searchQuery.value.toLowerCase();
  return userBookings.value.filter((p) => p.productTitle.toLowerCase().includes(q));
});

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

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const isCancelable = (startDateStr) => {
  const [year, month, day] = startDateStr.split("-").map(Number);
  const startDate = new Date(year, month - 1, day, 0, 0, 0);
  const now = new Date();
  const diffMs = now - startDate;
  const hoursPassed = diffMs / (1000 * 60 * 60);
  return hoursPassed > 10;
};

const cancelBooking = async (id, productPrice, startDateStr, endDateStr) => {
  try {
    await updateDoc(doc(db, "bookings", id), {
      hiddenForUser: true,
    });

    const [startYear, startMonth, startDay] = startDateStr.split("-").map(Number);
    const [endYear, endMonth, endDay] = endDateStr.split("-").map(Number);
    const startDate = new Date(startYear, startMonth - 1, startDay, 0, 0, 0);
    const endDate = new Date(endYear, endMonth - 1, endDay, 0, 0, 0);
    const diffMs = endDate - startDate;
    const daysRented = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const perDayPrice = Number(productPrice) / daysRented;
    const refundAmount = perDayPrice * 0.5;

    const userBalanceRef = doc(db, "userbalance", userId.value);
    const userBalanceSnap = await getDoc(userBalanceRef);

    let currentBalance = 0;
    if (userBalanceSnap.exists()) {
      currentBalance = Number(userBalanceSnap.data().remainingBalance) || 0;
    }

    await setDoc(
      userBalanceRef,
      {
        remainingBalance: currentBalance + refundAmount,
        lastUpdated: new Date(),
        transactions: arrayUnion({
          amount: refundAmount,
          type: "refund",
          description: `Cancellation refund for booking ${id}`,
          timestamp: new Date(),
        }),
      },
      { merge: true }
    );

    Swal.fire({
      title: "Booking Cancelled",
      text: `Your booking has been cancelled and EGP ${refundAmount.toFixed(
        2
      )} has been refunded to your balance.`,
      icon: "success",
    });
  } catch (error) {
    console.error("Error canceling booking:", error);
    Swal.fire({
      title: "Error",
      text: "Failed to cancel booking. Please try again.",
      icon: "error",
    });
  }
};

const calculatePenalty = (price, percentage) => {
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    console.error("Invalid price value:", price);
    return "0.00";
  }
  const amount = (numericPrice * percentage) / 100;
  return formatPrice(amount);
};

const formatPrice = (price) => {
  return Number(price).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const applyPenalty = async (booking, percentage, isAdditional = false) => {
  try {
    pendingPenalties.value[booking.id] = true;
    const price = getProductPrice(booking);
    const penaltyAmount = (price * percentage) / 100;
    const totalPercentage = isAdditional
      ? (booking.penaltyPercentage || 0) + percentage
      : percentage;
    const totalAmount = isAdditional
      ? (booking.penaltyAmount || 0) + penaltyAmount
      : penaltyAmount;

    const userBalanceRef = doc(db, "userbalance", userId.value);
    const userBalanceSnap = await getDoc(userBalanceRef);
    let currentBalance = userBalanceSnap.exists()
      ? Number(userBalanceSnap.data().remainingBalance) || 0
      : 0;

    // Deduct penalty from user's balance
    await setDoc(
      userBalanceRef,
      {
        remainingBalance: currentBalance - penaltyAmount,
        lastUpdated: Timestamp.now(),
        transactions: arrayUnion({
          amount: -penaltyAmount,
          type: "penalty",
          description: `Late return penalty (${percentage}% of EGP ${price.toFixed(
            2
          )}) for ${booking.productTitle}`,
          timestamp: Timestamp.now(),
        }),
      },
      { merge: true }
    );

    // Update booking with penalty information
    await updateDoc(doc(db, "bookings", booking.id), {
      penaltyApplied: true,
      lastPenaltyApplied: Timestamp.now(),
      penaltyAmount: totalAmount,
      penaltyPercentage: totalPercentage,
      statusHistory: arrayUnion({
        status: "penalty_applied",
        message: `${percentage}% penalty (EGP ${penaltyAmount.toFixed(2)}) applied`,
        timestamp: Timestamp.now(),
        updatedBy: "system",
      }),
    });

    await Swal.fire({
      title: "Penalty Applied",
      html: `A <strong>${percentage}% penalty (EGP ${penaltyAmount.toFixed(
        2
      )})</strong> has been deducted from your balance.<br><br>
            <strong>Total penalties: ${totalPercentage}% (EGP ${totalAmount.toFixed(
        2
      )})</strong>`,
      icon: "warning",
    });
  } catch (error) {
    console.error("Error applying penalty:", error);
    Swal.fire({
      title: "Error",
      text: "Failed to apply penalty. Please try again.",
      icon: "error",
    });
  } finally {
    pendingPenalties.value[booking.id] = false;
  }
};

const checkAndApplyPenalties = async () => {
  const now = new Date();
  const bookingsToProcess = userBookings.value.filter(
    (b) => b.hoursExpired > 0 && b.status !== "completed" && !b.penaltyPending
  );

  for (const booking of bookingsToProcess) {
    try {
      // Apply 30% penalty after 48 hours (2 days)
      if (booking.hoursExpired > 48 && booking.penaltyPhase === "first") {
        await applyPenalty(booking, 30);
      }
      // Apply additional 20% penalty after 96 hours (4 days)
      else if (booking.hoursExpired > 96 && (booking.penaltyPercentage || 0) < 50) {
        await applyPenalty(booking, 20, true);
      }
      // Show legal warning if still not returned
      else if (booking.hoursExpired > 96 && !booking.legalWarningSent) {
        await Swal.fire({
          title: "Serious Warning",
          html: `Your rental is ${Math.floor(
            booking.hoursExpired / 24
          )} days overdue.<br><br>
                <strong>Legal action may be taken if not returned immediately.</strong>`,
          icon: "error",
          confirmButtonText: "I Understand",
        });

        await updateDoc(doc(db, "bookings", booking.id), {
          legalWarningSent: true,
        });
      }
    } catch (error) {
      console.error("Error processing penalty:", error);
    }
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "active":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const updateRentalStatus = async (bookingId, newStatus, updatedBy) => {
  return await updateRentalStatusWithUI(bookingId, newStatus, updatedBy, t);
};

const hideBooking = async (id) => {
  try {
    await updateDoc(doc(db, "bookings", id), {
      hiddenForUser: true,
    });
    Swal.fire({
      title: "Removed",
      text: "This rental has been removed from your view.",
      icon: "success",
    });
  } catch (error) {
    console.error("Error hiding booking:", error);
    Swal.fire({
      title: "Error",
      text: "Failed to remove rental. Please try again.",
      icon: "error",
    });
  }
};

// Initialize
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userId.value = user.uid;
      await checkAndApplyPenalties();
      // Check for penalties every 30 minutes
      penaltyCheckInterval.value = setInterval(checkAndApplyPenalties, 30 * 60 * 1000);
    }
  });
});

onUnmounted(() => {
  if (penaltyCheckInterval.value) {
    clearInterval(penaltyCheckInterval.value);
  }
});

defineExpose({
  calculatePenalty,
  formatPrice,
});
</script>
