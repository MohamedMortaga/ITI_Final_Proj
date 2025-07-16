<template>
  <div class="m-4 text-center">
    <h1 class="text-2xl font-medium text-blue-600 md:text-3xl">Home</h1>
    <!-- Search Bar -->
    <div class="mt-4">
      <div class="p-6 text-2xl font-semibold">
        Hi {{ displayName || 'User' }} 👋
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search products by title..."
        class="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-blue-600"
      />
    </div>
  </div>
  <!-- Category Filter Buttons -->
  <div class="flex justify-center space-x-4 mb-6">
    <button
      v-for="cat in categories"
      :key="cat"
      @click="selectedCategory = cat"
      :class="{ 'bg-pink-600 text-white': selectedCategory === cat, 'bg-gray-200 text-gray-700': selectedCategory !== cat }"
      class="px-4 py-2 rounded"
    >
      {{ cat }}
    </button>
    <button
      @click="selectedCategory = ''"
      :class="{ 'bg-pink-600 text-white': selectedCategory === '', 'bg-gray-200 text-gray-700': selectedCategory !== '' }"
      class="px-4 py-2 rounded"
    >
      All
    </button>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    <router-link
      v-for="product in filteredProducts"
      :key="product.id"
      :to="{ name: 'ProductDetails', params: { id: product.id } }"
      class="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 border border-pink-200 block cursor-pointer"
    >
      <h2 class="text-xl font-bold text-pink-600 mb-2" v-html="highlightText(product.title)"></h2>
      <p class="text-gray-700 text-sm mb-1"><span class="font-medium">Category:</span> {{ product.category }}</p>
      <p class="text-pink-500 font-semibold mb-1"><span class="font-medium">Price:</span> {{ product.price }} EGP</p>
      <p class="text-gray-600 text-sm"><span class="font-medium">Details:</span> {{ product.details }}</p>
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
      return text.replace(regex, '<span class="text-blue-600">$1</span>');
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
  color: #2563eb;
}
input:focus {
  border-color: #ec4899;
}
input::placeholder {
  color: #9ca3af;
}
</style>