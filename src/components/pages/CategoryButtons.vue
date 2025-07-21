<template>
  <div class="container mx-auto  px-6 md:px-6 lg:px-[88px] mt-4">
    <div class="flex flex-wrap gap-2">
      <button @click="selectCategory('')"
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium border border-[var(--Color-Boarder-Border-Primary)] bg-white dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] hover:bg-[var(--Color-Surface-Surface-Brand)] hover:text-[var(--Color-Text-Text-Invert)] transition"
        :class="selectedCategory === '' ? 'bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)]' : ''">
        <i class="fa-solid fa-layer-group"></i>
        All
      </button>
      <button v-for="cat in categories" :key="cat" @click="selectCategory(cat)"
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium border border-[var(--Color-Boarder-Border-Primary)] bg-white dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] hover:bg-[var(--Color-Surface-Surface-Brand)] hover:text-[var(--Color-Text-Text-Invert)] transition"
        :class="selectedCategory === cat ? 'bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)]' : ''">
        <i v-if="cat === 'Home Tools'" class="fa-solid fa-screwdriver-wrench"></i>
        <i v-else-if="cat === 'Photography & Videography'" class="fa-solid fa-camera"></i>
        <i v-else-if="cat === 'Outdoor & Camping'" class="fa-solid fa-campground"></i>
        <i v-else-if="cat === 'Events & Decorations'" class="fa-solid fa-champagne-glasses"></i>
        <i v-else-if="cat === 'Cleaning & Maintenance'" class="fa-solid fa-broom"></i>
        {{ cat }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      required: true
    },
    selectedCategory: {
      type: String,
      required: true
    }
  },
  methods: {
    selectCategory(category) {
      this.$emit('update:selectedCategory', category);
    }
  }
}
</script>