<template>
  <div class="min-h-screen bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-[var(--Color-Surface-Surface-Brand)] to-[var(--Color-Text-Text-Brand)] text-white py-16">
      <div class="container mx-auto px-6 lg:px-[88px] text-center">
        <h1 class="text-4xl lg:text-5xl font-bold mb-6">{{ $t('featuresTitle') }}</h1>
        <p class="text-xl lg:text-2xl max-w-3xl mx-auto">{{ $t('featuresSubtitle') }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-6 lg:px-[88px] py-16">
      <!-- Core Features -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-12 text-center">{{ $t('coreFeatures') }}</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
            <div class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mb-6">
              <i class="fas fa-shield-alt text-[var(--Color-Text-Text-Invert)] text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t('securePayments') }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('securePaymentsDesc') }}</p>
          </div>

          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
            <div class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mb-6">
              <i class="fas fa-user-check text-[var(--Color-Text-Text-Invert)] text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t('verifiedUsers') }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('verifiedUsersDesc') }}</p>
          </div>

          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
            <div class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mb-6">
              <i class="fas fa-comments text-[var(--Color-Text-Text-Invert)] text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t('realTimeChat') }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('realTimeChatDesc') }}</p>
          </div>

          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
            <div class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mb-6">
              <i class="fas fa-calendar-alt text-[var(--Color-Text-Text-Invert)] text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t('flexibleScheduling') }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('flexibleSchedulingDesc') }}</p>
          </div>

          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
            <div class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mb-6">
              <i class="fas fa-star text-[var(--Color-Text-Text-Invert)] text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t('reviewSystem') }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('reviewSystemDesc') }}</p>
          </div>

          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
            <div class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mb-6">
              <i class="fas fa-mobile-alt text-[var(--Color-Text-Text-Invert)] text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t('mobileApp') }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('mobileAppDesc') }}</p>
          </div>
        </div>
      </section>

      <!-- Advanced Features -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8 text-center">{{ $t('advancedFeatures') }}</h2>
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('smartMatching') }}</h3>
            <p class="text-lg leading-relaxed mb-6">{{ $t('smartMatchingDesc') }}</p>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <i class="fas fa-check text-[var(--Color-Surface-Surface-Brand)] mt-1"></i>
                <span>{{ $t('matchingFeature1') }}</span>
              </li>
              <li class="flex items-start gap-3">
                <i class="fas fa-check text-[var(--Color-Surface-Surface-Brand)] mt-1"></i>
                <span>{{ $t('matchingFeature2') }}</span>
              </li>
              <li class="flex items-start gap-3">
                <i class="fas fa-check text-[var(--Color-Surface-Surface-Brand)] mt-1"></i>
                <span>{{ $t('matchingFeature3') }}</span>
              </li>
            </ul>
          </div>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-2xl p-8">
            <div class="text-center">
              <i class="fas fa-brain text-6xl text-[var(--Color-Surface-Surface-Brand)] mb-4"></i>
              <h4 class="text-xl font-bold mb-2">{{ $t('aiPowered') }}</h4>
              <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('aiPoweredDesc') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Safety & Security -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8 text-center">{{ $t('safetySecurity') }}</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-20 h-20 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-lock text-[var(--Color-Text-Text-Invert)] text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t('dataProtection') }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('dataProtectionDesc') }}</p>
          </div>
          <div class="text-center">
            <div class="w-20 h-20 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-shield-virus text-[var(--Color-Text-Text-Invert)] text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t('fraudProtection') }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('fraudProtectionDesc') }}</p>
          </div>
          <div class="text-center">
            <div class="w-20 h-20 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-headset text-[var(--Color-Text-Text-Invert)] text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t('customerSupport') }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('customerSupportDesc') }}</p>
          </div>
        </div>
      </section>

      <!-- Integration Features -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8 text-center">{{ $t('integrations') }}</h2>
        <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-2xl p-8">
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="text-center">
              <i class="fab fa-google text-4xl text-[var(--Color-Surface-Surface-Brand)] mb-3"></i>
              <h4 class="font-bold">{{ $t('googleMaps') }}</h4>
              <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t('googleMapsDesc') }}</p>
            </div>
            <div class="text-center">
              <i class="fab fa-stripe text-4xl text-[var(--Color-Surface-Surface-Brand)] mb-3"></i>
              <h4 class="font-bold">{{ $t('stripePayments') }}</h4>
              <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t('stripePaymentsDesc') }}</p>
            </div>
            <div class="text-center">
              <i class="fab fa-firebase text-4xl text-[var(--Color-Surface-Surface-Brand)] mb-3"></i>
              <h4 class="font-bold">{{ $t('firebaseBackend') }}</h4>
              <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t('firebaseBackendDesc') }}</p>
            </div>
            <div class="text-center">
              <i class="fas fa-robot text-4xl text-[var(--Color-Surface-Surface-Brand)] mb-3"></i>
              <h4 class="font-bold">{{ $t('firebaseAI') }}</h4>
              <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t('firebaseAIDesc') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="text-center">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('experienceFeatures') }}</h2>
        <p class="text-xl text-[var(--Color-Text-Text-Secondary)] mb-8 max-w-2xl mx-auto">{{ $t('featuresCTA') }}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/signup"
            class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--Color-Text-Text-Brand)] transition"
          >
            {{ $t('getStarted') }}
          </router-link>
          <router-link
            to="/contact"
            class="border-2 border-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Surface-Surface-Brand)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--Color-Surface-Surface-Brand)] hover:text-[var(--Color-Text-Text-Invert)] transition"
          >
            {{ $t('learnMore') }}
          </router-link>
        </div>
      </section>
    </div>
    
    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script>
import AppFooter from '../components/pages/AppFooter.vue';

export default {
  name: 'Features',
  components: {
    AppFooter
  }
}
</script> 