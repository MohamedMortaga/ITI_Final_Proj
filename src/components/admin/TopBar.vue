<template>
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold">{{ title }}</h1>
    <div class="flex items-center space-x-2">
      <button class="bg-teal-500 text-white px-4 py-2 rounded-md flex items-center">
        <i class="fas fa-download mr-2"></i> Export
      </button>

      <div class="relative">
        <input
          type="text"
          :placeholder="searchPlaceholder"
          class="border rounded-md px-3 py-2 w-64"
          v-model="searchQuery"
          @input="emit('update:search', searchQuery)"
        />
        <i class="fas fa-search absolute right-2 top-2 text-gray-400"></i>
      </div>

      <button class="border px-3 py-2 rounded-md flex items-center" @click="emit('filter')">
        <i class="fas fa-filter mr-1"></i> Filter
      </button>

      <div class="flex items-center ml-2">
        <span class="text-gray-500 mr-1">Sort by:</span>
        <select v-model="sortOption" @change="emit('update:sort', sortOption)">
          <option>Name A → Z</option>
          <option>Name Z → A</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: { type: String, default: 'All Products' },
  searchPlaceholder: { type: String, default: 'Search Products?' },
})

const emit = defineEmits(['update:search', 'update:sort', 'filter'])

const searchQuery = ref('')
const sortOption = ref('Name A → Z')
</script>
