<template>
  <div
    class="min-h-screen bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]"
  >
    <!-- Header Section -->
    <div
      class="bg-gradient-to-r from-[var(--Color-Surface-Surface-Brand)] to-[var(--Color-Text-Text-Brand)] text-[var(--Color-Text-Surface-Text-Invert)] py-16"
    >
      <div class="container mx-auto px-6 lg:px-[88px] text-center">
        <h1 class="text-4xl lg:text-5xl font-bold mb-6">{{ $t("privacyTitle") }}</h1>
        <p class="text-xl lg:text-2xl max-w-3xl mx-auto">{{ $t("privacySubtitle") }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-6 lg:px-[88px] py-16">
      <!-- Last Updated -->
      <div
        class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 mb-8"
      >
        <p class="text-[var(--Color-Text-Text-Secondary)] text-center">
          <strong>{{ $t("lastUpdated") }}:</strong> {{ $t("lastUpdatedDate") }}
        </p>
      </div>

      <!-- Information We Collect -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Text-Brand)] mb-8">
          {{ $t("informationWeCollect") }}
        </h2>
        <div
          class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8"
        >
          <h3 class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">
            {{ $t("personalInformation") }}
          </h3>
          <p class="text-lg leading-relaxed mb-6">{{ $t("personalInfoDesc") }}</p>
          <ul class="space-y-4 mb-8">
            <li class="flex items-start gap-3">
              <i class="fas fa-user text-[var(--Color-Surface-Surface-Brand)] mt-1"></i>
              <span>{{ $t("personalInfo1") }}</span>
            </li>
            <li class="flex items-start gap-3">
              <i
                class="fas fa-envelope text-[var(--Color-Surface-Surface-Brand)] mt-1"
              ></i>
              <span>{{ $t("personalInfo2") }}</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-phone text-[var(--Color-Surface-Surface-Brand)] mt-1"></i>
              <span>{{ $t("personalInfo3") }}</span>
            </li>
            <li class="flex items-start gap-3">
              <i
                class="fas fa-map-marker-alt text-[var(--Color-Surface-Surface-Brand)] mt-1"
              ></i>
              <span>{{ $t("personalInfo4") }}</span>
            </li>
          </ul>

          <h3 class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">
            {{ $t("usageInformation") }}
          </h3>
          <p class="text-lg leading-relaxed mb-6">{{ $t("usageInfoDesc") }}</p>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <i class="fas fa-search text-[var(--Color-Surface-Surface-Brand)] mt-1"></i>
              <span>{{ $t("usageInfo1") }}</span>
            </li>
            <li class="flex items-start gap-3">
              <i
                class="fas fa-calendar text-[var(--Color-Surface-Surface-Brand)] mt-1"
              ></i>
              <span>{{ $t("usageInfo2") }}</span>
            </li>
            <li class="flex items-start gap-3">
              <i
                class="fas fa-comments text-[var(--Color-Surface-Surface-Brand)] mt-1"
              ></i>
              <span>{{ $t("usageInfo3") }}</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-star text-[var(--Color-Surface-Surface-Brand)] mt-1"></i>
              <span>{{ $t("usageInfo4") }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- How We Use Information -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8">
          {{ $t("howWeUseInfo") }}
        </h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6"
          >
            <div
              class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mb-6"
            >
              <i class="fas fa-cogs text-[var(--Color-Text-Text-Invert)] text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t("serviceProvision") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">
              {{ $t("serviceProvisionDesc") }}
            </p>
          </div>

          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6"
          >
            <div
              class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mb-6"
            >
              <i
                class="fas fa-shield-alt text-[var(--Color-Text-Text-Invert)] text-2xl"
              ></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t("securitySafety") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">
              {{ $t("securitySafetyDesc") }}
            </p>
          </div>

          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6"
          >
            <div
              class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mb-6"
            >
              <i
                class="fas fa-chart-line text-[var(--Color-Text-Text-Invert)] text-2xl"
              ></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t("analyticsImprovement") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">
              {{ $t("analyticsImprovementDesc") }}
            </p>
          </div>

          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6"
          >
            <div
              class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mb-6"
            >
              <i
                class="fas fa-bullhorn text-[var(--Color-Text-Text-Invert)] text-2xl"
              ></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t("communication") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">
              {{ $t("communicationDesc") }}
            </p>
          </div>
        </div>
      </section>

      <!-- Information Sharing -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8">
          {{ $t("informationSharing") }}
        </h2>
        <div
          class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8"
        >
          <p class="text-lg leading-relaxed mb-6">{{ $t("sharingDesc") }}</p>

          <h3 class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">
            {{ $t("weDoNotShare") }}
          </h3>
          <ul class="space-y-4 mb-8">
            <li class="flex items-start gap-3">
              <i class="fas fa-times-circle text-red-500 mt-1"></i>
              <span>{{ $t("noShare1") }}</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-times-circle text-red-500 mt-1"></i>
              <span>{{ $t("noShare2") }}</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-times-circle text-red-500 mt-1"></i>
              <span>{{ $t("noShare3") }}</span>
            </li>
          </ul>

          <h3 class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">
            {{ $t("weMayShare") }}
          </h3>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <i
                class="fas fa-check-circle text-[var(--Color-Surface-Surface-Brand)] mt-1"
              ></i>
              <span>{{ $t("mayShare1") }}</span>
            </li>
            <li class="flex items-start gap-3">
              <i
                class="fas fa-check-circle text-[var(--Color-Surface-Surface-Brand)] mt-1"
              ></i>
              <span>{{ $t("mayShare2") }}</span>
            </li>
            <li class="flex items-start gap-3">
              <i
                class="fas fa-check-circle text-[var(--Color-Surface-Surface-Brand)] mt-1"
              ></i>
              <span>{{ $t("mayShare3") }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- Your Rights -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8">
          {{ $t("yourRights") }}
        </h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6"
          >
            <h3 class="text-xl font-bold mb-4">{{ $t("accessRight") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">
              {{ $t("accessRightDesc") }}
            </p>
          </div>
          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6"
          >
            <h3 class="text-xl font-bold mb-4">{{ $t("correctionRight") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">
              {{ $t("correctionRightDesc") }}
            </p>
          </div>
          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6"
          >
            <h3 class="text-xl font-bold mb-4">{{ $t("deletionRight") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">
              {{ $t("deletionRightDesc") }}
            </p>
          </div>
          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6"
          >
            <h3 class="text-xl font-bold mb-4">{{ $t("portabilityRight") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">
              {{ $t("portabilityRightDesc") }}
            </p>
          </div>
        </div>
      </section>

      <!-- Contact Information -->
      <section class="text-center">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">
          {{ $t("contactUs") }}
        </h2>
        <p class="text-xl text-[var(--Color-Text-Text-Secondary)] mb-8 max-w-2xl mx-auto">
          {{ $t("privacyContactDesc") }}
        </p>
        <div
          class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8 max-w-md mx-auto"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-center gap-3">
              <i class="fas fa-envelope text-[var(--Color-Surface-Surface-Brand)]"></i>
              <span>privacy@rento.com</span>
            </div>
            <div class="flex items-center justify-center gap-3">
              <i class="fas fa-phone text-[var(--Color-Surface-Surface-Brand)]"></i>
              <span>+1 (555) 123-4567</span>
            </div>
            <div class="flex items-center justify-center gap-3">
              <i
                class="fas fa-map-marker-alt text-[var(--Color-Surface-Surface-Brand)]"
              ></i>
              <span>{{ $t("companyAddress") }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script>
import AppFooter from "../components/pages/AppFooter.vue";

export default {
  name: "Privacy",
  components: {
    AppFooter,
  },
};
</script>
