<template>
  <div class="mt-8 bg-[var(--Color-Surface-Surface-Primary)] rounded-xl border border-[var(--Color-Boarder-Border-Primary)] p-6">
    <h3
      class="text-lg font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
    >
      More from {{ ownerName }}
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        @click="$emit('navigate-to-product', item.id)"
        v-for="item in showAllProducts ? ownerProducts : ownerProducts.slice(0, maxProducts)"
        :key="item.id"
        class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl overflow-hidden hover:border-[var(--color-success-500)] transition-colors cursor-pointer"
      >
        <img
          :src="item.img || require('@/assets/test.png')"
          alt="product image"
          class="w-full h-40 object-cover"
        />
        <div class="p-4">
          <h4 class="font-semibold text-[var(--color-gray-800)] mb-2">
            {{ item.title || "Untitled" }}
          </h4>
          <div
            class="flex items-center justify-between text-sm text-[var(--color-gray-600)] mb-2"
          >
            <span class="flex items-center gap-1">
              <i class="fas fa-map-marker-alt text-[var(--color-success-500)]"></i>
              {{ item.location || defaultLocation }}
            </span>
            <span class="flex items-center gap-1">
              <i class="fas fa-star text-yellow-400"></i>
              {{ item.rating || "0" }}
            </span>
          </div>
          <div class="flex items-center justify-between mb-3">
            <span class="font-semibold text-[var(--color-gray-800)]">
              {{ currency }} {{ item.price || "0" }}
            </span>
            <span class="text-sm text-[var(--color-gray-600)]">{{
              perDayText
            }}</span>
          </div>
          <button
            @click.stop="$emit('navigate-to-product', item.id)"
            class="w-full bg-[var(--color-success-500)] text-white py-2 rounded-lg font-semibold hover:bg-[var(--color-success-600)] transition-colors"
          >
            {{ rentItemText }}
          </button>
        </div>
      </div>
    </div>
    <button
      @click="$emit('toggle-show-all')"
      class="mt-4 text-[var(--color-success-500)] hover:underline"
    >
      {{ showAllProducts ? showLessText : viewAllItemsText }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  ownerName: {
    type: String,
    default: 'Owner'
  },
  ownerProducts: {
    type: Array,
    default: () => []
  },
  showAllProducts: {
    type: Boolean,
    default: false
  },
  maxProducts: {
    type: Number,
    default: 3
  },
  defaultLocation: {
    type: String,
    default: 'Cairo'
  },
  currency: {
    type: String,
    default: 'EGP'
  },
  perDayText: {
    type: String,
    default: 'Per Day'
  },
  rentItemText: {
    type: String,
    default: 'Rent Item'
  },
  showLessText: {
    type: String,
    default: 'Show Less'
  },
  viewAllItemsText: {
    type: String,
    default: 'View All Items'
  }
});

defineEmits(['navigate-to-product', 'toggle-show-all']);
</script> 