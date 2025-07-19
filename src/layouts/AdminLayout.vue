<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-gray-800 text-white w-64 p-4 fixed top-0 left-0 h-full z-40 transform transition-transform duration-300',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0'
      ]"
    >
      <h2 class="text-2xl font-bold mb-6">Admin Panel</h2>
      <ul class="space-y-4">
        <li>
          <router-link
            to="/admin/users"
            class="block px-3 py-2 rounded hover:bg-gray-700"
          >
            👥 Users
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/products"
            class="block px-3 py-2 rounded hover:bg-gray-700"
          >
            📦 Products
          </router-link>
        </li>
         <li>
    <router-link
      to="/admin/categories"
      class="block px-3 py-2 rounded hover:bg-gray-700"
    >
      📂 Categories
    </router-link>
  </li>
      </ul>
    </aside>

    <!-- Overlay (Mobile Only) -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
      @click="toggleSidebar"
    ></div>

    <!-- Main Content -->
    <div class="flex-1 lg:ml-64 w-full">
      <!-- Topbar -->
      <header class="bg-white shadow p-4 flex items-center justify-between">
        <button class="lg:hidden text-gray-700" @click="toggleSidebar">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <h1 class="text-xl font-semibold">Admin Dashboard</h1>
      </header>

      <!-- Page Content Slot -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<style scoped>
/* Add any additional custom styles here */
</style>
