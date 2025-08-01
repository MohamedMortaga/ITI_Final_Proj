<template>
  <div class="max-w-6xl mx-auto py-10 px-4">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-[var(--Color-Text-Text-Primary)] mb-2">
        {{ $t("contactDetails") }}
      </h1>
      <p class="text-[var(--Color-Text-Text-Secondary)]">
        {{ $t("renterContactInfo") }}
      </p>
    </div>

    <!-- Contact Details Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="booking in bookingsWithContactInfo"
        :key="booking.id"
        class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6"
      >
        <!-- Product Info -->
        <div class="mb-4">
          <img
            :src="booking.productImage || require('@/assets/default.png')"
            alt="Product"
            class="w-full h-32 object-cover rounded-lg mb-3"
          />
          <h3 class="font-semibold text-[var(--Color-Text-Text-Primary)] mb-1">
            {{ booking.productTitle }}
          </h3>
          <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
            {{ $t("rentalPeriod") }}: {{ formatDate(booking.startDate) }} - {{ formatDate(booking.endDate) }}
          </p>
          <p class="text-xs text-[var(--Color-Text-Text-Secondary)] mt-1">
            {{ $t("status") }}: <span class="font-medium" :class="getStatusColor(booking.status)">{{ $t(booking.status) }}</span>
          </p>
        </div>

        <!-- Renter Contact Information -->
        <div class="space-y-3">
          <h4 class="font-semibold text-[var(--Color-Text-Text-Primary)] text-sm">
            {{ $t("renterContactInfo") }}
          </h4>
          
          <!-- Renter Name with Verification Badge -->
          <div v-if="booking.userName" class="flex items-center gap-2">
            <i class="fas fa-user text-[var(--Color-Text-Text-Brand)] w-4"></i>
            <span class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t("name") }}:</span>
            <VerificationBadge 
              :userName="booking.userName" 
              :isVerified="booking.userVerificationStatus"
            />
          </div>

          <!-- Renter Phone -->
          <div v-if="booking.phoneNumber" class="flex items-center gap-2">
            <i class="fas fa-phone text-[var(--Color-Text-Text-Brand)] w-4"></i>
            <span class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t("renterPhone") }}:</span>
            <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">{{ booking.phoneNumber }}</span>
          </div>

          <!-- Renter Email -->
          <div v-if="booking.userEmail" class="flex items-center gap-2">
            <i class="fas fa-envelope text-[var(--Color-Text-Text-Brand)] w-4"></i>
            <span class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t("renterEmail") }}:</span>
            <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">{{ booking.userEmail }}</span>
          </div>

          <!-- Delivery Method -->
          <div class="flex items-center gap-2 mt-4 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]">
            <i class="fas fa-truck text-[var(--Color-Text-Text-Brand)] w-4"></i>
            <span class="text-sm text-[var(--Color-Text-Text-Secondary)]">
              {{ booking.deliveryMethod === 'pickup' ? $t("pickupLocation") : $t("deliveryAddress") }}:
            </span>
            <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">
              {{ booking.deliveryMethod === 'pickup' ? (booking.sellerContactInfo?.sellerAddress || '') : booking.deliveryAddress }}
            </span>
          </div>

          <!-- Price Breakdown -->
          <div class="space-y-2 mt-4 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]">
            <!-- Subtotal -->
            <div class="flex justify-between items-center">
              <span class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t("subtotal") }}:</span>
              <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">
                {{ $t("egp") }} {{ calculateSubtotal(booking) }}
              </span>
            </div>
            
            <!-- Delivery Fee -->
            <div class="flex justify-between items-center">
              <span class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t("deliveryFee") }}:</span>
              <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">
                {{ $t("egp") }} {{ calculateDeliveryFee(booking) }}
              </span>
            </div>
            
            <!-- Service Fee -->
            <div class="flex justify-between items-center">
              <span class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t("serviceFee") }}:</span>
              <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">{{ $t("egp") }} 5.00</span>
            </div>
            
            <!-- Total -->
            <div class="flex justify-between items-center pt-2 border-t border-[var(--Color-Boarder-Border-Primary)]">
              <span class="text-sm font-bold text-[var(--Color-Text-Text-Primary)]">{{ $t("total") }}:</span>
              <span class="text-sm font-bold text-[var(--Color-Text-Text-Brand)]">
                {{ $t("egp") }} {{ getTotalPrice(booking) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-4 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]">
          <!-- Rental Status Management Section -->
          <div class="mb-4">
            <h4 class="font-semibold text-[var(--Color-Text-Text-Primary)] text-sm mb-3">
              {{ $t("rentalStatusManagement") }}
            </h4>
            
            <!-- Current Status Display -->
            <div class="flex items-center gap-2 mb-3">
              <span class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t("currentStatus") }}:</span>
              <span class="font-medium px-2 py-1 rounded text-xs" :class="getStatusColor(booking.status)">
                {{ $t(booking.status) }}
              </span>
            </div>
            
            <!-- Status Update Buttons -->
            <div class="flex gap-2 flex-wrap">
              <!-- Seller can set to Active when handing over item -->
              <button
                v-if="isCurrentUserSeller(booking) && booking.status === 'pending'"
                @click="updateRentalStatusWithUI(booking.id, 'active', 'seller', $t)"
                class="bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
                title="Mark as Active when handing over the item"
              >
                <i class="fas fa-check"></i>
                {{ $t("setActive") }}
              </button>
              
              <!-- Renter can confirm Active when receiving item -->
              <button
                v-if="isCurrentUserRenter(booking) && booking.status === 'pending'"
                @click="updateRentalStatusWithUI(booking.id, 'active', 'renter', $t)"
                class="bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
                title="Confirm Active when receiving the item"
              >
                <i class="fas fa-check-double"></i>
                {{ $t("confirmActive") }}
              </button>
              
              <!-- Completion Confirmation Buttons -->
              <button
                v-if="booking.status === 'active' && isCurrentUserSeller(booking)"
                @click="updateRentalStatusWithUI(booking.id, 'completed', 'seller', $t)"
                class="bg-purple-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
                title="Confirm completion as seller"
              >
                <i class="fas fa-check-circle"></i>
                {{ $t("confirmCompletion") }}
              </button>
              
              <button
                v-if="booking.status === 'active' && isCurrentUserRenter(booking)"
                @click="updateRentalStatusWithUI(booking.id, 'completed', 'renter', $t)"
                class="bg-purple-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
                title="Confirm completion as renter"
              >
                <i class="fas fa-check-circle"></i>
                {{ $t("confirmCompletion") }}
              </button>
              
              <!-- Both can reject the rental -->
              <button
                v-if="booking.status === 'pending'"
                @click="updateRentalStatusWithUI(booking.id, 'rejected', isCurrentUserSeller(booking) ? 'seller' : 'renter', $t)"
                class="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
                title="Reject this rental"
              >
                <i class="fas fa-times"></i>
                {{ $t("rejectRental") }}
              </button>
              
              <!-- Reset to Pending if needed -->
              <button
                v-if="booking.status === 'rejected'"
                @click="updateRentalStatusWithUI(booking.id, 'pending', isCurrentUserSeller(booking) ? 'seller' : 'renter', $t)"
                class="bg-yellow-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-yellow-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
                title="Reset to Pending status"
              >
                <i class="fas fa-undo"></i>
                {{ $t("resetToPending") }}
              </button>
            </div>
            
            <!-- Dual Confirmation Status Display -->
            <div v-if="booking.status === 'active' && (booking.sellerConfirmed || booking.renterConfirmed)" class="mt-3 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]">
              <h5 class="text-xs font-medium text-[var(--Color-Text-Text-Secondary)] mb-2">{{ $t("completionConfirmation") }}:</h5>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-xs">
                  <i class="fas fa-user-tie text-blue-500"></i>
                  <span class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("seller") }}:</span>
                  <span v-if="booking.sellerConfirmed" class="text-green-600 font-medium">{{ $t("confirmed") }}</span>
                  <span v-else class="text-gray-500">{{ $t("pending") }}</span>
                </div>
                <div class="flex items-center gap-2 text-xs">
                  <i class="fas fa-user text-blue-500"></i>
                  <span class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("renter") }}:</span>
                  <span v-if="booking.renterConfirmed" class="text-green-600 font-medium">{{ $t("confirmed") }}</span>
                  <span v-else class="text-gray-500">{{ $t("pending") }}</span>
                </div>
                <div v-if="booking.fullyCompleted" class="flex items-center gap-2 text-xs">
                  <i class="fas fa-check-circle text-green-500"></i>
                  <span class="text-green-600 font-medium">{{ $t("rentalCompleted") }}</span>
                </div>
              </div>
            </div>
            
            <!-- Status History -->
            <div v-if="booking.statusHistory && booking.statusHistory.length > 0" class="mt-3 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]">
              <h5 class="text-xs font-medium text-[var(--Color-Text-Text-Secondary)] mb-2">{{ $t("statusHistory") }}:</h5>
              <div class="space-y-1">
                <div v-for="(history, index) in booking.statusHistory.slice(-3)" :key="index" class="flex items-center gap-2 text-xs">
                  <span class="text-[var(--Color-Text-Text-Secondary)]">{{ formatDate(history.timestamp) }}:</span>
                  <span class="font-medium" :class="getStatusColor(history.status)">{{ $t(history.status) }}</span>
                  <span class="text-[var(--Color-Text-Text-Secondary)]">({{ history.updatedBy }})</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex gap-2">
            <button
              @click="messageUser(booking.userId, booking.userName, booking.productId, booking.productTitle)"
              class="flex-1 bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] py-3 px-4 rounded-lg text-sm font-medium hover:bg-[var(--Colors-Primary-600)] transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
              title="Start a conversation with this user"
            >
              <i class="fas fa-comments"></i>
              {{ $t("messageUser") }}
            </button>
            <button
              @click="callContact(booking.phoneNumber)"
              class="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
              title="Call this contact"
            >
              <i class="fas fa-phone-volume"></i>
            </button>
            <button
              @click="deleteContactDetails(booking.id)"
              class="bg-[var(--Colors-Error-400)] text-white p-3 rounded-lg hover:bg-[var(--Colors-Error-500)] transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
              title="Delete this contact details entry"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="bookingsWithContactInfo.length === 0" class="text-center py-12">
      <i class="fas fa-address-book text-6xl text-[var(--Color-Text-Text-Secondary)] mb-4 opacity-50"></i>
      <h3 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-2">
        {{ $t("noContactDetails") }}
      </h3>
      <p class="text-[var(--Color-Text-Text-Secondary)]">
        {{ $t("noContactDetailsDesc") }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { db, auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useGlobalRealTime } from "@/composables/useGlobalRealTime";
import { useRentalStatus } from "@/composables/useRentalStatus";
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import VerificationBadge from "@/components/VerificationBadge.vue";

const { t } = useI18n();
const router = useRouter();

// Initialize real-time data
const { bookings } = useGlobalRealTime();

// Initialize rental status composable
const { updateRentalStatusWithUI } = useRentalStatus();

const userId = ref(null);
const userVerificationStatuses = ref({});
const productDetails = ref({}); // Cache for product details
const calculatedPrices = ref({}); // Cache for calculated prices

// Function to get user verification status
const getUserVerificationStatus = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.isVerified || false;
    }
    return false;
  } catch (error) {
    console.error('Error fetching user verification status:', error);
    return false;
  }
};

// Function to get product details
const getProductDetails = async (productId) => {
  if (!productId) return null;
  
  // Check if we already have the product details cached
  if (productDetails.value[productId]) {
    return productDetails.value[productId];
  }
  
  try {
    const productDoc = await getDoc(doc(db, 'products', productId));
    if (productDoc.exists()) {
      const productData = productDoc.data();
      // Cache the product details
      productDetails.value[productId] = productData;
      return productData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
};

// Computed property to filter bookings where current user is the seller
const bookingsWithContactInfo = computed(() => {
  if (!userId.value || !bookings.value) return [];
  
  // Filter bookings where current user is the seller (owner)
  const sellerBookings = bookings.value.filter((booking) => booking.sellerId === userId.value);
  const bookingsWithRenterInfo = sellerBookings.filter((booking) => 
    booking.userName && booking.phoneNumber && ['pending', 'active', 'completed', 'rejected'].includes(booking.status)
  );
  const visibleBookings = bookingsWithRenterInfo.filter((booking) => booking.hiddenForSeller !== true);
  
  // Add verification status to each booking
  const bookingsWithVerification = visibleBookings.map(booking => ({
    ...booking,
    userVerificationStatus: userVerificationStatuses.value[booking.userId] || false
  }));
  
  // Debug logging
  console.log('ContactDetails Debug (Seller View):', {
    totalBookings: bookings.value?.length || 0,
    sellerBookings: sellerBookings.length,
    bookingsWithRenterInfo: bookingsWithRenterInfo.length,
    visibleBookings: visibleBookings.length,
    userId: userId.value,
    sampleBooking: bookingsWithVerification[0] || null
  });
  
  // Log sample booking fields for debugging
  if (bookingsWithVerification[0]) {
    const sample = bookingsWithVerification[0];
    console.log('Sample booking fields:', {
      id: sample.id,
      startDate: sample.startDate,
      endDate: sample.endDate,
      productPrice: sample.productPrice,
      price: sample.price,
      dailyPrice: sample.dailyPrice,
      totalPrice: sample.totalPrice,
      deliveryMethod: sample.deliveryMethod,
      productTitle: sample.productTitle
    });
  }
  
  return bookingsWithVerification;
});

// Load verification statuses for all users in bookings
const loadUserVerificationStatuses = async () => {
  if (!bookings.value) return;
  
  const uniqueUserIds = [...new Set(bookings.value.map(booking => booking.userId).filter(Boolean))];
  
  for (const userId of uniqueUserIds) {
    if (!userVerificationStatuses.value[userId]) {
      const isVerified = await getUserVerificationStatus(userId);
      userVerificationStatuses.value[userId] = isVerified;
    }
  }
};

// Load product details for all bookings
const loadProductDetails = async () => {
  if (!bookings.value) return;
  
  const uniqueProductIds = [...new Set(bookings.value.map(booking => booking.productId).filter(Boolean))];
  
  for (const productId of uniqueProductIds) {
    if (!productDetails.value[productId]) {
      await getProductDetails(productId);
    }
  }
};

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

// Get status color class
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

// Calculate subtotal for a booking (same as RentConfirmation)
const calculateSubtotal = (booking) => {
  console.log('calculateSubtotal called for booking:', booking.id);
  
  if (!booking.startDate || !booking.endDate) {
    console.log('Missing dates, returning 0');
    return 0;
  }
  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);
  const diffTime = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const days = diffTime + 1; // Include both start and end dates
  
  // Get price from booking data or product details
  let pricePerDay = booking.productPrice || booking.price || booking.dailyPrice || 0;
  
  // If no price in booking data, try to get from cached product details
  if (!pricePerDay || pricePerDay <= 0) {
    if (booking.productId && productDetails.value[booking.productId]) {
      pricePerDay = productDetails.value[booking.productId].price || 0;
    }
  }
  
  // If still no price, use default
  if (!pricePerDay || pricePerDay <= 0) {
    pricePerDay = 50; // Default price per day
  }
  
  const subtotal = days * pricePerDay;
  
  console.log('Subtotal calculation:', {
    startDate: booking.startDate,
    endDate: booking.endDate,
    days,
    pricePerDay,
    subtotal
  });
  
  return subtotal;
};

// Calculate delivery fee for a booking (same as RentConfirmation)
const calculateDeliveryFee = (booking) => {
  console.log('calculateDeliveryFee called for booking:', booking.id, 'method:', booking.deliveryMethod);
  
  if (booking.deliveryMethod === 'pickup') {
    console.log('Pickup method, returning 0');
    return 0;
  }
  
  if (booking.deliveryMethod === 'delivery') {
    // Check if we have both renter and lender coordinates
    if (booking.renterLat && booking.renterLng && 
        booking.lenderLat && booking.lenderLng) {
      
      // Calculate real distance between renter and lender
      const distance = calculateDistance(
        booking.lenderLat, 
        booking.lenderLng,
        booking.renterLat, 
        booking.renterLng
      );
      
      // Base delivery fee
      const baseFee = 25;
      
      // Distance-based fee (5 EGP per km, max 200 EGP)
      const distanceFee = Math.min(distance * 5, 200);
      const totalFee = baseFee + distanceFee;
      
      console.log('Delivery fee calculation (coordinates):', {
        distance: distance.toFixed(2),
        baseFee,
        distanceFee,
        totalFee
      });
      
      return totalFee;
    }
    
    // Fallback: if coordinates not available, use address-based calculation
    const address = booking.deliveryAddress || '';
    if (address.trim() === '') {
      console.log('No delivery address, returning 0');
      return 0;
    }
    
    const baseFee = 25;
    let distanceFee = 0;
    const addressLower = address.toLowerCase();
    
    if (addressLower.includes('cairo') || addressLower.includes('القاهرة')) {
      distanceFee = 15;
    } else if (addressLower.includes('giza') || addressLower.includes('الجيزة')) {
      distanceFee = 25;
    } else if (addressLower.includes('alexandria') || addressLower.includes('الإسكندرية')) {
      distanceFee = 80;
    } else if (addressLower.includes('sharm') || addressLower.includes('شرم')) {
      distanceFee = 150;
    } else if (addressLower.includes('hurghada') || addressLower.includes('الغردقة')) {
      distanceFee = 120;
    } else {
      distanceFee = 35;
    }
    
    const totalFee = baseFee + distanceFee;
    
    console.log('Delivery fee calculation (address):', {
      address,
      baseFee,
      distanceFee,
      totalFee
    });
    
    return totalFee;
  }
  
  console.log('No delivery method or pickup, returning 0');
  return 0;
};

// Calculate total price for a booking (same as RentConfirmation)
const calculateTotalPrice = async (booking) => {
  console.log('Calculating total price for booking:', booking);
  
  // If totalPrice is already calculated and stored, use it
  if (booking.totalPrice && booking.totalPrice > 0) {
    console.log('Using stored totalPrice:', booking.totalPrice);
    return parseFloat(booking.totalPrice).toFixed(2);
  }
  
  // Use the same calculation logic as RentConfirmation
  const subtotal = calculateSubtotal(booking);
  const deliveryFee = calculateDeliveryFee(booking);
  const serviceFee = 5; // Fixed service fee (same as RentConfirmation)
  const total = subtotal + deliveryFee + serviceFee;
  
  console.log('Final calculation:', { subtotal, deliveryFee, serviceFee, total });
  
  return total.toFixed(2);
};

// Synchronous function to get total price (with caching) - same as RentConfirmation
const getTotalPrice = (booking) => {
  console.log('getTotalPrice called for booking:', booking.id);
  
  // If we have a cached calculated price, use it
  if (calculatedPrices.value[booking.id]) {
    console.log('Using cached price:', calculatedPrices.value[booking.id]);
    return calculatedPrices.value[booking.id];
  }
  
  // If booking has a stored totalPrice, use it
  if (booking.totalPrice && booking.totalPrice > 0) {
    console.log('Using stored totalPrice:', booking.totalPrice);
    return parseFloat(booking.totalPrice).toFixed(2);
  }
  
  // Use the same calculation logic as RentConfirmation
  const subtotal = calculateSubtotal(booking);
  const deliveryFee = calculateDeliveryFee(booking);
  const serviceFee = 5; // Fixed service fee (same as RentConfirmation)
  const total = subtotal + deliveryFee + serviceFee;
  const priceString = total.toFixed(2);
  
  console.log('Calculated price breakdown:', {
    subtotal,
    deliveryFee,
    serviceFee,
    total,
    priceString
  });
  
  // Cache the calculated price
  calculatedPrices.value[booking.id] = priceString;
  
  // Trigger async calculation for more accurate price
  calculateTotalPriceAsync(booking);
  
  return priceString;
};

// Async function to calculate more accurate price
const calculateTotalPriceAsync = async (booking) => {
  try {
    const accuratePrice = await calculateTotalPrice(booking);
    calculatedPrices.value[booking.id] = accuratePrice;
  } catch (error) {
    console.error('Error calculating accurate price:', error);
  }
};

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Copy contact information to clipboard
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast(t("contactInfoCopied"), "success");
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showToast(t("contactInfoCopied"), "success");
  }
};

// Copy all contact information
const copyAllContactInfo = (booking) => {
  const contactText = [
    `Renter Name: ${booking.userName || ''}`,
    `Phone: ${booking.phoneNumber || ''}`,
    `Email: ${booking.userEmail || ''}`,
    `Product: ${booking.productTitle || ''}`,
    `Rental Period: ${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}`,
    `Total Price: ${t("egp")} ${getTotalPrice(booking)}`,
    `Delivery Method: ${booking.deliveryMethod || ''}`
  ].filter(line => line.split(': ')[1]).join('\n');
  
  copyToClipboard(contactText);
};

// Get directions using Google Maps
const getDirections = (address) => {
  const encodedAddress = encodeURIComponent(address);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  window.open(mapsUrl, '_blank');
};

// Show toast notification
const showToast = (message, type = "success") => {
  const event = new CustomEvent('show-toast', {
    detail: {
      message,
      type
    }
  });
  window.dispatchEvent(event);
};

// Message user function - Enhanced to create chat and navigate to Messages
const messageUser = async (userId, userName, productId = null, productTitle = null) => {
  try {
    if (!auth.currentUser) {
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'Please log in to send messages.',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Prevent messaging yourself
    if (userId === auth.currentUser.uid) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Message Yourself',
        text: 'You cannot send a message to yourself.',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Start Conversation?',
      text: `Do you want to start a conversation with ${userName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Start Chat',
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
      title: 'Creating Chat...',
      text: `Setting up conversation with ${userName}`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Check if chat room already exists
    const chatRoomsRef = collection(db, 'user-chats');
    const existingChatQuery = query(
      chatRoomsRef,
      where('participants', 'array-contains', auth.currentUser.uid)
    );
    
    const existingChats = await getDocs(existingChatQuery);
    let existingChatRoom = null;
    
    existingChats.forEach(doc => {
      const chatData = doc.data();
      if (chatData.participants.includes(userId)) {
        existingChatRoom = { id: doc.id, ...chatData };
      }
    });

    let chatRoomId;

    if (existingChatRoom) {
      // Use existing chat room
      chatRoomId = existingChatRoom.id;
      console.log('Using existing chat room:', chatRoomId);
    } else {
      // Create new chat room
      const chatRoomData = {
        participants: [auth.currentUser.uid, userId],
        createdAt: serverTimestamp(),
        lastMessage: null,
        lastMessageTime: null,
        productId: productId,
        productTitle: productTitle
      };

      const newChatRoom = await addDoc(chatRoomsRef, chatRoomData);
      chatRoomId = newChatRoom.id;
      console.log('Created new chat room:', chatRoomId);
    }

    // Store the selected conversation info for Messages component
    const selectedConversationInfo = {
      id: chatRoomId,
      otherUserId: userId,
      otherUserName: userName,
      productId: productId,
      productTitle: productTitle,
      timestamp: Date.now()
    };
    
    localStorage.setItem('selectedConversation', JSON.stringify(selectedConversationInfo));

    // Close loading dialog
    Swal.close();
    
    // Navigate to Messages page
    router.push('/messages');
    
    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Chat Started',
      text: `Opening chat with ${userName}`,
      timer: 2000,
      showConfirmButton: false,
      position: 'top-end'
    });

  } catch (error) {
    console.error('Error creating chat:', error);
    Swal.close(); // Close loading dialog
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to start chat. Please try again.',
      confirmButtonText: 'OK'
    });
  }
};

// Call contact function
const callContact = (phoneNumber) => {
  if (!phoneNumber) {
    Swal.fire({
      icon: 'warning',
      title: 'No Phone Number',
      text: 'This contact does not have a phone number available.',
      confirmButtonText: 'OK'
    });
    return;
  }

  // Show confirmation dialog
  Swal.fire({
    title: 'Make Phone Call?',
    text: `Do you want to call ${phoneNumber}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Call',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      // Open phone dialer
      window.open(`tel:${phoneNumber}`, '_self');
    }
  });
};

// Delete contact details entry
const deleteContactDetails = async (bookingId) => {
  try {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Delete Contact Details?',
      text: 'Are you sure you want to delete this contact details entry? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true
    });

    if (!result.isConfirmed) {
      return;
    }

    // Show loading state
    Swal.fire({
      title: 'Deleting...',
      text: 'Removing contact details entry',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Update the booking to hide it from seller view
    await updateDoc(doc(db, "bookings", bookingId), {
      hiddenForSeller: true
    });

    // Close loading dialog
    Swal.close();
    
    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Deleted Successfully',
      text: 'Contact details entry has been removed',
      timer: 2000,
      showConfirmButton: false,
      position: 'top-end'
    });

  } catch (error) {
    console.error('Error deleting contact details:', error);
    Swal.close(); // Close loading dialog
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to delete contact details. Please try again.',
      confirmButtonText: 'OK'
    });
  }
};

// Validate booking data
const validateBookingData = (bookingData, currentUserId) => {
  const errors = [];
  
  if (!bookingData) {
    errors.push('Booking data is missing');
    return errors;
  }
  
  if (!bookingData.sellerId && !bookingData.userId) {
    errors.push('Booking does not have valid user information');
  }
  
  if (!bookingData.status) {
    errors.push('Booking status is missing');
  }
  
  if (!bookingData.sellerId && !bookingData.userId) {
    errors.push('Booking does not have valid user information');
  }
  
  // Check if current user is involved in this booking
  const isSeller = bookingData.sellerId === currentUserId;
  const isRenter = bookingData.userId === currentUserId;
  
  if (!isSeller && !isRenter) {
    errors.push('You do not have permission to update this booking');
  }
  
  return errors;
};

// Check Firebase connectivity
const checkFirebaseConnectivity = async () => {
  try {
    // Try to read a document to test connectivity
    const testDoc = doc(db, 'bookings', 'test-connection');
    await getDoc(testDoc);
    return true;
  } catch (error) {
    console.error('Firebase connectivity test failed:', error);
    return false;
  }
};

// Update rental status function with retry mechanism
const updateRentalStatus = async (bookingId, newStatus, updatedBy, retryCount = 0) => {
  const maxRetries = 3;
  
  try {
    // Check if user is authenticated
    if (!auth.currentUser) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please log in to update rental status.',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Validate input parameters
    if (!bookingId || !newStatus || !updatedBy) {
      console.error('Invalid parameters:', { bookingId, newStatus, updatedBy });
      Swal.fire({
        icon: 'error',
        title: 'Invalid Parameters',
        text: 'Missing required information for status update.',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Check network connectivity
    if (!navigator.onLine) {
      Swal.fire({
        icon: 'error',
        title: 'No Internet Connection',
        text: 'Please check your internet connection and try again.',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Check Firebase connectivity on first attempt
    if (retryCount === 0) {
      const isFirebaseConnected = await checkFirebaseConnectivity();
      if (!isFirebaseConnected) {
        Swal.fire({
          icon: 'error',
          title: 'Service Unavailable',
          text: 'Unable to connect to the service. Please try again later.',
          confirmButtonText: 'OK'
        });
        return;
      }
    }

    // Show confirmation dialog (only on first attempt)
    if (retryCount === 0) {
      const result = await Swal.fire({
        title: 'Confirm Status Change?',
        text: `Are you sure you want to change the status to "${t(newStatus)}"? This action cannot be undone.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Change Status',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        reverseButtons: true
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    // Show loading state
    const loadingText = retryCount > 0 ? `Retrying... (Attempt ${retryCount + 1}/${maxRetries + 1})` : `Changing status to ${t(newStatus)}`;
    Swal.fire({
      title: retryCount > 0 ? 'Retrying Update...' : 'Updating...',
      text: loadingText,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Get the current booking document
    const bookingDoc = doc(db, "bookings", bookingId);
    
    // First, check if the document exists
    const bookingSnap = await getDoc(bookingDoc);

    if (!bookingSnap.exists()) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Booking Not Found',
        text: 'The booking you are trying to update does not exist.',
        confirmButtonText: 'OK'
      });
      return;
    }

    const bookingData = bookingSnap.data();
    const currentUserId = auth.currentUser.uid;

    // Validate booking data
    const validationErrors = validateBookingData(bookingData, currentUserId);
    if (validationErrors.length > 0) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Invalid Booking Data',
        text: validationErrors.join('. '),
        confirmButtonText: 'OK'
      });
      return;
    }

    // Check if user has permission to update this booking
    const isSeller = bookingData.sellerId === currentUserId;
    const isRenter = bookingData.userId === currentUserId;

    if (!isSeller && !isRenter) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Permission Denied',
        text: 'You do not have permission to update this rental status.',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Validate status transition
    const currentStatus = bookingData.status;
    const validTransitions = {
      'pending': ['active', 'rejected'],
      'active': ['completed'],
      'rejected': ['pending'],
      'completed': []
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Invalid Status Transition',
        text: `Cannot change status from "${t(currentStatus)}" to "${t(newStatus)}".`,
        confirmButtonText: 'OK'
      });
      return;
    }

    // Add new status to history with more detailed information
    const newStatusHistory = [...bookingData.statusHistory || [], {
      status: newStatus,
      timestamp: serverTimestamp(),
      updatedBy: updatedBy,
      updatedByUserId: currentUserId,
      previousStatus: currentStatus,
      reason: `Status changed from ${currentStatus} to ${newStatus}`,
      retryCount: retryCount
    }];

    // Prepare update data
    const updateData = {
      status: newStatus,
      statusHistory: newStatusHistory,
      lastUpdated: serverTimestamp(),
      lastUpdatedBy: currentUserId
    };

    // Update the booking document
    await updateDoc(bookingDoc, updateData);

    // Close loading dialog
    Swal.close();
    
    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Status Updated Successfully',
      text: `Rental status changed to ${t(newStatus)}`,
      timer: 2000,
      showConfirmButton: false,
      position: 'top-end'
    });

  } catch (error) {
    console.error('Error updating rental status:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack,
      retryCount,
      bookingId,
      newStatus,
      updatedBy
    });
    
    // Close loading dialog
    Swal.close();
    
    // Handle retry logic for network-related errors
    if (retryCount < maxRetries && (
      error.code === 'unavailable' || 
      error.code === 'deadline-exceeded' ||
      error.message?.includes('network') ||
      error.message?.includes('timeout')
    )) {
      console.log(`Retrying update (attempt ${retryCount + 1}/${maxRetries})`);
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry the update
      return updateRentalStatus(bookingId, newStatus, updatedBy, retryCount + 1);
    }
    
    // Provide more specific error messages based on error type
    let errorMessage = 'Failed to update rental status. Please try again.';
    
    if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied. You may not have the right to update this rental.';
    } else if (error.code === 'unavailable') {
      errorMessage = 'Service temporarily unavailable. Please check your internet connection and try again.';
    } else if (error.code === 'unauthenticated') {
      errorMessage = 'Please log in again to update rental status.';
    } else if (error.code === 'not-found') {
      errorMessage = 'The booking was not found. It may have been deleted.';
    } else if (error.code === 'already-exists') {
      errorMessage = 'This status update has already been applied.';
    } else if (error.code === 'deadline-exceeded') {
      errorMessage = 'Request timed out. Please check your internet connection and try again.';
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }
    
    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: errorMessage,
      confirmButtonText: 'OK'
    });
  }
};

// Helper to check if current user is the seller
const isCurrentUserSeller = (booking) => {
  return booking.sellerId === userId.value;
};

// Helper to check if current user is the renter
const isCurrentUserRenter = (booking) => {
  return booking.userId === userId.value;
};

// Watch for bookings changes to load product details
watch(bookings, async (newBookings) => {
  if (newBookings && newBookings.length > 0 && userId.value) {
    await loadProductDetails();
  }
}, { immediate: true });

// Initialize user on mount
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userId.value = user.uid;
      await loadUserVerificationStatuses(); // Load verification statuses when user is logged in
      await loadProductDetails(); // Load product details for accurate pricing
    }
  });
});
</script> 