<template>
  <div class="m-4 text-center">
    <!-- Search Bar -->
    <div class="border-b border-gray-50 dark:border-gray-800 w-full pb-4">
      <div class="mt-4 md:flex items-center w-full container mx-auto">
        <select
          class="flex justify-left p-2 md:w-[184px] me-5 md:border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700"
        >
          <option>Cairo</option>
        </select>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for product to rent?"
          class="w-full md:max-w-[724px] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 dark:border-gray-700"
        />
      </div>
    </div>

    <!-- Category Filter Buttons -->
    <div class="flex justify-center flex-wrap gap-2 mb-6 mt-4"></div>

    <!-- Navigation Bar -->
    <div
      class="flex justify-center gap-3 md:gap-10 lg:gap-12 mb-4 text-sm font-medium text-gray-700 dark:text-gray-200"
    >
      <button @click="selectedCategory = ''" class="hover:text-primary-500 text-base">
        All
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        @click="selectedCategory = cat"
        class="hover:text-primary-500 md:text-lg text-base"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Banner -->
    <div class="relative mb-6">
      <div
        class="bg-teal-500 h-32 rounded-lg flex items-center justify-center text-white text-lg font-semibold"
      >
        Featured Products
      </div>
      <div class="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded">
        AD
      </div>
      <div class="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded">
        AD
      </div>
    </div>

    <h1 class="text-2xl font-medium text-primary-500 md:text-3xl">Home</h1>

    <div class="p-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
      Hi {{ displayName || "User" }} 👋
    </div>
    <!-- Products Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <router-link
        v-for="product in filteredProducts"
        :key="product.id"
        :to="{ name: 'ProductDetails', params: { id: product.id } }"
        class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 border border-primary-100 dark:border-gray-800 block cursor-pointer"
      >
        <h2
          class="text-xl font-bold mb-2 text-primary-500"
          v-html="highlightText(product.title)"
        ></h2>
        <p class="text-sm mb-1">
          <span class="font-medium">Category:</span> {{ product.category }}
        </p>
        <p class="font-semibold mb-1 text-primary-500">
          <span class="font-medium">Price:</span> {{ product.price }} EGP
        </p>
        <p class="text-sm">
          <span class="font-medium">Details:</span> {{ product.details }}
        </p>
        <!-- Additional styling to match image -->
        <div class="flex justify-between items-center mt-2">
          <span class="text-yellow-400">⭐ 4.5 ★</span>
          <button class="bg-teal-500 text-white px-4 py-1 rounded">Rent Now</button>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import getCollection from "../composables/getCollection";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

export default {
  name: "HomePage",
  setup() {
    const { documents: products } = getCollection("products");
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const displayName = ref("");
    const categories = ref([]);
    const auth = getAuth();

    const loadCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      categories.value = snapshot.docs
        .map((doc) => doc.data().name)
        .sort((a, b) => a.localeCompare(b));
    };

    onMounted(() => {
      loadCategories();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          displayName.value = user.displayName || "User";
        } else {
          displayName.value = "User";
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

    const highlightText = (text) => {
      if (!searchQuery.value || !text) return text;
      const query = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${query})`, "gi");
      return text.replace(regex, '<span class="text-primary-500">$1</span>');
    };

    return {
      products,
      searchQuery,
      selectedCategory,
      filteredProducts,
      highlightText,
      displayName,
      categories,
    };
  },
};
</script>

<style scoped>
input {
  transition: all 0.3s ease;
}
</style>
