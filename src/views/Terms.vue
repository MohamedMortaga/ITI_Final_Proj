<template>
  <div class="min-h-screen bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-[var(--Color-Surface-Surface-Brand)] to-[var(--Color-Text-Text-Brand)] text-white py-16">
      <div class="container mx-auto px-6 lg:px-[88px] text-center">
        <h1 class="text-4xl lg:text-5xl font-bold mb-6">{{ $t('termsTitle') }}</h1>
        <p class="text-xl lg:text-2xl max-w-3xl mx-auto">{{ $t('termsSubtitle') }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-6 lg:px-[88px] py-16">
      <!-- Last Updated -->
      <div class="text-center mb-12">
        <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('lastUpdated') }}: {{ $t('lastUpdatedDate') }}</p>
      </div>

      <!-- Terms Content -->
      <div class="max-w-4xl mx-auto space-y-12">
        <!-- Introduction -->
        <section>
          <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('termsIntroduction') }}</h2>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8">
            <p class="text-lg leading-relaxed mb-4">{{ $t('termsIntroText1') }}</p>
            <p class="text-lg leading-relaxed mb-4">{{ $t('termsIntroText2') }}</p>
            <p class="text-lg leading-relaxed">{{ $t('termsIntroText3') }}</p>
          </div>
        </section>

        <!-- Definitions -->
        <section>
          <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('definitions') }}</h2>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8">
            <div class="space-y-4">
              <div>
                <h3 class="text-xl font-bold mb-2">{{ $t('serviceDefinition') }}</h3>
                <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('serviceDefinitionText') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-2">{{ $t('userDefinition') }}</h3>
                <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('userDefinitionText') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-2">{{ $t('contentDefinition') }}</h3>
                <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('contentDefinitionText') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-2">{{ $t('rentalDefinition') }}</h3>
                <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('rentalDefinitionText') }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Acceptance of Terms -->
        <section>
          <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('acceptanceOfTerms') }}</h2>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8">
            <p class="text-lg leading-relaxed mb-4">{{ $t('acceptanceText1') }}</p>
            <p class="text-lg leading-relaxed mb-4">{{ $t('acceptanceText2') }}</p>
            <p class="text-lg leading-relaxed">{{ $t('acceptanceText3') }}</p>
          </div>
        </section>

        <!-- User Accounts -->
        <section>
          <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('userAccounts') }}</h2>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8">
            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold mb-3">{{ $t('accountCreation') }}</h3>
                <p class="text-[var(--Color-Text-Text-Secondary)] mb-2">{{ $t('accountCreationText1') }}</p>
                <p class="text-[var(--Color-Text-Text-Secondary)] mb-2">{{ $t('accountCreationText2') }}</p>
                <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('accountCreationText3') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-3">{{ $t('accountSecurity') }}</h3>
                <p class="text-[var(--Color-Text-Text-Secondary)] mb-2">{{ $t('accountSecurityText1') }}</p>
                <p class="text-[var(--Color-Text-Text-Secondary)] mb-2">{{ $t('accountSecurityText2') }}</p>
                <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('accountSecurityText3') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-3">{{ $t('accountTermination') }}</h3>
                <p class="text-[var(--Color-Text-Text-Secondary)] mb-2">{{ $t('accountTerminationText1') }}</p>
                <p class="text-[var(--Color-Text-Text-Secondary)] mb-2">{{ $t('accountTerminationText2') }}</p>
                <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('accountTerminationText3') }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Service Usage -->
        <section>
          <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('serviceUsage') }}</h2>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8">
            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold mb-3">{{ $t('permittedUse') }}</h3>
                <ul class="list-disc list-inside space-y-2 text-[var(--Color-Text-Text-Secondary)]">
                  <li>{{ $t('permittedUse1') }}</li>
                  <li>{{ $t('permittedUse2') }}</li>
                  <li>{{ $t('permittedUse3') }}</li>
                  <li>{{ $t('permittedUse4') }}</li>
                </ul>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-3">{{ $t('prohibitedUse') }}</h3>
                <ul class="list-disc list-inside space-y-2 text-[var(--Color-Text-Text-Secondary)]">
                  <li>{{ $t('prohibitedUse1') }}</li>
                  <li>{{ $t('prohibitedUse2') }}</li>
                  <li>{{ $t('prohibitedUse3') }}</li>
                  <li>{{ $t('prohibitedUse4') }}</li>
                  <li>{{ $t('prohibitedUse5') }}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Rental Terms -->
        <section>
          <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('rentalTerms') }}</h2>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8">
            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold mb-3">{{ $t('listingItems') }}</h3>
                <p class="text-[var(--Color-Text-Text-Secondary)] mb-2">{{ $t('listingItemsText1') }}</p>
                <p class="text-[var(--Color-Text-Text-Secondary)] mb-2">{{ $t('listingItemsText2') }}</p>
                <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('listingItemsText3') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-3">{{ $t('rentalProcess') }}</h3>
                <p class="text-[var(--Color-Text-Text-Secondary)] mb-2">{{ $t('rentalProcessText1') }}</p>
                <p class="text-[var(--Color-Text-Text-Secondary)] mb-2">{{ $t('rentalProcessText2') }}</p>
                <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('rentalProcessText3') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-3">{{ $t('paymentTerms') }}</h3>
                <p class="text-[var(--Color-Text-Text-Secondary)] mb-2">{{ $t('paymentTermsText1') }}</p>
                <p class="text-[var(--Color-Text-Text-Secondary)] mb-2">{{ $t('paymentTermsText2') }}</p>
                <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('paymentTermsText3') }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Privacy and Data -->
        <section>
          <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('privacyAndData') }}</h2>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8">
            <p class="text-lg leading-relaxed mb-4">{{ $t('privacyText1') }}</p>
            <p class="text-lg leading-relaxed mb-4">{{ $t('privacyText2') }}</p>
            <p class="text-lg leading-relaxed">{{ $t('privacyText3') }}</p>
          </div>
        </section>

        <!-- Intellectual Property -->
        <section>
          <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('intellectualProperty') }}</h2>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8">
            <div class="space-y-4">
              <div>
                <h3 class="text-xl font-bold mb-2">{{ $t('platformIP') }}</h3>
                <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('platformIPText') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-2">{{ $t('userContent') }}</h3>
                <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('userContentText') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-2">{{ $t('license') }}</h3>
                <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('licenseText') }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Disclaimers -->
        <section>
          <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('disclaimers') }}</h2>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8">
            <div class="space-y-4">
              <div>
                <h3 class="text-xl font-bold mb-2">{{ $t('serviceDisclaimer') }}</h3>
                <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('serviceDisclaimerText') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-2">{{ $t('liabilityDisclaimer') }}</h3>
                <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('liabilityDisclaimerText') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-2">{{ $t('warrantyDisclaimer') }}</h3>
                <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t('warrantyDisclaimerText') }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Limitation of Liability -->
        <section>
          <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('limitationOfLiability') }}</h2>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8">
            <p class="text-lg leading-relaxed mb-4">{{ $t('liabilityText1') }}</p>
            <p class="text-lg leading-relaxed mb-4">{{ $t('liabilityText2') }}</p>
            <p class="text-lg leading-relaxed">{{ $t('liabilityText3') }}</p>
          </div>
        </section>

        <!-- Indemnification -->
        <section>
          <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('indemnification') }}</h2>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8">
            <p class="text-lg leading-relaxed mb-4">{{ $t('indemnificationText1') }}</p>
            <p class="text-lg leading-relaxed mb-4">{{ $t('indemnificationText2') }}</p>
            <p class="text-lg leading-relaxed">{{ $t('indemnificationText3') }}</p>
          </div>
        </section>

        <!-- Governing Law -->
        <section>
          <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('governingLaw') }}</h2>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8">
            <p class="text-lg leading-relaxed mb-4">{{ $t('governingLawText1') }}</p>
            <p class="text-lg leading-relaxed mb-4">{{ $t('governingLawText2') }}</p>
            <p class="text-lg leading-relaxed">{{ $t('governingLawText3') }}</p>
          </div>
        </section>

        <!-- Changes to Terms -->
        <section>
          <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('changesToTerms') }}</h2>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8">
            <p class="text-lg leading-relaxed mb-4">{{ $t('changesText1') }}</p>
            <p class="text-lg leading-relaxed mb-4">{{ $t('changesText2') }}</p>
            <p class="text-lg leading-relaxed">{{ $t('changesText3') }}</p>
          </div>
        </section>

        <!-- Contact Information -->
        <section>
          <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">{{ $t('contactInformation') }}</h2>
          <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8">
            <p class="text-lg leading-relaxed mb-4">{{ $t('contactText1') }}</p>
            <p class="text-lg leading-relaxed mb-4">{{ $t('contactText2') }}</p>
            <p class="text-lg leading-relaxed">{{ $t('contactText3') }}</p>
          </div>
        </section>
      </div>
    </div>
    
    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script>
import AppFooter from '../components/pages/AppFooter.vue';

export default {
  name: 'Terms',
  components: {
    AppFooter
  }
}
</script> 