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
          <div class="flex justify-between items-center mb-2">
            <button
              @click="prevMonth"
              :disabled="!canGoToPrevMonth"
              class="text-[var(--color-success-500)] dark:text-[var(--color-success-300)] hover:text-[var(--color-success-600)] dark:hover:text-[var(--color-success-400)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous Month
            </button>
            <h3
              class="text-lg font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
            >
              {{ currentMonthYear }}
            </h3>
            <button
              @click="nextMonth"
              class="text-[var(--color-success-500)] dark:text-[var(--color-success-300)] hover:text-[var(--color-success-600)] dark:hover:text-[var(--color-success-400)]"
            >
              Next Month →
            </button>
          </div>
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
              >{{ $t("description") }}:</span
            >
            {{ product.details }}
          </p>
          <div
            class="bg-[var(--color-gray-100)] p-4 rounded-lg dark:bg-[var(--color-gray-700)]"
          >
            <p class="text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]">
              <span
                class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                >{{ $t("category") }}:</span
              >
              {{ product.category || product.type }}
            </p>
            <p class="text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]">
              <span
                class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                >{{ $t("model") }}:</span
              >
              {{ product.model || "GSR 18V-50 Professional" }}
            </p>
            <p
              class="text-[var(--color-success-500)] font-bold dark:text-[var(--color-success-300)]"
            >
              <span
                class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                >{{ $t("pricePerDay") }}:</span
              >
              {{ product.price || "15" }} {{ $t("egp") }}
            </p>
            <button
              @click="showBookingForm = true"
              class="w-full bg-[var(--color-success-500)] text-[var(--color-gray-25)] py-2 rounded-lg mt-2 hover:bg-[var(--color-success-600)] dark:bg-[var(--color-success-300)] dark:hover:bg-[var(--color-success-400)]"
            >
              {{ $t("rentThisTool") }}
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
            {{ $t("ownerDetails") }}
          </h3>
          <div class="flex items-center gap-4 mt-2">
            <img
              :src="booking.sellerImage || require('@/assets/default.png')"
              alt="Owner"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p class="text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]">
                {{ booking.sellerName || $t("loading") }}
              </p>
              <p
                class="text-sm text-[var(--color-gray-500)] dark:text-[var(--color-gray-400)]"
              >
                {{ $t("memberSince") }} {{ $t("march2024") }}
              </p>
              <p
                class="text-sm text-[var(--color-success-500)] dark:text-[var(--color-success-300)]"
              >
                55 {{ $t("successfulRentals") }}
              </p>
              <button
                class="mt-1 text-[var(--color-success-500)] text-sm dark:text-[var(--color-success-300)]"
              >
                {{ $t("sendMessage") }}
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
          {{ $t("bookThisProduct") }}
        </h2>
        <form v-if="!showOTPForm" @submit.prevent="submitBooking" class="space-y-4">
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >{{ $t("selectLocation") }}</label
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
              {{ $t("editAddress") }}
            </p>
            <input
              v-model="booking.deliveryAddress"
              type="text"
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)] mt-2"
              :placeholder="$t('enterAddressPlaceholder')"
            />
            <p
              v-if="booking.deliveryMethod === 'delivery'"
              class="mt-2 text-[var(--color-success-500)] font-bold dark:text-[var(--color-success-300)]"
            >
              {{ $t("deliveryFee") }}: {{ booking.deliveryFee.toFixed(2) }}
              {{ $t("egp") }} (2% of total)
            </p>
          </div>
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >{{ $t("deliveryMethod") }}</label
            >
            <select
              v-model="booking.deliveryMethod"
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
              required
              @change="updateDeliveryFee"
            >
              <option value="delivery">{{ $t("delivery") }}</option>
              <option value="pickup">{{ $t("pickup") }}</option>
            </select>
          </div>
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >{{ $t("startDate") }}</label
            >
            <p
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
            >
              {{ booking.startDate ? formatDate(booking.startDate) : $t("notSelected") }}
            </p>
          </div>
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >{{ $t("endDate") }}</label
            >
            <p
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
            >
              {{ booking.endDate ? formatDate(booking.endDate) : $t("notSelected") }}
            </p>
          </div>
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >{{ $t("paymentMethod") }}</label
            >
            <select
              v-model="booking.paymentMethod"
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
              required
              @change="resetPaymentFields"
            >
              <option value="vodafone_cash">Vodafone Cash</option>
              <option value="etisalat_wallet">Etisalat Wallet</option>
              <option value="credit_card">Credit Card</option>
            </select>
          </div>
          <div
            v-if="
              booking.paymentMethod === 'vodafone_cash' ||
              booking.paymentMethod === 'etisalat_wallet'
            "
          >
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >{{ $t("phoneNumber") }}</label
            >
            <input
              v-model="booking.phoneNumber"
              type="tel"
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
              placeholder="+2010XXXXXXXX"
              pattern="^\+20[0-9]{10}$"
              required
            />
          </div>
          <div v-if="booking.paymentMethod === 'credit_card'" class="space-y-4">
            <div>
              <label
                class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
                >{{ $t("cardNumber") }}</label
              >
              <input
                v-model="booking.cardNumber"
                type="text"
                @input="formatCardNumber"
                class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
                placeholder="1234 5678 9012 3456"
                pattern="[0-9]{13,19}"
                required
              />
            </div>
            <div class="flex gap-4">
              <div class="flex-1">
                <label
                  class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
                  >{{ $t("expiryDate") }}</label
                >
                <input
                  v-model="booking.expiryDate"
                  type="text"
                  @input="formatExpiryDate"
                  class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
                  placeholder="MM/YY"
                  pattern="(0[1-9]|1[0-2])/[0-9]{2}"
                  required
                />
              </div>
              <div class="flex-1">
                <label
                  class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
                  >{{ $t("cvv") }}</label
                >
                <input
                  v-model="booking.cvv"
                  type="text"
                  @input="formatCvv"
                  class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
                  placeholder="123"
                  pattern="[0-9]{3,4}"
                  required
                />
              </div>
            </div>
            <div>
              <label
                class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
                >{{ $t("cardHolderName") }}</label
              >
              <input
                v-model="booking.cardHolderName"
                type="text"
                class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
                placeholder="John Doe"
                required
              />
            </div>
          </div>
          <div>
            <p
              class="mt-2 text-[var(--color-success-500)] font-bold dark:text-[var(--color-success-300)]"
            >
              {{ $t("totalPrice") }}: {{ booking.totalPrice.toFixed(2) }} {{ $t("egp") }}
            </p>
          </div>
          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="showBookingForm = false"
              class="bg-[var(--color-gray-400)] text-[var(--color-gray-25)] py-2 px-4 rounded-lg hover:bg-[var(--color-gray-500)]"
            >
              {{ $t("cancel") }}
            </button>
            <button
              type="submit"
              class="bg-[var(--color-success-500)] text-[var(--color-gray-25)] py-2 px-4 rounded-lg hover:bg-[var(--color-success-600)] dark:bg-[var(--color-success-300)] dark:hover:bg-[var(--color-success-400)]"
            >
              {{ $t("proceedToPayment") }}
            </button>
          </div>
        </form>
        <!-- OTP Form -->
        <form v-else @submit.prevent="verifyOTP" class="space-y-4">
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >{{ $t("enterOTP") }}</label
            >
            <input
              v-model="booking.otp"
              type="text"
              @input="formatOtp"
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
              placeholder="123456"
              pattern="[0-9]{6}"
              required
            />
            <p
              class="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)] mt-2"
            >
              {{ $t("otpSentTo") }} {{ booking.phoneNumber }}
            </p>
            <p
              class="mt-2 text-[var(--color-success-500)] font-bold dark:text-[var(--color-success-300)]"
            >
              {{ $t("totalPrice") }}: {{ booking.totalPrice.toFixed(2) }} {{ $t("egp") }}
            </p>
          </div>
          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="showOTPForm = false"
              class="bg-[var(--color-gray-400)] text-[var(--color-gray-25)] py-2 px-4 rounded-lg hover:bg-[var(--color-gray-500)]"
            >
              {{ $t("back") }}
            </button>
            <button
              type="submit"
              class="bg-[var(--color-success-500)] text-[var(--color-gray-25)] py-2 px-4 rounded-lg hover:bg-[var(--color-success-600)] dark:bg-[var(--color-success-300)] dark:hover:bg-[var(--color-success-400)]"
            >
              {{ $t("verifyOTP") }}
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
          {{ $t("rateOurWebsite") }}
        </h2>
        <form @submit.prevent="submitWebsiteReview" class="space-y-4">
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >{{ $t("review") }}</label
            >
            <textarea
              v-model="newWebsiteReview.review"
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
              :placeholder="$t('writeWebsiteReview')"
              required
            ></textarea>
          </div>
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >{{ $t("rate") }} (1 - 5)</label
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
              {{ $t("cancel") }}
            </button>
            <button
              type="submit"
              class="bg-[var(--color-success-500)] text-[var(--color-gray-25)] py-2 px-4 rounded-lg hover:bg-[var(--color-success-600)] dark:bg-[var(--color-success-300)] dark:hover:bg-[var(--color-success-400)]"
            >
              {{ $t("submitReview") }}
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
        {{ $t("toolReviews") }}
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
            <span
              v-for="i in Math.floor(review.rate)"
              :key="'full-' + review.id + '-' + i"
              class="inline-block w-4 h-4 text-[var(--color-warning-500)]"
            >
              ★
            </span>
            <span
              v-for="i in 5 - Math.floor(review.rate)"
              :key="'empty-' + review.id + '-' + i"
              class="inline-block w-4 h-4 text-[var(--color-gray-400)]"
            >
              ★
            </span>
            <span
              class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)] ml-2"
            >
              {{ review.rate }}
            </span>
          </div>
        </div>
      </div>
      <button
        @click="showReviewForm = true"
        class="mt-4 text-[var(--color-success-500)] text-sm dark:text-[var(--color-success-300)]"
      >
        {{ $t("addAReview") }}
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
          {{ $t("addAReview") }}
        </h2>
        <form @submit.prevent="submitReview" class="space-y-4">
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >{{ $t("review") }}</label
            >
            <textarea
              v-model="newReview.review"
              class="w-full p-2 rounded-lg bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)] border border-[var(--color-success-200)]"
              :placeholder="$t('writeReview')"
              required
            ></textarea>
          </div>
          <div>
            <label
              class="block text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >{{ $t("rate") }} (1 - 5)</label
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
              {{ $t("cancel") }}
            </button>
            <button
              type="submit"
              class="bg-[var(--color-success-500)] text-[var(--color-gray-25)] py-2 px-4 rounded-lg hover:bg-[var(--color-success-600)] dark:bg-[var(--color-success-300)] dark:hover:bg-[var(--color-success-400)]"
            >
              {{ $t("submitReview") }}
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
        {{ $t("moreFrom") }} {{ booking.sellerName || $t("loading") }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="item in showAllProducts ? ownerProducts : ownerProducts.slice(0, 2)"
          :key="item.id"
          class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl shadow-sm flex flex-col transition hover:shadow-lg"
          :class="{ 'dir-rtl': $i18n.locale === 'ar' }"
        >
          <img
            :src="item.img || require('@/assets/test.png')"
            alt="product image"
            class="w-full h-40 object-cover rounded-t-xl"
          />
          <div class="p-4 flex flex-col flex-1">
            <h2
              class="pb-4 text-base font-bold text-[var(--Color-Text-Text-Brand)] truncate"
            >
              {{ item.title || "Untitled" }}
            </h2>
            <div
              class="mt-2 flex items-center justify-between text-xs text-[var(--Color-Text-Text-Secondary)] mb-1 pb-2"
              :class="{ 'flex-row-reverse': $i18n.locale === 'ar' }"
              :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
            >
              <div class="flex items-center">
                <i class="fa-solid fa-location-dot mr-1"></i>
                {{ item.location || $t("defaultLocation") }}
              </div>
              <div
                class="flex items-center text-sm font-semibold text-[var(--Color-Text-Text-Primary)]"
              >
                <i class="fa-solid fa-star text-yellow-400 mr-1"></i>
                <span>{{ item.rating || "0" }}</span>
              </div>
            </div>
            <div
              class="flex items-center justify-between h-full mb-2"
              :class="{ 'flex-row-reverse': $i18n.locale === 'ar' }"
              :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
            >
              <div class="text-sm font-semibold text-[var(--Color-Text-Text-Primary)]">
                {{ $i18n.locale === "ar" ? "ج.م" : "EGP" }} {{ item.price || "0" }}
              </div>
              <div class="text-sm font-semibold text-[var(--Color-Text-Text-Primary)]">
                {{ $t("perDay") }}
              </div>
            </div>
            <div class="mt-4">
              <button
                @click="navigateToProduct(item.id)"
                class="rounded-xl block w-full text-center bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-4 py-2 rounded font-semibold text-sm transition hover:bg-[var(--Color-Text-Text-Brand)] hover:text-white"
                :aria-label="`View details for ${item.title || 'Untitled'}`"
              >
                {{ $t("rentItem") }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        @click="showAllProducts = !showAllProducts"
        class="mt-4 text-[var(--color-success-500)] text-sm dark:text-[var(--color-success-300)] hover:underline"
      >
        {{ showAllProducts ? $t("showLess") : $t("viewAllItems") }}
      </button>
    </div>

    <div
      v-else
      class="text-center text-[var(--color-gray-500)] py-10 text-lg dark:text-[var(--color-gray-400)]"
    >
      {{ $t("loadingProduct") }}
    </div>
    <router-link
      to="/home"
      class="mt-6 inline-block text-[var(--color-success-500)] hover:underline text-sm dark:text-[var(--color-success-300)]"
    >
      {{ $t("backToProducts") }}
    </router-link>
  </div>
</template>
<script setup>
import { onMounted, ref, watch, computed, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n"; // Import useI18n
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
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "@/firebase/config";
import Swal from "sweetalert2";

// Initialize i18n
const { t } = useI18n(); // Use useI18n to get the t function
const showAllProducts = ref(false);
const route = useRoute();
const router = useRouter();
const product = ref(null);
const showBookingForm = ref(false);
const showReviewForm = ref(false);
const showWebsiteReviewForm = ref(false);
const showOTPForm = ref(false);
const reviews = ref([]);
const ownerProducts = ref([]);
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
  sellerImage: "",
  productTitle: "",
  productPrice: 0,
  paymentMethod: "vodafone_cash",
  phoneNumber: "",
  otp: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  cardHolderName: "",
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
  userImage: "",
});

// Current date handling
const today = ref(new Date());
const currentDate = ref(new Date());

// Computed properties for dynamic calendar
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
});

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  return new Date(year, month + 1, 0).getDate();
});

const canGoToPrevMonth = computed(() => {
  const prevMonth = new Date(currentDate.value);
  prevMonth.setMonth(currentDate.value.getMonth() - 1);
  const currentMonth = new Date(today.value.getFullYear(), today.value.getMonth(), 1);
  return prevMonth >= currentMonth;
});

const prevMonth = () => {
  if (canGoToPrevMonth.value) {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1,
      1
    );
  }
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
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
      await loadOwnerProducts(booking.value.sellerId);
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
      booking.value.sellerImage = sellerData.imageUrl || "https://via.placeholder.com/40";
      newReview.value.sellerUserId = sellerId;
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

const loadOwnerProducts = async (sellerId) => {
  try {
    console.log("Loading owner products for sellerId:", sellerId);
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("userId", "==", sellerId));
    const querySnapshot = await getDocs(q);
    console.log("Query returned", querySnapshot.docs.length, "documents");

    if (querySnapshot.empty) {
      const fallbackQ = query(
        productsRef,
        where("ownerName", "==", booking.value.sellerName)
      );
      const fallbackSnapshot = await getDocs(fallbackQ);
      console.log("Fallback query returned", fallbackSnapshot.docs.length, "documents");
      ownerProducts.value = fallbackSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          title: doc.data().title || "Untitled",
          img: doc.data().img || require("@/assets/test.png"),
          location: doc.data().location || t("defaultLocation"), // Use t instead of $t
          price: doc.data().price || "0",
          rating: doc.data().rating || "0",
        }))
        .filter((product) => product.id !== route.params.id);
    } else {
      ownerProducts.value = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          title: doc.data().title || "Untitled",
          img: doc.data().img || require("@/assets/test.png"),
          location: doc.data().location || t("defaultLocation"), // Use t instead of $t
          price: doc.data().price || "0",
          rating: doc.data().rating || "0",
        }))
        .filter((product) => product.id !== route.params.id);
    }
  } catch (error) {
    console.error("Error loading owner products:", error);
    ownerProducts.value = [];
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
  const diffTime = Math.ceil(
    (new Date(booking.value.endDate) - new Date(booking.value.startDate)) /
      (1000 * 60 * 60 * 24)
  );
  const basePrice = diffTime * booking.value.productPrice;
  if (booking.value.deliveryMethod === "pickup") {
    booking.value.deliveryFee = 0;
  } else {
    booking.value.deliveryFee = basePrice * 0.02;
  }
};

const resetPaymentFields = () => {
  booking.value.phoneNumber = "";
  booking.value.cardNumber = "";
  booking.value.expiryDate = "";
  booking.value.cvv = "";
  booking.value.cardHolderName = "";
  showOTPForm.value = false;
};

const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\D/g, "");
  booking.value.cardNumber = value;
};

const formatExpiryDate = (event) => {
  let value = event.target.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.slice(0, 2) + "/" + value.slice(2, 4);
  }
  booking.value.expiryDate = value;
};

const formatCvv = (event) => {
  let value = event.target.value.replace(/\D/g, "");
  booking.value.cvv = value;
};

const formatOtp = (event) => {
  let value = event.target.value.replace(/\D/g, "");
  booking.value.otp = value;
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
      booking.value.deliveryFee =
        booking.value.deliveryMethod === "delivery" ? basePrice * 0.02 : 0;
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
    return querySnapshot.size === 1;
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
        text: "Please select both start and end dates.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (
      (booking.value.paymentMethod === "vodafone_cash" ||
        booking.value.paymentMethod === "etisalat_wallet") &&
      !booking.value.phoneNumber.match(/^\+20[0-9]{10}$/)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Phone Number",
        text:
          "Please enter a valid phone number starting with +20 followed by exactly 10 digits.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (booking.value.paymentMethod === "credit_card") {
      if (!booking.value.cardNumber.match(/[0-9]{13,19}/)) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Card Number",
          text: "Please enter a valid card number (13-19 digits).",
          confirmButtonText: "OK",
        });
        return;
      }

      const expiry = booking.value.expiryDate.split("/");
      if (
        !booking.value.expiryDate.match(/(0[1-9]|1[0-2])\/[0-9]{2}/) ||
        expiry.length !== 2
      ) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Expiry Date",
          text: "Please enter a valid expiry date (MM/YY).",
          confirmButtonText: "OK",
        });
        return;
      }

      if (!booking.value.cvv.match(/[0-9]{3,4}/)) {
        Swal.fire({
          icon: "warning",
          title: "Invalid CVV",
          text: "Please enter a valid CVV (3-4 digits).",
          confirmButtonText: "OK",
        });
        return;
      }

      if (!booking.value.cardHolderName.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Cardholder Name",
          text: "Please enter the cardholder's name.",
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
        cardNumber: booking.value.cardNumber,
      });

      // Delete the product from the products collection
      const productRef = doc(db, "products", booking.value.productId);
      await deleteDoc(productRef);

      showBookingForm.value = false;

      const isFirstBooking = await checkFirstBooking(auth.currentUser.uid);
      if (isFirstBooking) {
        showWebsiteReviewForm.value = true;
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text:
          "Booking and payment processed successfully! The item has been removed from the products list.",
        confirmButtonText: "OK",
      });
      return;
    }

    Swal.fire({
      icon: "info",
      title: "OTP Sent",
      text: `An OTP has been sent to ${booking.value.phoneNumber}. Please check your phone.`,
      confirmButtonText: "OK",
    });

    showOTPForm.value = true;

    setTimeout(() => {
      booking.value.otp = "123456";
    }, 2000);
  } catch (error) {
    console.error("Error initiating booking:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Failed to initiate booking: ${error.message}`,
      confirmButtonText: "OK",
    });
  }
};

const verifyOTP = async () => {
  try {
    if (booking.value.otp !== "123456") {
      Swal.fire({
        icon: "warning",
        title: "Invalid OTP",
        text: "Please enter a valid 6-digit OTP.",
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

    // Delete the product from the products collection
    const productRef = doc(db, "products", booking.value.productId);
    await deleteDoc(productRef);

    showBookingForm.value = false;
    showOTPForm.value = false;

    const isFirstBooking = await checkFirstBooking(auth.currentUser.uid);
    if (isFirstBooking) {
      showWebsiteReviewForm.value = true;
    }

    Swal.fire({
      icon: "success",
      title: "Success",
      text:
        "Booking and payment verified successfully! The item has been removed from the products list.",
      confirmButtonText: "OK",
    });
  } catch (error) {
    console.error("Full error details:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Failed to verify OTP: ${error.message}`,
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
    newWebsiteReview.value.userImage = "";
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

const navigateToRentProcess = () => {
  console.log("navigateToRentProcess triggered");
  if (!auth.currentUser) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please log in to start the rent process.",
      confirmButtonText: "OK",
    });
    return;
  }
  console.log("Navigating to RentProcess with id:", route.params.id);
  router.push({ name: "RentProcess", params: { id: route.params.id } }).catch((err) => {
    console.error("Navigation error:", err);
  });
};

const navigateToProduct = (productId) => {
  if (route.params.id === productId) {
    // If already on the same product, reload the page
    window.location.href = `/product/${productId}`;
  } else {
    // Navigate to new product and ensure component reloads
    router
      .push(`/product/${productId}`)
      .then(() => {
        // Force reload to ensure component re-renders with new data
        window.location.reload();
      })
      .catch((err) => {
        console.error("Navigation error:", err);
      });
  }
};

const selectedDates = ref({ start: null, end: null });

onMounted(() => {
  loadProduct();
  loadReviews();
  today.value = new Date();
  today.value.setHours(0, 0, 0, 0);
  console.log("Auth state on mount:", auth.currentUser);
});
</script>
