<template>
  <div class="max-w-6xl mx-auto py-6 md:py-10 px-3 md:px-4">
    <!-- Approval Alert -->
    <div
      v-if="showApprovalAlert"
      class="mb-4 md:mb-6 p-3 md:p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-lg shadow-sm"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <i class="fas fa-info-circle mr-2 md:mr-3 text-yellow-500"></i>
          <p class="text-xs md:text-sm font-medium">
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

    <!-- Search Bar and Title -->
    <div class="mb-4 md:mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-4">
      <p
        class="text-lg md:text-xl lg:text-2xl text-[var(--Color-Text-Text-Primary)] font-medium mb-2 md:mb-0"
      >
        {{ $t("Your Items") }}
      </p>
      <div class="relative w-full md:w-auto">
        <i
          class="fa-solid fa-magnifying-glass absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[var(--Color-Text-Text-Brand)] w-4 md:w-5 h-4 md:h-5 pointer-events-none"
        ></i>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('searchByTitle')"
          class="w-full md:w-[500px] pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-sm md:text-base text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)] bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)]"
        />
      </div>
    </div>

    <!-- Category Filter Buttons -->
    <!-- <div class="mb-3 md:mb-4">
      <CategoryButtons
        :categories="categories"
        :selectedCategory="selectedCategory"
        @updateCategory="(val) => (selectedCategory = val)"
      />
    </div> -->

<<<<<<< Updated upstream
    <!-- Product List -->
    <div class="mb-6 md:mb-8">
=======
    Product List
    <div class="mb-8">
>>>>>>> Stashed changes
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
    <div class="mb-6 md:mb-8">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ProductList from "@/components/pages/ProductList.vue";
import ProductForm from "@/components/pages/ProductForm.vue";
import CategoryButtons from "@/components/pages/CategoryFilter.vue";
import { useRouter } from "vue-router";
import useAdminProducts from "@/composables/useAdminProducts";

const router = useRouter();

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
  highlightText,
  approveProduct,
} = useAdminProducts();

const showForm = ref(false);
const showApprovalAlert = ref(false);

async function handleSubmit() {
  try {
    await submitForm();
    // Show approval alert only for new items (not edits)
    if (!isEdit.value) {
      showApprovalAlert.value = true;
      // Hide after 5 seconds
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

const filteredProducts = computed(() => {
  let filtered = products.value;
  if (selectedCategory.value) {
    filtered = filtered.filter((p) => p.category === selectedCategory.value);
  }
  if (searchQuery.value) {
    filtered = filtered.filter((p) =>
      p.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return filtered;
});

onMounted(() => {
  if (!currentUser.value) {
    router.push("/login");
  } else {
    loadProducts();
    loadCategories();
  }
});
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
