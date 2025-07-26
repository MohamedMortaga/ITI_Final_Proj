<template>
  <div class="min-h-screen bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-800)]">
    <!-- Breadcrumbs -->
    <div
      class="max-w-7xl mx-auto px-4 py-2 text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
    >
      <span class="hover:text-[var(--color-success-500)] cursor-pointer">Home</span>
      <span class="mx-2">></span>
      <span class="text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]">{{
        product?.title
      }}</span>
      <span class="mx-2">></span>
      <span class="text-[var(--color-success-500)]">Rent confirmation</span>
    </div>

    <div v-if="product" class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Product Image and Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Product Image Gallery -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="relative">
        <img
          :src="product.img || require('@/assets/logo.png')"
          alt="Product Image"
                class="w-full h-96 object-cover"
        />
              <!-- Navigation Arrows -->
            <button
                class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            >
                <i class="fas fa-chevron-left text-gray-600"></i>
            </button>
            <button
                class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            >
                <i class="fas fa-chevron-right text-gray-600"></i>
            </button>
              <!-- Pagination Dots -->
              <div
                class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
              >
                <div class="w-2 h-2 bg-[var(--color-success-500)] rounded-full"></div>
                <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

          <!-- Product Title and Action -->
          <div class="bg-white rounded-xl shadow-lg p-6">
          <h1
              class="text-3xl font-bold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
          >
            {{ product.title }}
          </h1>
            <button
              @click="navigateToRentConfirmation"
              :disabled="product?.status === 'pending' || isBookingPending"
              class="w-full bg-[var(--color-success-500)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[var(--color-success-600)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {{
                product?.status === "pending" || isBookingPending
                  ? $t("toolNotAvailable")
                  : $t("rentThisTool")
              }}
            </button>
            <p
              v-if="isBookingPending && remainingTime"
              class="mt-2 text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)] text-center"
            >
              Available in: {{ remainingTime }}
            </p>
          </div>

          <!-- About the Tool -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2
              class="text-xl font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
            >
              About the Tool
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="font-medium text-[var(--color-gray-600)]">Category:</span>
                <span class="text-[var(--color-gray-800)]">{{
                  product.category || product.type
                }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="font-medium text-[var(--color-gray-600)]">Brand:</span>
                <span class="text-[var(--color-gray-800)]">Bosch</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="font-medium text-[var(--color-gray-600)]">Model:</span>
                <span class="text-[var(--color-gray-800)]">{{
                  product.model || "GSR 18V-50 Professional"
                }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="font-medium text-[var(--color-gray-600)]"
                  >Price per day:</span
                >
                <span class="text-[var(--color-success-500)] font-bold"
                  >{{ product.price || "15" }} {{ $t("egp") }}</span
                >
              </div>
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="font-medium text-[var(--color-gray-600)]">Rent times:</span>
                <span class="text-[var(--color-gray-800)]">15</span>
              </div>
            </div>
            <button
              @click="navigateToRentConfirmation"
              :disabled="product?.status === 'pending' || isBookingPending"
              class="w-full mt-4 bg-[var(--color-success-500)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[var(--color-success-600)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {{
                product?.status === "pending" || isBookingPending
                  ? $t("toolNotAvailable")
                  : $t("rentThisTool")
              }}
            </button>
            <p
              v-if="isBookingPending && remainingTime"
              class="mt-2 text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)] text-center"
            >
              Available in: {{ remainingTime }}
            </p>
          </div>
          <!-- Product Description -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2
              class="text-xl font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
            >
              Description
            </h2>
            <div
              class="space-y-4 text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
            >
              <p>
                {{ product.details }}
              </p>

              <div>
                <h3
                  class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-2"
                >
                  Inclusions:
                </h3>
                <ul class="list-disc list-inside space-y-1">
                  <li>1 rechargeable battery (18V)</li>
                  <li>Charger included</li>
                  <li>Optional drill bits (upon request)</li>
                </ul>
              </div>

              <div>
                <h3
                  class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-2"
                >
                  Usage & Care:
                </h3>
                <p class="mb-2">Rented over 15 times with great feedback.</p>
                <ul class="list-disc list-inside space-y-1">
                  <li>Assembling IKEA furniture</li>
                  <li>Wall mounting (TVs, shelves)</li>
                  <li>Minor drilling in wood or drywall</li>
                </ul>
                <p class="mt-2">
                  I sanitize the tool after each rental, and it's checked for performance
                  every month.
                </p>
                <p class="mt-2">
                  Perfect for short-term use without having to buy expensive tools.
                </p>
                <p class="mt-2">
                  Ready for pickup in Nasr City or I can arrange delivery depending on the
                  distance.
                </p>
              </div>
            </div>
          </div>

          <!-- About the Tool -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2
              class="text-xl font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
            >
              About the Tool
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="font-medium text-[var(--color-gray-600)]">Category:</span>
                <span class="text-[var(--color-gray-800)]">{{
                  product.category || product.type
                }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="font-medium text-[var(--color-gray-600)]">Brand:</span>
                <span class="text-[var(--color-gray-800)]">Bosch</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="font-medium text-[var(--color-gray-600)]">Model:</span>
                <span class="text-[var(--color-gray-800)]">{{
                  product.model || "GSR 18V-50 Professional"
                }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="font-medium text-[var(--color-gray-600)]"
                  >Price per day:</span
                >
                <span class="text-[var(--color-success-500)] font-bold"
                  >{{ product.price || "15" }} {{ $t("egp") }}</span
                >
              </div>
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="font-medium text-[var(--color-gray-600)]">Rent times:</span>
                <span class="text-[var(--color-gray-800)]">15</span>
              </div>
            </div>
            <button
              @click="navigateToRentConfirmation"
              :disabled="product?.status === 'pending' || isBookingPending"
              class="w-full mt-4 bg-[var(--color-success-500)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[var(--color-success-600)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {{
                product?.status === "pending" || isBookingPending
                  ? $t("toolNotAvailable")
                  : $t("rentThisTool")
              }}
            </button>
          </div>
        </div>

        <!-- Right Column: Owner Details, Calendar, Reviews -->
        <div class="space-y-6">
        <!-- Owner Details -->
          <div class="bg-white rounded-xl shadow-lg p-6">
          <h3
              class="text-lg font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
          >
              Owner details
          </h3>
            <div class="flex items-center gap-4 mb-4">
            <img
              :src="booking.sellerImage || require('@/assets/default.png')"
              alt="Owner"
                class="w-12 h-12 rounded-full object-cover"
            />
            <div>
                <p
                  class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                >
                  {{ booking.sellerName || $t("loading") }}
                </p>
                <div class="flex items-center gap-1 text-sm text-[var(--color-gray-600)]">
                  <span class="text-yellow-400"
                    >{{ "★".repeat(Math.floor(ownerStats.rating))
                    }}{{ "☆".repeat(5 - Math.floor(ownerStats.rating)) }}</span
                  >
                  <span
                    >{{ ownerStats.rating }} ({{ ownerStats.reviewCount }} review{{
                      ownerStats.reviewCount !== 1 ? "s" : ""
                    }})</span
                  >
                </div>
                <div class="flex items-center gap-1 text-sm text-[var(--color-gray-600)]">
                  <i class="fas fa-map-marker-alt text-[var(--color-success-500)]"></i>
                  <span>{{ product?.location || "Cairo" }}</span>
                </div>
                <p class="text-sm text-[var(--color-gray-600)]">
                  {{ ownerStats.successfulRentals }} successful rental{{
                    ownerStats.successfulRentals !== 1 ? "s" : ""
                  }}
                </p>
                <p class="text-sm text-[var(--color-gray-600)]">
                  Member since {{ ownerStats.memberSince || "Unknown" }}
                </p>
              </div>
            </div>
            <div class="space-y-2">
              <button
                @click="viewOwnerTools"
                class="w-full border border-[var(--color-success-500)] text-[var(--color-success-500)] py-2 rounded-lg hover:bg-[var(--color-success-50)] transition-colors"
              >
                view owner tools
              </button>
              <button
                @click="sendMessage"
                class="w-full bg-[var(--color-success-500)] text-white py-2 rounded-lg hover:bg-[var(--color-success-600)] transition-colors relative"
              >
                Send a message
                <span 
                  v-if="unreadMessageCount > 0" 
                  class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {{ unreadMessageCount > 9 ? '9+' : unreadMessageCount }}
                </span>
              </button>
              <router-link
                to="/messages"
                class="w-full border border-[var(--color-success-500)] text-[var(--color-success-500)] py-2 rounded-lg hover:bg-[var(--color-success-50)] transition-colors text-center block"
              >
                <i class="fas fa-comments mr-2"></i>
                View All Messages
              </router-link>
            </div>
          </div>

          <!-- Availability Calendar -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex justify-between items-center mb-4">
              <button
                @click="prevMonth"
                :disabled="!canGoToPrevMonth"
                class="text-[var(--color-success-500)] hover:text-[var(--color-success-600)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <h3
                class="text-lg font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
              >
                {{ currentMonthYear }}
              </h3>
              <button
                @click="nextMonth"
                class="text-[var(--color-success-500)] hover:text-[var(--color-success-600)]"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
        </div>

            <!-- Days of Week -->
            <div class="grid grid-cols-7 gap-1 mb-2">
              <span
                v-for="day in ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']"
                :key="day"
                class="text-center text-sm font-medium text-[var(--color-gray-600)] py-1"
              >
                {{ day }}
              </span>
      </div>

            <!-- Calendar Grid -->
            <div class="grid grid-cols-7 gap-1">
              <span
                v-for="day in daysInMonth"
                :key="day"
                class="text-center p-2 text-sm cursor-pointer rounded-full hover:bg-[var(--color-success-100)] transition-colors"
                :class="{
                  'bg-[var(--color-success-500)] text-white': isSelected(day),
                  'bg-[var(--color-success-200)] text-[var(--color-success-700)]':
                    isStart(day) || isEnd(day),
                  'text-gray-400 cursor-not-allowed': isPastDate(day),
                  'text-[var(--color-gray-800)]':
                    !isPastDate(day) && !isSelected(day) && !isStart(day) && !isEnd(day),
                }"
                @click="selectDate(day)"
              >
                {{ day }}
                <span v-if="isStart(day)">s</span>
                <span v-if="isEnd(day)">e</span>
              </span>
            </div>
            <button
              @click="resetDateSelection"
              class="w-full mt-4 bg-[var(--color-success-500)] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[var(--color-success-600)] transition-colors"
            >
              Reset Date Selection
            </button>
    </div>

          <!-- Tool's Reviews -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3
              class="text-lg font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
            >
              Tool's reviews
            </h3>
            <div class="space-y-4">
              <div
                v-for="review in reviews.slice(0, 3)"
                :key="review.id"
                class="border-b border-gray-200 pb-4 last:border-b-0"
              >
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-medium text-[var(--color-gray-800)]">{{
                    review.userName || review.rentUserId
                  }}</span>
                  <span class="text-yellow-400 text-sm">
                    {{
                      "★".repeat(Math.floor(review.rate)) +
                      "☆".repeat(5 - Math.floor(review.rate))
                    }}
                  </span>
                  <span class="text-sm text-[var(--color-gray-600)]">{{
                    review.rate
                  }}</span>
                </div>
                <p class="text-[var(--color-gray-600)] text-sm mb-1">
                  "{{ review.review }}"
                </p>
                <span class="text-xs text-[var(--color-gray-500)]">{{
                  formatDate(review.timestamp?.toDate())
                }}</span>
              </div>
            </div>
        <button
              @click="showReviewForm = true"
              class="w-full mt-4 border border-[var(--color-success-500)] text-[var(--color-success-500)] py-2 rounded-lg hover:bg-[var(--color-success-50)] transition-colors"
        >
              Add Review
        </button>
            <button
              class="w-full mt-2 border border-[var(--color-success-500)] text-[var(--color-success-500)] py-2 rounded-lg hover:bg-[var(--color-success-50)] transition-colors"
            >
              view all reviews
            </button>
          </div>
        </div>
      </div>

      <!-- More from Owner Section -->
      <div class="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3
          class="text-lg font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
        >
          More from {{ booking.sellerName || $t("loading") }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            @click="navigateToProduct(item.id)"
            v-for="item in showAllProducts ? ownerProducts : ownerProducts.slice(0, 3)"
            :key="item.id"
            class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              :src="item.img || require('@/assets/test.png')"
              alt="product image"
              class="w-full h-40 object-cover"
            />
            <div class="p-4">
              <h4 class="font-semibold text-[var(--color-gray-800)] mb-2">
                {{ item.title || "Untitled" }}
              </h4>
              <div
                class="flex items-center justify-between text-sm text-[var(--color-gray-600)] mb-2"
              >
                <span class="flex items-center gap-1">
                  <i class="fas fa-map-marker-alt text-[var(--color-success-500)]"></i>
                  {{ item.location || $t("defaultLocation") }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="fas fa-star text-yellow-400"></i>
                  {{ item.rating || "0" }}
                </span>
          </div>
              <div class="flex items-center justify-between mb-3">
                <span class="font-semibold text-[var(--color-gray-800)]">
                  {{ $t("egp") }} {{ item.price || "0" }}
                </span>
                <span class="text-sm text-[var(--color-gray-600)]">{{
                  $t("perDay")
                }}</span>
              </div>
              <button
                @click="navigateToProduct(item.id)"
                class="w-full bg-[var(--color-success-500)] text-white py-2 rounded-lg font-semibold hover:bg-[var(--color-success-600)] transition-colors"
              >
                {{ $t("rentItem") }}
              </button>
            </div>
          </div>
        </div>
        <button
          @click="showAllProducts = !showAllProducts"
          class="mt-4 text-[var(--color-success-500)] hover:underline"
        >
          {{ showAllProducts ? $t("showLess") : $t("viewAllItems") }}
        </button>
          </div>
    </div>

    <!-- Booking Form Modal -->
    <div
      v-if="showBookingForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white dark:bg-[var(--color-gray-800)] rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <!-- Header -->
        <div
          class="sticky top-0 bg-white dark:bg-[var(--color-gray-800)] border-b border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="flex justify-between items-center">
            <h2
              class="text-2xl font-bold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
            >
              Rent confirmation
            </h2>
            <button
              @click="showBookingForm = false"
              class="text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] dark:text-[var(--color-gray-400)] dark:hover:text-[var(--color-gray-200)] text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <!-- Product and Rental Details Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left: Product Image -->
            <div class="space-y-4">
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  :src="product?.img || require('@/assets/logo.png')"
                  alt="Product Image"
                  class="w-full h-64 object-cover"
                />
              </div>
            </div>

            <!-- Right: Rental Details -->
            <div class="space-y-4">
          <div>
                <h3
                  class="text-xl font-bold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-2"
                >
                  {{ product?.title }}
                </h3>
                <p class="text-2xl font-bold text-[var(--color-success-500)] mb-4">
                  {{ $t("egp") }} {{ product?.price || 0 }}/{{ $t("perDay") }}
            </p>
          </div>

              <!-- Picked Dates -->
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4
                  class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-2"
                >
                  Picked Dates
                </h4>
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
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div class="flex justify-between items-center">
                  <span
                    class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
                    >Subtotal:</span
                  >
                  <span class="text-xl font-bold text-[var(--color-success-500)]">
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

          <!-- Delivery Method Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3
              class="text-lg font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
            >
              Delivery method
            </h3>
            <div class="space-y-3">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  v-model="booking.deliveryMethod"
                  value="pickup"
                  class="text-[var(--color-success-500)] focus:ring-[var(--color-success-500)]"
                />
                <span
                  class="text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
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
                <span
                  class="text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
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
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3
              class="text-lg font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
            >
              Personal information
            </h3>

            <div
              v-if="!auth.currentUser"
              class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
            >
              <p class="text-blue-800 dark:text-blue-200 mb-4">
                Please Login/Sign up to complete the rent process
              </p>
              <div class="space-y-3">
            <button
                  @click="router.push('/signup')"
                  class="w-full bg-[var(--color-success-500)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[var(--color-success-600)] transition-colors"
            >
                  Sign up now!
            </button>
                <p
                  class="text-center text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
                >
                  Already have an account?
            <button
                    @click="router.push('/login')"
                    class="text-[var(--color-success-500)] hover:underline"
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

          <!-- Summary Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3
              class="text-lg font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
            >
              Summary
            </h3>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
              <div
                class="flex justify-between items-center border-b border-dashed border-gray-300 dark:border-gray-600 pb-2"
              >
                <span
                  class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
                  >Tool:</span
                >
                <span class="font-medium">{{ product?.title }}</span>
          </div>
              <div
                class="flex justify-between items-center border-b border-dashed border-gray-300 dark:border-gray-600 pb-2"
              >
                <span
                  class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
                  >Owner:</span
                >
                <div class="flex items-center space-x-2">
                  <span class="font-medium">{{ booking.sellerName }}</span>
                  <i class="fas fa-check-circle text-[var(--color-success-500)]"></i>
      </div>
    </div>
    <div
                class="flex justify-between items-center border-b border-dashed border-gray-300 dark:border-gray-600 pb-2"
    >
                <span
                  class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
                  >Rental Days:</span
      >
                <span class="font-medium">{{ calculateDays() }}</span>
              </div>
        <div
                class="flex justify-between items-center border-b border-dashed border-gray-300 dark:border-gray-600 pb-2"
        >
            <span
                  class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
                  >Daily Rate:</span
                >
                <span class="font-medium">{{ $t("egp") }} {{ product?.price || 0 }}</span>
              </div>
              <div
                class="flex justify-between items-center border-b border-dashed border-gray-300 dark:border-gray-600 pb-2"
              >
            <span
                  class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
                  >Delivery Fee:</span
                >
                <span class="font-medium"
                  >{{ $t("egp") }} {{ booking.deliveryFee.toFixed(2) }}</span
                >
              </div>
              <div class="flex justify-between items-center pt-2">
            <span
                  class="text-lg font-bold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                  >Total amount:</span
            >
                <span class="text-xl font-bold text-[var(--color-success-500)]"
                  >{{ $t("egp") }} {{ booking.totalPrice.toFixed(2) }}</span
                >
          </div>
        </div>
      </div>

          <!-- Action Buttons -->
          <div
            class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
      <button
              @click="showBookingForm = false"
              class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {{ $t("cancel") }}
            </button>
            <button
              @click="submitBooking"
              :disabled="!auth.currentUser || !booking.startDate || !booking.endDate"
              class="px-8 py-3 bg-[var(--color-success-500)] text-white rounded-lg font-semibold hover:bg-[var(--color-success-600)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Confirm
      </button>
          </div>
        </div>
      </div>
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

    <!-- Chat Modal -->
    <div
      v-if="showChatModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white dark:bg-[var(--color-gray-800)] rounded-xl shadow-xl w-full max-w-2xl h-[600px] flex flex-col"
      >
        <!-- Chat Header -->
        <div
          class="bg-[var(--color-success-500)] text-white p-4 rounded-t-xl flex justify-between items-center"
        >
          <div class="flex items-center gap-3">
            <img
              :src="booking.sellerImage || require('@/assets/default.png')"
              alt="Owner"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 class="font-semibold text-lg">{{ booking.sellerName }}</h3>
              <p class="text-sm opacity-90">Product: {{ product?.title }}</p>
            </div>
          </div>
          <button
            @click="closeChatModal"
            class="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <!-- Chat Messages -->
        <div
          id="chat-messages-container"
          class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[var(--color-gray-700)]"
        >
          <!-- Loading State -->
          <div v-if="chatLoading" class="flex justify-center items-center h-32">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-success-500)]"></div>
          </div>

          <!-- Error State -->
          <div v-else-if="chatError" class="text-center text-red-500 p-4">
            <i class="fas fa-exclamation-triangle mb-2"></i>
            <p>{{ chatError }}</p>
          </div>

          <!-- Messages -->
          <div v-else-if="chatMessages.length === 0" class="text-center text-gray-500 p-8">
            <i class="fas fa-comments text-4xl mb-4 opacity-50"></i>
            <p>No messages yet. Start the conversation!</p>
          </div>

          <div v-else>
            <div
              v-for="message in chatMessages"
              :key="message.id"
              class="flex"
              :class="isOwnMessage(message) ? 'justify-end' : 'justify-start'"
            >
                             <div
                 class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative"
                 :class="
                   isOwnMessage(message)
                     ? 'bg-[var(--color-success-500)] text-white'
                     : 'bg-white dark:bg-[var(--color-gray-600)] text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]'
                 "
               >
                 <div class="flex items-center gap-2 mb-1">
                   <span class="text-xs opacity-75">{{ message.senderName }}</span>
                   <span class="text-xs opacity-75">{{ formatChatTime(message.timestamp) }}</span>
                   <!-- Read indicator for own messages -->
                   <span v-if="isOwnMessage(message)" class="text-xs opacity-75">
                     <i :class="message.read ? 'fas fa-check-double text-blue-300' : 'fas fa-check text-gray-300'"></i>
                   </span>
                   <!-- Unread indicator for other's messages -->
                   <span v-else-if="!message.read" class="w-2 h-2 bg-red-500 rounded-full"></span>
                 </div>
                 <p class="text-sm">{{ message.content }}</p>
               </div>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-[var(--color-gray-800)]">
          <form @submit.prevent="sendChatMessage" class="flex gap-2">
            <input
              v-model="newChatMessage"
              type="text"
              placeholder="Type your message..."
              @keyup.enter="sendChatMessage"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-success-500)] bg-white dark:bg-[var(--color-gray-700)] text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
              :disabled="!auth.currentUser"
            />
            <button
              type="submit"
              :disabled="!newChatMessage.trim() || !auth.currentUser"
              class="px-6 py-2 bg-[var(--color-success-500)] text-white rounded-lg hover:bg-[var(--color-success-600)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
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
import { useI18n } from "vue-i18n";
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
  updateDoc,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "@/firebase/config";
import Swal from "sweetalert2";

const { t } = useI18n();
const showAllProducts = ref(false);
const route = useRoute();
const router = useRouter();
const product = ref(null);
const showBookingForm = ref(false);
const showReviewForm = ref(false);
const reviews = ref([]);
const ownerProducts = ref([]);
const isBookingPending = ref(false); // Track if there is a pending booking
const ownerStats = ref({
  successfulRentals: 0,
  memberSince: null,
  rating: 0,
  reviewCount: 0,
});
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
  paymentMethod: "vodafone_cash",
  phoneNumber: "",
  otp: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  cardHolderName: "",
  userName: "",
  userEmail: "",
});
const newReview = ref({
  review: "",
  rate: 1,
  sellerUserId: "",
  rentUserId: "",
  userName: "",
});
const today = ref(new Date());
const currentDate = ref(new Date());
const selectedDates = ref({ start: null, end: null });

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

// Check for pending bookings and update product status
const checkPendingBookings = async () => {
  try {
    // Only run if we have a valid product ID
    if (!route.params.id) {
      console.log("No product ID available for booking check");
      return;
    }
    
    console.log("Checking pending bookings for product:", route.params.id);
    const bookingsRef = collection(db, "bookings");
    const q = query(
      bookingsRef,
      where("productId", "==", route.params.id),
      where("status", "==", "pending")
    );
    const querySnapshot = await getDocs(q);
    console.log("Found", querySnapshot.docs.length, "pending bookings");

    const now = new Date();
    const todayMidnight = new Date(now);
    todayMidnight.setHours(0, 0, 0, 0); // Set to 12:00 AM today

    let hasPendingBooking = false;
    let earliestEndDate = null;

    for (const docSnap of querySnapshot.docs) {
      const bookingData = docSnap.data();
      
      // Check if endDate exists and is valid
      if (!bookingData.endDate) {
        console.warn("Booking missing endDate:", docSnap.id);
        continue;
      }
      
      const endDate = new Date(bookingData.endDate);
      
      // Check if the date is valid
      if (isNaN(endDate.getTime())) {
        console.warn("Invalid endDate for booking:", docSnap.id, bookingData.endDate);
        continue;
      }
      
      endDate.setHours(0, 0, 0, 0); // Set to 12:00 AM of the end date
      console.log(
        "Booking end date (midnight):",
        endDate,
        "Today midnight:",
        todayMidnight
      );

      if (todayMidnight > endDate) {
        // End date (at midnight) has passed, update product status to free
        try {
          const productRef = doc(db, "products", bookingData.productId);
          await updateDoc(productRef, { status: "free" });
          await updateDoc(doc(db, "bookings", docSnap.id), { status: "completed" });
          console.log("Updated status to free for product:", bookingData.productId);
        } catch (updateError) {
          console.warn("Failed to update booking/product status:", updateError);
          // Continue with other bookings even if this one fails
        }
      } else {
        hasPendingBooking = true;
        if (!earliestEndDate || endDate < earliestEndDate) {
          earliestEndDate = endDate;
        }
        console.log("Active pending booking found with end date:", endDate);
      }
    }

    isBookingPending.value = hasPendingBooking;
    if (earliestEndDate) {
      pendingEndDate.value = earliestEndDate; // Store the earliest end date for remaining time calculation
    }
    console.log("isBookingPending set to:", isBookingPending.value);
  } catch (error) {
    console.error("Error checking pending bookings:", error);
    // Don't show error to user for this background check, just log it
    console.warn("Background booking status check failed:", error.message);
  }
};

const loadProduct = async () => {
  try {
    const id = route.params.id;
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      product.value = docSnap.data();
      product.value.status = product.value.status || "free";
      booking.value.productId = id;
      booking.value.sellerId = product.value.sellerId || product.value.userId;
      booking.value.productTitle = product.value.title;
      booking.value.productPrice = parseFloat(product.value.price) || 0;
      await loadSellerDetails(booking.value.sellerId);
      await loadOwnerProducts(booking.value.sellerId);
      await checkPendingBookings(); // Immediate check on load
    } else {
      console.error("No such product!");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Product not found.",
        confirmButtonText: "OK",
      });
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
      newReview.value.sellerUserId = sellerId;

      // Load owner statistics
      await loadOwnerStats(sellerId);
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

const loadOwnerStats = async (sellerId) => {
  try {
    // Get successful rentals count
    const bookingsRef = collection(db, "bookings");
    const successfulBookingsQuery = query(
      bookingsRef,
      where("sellerId", "==", sellerId),
      where("status", "==", "completed")
    );
    const successfulBookingsSnapshot = await getDocs(successfulBookingsQuery);
    ownerStats.value.successfulRentals = successfulBookingsSnapshot.size;

    // Get user creation date (member since)
    const userDocRef = doc(db, "users", sellerId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      if (userData.createdAt) {
        const createdAt = userData.createdAt.toDate
          ? userData.createdAt.toDate()
          : new Date(userData.createdAt);
        ownerStats.value.memberSince = createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });
      } else {
        ownerStats.value.memberSince = "Unknown";
      }
    }

    // Get average rating and review count
    const reviewsRef = collection(db, "user-reviews");
    const sellerReviewsQuery = query(reviewsRef, where("sellerUserId", "==", sellerId));
    const reviewsSnapshot = await getDocs(sellerReviewsQuery);

    if (!reviewsSnapshot.empty) {
      const reviews = reviewsSnapshot.docs.map((doc) => doc.data());
      const totalRating = reviews.reduce((sum, review) => sum + (review.rate || 0), 0);
      ownerStats.value.rating = (totalRating / reviews.length).toFixed(1);
      ownerStats.value.reviewCount = reviews.length;
    } else {
      ownerStats.value.rating = "0";
      ownerStats.value.reviewCount = 0;
    }
  } catch (error) {
    console.error("Error loading owner stats:", error);
    ownerStats.value = {
      successfulRentals: 0,
      memberSince: "Unknown",
      rating: "0",
      reviewCount: 0,
    };
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
          location: doc.data().location || t("defaultLocation"),
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
          location: doc.data().location || t("defaultLocation"),
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

const formatDate = (date) => {
  if (!date) return "Unknown";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const selectDate = async (day) => {
  if (isPastDate(day)) return;

  const selectedDate = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    day
  );
  const selectedIso = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1
  ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // Check for overlapping pending bookings
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(
      bookingsRef,
      where("productId", "==", route.params.id),
      where("status", "==", "pending")
    );
    const querySnapshot = await getDocs(q);

    const selectedStartDate = new Date(selectedDates.value.start || selectedIso);
    const selectedEndDate = selectedDates.value.end ? new Date(selectedIso) : null;

    for (const docSnap of querySnapshot.docs) {
      const bookingData = docSnap.data();
      const bookingStartDate = new Date(bookingData.startDate);
      const bookingEndDate = new Date(bookingData.endDate);

      if (selectedEndDate) {
        // Check if the selected date range overlaps with any pending booking
        if (selectedStartDate <= bookingEndDate && selectedEndDate >= bookingStartDate) {
          Swal.fire({
            icon: "warning",
            title: "Date Unavailable",
            text: "The selected date range overlaps with an existing booking.",
            confirmButtonText: "OK",
          });
          return;
        }
      }
    }
  } catch (error) {
    console.error("Error checking date availability:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to check date availability.",
      confirmButtonText: "OK",
    });
    return;
  }

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

const resetDateSelection = () => {
  selectedDates.value.start = null;
  selectedDates.value.end = null;
  booking.value.startDate = "";
  booking.value.endDate = "";
  booking.value.deliveryFee = 0;
  booking.value.totalPrice = 0;
};

const updateDeliveryFee = () => {
  if (!booking.value.startDate || !booking.value.endDate) {
    booking.value.deliveryFee = 0;
    return;
  }
  const diffTime =
    Math.ceil(
      (new Date(booking.value.endDate) - new Date(booking.value.startDate)) /
        (1000 * 60 * 60 * 24)
    ) + 1;
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
  let formatted = "";

  for (let i = 0; i < value.length; i += 4) {
    if (i > 0) formatted += " ";
    formatted += value.slice(i, i + 4);
  }

  booking.value.cardNumber = formatted.trim().slice(0, 19);
};

const formatExpiryDate = (event) => {
  let value = event.target.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.slice(0, 2) + "/" + value.slice(2, 4);
  }
  booking.value.expiryDate = value.slice(0, 5);
};

const formatCvv = (event) => {
  let value = event.target.value.replace(/\D/g, "");
  booking.value.cvv = value.slice(0, 4);
};

const formatOtp = (event) => {
  let value = event.target.value.replace(/\D/g, "");
  booking.value.otp = value.slice(0, 6);
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

    // Calculate total price and delivery fee
    const start = new Date(booking.value.startDate);
    const end = new Date(booking.value.endDate);
    const diffTime = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const basePrice = diffTime * booking.value.productPrice;
    booking.value.deliveryFee =
      booking.value.deliveryMethod === "delivery" ? basePrice * 0.02 : 0;
    booking.value.totalPrice = basePrice + booking.value.deliveryFee;

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

    showBookingForm.value = false;
    isBookingPending.value = true; // Update local state immediately

    const isFirstBooking = await checkFirstBooking(auth.currentUser.uid);
    if (isFirstBooking) {
      showWebsiteReviewForm.value = true;
    }

    Swal.fire({
      icon: "success",
      title: "Booking Confirmed!",
      text:
        "Your rental has been successfully confirmed. You will receive a confirmation email shortly.",
      confirmButtonText: "OK",
    });
    await checkPendingBookings(); // Re-check to ensure consistency
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

    // Update product status to pending
    const productRef = doc(db, "products", booking.value.productId);
    await updateDoc(productRef, { status: "pending" });

    showBookingForm.value = false;
    showOTPForm.value = false;
    isBookingPending.value = true; // Update local state

    const isFirstBooking = await checkFirstBooking(auth.currentUser.uid);
    if (isFirstBooking) {
      showWebsiteReviewForm.value = true;
    }

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Booking and payment verified successfully!",
      confirmButtonText: "OK",
    });
    await checkPendingBookings(); // Re-check to ensure consistency
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

const navigateToProduct = (productId) => {
  if (route.params.id === productId) {
    window.location.href = `/product/${productId}`;
  } else {
    router
      .push(`/product/${productId}`)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.error("Navigation error:", err);
      });
  }
};

const navigateToRentConfirmation = () => {
  if (!selectedDates.value.start || !selectedDates.value.end) {
    Swal.fire({
      icon: "warning",
      title: "Select Dates",
      text: "Please select both start and end dates before proceeding.",
      confirmButtonText: "OK",
    });
    return;
  }

  router.push({
    name: "RentConfirmation",
    params: { id: route.params.id },
    query: {
      startDate: selectedDates.value.start,
      endDate: selectedDates.value.end,
    },
  });
};

const pendingEndDate = ref(null); // Store the earliest pending end date

const remainingTime = computed(() => {
  if (!pendingEndDate.value || !isBookingPending.value) return null;

  const now = new Date();
  const endDate = new Date(pendingEndDate.value);
  endDate.setHours(23, 59, 59, 999); // Set to end of the day
  const diffMs = endDate - now;

  if (diffMs <= 0) return "Available now";

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  // Always show hours and minutes, with days if applicable
  const totalHours = diffDays * 24 + diffHours;
  return `${totalHours} hour${totalHours !== 1 ? "s" : ""}, ${diffMinutes} minute${
    diffMinutes !== 1 ? "s" : ""
  }`;
});

const viewOwnerTools = () => {
  // Navigate to a page showing all products from this owner
  router.push(`/owner/${booking.value.sellerId}`);
};

const sendMessage = () => {
  // Check if user is authenticated
  if (!auth.currentUser) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please log in to send a message to the owner.",
      confirmButtonText: "OK",
    });
    return;
  }

  // Check if user is trying to message themselves
  if (auth.currentUser.uid === booking.value.sellerId) {
    Swal.fire({
      icon: "info",
      title: "Cannot Message Yourself",
      text: "You cannot send a message to yourself.",
      confirmButtonText: "OK",
    });
    return;
  }

  // Open chat modal
  showChatModal.value = true;
  initializeChat();
  
  // Mark existing messages as read after a short delay
  setTimeout(() => {
    markMessagesAsRead();
  }, 1000);
};

// Add these new refs and functions after the existing refs
const showChatModal = ref(false);
const chatMessages = ref([]);
const newChatMessage = ref("");
const chatLoading = ref(false);
const chatError = ref(null);
const chatUnsubscribe = ref(null);

// Initialize chat with the product owner
const initializeChat = async () => {
  if (!auth.currentUser || !booking.value.sellerId) return;

  try {
    chatLoading.value = true;
    chatError.value = null;

    // Create a unique chat room ID between the two users
    const chatRoomId = [auth.currentUser.uid, booking.value.sellerId].sort().join('_');
    
    // First, ensure the chat room exists
    await createOrGetChatRoom(chatRoomId);
    
    // Set up real-time listener for messages
    const messagesRef = collection(db, 'user-chats', chatRoomId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
    
    chatUnsubscribe.value = onSnapshot(messagesQuery, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        });
      });
      
      // Check for new messages from other user
      const newMessages = snapshot.docChanges().filter(change => 
        change.type === 'added' && 
        change.doc.data().senderId !== auth.currentUser?.uid
      );
      
      if (newMessages.length > 0 && !showChatModal.value) {
        // Show notification for new messages when chat is not open
        Swal.fire({
          icon: "info",
          title: "New Message",
          text: `You have a new message from ${booking.value.sellerName}`,
          confirmButtonText: "View",
          showCancelButton: true,
          cancelButtonText: "Later"
        }).then((result) => {
          if (result.isConfirmed) {
            showChatModal.value = true;
          }
        });
      }
      
      chatMessages.value = messages;
    }, (error) => {
      console.error('Error loading chat messages:', error);
      chatError.value = 'Failed to load messages';
    });

    chatLoading.value = false;
  } catch (error) {
    console.error('Error initializing chat:', error);
    chatError.value = 'Failed to initialize chat';
    chatLoading.value = false;
  }
};

// Create or get chat room
const createOrGetChatRoom = async (chatRoomId) => {
  try {
    const chatRoomRef = doc(db, 'user-chats', chatRoomId);
    const chatRoomDoc = await getDoc(chatRoomRef);
    
    if (!chatRoomDoc.exists()) {
      // Create new chat room
      await setDoc(chatRoomRef, {
        participants: [auth.currentUser.uid, booking.value.sellerId].sort(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        productId: route.params.id,
        productTitle: product.value.title,
        lastMessage: null,
        lastMessageTime: null
      });
    }
  } catch (error) {
    console.error('Error creating/getting chat room:', error);
  }
};

// Send a message to the product owner
const sendChatMessage = async () => {
  if (!newChatMessage.value.trim() || !auth.currentUser || !booking.value.sellerId) return;

  try {
    const chatRoomId = [auth.currentUser.uid, booking.value.sellerId].sort().join('_');
    const messagesRef = collection(db, 'user-chats', chatRoomId, 'messages');
    const chatRoomRef = doc(db, 'user-chats', chatRoomId);
    
    const messageData = {
      content: newChatMessage.value.trim(),
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.displayName || auth.currentUser.email,
      senderImage: auth.currentUser.photoURL || null,
      receiverId: booking.value.sellerId,
      receiverName: booking.value.sellerName,
      productId: route.params.id,
      productTitle: product.value.title,
      timestamp: serverTimestamp(),
      read: false
    };

    // Add message to messages collection
    await addDoc(messagesRef, messageData);
    
    // Update chat room with last message info
    await updateDoc(chatRoomRef, {
      lastMessage: newChatMessage.value.trim(),
      lastMessageTime: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    newChatMessage.value = "";

    // Scroll to bottom after sending
    await nextTick();
    scrollChatToBottom();
  } catch (error) {
    console.error('Error sending message:', error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to send message. Please try again.",
      confirmButtonText: "OK",
    });
  }
};

// Scroll chat to bottom
const scrollChatToBottom = () => {
  const chatContainer = document.getElementById('chat-messages-container');
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
};

// Close chat modal
const closeChatModal = () => {
  showChatModal.value = false;
  if (chatUnsubscribe.value) {
    chatUnsubscribe.value();
    chatUnsubscribe.value = null;
  }
  chatMessages.value = [];
  newChatMessage.value = "";
};

// Mark messages as read
const markMessagesAsRead = async () => {
  if (!auth.currentUser || !booking.value.sellerId) return;
  
  try {
    const chatRoomId = [auth.currentUser.uid, booking.value.sellerId].sort().join('_');
    const messagesRef = collection(db, 'user-chats', chatRoomId, 'messages');
    
    // Get unread messages from other user
    const unreadMessages = chatMessages.value.filter(
      message => message.senderId !== auth.currentUser.uid && !message.read
    );
    
    // Mark them as read
    const updatePromises = unreadMessages.map(message => {
      const messageRef = doc(db, 'user-chats', chatRoomId, 'messages', message.id);
      return updateDoc(messageRef, { read: true });
    });
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

// Format chat message time
const formatChatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Check if message is from current user
const isOwnMessage = (message) => {
  return message.senderId === auth.currentUser?.uid;
};

// Computed property for unread message count
const unreadMessageCount = computed(() => {
  if (!auth.currentUser) return 0;
  return chatMessages.value.filter(
    message => message.senderId !== auth.currentUser.uid && !message.read
  ).length;
});

const calculateDays = () => {
  if (!booking.value.startDate || !booking.value.endDate) {
    return 0;
  }
  const start = new Date(booking.value.startDate);
  const end = new Date(booking.value.endDate);
  const diffTime = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diffTime + 1; // Add 1 to include both start and end day
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

// Watch for new chat messages and auto-scroll to bottom
watch(chatMessages, () => {
  nextTick(() => {
    scrollChatToBottom();
  });
}, { deep: true });

// Watch for seller information to initialize chat when available
watch(() => booking.value.sellerId, (newSellerId) => {
  if (newSellerId && auth.currentUser && auth.currentUser.uid !== newSellerId && !chatUnsubscribe.value) {
    initializeChat();
  }
});

onMounted(() => {
  loadProduct();
  loadReviews();
  today.value = new Date();
  today.value.setHours(0, 0, 0, 0);
  console.log("Auth state on mount:", auth.currentUser);

  // Initialize chat listener for notifications (if user is authenticated and not the owner)
  if (auth.currentUser && booking.value.sellerId && auth.currentUser.uid !== booking.value.sellerId) {
    initializeChat();
  }
  
  // Cleanup function
  return () => {
    if (chatUnsubscribe.value) {
      chatUnsubscribe.value();
    }
  };
});
</script>
