<template>
  <div class="bg-[var(--Color-Surface-Surface-Primary)] rounded-xl border border-[var(--Color-Boarder-Border-Primary)] p-6">
    <h3
      class="text-lg font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-4"
    >
      Tool's reviews
    </h3>
    <div class="space-y-4">
      <div
        v-for="review in reviews.slice(0, maxReviews)"
        :key="review.id"
        class="border-b border-gray-200 pb-4 last:border-b-0"
      >
        <div class="flex items-center gap-2 mb-2">
          <span class="font-medium text-[var(--color-gray-800)]">{{
            review.userName || review.rentUserId
          }}</span>
          <span class="text-yellow-400 text-sm">
            {{
              "★".repeat(Math.floor(review.rate)) +
              "☆".repeat(5 - Math.floor(review.rate))
            }}
          </span>
          <span class="text-sm text-[var(--color-gray-600)]">{{
            review.rate
          }}</span>
        </div>
        <p class="text-[var(--color-gray-600)] text-sm mb-1">
          "{{ review.review }}"
        </p>
        <span class="text-xs text-[var(--color-gray-500)]">{{
          formatDate(review.timestamp?.toDate())
        }}</span>
      </div>
    </div>
    <button
      @click="$emit('add-review')"
      class="w-full mt-4 border border-[var(--color-success-500)] text-[var(--color-success-500)] py-2 rounded-lg hover:bg-[var(--color-success-50)] transition-colors"
    >
      Add Review
    </button>
    <button
      @click="$emit('view-all-reviews')"
      class="w-full mt-2 border border-[var(--color-success-500)] text-[var(--color-success-500)] py-2 rounded-lg hover:bg-[var(--color-success-50)] transition-colors"
    >
      view all reviews
    </button>
  </div>
</template>

<script setup>
defineProps({
  reviews: {
    type: Array,
    default: () => []
  },
  maxReviews: {
    type: Number,
    default: 3
  }
});

defineEmits(['add-review', 'view-all-reviews']);

const formatDate = (date) => {
  if (!date) return "Unknown";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script> 