<template>
  <div class="min-h-screen bg-[var(--Color-Surface-Surface-Primary)]">
    <!-- Navbar Component -->
    <Navbar />
    
    <!-- SearchBar Component -->
    <div class="max-w-7xl mx-auto px-4">
      <SearchBar 
        :searchQuery="searchQuery" 
        :selectedLocation="selectedLocation"
        @update:searchQuery="searchQuery = $event"
        @update:selectedLocation="selectedLocation = $event"
      />
    </div>

    <!-- Breadcrumbs -->
    <div class="max-w-7xl mx-auto px-4 py-4">
      <nav class="text-sm text-[var(--Color-Text-Text-Secondary)]">
        <router-link
          to="/home"
          class="hover:text-[var(--Color-Text-Text-Brand)] cursor-pointer transition-colors"
        >
          {{ $t("home") }}
        </router-link>
        <span class="mx-2">></span>
        <router-link
          to="/all-products?category=Furniture & DIY"
          class="hover:text-[var(--Color-Text-Text-Brand)] cursor-pointer transition-colors"
        >
          {{ $t("furnitureAndDIY") }}
        </router-link>
        <span class="mx-2">></span>
        <router-link
          to="/all-products?category=DIY tools"
          class="hover:text-[var(--Color-Text-Text-Brand)] cursor-pointer transition-colors"
        >
          {{ $t("diyTools") }}
        </router-link>
        <span class="mx-2">></span>
        <router-link
          :to="`/product/${route.params.id}`"
          class="text-[var(--Color-Text-Text-Primary)] hover:text-[var(--Color-Text-Text-Brand)] cursor-pointer transition-colors"
        >
          {{ product?.title }}
        </router-link>
        <span class="mx-2">></span>
        <span class="text-[var(--Color-Text-Text-Brand)]">{{ $t("rentConfirmation") }}</span>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-2">
      <!-- Product Card with Image and Details - Full Width -->
      <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl overflow-hidden mb-8">
        <div class="grid grid-cols-1 lg:grid-cols-2">
          <!-- Product Image -->
          <div class="lg:col-span-1">
            <img
              :src="product?.image1 || product?.image2 || product?.image3 || require('@/assets/logo.png')"
              alt="Product Image"
              class="w-full h-64 object-cover"
            />
          </div>
          
          <!-- Product Details Table -->
          <div class="lg:col-span-1 p-6 flex items-center">
            <div class="w-full space-y-4">
              <div class="text-2xl font-bold text-[var(--Color-Text-Text-Primary)]">
                {{ product?.title }} {{ $t("availableForRent") }}
              </div>
              
              <div class="space-y-6">
                <div class="flex justify-between">
                  <span class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("price") }}</span>
                  <span class="font-medium text-[var(--Color-Text-Text-Primary)]">{{ $t("egp") }} {{ product?.price || 0 }}/{{ $t("perDay") }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("pickedDates") }}</span>
                  <span class="font-medium text-[var(--Color-Text-Text-Primary)]">
                    {{ $t("from") }}: {{ booking.startDate ? formatDate(booking.startDate) : $t("notSelected") }} {{ $t("to") }}: {{ booking.endDate ? formatDate(booking.endDate) : $t("notSelected") }}
                  </span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("subtotal") }}</span>
                  <span class="font-medium text-[var(--Color-Text-Text-Primary)]">{{ $t("egp") }} {{ calculateSubtotal() }} ({{ $t("egp") }}{{ product?.price || 0 }}×{{ calculateDays() }}{{ $t("days") }})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Two Column Layout for Other Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column: Delivery Method -->
        <div class="space-y-6">
          <!-- Delivery Method Section -->
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6" style="height: 220px;">
            <h2 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">
              {{ $t("deliveryMethod") }}
            </h2>
            <div class="space-y-4">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  v-model="booking.deliveryMethod"
                  value="pickup"
                  class="text-[var(--Color-Text-Text-Brand)] focus:ring-[var(--Color-Text-Text-Brand)]"
                />
                <span class="text-[var(--Color-Text-Text-Primary)]">{{ $t("pickupFromOwner") }}</span>
              </label>
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  v-model="booking.deliveryMethod"
                  value="delivery"
                  class="text-[var(--Color-Text-Text-Brand)] focus:ring-[var(--Color-Text-Text-Brand)]"
                />
                <span class="text-[var(--Color-Text-Text-Primary)]">{{ $t("deliverToMyAddress") }}</span>
              </label>
            </div>

            <div v-if="booking.deliveryMethod === 'delivery'" class="mt-3">
              <div class="flex space-x-2">
                <input
                  v-model="booking.deliveryAddress"
                  type="text"
                  class="flex-1 p-3 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)]"
                  :placeholder="$t('address')"
                  readonly
                />
                <button
                  @click="showAddressModal = true"
                  type="button"
                  class="px-4 py-3 bg-[var(--Color-Text-Text-Brand)] text-[var(--Color-Text-Text-Invert)] rounded-lg hover:bg-[var(--Color-Text-Text-Brand)] hover:opacity-90 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Personal Information -->
        <div class="space-y-6">
          <!-- Personal Information Section -->
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
            <h2 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">
              {{ $t("personalInformation") }}
            </h2>

            <div v-if="!auth.currentUser" class="bg-[var(--Color-Surface-Surface-Secondary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-lg p-6">
              <p class="text-[var(--Color-Text-Text-Primary)] mb-4 text-lg">
                {{ $t("pleaseLoginToCompleteRent") }}
              </p>
              <div class="space-y-4">
                <button
                  @click="router.push('/signup')"
                  class="w-full bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] py-4 px-8 rounded-lg font-semibold text-lg hover:bg-[var(--Color-Surface-Surface-Brand)] transition-colors"
                >
                  {{ $t("signUpNow") }}!
                </button>
                <p class="text-center text-[var(--Color-Text-Text-Secondary)]">
                  {{ $t("alreadyHaveAccount") }}?
                  <button
                    @click="router.push('/login')"
                    class="text-[var(--Color-Text-Text-Brand)] hover:underline font-medium"
                  >
                    {{ $t("login") }}
                  </button>
                </p>
              </div>
            </div>

            <div v-else class="space-y-3">
              <div class="flex justify-between items-center border-b border-[var(--Color-Boarder-Border-Primary)] pb-2">
                <span class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("name") }}</span>
                <input
                  v-model="booking.userName"
                  type="text"
                  class="text-right bg-transparent border-none outline-none text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)]"
                  :placeholder="$t('johnDoe')"
                />
              </div>
              <div class="flex justify-between items-center border-b border-[var(--Color-Boarder-Border-Primary)] pb-2">
                <span class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("phone") }}</span>
                <input
                  v-model="booking.phoneNumber"
                  type="tel"
                  class="text-right bg-transparent border-none outline-none text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)]"
                  :placeholder="$t('phonePlaceholder')"
                  maxlength="14"
                  @input="formatPhoneNumber"
                  required
                />
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("email") }}</span>
                <input
                  v-model="booking.userEmail"
                  type="email"
                  class="text-right bg-transparent border-none outline-none text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)]"
                  :placeholder="$t('emailPlaceholder')"
                />
              </div>
            </div>
          </div>

          <!-- Contact Details Section with Pricing -->
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
            <h2 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">
              {{ $t("renterContactInfo") }}
            </h2>
            
            <!-- Pricing Breakdown -->
            <div class="space-y-3 mb-4">
              <div class="flex justify-between items-center">
                <span class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("subtotal") }}:</span>
                <span class="font-medium text-[var(--Color-Text-Text-Primary)]">{{ $t("egp") }} {{ calculateSubtotal() }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("deliveryFee") }}:</span>
                <span class="font-medium text-[var(--Color-Text-Text-Primary)]">{{ $t("egp") }} {{ calculateDeliveryFee() }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("serviceFee") }}:</span>
                <span class="font-medium text-[var(--Color-Text-Text-Primary)]">{{ $t("egp") }} 5.00</span>
              </div>
              <div class="flex justify-between items-center pt-2 border-t border-[var(--Color-Boarder-Border-Primary)]">
                <span class="text-lg font-bold text-[var(--Color-Text-Text-Primary)]">{{ $t("total") }}:</span>
                <span class="text-xl font-bold text-[var(--Color-Text-Text-Brand)]">{{ $t("egp") }} {{ calculateTotal() }}</span>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="space-y-3 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]">
              <div class="flex items-center gap-2">
                <i class="fas fa-user text-[var(--Color-Text-Text-Brand)] w-4"></i>
                <span class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t("name") }}:</span>
                <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">{{ booking.userName || $t("notProvided") }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-phone text-[var(--Color-Text-Text-Brand)] w-4"></i>
                <span class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t("phone") }}:</span>
                <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">{{ booking.phoneNumber || $t("notProvided") }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-envelope text-[var(--Color-Text-Text-Brand)] w-4"></i>
                <span class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t("email") }}:</span>
                <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">{{ booking.userEmail || $t("notProvided") }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-map-marker-alt text-[var(--Color-Text-Text-Brand)] w-4"></i>
                <span class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t("deliveryMethod") }}:</span>
                <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">
                  {{ booking.deliveryMethod === 'pickup' ? $t("pickupFromOwner") : $t("deliverToMyAddress") }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Method Section - Full Width -->
      <div class="mt-8 bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
        <h2 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">
          {{ $t("paymentMethod") }}
        </h2>
        <div class="space-y-4">
          <div class="space-y-3">
            <label class="flex items-center space-x-4 cursor-pointer p-3 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] hover:bg-[var(--Color-Surface-Surface-Primary)] transition-colors">
              <input
                type="radio"
                v-model="booking.paymentMethod"
                value="credit_card"
                class="text-[var(--Color-Text-Text-Brand)] focus:ring-[var(--Color-Text-Text-Brand)]"
              />
              <div class="flex items-center space-x-3">
                <img src="@/assets/6963703.png" alt="Credit Card" class="w-6 h-6 object-contain flex-shrink-0" />
                <span class="text-[var(--Color-Text-Text-Primary)] font-medium">{{ $t("creditCard") }}</span>
              </div>
            </label>
            
            <label class="flex items-center space-x-4 cursor-pointer p-3 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] hover:bg-[var(--Color-Surface-Surface-Primary)] transition-colors">
              <input
                type="radio"
                v-model="booking.paymentMethod"
                value="vodafone_cash"
                class="text-[var(--Color-Text-Text-Brand)] focus:ring-[var(--Color-Text-Text-Brand)]"
              />
              <div class="flex items-center space-x-3">
                <img src="@/assets/vodafone-logo-2017-1024x768.png" alt="Vodafone Cash" class="w-6 h-6 object-contain flex-shrink-0" />
                <span class="text-[var(--Color-Text-Text-Primary)] font-medium">{{ $t("vodafoneCash") }}</span>
              </div>
            </label>
            
            <label class="flex items-center space-x-4 cursor-pointer p-3 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] hover:bg-[var(--Color-Surface-Surface-Primary)] transition-colors">
              <input
                type="radio"
                v-model="booking.paymentMethod"
                value="etisalat_wallet"
                class="text-[var(--Color-Text-Text-Brand)] focus:ring-[var(--Color-Text-Text-Brand)]"
              />
              <div class="flex items-center space-x-3">
                <img src="@/assets/Etisalat-Logo.png" alt="Etisalat" class="w-6 h-6 object-contain flex-shrink-0" />
                <span class="text-[var(--Color-Text-Text-Primary)] font-medium">{{ $t("etisalatWallet") }}</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- OTP Form (Hidden by default) -->
      <div
        v-if="showOTPForm"
        class="mt-8 bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6"
      >
        <h2
          class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-4"
        >
          {{ $t("verifyPayment") }}
        </h2>
        <div class="space-y-4">
          <div>
            <label
              class="block text-sm font-medium text-[var(--Color-Text-Text-Secondary)] mb-2"
            >
              {{ $t("enterOTP") }}
            </label>
            <input
              v-model="booking.otp"
              type="text"
              @input="formatOtp"
              class="w-full p-3 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)]"
              placeholder="123456"
              pattern="[0-9]{6}"
            />
            <p
              class="text-sm text-[var(--Color-Text-Text-Secondary)] mt-2"
            >
              {{ $t("otpSentTo") }} {{ booking.phoneNumber }}
            </p>
          </div>
          <div class="flex space-x-4">
            <button
              @click="showOTPForm = false"
              class="flex-1 px-6 py-3 border border-[var(--Color-Boarder-Border-Primary)] text-[var(--Color-Text-Text-Primary)] rounded-lg hover:bg-[var(--Color-Surface-Surface-Secondary)] transition-colors"
            >
              {{ $t("back") }}
            </button>
            <button
              @click="verifyOTP"
              class="flex-1 bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] py-3 px-6 rounded-lg font-semibold hover:bg-[var(--Color-Surface-Surface-Brand)] transition-colors"
            >
              {{ $t("verifyOTP") }}
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Section -->
      <div class="mt-8 bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
        <h2 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">
          {{ $t("summary") }}
        </h2>
        <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-lg p-6 space-y-4">
          <div class="flex justify-between items-center border-b border-dashed border-[var(--Color-Boarder-Border-Primary)] pb-3">
            <span class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("subtotal") }}:</span>
            <span class="font-medium text-[var(--Color-Text-Text-Primary)]">{{ $t("egp") }} {{ calculateSubtotal() }}</span>
          </div>
          <div class="flex justify-between items-center border-b border-dashed border-[var(--Color-Boarder-Border-Primary)] pb-3">
            <span class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("deliveryFee") }}:</span>
            <span class="font-medium text-[var(--Color-Text-Text-Primary)]">
              {{ $t("egp") }} {{ calculateDeliveryFee() }}
              <span v-if="booking.renterLat && booking.lenderLat" class="text-xs text-[var(--Color-Text-Text-Secondary)] ml-2">
                ({{ calculateDistance(booking.lenderLat, booking.lenderLng, booking.renterLat, booking.renterLng).toFixed(1) }} km)
              </span>
            </span>
          </div>
          <div class="flex justify-between items-center border-b border-dashed border-[var(--Color-Boarder-Border-Primary)] pb-3">
            <span class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("serviceFee") }}:</span>
            <span class="font-medium text-[var(--Color-Text-Text-Primary)]">{{ $t("egp") }} 5.00</span>
          </div>
          <div class="flex justify-between items-center pt-3">
            <span class="text-xl font-bold text-[var(--Color-Text-Text-Primary)]">{{ $t("total") }}:</span>
            <span class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)]">{{ $t("egp") }} {{ calculateTotal() }}</span>
          </div>
        </div>

        <!-- Action Button -->
        <div class="mt-6">
          <button
            @click="submitBooking"
            :disabled="!auth.currentUser || !booking.startDate || !booking.endDate"
            class="w-full bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] py-4 px-8 rounded-lg font-semibold text-lg hover:bg-[var(--Color-Surface-Surface-Brand)] disabled:bg-[var(--Color-Surface-Surface-Secondary)] disabled:cursor-not-allowed transition-colors"
          >
            {{ $t("confirmRental") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <AppFooter />

    <!-- Address Selection Modal -->
    <div v-if="showAddressModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-4 border-b border-[var(--Color-Boarder-Border-Primary)]">
          <h3 class="text-lg font-semibold text-[var(--Color-Text-Text-Primary)]">{{ $t("selectDeliveryAddress") }}</h3>
          <button
            @click="showAddressModal = false"
            class="text-[var(--Color-Text-Text-Secondary)] hover:text-[var(--Color-Text-Text-Primary)] transition-colors p-1 rounded-lg hover:bg-[var(--Color-Surface-Surface-Secondary)]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-4 space-y-3">
          <!-- Address Entry -->
          <div>
            <label class="block text-sm font-medium text-[var(--Color-Text-Text-Secondary)] mb-1">
              {{ $t("address") }}
            </label>
            <input
              v-model="addressSearch"
              type="text"
              :placeholder="$t('enterYourAddress')"
              class="w-full p-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] focus:border-transparent transition-all"
              @input="searchAddress"
            />
          </div>

          <!-- Location Selection -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-[var(--Color-Text-Text-Secondary)]">
                {{ $t("locationSelection") }}
              </label>
              <button
                @click="getCurrentLocation"
                class="inline-flex items-center px-2 py-1 text-xs bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] rounded-lg hover:bg-[var(--Color-Surface-Surface-Brand)] hover:opacity-90 transition-all duration-200 font-medium"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {{ $t("useMyLocation") }}
              </button>
            </div>
            <div id="map" class="w-full h-48 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Secondary)]"></div>
          </div>

          <!-- Address Suggestions -->
          <div v-if="addressSuggestions.length > 0">
            <label class="block text-sm font-medium text-[var(--Color-Text-Text-Secondary)] mb-1">
              {{ $t("addressSuggestions") }}
            </label>
            <div class="space-y-1 max-h-24 overflow-y-auto">
              <button
                v-for="suggestion in addressSuggestions"
                :key="suggestion.display_name"
                @click="selectAddress(suggestion)"
                class="w-full text-left p-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] hover:bg-[var(--Color-Surface-Surface-Secondary)] hover:border-[var(--Color-Text-Text-Brand)] transition-all duration-200 group"
              >
                <div class="text-sm text-[var(--Color-Text-Text-Primary)] font-medium group-hover:text-[var(--Color-Text-Text-Brand)] transition-colors">
                  {{ suggestion.display_name }}
                </div>
                <div class="text-xs text-[var(--Color-Text-Text-Secondary)] mt-0.5">
                  {{ $t("clickToSelectAddress") }}
                </div>
              </button>
            </div>
          </div>

          <!-- Selected Address Display -->
          <div v-if="selectedAddress" class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Text-Text-Brand)] rounded-lg p-3">
            <div class="flex items-start space-x-2">
              <svg class="w-4 h-4 text-[var(--Color-Text-Text-Brand)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <div class="text-xs font-medium text-[var(--Color-Text-Text-Secondary)] mb-0.5">{{ $t("selectedAddress") }}:</div>
                <div class="text-sm text-[var(--Color-Text-Text-Primary)]">{{ selectedAddress }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex space-x-3 p-4 border-t border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)]">
          <button
            @click="showAddressModal = false"
            class="flex-1 px-4 py-2 border border-[var(--Color-Boarder-Border-Primary)] text-[var(--Color-Text-Text-Primary)] bg-[var(--Color-Surface-Surface-Secondary)] rounded-lg hover:bg-[var(--Color-Surface-Surface-Primary)] transition-all duration-200 font-medium"
          >
            {{ $t("cancel") }}
          </button>
          <button
            @click="confirmAddress"
            :disabled="!selectedAddress"
            class="flex-1 px-4 py-2 bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] rounded-lg hover:bg-[var(--Color-Surface-Surface-Brand)] hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {{ $t("confirmAddress") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AppFooter from "@/components/pages/AppFooter.vue";
import SearchBar from "@/components/pages/SearchBar.vue";
import Navbar from "@/components/pages/Navbar.vue";
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


const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const product = ref(null);

// SearchBar reactive variables
const searchQuery = ref("");
const selectedLocation = ref("");

// Modal and map related refs
const showOTPForm = ref(false);
const showAddressModal = ref(false);
const addressSearch = ref("");
const addressSuggestions = ref([]);
const selectedAddress = ref("");
const map = ref(null);
const marker = ref(null);
const mapInitialized = ref(false);

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
  // Location coordinates
  renterLat: null,
  renterLng: null,
  lenderLat: null,
  lenderLng: null,
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
      
      // Check if current user is the product owner
      if (auth.currentUser && auth.currentUser.uid === booking.value.sellerId) {
        Swal.fire({
          icon: "warning",
          title: t("cannotBookOwnProduct"),
          text: t("cannotBookOwnProductMessage"),
          confirmButtonText: "OK",
          background: 'var(--Color-Surface-Surface-Primary)',
          color: 'var(--Color-Text-Text-Primary)',
          confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
          iconColor: '#f59e0b'
        }).then(() => {
          router.push("/all-products");
        });
        return;
      }
      
      await loadSellerDetails(booking.value.sellerId);
    } else {
      console.error("No such product!");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Product not found.",
        confirmButtonText: "OK",
        background: 'var(--Color-Surface-Surface-Primary)',
        color: 'var(--Color-Text-Text-Primary)',
        confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
        iconColor: '#ef4444'
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
      background: 'var(--Color-Surface-Surface-Primary)',
      color: 'var(--Color-Text-Text-Primary)',
      confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
      iconColor: '#ef4444'
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
      
      // Get seller's location (if available in user profile)
      if (sellerData.latitude && sellerData.longitude) {
        booking.value.lenderLat = sellerData.latitude;
        booking.value.lenderLng = sellerData.longitude;
        console.log('Seller location found:', sellerData.latitude, sellerData.longitude);
      } else {
        // Default to Cairo center if seller location not available
        booking.value.lenderLat = 30.0444;
        booking.value.lenderLng = 31.2357;
        console.log('Using default seller location (Cairo center)');
      }
    } else {
      console.error("No such user!");
      booking.value.sellerName = "Unknown Seller";
      booking.value.sellerImage = "https://via.placeholder.com/40";
      // Default to Cairo center
      booking.value.lenderLat = 30.0444;
      booking.value.lenderLng = 31.2357;
    }
  } catch (error) {
    console.error("Error loading seller details:", error);
    booking.value.sellerName = "Unknown Seller";
    booking.value.sellerImage = "https://via.placeholder.com/40";
    // Default to Cairo center
    booking.value.lenderLat = 30.0444;
    booking.value.lenderLng = 31.2357;
  }
};

const loadUserDetails = async () => {
  if (auth.currentUser) {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        // Auto-populate personal information from user account
        booking.value.userName = userData.displayName || userData.name || "";
        booking.value.userEmail = userData.email || auth.currentUser.email || "";
        booking.value.phoneNumber = userData.phoneNumber || userData.phone || "";
      }
    } catch (error) {
      console.error("Error loading user details:", error);
    }
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
  const days = diffTime + 1; // Include both start and end dates
  return days;
};

const calculateSubtotal = () => {
  if (!booking.value.startDate || !booking.value.endDate) {
    return 0;
  }
  const start = new Date(booking.value.startDate);
  const end = new Date(booking.value.endDate);
  const diffTime = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const days = diffTime + 1; // Include both start and end dates
  const pricePerDay = booking.value.productPrice || 0;
  const subtotal = days * pricePerDay;
  return subtotal;
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

const calculateDeliveryFee = () => {
  if (booking.value.deliveryMethod === 'pickup') {
    return "0.00";
  }
  
  if (booking.value.deliveryMethod === 'delivery') {
    // Check if we have both renter and lender coordinates
    if (booking.value.renterLat && booking.value.renterLng && 
        booking.value.lenderLat && booking.value.lenderLng) {
      
      // Calculate real distance between renter and lender
      const distance = calculateDistance(
        booking.value.lenderLat, 
        booking.value.lenderLng,
        booking.value.renterLat, 
        booking.value.renterLng
      );
      
      // Base delivery fee
      const baseFee = 25;
      
      // Distance-based fee (5 EGP per km, max 200 EGP)
      const distanceFee = Math.min(distance * 5, 200);
      
      console.log(`Distance: ${distance.toFixed(2)} km, Fee: ${(baseFee + distanceFee).toFixed(2)} EGP`);
      
      return (baseFee + distanceFee).toFixed(2);
    }
    
    // Fallback: if coordinates not available, use address-based calculation
    const address = booking.value.deliveryAddress || '';
    if (address.trim() === '') {
      return "0.00";
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
    
    return (baseFee + distanceFee).toFixed(2);
  }
  
  return "0.00";
};

const calculateTotal = () => {
  const subtotal = calculateSubtotal();
  const deliveryFee = parseFloat(calculateDeliveryFee());
  const serviceFee = 5; // Fixed service fee
  const total = subtotal + deliveryFee + serviceFee;
  return total.toFixed(2);
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
      background: 'var(--Color-Surface-Surface-Primary)',
      color: 'var(--Color-Text-Text-Primary)',
      confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
      iconColor: '#f59e0b'
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





const confirmAddress = () => {
  if (selectedAddress.value) {
    booking.value.deliveryAddress = selectedAddress.value;
    showAddressModal.value = false;
    selectedAddress.value = "";
    addressSearch.value = "";
    addressSuggestions.value = [];
  }
};

// Map initialization function
const initializeMap = () => {
  return new Promise((resolve, reject) => {
    try {
      // Wait for DOM to be ready
      nextTick(() => {
        // Check if Leaflet is available
        if (typeof L === 'undefined') {
          console.warn('Leaflet not loaded');
          reject(new Error('Leaflet not loaded'));
          return;
        }
        
        // Check if map container exists
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
          console.warn('Map container not found');
          reject(new Error('Map container not found'));
          return;
        }
        
        if (mapInitialized.value) {
          resolve();
          return;
        }
        
        // Fix Leaflet marker icon issue
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        
        // Initialize map centered on Cairo, Egypt
        map.value = L.map('map').setView([30.0444, 31.2357], 10);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map.value);
        
        // Add a default marker
        marker.value = L.marker([30.0444, 31.2357]).addTo(map.value);
        
        // Handle map clicks to place marker
        map.value.on('click', (e) => {
          const { lat, lng } = e.latlng;
          
          // Remove existing marker
          if (marker.value && map.value) {
            try {
              map.value.removeLayer(marker.value);
            } catch (error) {
              console.warn('Error removing marker:', error);
            }
          }
          
          // Add new marker
          if (map.value) {
            marker.value = L.marker([lat, lng]).addTo(map.value);
            
            // Reverse geocode to get address
            reverseGeocode(lat, lng);
          }
        });
        
        mapInitialized.value = true;
        resolve();
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      reject(error);
    }
  });
};

// Location functions
const getLocationFromAddress = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=eg&limit=1`
    );
    const data = await response.json();
    
    if (data.length > 0) {
      const location = data[0];
      booking.value.renterLat = parseFloat(location.lat);
      booking.value.renterLng = parseFloat(location.lon);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error getting location from address:', error);
    return false;
  }
};

const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`
    );
    const data = await response.json();
    
    // Store renter coordinates
    booking.value.renterLat = lat;
    booking.value.renterLng = lng;
    
    if (data.display_name) {
      selectedAddress.value = data.display_name;
      addressSearch.value = data.display_name;
      
      // Show a brief notification about the address accuracy
      if (data.address) {
        const addressParts = [];
        if (data.address.house_number) addressParts.push(data.address.house_number);
        if (data.address.road) addressParts.push(data.address.road);
        if (data.address.suburb) addressParts.push(data.address.suburb);
        if (data.address.city) addressParts.push(data.address.city);
        
        if (addressParts.length > 0) {
          console.log('Reverse geocoded address:', data.display_name);
          console.log('Address components:', addressParts);
        }
      }
    } else {
      // If no address found, show coordinates as fallback
      selectedAddress.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      addressSearch.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    // Fallback to coordinates
    selectedAddress.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    addressSearch.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};

const searchAddress = async () => {
  if (!addressSearch.value.trim()) {
    addressSuggestions.value = [];
    return;
  }
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressSearch.value)}&countrycodes=eg&limit=5`
    );
    const data = await response.json();
    
    addressSuggestions.value = data.map(item => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon)
    }));
  } catch (error) {
    console.error('Error searching addresses:', error);
    // Fallback to sample data
    const sampleAddresses = [
      "123 Main Street, Cairo, Egypt",
      "456 Nile Corniche, Cairo, Egypt",
      "789 Zamalek, Cairo, Egypt",
      "321 Heliopolis, Cairo, Egypt",
      "654 Maadi, Cairo, Egypt"
    ];
    
    addressSuggestions.value = sampleAddresses.map(address => ({
      display_name: address,
      lat: 30.0444,
      lon: 31.2357
    }));
  }
};

const selectAddress = (addressData) => {
  selectedAddress.value = addressData.display_name;
  addressSearch.value = addressData.display_name;
  
  // Store renter coordinates
  booking.value.renterLat = addressData.lat;
  booking.value.renterLng = addressData.lon;
  
  // Update map marker
  if (map.value && marker.value) {
    try {
      map.value.removeLayer(marker.value);
      marker.value = L.marker([addressData.lat, addressData.lon]).addTo(map.value);
      map.value.setView([addressData.lat, addressData.lon], 15);
    } catch (error) {
      console.warn('Error updating map marker:', error);
    }
  }
  
  addressSuggestions.value = [];
};

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    console.warn("Geolocation not supported. Please enter your address manually.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      
      // Store renter coordinates
      booking.value.renterLat = latitude;
      booking.value.renterLng = longitude;
      
      // Update map to user's location
      if (map.value) {
        try {
          map.value.setView([latitude, longitude], 16);
          
          // Remove existing marker
          if (marker.value) {
            map.value.removeLayer(marker.value);
          }
          
          // Add new marker at user's location
          marker.value = L.marker([latitude, longitude]).addTo(map.value);
        } catch (error) {
          console.warn('Error updating map:', error);
        }
      }
      
      // Get address from coordinates
      reverseGeocode(latitude, longitude);
      
      // No popup - location is set silently
    },
    (error) => {
      let errorMessage = "Unable to get your location.";
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location access was denied. Please allow location access in your browser settings.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable. Please try again.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out. Please try again.";
          break;
      }
      
      console.warn(errorMessage);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 30000
    }
  );
};

const clearLocation = () => {
  if (map.value) {
    // Remove marker
    if (marker.value) {
      map.value.removeLayer(marker.value);
      marker.value = null;
    }
    
    // Remove accuracy circle if it exists
    map.value.eachLayer((layer) => {
      if (layer instanceof L.Circle) {
        map.value.removeLayer(layer);
      }
    });
    
    // Reset to default view (Cairo)
    map.value.setView([30.0444, 31.2357], 10);
    
    // Clear selected address
    selectedAddress.value = "";
    addressSearch.value = "";
    
    Swal.fire({
      icon: "info",
      title: "Location Cleared",
      text: "The location has been cleared. You can now manually select a location on the map or search for an address.",
      confirmButtonText: "OK",
      background: 'var(--Color-Surface-Surface-Primary)',
      color: 'var(--Color-Text-Text-Primary)',
      confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
      iconColor: '#3b82f6'
    });
  }
};

const showLocationHelp = () => {
  Swal.fire({
    icon: "info",
    title: "Location Accuracy Help",
    html: `
      <div class="text-left">
        <p class="mb-3">If your location is not accurate, here are some solutions:</p>
        
        <div class="space-y-3">
          <div class="bg-blue-50 p-3 rounded-lg">
            <h4 class="font-medium text-blue-800 mb-1">🔍 Manual Location Selection</h4>
            <p class="text-sm text-blue-700">Click anywhere on the map to set your exact location</p>
          </div>
          
          <div class="bg-green-50 p-3 rounded-lg">
            <h4 class="font-medium text-green-800 mb-1">📝 Search for Address</h4>
            <p class="text-sm text-green-700">Use the search bar above to find your exact address</p>
          </div>
          
          <div class="bg-yellow-50 p-3 rounded-lg">
            <h4 class="font-medium text-yellow-800 mb-1">📱 Improve GPS Accuracy</h4>
            <ul class="text-sm text-yellow-700 list-disc list-inside">
              <li>Go outside or near a window</li>
              <li>Wait 10-30 seconds for GPS to lock</li>
              <li>Enable high accuracy mode on your device</li>
              <li>Try on a mobile device (better GPS)</li>
            </ul>
          </div>
          
          <div class="bg-purple-50 p-3 rounded-lg">
            <h4 class="font-medium text-purple-800 mb-1">🌐 Browser Issues</h4>
            <ul class="text-sm text-purple-700 list-disc list-inside">
              <li>Allow location access when prompted</li>
              <li>Try refreshing the page</li>
              <li>Check browser location settings</li>
              <li>Try a different browser</li>
            </ul>
          </div>
        </div>
        
        <p class="mt-3 text-sm text-gray-600">The most reliable method is to manually click on the map or search for your address.</p>
      </div>
    `,
    confirmButtonText: "Got it",
    background: 'var(--Color-Surface-Surface-Primary)',
    color: 'var(--Color-Text-Text-Primary)',
    confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
    iconColor: '#3b82f6'
  });
};



// Clean up map on component unmount
onMounted(() => {
  // Component mounted
});

onUnmounted(() => {
  // Component unmounted
});

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
      background: 'var(--Color-Surface-Surface-Primary)',
      color: 'var(--Color-Text-Text-Primary)',
      confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
      iconColor: '#10b981'
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
      background: 'var(--Color-Surface-Surface-Primary)',
      color: 'var(--Color-Text-Text-Primary)',
      confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
      iconColor: '#ef4444'
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
      background: 'var(--Color-Surface-Surface-Primary)',
      color: 'var(--Color-Text-Text-Primary)',
      confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
      iconColor: '#f59e0b'
    });
    return;
  }

  // Check if user is trying to book their own product
  if (auth.currentUser.uid === booking.value.sellerId) {
    Swal.fire({
      icon: "warning",
      title: t("cannotBookOwnProduct"),
      text: t("cannotBookOwnProductMessage"),
      confirmButtonText: "OK",
      background: 'var(--Color-Surface-Surface-Primary)',
      color: 'var(--Color-Text-Text-Primary)',
      confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
      iconColor: '#f59e0b'
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
        background: 'var(--Color-Surface-Surface-Primary)',
        color: 'var(--Color-Text-Text-Primary)',
        confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
        iconColor: '#f59e0b'
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
        background: 'var(--Color-Surface-Surface-Primary)',
        color: 'var(--Color-Text-Text-Primary)',
        confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
        iconColor: '#f59e0b'
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
          background: 'var(--Color-Surface-Surface-Primary)',
          color: 'var(--Color-Text-Text-Primary)',
          confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
          iconColor: '#f59e0b'
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
          background: 'var(--Color-Surface-Surface-Primary)',
          color: 'var(--Color-Text-Text-Primary)',
          confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
          iconColor: '#f59e0b'
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
        background: 'var(--Color-Surface-Surface-Primary)',
        color: 'var(--Color-Text-Text-Primary)',
        confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
        iconColor: '#3b82f6'
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
      background: 'var(--Color-Surface-Surface-Primary)',
      color: 'var(--Color-Text-Text-Primary)',
      confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
      iconColor: '#ef4444'
    });
  }
};
const createBooking = async () => {
  try {
    // Check if user is verified
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      Swal.fire({
        icon: "error",
        title: "User Not Found",
        text: "Your user profile could not be found. Please contact support.",
        confirmButtonText: "OK",
        background: 'var(--Color-Surface-Surface-Primary)',
        color: 'var(--Color-Text-Text-Primary)',
        confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
        iconColor: '#ef4444'
      });
      return;
    }

    const userData = userDoc.data();

    // Update product status to pending
    const productRef = doc(db, "products", booking.value.productId);
    await updateDoc(productRef, { status: "pending" });

    // Get seller contact details
    let sellerContactInfo = {};
    try {
      const sellerDocRef = doc(db, "users", booking.value.sellerId);
      const sellerDocSnap = await getDoc(sellerDocRef);
      if (sellerDocSnap.exists()) {
        const sellerData = sellerDocSnap.data();
        sellerContactInfo = {
          sellerPhone: sellerData.phoneNumber || sellerData.phone || "",
          sellerEmail: sellerData.email || "",
          sellerAddress: sellerData.address || product.value.location || "Cairo, Egypt",
          sellerName: sellerData.displayName || booking.value.sellerName,
        };
      }
    } catch (error) {
      console.error("Error loading seller contact info:", error);
      sellerContactInfo = {
        sellerPhone: "",
        sellerEmail: "",
        sellerAddress: product.value.location || "Cairo, Egypt",
        sellerName: booking.value.sellerName,
      };
    }

    // Create booking
    booking.value.userId = auth.currentUser.uid;
    booking.value.timestamp = serverTimestamp();

    const bookingsRef = collection(db, "bookings");
    await setDoc(doc(bookingsRef), {
      ...booking.value,
      productTitle: product.value.title,
      productImage: product.value.image1 || product.value.image2 || product.value.image3 || '',
      sellerName: booking.value.sellerName,
      // Add seller contact information
      sellerContactInfo: sellerContactInfo,
      contactDetailsSent: true,
      // Add initial status history
      statusHistory: [{
        status: 'pending',
        timestamp: serverTimestamp(),
        updatedBy: 'system'
      }]
    });

    Swal.fire({
      icon: "success",
      title: "Booking Confirmed!",
      text:
        "Your rental has been successfully confirmed. You will receive a confirmation email shortly.",
      confirmButtonText: "OK",
      background: 'var(--Color-Surface-Surface-Primary)',
      color: 'var(--Color-Text-Text-Primary)',
      confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
      iconColor: '#10b981'
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
      background: 'var(--Color-Surface-Surface-Primary)',
      color: 'var(--Color-Text-Text-Primary)',
      confirmButtonColor: 'var(--Color-Surface-Surface-Brand)',
      iconColor: '#ef4444'
    });
  }
};



// Watch for changes in dates and delivery method to update total price
watch(
  [
    () => booking.value.startDate,
    () => booking.value.endDate,
    () => booking.value.deliveryMethod,
    () => booking.value.deliveryAddress
  ],
  () => {
    if (booking.value.startDate && booking.value.endDate) {
      // Calculate and update the total price in the booking object
      const total = parseFloat(calculateTotal());
      booking.value.totalPrice = total;
      booking.value.deliveryFee = parseFloat(calculateDeliveryFee());
    } else {
      booking.value.totalPrice = 0;
      booking.value.deliveryFee = 0;
    }
  }
);

// Watch for modal opening to initialize map
watch(showAddressModal, (newValue) => {
  if (newValue) {
    // Initialize map after modal opens
    setTimeout(() => {
      if (showAddressModal.value) {
        initializeMap().catch(error => {
          console.error('Error initializing map:', error);
        });
      }
    }, 100);
  } else {
    // Clean up map when modal closes
    if (map.value) {
      try {
        map.value.remove();
      } catch (error) {
        console.warn('Error removing map:', error);
      }
      map.value = null;
      marker.value = null;
      mapInitialized.value = false;
    }
  }
});

onMounted(() => {
  loadProduct();
  loadUserDetails(); // Load user details to auto-populate personal information

  // Get dates from route query parameters
  if (route.query.startDate) {
    booking.value.startDate = route.query.startDate;
  }
  if (route.query.endDate) {
    booking.value.endDate = route.query.endDate;
  }
});
</script>
