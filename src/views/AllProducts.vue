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
      class=" w-screen -ml-4 lg:-ml-6 xl:-ml-[88px]"
    ></div>

    <!-- Category Buttons -->
    <CategoryButtons
      :categories="categories"
      :selectedCategory="selectedCategory"
      @update:selectedCategory="selectedCategory = $event"
    />

    <!-- Products Section -->
    <div class="w-full max-w-full mt-8">
      <h2 class="text-xl font-bold text-[var(--Color-Text-Text-Brand)] mb-4">
        {{ $t("allProducts") }}
      </h2>

      <div
        v-if="filteredProducts.length === 0"
        class="text-center text-gray-400 text-xl py-12"
      >
        {{ $t("noProductsFound") }}
      </div>

      <div v-else>
        <!-- Products Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          <ProductCard
            v-for="product in paginatedProducts"
            :key="product.id"
            :product="product"
            :isAuthenticated="isAuthenticated"
            :promptLogin="promptLogin"
          />
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex justify-center items-center mt-8 mb-16">
          <div class="flex items-center space-x-2" :class="{ 'space-x-reverse': $i18n.locale === 'ar' }">
            <!-- Previous Button -->
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm font-medium text-[var(--Color-Text-Text-Primary)] bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-md hover:bg-[var(--Color-Surface-Surface-Secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
            >
              {{ $t("previous") }}
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center space-x-1" :class="{ 'space-x-reverse': $i18n.locale === 'ar' }">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  page === currentPage
                    ? 'bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)]'
                    : 'text-[var(--Color-Text-Text-Primary)] bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] hover:bg-[var(--Color-Surface-Surface-Secondary)]'
                ]"
                :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
              >
                {{ page }}
              </button>
            </div>

            <!-- Next Button -->
            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm font-medium text-[var(--Color-Text-Text-Primary)] bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-md hover:bg-[var(--Color-Surface-Surface-Secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
            >
              {{ $t("next") }}
            </button>
          </div>
        </div>

        <!-- Products Count Info -->
        <div v-if="filteredProducts.length > 0" class="text-center text-sm text-[var(--Color-Text-Text-Secondary)] mb-16" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
          {{ $t("showing") }} {{ startIndex + 1 }}-{{ endIndex }} {{ $t("of") }} {{ filteredProducts.length }} {{ $t("products") }}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import Swal from "sweetalert2";

// Components
import SearchBar from "@/components/pages/SearchBar.vue";
import CategoryButtons from "@/components/pages/CategoryButtons.vue";
import ProductCard from "@/components/pages/ProductCard.vue";
import AppFooter from "@/components/pages/AppFooter.vue";

// Global real-time composable
import { useGlobalRealTime } from "@/composables/useGlobalRealTime";

export default {
  name: "AllProducts",
  components: {
    SearchBar,
    CategoryButtons,
    ProductCard,
    AppFooter,
  },
  setup() {
    const { products, userReviews } = useGlobalRealTime();

    const searchQuery = ref("");
    const selectedCategory = ref("");
    const selectedLocation = ref("");
    const isAuthenticated = ref(false);
    const categories = ref([]);
    const auth = getAuth();
    const router = useRouter();

    // Pagination state
    const currentPage = ref(1);
    const productsPerPage = ref(12); // Show 12 products per page

    // Load categories
    const loadCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      categories.value = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((cat) => cat.status !== 'inactive') // Only show active categories
        .map((cat) => cat.name)
        .sort((a, b) => a.localeCompare(b));
    };

    // Login alert
    const promptLogin = () => {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Please log in to rent a product",
        showConfirmButton: true,
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push({ name: "Login" });
        }
      });
    };

    // Compute average ratings from user-reviews
    const productRatings = computed(() => {
      const map = {};
      if (!userReviews.value) return {};

      userReviews.value.forEach((review) => {
        const pid = review.productId;
        if (!map[pid]) {
          map[pid] = { total: 0, count: 0 };
        }
        map[pid].total += review.rate;
        map[pid].count += 1;
      });

      const averages = {};
      for (const pid in map) {
        const { total, count } = map[pid];
        averages[pid] = (total / count).toFixed(1);
      }
      return averages;
    });

    // Filter products and add avg rating
    const filteredProducts = computed(() => {
      if (!products.value) return [];

      let result = products.value.filter((p) => p.isApproved === true);

      if (selectedCategory.value) {
        result = result.filter((p) => p.category === selectedCategory.value);
      }

      if (selectedLocation.value) {
        result = result.filter((p) => p.location === selectedLocation.value);
      }

      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter((p) => p.title?.toLowerCase().includes(q));
      }

      return result.map((product) => ({
        ...product,
        rating: productRatings.value[product.id] || "0",
      }));
    });

    // Pagination computed properties
    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / productsPerPage.value);
    });

    const startIndex = computed(() => {
      return (currentPage.value - 1) * productsPerPage.value;
    });

    const endIndex = computed(() => {
      return Math.min(startIndex.value + productsPerPage.value, filteredProducts.value.length);
    });

    const paginatedProducts = computed(() => {
      return filteredProducts.value.slice(startIndex.value, endIndex.value);
    });

    const visiblePages = computed(() => {
      const total = totalPages.value;
      const current = currentPage.value;
      const delta = 2; // Show 2 pages before and after current page

      let start = Math.max(1, current - delta);
      let end = Math.min(total, current + delta);

      // Adjust if we're near the beginning
      if (current - delta <= 1) {
        end = Math.min(total, 1 + delta * 2);
      }

      // Adjust if we're near the end
      if (current + delta >= total) {
        start = Math.max(1, total - delta * 2);
      }

      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    });

    // Reset to first page when filters change
    watch([searchQuery, selectedCategory, selectedLocation], () => {
      currentPage.value = 1;
    });

    // On mount
    onMounted(() => {
      loadCategories();
      onAuthStateChanged(auth, (user) => {
        isAuthenticated.value = !!user;
      });
    });

    return {
      searchQuery,
      selectedCategory,
      selectedLocation,
      filteredProducts,
      paginatedProducts,
      categories,
      isAuthenticated,
      promptLogin,
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
    };
  },
};
</script>

<style scoped>
input {
  transition: all 0.3s ease;
}

@media (max-width: 400px) {
  .container {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
}
</style>
