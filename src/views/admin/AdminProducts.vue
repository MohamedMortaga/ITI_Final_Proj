<template>
  <!-- <TopBar
  title="All Products"
  searchPlaceholder="Search Products?"
  @update:search="handleSearch"
  @update:sort="handleSort"
  @filter="handleFilter"
/> -->

  <ProductsTable :products="filteredProducts" />
</template>

<script setup>
import { ref, computed } from "vue";
// import AdminLayout from '@/layouts/AdminLayout.vue'
// import TopBar from '@/components/admin/TopBar.vue'
import ProductsTable from "@/components/admin/ProductsTable.vue";

// Example: Replace with your real fetch logic
const products = ref([
  { id: 1, name: "Banana" },
  { id: 2, name: "Apple" },
  { id: 3, name: "Orange" },
]);

const sortOption = ref("Name A → Z");

const filteredProducts = computed(() => {
  let filtered = products.value;
  // ...search/filter logic...
  filtered = [...filtered].sort((a, b) => {
    if (sortOption.value === "Name A → Z") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });
  // ...pagination...
  return filtered;
});

const handleSort = (option) => {
  sortOption.value = option;
};
</script>
