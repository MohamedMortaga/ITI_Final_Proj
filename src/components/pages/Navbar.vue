<template>
  <div :class="[isDarkMode ? 'dark' : 'light']">
    <Disclosure
      as="nav"
      :class="[
        'fixed top-0 w-full z-50 bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] mb-0 px-6 lg:px-[88px] transition-all duration-300',
        isHomePage && !isScrolled
          ? ''
          : 'border-b border-[var(--Color-Boarder-Border-Primary)]',
      ]"
    >
      <div class="mx-auto sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <!-- Logo -->
          <router-link
            to="/"
            class="flex items-center"
          >
            <img
              :src="require('@/assets/logo/logo light .png')"
              alt="Rento Logo"
              class="h-12 w-auto"
            />
          </router-link>

          <!-- Main content (centered nav links) -->
          <div class="flex-1 flex justify-center">
            <!-- Navigation links -->
            <div class="items-center gap-3 hidden lg:flex">
              <router-link
                v-for="link in navLinks"
                :key="link.to"
                :to="link.to"
                class="text-sm lg:text-xl font-medium hover:text-[var(--Color-Text-Text-Brand)] px-2 py-1 rounded transition-colors"
                :class="{
                  'text-[var(--Color-Text-Text-Brand)] font-bold':
                    $route.path === link.to,
                }"
              >
                {{ $t(link.text) }}
              </router-link>
            </div>
          </div>

          <!-- Profile/toggles group (desktop only) -->
          <div class="hidden lg:flex items-center gap-4">
            <!-- Dark Mode Toggle -->
            <div class="flex items-center">
              <button
                @click="isDarkMode = !isDarkMode"
                class="relative w-16 h-9 flex items-center bg-gray-25 dark:bg-gray-600 rounded-full transition-colors focus:outline-none border-0"
                :aria-pressed="isDarkMode ? 'true' : 'false'"
                title="Toggle dark mode"
                type="button"
              >
                <span
                  class="absolute top-1 left-1 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300"
                  :class="isDarkMode ? 'translate-x-7 bg-gray-400' : 'translate-x-0 bg-white'"
                  style="transition: transform 0.3s cubic-bezier(.4,0,.2,1); border-radius: 50%;"
                >
                  <svg v-if="!isDarkMode" class="w-5 h-5" :style="'color: var(--Color-Text-Text-Brand);'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" stroke-width="2" stroke="currentColor" fill="none" />
                    <path stroke="currentColor" stroke-width="2" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" />
                  </svg>
                  <svg v-else class="w-5 h-5" :style="'color: var(--Color-Text-Text-Brand);'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                  </svg>
                </span>
              </button>
            </div>

            <!-- Language Dropdown (desktop): -->
            <div class="relative flex items-center">
              <button
                @mouseenter="isGlobeHovered = true"
                @mouseleave="isGlobeHovered = false"
                @click="showLanguageDropdown = !showLanguageDropdown"
                class="flex items-center p-2 rounded text-[var(--Color-Text-Text-Primary)] transition-colors group"
                title="Change Language"
              >
                <span v-if="isDarkMode">
                  <span v-if="isGlobeHovered">
                    <!-- Brand Globe SVG -->
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
                      <circle cx="12" cy="12" r="8" stroke="#01B195" stroke-width="2"/>
                      <ellipse cx="12" cy="12" rx="3" ry="8" stroke="#01B195" stroke-width="2"/>
                      <path d="M4 12H20" stroke="#01B195" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </span>
                  <span v-else>
                    <!-- Dark Globe SVG -->
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
                      <circle cx="12" cy="12" r="8" stroke="white" stroke-width="2"/>
                      <ellipse cx="12" cy="12" rx="3" ry="8" stroke="white" stroke-width="2"/>
                      <path d="M4 12H20" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </span>
                </span>
                <span v-else>
                  <span v-if="isGlobeHovered">
                    <!-- Brand Globe SVG -->
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
                      <circle cx="12" cy="12" r="8" stroke="#01B195" stroke-width="2"/>
                      <ellipse cx="12" cy="12" rx="3" ry="8" stroke="#01B195" stroke-width="2"/>
                      <path d="M4 12H20" stroke="#01B195" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </span>
                  <span v-else>
                    <!-- Default Globe SVG -->
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
                      <circle cx="12" cy="12" r="8" stroke="#33363F" stroke-width="2"/>
                      <ellipse cx="12" cy="12" rx="3" ry="8" stroke="#33363F" stroke-width="2"/>
                      <path d="M4 12H20" stroke="#33363F" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </span>
                </span>
                <svg
                  class="w-4 h-4 ml-1 transition-colors"
                  :class="isDarkMode
                    ? (isGlobeHovered ? 'text-[var(--Color-Surface-Surface-Brand)]' : 'text-white')
                    : (isGlobeHovered ? 'text-[var(--Color-Surface-Surface-Brand)]' : 'text-[var(--Color-Text-Text-Primary)]')"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                v-if="showLanguageDropdown"
                class="absolute top-full right-0 mt-2 w-24 bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-lg shadow-lg z-50"
              >
                <button
                  v-for="lang in languages"
                  :key="lang"
                  @click="changeLanguage(lang); showLanguageDropdown = false;"
                  class="block w-full text-left px-4 py-2 text-sm text-[var(--Color-Text-Text-Primary)] hover:bg-[var(--Color-Surface-Surface-Brand)] hover:text-[var(--Color-Text-Text-Invert)] transition"
                >
                  {{ languageLabels[lang] }}
                </button>
              </div>
            </div>

            <!-- Messages Icon -->
            <router-link
              to="/messages"
              class="flex items-center p-2 rounded text-[var(--Color-Text-Text-Primary)] transition-colors"
              title="Messages"
              @mouseenter.native="isChatHovered = true"
              @mouseleave.native="isChatHovered = false"
            >
              <span v-if="isDarkMode">
                <span v-if="isChatHovered">
                  <!-- Brand Chat SVG -->
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
                    <path d="M4 12C4 7.58172 7.58172 4 12 4V4C16.4183 4 20 7.58172 20 12V17.0909C20 17.9375 20 18.3608 19.8739 18.6989C19.6712 19.2425 19.2425 19.6712 18.6989 19.8739C18.3608 20 17.9375 20 17.0909 20H12C7.58172 20 4 16.4183 4 12V12Z" stroke="#01B195" stroke-width="2"/>
                    <path d="M9 11L15 11" stroke="#01B195" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 15H15" stroke="#01B195" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span v-else>
                  <!-- Dark Chat SVG -->
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
                    <path d="M4 12C4 7.58172 7.58172 4 12 4V4C16.4183 4 20 7.58172 20 12V17.0909C20 17.9375 20 18.3608 19.8739 18.6989C19.6712 19.2425 19.2425 19.6712 18.6989 19.8739C18.3608 20 17.9375 20 17.0909 20H12C7.58172 20 4 16.4183 4 12V12Z" stroke="white" stroke-width="2"/>
                    <path d="M9 11L15 11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 15H15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </span>
              <span v-else>
                <span v-if="isChatHovered">
                  <!-- Brand Chat SVG -->
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
                    <path d="M4 12C4 7.58172 7.58172 4 12 4V4C16.4183 4 20 7.58172 20 12V17.0909C20 17.9375 20 18.3608 19.8739 18.6989C19.6712 19.2425 19.2425 19.6712 18.6989 19.8739C18.3608 20 17.9375 20 17.0909 20H12C7.58172 20 4 16.4183 4 12V12Z" stroke="#01B195" stroke-width="2"/>
                    <path d="M9 11L15 11" stroke="#01B195" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 15H15" stroke="#01B195" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span v-else>
                  <!-- Default Chat SVG -->
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
                    <path d="M4 12C4 7.58172 7.58172 4 12 4V4C16.4183 4 20 7.58172 20 12V17.0909C20 17.9375 20 18.3608 19.8739 18.6989C19.6712 19.2425 19.2425 19.6712 18.6989 19.8739C18.3608 20 17.9375 20 17.0909 20H12C7.58172 20 4 16.4183 4 12V12Z" stroke="#33363F" stroke-width="2"/>
                    <path d="M9 11L15 11" stroke="#33363F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 15H15" stroke="#33363F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </span>
            </router-link>

            <!-- User Profile Image (no dropdown) -->
            <router-link
              v-if="isAuthenticated"
              to="/profile"
              class="flex items-center"
            >
              <img
                :src="userProfileImage || '../../assets/default.png'"
                alt="User Profile"
                class="h-8 w-8 sm:h-10 sm:w-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
              />
            </router-link>

            <router-link
              v-if="!isAuthenticated"
              to="/login"
              class="px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-xl font-medium bg-[var(--Color-Surface-Surface-Brand)] hover:bg-[var(--Colors-Primary-700)] text-[var(--Color-Text-Text-Invert)] transition-colors"
            >
              {{ $t("login") }}
            </router-link>
          </div>

          <!-- Mobile menu button -->
          <div class="lg:hidden">
            <DisclosureButton
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition-colors"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </DisclosureButton>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <DisclosurePanel class="lg:hidden" v-slot="{ close }">
        <div class="pt-2 pb-3 space-y-1 ">
          <!-- Navigation links -->
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{
              'text-[var(--Color-Text-Text-Brand)] font-bold': $route.path === link.to,
            }"
            @click="close()"
          >
            {{ $t(link.text) }}
          </router-link>

          <!-- Profile/Login (moved to mobile menu) -->
          <div v-if="isAuthenticated" class="relative px-3 py-2">
            <div class="flex items-center gap-2">
              <router-link to="/profile" @click="close()">
                <img
                  :src="userProfileImage || '../../assets/default.png'"
                  alt="User Profile"
                  class="h-8 w-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                />
              </router-link>
              <span class="text-base font-medium">{{ $t("profile") }}</span>
            </div>
          </div>

          <router-link
            v-if="!isAuthenticated"
            to="/login"
            class="block px-3 py-2 rounded-md text-base font-medium bg-[var(--Color-Surface-Surface-Brand)] hover:bg-[var(--Colors-Primary-700)] text-[var(--Color-Text-Text-Invert)] transition-colors"
            @click="close()"
          >
            {{ $t("login") }}
          </router-link>

          <!-- Dark Mode Toggle -->
          <div class="p-3 py-2">
            <button
              @click="close(); isDarkMode = !isDarkMode"
              class="relative w-16 h-9 flex items-center bg-gray-25 dark:bg-gray-600 rounded-full transition-colors focus:outline-none border-0"
              :aria-pressed="isDarkMode ? 'true' : 'false'"
              title="Toggle dark mode"
              type="button"
            >
              <span
                class="absolute top-1 left-1 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300"
                :class="isDarkMode ? 'translate-x-7 bg-gray-400' : 'translate-x-0 bg-white'"
                style="transition: transform 0.3s cubic-bezier(.4,0,.2,1); border-radius: 50%;"
              >
                <svg v-if="!isDarkMode" class="w-5 h-5" :style="'color: var(--Color-Text-Text-Brand);'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" stroke-width="2" stroke="currentColor" fill="none" />
                  <path stroke="currentColor" stroke-width="2" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" />
                </svg>
                <svg v-else class="w-5 h-5" :style="'color: var(--Color-Text-Text-Brand);'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              </span>
            </button>
          </div>

          <!-- Language Selector -->
          <div class="relative px-3 py-2">
            <button
              @click="changeLanguage(currentLang === 'en' ? 'ar' : 'en')"
              class="flex items-center p-2 rounded hover:text-[var(--Color-Text-Text-Brand)] transition-colors"
            >
              <i class="fa-solid fa-globe-americas text-lg"></i>
            </button>
          </div>

          <!-- Messages Icon (Mobile) -->
          <router-link
            to="/messages"
            class="flex items-center gap-2 px-4 py-3 rounded-md text-base font-medium transition-colors hover:text-[var(--Color-Text-Text-Brand)]"
            @click="close()"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <span>{{ $t('messages') }}</span>
          </router-link>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const route = useRoute();
const isDarkMode = ref(false);
const isAuthenticated = ref(false);
const userProfileImage = ref("");
const currentLang = ref(locale.value);
const languages = ref(["en", "ar"]);
const auth = getAuth();
const router = useRouter();
const isScrolled = ref(false);
const showLanguageDropdown = ref(false);
const isGlobeHovered = ref(false);
const isChatHovered = ref(false);

// Check if current page is home or browse tools
const isHomePage = computed(() => {
  return route.path === "/" || route.path === "/home" || route.path === "/all-products";
});

const navLinks = [
  { to: "/home", text: "home" },
  { to: "/all-products", text: "browseTools" },
  { to: "/addProduct", text: "addTool" },
  { to: "/about", text: "about" },
  { to: "/contact", text: "contact" },
];

const languageLabels = {
  en: "English",
  ar: "العربية",
};

const setDir = (lang) => {
  if (lang === "ar") {
    document.documentElement.setAttribute("dir", "rtl");
    document.body.style.textAlign = "right";
  } else {
    document.documentElement.setAttribute("dir", "ltr");
    document.body.style.textAlign = "left";
  }
};

const changeLanguage = (lang) => {
  locale.value = lang;
  currentLang.value = lang;
  localStorage.setItem("lang", lang);
  setDir(lang);
};

const initializeDarkMode = () => {
  const savedMode = localStorage.getItem("darkMode");
  if (savedMode) {
    isDarkMode.value = savedMode === "true";
  } else {
    isDarkMode.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  document.body.classList.toggle("dark", isDarkMode.value);
};

const initializeAuth = () => {
  auth.onAuthStateChanged((user) => {
    isAuthenticated.value = !!user;
    if (user) {
      userProfileImage.value = user.photoURL;
    }
  });
};

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

// Handle scroll events
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

function handleClickOutsideDropdowns(event) {
  const langDropdown = document.querySelectorAll('.relative .absolute')[1];
  if (showLanguageDropdown.value && langDropdown && !langDropdown.contains(event.target) && !event.target.closest('[title="Change Language"]')) {
    showLanguageDropdown.value = false;
  }
  // ... existing profile dropdown logic ...
}

onMounted(() => {
  initializeDarkMode();
  initializeAuth();
  setDir(currentLang.value);

  // Add scroll event listener
  window.addEventListener("scroll", handleScroll);
  document.addEventListener('click', handleClickOutsideDropdowns);
});

// Clean up event listener
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener('click', handleClickOutsideDropdowns);
});

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

/* Custom toggle switch styles (for dark mode) */
.custom-toggle {
  opacity: 0;
  position: absolute;
}

.custom-toggle-label {
  background-color: #e0e0e0;
  width: 50px;
  height: 28px;
  border-radius: 50px;
  position: relative;
  padding: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
}

.custom-toggle-label .toggle-icon {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="teal" width="20px" height="20px"><circle cx="12" cy="12" r="6" stroke="teal" stroke-width="2" fill="none"/><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"/></svg>')
    no-repeat center;
  width: 22px;
  height: 22px;
  position: absolute;
  left: 3px;
  top: 3px;
  border-radius: 50%;
  transition: transform 0.3s ease, background 0.3s ease;
}

.custom-toggle:checked + .custom-toggle-label {
  background-color: #a3e4d7;
}

.custom-toggle:checked + .custom-toggle-label .toggle-icon {
  transform: translateX(22px);
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="teal" width="20px" height="20px"><circle cx="12" cy="12" r="6" stroke="teal" stroke-width="2" fill="none"/><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"/></svg>')
    no-repeat center;
}

/* Dropdown styles */
.relative .absolute {
  background-color: var(--Color-Surface-Surface-Primary);
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

/* Group items closer together */
.flex.items-center.gap-4 > * {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

@media (max-width: 640px) {
  .flex.items-center.gap-4 > * {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  }
}

/* Hover and transition effects */
router-link,
button {
  transition: all 0.3s ease;
}

router-link:hover,
button:hover {
  opacity: 0.9;
}

/* Fixed navbar styles - clean and simple */

/* Ensure smooth scrolling when navigating with fixed navbar */
html {
  scroll-behavior: smooth;
}
</style>
