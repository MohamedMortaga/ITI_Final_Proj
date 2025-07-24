<!-- src/components/AdminHeader.vue -->
<template>
  <header class="bg-[var(--Color-Surface-Surface-Primary)] px-4 py-4 flex items-center justify-end">
    <div class="flex-1 flex justify-center">
      <div class="relative">
        <input
          type="text"
          placeholder="Search here?"
          class="border border-[var(--Color-Boarder-Border-Primary)] rounded-lg px-4 py-2 w-[600px] pl-10"
        />
        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--Color-Text-Text-Secondary)]"></i>
      </div>
    </div>
    <div class="flex items-center space-x-3 ml-4">
      <i class="fas fa-bell text-[var(--Color-Text-Text-Secondary)] text-xl"></i>
      <div class="flex items-center cursor-pointer select-none gap-1">
        <span class="font-semibold text-[var(--Color-Text-Text-Primary)]">Admin</span>
        <i class="fas fa-chevron-down text-[var(--Color-Text-Text-Secondary)]"></i>
      </div>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
</style>