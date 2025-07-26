<template>
  <div class="min-h-screen bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-[var(--Color-Surface-Surface-Brand)] to-[var(--Color-Text-Text-Brand)] text-[var(--Color-Text-Text-Invert)] py-16">
      <div class="container mx-auto px-6 lg:px-[88px] text-center">
        <h1 class="text-4xl lg:text-5xl font-bold mb-6">{{ $t('overviewTitle') }}</h1>
        <p class="text-xl lg:text-2xl max-w-3xl mx-auto">{{ $t('overviewSubtitle') }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-6 lg:px-[88px] py-16">
      <!-- What is Rento Section -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8 text-center">{{ $t('whatIsRento') }}</h2>
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p class="text-lg leading-relaxed mb-6">{{ $t('overviewDescription1') }}</p>
            <p class="text-lg leading-relaxed mb-6">{{ $t('overviewDescription2') }}</p>
            <p class="text-lg leading-relaxed">{{ $t('overviewDescription3') }}</p>
          </div>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-2xl p-8">
            <h3 class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('keyFeatures') }}</h3>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <div class="w-6 h-6 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i class="fas fa-check text-[var(--Color-Text-Text-Invert)] text-sm"></i>
                </div>
                <span class="text-lg">{{ $t('feature1') }}</span>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-6 h-6 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i class="fas fa-check text-[var(--Color-Text-Text-Invert)] text-sm"></i>
                </div>
                <span class="text-lg">{{ $t('feature2') }}</span>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-6 h-6 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i class="fas fa-check text-[var(--Color-Text-Text-Invert)] text-sm"></i>
                </div>
                <span class="text-lg">{{ $t('feature3') }}</span>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-6 h-6 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i class="fas fa-check text-[var(--Color-Text-Text-Invert)] text-sm"></i>
                </div>
                <span class="text-lg">{{ $t('feature4') }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-12 text-center">{{ $t('howItWorks') }}</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-20 h-20 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-search text-[var(--Color-Text-Text-Invert)] text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t('step1Title') }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('step1Description') }}</p>
          </div>
          <div class="text-center">
            <div class="w-20 h-20 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-calendar-check text-[var(--Color-Text-Text-Invert)] text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t('step2Title') }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('step2Description') }}</p>
          </div>
          <div class="text-center">
            <div class="w-20 h-20 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-handshake text-[var(--Color-Text-Text-Invert)] text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t('step3Title') }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('step3Description') }}</p>
          </div>
        </div>
      </section>

      <!-- Statistics Section -->
      <section class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-2xl p-8 mb-16">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8 text-center">{{ $t('platformStats') }}</h2>
        <div class="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold text-[var(--Color-Surface-Surface-Brand)] mb-2">10,000+</div>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('activeUsers') }}</p>
          </div>
          <div>
            <div class="text-4xl font-bold text-[var(--Color-Surface-Surface-Brand)] mb-2">5,000+</div>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('itemsListed') }}</p>
          </div>
          <div>
            <div class="text-4xl font-bold text-[var(--Color-Surface-Surface-Brand)] mb-2">15,000+</div>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('successfulRentals') }}</p>
          </div>
          <div>
            <div class="text-4xl font-bold text-[var(--Color-Surface-Surface-Brand)] mb-2">4.8★</div>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('userRating') }}</p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="text-center">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('readyToStart') }}</h2>
        <p class="text-xl text-[var(--Color-Text-Text-Secondary)] mb-8 max-w-2xl mx-auto">{{ $t('ctaDescription') }}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/all-products"
            class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--Color-Text-Text-Brand)] transition"
          >
            {{ $t('browseTools') }}
          </router-link>
          <router-link
            to="/addProduct"
            class="border-2 border-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Surface-Surface-Brand)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--Color-Surface-Surface-Brand)] hover:text-[var(--Color-Text-Text-Invert)] transition"
          >
            {{ $t('listYourItem') }}
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
  name: 'Overview',
  components: {
    AppFooter
  }
}
</script> 