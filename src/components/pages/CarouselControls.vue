<template>
  <div class="flex justify-center mt-6 gap-2">
    <button
      @click="handlePrev"
      :disabled="!showPrev"
      class="w-8 h-8 rounded-full border flex items-center justify-center transition-colors"
      :class="{
        'border-[var(--Color-Boarder-Border-Primary)] text-[var(--Color-Text-Text-Brand)] hover:bg-[var(--Color-Surface-Surface-Brand)]': !disabledStyle,
        'border-gray-300 text-gray-400 cursor-not-allowed': disabledStyle,
      }"
      aria-label="Previous review"
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <button
      @click="handleNext"
      :disabled="!showNext"
      class="w-8 h-8 rounded-full border flex items-center justify-center transition-colors"
      :class="{
        'border-[var(--Color-Boarder-Border-Primary)] text-[var(--Color-Text-Text-Brand)] hover:bg-[var(--Color-Surface-Surface-Brand)]': !disabledStyle,
        'border-gray-300 text-gray-400 cursor-not-allowed': disabledStyle,
      }"
      aria-label="Next review"
    >
      <i class="fa-solid fa-chevron-right"></i>
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
