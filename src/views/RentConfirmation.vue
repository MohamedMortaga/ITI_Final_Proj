<template>
  <div class="min-h-screen bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-800)]">
    <!-- SearchBar Component -->
    <SearchBar :searchQuery="searchQuery" @update:searchQuery="updateSearchQuery" />

    <!-- Breadcrumbs -->
    <div class="max-w-7xl mx-auto px-4 py-4">
      <nav class="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]">
        <router-link
          to="/home"
          class="hover:text-[var(--color-success-500)] cursor-pointer transition-colors"
        >
          Home
        </router-link>
        <span class="mx-2">></span>
        <router-link
          to="/all-products?category=Furniture & DIY"
          class="hover:text-[var(--color-success-500)] cursor-pointer transition-colors"
        >
          Furniture & DIY
        </router-link>
        <span class="mx-2">></span>
        <router-link
          to="/all-products?category=DIY tools"
          class="hover:text-[var(--color-success-500)] cursor-pointer transition-colors"
        >
          DIY tools
        </router-link>
        <span class="mx-2">></span>
        <router-link
          :to="`/product/${route.params.id}`"
          class="text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] hover:text-[var(--color-success-500)] cursor-pointer transition-colors"
        >
          {{ product?.title }}
        </router-link>
        <span class="mx-2">></span>
        <span class="text-[var(--color-success-500)]">Rent confirmation</span>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column: Product Image -->
        <div class="space-y-6">
          <div
            class="bg-white dark:bg-[var(--color-gray-900)] rounded-xl shadow-lg overflow-hidden"
          >
            <img
              :src="product?.img || require('@/assets/logo.png')"
              alt="Product Image"
              class="w-full h-96 object-cover"
            />
          </div>
        </div>

        <!-- Right Column: Rental Details -->
        <div class="space-y-6">
          <div class="bg-white dark:bg-[var(--color-gray-900)] rounded-xl shadow-lg p-6">
            <h1
              class="text-2xl font-bold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-2"
            >
              {{ product?.title }}
            </h1>
            <p class="text-3xl font-bold text-[var(--color-success-500)] mb-6">
              {{ $t("egp") }} {{ product?.price || 0 }}/{{ $t("perDay") }}
            </p>

            <!-- Picked Dates -->
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <h3
                class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-3"
              >
                Picked Dates
              </h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span
                    class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
                    >From:</span
                  >
                  <span class="font-medium">{{
                    booking.startDate ? formatDate(booking.startDate) : "Not selected"
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span
                    class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
                    >To:</span
                  >
                  <span class="font-medium">{{
                    booking.endDate ? formatDate(booking.endDate) : "Not selected"
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Subtotal -->
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div class="flex justify-between items-center">
                <span
                  class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
                  >Subtotal:</span
                >
                <span class="text-2xl font-bold text-[var(--color-success-500)]">
                  {{ $t("egp") }} {{ calculateSubtotal() }}
                </span>
              </div>
              <p
                class="text-sm text-[var(--color-gray-500)] dark:text-[var(--color-gray-400)] mt-1"
              >
                ({{ $t("egp") }}{{ product?.price || 0 }} × {{ calculateDays() }}
                {{ $t("perDay") }})
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Method Section -->
      <div class="mt-8 bg-white dark:bg-[var(--color-gray-900)] rounded-xl shadow-lg p-6">
        <h2
          class="text-xl font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
        >
          Delivery method
        </h2>
        <div class="space-y-4">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              v-model="booking.deliveryMethod"
              value="pickup"
              class="text-[var(--color-success-500)] focus:ring-[var(--color-success-500)]"
            />
            <span class="text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
              >Pick up from owner</span
            >
          </label>
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              v-model="booking.deliveryMethod"
              value="delivery"
              class="text-[var(--color-success-500)] focus:ring-[var(--color-success-500)]"
            />
            <span class="text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
              >Deliver to my address</span
            >
          </label>
        </div>

        <div v-if="booking.deliveryMethod === 'delivery'" class="mt-4">
          <input
            v-model="booking.deliveryAddress"
            type="text"
            class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
            placeholder="Type your address here"
          />
        </div>
      </div>

      <!-- Personal Information Section -->
      <div class="mt-8 bg-white dark:bg-[var(--color-gray-900)] rounded-xl shadow-lg p-6">
        <h2
          class="text-xl font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
        >
          Personal information
        </h2>

        <div
          v-if="!auth.currentUser"
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
        >
          <p class="text-blue-800 dark:text-blue-200 mb-4 text-lg">
            Please Login/Sign up to complete the rent process
          </p>
          <div class="space-y-4">
            <button
              @click="router.push('/signup')"
              class="w-full bg-[var(--color-success-500)] text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-[var(--color-success-600)] transition-colors"
            >
              Sign up now!
            </button>
            <p
              class="text-center text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
            >
              Already have an account?
              <button
                @click="router.push('/login')"
                class="text-[var(--color-success-500)] hover:underline font-medium"
              >
                Login
              </button>
            </p>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                class="block text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] mb-2"
              >
                Name
              </label>
              <input
                v-model="booking.userName"
                type="text"
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                :placeholder="auth.currentUser?.displayName || 'Enter your name'"
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] mb-2"
              >
                Phone Number
              </label>
              <input
                v-model="booking.phoneNumber"
                type="tel"
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                placeholder="0102 219 4510"
                maxlength="14"
                @input="formatPhoneNumber"
                required
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] mb-2"
              >
                Email
              </label>
              <input
                v-model="booking.userEmail"
                type="email"
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                :placeholder="auth.currentUser?.email || 'Enter your email'"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Method Section -->
      <div class="mt-8 bg-white dark:bg-[var(--color-gray-900)] rounded-xl shadow-lg p-6">
        <h2
          class="text-xl font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
        >
          Payment method
        </h2>
        <div class="space-y-4">
          <select
            v-model="booking.paymentMethod"
            class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
            @change="resetPaymentFields"
          >
            <option value="vodafone_cash">Vodafone Cash</option>
            <option value="etisalat_wallet">Etisalat Wallet</option>
            <option value="credit_card">Credit Card</option>
          </select>

          <!-- Phone Number for Mobile Payment -->
          <div
            v-if="['vodafone_cash', 'etisalat_wallet'].includes(booking.paymentMethod)"
          >
            <label
              class="block text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] mb-2"
            >
              Phone Number
            </label>
            <input
              v-model="booking.phoneNumber"
              type="tel"
              class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
              placeholder="0102 219 4510"
              maxlength="14"
              @input="formatPhoneNumber"
              required
            />
          </div>

          <!-- Credit Card Details -->
          <div v-if="booking.paymentMethod === 'credit_card'" class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] mb-2"
              >
                Card Number
              </label>
              <input
                v-model="booking.cardNumber"
                type="text"
                @input="formatCardNumber"
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                placeholder="1234 5678 9012 3456"
                pattern="[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}"
              />
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] mb-2"
                >
                  Expiry Date
                </label>
                <input
                  v-model="booking.expiryDate"
                  type="text"
                  @input="formatExpiryDate"
                  class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                  placeholder="MM/YY"
                  pattern="(0[1-9]|1[0-2])/[0-9]{2}"
                />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] mb-2"
                >
                  CVV
                </label>
                <input
                  v-model="booking.cvv"
                  type="text"
                  @input="formatCvv"
                  class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                  placeholder="123"
                  pattern="[0-9]{3,4}"
                />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] mb-2"
                >
                  Card Holder Name
                </label>
                <input
                  v-model="booking.cardHolderName"
                  type="text"
                  class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                  placeholder="John Doe"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- OTP Form (Hidden by default) -->
      <div
        v-if="showOTPForm"
        class="mt-8 bg-white dark:bg-[var(--color-gray-900)] rounded-xl shadow-lg p-6"
      >
        <h2
          class="text-xl font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
        >
          Verify Payment
        </h2>
        <div class="space-y-4">
          <div>
            <label
              class="block text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] mb-2"
            >
              Enter OTP
            </label>
            <input
              v-model="booking.otp"
              type="text"
              @input="formatOtp"
              class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
              placeholder="123456"
              pattern="[0-9]{6}"
            />
            <p
              class="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)] mt-2"
            >
              OTP sent to {{ booking.phoneNumber }}
            </p>
          </div>
          <div class="flex space-x-4">
            <button
              @click="showOTPForm = false"
              class="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
            <button
              @click="verifyOTP"
              class="flex-1 bg-[var(--color-success-500)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[var(--color-success-600)] transition-colors"
            >
              Verify OTP
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Section -->
      <div class="mt-8 bg-white dark:bg-[var(--color-gray-900)] rounded-xl shadow-lg p-6">
        <h2
          class="text-xl font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
        >
          Summary
        </h2>
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <div
            class="flex justify-between items-center border-b border-dashed border-gray-300 dark:border-gray-600 pb-3"
          >
            <span class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
              >Tool:</span
            >
            <span class="font-medium">{{ product?.title }}</span>
          </div>
          <div
            class="flex justify-between items-center border-b border-dashed border-gray-300 dark:border-gray-600 pb-3"
          >
            <span class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
              >Owner:</span
            >
            <div class="flex items-center space-x-2">
              <span class="font-medium">{{ booking.sellerName }}</span>
              <i class="fas fa-check-circle text-[var(--color-success-500)]"></i>
            </div>
          </div>
          <div
            class="flex justify-between items-center border-b border-dashed border-gray-300 dark:border-gray-600 pb-3"
          >
            <span class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
              >Rental Days:</span
            >
            <span class="font-medium">{{ calculateDays() }}</span>
          </div>
          <div
            class="flex justify-between items-center border-b border-dashed border-gray-300 dark:border-gray-600 pb-3"
          >
            <span class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
              >Daily Rate:</span
            >
            <span class="font-medium">{{ $t("egp") }} {{ product?.price || 0 }}</span>
          </div>
          <div
            class="flex justify-between items-center border-b border-dashed border-gray-300 dark:border-gray-600 pb-3"
          >
            <span class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
              >Delivery Fee:</span
            >
            <span class="font-medium"
              >{{ $t("egp") }} {{ booking.deliveryFee.toFixed(2) }}</span
            >
          </div>
          <div class="flex justify-between items-center pt-3">
            <span
              class="text-xl font-bold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
              >Total amount:</span
            >
            <span class="text-2xl font-bold text-[var(--color-success-500)]"
              >{{ $t("egp") }} {{ booking.totalPrice.toFixed(2) }}</span
            >
          </div>
        </div>

        <!-- Action Button -->
        <div class="mt-6">
          <button
            @click="submitBooking"
            :disabled="!auth.currentUser || !booking.startDate || !booking.endDate"
            class="w-full bg-[var(--color-gray-800)] dark:bg-[var(--color-gray-700)] text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-[var(--color-gray-900)] dark:hover:bg-[var(--color-gray-600)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer
      class="bg-white dark:bg-[var(--color-gray-900)] border-t border-gray-200 dark:border-gray-700 mt-16"
    >
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Logo and Navigation -->
          <div class="col-span-1 md:col-span-2">
            <h3 class="text-2xl font-bold text-[var(--color-success-500)] mb-4">Rento</h3>
            <div
              class="flex space-x-6 text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
            >
              <a href="#" class="hover:text-[var(--color-success-500)]">Overview</a>
              <a href="#" class="hover:text-[var(--color-success-500)]">Features</a>
              <a href="#" class="hover:text-[var(--color-success-500)]">Pricing</a>
              <a href="#" class="hover:text-[var(--color-success-500)]">Careers</a>
              <a href="#" class="hover:text-[var(--color-success-500)]">Help</a>
              <a href="#" class="hover:text-[var(--color-success-500)]">Privacy</a>
            </div>
          </div>

          <!-- Newsletter -->
          <div class="col-span-1">
            <h4
              class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-3"
            >
              Stay up to date
            </h4>
            <div class="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
              />
              <button
                class="bg-[var(--color-success-500)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-success-600)] transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>

          <!-- Copyright and Legal -->
          <div class="col-span-1">
            <p
              class="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)] mb-3"
            >
              © 2077 Rento All rights reserved.
            </p>
            <div
              class="flex space-x-4 text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
            >
              <a href="#" class="hover:text-[var(--color-success-500)]">Terms</a>
              <a href="#" class="hover:text-[var(--color-success-500)]">Privacy</a>
              <a href="#" class="hover:text-[var(--color-success-500)]">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "@/firebase/config";
import Swal from "sweetalert2";
import SearchBar from "@/components/pages/SearchBar.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const product = ref(null);
const searchQuery = ref("");
const booking = ref({
  deliveryAddress: "30.0459°N, 31.2357°E",
  deliveryFee: 0,
  deliveryMethod: "pickup",
  startDate: "",
  endDate: "",
  productId: "",
  status: "pending",
  timestamp: serverTimestamp(),
  totalPrice: 0,
  userId: "",
  sellerId: "",
  sellerName: "",
  sellerImage: "",
  productTitle: "",
  productPrice: 0,
  userName: "",
  userEmail: "",
  paymentMethod: "vodafone_cash", // Default payment method
  phoneNumber: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  cardHolderName: "",
  otp: "",
});

const updateSearchQuery = (value) => {
  searchQuery.value = value;
};

const loadProduct = async () => {
  try {
    const id = route.params.id;
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      product.value = docSnap.data();
      booking.value.productId = id;
      booking.value.sellerId = product.value.sellerId || product.value.userId;
      booking.value.productTitle = product.value.title;
      booking.value.productPrice = parseFloat(product.value.price) || 0;
      await loadSellerDetails(booking.value.sellerId);
    } else {
      console.error("No such product!");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Product not found.",
        confirmButtonText: "OK",
      });
      router.push("/home");
    }
  } catch (error) {
    console.error("Error loading product:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Failed to load product: ${error.message}`,
      confirmButtonText: "OK",
    });
  }
};

const loadSellerDetails = async (sellerId) => {
  try {
    const userDocRef = doc(db, "users", sellerId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const sellerData = userDocSnap.data();
      booking.value.sellerName = sellerData.displayName || "Unknown Seller";
      booking.value.sellerImage = sellerData.imageUrl || "https://via.placeholder.com/40";
    } else {
      console.error("No such user!");
      booking.value.sellerName = "Unknown Seller";
      booking.value.sellerImage = "https://via.placeholder.com/40";
    }
  } catch (error) {
    console.error("Error loading seller details:", error);
    booking.value.sellerName = "Unknown Seller";
    booking.value.sellerImage = "https://via.placeholder.com/40";
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const calculateDays = () => {
  if (!booking.value.startDate || !booking.value.endDate) {
    return 0;
  }
  const start = new Date(booking.value.startDate);
  const end = new Date(booking.value.endDate);
  const diffTime = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diffTime + 1;
};

const calculateSubtotal = () => {
  if (!booking.value.startDate || !booking.value.endDate) {
    return 0;
  }
  const start = new Date(booking.value.startDate);
  const end = new Date(booking.value.endDate);
  const diffTime = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const basePrice = diffTime * booking.value.productPrice;
  return basePrice;
};

const resetPaymentFields = () => {
  booking.value.phoneNumber = "";
  booking.value.cardNumber = "";
  booking.value.expiryDate = "";
  booking.value.cvv = "";
  booking.value.cardHolderName = "";
  booking.value.otp = "";
};

const formatPhoneNumber = (event) => {
  let value = event.target.value.replace(/\D/g, "");
  let formatted = "";

  if (value.length > 3 && !value.startsWith("010") && !value.startsWith("011")) {
    value = ""; // Reset if it doesn't start with 010 or 011
    Swal.fire({
      icon: "warning",
      title: "Invalid Phone Number",
      text: "Please enter a valid phone number starting with 010 or 011.",
      confirmButtonText: "OK",
    });
  }

  if (value.length > 0) {
    formatted += value.slice(0, 4);
  }
  if (value.length > 4) {
    formatted += " " + value.slice(4, 7);
  }
  if (value.length > 7) {
    formatted += " " + value.slice(7, 11);
  }

  booking.value.phoneNumber = formatted.slice(0, 14);
};

const formatCardNumber = (event) => {
  let input = event.target.value.replace(/\D/g, "");
  if (input.length > 16) {
    input = input.slice(0, 16);
  }
  let output = "";
  if (input.length > 0) {
    output = input.slice(0, 4) + " ";
    if (input.length > 4) {
      output += input.slice(4, 8) + " ";
    }
    if (input.length > 8) {
      output += input.slice(8, 12) + " ";
    }
    if (input.length > 12) {
      output += input.slice(12, 16);
    }
  }
  event.target.value = output;
};

const formatExpiryDate = (event) => {
  let input = event.target.value.replace(/\D/g, "");
  if (input.length > 4) {
    input = input.slice(0, 4);
  }
  let output = "";
  if (input.length > 0) {
    output = input.slice(0, 2) + "/" + input.slice(2, 4);
  }
  event.target.value = output;
};

const formatCvv = (event) => {
  let input = event.target.value.replace(/\D/g, "");
  if (input.length > 4) {
    input = input.slice(0, 4);
  }
  event.target.value = input;
};

const formatOtp = (event) => {
  let input = event.target.value.replace(/\D/g, "");
  if (input.length > 6) {
    input = input.slice(0, 6);
  }
  event.target.value = input;
};

const showOTPForm = ref(false);

const verifyOTP = async () => {
  if (booking.value.otp.length !== 6) {
    Swal.fire({
      icon: "warning",
      title: "Invalid OTP",
      text: "Please enter a 6-digit OTP.",
      confirmButtonText: "OK",
    });
    return;
  }

  try {
    // Simulate OTP verification (replace with actual backend call in production)
    console.log("OTP verified successfully!");
    Swal.fire({
      icon: "success",
      title: "Payment Verified!",
      text: "Your payment has been successfully verified.",
      confirmButtonText: "OK",
    });
    // Directly call createBooking instead of submitBooking
    await createBooking();
  } catch (error) {
    console.error("Error verifying OTP:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Failed to verify OTP: ${error.message}`,
      confirmButtonText: "OK",
    });
  }
};

const submitBooking = async () => {
  if (!auth.currentUser) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please log in to make a booking.",
      confirmButtonText: "OK",
    });
    return;
  }

  try {
    if (!booking.value.startDate || !booking.value.endDate) {
      Swal.fire({
        icon: "warning",
        title: "Missing Dates",
        text: "Please select both start and end dates.",
        confirmButtonText: "OK",
      });
      return;
    }

    // Validate personal information
    if (
      !booking.value.userName ||
      !booking.value.phoneNumber ||
      !booking.value.userEmail
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all personal information fields.",
        confirmButtonText: "OK",
      });
      return;
    }

    // Validate payment method and details
    if (booking.value.paymentMethod === "credit_card") {
      if (
        !booking.value.cardNumber ||
        !booking.value.expiryDate ||
        !booking.value.cvv ||
        !booking.value.cardHolderName
      ) {
        Swal.fire({
          icon: "warning",
          title: "Missing Payment Details",
          text: "Please fill in all credit card details.",
          confirmButtonText: "OK",
        });
        return;
      }
      // For credit card, proceed directly to booking
      await createBooking();
    } else if (
      ["vodafone_cash", "etisalat_wallet"].includes(booking.value.paymentMethod)
    ) {
      if (!booking.value.phoneNumber) {
        Swal.fire({
          icon: "warning",
          title: "Missing Phone Number",
          text: "Please enter your phone number for mobile payment.",
          confirmButtonText: "OK",
        });
        return;
      }
      // Show OTP form for mobile payments
      showOTPForm.value = true;
      Swal.fire({
        icon: "info",
        title: "OTP Sent",
        text: `An OTP has been sent to ${booking.value.phoneNumber}. Please verify to complete the booking.`,
        confirmButtonText: "OK",
      });
      // Auto-fill OTP after 2 seconds for demo (remove in production)
      setTimeout(() => {
        booking.value.otp = "123456";
      }, 2000);
    }
  } catch (error) {
    console.error("Error processing booking:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Failed to process booking: ${error.message}`,
      confirmButtonText: "OK",
    });
  }
};
const createBooking = async () => {
  try {
    // Update product status to pending
    const productRef = doc(db, "products", booking.value.productId);
    await updateDoc(productRef, { status: "pending" });

    // Create booking
    booking.value.userId = auth.currentUser.uid;
    booking.value.timestamp = serverTimestamp();

    const bookingsRef = collection(db, "bookings");
    await setDoc(doc(bookingsRef), {
      ...booking.value,
      productTitle: product.value.title,
      productImage: product.value.img,
      sellerName: booking.value.sellerName,
    });

    Swal.fire({
      icon: "success",
      title: "Booking Confirmed!",
      text:
        "Your rental has been successfully confirmed. You will receive a confirmation email shortly.",
      confirmButtonText: "OK",
    }).then(() => {
      router.push("/home");
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Failed to create booking: ${error.message}`,
      confirmButtonText: "OK",
    });
  }
};

watch(
  [
    () => booking.value.deliveryMethod,
    () => booking.value.startDate,
    () => booking.value.endDate,
  ],
  () => {
    if (booking.value.startDate && booking.value.endDate) {
      const diffTime =
        Math.ceil(
          (new Date(booking.value.endDate) - new Date(booking.value.startDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1;
      const basePrice = diffTime * booking.value.productPrice;
      booking.value.deliveryFee =
        booking.value.deliveryMethod === "delivery" ? basePrice * 0.02 : 0;
      booking.value.totalPrice = basePrice + booking.value.deliveryFee;
    } else {
      booking.value.totalPrice = 0;
      booking.value.deliveryFee = 0;
    }
  }
);

onMounted(() => {
  loadProduct();

  // Get dates from route query parameters
  if (route.query.startDate) {
    booking.value.startDate = route.query.startDate;
  }
  if (route.query.endDate) {
    booking.value.endDate = route.query.endDate;
  }
});
</script>
