<template>
  <div class="bg-[var(--Color-Surface-Surface-Primary)] rounded-xl border border-[var(--Color-Boarder-Border-Primary)] p-6">
    <h2
      class="text-xl font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
    >
      About the Tool
    </h2>
    <div class="grid grid-cols-2 gap-4">
      <div class="flex justify-between py-2 border-b border-gray-200">
        <span class="font-medium text-[var(--color-gray-600)]">Category:</span>
        <span class="text-[var(--color-gray-800)]">{{ category }}</span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-200">
        <span class="font-medium text-[var(--color-gray-600)]">Brand:</span>
        <span class="text-[var(--color-gray-800)]">{{ brand }}</span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-200">
        <span class="font-medium text-[var(--color-gray-600)]">Model:</span>
        <span class="text-[var(--color-gray-800)]">{{ model }}</span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-200">
        <span class="font-medium text-[var(--color-gray-600)]">Price per day:</span>
        <span class="text-[var(--color-success-500)] font-bold">{{ price }} {{ currency }}</span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-200">
        <span class="font-medium text-[var(--color-gray-600)]">Rent times:</span>
        <span class="text-[var(--color-gray-800)]">{{ rentTimes }}</span>
      </div>
    </div>
    <button
      @click="$emit('rent-click')"
      :disabled="isDisabled"
      class="w-full mt-4 bg-[var(--color-success-500)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[var(--color-success-600)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {{ buttonText }}
    </button>
    <p
      v-if="showRemainingTime && remainingTime"
      class="mt-2 text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)] text-center"
    >
      Available in: {{ remainingTime }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  category: {
    type: String,
    default: 'Power Tools'
  },
  brand: {
    type: String,
    default: 'Bosch'
  },
  model: {
    type: String,
    default: 'GSR 18V-50 Professional'
  },
  price: {
    type: [String, Number],
    default: '15'
  },
  currency: {
    type: String,
    default: 'EGP'
  },
  rentTimes: {
    type: [String, Number],
    default: '15'
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