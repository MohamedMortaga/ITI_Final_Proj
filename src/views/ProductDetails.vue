<template>
  <div
    class="min-h-screen bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-800)] text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
  >
    <div
      v-if="product"
      class="max-w-4xl mx-auto p-6 bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-800)] rounded-2xl shadow-xl border border-[var(--color-success-200)] flex flex-col md:flex-row gap-6"
    >
      <!-- Product Image and Calendar -->
      <div class="md:w-1/2">
        <img
          :src="product.img || require('@/assets/logo.png')"
          alt="Product Image"
          class="w-full h-auto rounded-lg object-cover mb-4"
        />
        <div
          class="bg-[var(--color-gray-100)] p-4 rounded-lg dark:bg-[var(--color-gray-700)]"
        >
          <h3
            class="text-lg font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
          >
            {{ currentMonthYear }}
          </h3>
          <div class="grid grid-cols-7 gap-1 mt-2">
            <span
              v-for="day in daysInMonth"
              :key="day"
              class="text-center p-1 text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] cursor-pointer flex items-center justify-center"
              :class="{
                'bg-[var(--color-success-200)] rounded-full': isSelected(day),
                'cursor-not-allowed opacity-50': isPastDate(day),
              }"
              @click="selectDate(day)"
            >
              <span>{{ day }}</span>
              <span v-if="isStart(day)" class="ml-1 text-xs">s</span>
              <span v-if="isEnd(day)" class="ml-1 text-xs">e</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Product Info and Owner Details -->
      <div class="md:w-1/2 flex flex-col gap-4">
        <div>
          <h1
            class="text-2xl font-bold text-[var(--color-success-500)] dark:text-[var(--color-success-300)] mb-2"
          >
            {{ product.title }}
          </h1>
          <p class="text-[var(--color-gray-600)] mb-2 dark:text-[var(--color-gray-400)]">
            <span
              class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
              >Description:</span
            >
            {{ product.details }}
          </p>
          <div
            class="bg-[var(--color-gray-100)] p-4 rounded-lg dark:bg-[var(--color-gray-700)]"
          >
            <p class="text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]">
              <span
                class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                >Category:</span
              >
              {{ product.category || product.type }}
            </p>
            <p class="text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]">
              <span
                class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                >Model:</span
              >
              {{ product.model || "GSR 18V-50 Professional" }}
            </p>
            <p
              class="text-[var(--color-success-500)] font-bold dark:text-[var(--color-success-300)]"
            >
              <span
                class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                >Price per day:</span
              >
              {{ product.price || "15" }} EGP
            </p>
            <button
              @click="showBookingForm = true"
              class="w-full bg-[var(--color-success-500)] text-[var(--color-gray-25)] py-2 rounded-lg mt-2 hover:bg-[var(--color-success-600)] dark:bg-[var(--color-success-300)] dark:hover:bg-[var(--color-success-400)]"
            >
              Rent this tool
            </button>
          </div>
        </div>

        <!-- Owner Details -->
        <div
          class="bg-[var(--color-gray-100)] p-4 rounded-lg dark:bg-[var(--color-gray-700)]"
        >
          <h3
            class="text-lg font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
          >
            Owner details
          </h3>
          <div class="flex items-center gap-4 mt-2">
            <img
              src="https://via.placeholder.com/40"
              alt="Owner"
              class="w-10 h-10 rounded-full"
            />
            <div>
              <p class="text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]">
                {{ booking.sellerName || "Loading..." }}
              </p>
              <p
                class="text-sm text-[var(--color-gray-500)] dark:text-[var(--color-gray-400)]"
              >
                Member since March 2024
              </p>
              <p
                class="text-sm text-[var(--color-success-500)] dark:text-[var(--color-success-300)]"
              >
                55 successful rentals
              </p>
              <button
                class="mt-1 text-[var(--color-success-500)] text-sm dark:text-[var(--color-success-300)]"
              >
                Send a message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Form Modal -->
    <div
      v-if="showBookingForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-800)] p-6 rounded-lg shadow-xl w-full max-w-md h-[80vh] overflow-y-auto relative"
      >
        <button
          @click="showBookingForm = false"
          class="absolute top-2 right-2 text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] hover:text-[var(--color-gray-800)] dark:hover:text-[var(--color-gray-200)] text-2xl font-bold"
        >
          ×
        </button>
        <h2
          class="text-xl font-bold text-[var(--color-success-500)] dark:text-[var(--color-success-300)] mb-4"
        >
          Book This Product
        </h2>
        <form @submit.prevent="submitBooking" class="space-y-4">
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >Select Location on Map</label
            >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13804.134426744992!2d31.23572595!3d30.04598185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458157f7a7b9fb3%3A0x9c6c8a6e7e0c2e2e!2sCairo%2C%20Cairo%20Governorate%2C%20Egypt!5e0!3m2!1sen!2seg!4v1690367890123!5m2!1sen!2seg"
              width="100%"
              height="200"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
            <p
              class="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)] mt-2"
            >
              Edit the address or coordinates below.
            </p>
            <input
              v-model="booking.deliveryAddress"
              type="text"
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)] mt-2"
              placeholder="Enter address or coordinates (e.g., 30.0459°N, 31.2357°E)"
            />
            <p
              v-if="booking.deliveryMethod === 'delivery'"
              class="mt-2 text-[var(--color-success-500)] font-bold dark:text-[var(--color-success-300)]"
            >
              Delivery Fee: {{ booking.deliveryFee.toFixed(2) }} EGP (2% of total)
            </p>
          </div>
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >Delivery Method</label
            >
            <select
              v-model="booking.deliveryMethod"
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
              required
              @change="updateDeliveryFee"
            >
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >Start Date</label
            >
            <p
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
            >
              {{ booking.startDate ? formatDate(booking.startDate) : "Not selected" }}
            </p>
          </div>
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >End Date</label
            >
            <p
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
            >
              {{ booking.endDate ? formatDate(booking.endDate) : "Not selected" }}
            </p>
          </div>
          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="showBookingForm = false"
              class="bg-[var(--color-gray-400)] text-[var(--color-gray-25)] py-2 px-4 rounded-lg hover:bg-[var(--color-gray-500)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-[var(--color-success-500)] text-[var(--color-gray-25)] py-2 px-4 rounded-lg hover:bg-[var(--color-success-600)] dark:bg-[var(--color-success-300)] dark:hover:bg-[var(--color-success-400)]"
            >
              Submit Booking
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Website Review Form Modal -->
    <div
      v-if="showWebsiteReviewForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-800)] p-6 rounded-lg shadow-xl w-full max-w-md"
      >
        <button
          @click="showWebsiteReviewForm = false"
          class="absolute top-2 right-2 text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] hover:text-[var(--color-gray-800)] dark:hover:text-[var(--color-gray-200)] text-2xl font-bold"
        >
          ×
        </button>
        <h2
          class="text-xl font-bold text-[var(--color-success-500)] dark:text-[var(--color-success-300)] mb-4"
        >
          Rate Our Website
        </h2>
        <form @submit.prevent="submitWebsiteReview" class="space-y-4">
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >Review</label
            >
            <textarea
              v-model="newWebsiteReview.review"
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
              placeholder="Write your review about our website"
              required
            ></textarea>
          </div>
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >Rate (1 - 5)</label
            >
            <input
              v-model.number="newWebsiteReview.rate"
              type="range"
              min="1"
              max="5"
              step="1"
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
              required
            />
            <span class="ml-2">{{ newWebsiteReview.rate }} ★★★★★</span>
          </div>
          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="showWebsiteReviewForm = false"
              class="bg-[var(--color-gray-400)] text-[var(--color-gray-25)] py-2 px-4 rounded-lg hover:bg-[var(--color-gray-500)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-[var(--color-success-500)] text-[var(--color-gray-25)] py-2 px-4 rounded-lg hover:bg-[var(--color-success-600)] dark:bg-[var(--color-success-300)] dark:hover:bg-[var(--color-success-400)]"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tool Reviews -->
    <div
      v-if="product"
      class="mt-6 max-w-4xl mx-auto p-6 bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-800)] rounded-2xl shadow-xl border border-[var(--color-success-200)]"
    >
      <h3
        class="text-lg font-semibold text-[var(--color-gray-800)] mb-4 dark:text-[var(--color-gray-200)]"
      >
        Tool reviews
      </h3>
      <div class="space-y-4">
        <div
          v-for="review in reviews"
          :key="review.id"
          class="p-4 bg-white rounded-lg shadow"
        >
          <p class="text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]">
            "{{ review.review }}" - {{ review.userName || review.rentUserId }}
          </p>
          <div class="flex items-center gap-1">
            <!-- Full stars -->
            <span
              v-for="i in Math.floor(review.rate)"
              :key="'full-' + review.id + '-' + i"
              class="inline-block w-4 h-4 text-[var(--color-warning-500)]"
            >
              ★
            </span>
            <!-- Empty stars -->
            <span
              v-for="i in 5 - Math.floor(review.rate)"
              :key="'empty-' + review.id + '-' + i"
              class="inline-block w-4 h-4 text-[var(--color-gray-400)]"
            >
              ★
            </span>
            <span
              class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)] ml-2"
              >{{ review.rate }}</span
            >
          </div>
        </div>
      </div>
      <button
        @click="showReviewForm = true"
        class="mt-4 text-[var(--color-success-500)] text-sm dark:text-[var(--color-success-300)]"
      >
        Add a review
      </button>
    </div>

    <!-- Add Review Form Modal -->
    <div
      v-if="showReviewForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-800)] p-6 rounded-lg shadow-xl w-full max-w-md"
      >
        <button
          @click="showReviewForm = false"
          class="absolute top-2 right-2 text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] hover:text-[var(--color-gray-800)] dark:hover:text-[var(--color-gray-200)] text-2xl font-bold"
        >
          ×
        </button>
        <h2
          class="text-xl font-bold text-[var(--color-success-500)] dark:text-[var(--color-success-300)] mb-4"
        >
          Add a Review
        </h2>
        <form @submit.prevent="submitReview" class="space-y-4">
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >Review</label
            >
            <textarea
              v-model="newReview.review"
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
              placeholder="Write your review"
              required
            ></textarea>
          </div>
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >Rate (1 - 5)</label
            >
            <input
              v-model.number="newReview.rate"
              type="range"
              min="1"
              max="5"
              step="1"
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
              required
            />
            <span class="ml-2">{{ newReview.rate }} ★★★★★</span>
          </div>
          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="showReviewForm = false"
              class="bg-[var(--color-gray-400)] text-[var(--color-gray-25)] py-2 px-4 rounded-lg hover:bg-[var(--color-gray-500)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-[var(--color-success-500)] text-[var(--color-gray-25)] py-2 px-4 rounded-lg hover:bg-[var(--color-success-600)] dark:bg-[var(--color-success-300)] dark:hover:bg-[var(--color-success-400)]"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- More from Owner -->
    <div
      v-if="product"
      class="mt-6 max-w-4xl mx-auto p-6 bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-800)] rounded-2xl shadow-xl border border-[var(--color-success-200)]"
    >
      <h3
        class="text-lg font-semibold text-[var(--color-gray-800)] mb-4 dark:text-[var(--color-gray-200)]"
      >
        More from {{ booking.sellerName || "Loading..." }}
      </h3>
      <div class="grid grid-cols-2 gap-4">
        <div
          class="bg-[var(--color-gray-100)] p-4 rounded-lg dark:bg-[var(--color-gray-700)]"
        >
          <img
            src="https://via.placeholder.com/100"
            alt="Camera"
            class="w-full h-24 object-cover rounded-lg"
          />
          <p class="text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mt-2">
            Canon EOS R5
          </p>
          <p
            class="text-[var(--color-success-500)] font-bold dark:text-[var(--color-success-300)]"
          >
            500 EGP
          </p>
          <div class="flex items-center gap-2 text-[var(--color-warning-500)]">
            <span>★★★★☆</span>
            <span
              class="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
              >4</span
            >
          </div>
          <button
            class="w-full bg-[var(--color-success-500)] text-[var(--color-gray-25)] py-2 rounded-lg mt-2 hover:bg-[var(--color-success-600)] dark:bg-[var(--color-success-300)] dark:hover:bg-[var(--color-success-400)]"
          >
            Rent now
          </button>
        </div>
        <div
          class="bg-[var(--color-gray-100)] p-4 rounded-lg dark:bg-[var(--color-gray-700)]"
        >
          <img
            src="https://via.placeholder.com/100"
            alt="Camera"
            class="w-full h-24 object-cover rounded-lg"
          />
          <p class="text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mt-2">
            Canon EOS R6
          </p>
          <p
            class="text-[var(--color-success-500)] font-bold dark:text-[var(--color-success-300)]"
          >
            600 EGP
          </p>
          <div class="flex items-center gap-2 text-[var(--color-warning-500)]">
            <span>★★★★☆</span>
            <span
              class="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
              >4</span
            >
          </div>
          <button
            class="w-full bg-[var(--color-success-500)] text-[var(--color-gray-25)] py-2 px-4 rounded-lg mt-2 hover:bg-[var(--color-success-600)] dark:bg-[var(--color-success-300)] dark:hover:bg-[var(--color-success-400)]"
          >
            Rent now
          </button>
        </div>
      </div>
      <button
        class="mt-4 text-[var(--color-success-500)] text-sm dark:text-[var(--color-success-300)]"
      >
        view all items
      </button>
    </div>

    <div
      v-else
      class="text-center text-[var(--color-gray-500)] py-10 text-lg dark:text-[var(--color-gray-400)]"
    >
      Loading product...
    </div>
    <router-link
      to="/home"
      class="mt-6 inline-block text-[var(--color-success-500)] hover:underline text-sm dark:text-[var(--color-success-300)]"
      >← Back to Products</router-link
    >
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed, nextTick } from "vue";
import { useRoute } from "vue-router";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "@/firebase/config";
import Swal from "sweetalert2";

const route = useRoute();
const product = ref(null);
const showBookingForm = ref(false);
const showReviewForm = ref(false);
const showWebsiteReviewForm = ref(false);
const reviews = ref([]);
const booking = ref({
  deliveryAddress: "30.0459°N, 31.2357°E",
  deliveryFee: 0,
  deliveryMethod: "delivery",
  startDate: "",
  endDate: "",
  productId: "",
  status: "pending",
  timestamp: serverTimestamp(),
  totalPrice: 0,
  userId: "",
  sellerId: "",
  sellerName: "",
  productTitle: "",
  productPrice: 0,
});
const newReview = ref({
  review: "",
  rate: 1,
  sellerUserId: "",
  rentUserId: "",
  userName: "",
});
const newWebsiteReview = ref({
  review: "",
  rate: 1,
  userId: "",
  userName: "",
  userImage: "", // Added to store the user image
});

// Current date handling
const today = ref(new Date("2025-07-20T04:07:00Z")); // Updated to 07:07 AM EEST (UTC+3)
const currentDate = ref(new Date("2025-07-20T04:07:00Z"));
const selectedDates = ref({ start: null, end: null });

// Computed properties for dynamic calendar
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleString("en-US", { month: "long", year: "numeric" });
});

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  return new Date(year, month + 1, 0).getDate(); // Get the last day of the month
});

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
    }
  } catch (error) {
    console.error("Error loading product:", error);
  }
};

const loadSellerDetails = async (sellerId) => {
  try {
    const userDocRef = doc(db, "users", sellerId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const sellerData = userDocSnap.data();
      booking.value.sellerName = sellerData.displayName || "Unknown Seller";
      newReview.value.sellerUserId = sellerId;
    } else {
      console.error("No such user!");
      booking.value.sellerName = "Unknown Seller";
    }
  } catch (error) {
    console.error("Error loading seller details:", error);
    booking.value.sellerName = "Unknown Seller";
  }
};

const loadReviews = () => {
  const reviewsRef = collection(db, "user-reviews");
  const unsubscribe = onSnapshot(
    reviewsRef,
    async (snapshot) => {
      const reviewPromises = snapshot.docs.map(async (docSnap) => {
        const reviewData = { id: docSnap.id, ...docSnap.data() };
        if (reviewData.productId === route.params.id) {
          const userRef = doc(db, "users", reviewData.rentUserId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            reviewData.userName = userSnap.data().displayName || reviewData.rentUserId;
          } else {
            reviewData.userName = reviewData.rentUserId;
          }
        }
        return reviewData;
      });
      const allReviews = await Promise.all(reviewPromises);
      reviews.value = allReviews.filter((review) => review.productId === route.params.id);
    },
    (error) => {
      console.error("Error loading reviews:", error);
    }
  );
  return unsubscribe;
};

const isSelected = (day) => {
  const date = `${currentDate.value.getFullYear()}-${String(
    currentDate.value.getMonth() + 1
  ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return date === selectedDates.value.start || date === selectedDates.value.end;
};

const isStart = (day) => {
  const date = `${currentDate.value.getFullYear()}-${String(
    currentDate.value.getMonth() + 1
  ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return date === selectedDates.value.start;
};

const isEnd = (day) => {
  const date = `${currentDate.value.getFullYear()}-${String(
    currentDate.value.getMonth() + 1
  ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return date === selectedDates.value.end;
};

const isPastDate = (day) => {
  const selectedDate = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    day
  );
  const todayDate = new Date(today.value);
  todayDate.setHours(0, 0, 0, 0);
  return selectedDate < todayDate;
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

const selectDate = (day) => {
  if (isPastDate(day)) return;

  const selectedDate = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    day
  );
  const selectedIso = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1
  ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  if (!selectedDates.value.start) {
    selectedDates.value.start = selectedIso;
    booking.value.startDate = selectedIso;
  } else if (!selectedDates.value.end) {
    if (new Date(selectedIso) >= new Date(selectedDates.value.start)) {
      selectedDates.value.end = selectedIso;
      booking.value.endDate = selectedIso;
    } else {
      Swal.fire({
        icon: "warning",
        title: "Invalid Date",
        text: "End date must be after start date.",
        confirmButtonText: "OK",
      });
    }
  } else {
    selectedDates.value.start = selectedIso;
    selectedDates.value.end = null;
    booking.value.startDate = selectedIso;
    booking.value.endDate = "";
  }
};

const updateDeliveryFee = () => {
  if (!booking.value.startDate || !booking.value.endDate) {
    booking.value.deliveryFee = 0;
    return;
  }
  if (booking.value.deliveryMethod === "pickup") {
    booking.value.deliveryFee = 0;
  } else {
    const diffTime = Math.ceil(
      (new Date(booking.value.endDate) - new Date(booking.value.startDate)) /
        (1000 * 60 * 60 * 24)
    );
    const basePrice = diffTime * booking.value.productPrice;
    booking.value.deliveryFee = basePrice * 0.02;
  }
};

watch(
  [
    () => booking.value.deliveryMethod,
    () => booking.value.startDate,
    () => booking.value.endDate,
  ],
  () => {
    updateDeliveryFee();
    if (booking.value.startDate && booking.value.endDate) {
      const diffTime =
        Math.ceil(
          (new Date(booking.value.endDate) - new Date(booking.value.startDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1;
      const basePrice = diffTime * booking.value.productPrice;
      booking.value.totalPrice = basePrice + booking.value.deliveryFee;
    } else {
      booking.value.totalPrice = 0;
    }
  }
);

const checkFirstBooking = async (userId) => {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size === 1; // Returns true if this is the user's first booking
  } catch (error) {
    console.error("Error checking bookings:", error);
    return false;
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
        text: "Please select both start and end dates",
        confirmButtonText: "OK",
      });
      return;
    }

    const start = new Date(booking.value.startDate);
    const end = new Date(booking.value.endDate);
    const diffTime = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const basePrice = diffTime * booking.value.productPrice;
    booking.value.deliveryFee =
      booking.value.deliveryMethod === "delivery" ? basePrice * 0.02 : 0;
    booking.value.totalPrice = basePrice + booking.value.deliveryFee;
    booking.value.userId = auth.currentUser.uid;
    booking.value.timestamp = serverTimestamp();

    const bookingsRef = collection(db, "bookings");
    await setDoc(doc(bookingsRef), {
      ...booking.value,
      productTitle: product.value.title,
      productImage: product.value.img,
      sellerName: booking.value.sellerName,
    });

    showBookingForm.value = false;

    // Check if this is the user's first booking
    const isFirstBooking = await checkFirstBooking(auth.currentUser.uid);
    if (isFirstBooking) {
      showWebsiteReviewForm.value = true;
    }

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Booking submitted successfully!",
      confirmButtonText: "OK",
    });
  } catch (error) {
    console.error("Full error details:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Failed to submit booking: ${error.message}`,
      confirmButtonText: "OK",
    });
  }
};

const submitReview = async () => {
  if (!auth.currentUser) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please log in to add a review.",
      confirmButtonText: "OK",
    });
    return;
  }

  try {
    newReview.value.rentUserId = auth.currentUser.uid;
    newReview.value.productId = route.params.id;
    newReview.value.userName =
      auth.currentUser.displayName || auth.currentUser.email.split("@")[0] || "Anonymous";
    const productRef = doc(db, "products", newReview.value.productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      newReview.value.sellerUserId =
        productSnap.data().sellerId || productSnap.data().userId || "-";
    } else {
      console.error("Product not found for review!");
      newReview.value.sellerUserId = "-";
    }
    if (
      !Number.isInteger(newReview.value.rate) ||
      newReview.value.rate < 1 ||
      newReview.value.rate > 5
    ) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Rating",
        text: "Rate must be a whole number between 1 and 5.",
        confirmButtonText: "OK",
      });
      return;
    }
    const reviewsRef = collection(db, "user-reviews");
    await setDoc(doc(reviewsRef), {
      ...newReview.value,
      timestamp: serverTimestamp(),
    });

    await loadReviews();
    await nextTick();
    newReview.value.review = "";
    newReview.value.rate = 1;
    showReviewForm.value = false;
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Review submitted successfully!",
      confirmButtonText: "OK",
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Failed to submit review: ${error.message}`,
      confirmButtonText: "OK",
    });
  }
};

const submitWebsiteReview = async () => {
  if (!auth.currentUser) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please log in to add a website review.",
      confirmButtonText: "OK",
    });
    return;
  }

  try {
    newWebsiteReview.value.userId = auth.currentUser.uid;
    newWebsiteReview.value.userName =
      auth.currentUser.displayName || auth.currentUser.email.split("@")[0] || "Anonymous";
    // Add user image, fallback to default.png if no photoURL
    newWebsiteReview.value.userImage =
      auth.currentUser.photoURL || require("@/assets/default.png");

    if (
      !Number.isInteger(newWebsiteReview.value.rate) ||
      newWebsiteReview.value.rate < 1 ||
      newWebsiteReview.value.rate > 5
    ) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Rating",
        text: "Rate must be a whole number between 1 and 5.",
        confirmButtonText: "OK",
      });
      return;
    }
    const webReviewsRef = collection(db, "web-reviews");
    await setDoc(doc(webReviewsRef), {
      ...newWebsiteReview.value,
      timestamp: serverTimestamp(),
    });

    newWebsiteReview.value.review = "";
    newWebsiteReview.value.rate = 1;
    newWebsiteReview.value.userImage = ""; // Reset image
    showWebsiteReviewForm.value = false;
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Website review submitted successfully! Thank you for your feedback.",
      confirmButtonText: "OK",
    });
  } catch (error) {
    console.error("Error submitting website review:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Failed to submit website review: ${error.message}`,
      confirmButtonText: "OK",
    });
  }
};

onMounted(() => {
  loadProduct();
  loadReviews();
  today.value = new Date(); // Dynamically set to current date and time
  today.value.setHours(0, 0, 0, 0); // Reset to midnight for day-only comparison
});
</script>

<style scoped>
/* No half-star styling needed */
</style>
