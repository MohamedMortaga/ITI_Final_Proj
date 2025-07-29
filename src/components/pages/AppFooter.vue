<template>
  <footer class="bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]">
    <!-- Full-width border line (outside container) -->
    <div class="border-t border-[var(--Color-Boarder-Border-Primary)] w-full"></div>

    <!-- Content container (with same margins as home) -->
    <div class="px-6 lg:px-[88px]">
      <div class="container mx-auto px-4 py-10 flex flex-col md:flex-row md:justify-between gap-8">
        <div>
          <div class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)] mb-4">{{ $t('rento') }}</div>
          <div class="flex flex-wrap gap-4 text-sm text-[var(--Color-Text-Text-Primary)]">
            <router-link v-for="link in links" :key="link.text" :to="link.href" class="hover:underline hover:text-[var(--Color-Text-Text-Brand)] transition">
              {{ $t(link.text) }}
            </router-link>
          </div>
        </div>
        <div class="flex-1 max-w-xs">
          <div class="mb-2 font-semibold">{{ $t('stayUpToDate') }}</div>
          <div class="flex gap-2">
            <input type="email" :placeholder="$t('enterEmail')"
              class="flex-1 px-3 py-2 rounded border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] focus:outline-none" />
            <button
              class="px-4 py-2 rounded bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] font-semibold hover:bg-[var(--Color-Text-Text-Brand)] transition">{{
                $t('subscribe') }}</button>
          </div>
          <div class="flex items-center flex-wrap mt-4 text-xs text-[var(--Color-Text-Text-Secondary)] justify-around">
            <div>
              © {{ new Date().getFullYear() }} {{ $t('rento') }} {{ $t('allRightsReserved') }}
            </div>
          </div>


        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  links: {
    type: Array, default: () => [
      { text: 'overview', href: '/overview' },
      { text: 'features', href: '/features' },
      { text: 'pricing', href: '/pricing' },
      { text: 'terms', href: '/terms' },
      { text: 'help', href: '/help' }
    ]
  }
});
</script>