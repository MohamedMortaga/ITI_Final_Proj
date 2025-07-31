<!-- AdminProducts.vue -->
<template>
  <div
    class="min-h-screen mx-auto bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] px-[16px] sm:px-6 md:px-12 lg:px-[120px] py-6"
  >
    <!-- Approval Alert -->
    <div
      v-if="showApprovalAlert"
      class="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-lg shadow-sm"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <i class="fas fa-info-circle mr-3 text-yellow-500"></i>
          <p class="text-sm font-medium">
            {{ $t("itemPendingApproval") }}
          </p>
        </div>
        <button
          @click="showApprovalAlert = false"
          class="text-yellow-500 hover:text-yellow-700 focus:outline-none"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Pending Products Notice -->
    <div
      v-if="hasPendingProducts"
      class="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700 rounded-lg shadow-sm"
    >
      <div class="flex items-center">
        <i class="fas fa-clock mr-3 text-blue-500"></i>
        <div>
          <p class="text-sm font-medium">
            {{ $t("pendingProductsNotice") }}
          </p>
          <p class="text-xs mt-1">
            {{ $t("pendingProductsDescription") }}
          </p>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <p
        class="text-xl md:text-2xl text-[var(--Color-Text-Text-Primary)] font-medium mb-2 md:mb-0"
      >
        {{ $t("Your Items") }}
      </p>
      <div class="relative w-full md:w-auto">
        <i
          class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[var(--Color-Text-Text-Brand)] w-5 h-5 pointer-events-none"
        ></i>

        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('searchByTitle')"
          class="w-full md:w-[500px] pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-base text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)] bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)]"
        />
      </div>
    </div>

    <!-- Category Filter Buttons -->
    <!-- <div class="mb-4">
      <CategoryButtons
        :categories="categories"
        :selectedCategory="selectedCategory"
        @updateCategory="(val) => selectedCategory = val"
      />
    </div> -->

    <!-- Products List -->
    <div class="mb-8">
      <ProductList
        :products="filteredProducts"
        :highlightText="highlightText"
        @editProduct="editProductHandler"
        @deleteProduct="deleteProduct"
        @addItem="showForm = true"
        @approveProduct="approveProduct"
      />
    </div>

    <!-- Add / Edit Form -->
    <div class="mb-8">
      <ProductForm
        v-if="showForm"
        :form="form"
        :categories="categories"
        :isEdit="isEdit"
        :uploading="uploading"
        :uploading1="uploading1"
        :uploading2="uploading2"
        :uploading3="uploading3"
        @submitForm="handleSubmit"
        @imageUpload="handleImageUpload"
        @cancelForm="handleCancelForm"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ProductForm from "@/components/pages/ProductForm.vue";
import ProductList from "@/components/pages/ProductList.vue";
import CategoryButtons from "@/components/pages/CategoryFilter.vue";
import useAdminProducts from "@/composables/useAdminProducts";

const {
  form,
  products,
  categories,
  isEdit,
  uploading,
  uploading1,
  uploading2,
  uploading3,
  currentUser,
  searchQuery,
  selectedCategory,
  loadProducts,
  loadCategories,
  submitForm,
  handleImageUpload,
  editProduct,
  deleteProduct,
  highlightText,
  approveProduct,
  resetForm,
} = useAdminProducts();

const showForm = ref(false);
const showApprovalAlert = ref(false);

// Check if user has pending products
const hasPendingProducts = computed(() => {
  return products.value.some(product => product.isApproved !== true);
});

function handleCancelForm() {
  resetForm();
  uploading.value = false;
  showForm.value = false;
}

async function handleSubmit() {
  try {
    await submitForm();
    // Show approval alert only for new items (not edits)
    if (!isEdit.value) {
      showApprovalAlert.value = true;
      // Hide after 10 seconds
      setTimeout(() => {
        showApprovalAlert.value = false;
      }, 10000);
    }
    showForm.value = false;
  } catch (error) {
    console.error("Error submitting form:", error);
  }
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
    filtered = filtered.filter((p) => p.category === selectedCategory.value);
  if (searchQuery.value)
    filtered = filtered.filter((p) =>
      p.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  return filtered;
});
</script>
