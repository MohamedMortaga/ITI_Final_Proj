<template>
  <div class="container mx-auto px-4 mt-6 mb-8">
    <h3 class="text-center text-3xl lg:text-4xl font-bold mb-6">
      <span class="text-[var(--Color-Text-Text-Primary)]">{{
        $t("whatCustomersSayPart1")
      }}</span>
      <span class="text-[var(--Color-Text-Text-Brand)]">{{
        $t("whatCustomersSayPart2")
      }}</span>
      <span class="text-[var(--Color-Text-Text-Primary)]">{{
        $t("whatCustomersSayPart3")
      }}</span>
    </h3>
    <div class="flex flex-col lg:flex-row gap-6 justify-center">
      <div
        v-for="review in displayedReviews"
        :key="review.id"
        class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 flex-1 w-full max-w-full md:max-w-lg md:w-[90%] mx-auto"
      >
      <div class="flex items-center gap-2">
          <div
            v-if="!review.userImage"
            class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
          >
            <span class="text-xs text-gray-600">{{ getInitials(review.userName) }}</span>
          </div>
          <img
            v-else
            :src="review.userImage"
            alt="user"
            class="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <div class="font-semibold text-xs">{{ review.userName }}</div>
            <div class="text-xs text-[var(--Color-Text-Text-Secondary)]">
              {{ formatReviewDate(review.timestamp) }}
            </div>
          </div>
        </div>
        <br><p class="text-sm mb-4">{{ review.comment }}</p>

        <div class="flex items-center">
          <span class="text-yellow-400 text-sm mr-2">{{ review.rating.toFixed(1) }}</span>
          <div class="flex">
            <i
              class="fa-solid h-3 w-3 fa-star text-[var(--Colors-Warning-200)]"
              v-for="n in 5"
              :key="n"
              :class="{
                'text-yellow-400': n <= review.rating,
                'hidden' : n > review.rating,
              }"
            ></i>
          </div>
        </div>
        
       
      </div>
    </div>
    <CarouselControls
      @prev="prevReview"
      @next="nextReview"
      v-if="reviews.length > reviewsPerPage"
    />
  </div>
</template>

<script>
import CarouselControls from "./CarouselControls.vue";

export default {
  components: {
    CarouselControls,
  },
  props: {
    reviews: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      currentIndex: 0,
      reviewsPerPage: 3,
    };
  },
  computed: {
    displayedReviews() {
      const start = this.currentIndex * this.reviewsPerPage;
      return this.reviews.slice(start, start + this.reviewsPerPage);
    },
    totalPages() {
      return Math.ceil(this.reviews.length / this.reviewsPerPage);
    },
  },
  methods: {
    nextReview() {
      if ((this.currentIndex + 1) * this.reviewsPerPage < this.reviews.length) {
        this.currentIndex++;
      }
    },
    prevReview() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    formatReviewDate(timestamp) {
      if (!timestamp) return "Recently";
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch (e) {
        console.error("Date formatting error:", e);
        return "Recently";
      }
    },
    getInitials(name) {
      if (!name) return "?";
      return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    },
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
