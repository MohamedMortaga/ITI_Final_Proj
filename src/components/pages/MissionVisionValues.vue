<template >
  <div class="mb-16 container bg-[var(--Color-Surface-Surface-Primary)]  mt-12 flex flex-col lg:flex-row gap-8 items-start px-6 md:px-6 lg:px-[88px]">
    <div 
      class="flex-1 flex flex-col items-center text-center" 
      v-for="(item, index) in missionVisionValues" 
      :key="index"
    >
      <img 
        :src="item.image" 
        :alt="item.title" 
        class="w-40 h-40 mb-4" 
      />
      <h4 class="text-lg font-bold mb-2 text-[var(--Color-Text-Text-Brand)]">{{$t(item.title)}}</h4>
      <p class="text-sm text-[var(--Color-Text-Text-Primary)]">{{$t(item.description)}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      missionVisionValues: [
        { 
          title: 'ourMission', 
          description: 'missionDescription',
          image: require("@/assets/Mission.svg")
        },
        { 
          title: 'ourVision', 
          description: 'visionDescription',
          image: require("@/assets/vision.svg")
        },
        { 
          title: 'ourCoreValues', 
          description: 'coreValuesDescription',
          image: require("@/assets/values.svg")
        }
      ]
    };
  }
}
</script>