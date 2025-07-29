<template>
  <div class="w-ful mt-6">
    <div class=" relative rounded-[16px] overflow-hidden w-full">
      <div class="relative h-[220px]">
        <!-- Slides Container -->
        <div class="relative h-full w-full overflow-hidden rounded-[16px]">
          <!-- Slides with transition -->
          <transition-group name="slide" tag="div" class="h-full w-full">
            <div 
              v-for="(slide, index) in slides" 
              :key="slide.id"
              v-show="currentSlide === index"
              class="absolute inset-0 h-full w-full rounded-[16px]"
            >
              <img 
                :src="slide.image" 
                :alt="slide.alt" 
                class="w-full h-full object-cover rounded-[16px]"
              />
            </div>
          </transition-group>
        </div>
        
        <!-- Navigation Arrows -->
        <button 
          @click="prevSlide"
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
          aria-label="Previous slide"
        >
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button 
          @click="nextSlide"
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
          aria-label="Next slide"
        >
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        <!-- Slide Indicators -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          <button 
            v-for="(slide, index) in slides" 
            :key="'indicator-'+slide.id"
            @click="goToSlide(index)"
            class="w-3 h-3 rounded-full transition-all duration-300"
            :class="{
              'bg-white w-6': currentSlide === index,
              'bg-white/50 hover:bg-white/70': currentSlide !== index
            }"
            :aria-label="`Go to slide ${index + 1}`"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const slides = [
  { 
    id: 0, 
    image: new URL('@/assets/slide1.jpg', import.meta.url).href,
    alt: 'Featured Products 1'
  },
  { 
    id: 1, 
    image: new URL('@/assets/slide2.jpg', import.meta.url).href,
    alt: 'Featured Products 2'
  },
  { 
    id: 2, 
    image: new URL('@/assets/slide3.png', import.meta.url).href,
    alt: 'Featured Products 3'
  }
];

const currentSlide = ref(0);
let slideInterval;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
  resetInterval();
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
  resetInterval();
};

const goToSlide = (index) => {
  currentSlide.value = index;
  resetInterval();
};

const startInterval = () => {
  slideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
};

const resetInterval = () => {
  clearInterval(slideInterval);
  startInterval();
};

onMounted(() => {
  startInterval();
});

onUnmounted(() => {
  clearInterval(slideInterval);
});
</script>

<style scoped>
/* Slide transition animation */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-leave-active {
  position: absolute;
  width: 100%;
}

/* Ensure rounded corners are maintained */
img {
  border-radius: 16px;
}
</style>