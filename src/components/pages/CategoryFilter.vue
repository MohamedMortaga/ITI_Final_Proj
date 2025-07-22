<template>
  <div class="flex justify-center gap-5 mb-6">
    <button
      v-for="cat in categories"
      :key="cat.id"
      @click="$emit('updateCategory', cat.name)"
      class="flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium border border-[var(--Color-Boarder-Border-Primary)] bg-white dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] hover:bg-[var(--Color-Surface-Surface-Brand)] hover:text-[var(--Color-Text-Text-Invert)] transition"
      :class="selectedCategory === cat.name ? 'bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)]' : ''"
    >
      {{ cat.name }}
    </button>
    <button
      @click="$emit('updateCategory', '')"
      class="flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium border border-[var(--Color-Boarder-Border-Primary)] bg-white dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] hover:bg-[var(--Color-Surface-Surface-Brand)] hover:text-[var(--Color-Text-Text-Invert)] transition"
      :class="selectedCategory === '' ? 'bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)]' : ''"
    >
      {{$t('all')}}
    </button>
  </div>
</template>

<script setup>
defineProps(['categories', 'selectedCategory']);
defineEmits(['updateCategory']);
</script>
