<template>
  <div class="min-h-screen bg-white">
    <Navbar v-if="!route.meta.hideNavbar" />
    
    <main class="pt-16">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Navbar from '@/components/pages/Navbar.vue'

const route = useRoute()
</script>
