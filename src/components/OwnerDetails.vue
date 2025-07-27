<template>
  <div class="bg-[var(--Color-Surface-Surface-Primary)] rounded-xl border border-[var(--Color-Boarder-Border-Primary)] p-6">
    <h3
      class="text-lg font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
    >
      Owner details
    </h3>
    <div class="flex items-center gap-4 mb-4">
      <img
        :src="ownerImage || require('@/assets/default.png')"
        :alt="ownerName"
        class="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <p
          class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
        >
          {{ ownerName }}
        </p>
        <div class="flex items-center gap-1 text-sm text-[var(--color-gray-600)]">
          <span class="text-yellow-400"
            >{{ "★".repeat(Math.floor(rating)) }}{{ "☆".repeat(5 - Math.floor(rating)) }}</span
          >
          <span
            >{{ rating }} ({{ reviewCount }} review{{
              reviewCount !== 1 ? "s" : ""
            }})</span
          >
        </div>
        <div class="flex items-center gap-1 text-sm text-[var(--color-gray-600)]">
          <i class="fas fa-map-marker-alt text-[var(--color-success-500)]"></i>
          <span>{{ location }}</span>
        </div>
        <p class="text-sm text-[var(--color-gray-600)]">
          {{ successfulRentals }} successful rental{{
            successfulRentals !== 1 ? "s" : ""
          }}
        </p>
        <p class="text-sm text-[var(--color-gray-600)]">
          Member since {{ memberSince }}
        </p>
      </div>
    </div>
    <div class="space-y-2">
      <button
        @click="$emit('view-tools')"
        class="w-full border border-[var(--color-success-500)] text-[var(--color-success-500)] py-2 rounded-lg hover:bg-[var(--color-success-50)] transition-colors"
      >
        view owner tools
      </button>
      <button
        @click="$emit('send-message')"
        class="w-full bg-[var(--color-success-500)] text-white py-2 rounded-lg hover:bg-[var(--color-success-600)] transition-colors"
      >
        Send a message
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  ownerName: {
    type: String,
    default: 'Unknown Owner'
  },
  ownerImage: {
    type: String,
    default: ''
  },
  rating: {
    type: [String, Number],
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    default: 'Cairo'
  },
  successfulRentals: {
    type: Number,
    default: 0
  },
  memberSince: {
    type: String,
    default: 'Unknown'
  }
});

defineEmits(['view-tools', 'send-message']);
</script> 