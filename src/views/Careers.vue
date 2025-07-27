<template>
  <div
    class="min-h-screen bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]"
  >
    <!-- Header Section -->
    <div
      class="bg-gradient-to-r from-[var(--Color-Surface-Surface-Brand)] to-[var(--Color-Text-Text-Brand)] text-[var(--Color-Text-Text-Invert)] py-16"
    >
      <div class="container mx-auto px-6 lg:px-[88px] text-center">
        <h1 class="text-4xl lg:text-5xl font-bold mb-6">{{ $t("careersTitle") }}</h1>
        <p class="text-xl lg:text-2xl max-w-3xl mx-auto">{{ $t("careersSubtitle") }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-6 lg:px-[88px] py-16">
      <!-- Company Culture -->
      <section class="mb-16">
        <h2
          class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8 text-center"
        >
          {{ $t("ourCulture") }}
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 text-center"
          >
            <div
              class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <i class="fas fa-users text-[var(--Color-Text-Text-Invert)] text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t("collaboration") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">
              {{ $t("collaborationDesc") }}
            </p>
          </div>

          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 text-center"
          >
            <div
              class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <i
                class="fas fa-lightbulb text-[var(--Color-Text-Text-Invert)] text-2xl"
              ></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t("innovation") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">
              {{ $t("innovationDesc") }}
            </p>
          </div>

          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 text-center"
          >
            <div
              class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <i class="fas fa-heart text-[var(--Color-Text-Text-Invert)] text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t("passion") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">{{ $t("passionDesc") }}</p>
          </div>
        </div>
      </section>

      <!-- Benefits -->
      <section class="mb-16">
        <h2
          class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8 text-center"
        >
          {{ $t("benefits") }}
        </h2>
        <div
          class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8"
        >
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="flex items-start gap-3">
              <i class="fas fa-home text-[var(--Color-Surface-Surface-Brand)] mt-1"></i>
              <div>
                <h4 class="font-bold mb-1">{{ $t("remoteWork") }}</h4>
                <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
                  {{ $t("remoteWorkDesc") }}
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <i
                class="fas fa-calendar-alt text-[var(--Color-Surface-Surface-Brand)] mt-1"
              ></i>
              <div>
                <h4 class="font-bold mb-1">{{ $t("flexibleHours") }}</h4>
                <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
                  {{ $t("flexibleHoursDesc") }}
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <i
                class="fas fa-graduation-cap text-[var(--Color-Surface-Surface-Brand)] mt-1"
              ></i>
              <div>
                <h4 class="font-bold mb-1">{{ $t("learningBudget") }}</h4>
                <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
                  {{ $t("learningBudgetDesc") }}
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <i class="fas fa-medkit text-[var(--Color-Surface-Surface-Brand)] mt-1"></i>
              <div>
                <h4 class="font-bold mb-1">{{ $t("healthInsurance") }}</h4>
                <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
                  {{ $t("healthInsuranceDesc") }}
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <i class="fas fa-coffee text-[var(--Color-Surface-Surface-Brand)] mt-1"></i>
              <div>
                <h4 class="font-bold mb-1">{{ $t("teamEvents") }}</h4>
                <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
                  {{ $t("teamEventsDesc") }}
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <i
                class="fas fa-chart-line text-[var(--Color-Surface-Surface-Brand)] mt-1"
              ></i>
              <div>
                <h4 class="font-bold mb-1">{{ $t("careerGrowth") }}</h4>
                <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
                  {{ $t("careerGrowthDesc") }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Open Positions -->
      <section class="mb-16">
        <h2
          class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8 text-center"
        >
          {{ $t("openPositions") }}
        </h2>
        <div class="space-y-6">
          <!-- Frontend Developer -->
          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6"
          >
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
              <div class="mb-4 md:mb-0">
                <h3 class="text-xl font-bold text-[var(--Color-Text-Text-Brand)] mb-2">
                  {{ $t("frontendDeveloper") }}
                </h3>
                <p class="text-[var(--Color-Text-Text-Secondary)] mb-2">
                  {{ $t("frontendDeveloperDesc") }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <span
                    class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-3 py-1 rounded-full text-sm"
                    >Vue.js</span
                  >
                  <span
                    class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-3 py-1 rounded-full text-sm"
                    >JavaScript</span
                  >
                  <span
                    class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-3 py-1 rounded-full text-sm"
                    >CSS</span
                  >
                </div>
              </div>
              <button
                class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-6 py-2 rounded-lg hover:bg-[var(--Color-Text-Text-Brand)] transition"
              >
                {{ $t("applyNow") }}
              </button>
            </div>
          </div>

          <!-- Backend Developer -->
          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6"
          >
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
              <div class="mb-4 md:mb-0">
                <h3 class="text-xl font-bold text-[var(--Color-Text-Text-Brand)] mb-2">
                  {{ $t("backendDeveloper") }}
                </h3>
                <p class="text-[var(--Color-Text-Text-Secondary)] mb-2">
                  {{ $t("backendDeveloperDesc") }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <span
                    class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-3 py-1 rounded-full text-sm"
                    >Node.js</span
                  >
                  <span
                    class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-3 py-1 rounded-full text-sm"
                    >Firebase</span
                  >
                  <span
                    class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-3 py-1 rounded-full text-sm"
                    >API</span
                  >
                </div>
              </div>
              <button
                class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-6 py-2 rounded-lg hover:bg-[var(--Color-Text-Text-Brand)] transition"
              >
                {{ $t("applyNow") }}
              </button>
            </div>
          </div>

          <!-- UX/UI Designer -->
          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6"
          >
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
              <div class="mb-4 md:mb-0">
                <h3 class="text-xl font-bold text-[var(--Color-Text-Text-Brand)] mb-2">
                  {{ $t("uxuiDesigner") }}
                </h3>
                <p class="text-[var(--Color-Text-Text-Secondary)] mb-2">
                  {{ $t("uxuiDesignerDesc") }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <span
                    class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-3 py-1 rounded-full text-sm"
                    >Figma</span
                  >
                  <span
                    class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-3 py-1 rounded-full text-sm"
                    >Adobe</span
                  >
                  <span
                    class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-3 py-1 rounded-full text-sm"
                    >Prototyping</span
                  >
                </div>
              </div>
              <button
                class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-6 py-2 rounded-lg hover:bg-[var(--Color-Text-Text-Brand)] transition"
              >
                {{ $t("applyNow") }}
              </button>
            </div>
          </div>

          <!-- Marketing Specialist -->
          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6"
          >
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
              <div class="mb-4 md:mb-0">
                <h3 class="text-xl font-bold text-[var(--Color-Text-Text-Brand)] mb-2">
                  {{ $t("marketingSpecialist") }}
                </h3>
                <p class="text-[var(--Color-Text-Text-Secondary)] mb-2">
                  {{ $t("marketingSpecialistDesc") }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <span
                    class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-3 py-1 rounded-full text-sm"
                    >Digital Marketing</span
                  >
                  <span
                    class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-3 py-1 rounded-full text-sm"
                    >Social Media</span
                  >
                  <span
                    class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-3 py-1 rounded-full text-sm"
                    >Analytics</span
                  >
                </div>
              </div>
              <button
                class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-6 py-2 rounded-lg hover:bg-[var(--Color-Text-Text-Brand)] transition"
              >
                {{ $t("applyNow") }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Application Process -->
      <section class="mb-16">
        <h2
          class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8 text-center"
        >
          {{ $t("applicationProcess") }}
        </h2>
        <div class="grid md:grid-cols-4 gap-8">
          <div class="text-center">
            <div
              class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-[var(--Color-Text-Text-Invert)] font-bold text-xl"
                >1</span
              >
            </div>
            <h3 class="text-lg font-bold mb-2">{{ $t("apply") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)] text-sm">
              {{ $t("applyDesc") }}
            </p>
          </div>
          <div class="text-center">
            <div
              class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-[var(--Color-Text-Text-Invert)] font-bold text-xl"
                >2</span
              >
            </div>
            <h3 class="text-lg font-bold mb-2">{{ $t("review") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)] text-sm">
              {{ $t("reviewDesc") }}
            </p>
          </div>
          <div class="text-center">
            <div
              class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-[var(--Color-Text-Text-Invert)] font-bold text-xl"
                >3</span
              >
            </div>
            <h3 class="text-lg font-bold mb-2">{{ $t("interview") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)] text-sm">
              {{ $t("interviewDesc") }}
            </p>
          </div>
          <div class="text-center">
            <div
              class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-[var(--Color-Text-Text-Invert)] font-bold text-xl"
                >4</span
              >
            </div>
            <h3 class="text-lg font-bold mb-2">{{ $t("offer") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)] text-sm">
              {{ $t("offerDesc") }}
            </p>
          </div>
        </div>
      </section>

      <!-- Contact HR -->
      <section class="text-center">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">
          {{ $t("contactHR") }}
        </h2>
        <p class="text-xl text-[var(--Color-Text-Text-Secondary)] mb-8 max-w-2xl mx-auto">
          {{ $t("contactHRDesc") }}
        </p>
        <div
          class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8 max-w-md mx-auto"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-center gap-3">
              <i class="fas fa-envelope text-[var(--Color-Surface-Surface-Brand)]"></i>
              <span>careers@rento.com</span>
            </div>
            <div class="flex items-center justify-center gap-3">
              <i class="fas fa-phone text-[var(--Color-Surface-Surface-Brand)]"></i>
              <span>+1 (555) 123-4567</span>
            </div>
            <div class="flex items-center justify-center gap-3">
              <i class="fas fa-linkedin text-[var(--Color-Surface-Surface-Brand)]"></i>
              <span>LinkedIn: Rento Careers</span>
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
  name: "Careers",
  components: {
    AppFooter,
  },
};
</script>
