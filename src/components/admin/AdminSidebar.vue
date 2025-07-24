<!-- src/components/AdminSidebar.vue -->
<template>
  <aside class="w-64 bg-[var(--Color-Surface-Surface-Primary)] min-h-screen flex flex-col px-4 py-4">
    <div class="flex items-center px-4 py-2 mb-6">
      <img :src="logo" alt="Logo" class="h-8" />
    </div>
    <nav class="flex-1 flex flex-col">
      <ul class="space-y-4 flex-1 flex flex-col justify-start">
        <li v-for="item in navItems" :key="item.path">
          <router-link
            :to="item.path"
            class="flex items-center px-4 py-3 rounded-lg hover:bg-[var(--Colors-Gray-50)] text-[var(--Color-Text-Text-Primary)]"
            active-class="bg-[var(--Color-Surface-Surface-Brand)] text-white"
          >
            <i :class="item.icon + ' mr-3'"></i>
            {{ item.label }}
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import logo from '@/assets/logo.png';

const navItems = [
  { path: '/admin/users', label: 'Users', icon: 'fas fa-users' },
  { path: '/admin/products', label: 'Products', icon: 'fas fa-box-open' },
  { path: '/admin/categories', label: 'Categories', icon: 'fas fa-folder-open' },
  { path: '/rentals', label: 'View Rentals', icon: 'fas fa-calendar-alt' },
  { path: '/admin/reviews', label: 'Manage Reviews', icon: 'fas fa-star' },
];
</script>

<style scoped>
</style>