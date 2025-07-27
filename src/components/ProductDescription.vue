<template>
  <div class="bg-[var(--Color-Surface-Surface-Primary)] rounded-xl border border-[var(--Color-Boarder-Border-Primary)] p-6">
    <h2
      class="text-xl font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
    >
      Description
    </h2>
    <div
      class="space-y-4 text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
    >
      <p>
        {{ description }}
      </p>

      <div>
        <h3
          class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-2"
        >
          Inclusions:
        </h3>
        <ul class="list-disc list-inside space-y-1">
          <li v-for="item in inclusions" :key="item">{{ item }}</li>
        </ul>
      </div>

      <div>
        <h3
          class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-2"
        >
          Usage & Care:
        </h3>
        <p class="mb-2">{{ usageDescription }}</p>
        <ul class="list-disc list-inside space-y-1">
          <li v-for="usage in usageExamples" :key="usage">{{ usage }}</li>
        </ul>
        <p class="mt-2">{{ careDescription }}</p>
        <p class="mt-2">{{ shortTermDescription }}</p>
        <p class="mt-2">{{ pickupDescription }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  description: {
    type: String,
    default: ''
  },
  inclusions: {
    type: Array,
    default: () => [
      '1 rechargeable battery (18V)',
      'Charger included',
      'Optional drill bits (upon request)'
    ]
  },
  usageDescription: {
    type: String,
    default: 'Rented over 15 times with great feedback.'
  },
  usageExamples: {
    type: Array,
    default: () => [
      'Assembling IKEA furniture',
      'Wall mounting (TVs, shelves)',
      'Minor drilling in wood or drywall'
    ]
  },
  careDescription: {
    type: String,
    default: 'I sanitize the tool after each rental, and it\'s checked for performance every month.'
  },
  shortTermDescription: {
    type: String,
    default: 'Perfect for short-term use without having to buy expensive tools.'
  },
  pickupDescription: {
    type: String,
    default: 'Ready for pickup in Nasr City or I can arrange delivery depending on the distance.'
  }
});
</script> 