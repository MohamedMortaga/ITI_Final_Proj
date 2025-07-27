<template>
  <div
    class="min-h-screen flex flex-col px-6 lg:px-[88px]"
    :style="{
      backgroundColor: 'var(--Color-Surface-Surface-Primary)',
      color: 'var(--Color-Text-Text-Primary)',
    }"
  >
    <!-- Search Bar -->
    <SearchBar v-model:searchQuery="searchQuery" />

    <!-- Full-width divider that ignores parent padding -->
    <div
      class="border-t border-[var(--Color-Boarder-Border-Primary)] w-screen -ml-6 lg:-ml-[88px]"
    ></div>

    <!-- Category Buttons -->
    <CategoryButtons
      :categories="categories"
      :selectedCategory="selectedCategory"
      @update:selectedCategory="selectedCategory = $event"
    />

    <!-- Products Section -->
    <div class="container mx-auto px-4 mt-8">
      <h2 class="text-xl font-bold text-[var(--Color-Text-Text-Brand)] mb-4">
        {{ $t("allProducts") }}
      </h2>

      <div
        v-if="filteredProducts.length === 0"
        class="text-center text-gray-400 text-xl py-12"
      >
        {{ $t("noProductsFound") }}
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          :isAuthenticated="isAuthenticated"
          :promptLogin="promptLogin"
        />
      </div>
    </div>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
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
    const isAuthenticated = ref(false);
    const categories = ref([]);
    const auth = getAuth();
    const router = useRouter();

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

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((p) => p.title?.toLowerCase().includes(q));
  }

  return result.map((product) => ({
    ...product,
    rating: productRatings.value[product.id] || "0",
  }));
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
      filteredProducts,
      categories,
      isAuthenticated,
      promptLogin,
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
