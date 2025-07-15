<template>
  <div class="m-4 text-center">
    <h1 class="text-2xl font-medium text-blue-600 md:text-3xl">Home</h1>
    <!-- Search Bar -->
    <div class="mt-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search products by title..."
        class="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-blue-600"
      />
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    <router-link
      v-for="product in filteredProducts"
      :key="product.id"
      :to="{ name: 'ProductDetails', params: { id: product.id } }"
      class="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 border border-pink-200 block cursor-pointer"
    >
      <h2 class="text-xl font-bold text-pink-600 mb-2" v-html="highlightText(product.title)"></h2>
      <p class="text-gray-700 text-sm mb-1"><span class="font-medium">Type:</span> {{ product.type }}</p>
      <p class="text-pink-500 font-semibold mb-1"><span class="font-medium">Price:</span> {{ product.price }} EGP</p>
      <p class="text-gray-600 text-sm"><span class="font-medium">Details:</span> {{ product.details }}</p>
    </router-link>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import getCollection from '../composables/getCollection';

export default {
  name: "HomePage",
  setup() {
    const { documents: products } = getCollection('products');
    const searchQuery = ref('');

    // Computed property to filter products based on title only
    const filteredProducts = computed(() => {
      if (!products.value) return [];
      if (!searchQuery.value) return products.value;
      const query = searchQuery.value.toLowerCase();
      return products.value.filter(
        (product) => product.title?.toLowerCase().includes(query)
      );
    });

    // Method to highlight matching text with blue <span>
    const highlightText = (text) => {
      if (!searchQuery.value || !text) return text;
      const query = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special regex characters
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<span class="text-blue-600">$1</span>');
    };

    return { products, searchQuery, filteredProducts, highlightText };
  },
};
</script>

<style scoped>
input {
  transition: all 0.3s ease;
  color: #2563eb; /* Tailwind's blue-600 for input text */
}
input:focus {
  border-color: #ec4899; /* Tailwind's pink-500 */
}
input::placeholder {
  color: #9ca3af; /* Tailwind's gray-400 for placeholder */
}
</style>