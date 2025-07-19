<template>
  <div class="min-h-screen flex flex-col"
    :style="{ backgroundColor: 'var(--Color-Surface-Surface-Primary)', color: 'var(--Color-Text-Text-Primary)' }">

    <!-- Search Bar -->
    <SearchBar v-model:searchQuery="searchQuery" />

    <!-- Category Filter -->
    <CategoryButtons
      :categories="categories"
      :selectedCategory="selectedCategory"
      @update:selectedCategory="selectedCategory = $event"
    />

    <!-- Hero Banner -->
    <div class="container mx-auto px-4 mt-6">
      <div class="relative rounded-xl overflow-hidden w-full">
        <img src="@/assets/Rectangle 10.png" alt="Featured Products" class="w-full h-auto object-cover" style="max-height: 220px;" />
      </div>
    </div>

    <!-- Recommended Products -->
    <div class="container mx-auto px-4 mt-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-[var(--Color-Text-Text-Brand)]">Recommended for you</h2>
        <router-link to="/all-products" class="text-[var(--Color-Text-Text-Brand)] font-medium hover:underline">View All</router-link>
      </div>
      <div v-if="filteredProducts.length === 0" class="text-center text-gray-400 text-xl py-12">
        No products found.
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
    <CustomerReviews :reviews="customerReviews" />

    <!-- Why Rento Section -->
    <WhyRento />

    <!-- Mission, Vision, Values Section -->
    <MissionVisionValues />

    <!-- Footer -->
    <AppFooter />
  </div>
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
import SearchBar from '@/components/pages/SearchBar.vue';
import CategoryButtons from '@/components/pages/CategoryButtons.vue';
import ProductCard from '@/components/pages/ProductCard.vue';
import CustomerReviews from '@/components/pages/CustomerReviews.vue';
import WhyRento from '@/components/pages/WhyRento.vue';
import MissionVisionValues from '@/components/pages/MissionVisionValues.vue';
import AppFooter from '@/components/pages/AppFooter.vue';

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
  },
  setup() {
    const { documents: products } = getCollection("products");
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const displayName = ref("");
    const isAuthenticated = ref(false);
    const categories = ref([]);
    const customerReviews = ref([
      {
        id: 1,
        rating: 4.5,
        comment: "The drill was clean and fully charged. I used it to install shelves at home and it worked flawlessly. Highly recommended!",
        userImage: "/avatar1.png",
        userName: "Karim H.",
        date: "Jul 10, 2025"
      },
      {
        id: 2,
        rating: 4.5,
        comment: "Honestly, I didn't expect it to be this powerful! I used it to drill into concrete walls for curtain rods, and it handled it like a pro.",
        userImage: "/avatar2.png",
        userName: "Youssef R.",
        date: "Jul 10, 2025"
      },
      {
        id: 3,
        rating: 4.5,
        comment: "Great tool, easy to use even for someone with no experience. I used it to assemble my IKEA wardrobe and it saved me hours!",
        userImage: "/avatar3.png",
        userName: "Mariam M.",
        date: "Jul 10, 2025"
      }
    ]);
    const auth = getAuth();
    const router = useRouter();

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
        title: "Please log in to rent products",
        showConfirmButton: true,
        confirmButtonText: "Go to Login",
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
          displayName.value = user.displayName || "User ";
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
      customerReviews
    };
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>