<template>
  <div class="container mx-auto px-4 mt-12 mb-16">
    <h3 class="text-center text-xl font-bold mb-6">
      {{ $t('whatCustomersSay') }}
    </h3>
    <div class="flex flex-col lg:flex-row gap-6 justify-center">
      <div
        v-for="review in displayedReviews"
        :key="review.id"
        class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 flex-1 w-full max-w-full md:max-w-lg md:w-[90%] mx-auto"
      >
        <div class="flex items-center mb-2">
          <span class="text-yellow-400 text-lg mr-2">{{ review.rating.toFixed(1) }}</span>
          <i
            class="fa-solid fa-star text-yellow-400"
            v-for="n in Math.floor(review.rating)"
            :key="n"
          ></i>
          <i
            v-if="review.rating % 1 >= 0.5"
            class="fa-solid fa-star-half-stroke text-yellow-400"
          ></i>
        </div>
        <p class="text-sm mb-4">{{ review.comment }}</p>
        <div class="flex items-center gap-2">
          <img
            :src="review.userImage"
            alt="user"
            class="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <div class="font-semibold text-xs">{{ review.userName }}</div>
            <div class="text-xs text-[var(--Color-Text-Text-Secondary)]">
              {{ review.date }}
            </div>
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
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>