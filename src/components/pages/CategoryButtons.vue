<template>
  <div class="w-full px-4 lg:px-[88px] mt-4 overflow-hidden">
    <div class="flex flex-wrap gap-2 justify-start lg:justify-center max-w-full">
      <button @click="selectCategory('')"
        class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm lg:text-base font-medium border border-[var(--Color-Boarder-Border-Primary)] lg:border-0 transition group whitespace-nowrap
            hover:text-[var(--Color-Text-Text-Brand)]"
        :class="selectedCategory === ''
          ? 'bg-transparent text-[var(--Color-Text-Text-Brand)]'
          : 'bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]'">
        <i class="fa-solid fa-layer-group"></i>
        {{$t('all')}}
      </button>
      <button v-for="cat in categories" :key="cat" @click="selectCategory(cat)"
        class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm lg:text-base font-medium border border-[var(--Color-Boarder-Border-Primary)] lg:border-0 transition group whitespace-nowrap
            hover:text-[var(--Color-Text-Text-Brand)]"
        :class="selectedCategory === cat
          ? 'bg-transparent text-[var(--Color-Text-Text-Brand)]'
          : 'bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]'">
        <i v-if="cat === 'Home Tools'" ></i>
        <i v-else-if="cat === 'Photography & Videography'" ></i>
        <i v-else-if="cat === 'Outdoor & Camping'" ></i>
        <i v-else-if="cat === 'Events & Decorations'" ></i>
        <i v-else-if="cat === 'Cleaning & Maintenance'" ></i>
        {{ getCategoryTranslation(cat) }}
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
    },
    getCategoryTranslation(category) {
      const categoryMap = {
        'Camping & Outdoor': 'campingOutdoor',
        'Home Cleaning Tools': 'homeCleaningTools',
        'Photography & Videography': 'photographyVideography',
        'Tech & Office Equipment': 'techOfficeEquipment',
        'Tools & DIY': 'toolsDIY'
      };
      
      const translationKey = categoryMap[category];
      return translationKey ? this.$t(translationKey) : category;
    }
  }
}
</script>