<template>
  <div class="relative rounded-xl overflow-hidden w-full">
    <img :src="src" :alt="alt" class="w-full h-auto object-cover" :style="{ maxHeight }" />
  </div>
</template>

<script setup>
defineProps({
  src: String,
  alt: { type: String, default: 'Banner' },
  maxHeight: { type: String, default: '220px' }
});
</script>