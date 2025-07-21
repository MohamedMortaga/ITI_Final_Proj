<template>
  <div class="container mx-auto px-4 mt-12 flex flex-col-reverse lg:flex-row items-center gap-8">
    <!-- Text content on left -->
    <div class="flex-1 w-full lg:w-auto flex flex-col items-center lg:items-start text-center lg:text-left">
      <h3 class="text-xl font-bold mb-4 text-[var(--Color-Text-Text-Brand)]">{{$t('whyRento')}}</h3>
      <div class="flex flex-col gap-4 w-full max-w-lg">
        <div class="flex items-start gap-3" v-for="(item, index) in reasons" :key="index">
          <i class="fa-solid fa-layer-group text-2xl text-[var(--Color-Text-Text-Brand)]"></i>
          <div>
            <div class="font-semibold text-[20px]">{{ item.title }}</div>
            <div class="text-[16px] text-[var(--Color-Text-Text-Secondary)]">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image aligned to right (or below on mobile) -->
    <div class="flex-1 w-full lg:w-auto flex justify-center lg:justify-end mb-6 lg:mb-0">
      <img src="@/assets/whyrento.jpg" alt="Why Rento" class="rounded-xl w-full max-w-xs sm:max-w-sm md:max-w-md object-cover h-auto shadow-md" />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    reasons() {
      return [
        { title: this.$t('wideVariety'), description: this.$t('findEverything') },
        { title: this.$t('affordablePrices'), description: this.$t('competitivePricing') },
        { title: this.$t('easyToUse'), description: this.$t('userFriendly') },
        { title: this.$t('secureTransactions'), description: this.$t('safeTransactions') }
      ];
    }
  }
}
</script>