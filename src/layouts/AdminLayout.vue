<!-- src/components/AdminLayout.vue -->
<template>
  <div class="flex min-h-screen">
    <AdminSidebar />
    <div class="flex-1 flex flex-col">
      <AdminHeader />
      <main class="flex-1 p-6 bg-[var(--Color-Surface-Surface-Primary)]">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminHeader from "@/components/admin/AdminHeader.vue";
</script>

<style scoped></style>
