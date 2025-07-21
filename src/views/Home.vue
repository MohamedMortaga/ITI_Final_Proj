<template>
  <div
    class="min-h-screen flex flex-col mx-[88px]"
    :style="{
      backgroundColor: 'var(--Color-Surface-Surface-Primary)',
      color: 'var(--Color-Text-Text-Primary)',
    }"
  >
    <!-- Search Bar -->
    <SearchBar v-model:searchQuery="searchQuery" />

    <!-- Category Filter -->
    <CategoryButtons 
      :categories="categories"
      :selectedCategory="selectedCategory"
      @update:selectedCategory="selectedCategory = $event"
    />

    <!-- Hero Banner -->
    <HeroBanner/>
    <!-- Recommended Products -->
    <div class="container mx-auto px-4 mt-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-[var(--Color-Text-Text-Brand)]">
          {{$t('recommendedForYou')}}
        </h2>
        <router-link
          to="/all-products"
          class="text-[var(--Color-Text-Text-Brand)] font-medium hover:underline"
          >{{$t('viewAll')}}</router-link
        >
      </div>
      <div
        v-if="filteredProducts.length === 0"
        class="text-center text-gray-400 text-xl py-12"
      >
        {{$t('noProductsFound')}}
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in filteredProducts.slice(0, 8)"
          :key="product.id"
          :product="product"
          :isAuthenticated="isAuthenticated"
          :promptLogin="promptLogin"
        />
      </div>
    </div>

    <!-- Customer Reviews -->
    <CustomerReviews :reviews="formattedReviews" v-if="formattedReviews.length > 0" />

    <!-- Why Rento Section -->
    <WhyRento />

    <!-- Mission, Vision, Values Section -->
    <MissionVisionValues />

  
  </div>
    <!-- Footer -->
    <AppFooter  />
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";
import getCollection from "../composables/getCollection";
import { collection, getDocs } from "firebase/firestore";
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
  },
  setup() {
    const { documents: products } = getCollection("products");
    const { documents: reviews } = getCollection("web-reviews");
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const displayName = ref("");
    const isAuthenticated = ref(false);
    const categories = ref([]);
    const auth = getAuth();
    const router = useRouter();

    const formattedReviews = computed(() => {
      if (!reviews.value) return [];

      return reviews.value
        .filter((review) => review.rate && review.review) // Filter out incomplete reviews
        .map((review) => ({
          id: review.id,
          rating: Number(review.rate) || 5,
          comment: review.review,
          userImage: review.userImage || require("@/assets/default.png"), // Use stored userImage or fallback
          userName: review.userName || "Anonymous",
          date: review.timestamp
            ? new Date(review.timestamp.seconds * 1000).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Recently",
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
    });

    const loadCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      categories.value = snapshot.docs
        .map((doc) => doc.data().name)
        .sort((a, b) => a.localeCompare(b));
    };

    const promptLogin = () => {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: $t('pleaseLoginToRent'),
        showConfirmButton: true,
        confirmButtonText: $t('goToLogin'),
      }).then((result) => {
        if (result.isConfirmed) {
          router.push({ name: "Login" });
        }
      });
    };

    onMounted(() => {
      loadCategories();
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
      if (!products.value) return [];
      let filtered = products.value;
      if (selectedCategory.value) {
        filtered = filtered.filter(
          (product) => product.category === selectedCategory.value
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

    return {
      products,
      searchQuery,
      selectedCategory,
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
/* Add any component-specific styles here */
</style>
