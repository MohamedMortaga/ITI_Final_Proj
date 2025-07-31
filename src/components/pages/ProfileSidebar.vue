<template>
  <!-- Desktop Sidebar -->
  <aside
    :dir="i18n.locale.value === 'ar' ? 'rtl' : 'ltr'"
    class="hidden lg:flex flex-col w-64 bg-[var(--Color-Surface-Surface-Primary)] min-h-screen py-8 px-4"
  >
    <nav class="flex-1">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.name">
          <router-link
            :to="item.route"
            class="flex items-center gap-3 px-4 py-2 rounded-full text-[var(--Color-Text-Text-Secondary)] transition"
            :class="{
              'bg-[var(--Colors-Primary-25)] text-[#01B195] font-semibold': isActive(item.route),
              'hover:bg-[var(--Colors-Primary-25)] hover:text-[var(--Color-Surface-Surface-Brand)]': !isActive(item.route)
            }"
            @mouseenter="hoveredItem = item.name"
            @mouseleave="hoveredItem = null"
          >
            <img 
              :src="getIconSrc(item)" 
              :alt="item.label" 
              class="w-5 h-5" 
            />
            <span>{{ $t(item.label) }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
    

  </aside>

  <!-- Mobile Bottom Navigation -->
  <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--Color-Surface-Surface-Primary)] border-t border-[var(--Color-Boarder-Border-Primary)]">
    <div class="flex justify-around items-center px-1 py-1">
      <router-link
        v-for="item in mobileMenuItems"
        :key="item.name"
        :to="item.route"
        class="flex flex-col items-center justify-center px-1 py-1 rounded-lg text-[var(--Color-Text-Text-Secondary)] transition text-center min-w-0 flex-1"
        :class="{
          'text-[#01B195] font-semibold': isActive(item.route),
          'hover:text-[var(--Color-Surface-Surface-Brand)]': !isActive(item.route)
        }"
        @mouseenter="hoveredItem = item.name"
        @mouseleave="hoveredItem = null"
        @touchstart="hoveredItem = item.name"
        @touchend="hoveredItem = null"
      >
        <img 
          :src="getIconSrc(item)" 
          :alt="item.label" 
          class="w-5 h-5 mb-1" 
        />
        <span class="text-[10px] text-center leading-tight max-w-full truncate px-1">{{ getMobileLabel(item.label) }}</span>
      </router-link>
    </div>
  </nav>

  <!-- Add bottom padding to main content on mobile to account for bottom nav -->
  <div class="lg:hidden h-20"></div>
</template>

<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import userAltIcon from '@/assets/User_alt_light.svg';
import userAltClickedIcon from '@/assets/clicked-profile-icons/User_alt_light.svg';
import boxAltIcon from '@/assets/Box_alt.svg';
import boxAltClickedIcon from '@/assets/clicked-profile-icons/Box_alt.svg';
import lineOutIcon from '@/assets/Line_out.svg';
import lineOutClickedIcon from '@/assets/clicked-profile-icons/Line_out.svg';
import settingLineIcon from '@/assets/Setting_line.svg';
import settingLineClickedIcon from '@/assets/clicked-profile-icons/Setting_line.svg';
import walletAltIcon from '@/assets/Wallet_alt.svg';
import walletAltClickedIcon from '@/assets/clicked-profile-icons/Wallet_alt.svg';

export default {
  name: "ProfileSidebar",
  setup() {
    const { t, locale } = useI18n();
    const router = useRouter();
    const hoveredItem = ref(null);

    const menuItems = [
      {
        name: "profile",
        label: "myProfile",
        route: "/profile",
        icon: userAltIcon,
        clickedIcon: userAltClickedIcon,
      },
      {
        name: "listings",
        label: "myListings",
        route: "/profile/listings",
        icon: boxAltIcon,
        clickedIcon: boxAltClickedIcon,
      },
      {
        name: "rentals",
        label: "myRentals",
        route: "/profile/rentals",
        icon: lineOutIcon,
        clickedIcon: lineOutClickedIcon,
      },
      {
        name: "contactDetails",
        label: "contactDetails",
        route: "/profile/contact-details",
        icon: lineOutIcon,
        clickedIcon: lineOutClickedIcon,
      },
      {
        name: "idVerification",
        label: "idVerification",
        route: "/profile/id-verification",
        icon: lineOutIcon,
        clickedIcon: lineOutClickedIcon,
      },
      {
        name: "balance",
        label: "myBalance",
        route: "/profile/balance",
        icon: walletAltIcon,
        clickedIcon: walletAltClickedIcon,
      },
      {
        name: "settings",
        label: "settings",
        route: "/profile/settings",
        icon: settingLineIcon,
        clickedIcon: settingLineClickedIcon,
      },
    ];

    // Mobile menu items (same as desktop, excluding help centre)
    const mobileMenuItems = [
      {
        name: "profile",
        label: "myProfile",
        route: "/profile",
        icon: userAltIcon,
        clickedIcon: userAltClickedIcon,
      },
      {
        name: "listings",
        label: "myListings",
        route: "/profile/listings",
        icon: boxAltIcon,
        clickedIcon: boxAltClickedIcon,
      },
      {
        name: "rentals",
        label: "myRentals",
        route: "/profile/rentals",
        icon: lineOutIcon,
        clickedIcon: lineOutClickedIcon,
      },
      {
        name: "contactDetails",
        label: "contactDetails",
        route: "/profile/contact-details",
        icon: lineOutIcon,
        clickedIcon: lineOutClickedIcon,
      },
      {
        name: "idVerification",
        label: "idVerification",
        route: "/profile/id-verification",
        icon: lineOutIcon,
        clickedIcon: lineOutClickedIcon,
      },
      {
        name: "balance",
        label: "myBalance",
        route: "/profile/balance",
        icon: walletAltIcon,
        clickedIcon: walletAltClickedIcon,
      },
      {
        name: "settings",
        label: "settings",
        route: "/profile/settings",
        icon: settingLineIcon,
        clickedIcon: settingLineClickedIcon,
      },
    ];

    return {
      i18n: { t, locale },
      menuItems,
      mobileMenuItems,
      hoveredItem,
    };
  },
  methods: {
    isActive(route) {
      return this.$route.path === route;
    },
    getIconSrc(item) {
      // Use clicked icon for active state or when hovered
      return (this.isActive(item.route) || this.hoveredItem === item.name) ? item.clickedIcon : item.icon;
    },
    getMobileLabel(label) {
      const mobileLabels = {
        'myProfile': 'Profile',
        'myListings': 'Listings',
        'myRentals': 'Rentals',
        'contactDetails': 'Contact',
        'idVerification': 'ID Verify',
        'myBalance': 'Balance',
        'settings': 'Settings'
      };
      return mobileLabels[label] || this.$t(label);
    },
  },
};
</script>

<style scoped>
.flex-1 {
  flex: 1 1 0%;
}

/* Ensure RTL text alignment for menu items */
:deep([dir="rtl"]) a {
  text-align: right;
}

:deep([dir="ltr"]) a {
  text-align: left;
}
</style>
