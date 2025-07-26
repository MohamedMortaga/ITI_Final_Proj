<template>
  <div
    :dir="i18n.locale.value === 'ar' ? 'rtl' : 'ltr'"
    class="flex flex-col h-full min-h-screen w-64 bg-white dark:bg-gray-900 py-8 px-4"
  >
    <nav class="flex-1">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.name">
          <router-link
            :to="item.route"
            class="flex items-center gap-3 px-4 py-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-gray-800 transition"
            :class="{
              'bg-teal-50 text-teal-600 font-semibold': isActive(item.route),
            }"
          >
            <span v-html="item.icon" class="text-xl"></span>
            <span>{{ $t(item.label) }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="mt-auto pt-8">
      <router-link
        to="/logout"
        class="flex items-center gap-3 px-4 py-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-gray-800 transition"
      >
        <span v-html="logoutIcon" class="text-xl"></span>
        <span>{{ $t("logout") }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";

export default {
  name: "ProfileSidebar",
  setup() {
    const { t, locale } = useI18n();

    return {
      i18n: { t, locale },
      menuItems: [
        {
          name: "profile",
          label: "myProfile",
          route: "/profile",
          icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' width='20' height='20'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5.121 17.804A9 9 0 1112 21a8.963 8.963 0 01-6.879-3.196z'/><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'/></svg>`,
        },
        {
          name: "listings",
          label: "myListings",
          route: "/profile/listings",
          icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' width='20' height='20'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5a2 2 0 002 2z'/></svg>`,
        },
        {
          name: "rentals",
          label: "myRentals",
          route: "/profile/rentals",
          icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' width='20' height='20'><rect width='20' height='14' x='2' y='5' rx='2' stroke='currentColor' stroke-width='2'/><path d='M8 21h8' stroke='currentColor' stroke-width='2' stroke-linecap='round'/></svg>`,
        },
        {
          name: "balance",
          label: "myBalance",
          route: "/profile/balance",
          icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' width='20' height='20'><rect width='18' height='10' x='3' y='7' rx='2' stroke='currentColor' stroke-width='2'/><path d='M7 7V5a5 5 0 0110 0v2' stroke='currentColor' stroke-width='2'/></svg>`,
        },
        {
          name: "settings",
          label: "settings",
          route: "/profile/settings",
          icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' width='20' height='20'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 8v4l3 3'/><circle cx='12' cy='12' r='10' stroke='currentColor' stroke-width='2'/></svg>`,
        },
        {
          name: "help",
          label: "helpCentre",
          route: "/profile/help",
          icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' width='20' height='20'><circle cx='12' cy='12' r='10' stroke='currentColor' stroke-width='2'/><path d='M12 16h.01M12 12a4 4 0 10-4-4' stroke='currentColor' stroke-width='2'/></svg>`,
        },
      ],
      logoutIcon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' width='20' height='20'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1'/></svg>`,
    };
  },
  methods: {
    isActive(route) {
      return this.$route.path === route;
    },
  },
};
</script>

<style scoped>
.flex-1 {
  flex: 1 1 0%;
}
</style>
