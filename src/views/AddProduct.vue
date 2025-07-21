<!-- AdminProducts.vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-900">
    <h1 class="text-2xl font-bold mb-6 text-center text-pink-600 dark:text-pink-400">
      Admin Dashboard - Products
    </h1>

    <!-- Add / Edit Form -->
    <ProductForm
      :form="form"
      :categories="categories"
      :isEdit="isEdit"
      :uploading="uploading"
      @submitForm="submitForm"
      @imageUpload="handleImageUpload"
    />

    <!-- Search Bar -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('searchByTitle')"
        class="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-blue-600 dark:text-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-500"
      />
    </div>

    <!-- Category Filter Buttons -->
    <CategoryButtons
      :categories="categories"
      :selectedCategory="selectedCategory"
      @updateCategory="(val) => selectedCategory = val"
    />

    <!-- Products List -->
    <ProductList
      :products="filteredProducts"
      :highlightText="highlightText"
      @editProduct="editProduct"
      @deleteProduct="deleteProduct"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ProductForm from '@/components/pages/ProductForm.vue';
import ProductList from '@/components/pages/ProductList.vue';
import CategoryButtons from '@/components/pages/CategoryFilter.vue';
import useAdminProducts from '@/composables/useAdminProducts'

const {
  form,
  products,
  categories,
  isEdit,
  uploading,
  currentUser,
  searchQuery,
  selectedCategory,
  loadProducts,
  loadCategories,
  submitForm,
  handleImageUpload,
  editProduct,
  deleteProduct,
  highlightText
} = useAdminProducts();

onMounted(() => {
  loadProducts();
  loadCategories();
});

const filteredProducts = computed(() => {
  let filtered = products.value;
  if (selectedCategory.value)
    filtered = filtered.filter(p => p.category === selectedCategory.value);
  if (searchQuery.value)
    filtered = filtered.filter(p => p.title?.toLowerCase().includes(searchQuery.value.toLowerCase()));
  return filtered;
});
</script>