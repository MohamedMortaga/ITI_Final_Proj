<template>
  <div class="flex justify-center mt-6 gap-2">
    <button
      @click="handlePrev"
      :disabled="!showPrev"
      class="w-8 h-8 rounded-full border flex items-center justify-center transition-colors"
      :class="{
        'border-[var(--Color-Boarder-Border-Primary)] text-[var(--Color-Text-Text-Brand)] hover:bg-[var(--Color-Text-Text-Brand)] hover:text-white': !disabledStyle,
        'border-gray-300 text-gray-400 cursor-not-allowed': disabledStyle,
      }"
      aria-label="Previous review"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="$i18n.locale === 'ar' ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'"></path>
      </svg>
    </button>
    <button
      @click="handleNext"
      :disabled="!showNext"
      class="w-8 h-8 rounded-full border flex items-center justify-center transition-colors"
      :class="{
        'border-[var(--Color-Boarder-Border-Primary)] text-[var(--Color-Text-Text-Brand)] hover:bg-[var(--Color-Text-Text-Brand)] hover:text-white': !disabledStyle,
        'border-gray-300 text-gray-400 cursor-not-allowed': disabledStyle,
      }"
      aria-label="Next review"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="$i18n.locale === 'ar' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'"></path>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: "CarouselControls",
  props: {
    showPrev: {
      type: Boolean,
      default: true,
    },
    showNext: {
      type: Boolean,
      default: true,
    },
    disabledStyle: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["prev", "next"],
  methods: {
    handlePrev() {
      if (this.showPrev) {
        this.$emit("prev");
      }
    },
    handleNext() {
      if (this.showNext) {
        this.$emit("next");
      }
    },
  },
};
</script>

<style scoped>
button:focus {
  outline: none;
}

button:disabled {
  opacity: 0.6;
}
</style>
