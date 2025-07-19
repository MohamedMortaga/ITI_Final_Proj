<template>
  <div class="container mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-8 items-center">
    <div class="flex-1">
      <h3 class="text-xl font-bold mb-4 text-[var(--Color-Text-Text-Brand)]">Why <span class="text-[var(--Color-Text-Text-Primary)]">Rento?</span></h3>
      <div class="flex flex-col gap-4">
        <div class="flex items-start gap-3" v-for="(item, index) in reasons" :key="index">
          <i class="fa-solid fa-layer-group text-2xl text-[var(--Color-Text-Text-Brand)]"></i>
          <div>
            <div class="font-semibold">{{ item.title }}</div>
            <div class="text-sm text-[var(--Color-Text-Text-Secondary)]">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 flex justify-center">
      <img src="@/assets/logo.png" alt="Why Rento" class="rounded-xl w-full max-w-md object-cover" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reasons: [
        { title: "Wide Variety of Rental Categories", description: "Find everything from cameras to cleaning tools — all in one place." },
        { title: "Affordable Prices", description: "We offer competitive pricing for all rental items." },
        { title: "Easy to Use", description: "Our platform is user-friendly and easy to navigate." },
        { title: "Secure Transactions", description: "We ensure safe and secure transactions for all users." }
      ]
    };
  }
}
</script>