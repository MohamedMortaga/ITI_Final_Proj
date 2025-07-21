<template>
  <div class="flex justify-center space-x-4 mb-6">
    <button
      v-for="cat in categories"
      :key="cat.id"
      @click="$emit('updateCategory', cat.name)"
      :class="{
        'bg-pink-600 text-white': selectedCategory === cat.name,
        'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200': selectedCategory !== cat.name
      }"
      class="px-4 py-2 rounded"
    >
      {{ cat.name }}
    </button>
    <button
      @click="$emit('updateCategory', '')"
      :class="{
        'bg-pink-600 text-white': selectedCategory === '',
        'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200': selectedCategory !== ''
      }"
      class="px-4 py-2 rounded"
    >
      All
    </button>
  </div>
</template>

<script setup>
defineProps(['categories', 'selectedCategory']);
defineEmits(['updateCategory']);
</script>
