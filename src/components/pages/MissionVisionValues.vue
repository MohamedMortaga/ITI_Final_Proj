<template>
  <div class="container mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-8 items-start">
    <div class="flex-1 flex flex-col items-center text-center" v-for="(item, index) in missionVisionValues" :key="index">
      <img src="@/assets/logo.png" alt="Mission" class="w-24 h-24 mb-4" />
      <h4 class="text-lg font-bold mb-2 text-[var(--Color-Text-Text-Brand)]">{{ item.title }}</h4>
      <p class="text-sm text-[var(--Color-Text-Text-Primary)]">{{ item.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      missionVisionValues: [
        { title: "Our Mission", description: "To make everyday tools and equipment accessible and affordable for everyone, empowering smarter living through simple and secure rentals." },
        { title: "Our Vision", description: "To become the leading rental platform in the region, transforming how people access items they need — without the need to own them." },
        { title: "Our Core Values", description: "We value trust, simplicity, and affordability — making rentals easy, safe, and sustainable through a connected community." }
      ]
    };
  }
}
</script>