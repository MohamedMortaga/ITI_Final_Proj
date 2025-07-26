<template>
  <div
    class="min-h-screen bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]"
  >
    <!-- Header Section -->
    <div
      class="bg-gradient-to-r from-[var(--Color-Surface-Surface-Brand)] to-[var(--Color-Text-Text-Brand)] text-[var(--Color-Text-Text-Invert)] py-16"
    >
      <div class="container mx-auto px-6 lg:px-[88px] text-center">
        <h1 class="text-4xl lg:text-5xl font-bold mb-6">{{ $t("helpTitle") }}</h1>
        <p class="text-xl lg:text-2xl max-w-3xl mx-auto">{{ $t("helpSubtitle") }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-6 lg:px-[88px] py-16">
      <!-- Quick Actions -->
      <section class="mb-16">
        <h2
          class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8 text-center"
        >
          {{ $t("quickActions") }}
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 text-center"
          >
            <div
              class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <i class="fas fa-search text-[var(--Color-Text-Text-Invert)] text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t("searchHelp") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)] mb-6">
              {{ $t("searchHelpDesc") }}
            </p>
            <button
              class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-6 py-2 rounded-lg hover:bg-[var(--Color-Text-Text-Brand)] transition"
            >
              {{ $t("searchNow") }}
            </button>
          </div>

          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 text-center"
          >
            <div
              class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <i
                class="fas fa-comments text-[var(--Color-Text-Text-Invert)] text-2xl"
              ></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t("liveChat") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)] mb-6">
              {{ $t("liveChatDesc") }}
            </p>
            <button
              class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-6 py-2 rounded-lg hover:bg-[var(--Color-Text-Text-Brand)] transition"
            >
              {{ $t("startChat") }}
            </button>
          </div>

          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 text-center"
          >
            <div
              class="w-16 h-16 bg-[var(--Color-Surface-Surface-Brand)] rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <i
                class="fas fa-envelope text-[var(--Color-Text-Text-Invert)] text-2xl"
              ></i>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ $t("emailSupport") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)] mb-6">
              {{ $t("emailSupportDesc") }}
            </p>
            <button
              class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-6 py-2 rounded-lg hover:bg-[var(--Color-Text-Text-Brand)] transition"
            >
              {{ $t("sendEmail") }}
            </button>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="mb-16">
        <h2
          class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8 text-center"
        >
          {{ $t("frequentlyAskedQuestions") }}
        </h2>

        <!-- Getting Started -->
        <div
          class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8 mb-8"
        >
          <h3 class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">
            {{ $t("gettingStarted") }}
          </h3>
          <div class="space-y-6">
            <div class="border-b border-[var(--Color-Boarder-Border-Primary)] pb-4">
              <h4 class="text-lg font-bold mb-2">{{ $t("faq1Question") }}</h4>
              <p class="text-[var(--Color-Text-Text-Secondary)]">
                {{ $t("faq1Answer") }}
              </p>
            </div>
            <div class="border-b border-[var(--Color-Boarder-Border-Primary)] pb-4">
              <h4 class="text-lg font-bold mb-2">{{ $t("faq2Question") }}</h4>
              <p class="text-[var(--Color-Text-Text-Secondary)]">
                {{ $t("faq2Answer") }}
              </p>
            </div>
            <div class="border-b border-[var(--Color-Boarder-Border-Primary)] pb-4">
              <h4 class="text-lg font-bold mb-2">{{ $t("faq3Question") }}</h4>
              <p class="text-[var(--Color-Text-Text-Secondary)]">
                {{ $t("faq3Answer") }}
              </p>
            </div>
          </div>
        </div>

        <!-- Renting -->
        <div
          class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8 mb-8"
        >
          <h3 class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">
            {{ $t("renting") }}
          </h3>
          <div class="space-y-6">
            <div class="border-b border-[var(--Color-Boarder-Border-Primary)] pb-4">
              <h4 class="text-lg font-bold mb-2">{{ $t("faq4Question") }}</h4>
              <p class="text-[var(--Color-Text-Text-Secondary)]">
                {{ $t("faq4Answer") }}
              </p>
            </div>
            <div class="border-b border-[var(--Color-Boarder-Border-Primary)] pb-4">
              <h4 class="text-lg font-bold mb-2">{{ $t("faq5Question") }}</h4>
              <p class="text-[var(--Color-Text-Text-Secondary)]">
                {{ $t("faq5Answer") }}
              </p>
            </div>
            <div class="border-b border-[var(--Color-Boarder-Border-Primary)] pb-4">
              <h4 class="text-lg font-bold mb-2">{{ $t("faq6Question") }}</h4>
              <p class="text-[var(--Color-Text-Text-Secondary)]">
                {{ $t("faq6Answer") }}
              </p>
            </div>
          </div>
        </div>

        <!-- Payments -->
        <div
          class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8"
        >
          <h3 class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">
            {{ $t("payments") }}
          </h3>
          <div class="space-y-6">
            <div class="border-b border-[var(--Color-Boarder-Border-Primary)] pb-4">
              <h4 class="text-lg font-bold mb-2">{{ $t("faq7Question") }}</h4>
              <p class="text-[var(--Color-Text-Text-Secondary)]">
                {{ $t("faq7Answer") }}
              </p>
            </div>
            <div class="border-b border-[var(--Color-Boarder-Border-Primary)] pb-4">
              <h4 class="text-lg font-bold mb-2">{{ $t("faq8Question") }}</h4>
              <p class="text-[var(--Color-Text-Text-Secondary)]">
                {{ $t("faq8Answer") }}
              </p>
            </div>
            <div>
              <h4 class="text-lg font-bold mb-2">{{ $t("faq9Question") }}</h4>
              <p class="text-[var(--Color-Text-Text-Secondary)]">
                {{ $t("faq9Answer") }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Support -->
      <section class="mb-16">
        <h2
          class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-8 text-center"
        >
          {{ $t("contactSupport") }}
        </h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8"
          >
            <h3 class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">
              {{ $t("supportHours") }}
            </h3>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span>{{ $t("mondayFriday") }}</span>
                <span class="font-bold">9:00 AM - 6:00 PM</span>
              </div>
              <div class="flex justify-between">
                <span>{{ $t("saturday") }}</span>
                <span class="font-bold">10:00 AM - 4:00 PM</span>
              </div>
              <div class="flex justify-between">
                <span>{{ $t("sunday") }}</span>
                <span class="font-bold">{{ $t("closed") }}</span>
              </div>
            </div>
            <p class="text-[var(--Color-Text-Text-Secondary)] mt-6">
              {{ $t("emergencySupport") }}
            </p>
          </div>

          <div
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8"
          >
            <h3 class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">
              {{ $t("contactMethods") }}
            </h3>
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <i class="fas fa-phone text-[var(--Color-Surface-Surface-Brand)]"></i>
                <span>+1 (555) 123-4567</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="fas fa-envelope text-[var(--Color-Surface-Surface-Brand)]"></i>
                <span>support@rento.com</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="fas fa-comments text-[var(--Color-Surface-Surface-Brand)]"></i>
                <span>{{ $t("liveChatAvailable") }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Help Resources -->
      <section class="text-center">
        <h2 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-6">
          {{ $t("additionalResources") }}
        </h2>
        <p class="text-xl text-[var(--Color-Text-Text-Secondary)] mb-8 max-w-2xl mx-auto">
          {{ $t("resourcesDesc") }}
        </p>
        <div class="grid md:grid-cols-3 gap-6">
          <router-link
            to="/overview"
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 hover:border-[var(--Color-Surface-Surface-Brand)] transition"
          >
            <i
              class="fas fa-book text-3xl text-[var(--Color-Surface-Surface-Brand)] mb-4"
            ></i>
            <h3 class="text-lg font-bold mb-2">{{ $t("userGuide") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">
              {{ $t("userGuideDesc") }}
            </p>
          </router-link>

          <router-link
            to="/features"
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 hover:border-[var(--Color-Surface-Surface-Brand)] transition"
          >
            <i
              class="fas fa-cogs text-3xl text-[var(--Color-Surface-Surface-Brand)] mb-4"
            ></i>
            <h3 class="text-lg font-bold mb-2">{{ $t("featuresGuide") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">
              {{ $t("featuresGuideDesc") }}
            </p>
          </router-link>

          <router-link
            to="/pricing"
            class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 hover:border-[var(--Color-Surface-Surface-Brand)] transition"
          >
            <i
              class="fas fa-dollar-sign text-3xl text-[var(--Color-Surface-Surface-Brand)] mb-4"
            ></i>
            <h3 class="text-lg font-bold mb-2">{{ $t("pricingGuide") }}</h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">
              {{ $t("pricingGuideDesc") }}
            </p>
          </router-link>
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
  name: "Help",
  components: {
    AppFooter,
  },
};
</script>
