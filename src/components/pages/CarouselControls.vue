<template>
  <div class="flex justify-center mt-6 gap-2">
    <button
      @click="$emit('prev')"
      class="w-8 h-8 rounded-full border border-[var(--Color-Boarder-Border-Primary)] flex items-center justify-center text-[var(--Color-Text-Text-Brand)] hover:bg-[var(--Color-Surface-Surface-Brand)]">
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <button
      @click="$emit('next')"
      class="w-8 h-8 rounded-full border border-[var(--Color-Boarder-Border-Primary)] flex items-center justify-center text-[var(--Color-Text-Text-Brand)] hover:bg-[var(--Color-Surface-Surface-Brand)]">
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: "CarouselControls"
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>