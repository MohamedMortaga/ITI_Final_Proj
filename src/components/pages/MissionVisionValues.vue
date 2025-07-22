<template>
  <div class="container mx-auto my-12 flex flex-col lg:flex-row  items-start">
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
      <h4 class="text-lg font-bold mb-2">
        <span class="text-[var(--Color-Text-Text-Primary)]">
          {{ getFirstWord($t(item.title)) }}
        </span>
        <span class="text-[var(--Color-Text-Text-Brand)]">
          {{ getRestWords($t(item.title)) }}
        </span>
      </h4>
      <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
        {{$t(item.description)}}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getFirstWord(text) {
      return text.split(' ')[0];
    },
    getRestWords(text) {
      return text.split(' ').slice(1).join(' ');
    }
  },
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
