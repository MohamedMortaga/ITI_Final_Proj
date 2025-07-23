<!-- AdminProducts.vue -->
<template>
  <div class=" mx-auto bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] px-[120px] py-6">
    <!-- <h1 class="text-2xl font-bold mb-6 text-center text-pink-600 dark:text-pink-400">
      Products 
    </h1> -->

     <!-- Search Bar -->
     <div class="mb-6 flex justify-between  items-center ">
      <p class="text-2xl text-[var(--Color-Text-Text-Primary)]  font-medium">Your Items</p>
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[var(--Color-Text-Text-Brand)] w-5 h-5 pointer-events-none"></i>

        <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('searchByTitle')"
        class="w-[500px] pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-base text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)] bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)]"
      />
      </div>
      
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
      @editProduct="editProductHandler"
      @deleteProduct="deleteProduct"
      @addItem="showForm = true"
    />
    
    

   

    <!-- Add / Edit Form -->
    <ProductForm
      v-if="showForm"
      :form="form"
      :categories="categories"
      :isEdit="isEdit"
      :uploading="uploading"
      @submitForm="handleSubmit"
      @imageUpload="handleImageUpload"
      @cancelForm="showForm = false"
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

const showForm = ref(false);

function handleSubmit() {
  submitForm();
  showForm.value = false;
}

function editProductHandler(product) {
  editProduct(product);
  showForm.value = true;
}

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