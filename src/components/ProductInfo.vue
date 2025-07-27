<template>
  <div class="bg-[var(--Color-Surface-Surface-Primary)] rounded-xl border border-[var(--Color-Boarder-Border-Primary)] p-6">
    <div class="flex items-center justify-between mb-4">
      <h1
        class="text-3xl font-bold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
      >
        {{ productTitle }}
      </h1>
      <button
        @click="$emit('rent-click')"
        :disabled="isDisabled"
        class="bg-[var(--color-success-500)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[var(--color-success-600)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {{ buttonText }}
      </button>
    </div>
    <p
      v-if="showRemainingTime && remainingTime"
      class="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)] text-center"
    >
      Available in: {{ remainingTime }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  productTitle: {
    type: String,
    default: ''
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    default: 'Rent this tool'
  },
  showRemainingTime: {
    type: Boolean,
    default: false
  },
  remainingTime: {
    type: String,
    default: ''
  }
});

defineEmits(['rent-click']);
</script> 