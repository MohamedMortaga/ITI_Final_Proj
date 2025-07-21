<template>
  <div class="container mx-auto px-6 md:px-6 lg:px-[88px] mt-12 flex flex-col lg:flex-row gap-8">
    <!-- Text content on left -->
    <div class="flex-1">
      <h3 class="text-xl font-bold mb-4 text-[var(--Color-Text-Text-Brand)]">Why <span class="text-[var(--Color-Text-Text-Primary)]">Rento?</span></h3>
      <div class="flex flex-col gap-4">
        <div class="flex items-start gap-3" v-for="(item, index) in reasons" :key="index">
          <div class="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 p-2">
            <img :src="item.icon" class="w-5 h-5" :alt="item.title" />
          </div>
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
  data() {
    return {
      reasons: [
        { 
          title: "Wide Variety of Rental Categories", 
          description: "Find everything from cameras to cleaning tools — all in one place.",
          icon: require('@/assets/darhboard_alt.svg')
        },
        { 
          title: "Affordable Prices", 
          description: "We offer competitive pricing for all rental items.",
          icon: require('@/assets/Money.svg')
        },
        { 
          title: "Easy to Use", 
          description: "Our platform is user-friendly and easy to navigate.",
          icon: require('@/assets/thumb_up.svg')
        },
        { 
          title: "Secure Transactions", 
          description: "We ensure safe and secure transactions for all users.",
          icon: require('@/assets/Money.svg') // Note: This is the same as Affordable Prices icon
        }
      ]
    };
  }
}
</script>