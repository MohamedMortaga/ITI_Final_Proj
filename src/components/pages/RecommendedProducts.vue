<template>
  <section class="container mx-auto px-4 mt-8">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-[var(--Color-Text-Text-Brand)]">Recommended for you</h2>
      <router-link to="/all-products" class="text-[var(--Color-Text-Text-Brand)] font-medium hover:underline">View All</router-link>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      >
        <template #action="{ product }">
          <slot name="action" :product="product" />
        </template>
      </ProductCard>
    </div>
  </section>
</template>

<script setup>
import ProductCard from './ProductCard.vue';
defineProps({
  products: { type: Array, required: true }
});
</script>