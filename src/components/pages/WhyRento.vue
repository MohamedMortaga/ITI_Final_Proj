<template>
  <div class="container mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-8">
    <!-- Text content on left -->
    <div class="flex-1">
      <h3 class="text-xl font-bold mb-4 text-[var(--Color-Text-Text-Brand)]">{{$t('whyRento')}}</h3>
      <div class="flex flex-col gap-4">
        <div class="flex items-start gap-3" v-for="(item, index) in reasons" :key="index">
          <i class="fa-solid fa-layer-group text-2xl text-[var(--Color-Text-Text-Brand)]"></i>
          <div>
            <div class="font-semibold text-[20px]">{{ item.title }}</div>
            <div class="text-[16px] text-[var(--Color-Text-Text-Secondary)]">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image aligned to right -->
    <div class="flex-1 flex justify-end">
      <img src="@/assets/whyrento.jpg" alt="Why Rento" class="rounded-xl w-full max-w-md object-cover h-auto" />
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