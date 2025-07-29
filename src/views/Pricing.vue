<template>
  <div class="min-h-screen bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-[var(--Color-Surface-Surface-Brand)] to-[var(--Color-Text-Text-Brand)] text-white py-16">
      <div class="container mx-auto px-6 lg:px-[88px] text-center">
        <h1 class="text-4xl lg:text-5xl font-bold mb-6">{{ $t('pricingTitle') }}</h1>
        <p class="text-xl lg:text-2xl max-w-3xl mx-auto">{{ $t('pricingSubtitle') }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-6 lg:px-[88px] py-16">
      <!-- Commission Structure -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8 text-center">{{ $t('commissionStructure') }}</h2>
        <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-2xl p-8 mb-8">
          <div class="text-center mb-8">
            <div class="text-6xl font-bold text-[var(--Color-Surface-Surface-Brand)] mb-4">10%</div>
            <h3 class="text-2xl font-bold mb-4">{{ $t('commissionRate') }}</h3>
            <p class="text-lg text-[var(--Color-Text-Text-Secondary)]">{{ $t('commissionDescription') }}</p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-8">
            <div class="bg-[var(--Color-Surface-Surface-Primary)] rounded-xl p-6">
              <h4 class="text-xl font-bold text-[var(--Color-Text-Text-Brand)] mb-4">{{ $t('forRenters') }}</h4>
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <i class="fas fa-check text-[var(--Color-Surface-Surface-Brand)] mt-1"></i>
                  <span>{{ $t('renterBenefit1') }}</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check text-[var(--Color-Surface-Surface-Brand)] mt-1"></i>
                  <span>{{ $t('renterBenefit2') }}</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check text-[var(--Color-Surface-Surface-Brand)] mt-1"></i>
                  <span>{{ $t('renterBenefit3') }}</span>
                </li>
              </ul>
            </div>
            
            <div class="bg-[var(--Color-Surface-Surface-Primary)] rounded-xl p-6">
              <h4 class="text-xl font-bold text-[var(--Color-Text-Text-Brand)] mb-4">{{ $t('forOwners') }}</h4>
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <i class="fas fa-check text-[var(--Color-Surface-Surface-Brand)] mt-1"></i>
                  <span>{{ $t('ownerBenefit1') }}</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check text-[var(--Color-Surface-Surface-Brand)] mt-1"></i>
                  <span>{{ $t('ownerBenefit2') }}</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check text-[var(--Color-Surface-Surface-Brand)] mt-1"></i>
                  <span>{{ $t('ownerBenefit3') }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Examples -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8 text-center">{{ $t('pricingExamples') }}</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
            <div class="text-center mb-6">
              <i class="fas fa-camera text-4xl text-[var(--Color-Surface-Surface-Brand)] mb-4"></i>
              <h3 class="text-xl font-bold mb-2">{{ $t('cameraRental') }}</h3>
              <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('cameraDescription') }}</p>
            </div>
            <div class="border-t border-[var(--Color-Boarder-Border-Primary)] pt-4">
              <div class="flex justify-between mb-2">
                <span>{{ $t('dailyRate') }}</span>
                <span class="font-bold">$50</span>
              </div>
              <div class="flex justify-between mb-2">
                <span>{{ $t('platformFee') }}</span>
                <span class="text-[var(--Color-Surface-Surface-Brand)]">$5 (10%)</span>
              </div>
              <div class="flex justify-between font-bold text-lg">
                <span>{{ $t('ownerEarns') }}</span>
                <span>$45</span>
              </div>
            </div>
          </div>

          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
            <div class="text-center mb-6">
              <i class="fas fa-tools text-4xl text-[var(--Color-Surface-Surface-Brand)] mb-4"></i>
              <h3 class="text-xl font-bold mb-2">{{ $t('toolRental') }}</h3>
              <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('toolDescription') }}</p>
            </div>
            <div class="border-t border-[var(--Color-Boarder-Border-Primary)] pt-4">
              <div class="flex justify-between mb-2">
                <span>{{ $t('dailyRate') }}</span>
                <span class="font-bold">$30</span>
              </div>
              <div class="flex justify-between mb-2">
                <span>{{ $t('platformFee') }}</span>
                <span class="text-[var(--Color-Surface-Surface-Brand)]">$3 (10%)</span>
              </div>
              <div class="flex justify-between font-bold text-lg">
                <span>{{ $t('ownerEarns') }}</span>
                <span>$27</span>
              </div>
            </div>
          </div>

          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
            <div class="text-center mb-6">
              <i class="fas fa-campground text-4xl text-[var(--Color-Surface-Surface-Brand)] mb-4"></i>
              <h3 class="text-xl font-bold mb-2">{{ $t('campingRental') }}</h3>
              <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('campingDescription') }}</p>
            </div>
            <div class="border-t border-[var(--Color-Boarder-Border-Primary)] pt-4">
              <div class="flex justify-between mb-2">
                <span>{{ $t('dailyRate') }}</span>
                <span class="font-bold">$80</span>
              </div>
              <div class="flex justify-between mb-2">
                <span>{{ $t('platformFee') }}</span>
                <span class="text-[var(--Color-Surface-Surface-Brand)]">$8 (10%)</span>
              </div>
              <div class="flex justify-between font-bold text-lg">
                <span>{{ $t('ownerEarns') }}</span>
                <span>$72</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8 text-center">{{ $t('pricingFAQ') }}</h2>
        <div class="space-y-6">
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
            <h3 class="text-xl font-bold mb-3">{{ $t('faq1Question') }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('faq1Answer') }}</p>
          </div>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
            <h3 class="text-xl font-bold mb-3">{{ $t('faq2Question') }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('faq2Answer') }}</p>
          </div>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
            <h3 class="text-xl font-bold mb-3">{{ $t('faq3Question') }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('faq3Answer') }}</p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="text-center">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('startEarning') }}</h2>
        <p class="text-xl text-[var(--Color-Text-Text-Secondary)] mb-8 max-w-2xl mx-auto">{{ $t('pricingCTA') }}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/addProduct"
            class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--Color-Text-Text-Brand)] transition"
          >
            {{ $t('listYourItem') }}
          </router-link>
          <router-link
            to="/contact"
            class="border-2 border-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Surface-Surface-Brand)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--Color-Surface-Surface-Brand)] hover:text-[var(--Color-Text-Text-Invert)] transition"
          >
            {{ $t('contactUs') }}
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
  name: 'Pricing',
  components: {
    AppFooter
  }
}
</script> 