<template>
  <div :class="[isDarkMode ? 'dark' : 'light']">
    <Disclosure
      as="nav"
      class="bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] mb-0 mx-[88px]"
    >
      <div class="mx-auto container px-2 sm:px-6 lg:px-8">
        <div
          class="relative flex h-16 items-center justify-between gap-5"
          :class="currentLang === 'ar' ? 'flex-row-reverse' : ''"
        >
          <!-- Logo -->
          <router-link
            to="/"
            class="text-2xl font-medium text-[var(--Color-Text-Text-Brand)] hover:text-[var(--Color-Text-Text-Brand)]"
          >
            {{$t('rento')}}
          </router-link>
          <!-- Main content (nav links + profile/toggles) -->
          <div class="flex items-center w-full"
            :class="currentLang === 'ar' ? 'flex-row-reverse' : ''"
          >
            <!-- Navigation links -->
            <div class="hidden sm:flex flex-1 items-center justify-center"
              :class="currentLang === 'ar' ? 'justify-end' : 'justify-center'"
            >
              <div class="flex lg:space-x-[64px] md:space-x-[32px] space-x-[16px]"
                :class="currentLang === 'ar' ? 'flex-row-reverse space-x-reverse' : ''"
              >
                <router-link
                  to="/home"
                  class="lg:text-xl md:text-md text-sm font-medium hover:text-[var(--Color-Text-Text-Brand)]"
                  :class="{
                    'text-[var(--Color-Text-Text-Brand)]': $route.path === '/home',
                  }"
                  >{{ $t('home') }}</router-link
                >
                <router-link
                  to="/all-products"
                  class="lg:text-xl md:text-md text-sm font-medium hover:text-[var(--Color-Text-Text-Brand)]"
                  :class="{
                    'text-[var(--Color-Text-Text-Brand)]':
                      $route.path === '/all-products',
                  }"
                  >{{ $t('browseTools') }}</router-link
                >
                <router-link
                  to="/addProduct"
                  class="lg:text-xl md:text-md text-sm font-medium hover:text-[var(--Color-Text-Text-Brand)]"
                  :class="{
                    'text-[var(--Color-Text-Text-Brand)]': $route.path === '/addProduct',
                  }"
                  >{{ $t('addTool') }}</router-link
                >
                <router-link
                  to="/about"
                  class="lg:text-xl md:text-md text-sm font-medium hover:text-[var(--Color-Text-Text-Brand)]"
                  :class="{
                    'text-[var(--Color-Text-Text-Brand)]': $route.path === '/about',
                  }"
                  >{{ $t('about') }}</router-link
                >
                <router-link
                  to="/contact"
                  class="lg:text-xl md:text-md text-sm font-medium hover:text-[var(--Color-Text-Text-Brand)]"
                  :class="{
                    'text-[var(--Color-Text-Text-Brand)]': $route.path === '/contact',
                  }"
                  >{{ $t('contact') }}</router-link
                >
              </div>
            </div>
            <!-- Profile/toggles (RTL: left, LTR: right) -->
            <div class="flex items-center space-x-4"
              :class="currentLang === 'ar' ? 'flex-row-reverse space-x-reverse' : ''"
            >
              <!-- Language Toggle Switch -->
              <div class="flex items-center ml-2">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" :checked="currentLang === 'ar'" @change="toggleLanguage" />
                  <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-teal-600 transition-all"></div>
                  <span class="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-7 transition-transform flex items-center justify-center text-xs font-bold">
                    <span v-if="currentLang === 'ar'">ع</span>
                    <span v-else>EN</span>
                  </span>
                </label>
               
              </div>

              <div>
                <input
                  type="checkbox"
                  class="custom-toggle"
                  id="checkbox"
                  v-model="isDarkMode"
                />
                <label for="checkbox" class="custom-toggle-label">
                  <span class="toggle-icon"></span>
                </label>
              </div>

              <!-- User Profile Image with Dropdown -->
              <div v-if="isAuthenticated" class="relative">
                <img
                  :src="userProfileImage || defaultImage"
                  alt="User Profile"
                  class="h-10 w-10 rounded-full cursor-pointer"
                  @click="toggleDropdown"
                />
                <div
                  v-if="showDropdown"
                  class="absolute right-0 mt-2 w-48 shadow-lg rounded-md z-10"
                  style="background-color: var(--Color-Surface-Surface-Primary)"
                >
                  <router-link
                    to="/profile"
                    class="block px-4 py-2 text-sm hover:bg-[var(--Color-Surface-Surface-Brand)]"
                    style="color: var(--Color-Text-Text-Primary)"
                    @click="closeDropdown"
                    >{{$t('profile')}}</router-link
                  >
                  <router-link
                    to="/settings"
                    class="block px-4 py-2 text-sm hover:bg-[var(--Color-Surface-Surface-Brand)]"
                    style="color: var(--Color-Text-Text-Primary)"
                    @click="closeDropdown"
                    >{{$t('settings')}}</router-link
                  >
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--Color-Surface-Surface-Brand)]"
                    style="color: var(--Color-Text-Text-Primary)"
                  >
                    {{$t('logout')}}
                  </button>
                </div>
              </div>

              <router-link
                v-if="!isAuthenticated"
                to="/login"
                class="px-4 py-2 rounded-md text-xl font-medium bg-[var(--Color-Surface-Surface-Brand)] hover:bg-[var(--Colors-Primary-700)] active:bg-[var(--Colors-Primary-700)] focus:bg-[var(--Colors-Primary-700)] text-[var(--Color-Text-Text-Invert)]"
              >
                {{$t('login')}}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu panel -->
      <DisclosurePanel class="sm:hidden">
        <div class="space-y-1 px-2 pt-2 pb-3 flex flex-col bg-white dark:bg-gray-900">
          <router-link
            to="/home"
            class="rounded-md px-3 py-2 text-xl font-medium"
            :class="{
              'text-[var(--Color-Text-Text-Brand)]': $route.path === '/home',
              'text-gray-700 hover:bg-gray-200 hover:text-[var(--Color-Text-Text-Brand)]':
                $route.path !== '/home',
              'dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-[var(--Color-Text-Text-Brand)]':
                isDarkMode && $route.path !== '/home',
              'dark:text-[var(--Color-Text-Text-Brand)]':
                isDarkMode && $route.path === '/home',
            }"
          >
            {{ $t('home') }}
          </router-link>
          <router-link
            to="/all-products"
            class="rounded-md px-3 py-2 text-xl font-medium"
            :class="{
              'text-[var(--Color-Text-Text-Brand)]': $route.path === '/all-products',
              'text-gray-700 hover:bg-gray-200 hover:text-[var(--Color-Text-Text-Brand)]':
                $route.path !== '/all-products',
              'dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-[var(--Color-Text-Text-Brand)]':
                isDarkMode && $route.path !== '/all-products',
              'dark:text-[var(--Color-Text-Text-Brand)]':
                isDarkMode && $route.path === '/all-products',
            }"
          >
            {{ $t('browseTools') }}
          </router-link>
          <router-link
            to="/addProduct"
            class="rounded-md px-3 py-2 text-xl font-medium"
            :class="{
              'text-[var(--Color-Text-Text-Brand)]': $route.path === '/addProduct',
              'text-gray-700 hover:bg-gray-200 hover:text-[var(--Color-Text-Text-Brand)]':
                $route.path !== '/addProduct',
              'dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-[var(--Color-Text-Text-Brand)]':
                isDarkMode && $route.path !== '/addProduct',
              'dark:text-[var(--Color-Text-Text-Brand)]':
                isDarkMode && $route.path === '/addProduct',
            }"
          >
            {{ $t('addTool') }}
          </router-link>
          <router-link
            to="/about"
            class="rounded-md px-3 py-2 text-xl font-medium"
            :class="{
              'text-[var(--Color-Text-Text-Brand)]': $route.path === '/about',
              'text-gray-700 hover:bg-gray-200 hover:text-[var(--Color-Text-Text-Brand)]':
                $route.path !== '/about',
              'dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-[var(--Color-Text-Text-Brand)]':
                isDarkMode && $route.path !== '/about',
              'dark:text-[var(--Color-Text-Text-Brand)]':
                isDarkMode && $route.path === '/about',
            }"
          >
            {{ $t('about') }}
          </router-link>
          <router-link
            to="/contact"
            class="rounded-md px-3 py-2 text-xl font-medium"
            :class="{
              'text-[var(--Color-Text-Text-Brand)]': $route.path === '/contact',
              'text-gray-700 hover:bg-gray-200 hover:text-[var(--Color-Text-Text-Brand)]':
                $route.path !== '/contact',
              'dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-[var(--Color-Text-Text-Brand)]':
                isDarkMode && $route.path !== '/contact',
              'dark:text-[var(--Color-Text-Text-Brand)]':
                isDarkMode && $route.path === '/contact',
            }"
          >
            {{ $t('contact') }}
          </router-link>
          <div class="mt-2 flex justify-center">
            <input
              type="checkbox"
              class="custom-toggle"
              id="mobile-checkbox"
              v-model="isDarkMode"
            />
            <label for="mobile-checkbox" class="custom-toggle-label">
              <span class="toggle-icon"></span>
            </label>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import { ref, watch, onMounted } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import defaultImage from "@/assets/default.png";
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const open = ref(false);
const isDarkMode = ref(false);
const isAuthenticated = ref(false);
const userProfileImage = ref("");
const showDropdown = ref(false);
const auth = getAuth();
const router = useRouter();
const currentLang = ref(locale.value);

const setDir = (lang) => {
  if (lang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.style.textAlign = 'right';
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.body.style.textAlign = 'left';
  }
};

const toggleLanguage = () => {
  const newLang = currentLang.value === 'en' ? 'ar' : 'en';
  locale.value = newLang;
  currentLang.value = newLang;
  localStorage.setItem('lang', newLang);
  setDir(newLang);
};

// Initialize dark mode based on system preference or saved state
const initializeDarkMode = () => {
  const savedMode = localStorage.getItem("darkMode");
  if (savedMode) {
    isDarkMode.value = savedMode === "true";
  } else {
    isDarkMode.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  document.body.classList.toggle("dark", isDarkMode.value);
};

// Initialize authentication state
const initializeAuth = () => {
  auth.onAuthStateChanged((user) => {
    isAuthenticated.value = !!user;
    if (user) {
      userProfileImage.value = user.photoURL;
    }
  });
};

// Handle logout
const handleLogout = async () => {
  try {
    await signOut(auth);
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Successfully logged out",
      showConfirmButton: false,
      timer: 1500,
    });
    router.push("/home");
  } catch (err) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: `Logout failed: ${err.message}`,
      showConfirmButton: false,
      timer: 1500,
    });
    router.push("/home");
  }
};

// Toggle dropdown visibility
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// Close dropdown
const closeDropdown = () => {
  showDropdown.value = false;
};

// Run initialization on mount
onMounted(() => {
  initializeDarkMode();
  initializeAuth();
  setDir(currentLang.value);
});

// Watch for changes in isDarkMode and update body class and localStorage
watch(isDarkMode, (newValue) => {
  document.body.classList.toggle("dark", newValue);
  localStorage.setItem("darkMode", newValue);
});
</script>

<style lang="less" scoped>
/* Custom styles to refine the navbar appearance */
.nav-link-active {
  font-weight: bold;
}

/* Custom toggle switch styles */
.custom-toggle {
  opacity: 0;
  position: absolute;
}

.custom-toggle-label {
  background-color: #e0e0e0;
  width: 60px;
  height: 34px;
  border-radius: 50px;
  position: relative;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
}

.custom-toggle-label .toggle-icon {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="teal" width="24px" height="24px"><circle cx="12" cy="12" r="6" stroke="teal" stroke-width="2" fill="none"/><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"/></svg>')
    no-repeat center;
  width: 26px;
  height: 26px;
  position: absolute;
  left: 4px;
  top: 4px;
  border-radius: 50%;
  transition: transform 0.3s ease, background 0.3s ease;
}

.custom-toggle:checked + .custom-toggle-label {
  background-color: #a3e4d7;
}

.custom-toggle:checked + .custom-toggle-label .toggle-icon {
  transform: translateX(26px);
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="teal" width="24px" height="24px"><circle cx="12" cy="12" r="6" stroke="teal" stroke-width="2" fill="none"/><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"/></svg>')
    no-repeat center;
}

/* Dropdown styles */
.dropdown {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
</style>
