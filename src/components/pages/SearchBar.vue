<template>
  <div class="w-full border-b border-[var(--Color-Surface-Surface-Tertiary)] bg-transparent">
    <div class="container mx-auto px-4 py-6 flex flex-col gap-4">
      <div class="flex flex-col sm:flex-row items-center gap-4 w-full">
        <div class="relative flex items-center w-full sm:w-auto">
          <i class="fa-solid fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-[var(--Color-Text-Text-Brand)] w-5 h-5 pointer-events-none"></i>
          <select
            class="appearance-none pl-12 pr-8 py-3 w-full sm:w-[180px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-base font-semibold text-[var(--Color-Text-Text-Primary)] bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)]"
            style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'%23666\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 7l3-3 3 3\'/></svg>'); background-repeat: no-repeat; background-position: right 1rem center;">
            <option>Cairo</option>
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
export default {
  props: {
    searchQuery: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
input {
  transition: all 0.3s ease;
}
</style>