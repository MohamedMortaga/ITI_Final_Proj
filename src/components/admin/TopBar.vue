<template>
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold">{{ title }}</h1>
    <div class="flex items-center space-x-2">
  

      <div class="relative ">
        <input
          type="text"
          :placeholder="searchPlaceholder"
          class="border border-gray-50 rounded-md px-3 py-2 w-64"
          v-model="searchQuery"
          @input="emit('update:search', searchQuery)"
        />
        <i class="fas fa-search absolute right-2 top-2 text-gray-400"></i>
      </div>

      <button class="border border-gray-50 px-3 py-2 rounded-md flex items-center" @click="emit('filter')">
        <i class="fas fa-filter mr-1"></i> Filter
      </button>

      <div class="flex items-center ml-2">
        <span class="text-gray-500 mr-1">Sort by:</span>
        <select v-model="sortOption" @change="handleSortChange">
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="name-asc">Name A → Z</option>
          <option value="name-desc">Name Z → A</option>
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

const emit = defineEmits(['update:search', 'update:sort', 'filter', 'export'])

const searchQuery = ref('')
const sortOption = ref('createdAt-desc')

const handleSortChange = () => {
  const [field, order] = sortOption.value.split('-')
  emit('update:sort', { field, order })
}
</script>
