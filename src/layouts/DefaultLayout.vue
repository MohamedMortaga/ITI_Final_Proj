<template>
  <div class="min-h-screen bg-white">
    <Navbar />
    <main >
      <slot />
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/pages/Navbar.vue'
</script>
