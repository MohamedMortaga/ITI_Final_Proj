<template>
  <section class="w-full  my-12 flex flex-col lg:flex-row items-center bg-[var(--Color-Surface-Surface-Primary)] rounded-2xl overflow-hidden">
    <div class="w-full lg:w-1/2 h-64 lg:h-[320px] flex-shrink-0">
      <img
        :src="require('@/assets/add tool.jpg')"
        alt="Add Tool"
        class="w-full h-full object-cover rounded-md lg:rounded-md"
      />
    </div>

    <div class="w-full lg:w-1/2 flex flex-col justify-end p-6 lg:p-12">
    <div>
        <h2 class="text-2xl md:text-3xl font-bold mb-2 text-[var(--Color-Text-Text-Primary)]">
        {{ $t('haveSomethingToShare') }}
      </h2>
      <h3 class="text-2xl md:text-3xl font-bold mb-4 text-[var(--Color-Text-Text-Brand)]">
        {{ $t('startRentingItOut') }}
      </h3>
    </div>
      <div class="">
        <p class="mb-6 text-base md:text-lg text-[var(--Color-Text-Text-Secondary)]">
        {{ $t('shareBannerDescription') }}
      </p>
      </div>      
    <div class="flex justify-end">
        <router-link
        to="/addProduct"
        class="inline-block px-8 py-3 rounded-lg font-semibold text-lg bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] hover:bg-[var(--Color-Text-Text-Brand)] hover:text-[var(--Color-Text-Text-Invert)] transition text-center"
      >
        {{ $t('listYourItemNow') }}
      </router-link>
    </div>
    </div>
  </section>
</template>

<script setup>
// No script needed, all text is via $t
</script> 