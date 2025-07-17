<template>
  <div class="m-4 text-center">
    <h1 class="text-2xl font-medium text-primary-500 md:text-3xl">Home</h1>

    <!-- Search Bar -->
    <div class="mt-4">
      <div class="p-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Hi {{ displayName || 'User' }} 👋
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search products by title..."
        class="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-gray-100 placeholder-gray-400 bg-white dark:bg-gray-800"
      />
    </div>
  </div>

  <!-- Category Filter Buttons -->
  <div class="flex justify-center flex-wrap gap-2 mb-6 mt-4">
    <button
      v-for="cat in categories"
      :key="cat"
      @click="selectedCategory = cat"
      :class="[
        selectedCategory === cat
          ? 'bg-primary-500 text-white'
          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
        'px-4 py-2 rounded transition'
      ]"
    >
      {{ cat }}
    </button>
    <button
      @click="selectedCategory = ''"
      :class="[
        selectedCategory === ''
          ? 'bg-primary-500 text-white'
          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
        'px-4 py-2 rounded transition'
      ]"
    >
      All
    </button>
  </div>

  <!-- Products Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    <router-link
      v-for="product in filteredProducts"
      :key="product.id"
      :to="{ name: 'ProductDetails', params: { id: product.id } }"
      class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 border border-primary-100 block cursor-pointer"
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
    </router-link>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import getCollection from '../composables/getCollection';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';

export default {
  name: "HomePage",
  setup() {
    const { documents: products } = getCollection('products');
    const searchQuery = ref('');
    const selectedCategory = ref('');
    const displayName = ref('');
    const categories = ref([]);

    const loadCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      categories.value = snapshot.docs.map(doc => doc.data().name).sort((a, b) => a.localeCompare(b));
    };

    onMounted(() => {
      loadCategories();
    });

    const filteredProducts = computed(() => {
      if (!products.value) return [];
      let filtered = products.value;
      if (selectedCategory.value) {
        filtered = filtered.filter(product => product.category === selectedCategory.value);
      }
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(product => product.title?.toLowerCase().includes(query));
      }
      return filtered;
    });

    const highlightText = (text) => {
      if (!searchQuery.value || !text) return text;
      const query = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${query})`, 'gi');
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
  }
};
</script>

<style scoped>
input {
  transition: all 0.3s ease;
}
</style>
