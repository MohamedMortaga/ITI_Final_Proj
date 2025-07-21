<template>
  <div :class="[isDarkMode ? 'dark' : 'light']">
    <Disclosure
      as="nav"
      class="bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] mb-0 px-[88px]"
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
            {{ $t('rento') }}
          </router-link>
          
          <!-- Main content (nav links + profile/toggles) -->
          <div
            class="flex items-center w-full"
            :class="currentLang === 'ar' ? 'flex-row-reverse' : ''"
          >
            <!-- Navigation links -->
            <div
              class="hidden sm:flex flex-1 items-center justify-center"
              :class="currentLang === 'ar' ? 'justify-end' : 'justify-center'"
            >
              <div
                class="flex lg:space-x-[64px] md:space-x-[32px] space-x-[16px]"
                :class="currentLang === 'ar' ? 'flex-row-reverse space-x-reverse' : ''"
              >
                <!-- Navigation links remain the same -->
                <router-link
                  v-for="link in navLinks"
                  :key="link.to"
                  :to="link.to"
                  class="lg:text-xl md:text-md text-sm font-medium hover:text-[var(--Color-Text-Text-Brand)]"
                  :class="{
                    'text-[var(--Color-Text-Text-Brand)]': $route.path === link.to,
                  }"
                >
                  {{ $t(link.text) }}
                </router-link>
              </div>
            </div>
            
            <!-- Profile/toggles group -->
            <div
              class="flex items-center gap-4"
              :class="currentLang === 'ar' ? 'flex-row-reverse' : ''"
            >
              <!-- Dark Mode Toggle -->
              <div class="flex items-center">
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

              <!-- Language Selector -->
              <div class="relative flex items-center">
                <button
                  @click="toggleLanguageDropdown"
                  class="flex items-center gap-1 px-2 py-1 rounded hover:bg-[var(--Color-Surface-Surface-Secondary)]"
                >
                  <span>{{ currentLang.toUpperCase() }}</span>
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                <div
                  v-if="showLanguageDropdown"
                  class="absolute top-full mt-1 w-20 shadow-lg rounded-md z-10"
                  style="background-color: var(--Color-Surface-Surface-Primary)"
                  :class="currentLang === 'ar' ? 'left-0 right-auto' : 'right-0'"
                >
                  <button
                    v-for="lang in languages"
                    :key="lang"
                    @click="changeLanguage(lang)"
                    class="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--Color-Surface-Surface-Brand)]"
                    style="color: var(--Color-Text-Text-Primary)"
                  >
                    {{ lang.toUpperCase() }}
                  </button>
                </div>
              </div>

              <!-- User Profile Image with Dropdown -->
              <div v-if="isAuthenticated" class="relative flex items-center">
                <img
                  :src="userProfileImage || defaultImage"
                  alt="User Profile"
                  class="h-10 w-10 rounded-full cursor-pointer"
                  @click="toggleDropdown"
                />
                <div
                  v-if="showDropdown"
                  class="absolute top-full mt-1 right-0 w-48 shadow-lg rounded-md z-10"
                  style="background-color: var(--Color-Surface-Surface-Primary)"
                  :class="currentLang === 'ar' ? 'left-0 right-auto' : 'right-0'"
                >
                  <router-link
                    to="/profile"
                    class="block px-4 py-2 text-sm hover:bg-[var(--Color-Surface-Surface-Brand)]"
                    style="color: var(--Color-Text-Text-Primary)"
                    @click="closeDropdown"
                  >
                    {{ $t('profile') }}
                  </router-link>
                  <router-link
                    to="/settings"
                    class="block px-4 py-2 text-sm hover:bg-[var(--Color-Surface-Surface-Brand)]"
                    style="color: var(--Color-Text-Text-Primary)"
                    @click="closeDropdown"
                  >
                    {{ $t('settings') }}
                  </router-link>
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--Color-Surface-Surface-Brand)]"
                    style="color: var(--Color-Text-Text-Primary)"
                  >
                    {{ $t('logout') }}
                  </button>
                </div>
              </div>

              <router-link
                v-if="!isAuthenticated"
                to="/login"
                class="px-4 py-2 rounded-md text-xl font-medium bg-[var(--Color-Surface-Surface-Brand)] hover:bg-[var(--Colors-Primary-700)] text-[var(--Color-Text-Text-Invert)]"
              >
                {{ $t('login') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu remains the same -->
      <DisclosurePanel class="sm:hidden">
        <!-- Mobile menu content remains unchanged -->
      </DisclosurePanel>
    </Disclosure>
  </div>
</template>

<script setup>
import { Disclosure, DisclosurePanel } from "@headlessui/vue";
import { ref, watch, onMounted } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import defaultImage from "@/assets/default.png";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const isDarkMode = ref(false);
const isAuthenticated = ref(false);
const userProfileImage = ref("");
const showDropdown = ref(false);
const showLanguageDropdown = ref(false);
const currentLang = ref(locale.value);
const languages = ref(["en", "ar"]);
const auth = getAuth();
const router = useRouter();

const navLinks = [
  { to: "/home", text: "home" },
  { to: "/all-products", text: "browseTools" },
  { to: "/addProduct", text: "addTool" },
  { to: "/about", text: "about" },
  { to: "/contact", text: "contact" }
];

// Rest of the script remains the same
const setDir = (lang) => {
  if (lang === "ar") {
    document.documentElement.setAttribute("dir", "rtl");
    document.body.style.textAlign = "right";
  } else {
    document.documentElement.setAttribute("dir", "ltr");
    document.body.style.textAlign = "left";
  }
};

const toggleLanguageDropdown = () => {
  showLanguageDropdown.value = !showLanguageDropdown.value;
};

const changeLanguage = (lang) => {
  locale.value = lang;
  currentLang.value = lang;
  localStorage.setItem("lang", lang);
  setDir(lang);
  showLanguageDropdown.value = false;
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

/* Custom toggle switch styles (for dark mode) */
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

/* RTL adjustments */
[dir="rtl"] .flex.items-center.gap-4 > * {
  margin-left: 0;
  margin-right: 0;
}
</style>