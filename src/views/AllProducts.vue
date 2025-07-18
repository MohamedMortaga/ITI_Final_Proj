<template>
  <div class="min-h-screen flex flex-col"
    :style="{ backgroundColor: 'var(--Color-Surface-Surface-Primary)', color: 'var(--Color-Text-Text-Primary)' }">
    <!-- Navbar (assumed to be included via layout or component) -->
    <!-- <NavBar /> -->

    <!-- Search Bar Section -->
    <div class="w-full border-b border-[var(--Color-Surface-Surface-Tertiary)] bg-transparent">
      <div class="container mx-auto px-4 py-6 flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row items-center gap-4 w-full">
          <!-- Location Select -->
          <div class="relative flex items-center w-full sm:w-auto">
            <i
              class="fa-solid fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-[var(--Color-Text-Text-Brand)] w-5 h-5 pointer-events-none"></i>
            <select
              class="appearance-none pl-12 pr-8 py-3 w-full sm:w-[180px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-base font-semibold text-[var(--Color-Text-Text-Primary)] bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)]"
              style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'%23666\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 7l3-3 3 3\'/></svg>'); background-repeat: no-repeat; background-position: right 1rem center;">
              <option>Cairo</option>
            </select>
          </div>
          <!-- Search Input -->
          <div class="relative flex-1 w-full">
            <i
              class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[var(--Color-Text-Text-Brand)] w-5 h-5 pointer-events-none"></i>
            <input v-model="searchQuery" type="text" placeholder="Search for product to rent?"
              class="pl-12 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-base text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)] bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)]" />
          </div>
        </div>
      </div>
    </div>

    <!-- Category Section -->
    <div class="container mx-auto px-4 mt-4">
      <div class="flex flex-wrap gap-2">
        <button @click="selectedCategory = ''"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-base font-medium border border-[var(--Color-Boarder-Border-Primary)] bg-white dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] hover:bg-[var(--Color-Surface-Surface-Brand)] hover:text-[var(--Color-Text-Text-Invert)] transition"
          :class="selectedCategory === '' ? 'bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)]' : ''">
          <i class="fa-solid fa-layer-group"></i>
          All
        </button>
        <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-base font-medium border border-[var(--Color-Boarder-Border-Primary)] bg-white dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] hover:bg-[var(--Color-Surface-Surface-Brand)] hover:text-[var(--Color-Text-Text-Invert)] transition"
          :class="selectedCategory === cat ? 'bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)]' : ''">
          <i v-if="cat === 'Home Tools'" class="fa-solid fa-screwdriver-wrench"></i>
          <i v-else-if="cat === 'Photography & Videography'" class="fa-solid fa-camera"></i>
          <i v-else-if="cat === 'Outdoor & Camping'" class="fa-solid fa-campground"></i>
          <i v-else-if="cat === 'Events & Decorations'" class="fa-solid fa-champagne-glasses"></i>
          <i v-else-if="cat === 'Cleaning & Maintenance'" class="fa-solid fa-broom"></i>
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- All Products Section -->
    <div class="container mx-auto px-4 mt-8">
      <h2 class="text-xl font-bold text-[var(--Color-Text-Text-Brand)] mb-4">All Products</h2>
      <div v-if="filteredProducts.length === 0" class="text-center text-gray-400 text-xl py-12">
        No products found.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="product in filteredProducts" :key="product.id"
          class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl shadow-sm flex flex-col transition hover:shadow-lg">
          <img :src="product.img || require('@/assets/test.png')" alt="product image"
            class="w-full h-40 object-cover rounded-t-xl" />
          <div class="p-4 flex flex-col flex-1">
            <h2 class="text-base font-bold mb-1 text-[var(--Color-Text-Text-Brand)] truncate">
              {{ product.title }}
            </h2>
            <div class="flex items-center text-xs text-[var(--Color-Text-Text-Secondary)] mb-1">
              <i class="fa-solid fa-location-dot mr-1"></i>
              {{ product.location || "Naar City" }}
              <span class="ml-auto flex items-center">
                <span class="mr-1">{{ product.rating || '4.5' }}</span>
                <i class="fa-solid fa-star text-yellow-400"></i>
              </span>
            </div>
            <div class="flex items-center justify-between mt-auto">
              <div>
                <div class="text-sm font-semibold text-[var(--Color-Text-Text-Primary)]">
                  EGP {{ product.price }}
                </div>
                <div class="text-xs text-[var(--Color-Text-Text-Secondary)]">Per Day</div>
              </div>
              <button v-if="!isAuthenticated" @click="promptLogin"
                class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-4 py-2 rounded font-semibold text-sm transition hover:bg-[var(--Color-Text-Text-Brand)] hover:text-white"
                aria-label="Log in to rent this product">
                Rent Item
              </button>
              <router-link v-else :to="{ name: 'ProductDetails', params: { id: product.id } }"
                class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-4 py-2 rounded font-semibold text-sm transition hover:bg-[var(--Color-Text-Text-Brand)] hover:text-white"
                :aria-label="`View details for ${product.title}`">
                Rent Item
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
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

export default {
  name: "AllProducts",
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
        title: "Please log in to rent products",
        showConfirmButton: true,
        confirmButtonText: "Go to Login",
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