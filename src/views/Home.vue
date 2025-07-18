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
      Hi {{ displayName || "Guest" }} 👋
    </div>
    <!-- Products Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="border rounded-lg p-4 shadow-sm"
      >
        <h2 class="text-xl font-bold mb-2 text-primary-500">
          {{ product.title }}
        </h2>
        <p class="text-sm mb-1">
          <span class="font-medium">Category:</span> {{ product.category || "N/A" }}
        </p>
        <p class="font-semibold mb-1 text-primary-500">
          <span class="font-medium">Price:</span> {{ product.price }} EGP
        </p>
        <p class="text-sm">
          <span class="font-medium">Details:</span>
          {{ product.details || "No details available" }}
        </p>
        <div class="flex justify-between items-center mt-2">
          <span v-if="product.rating" class="text-yellow-400">
            ⭐ {{ product.rating }} ★
          </span>
          <button
            v-if="!isAuthenticated"
            @click="promptLogin"
            class="bg-teal-500 text-white px-4 py-1 rounded hover:bg-teal-600"
            aria-label="Log in to rent this product"
          >
            Rent Now
          </button>
          <router-link
            v-else
            :to="{ name: 'ProductDetails', params: { id: product.id } }"
            class="bg-teal-500 text-white px-4 py-1 rounded hover:bg-teal-600"
            :aria-label="`View details for ${product.title}`"
          >
            Rent Now
          </router-link>
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
  name: "HomePage",
  setup() {
    const { documents: products } = getCollection("products");
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const displayName = ref("");
    const isAuthenticated = ref(false);
    const categories = ref([]);
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
</style>
