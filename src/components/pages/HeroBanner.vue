<template>
  <div class="w-full mt-6">
    <div class="relative rounded-[16px] overflow-hidden w-full">
      <div class="relative h-[400px] lg:h-[500px]">
        <!-- Unified Hero Container -->
        <div class="relative h-full w-full">
          <!-- Slides Container -->
          <div class="relative h-full w-full overflow-hidden rounded-[16px]">
            <div class="relative h-full w-full">
              <!-- Horizontal Image Stream -->
              <div class="flex h-full transition-transform duration-1000 ease-in-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                <div 
                  v-for="(slide, index) in slides" 
                  :key="slide.id"
                  class="flex-shrink-0 w-full h-full"
                >
                  <!-- Background Image with Overlay -->
                  <div class="relative h-full w-full">
                    <img 
                      :src="slide.image" 
                      :alt="slide.alt" 
                      class="w-full h-full object-cover"
                    />
                    <!-- Gradient overlay for better text readability -->
                    <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
                    
                    <!-- Unified Content Overlay -->
                    <div class="absolute inset-0 flex items-center">
                      <div class="flex-1 flex items-center justify-center lg:justify-start p-8 lg:p-12">
                        <div class="text-center lg:text-left max-w-2xl text-white">
                          <!-- Hero Content with Dissolve Transition -->
                          <transition-group 
                            name="dissolve" 
                            tag="div"
                            class="space-y-6"
                          >
                            <div key="title" class="mb-6">
                              <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                                {{ slide.title }}
                              </h1>
                            </div>
                            
                            <div key="subtitle" class="mb-8">
                              <p class="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-2xl mx-auto lg:mx-0">
                                {{ slide.subtitle }}
                              </p>
                            </div>
                            
                            <div key="buttons" class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
                              <button 
                                @click="handlePrimaryAction"
                                class="bg-[var(--Color-Text-Text-Brand)] hover:bg-[var(--Color-Text-Text-Brand)]/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                              >
                                {{ slide.primaryButton }}
                              </button>
                              <button 
                                @click="handleSecondaryAction"
                                class="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 border border-white/30"
                              >
                                {{ slide.secondaryButton }}
                              </button>
                            </div>
                            
                            <div key="stats" class="flex flex-wrap justify-center lg:justify-start gap-8 text-sm md:text-base">
                              <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-[var(--Color-Text-Text-Brand)]" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>{{ slide.stats.verified }}</span>
                              </div>
                              <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-[var(--Color-Text-Text-Brand)]" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                                </svg>
                                <span>{{ slide.stats.categories }}</span>
                              </div>
                              <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-[var(--Color-Text-Text-Brand)]" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 13c0 1.01-.377 1.94-1 2.65V19a1 1 0 11-2 0v-1.35A3 3 0 0114 16c0-.34.024-.673.07-1H12.93z"/>
                                </svg>
                                <span>{{ slide.stats.users }}</span>
                              </div>
                            </div>
                          </transition-group>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Arrows -->
          <button 
            @click="prevSlide"
            class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button 
            @click="nextSlide"
            class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          
          <!-- Slide Indicators -->
          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
            <button 
              v-for="(slide, index) in slides" 
              :key="index"
              @click="goToSlide(index)"
              class="w-3 h-3 rounded-full transition-all duration-300"
              :class="{
                'bg-white w-8': currentSlide === index,
                'bg-white/50 hover:bg-white/70': currentSlide !== index
              }"
              :aria-label="`Go to slide ${index + 1}`"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentSlide = ref(0);
let slideInterval = null;

const slides = [
  { 
    id: 0, 
    image: new URL('@/assets/side-view-woman-with-photo-camera.jpg', import.meta.url).href,
    alt: 'Woman with Photo Camera',
    title: 'Rent Anything, Anywhere',
    subtitle: 'Discover thousands of tools and equipment available for rent. From cameras to camping gear, find what you need without the commitment of buying.',
    primaryButton: 'Start Renting Now',
    secondaryButton: 'Browse Categories',
    stats: {
      verified: '500+ Verified Items',
      categories: '50+ Categories',
      users: '10K+ Happy Users'
    }
  },
  { 
    id: 1, 
    image: new URL('@/assets/top-view-photo-camera-indoors-still-life.jpg', import.meta.url).href,
    alt: 'Photo Camera Still Life',
    title: 'Save Money, Live Better',
    subtitle: 'Why buy when you can rent? Access premium equipment at a fraction of the cost. Perfect for projects, events, and temporary needs.',
    primaryButton: 'Explore Savings',
    secondaryButton: 'How It Works',
    stats: {
      verified: 'Save up to 80%',
      categories: '24/7 Support',
      users: 'Secure Payments'
    }
  },
  { 
    id: 2, 
    image: new URL('@/assets/close-up-journalism-camera.jpg', import.meta.url).href,
    alt: 'Close-up Journalism Camera',
    title: 'Trusted by Thousands',
    subtitle: 'Join our community of renters and owners. Every item is verified, every transaction is secure, and every experience is exceptional.',
    primaryButton: 'Join Community',
    secondaryButton: 'Read Reviews',
    stats: {
      verified: '4.8★ Rating',
      categories: 'Instant Booking',
      users: '24hr Delivery'
    }
  }
];

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

const handlePrimaryAction = () => {
  // Navigate to signup if not authenticated, otherwise to products
  const user = localStorage.getItem('user');
  if (user) {
    router.push('/all-products');
  } else {
    router.push('/signup');
  }
};

const handleSecondaryAction = () => {
  router.push('/all-products');
};

const startInterval = () => {
  slideInterval = setInterval(() => {
    nextSlide();
  }, 6000); // Increased to 6 seconds for better UX
};

const resetInterval = () => {
  if (slideInterval) {
    clearInterval(slideInterval);
    startInterval();
  }
};

const stopInterval = () => {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
};

onMounted(() => {
  startInterval();
});

onUnmounted(() => {
  stopInterval();
});
</script>

<style scoped>
/* Enhanced smooth dissolve transitions for text content */
.dissolve-enter-active,
.dissolve-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.dissolve-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.98);
}

.dissolve-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.98);
}

/* Staggered animation for text elements */
.dissolve-enter-active .dissolve-enter-active {
  transition-delay: 0.1s;
}

/* Enhanced smooth hover effects */
button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Smooth navigation arrow transitions */
button svg {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover svg {
  transform: scale(1.1);
}

/* Smooth indicator transitions */
button[aria-label*="Go to slide"] {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

button[aria-label*="Go to slide"]:hover {
  transform: scale(1.2);
}

/* Responsive text adjustments */
@media (max-width: 640px) {
  h1 {
    font-size: 2rem;
  }
  
  p {
    font-size: 1rem;
  }
}

/* Additional smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.3s;
}

/* Smooth image transitions */
img {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced overlay transitions */
.bg-black\/20 {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>