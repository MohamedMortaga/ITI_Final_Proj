<template>
  <div class="min-h-screen flex items-center justify-center px-4 lg:px-6 xl:px-[88px]"
       :style="{ backgroundColor: 'var(--Color-Surface-Surface-Primary)', color: 'var(--Color-Text-Text-Primary)' }">
    <div class="max-w-2xl mx-auto text-center">
      <!-- 404 Icon/Illustration -->
      <div class="mb-8">
        <div class="relative mx-auto w-32 h-32 mb-6">
          <!-- Outer circle -->
          <div class="absolute inset-0 bg-gradient-to-br from-[var(--Colors-Primary-100)] to-[var(--Colors-Primary-300)] rounded-full opacity-20 animate-pulse"></div>
          <!-- Inner circle -->
          <div class="absolute inset-4 bg-gradient-to-br from-[var(--Colors-Primary-400)] to-[var(--Colors-Primary-600)] rounded-full flex items-center justify-center">
            <span class="text-4xl font-bold text-white">404</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <h1 class="text-4xl lg:text-6xl font-bold mb-4 text-[var(--Color-Text-Text-Primary)]">
        {{ $t('pageNotFound') || 'Page Not Found' }}
      </h1>
      
      <p class="text-lg lg:text-xl text-[var(--Color-Text-Text-Secondary)] mb-8 max-w-md mx-auto">
        {{ $t('pageNotFoundDescription') || 'Oops! The page you are looking for doesn\'t exist. It might have been moved, deleted, or you entered the wrong URL.' }}
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <!-- Go Home Button -->
        <button 
          @click="goHome"
          class="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[var(--Colors-Primary-500)] text-white font-semibold rounded-lg hover:bg-[var(--Colors-Primary-600)] transition-all duration-300 group min-w-[200px] relative overflow-hidden"
        >
          <span class="group-hover:translate-x-[-4px] transition-transform duration-300">
            {{ $t('goToHome') || 'Go to Home' }}
          </span>
          <svg
            class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute right-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <!-- Go Back Button -->
        <button 
          @click="goBack"
          class="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-[var(--Colors-Gray-300)] text-[var(--Color-Text-Text-Primary)] font-semibold rounded-lg hover:border-[var(--Colors-Primary-400)] hover:text-[var(--Colors-Primary-500)] transition-all duration-300 group min-w-[200px]"
        >
          <span class="group-hover:translate-x-[-4px] transition-transform duration-300">
            {{ $t('goBack') || 'Go Back' }}
          </span>
          <svg
            class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute right-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <!-- Additional Help -->
      <div class="mt-12 p-6 bg-white rounded-xl border border-[var(--Colors-Gray-100)]">
        <h3 class="text-lg font-semibold mb-3 text-[var(--Color-Text-Text-Primary)]">
          {{ $t('needHelp') || 'Need Help?' }}
        </h3>
        <p class="text-[var(--Color-Text-Text-Secondary)] mb-4">
          {{ $t('contactSupport') || 'If you believe this is an error, please contact our support team.' }}
        </p>
        <router-link 
          to="/contact"
          class="inline-flex items-center gap-2 text-[var(--Colors-Primary-500)] hover:text-[var(--Colors-Primary-600)] font-medium transition-colors duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {{ $t('contactUs') || 'Contact Us' }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorPage",
  methods: {
    goHome() {
      this.$router.push('/home');
    },
    goBack() {
      // Check if there's a previous page in browser history
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        // If no history, go to home page
        this.$router.push('/home');
      }
    }
  },
};
</script>

<style scoped>
/* Custom animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Gradient text effect */
.gradient-text {
  background: linear-gradient(135deg, var(--Colors-Primary-500), var(--Colors-Primary-600));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>