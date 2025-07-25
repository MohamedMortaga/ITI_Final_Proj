<template>
  <div :class="[isDarkMode ? 'dark' : 'light']">
    <Disclosure
      as="nav"
      class="bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] mb-0 px-6 lg:px-[88px]"
    >
      <div class="mx-auto sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <!-- Logo -->
          <router-link
            to="/"
            class="text-2xl font-medium text-[var(--Color-Text-Text-Brand)] hover:text-[var(--Color-Text-Text-Brand)]"
          >
            {{ $t("rento") }}
          </router-link>

          <!-- Main content (centered nav links) -->
          <div class="flex-1 flex justify-center">
            <!-- Navigation links -->
            <div class="flex items-center gap-3 hidden lg:flex">
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
                class="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-[var(--Color-Surface-Surface-Secondary)] transition-colors"
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
                class="absolute top-full mt-2 w-20 shadow-lg rounded-md z-10"
                style="background-color: var(--Color-Surface-Surface-Primary)"
              >
                <button
                  v-for="lang in languages"
                  :key="lang"
                  @click="changeLanguage(lang)"
                  class="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--Color-Surface-Surface-Brand)] transition-colors"
                  style="color: var(--Color-Text-Text-Primary)"
                >
                  {{ languageLabels[lang] }}
                </button>
              </div>
            </div>

            <!-- User Profile Image with Dropdown -->
            <div v-if="isAuthenticated" class="relative flex items-center">
              <img
                :src="userProfileImage || '../../assets/default.png'"
                alt="User Profile"
                class="h-8 w-8 sm:h-10 sm:w-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                @click="toggleDropdown"
              />
              <div
                v-if="showDropdown"
                :class="[
                  'absolute top-full mt-2 w-48 shadow-lg rounded-md z-10',
                  currentLang === 'ar' ? 'left-0 right-auto text-right' : 'right-0',
                ]"
                style="background-color: var(--Color-Surface-Surface-Primary)"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm hover:bg-[var(--Color-Surface-Surface-Brand)] transition-colors"
                  style="color: var(--Color-Text-Text-Primary)"
                  @click="closeDropdown"
                >
                  {{ $t("profile") }}
                </router-link>
                <router-link
                  to="/settings"
                  class="block px-4 py-2 text-sm hover:bg-[var(--Color-Surface-Surface-Brand)] transition-colors"
                  style="color: var(--Color-Text-Text-Primary)"
                  @click="closeDropdown"
                >
                  {{ $t("settings") }}
                </router-link>
                <button
                  @click="handleLogout"
                  :class="[
                    'block w-full px-4 py-2 text-sm hover:bg-[var(--Color-Surface-Surface-Brand)] transition-colors',
                    currentLang === 'ar' ? 'text-right' : 'text-left',
                  ]"
                  style="color: var(--Color-Text-Text-Primary)"
                >
                  {{ $t("logout") }}
                </button>
              </div>
            </div>

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
      <DisclosurePanel class="lg:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <!-- Navigation links -->
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="block px-3 py-2 rounded-md text-base font-medium hover:bg-[var(--Color-Surface-Surface-Brand)] transition-colors"
            :class="{
              'text-[var(--Color-Text-Text-Brand)] font-bold': $route.path === link.to,
            }"
          >
            {{ $t(link.text) }}
          </router-link>

          <!-- Profile/Login (moved to mobile menu) -->
          <div v-if="isAuthenticated" class="relative px-3 py-2">
            <div class="flex items-center gap-2">
              <img
                :src="userProfileImage || '../../assets/default.png'"
                alt="User Profile"
                class="h-8 w-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                @click="toggleDropdown"
              />
              <span class="text-base font-medium">{{ $t("profile") }}</span>
            </div>
            <div
              v-if="showDropdown"
              class="mt-2 w-full shadow-lg rounded-md z-10"
              style="background-color: var(--Color-Surface-Surface-Primary)"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm hover:bg-[var(--Color-Surface-Surface-Brand)] transition-colors"
                style="color: var(--Color-Text-Text-Primary)"
                @click="closeDropdown"
              >
                {{ $t("profile") }}
              </router-link>
              <router-link
                to="/settings"
                class="block px-4 py-2 text-sm hover:bg-[var(--Color-Surface-Surface-Brand)] transition-colors"
                style="color: var(--Color-Text-Text-Primary)"
                @click="closeDropdown"
              >
                {{ $t("settings") }}
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--Color-Surface-Surface-Brand)] transition-colors"
                style="color: var(--Color-Text-Text-Primary)"
              >
                {{ $t("logout") }}
              </button>
            </div>
          </div>

          <router-link
            v-if="!isAuthenticated"
            to="/login"
            class="block px-3 py-2 rounded-md text-base font-medium bg-[var(--Color-Surface-Surface-Brand)] hover:bg-[var(--Colors-Primary-700)] text-[var(--Color-Text-Text-Invert)] transition-colors"
          >
            {{ $t("login") }}
          </router-link>

          <!-- Dark Mode Toggle -->
          <div class="p-3 py-2">
            <input
              type="checkbox"
              class="custom-toggle"
              id="checkbox-mobile"
              v-model="isDarkMode"
            />
            <label for="checkbox-mobile" class="custom-toggle-label ml-2">
              <span class="toggle-icon"></span>
            </label>
          </div>

          <!-- Language Selector -->
          <div class="relative px-3 py-2">
            <button
              @click="toggleLanguageDropdown"
              class="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-[var(--Color-Surface-Surface-Secondary)] transition-colors"
            >
              <span>{{ currentLang.toUpperCase() }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              class="mt-2 w-20 shadow-lg rounded-md z-10"
              style="background-color: var(--Color-Surface-Surface-Primary)"
            >
              <button
                v-for="lang in languages"
                :key="lang"
                @click="changeLanguage(lang)"
                class="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--Color-Surface-Surface-Brand)] transition-colors"
                style="color: var(--Color-Text-Text-Primary)"
              >
                {{ languageLabels[lang] }}
              </button>
            </div>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ref, watch, onMounted } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
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

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const closeDropdown = () => {
  showDropdown.value = false;
};

onMounted(() => {
  initializeDarkMode();
  initializeAuth();
  setDir(currentLang.value);
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
</style>
