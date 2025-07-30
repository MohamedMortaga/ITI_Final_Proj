<template>
  <div class="flex min-h-screen bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)]">
    <ProfileSidebar />
    <div class="flex-1 p-2 sm:p-4 md:p-8">
      <router-view />
    </div>
  </div>
</template>

<script>
import ProfileSidebar from '../../components/pages/ProfileSidebar.vue';
export default {
  name: 'Profile',
  components: { ProfileSidebar }
};
</script> 