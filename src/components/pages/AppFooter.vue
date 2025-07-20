<template>
  <footer class="mt-16">
    <!-- Full-width border line (outside container) -->
    <div class="border-t border-[var(--Color-Boarder-Border-Primary)] w-full"></div>
    
    <!-- Content container (with same margins as home) -->
    <div class="mx-[88px]">
      <div class="container mx-auto px-4 py-10 flex flex-col md:flex-row md:justify-between gap-8">
        <div>
          <div class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)] mb-4">Rento</div>
          <div class="flex flex-wrap gap-4 text-sm text-[var(--Color-Text-Text-Primary)]">
            <a v-for="link in links" :key="link.text" :href="link.href" class="hover:underline">{{ link.text }}</a>
          </div>
        </div>
        <div class="flex-1 max-w-xs">
          <div class="mb-2 font-semibold">Stay up to date</div>
          <div class="flex gap-2">
            <input type="email" placeholder="Enter your email"
              class="flex-1 px-3 py-2 rounded border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] focus:outline-none" />
            <button class="px-4 py-2 rounded bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] font-semibold hover:bg-[var(--Color-Text-Text-Brand)] transition">Subscribe</button>
          </div>
          <div class="flex gap-2 mt-2 text-xs text-[var(--Color-Text-Text-Secondary)]">
            <a v-for="legal in legalLinks" :key="legal.text" :href="legal.href" class="hover:underline">{{ legal.text }}</a>
          </div>
          <div class="mt-4 text-xs text-[var(--Color-Text-Text-Secondary)]">© 2077 Rento All rights reserved.</div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  links: { type: Array, default: () => [
    { text: 'Overview', href: '#' },
    { text: 'Features', href: '#' },
    { text: 'Pricing', href: '#' },
    { text: 'Careers', href: '#' },
    { text: 'Help', href: '#' },
    { text: 'Privacy', href: '#' }
  ]},
  legalLinks: { type: Array, default: () => [
    { text: 'Terms', href: '#' },
    { text: 'Privacy', href: '#' },
    { text: 'Cookies', href: '#' }
  ]}
});
</script>