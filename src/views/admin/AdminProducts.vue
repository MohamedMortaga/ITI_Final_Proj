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
import { computed } from "vue";
import ProductsTable from "@/components/admin/ProductsTable.vue";
import { useAdminRealTime } from "@/composables/useAdminRealTime";

// Initialize real-time data
const { products } = useAdminRealTime();

const filteredProducts = computed(() => {
  return products.value || [];
});
</script>
