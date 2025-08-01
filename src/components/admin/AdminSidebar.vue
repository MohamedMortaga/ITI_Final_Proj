<!-- src/components/AdminSidebar.vue -->
<template>
  <aside class="w-64 bg-[var(--Color-Surface-Surface-Primary)] min-h-screen flex flex-col px-4 py-4">
    <div class="flex items-center px-4 py-2 mb-6">
      <img :src="logo" alt="Logo" class="h-8" />
    </div>
    <div class="mt-6 mb-4 px-4">
      <span class="block text-lg font-bold tracking-wide" style="color: var(--Color-Text-Text-Primary)">Admin Panel</span>
    </div>
    <nav class="flex-1 flex flex-col">
      <ul class="space-y-4 flex-1 flex flex-col justify-start">
        <li v-for="item in navItems" :key="item.path">
          <router-link
            :to="item.path"
            class="flex items-center px-4 py-3 rounded-lg sidebar-link"
            :style="'color: var(--Color-Text-Text-Secondary)'"
            active-class="bg-[var(--Color-Surface-Surface-Brand)]"
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
  { path: '/admin/id-verifications', label: 'ID Verifications', icon: 'fas fa-id-card' },
  { path: '/admin/withdrawals', label: 'Withdrawals', icon: 'fas fa-money-bill-wave' },
  { path: '/admin/contact-messages', label: 'Contact Messages', icon: 'fas fa-envelope' },
  { path: '/admin/notifications', label: 'Chat Data', icon: 'fas fa-comments' },
  { path: '/admin/management', label: 'Admin Management', icon: 'fas fa-user-shield' },
];
</script>

<style scoped>
.router-link-exact-active {
  color: var(--Color-Text-Text-Invert) !important;
}
.sidebar-link {
  transition: background 0.2s, color 0.2s;
}
.sidebar-link:hover {
  background: rgba(0, 128, 128, 0.12); /* fallback for brand color with opacity */
  background: var(--Color-Surface-Surface-Brand, rgba(0, 128, 128, 0.12));
  color: var(--Color-Text-Text-Invert) !important;
}
</style>