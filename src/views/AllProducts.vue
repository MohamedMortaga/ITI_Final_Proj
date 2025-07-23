<template>
  <div class="min-h-screen flex flex-col px-6 lg:px-[88px]"
    :style="{ backgroundColor: 'var(--Color-Surface-Surface-Primary)', color: 'var(--Color-Text-Text-Primary)' }">
    
    <!-- Search Bar Section -->
    <SearchBar v-model:searchQuery="searchQuery" />

    <!-- Category Section -->
    <CategoryButtons 
      :categories="categories" 
      :selectedCategory="selectedCategory" 
      @update:selectedCategory="selectedCategory = $event" 
    />

    <!-- All Products Section -->
    <div class="container mx-auto px-4 mt-8">
      <h2 class="text-xl font-bold text-[var(--Color-Text-Text-Brand)] mb-4">
        {{$t('allProducts')}}
      </h2>
      <div v-if="filteredProducts.length === 0" class="text-center text-gray-400 text-xl py-12">
        {{$t('noProductsFound')}}
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- <ProductCard
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product" 
          :isAuthenticated="isAuthenticated" 
          :promptLogin="promptLogin" 
        /> -->
             <ProductCard
          v-for="product in filteredProducts.slice(0, 8)"
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
import getCollection from "../composables/getCollection";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import Swal from "sweetalert2";

// Importing components
import SearchBar from '@/components/pages/SearchBar.vue';
import CategoryButtons from '@/components/pages/CategoryButtons.vue';
import ProductCard from '@/components/pages/ProductCard.vue';
import AppFooter from '@/components/pages/AppFooter.vue';

export default {
  name: "AllProducts",
  components: {
    SearchBar,
    CategoryButtons,
    ProductCard,
    AppFooter
  },
  setup() {
    const { documents: products } = getCollection("products");
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const isAuthenticated = ref(false);
    const categories = ref([]);
    const auth = getAuth();
    const router = useRouter();

    // Load categories from Firebase
    const loadCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      categories.value = snapshot.docs
        .map((doc) => doc.data().name)
        .sort((a, b) => a.localeCompare(b));
    };

    // Prompt login if not authenticated
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

    // Check authentication status
    onMounted(() => {
      loadCategories();
      onAuthStateChanged(auth, (user) => {
        isAuthenticated.value = !!user;
      });
    });

    // Filter products based on category and search query
  const filteredProducts = computed(() => {
  if (!products.value) return [];
  let filtered = products.value;

filtered = filtered.filter((product) => product.isApproved === true);


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

/* Responsive tweaks for extra small screens */
@media (max-width: 400px) {
  .container {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
}
</style>