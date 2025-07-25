<template>
  <div class="container mx-auto   mt-8 flex flex-col lg:flex-row gap-8">
    <!-- Text content on left -->
    <div class="flex-1 ">
      <h3 class="text-xl font-bold mb-4 text-[var(--Color-Text-Text-Brand)]">
        {{$t('why')}} <span class="text-[var(--Color-Text-Text-Primary)]">{{ $t(`Rento`) }}</span>
      </h3>
      <div class="flex flex-col gap-4">
        <div class="flex items-start gap-3" v-for="(item, index) in reasons" :key="index">
          <div class="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 p-2">
            <i :class="item.iconClass" class="text-[var(--Color-Text-Text-Brand)]"></i>
          </div>
          <div>
            <div class="font-semibold text-[20px]">{{ item.title }}</div>
            <div class="text-[16px] text-[var(--Color-Text-Text-Secondary)]">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image aligned to right -->
    <div class="flex-1 flex justify-start">
      <img src="@/assets/whyrento.jpg" alt="Why Rento" class="rounded-xl w-full max-w-md object-cover h-auto" />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    reasons() {
      return [
        { 
          title: this.$t('wideVariety'), 
          description: this.$t('findEverything'),
          iconClass: 'fa-solid fa-layer-group'
        },
        { 
          title: this.$t('affordablePrices'), 
          description: this.$t('competitivePricing'),
          iconClass: 'fa-solid fa-money-bill-wave'
        },
        { 
          title: this.$t('easyToUse'), 
          description: this.$t('userFriendly'),
          iconClass: 'fa-solid fa-thumbs-up'
        },
        { 
          title: this.$t('secureTransactions'), 
          description: this.$t('safeTransactions'),
          iconClass: 'fa-solid fa-shield-alt'
        }
      ];
    }
  }
}
</script>