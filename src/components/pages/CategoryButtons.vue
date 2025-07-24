<template>
  <div class="w-full px-4 lg:px-[88px] mt-4">
    <div class="flex flex-wrap gap-2 lg:gap-24 justify-start lg:justify-center">
      <button @click="selectCategory('')"
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium border border-[var(--Color-Boarder-Border-Primary)] lg:border-0 transition group
            hover:text-[var(--Color-Text-Text-Brand)] lg:hover:bg-white lg:hover:text-[var(--Color-Text-Text-Brand)]"
        :class="selectedCategory === ''
          ? 'bg-transparent text-[var(--Color-Text-Text-Brand)]'
          : 'bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]'">
        <i class="fa-solid fa-layer-group"></i>
        {{$t('all')}}
      </button>
      <button v-for="cat in categories" :key="cat" @click="selectCategory(cat)"
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium border border-[var(--Color-Boarder-Border-Primary)] lg:border-0 transition group
            hover:text-[var(--Color-Text-Text-Brand)] lg:hover:bg-white lg:hover:text-[var(--Color-Text-Text-Brand)]"
        :class="selectedCategory === cat
          ? 'bg-transparent text-[var(--Color-Text-Text-Brand)]'
          : 'bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]'">
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