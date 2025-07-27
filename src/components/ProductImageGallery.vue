<template>
  <div class="bg-[var(--Color-Surface-Surface-Primary)] rounded-xl border border-[var(--Color-Boarder-Border-Primary)] overflow-hidden">
    <div class="relative">
      <img
        :src="productImage || require('@/assets/logo.png')"
        :alt="productTitle || 'Product Image'"
        class="w-full h-96 object-cover"
      />
      <!-- Navigation Arrows -->
      <button
        @click="$emit('prev')"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
      >
        <i class="fas fa-chevron-left text-gray-600"></i>
      </button>
      <button
        @click="$emit('next')"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
      >
        <i class="fas fa-chevron-right text-gray-600"></i>
      </button>
      <!-- Pagination Dots -->
      <div
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
      >
        <div 
          v-for="(dot, index) in totalImages" 
          :key="index"
          class="w-2 h-2 rounded-full cursor-pointer"
          :class="currentImage === index ? 'bg-[var(--color-success-500)]' : 'bg-gray-300'"
          @click="$emit('select-image', index)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  productImage: {
    type: String,
    default: ''
  },
  productTitle: {
    type: String,
    default: ''
  },
  currentImage: {
    type: Number,
    default: 0
  },
  totalImages: {
    type: Number,
    default: 3
  }
});

defineEmits(['prev', 'next', 'select-image']);
</script> 