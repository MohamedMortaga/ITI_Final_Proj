<template>
  <div
    class="min-h-screen flex flex-col px-4 lg:px-6 xl:px-[88px] overflow-x-hidden"
    :style="{
      backgroundColor: 'var(--Color-Surface-Surface-Primary)',
      color: 'var(--Color-Text-Text-Primary)',
    }"
  >
    <!-- Search Bar -->
    <SearchBar 
      v-model:searchQuery="searchQuery" 
      v-model:selectedLocation="selectedLocation"
    />

    <!-- Full-width divider that ignores parent padding -->
    <div
      class="border-t border-[var(--Color-Boarder-Border-Primary)] w-screen -ml-4 lg:-ml-6 xl:-ml-[88px]"
    ></div>

    <!-- Category Filter -->
    <CategoryButtons
      :categories="categories"
      :selectedCategory="selectedCategory"
      @update:selectedCategory="selectedCategory = $event"
    />

    <!-- Hero Banner -->
    <HeroBanner class="px-2 lg:px-4" />

    <!-- Recommended Products -->
    <div class="container mx-auto px-2 lg:px-4 mt-8 flex-grow overflow-hidden">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg lg:text-xl font-bold text-[var(--Color-Text-Text-Brand)]">
          {{ $t("recommendedForYou") }}
        </h2>
        <router-link
          to="/all-products"
          class="text-[var(--Color-Text-Text-Brand)] font-medium hover:underline text-sm lg:text-base"
        >
          {{ $t("viewAll") }}
        </router-link>
      </div>
      <div
        v-if="filteredProducts.length === 0"
        class="text-center text-gray-400 text-lg lg:text-xl py-12"
      >
        {{ $t("noProductsFound") }}
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        <ProductCard
          v-for="product in filteredProducts.slice(0, 8)"
          :key="product.id"
          :product="product"
          :isAuthenticated="isAuthenticated"
          :promptLogin="promptLogin"
        />
      </div>
      <!-- Share Banner -->
      <ShareBanner />
    </div>

    <CustomerReviews :reviews="formattedReviews" v-if="formattedReviews.length > 0" />

    <!-- Why Rento Section -->
    <WhyRento class="px-2 lg:px-4" />

    <!-- Subscription Plans Section -->
    <div class="max-w-7xl mx-auto px-4 py-16 overflow-hidden">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold mb-4">
          <span class="text-[var(--Color-Text-Text-Primary)]">{{ $t("chooseYour") }}</span>
          <span class="text-[var(--Color-Text-Text-Brand)]">{{ $t("plan") }}</span>
          <span class="text-[var(--Color-Text-Text-Primary)]">{{ $t("now") }}!</span>
        </h2>
        <p class="text-lg lg:text-xl text-[var(--Color-Text-Text-Secondary)] max-w-3xl mx-auto">
          {{ $t("subscriptionDescription") }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <!-- Basic Plan -->
        <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 lg:p-8 relative hover:shadow-lg transition-all duration-300">
          <div class="text-center mb-6 lg:mb-8">
            <h3 class="text-xl lg:text-2xl font-bold text-[var(--Color-Text-Text-Primary)] mb-2">{{ $t("basic") }}</h3>
            <p class="text-sm lg:text-base text-[var(--Color-Text-Text-Secondary)] mb-4 lg:mb-6">{{ $t("basicDescription") }}</p>
            <div class="mb-4 lg:mb-6">
              <span class="text-3xl lg:text-4xl font-bold text-[var(--Color-Text-Text-Brand)]">$0</span>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Secondary)]">/month</span>
            </div>
          </div>
          
          <ul class="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("accessToBasicTools") }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("standardCustomerSupport") }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("basicRentalInsurance") }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("hourRentalPeriods") }}</span>
            </li>
          </ul>
          
          <button class="w-full bg-[var(--Color-Text-Text-Brand)] text-white py-2 lg:py-3 rounded-lg text-sm lg:text-base font-semibold hover:opacity-90 transition-colors">
            {{ $t("getStartedFree") }}
          </button>
        </div>

        <!-- Pro Plan -->
        <div class="bg-[var(--Color-Surface-Surface-Primary)] border-2 border-[var(--Color-Text-Text-Brand)] rounded-xl p-6 lg:p-8 relative hover:shadow-lg transition-all duration-300 transform scale-105">
          <div class="absolute -top-3 lg:-top-4 left-1/2 transform -translate-x-1/2">
            <span class="bg-[var(--Color-Text-Text-Brand)] text-white px-3 lg:px-4 py-1 rounded-full text-xs lg:text-sm font-semibold">{{ $t("mostPopular") }}</span>
          </div>
          
          <div class="text-center mb-6 lg:mb-8">
            <h3 class="text-xl lg:text-2xl font-bold text-[var(--Color-Text-Text-Primary)] mb-2">{{ $t("pro") }}</h3>
            <p class="text-sm lg:text-base text-[var(--Color-Text-Text-Secondary)] mb-4 lg:mb-6">{{ $t("proDescription") }}</p>
            <div class="mb-4 lg:mb-6">
              <span class="text-3xl lg:text-4xl font-bold text-[var(--Color-Text-Text-Brand)]">$19</span>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Secondary)]">/month</span>
            </div>
          </div>
          
          <ul class="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("everythingInBasic") }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("priorityCustomerSupport") }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("enhancedRentalInsurance") }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("flexibleRentalPeriods") }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("noBookingFees") }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("earlyAccessToNewTools") }}</span>
            </li>
          </ul>
          
          <button class="w-full bg-[var(--Color-Text-Text-Brand)] text-white py-2 lg:py-3 rounded-lg text-sm lg:text-base font-semibold hover:opacity-90 transition-colors">
            {{ $t("startProPlan") }}
          </button>
        </div>

        <!-- Premium Plan -->
        <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 lg:p-8 relative hover:shadow-lg transition-all duration-300 md:col-span-2 lg:col-span-1">
          <div class="text-center mb-6 lg:mb-8">
            <h3 class="text-xl lg:text-2xl font-bold text-[var(--Color-Text-Text-Primary)] mb-2">{{ $t("premium") }}</h3>
            <p class="text-sm lg:text-base text-[var(--Color-Text-Text-Secondary)] mb-4 lg:mb-6">{{ $t("premiumDescription") }}</p>
            <div class="mb-4 lg:mb-6">
              <span class="text-3xl lg:text-4xl font-bold text-[var(--Color-Text-Text-Brand)]">$49</span>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Secondary)]">/month</span>
            </div>
          </div>
          
          <ul class="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("everythingInPro") }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("dedicatedSupport") }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("premiumRentalInsurance") }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("unlimitedRentalPeriods") }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("priorityBooking") }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("exclusiveToolsAccess") }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--Color-Text-Text-Brand)] rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
              <span class="text-sm lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("analyticsDashboard") }}</span>
            </li>
          </ul>
          
          <button class="w-full bg-[var(--Color-Text-Text-Brand)] text-white py-2 lg:py-3 rounded-lg text-sm lg:text-base font-semibold hover:opacity-90 transition-colors">
            {{ $t("startPremiumPlan") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Features Comparison Section -->
    <div class="bg-[var(--Color-Surface-Surface-Primary)] py-16 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl lg:text-4xl font-bold text-center mb-8 lg:mb-12">
          <span class="text-[var(--Color-Text-Text-Primary)]">{{ $t("compare") }}</span>
          <span class="text-[var(--Color-Text-Text-Brand)]">{{ $t("features") }}</span>
        </h2>
        
        <div class="overflow-x-auto border border-[var(--Color-Boarder-Border-Primary)] rounded-lg bg-[var(--Color-Surface-Surface-Primary)]">
          <table class="w-full">
            <thead>
              <tr class="border-b border-[var(--Color-Boarder-Border-Primary)]">
                <th class="text-left py-3 lg:py-4 px-2 lg:px-6 text-xs lg:text-base text-[var(--Color-Text-Text-Primary)] font-semibold">{{ $t("feature") }}</th>
                <th class="text-center py-3 lg:py-4 px-1 lg:px-6 text-xs lg:text-base text-[var(--Color-Text-Text-Primary)] font-semibold">{{ $t("basic") }}</th>
                <th class="text-center py-3 lg:py-4 px-1 lg:px-6 text-xs lg:text-base text-[var(--Color-Text-Text-Brand)] font-semibold">{{ $t("pro") }}</th>
                <th class="text-center py-3 lg:py-4 px-1 lg:px-6 text-xs lg:text-base text-[var(--Color-Text-Text-Primary)] font-semibold">{{ $t("premium") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-[var(--Color-Boarder-Border-Primary)]">
                <td class="py-3 lg:py-4 px-2 lg:px-6 text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("monthlyPrice") }}</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">$0</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Brand)]">$19</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">$49</td>
              </tr>
              <tr class="border-b border-[var(--Color-Boarder-Border-Primary)]">
                <td class="py-3 lg:py-4 px-2 lg:px-6 text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("customerSupport") }}</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("standard") }}</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Brand)]">{{ $t("priority") }}</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("dedicatedSupport") }}</td>
              </tr>
              <tr class="border-b border-[var(--Color-Boarder-Border-Primary)]">
                <td class="py-3 lg:py-4 px-2 lg:px-6 text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("rentalInsurance") }}</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("basic") }}</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Brand)]">{{ $t("enhanced") }}</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("premium") }}</td>
              </tr>
              <tr class="border-b border-[var(--Color-Boarder-Border-Primary)]">
                <td class="py-3 lg:py-4 px-2 lg:px-6 text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("bookingFees") }}</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("perBooking") }}</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Brand)]">{{ $t("free") }}</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("free") }}</td>
              </tr>
              <tr class="border-b border-[var(--Color-Boarder-Border-Primary)]">
                <td class="py-3 lg:py-4 px-2 lg:px-6 text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("rentalPeriods") }}</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("hoursMax") }}</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Brand)]">{{ $t("flexible") }}</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("unlimited") }}</td>
              </tr>
              <tr class="border-b border-[var(--Color-Boarder-Border-Primary)]">
                <td class="py-3 lg:py-4 px-2 lg:px-6 text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("toolAccess") }}</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("basicTools") }}</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Brand)]">{{ $t("allToolsEarlyAccess") }}</td>
                <td class="py-3 lg:py-4 px-1 lg:px-6 text-center text-xs lg:text-base text-[var(--Color-Text-Text-Primary)]">{{ $t("allToolsExclusive") }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <AppFooter class="pt-16" />
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";
import { useGlobalRealTime } from "@/composables/useGlobalRealTime";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import Swal from "sweetalert2";

// Components
import SearchBar from "@/components/pages/SearchBar.vue";
import CategoryButtons from "@/components/pages/CategoryButtons.vue";
import ProductCard from "@/components/pages/ProductCard.vue";
import HeroBanner from "@/components/pages/HeroBanner.vue";
import CustomerReviews from "@/components/pages/CustomerReviews.vue";
import WhyRento from "@/components/pages/WhyRento.vue";
import MissionVisionValues from "@/components/pages/MissionVisionValues.vue";
import AppFooter from "@/components/pages/AppFooter.vue";
import ShareBanner from "@/components/pages/ShareBanner.vue";

export default {
  name: "HomePage",
  components: {
    SearchBar,
    CategoryButtons,
    ProductCard,
    CustomerReviews,
    WhyRento,
    MissionVisionValues,
    AppFooter,
    HeroBanner,
    ShareBanner,
  },
  setup() {
    const { approvedProducts, webReviews } = useGlobalRealTime();
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const selectedLocation = ref("");
    const displayName = ref("");
    const isAuthenticated = ref(false);
    const categories = ref([]);
    const auth = getAuth();
    const router = useRouter();
    const allProducts = ref([]);

    const formattedReviews = computed(() => {
      if (!webReviews.value) return [];
      return webReviews.value
        .filter((review) => review.rate && review.review)
        .map((review) => ({
          id: review.id,
          rating: Number(review.rate) || 5,
          comment: review.review,
          userImage: review.userImage || require("@/assets/default.png"),
          userName: review.userName || "Anonymous",
          date: review.timestamp
            ? new Date(review.timestamp.seconds * 1000).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Recently",
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    const loadCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      categories.value = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((cat) => cat.status !== 'inactive') // Only show active categories
        .map((cat) => cat.name)
        .sort((a, b) => a.localeCompare(b));
    };

    const promptLogin = () => {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Please log in to continue",
        showConfirmButton: true,
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push({ name: "Login" });
        }
      });
    };

    const calculateAverageRating = async (productId) => {
      const reviewsRef = collection(db, "user-reviews");
      const q = query(reviewsRef, where("productId", "==", productId));
      const querySnapshot = await getDocs(q);
      const productReviews = querySnapshot.docs.map((doc) => doc.data());
      if (productReviews.length === 0) return "0";
      const sum = productReviews.reduce((acc, review) => acc + (review.rate || 0), 0);
      return (sum / productReviews.length).toFixed(1);
    };

    const loadProductsWithRatings = async () => {
      if (!approvedProducts.value) return;

      const productsWithRatings = await Promise.all(
        approvedProducts.value.map(async (product) => {
          const avgRating = await calculateAverageRating(product.id);
          return { ...product, rating: parseFloat(avgRating) || 0 };
        })
      );

      allProducts.value = productsWithRatings
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
    };

    onMounted(() => {
      loadCategories();
      loadProductsWithRatings();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          isAuthenticated.value = true;
          displayName.value = user.displayName || "User";
        } else {
          isAuthenticated.value = false;
          displayName.value = "Guest";
        }
      });
    });

    const filteredProducts = computed(() => {
      let filtered = [...allProducts.value];
      if (selectedCategory.value) {
        filtered = filtered.filter(
          (product) => product.category === selectedCategory.value
        );
      }
      if (selectedLocation.value) {
        filtered = filtered.filter(
          (product) => product.location === selectedLocation.value
        );
      }
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter((product) =>
          product.title?.toLowerCase().includes(query)
        );
      }
      return filtered;
    });

    watch([approvedProducts, selectedCategory, selectedLocation, searchQuery], () => {
      loadProductsWithRatings();
    });

    return {
      searchQuery,
      selectedCategory,
      selectedLocation,
      filteredProducts,
      displayName,
      categories,
      isAuthenticated,
      promptLogin,
      formattedReviews,
    };
  },
};
</script>

<style scoped>
/* No additional styles needed - all styling is handled by Tailwind */
</style>
