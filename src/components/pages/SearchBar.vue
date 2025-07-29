<template>
  <div class="w-full border-b border-[var(--Color-Surface-Surface-Tertiary)] bg-transparent ">
    <div class="container mx-auto px-4 py-4 flex flex-col gap-4">
      <div class="flex flex-col sm:flex-row items-center gap-4 w-full">
        <div class="relative flex items-center w-full sm:w-auto">
          <i class="fa-solid fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-[var(--Color-Text-Text-Brand)] w-5 h-5 pointer-events-none"></i>
          <select
            :value="selectedLocation"
            @change="handleLocationChange"
            class="appearance-none pl-12 pr-10 py-3 w-full sm:w-[180px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-base font-semibold text-[var(--Color-Text-Text-Primary)] bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)]"
            style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'%23999\' height=\'16\' viewBox=\'0 0 24 24\' width=\'16\' xmlns=\'http://www.w3.org/2000/svg\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'></path></svg>'); background-repeat: no-repeat; background-position: right 1rem center;"
          >
            <option value="">{{ $t('allLocations') }}</option>
            <option value="cairo">{{ $t('cairo') }}</option>
            <option value="alexandria">{{ $t('alexandria') }}</option>
            <option value="mansoura">{{ $t('mansoura') }}</option>
            <option value="giza">{{ $t('giza') }}</option>
            <option value="sharmElSheikh">{{ $t('sharmElSheikh') }}</option>
            <option value="hurghada">{{ $t('hurghada') }}</option>
            <option value="luxor">{{ $t('luxor') }}</option>
            <option value="aswan">{{ $t('aswan') }}</option>
            <option value="portSaid">{{ $t('portSaid') }}</option>
            <option value="suez">{{ $t('suez') }}</option>
            <option value="ismailia">{{ $t('ismailia') }}</option>
            <option value="beniSuef">{{ $t('beniSuef') }}</option>
            <option value="minya">{{ $t('minya') }}</option>
            <option value="assiut">{{ $t('assiut') }}</option>
            <option value="sohag">{{ $t('sohag') }}</option>
            <option value="qena">{{ $t('qena') }}</option>
            <option value="redSea">{{ $t('redSea') }}</option>
            <option value="newValley">{{ $t('newValley') }}</option>
            <option value="matruh">{{ $t('matruh') }}</option>
            <option value="northSinai">{{ $t('northSinai') }}</option>
            <option value="southSinai">{{ $t('southSinai') }}</option>
            <option value="beheira">{{ $t('beheira') }}</option>
            <option value="gharbiya">{{ $t('gharbiya') }}</option>
            <option value="kafrElSheikh">{{ $t('kafrElSheikh') }}</option>
            <option value="dakahlia">{{ $t('dakahlia') }}</option>
            <option value="sharqiya">{{ $t('sharqiya') }}</option>
            <option value="qalyubiya">{{ $t('qalyubiya') }}</option>
            <option value="monufiya">{{ $t('monufiya') }}</option>
            <option value="fayoum">{{ $t('fayoum') }}</option>
          </select>
        </div>
        <div class="relative flex-1 w-full">
          <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[var(--Color-Text-Text-Brand)] w-5 h-5 pointer-events-none"></i>
          <input 
            :value="searchQuery" 
            @input="$emit('update:searchQuery', $event.target.value)" 
            type="text" 
            :placeholder="$t('searchPlaceholder')"
            class="pl-12 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-base text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)] bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)]" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useLocation } from '@/composables/useLocation'

export default {
  props: {
    searchQuery: {
      type: String,
      required: true
    },
    selectedLocation: {
      type: String,
      required: true,
      default: ""
    }
  },
  setup(props, { emit }) {
    const { userLocation, setLocation } = useLocation()

    // Watch for changes in the selectedLocation prop and update global state
    const handleLocationChange = (event) => {
      const newLocation = event.target.value
      setLocation(newLocation)
      emit('update:selectedLocation', newLocation)
    }

    // Initialize with global location if no prop is provided
    if (!props.selectedLocation && userLocation.value) {
      emit('update:selectedLocation', userLocation.value)
    }

    return {
      handleLocationChange
    }
  }
}
</script>

<style scoped>
input {
  transition: all 0.3s ease;
}
</style>