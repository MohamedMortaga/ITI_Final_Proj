<template>
  <div :class="[isDarkMode ? 'dark' : 'light']">
    <Disclosure
      as="nav"
      class="bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] mb-0"
    >
      <div class="mx-auto container px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button -->
            <DisclosureButton
              class="inline-flex items-center justify-center rounded-md p-2 text-[var(--Color-Text-Text-Primary)] hover:bg-[var(--Color-Surface-Surface-Secondary)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--Color-Boarder-Border-Primary)]"
            >
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>

          <!-- Desktop navbar -->
          <div
            class="flex items-center justify-between w-full min-[641px]:flex max-[640px]:hidden"
          >
            <router-link
              to="/"
              class="text-xl font-medium hover:text-[var(--Color-Text-Text-Brand)]"
              :class="{
                'text-[var(--Color-Text-Text-Brand)]': true,
              }"
            >
              Rento
            </router-link>

            <div class="flex-1 flex items-center justify-center">
              <div class="flex lg:space-x-[64px] md:space-x-[16px] space-x-[8px]">
                <router-link
                  to="/home"
                  class="lg:text-xl md:text-md text-sm font-medium hover:text-[var(--Color-Text-Text-Brand)]"
                  :class="{
                    'text-[var(--Color-Text-Text-Brand)]': $route.path === '/home',
                    'text-[var(--Color-Text-Text-Primary)] hover:text-[var(--Color-Text-Text-Brand)]':
                      $route.path !== '/home',
                  }"
                >
                  Home
                </router-link>

                <router-link
                  to="/browse-tools"
                  class="lg:text-xl md:text-md text-sm font-medium hover:text-[var(--Color-Text-Text-Brand)]"
                  :class="{
                    'text-[var(--Color-Text-Text-Brand)]':
                      $route.path === '/browse-tools',
                    'text-[var(--Color-Text-Text-Primary)] hover:text-[var(--Color-Text-Text-Brand)]':
                      $route.path !== '/browse-tools',
                  }"
                >
                  Browse Tools
                </router-link>

                <router-link
                  to="/addProduct"
                  class="lg:text-xl md:text-md text-sm font-medium hover:text-[var(--Color-Text-Text-Brand)]"
                  :class="{
                    'text-[var(--Color-Text-Text-Brand)]': $route.path === '/addProduct',
                    'text-[var(--Color-Text-Text-Primary)] hover:text-[var(--Color-Text-Text-Brand)]':
                      $route.path !== '/addProduct',
                  }"
                >
                  Add Your Tool
                </router-link>

                <router-link
                  to="/about"
                  class="lg:text-xl md:text-md text-sm font-medium hover:text-[var(--Color-Text-Text-Brand)]"
                  :class="{
                    'text-[var(--Color-Text-Text-Brand)]': $route.path === '/about',
                    'text-[var(--Color-Text-Text-Primary)] hover:text-[var(--Color-Text-Text-Brand)]':
                      $route.path !== '/about',
                  }"
                >
                  About
                </router-link>

                <router-link
                  to="/contact"
                  class="lg:text-xl md:text-md text-sm font-medium hover:text-[var(--Color-Text-Text-Brand)]"
                  :class="{
                    'text-[var(--Color-Text-Text-Brand)]': $route.path === '/contact',
                    'text-[var(--Color-Text-Text-Primary)] hover:text-[var(--Color-Text-Text-Brand)]':
                      $route.path !== '/contact',
                  }"
                >
                  Contact
                </router-link>
              </div>
            </div>

            <div class="flex items-center space-x-4">
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

              <!-- Login -->
              <router-link
                v-if="!isAuthenticated"
                to="/login"
                class="px-4 py-2 rounded-md text-xl font-medium bg-[var(--Color-Surface-Surface-Brand)] hover:bg-[var(--Colors-Primary-700)] active:bg-[var(--Colors-Primary-700)] focus:bg-[var(--Colors-Primary-700)] text-[var(--Color-Text-Text-Invert)]"
              >
                Login
              </router-link>

              <!-- Logout -->
              <button
                v-else
                @click="handleLogout"
                class="px-4 py-2 rounded-md text-xl font-medium bg-[var(--Color-Surface-Surface-Brand)] hover:bg-[var(--Colors-Primary-700)] active:bg-[var(--Colors-Primary-700)] focus:bg-[var(--Colors-Primary-700)] text-[var(--Color-Text-Text-Invert)]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <DisclosurePanel class="sm:hidden">
        <div class="space-y-1 px-2 pt-2 pb-3 flex flex-col bg-white dark:bg-gray-900">
          <router-link
            to="/"
            class="text-primary-500 hover:bg-gray-200 hover:text-primary-700 rounded-md px-3 py-2 text-xl font-medium"
            :class="{
              'text-primary-900': $route.path === '/',
              'dark:text-primary-400 dark:hover:bg-gray-700': isDarkMode,
            }"
          >
            Rento
          </router-link>
          <router-link
            to="/home"
            class="text-gray-700 hover:bg-gray-200 hover:text-gray-900 rounded-md px-3 py-2 text-xl font-medium"
            :class="{
              'text-gray-900': $route.path === '/home',
              'dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white': isDarkMode,
            }"
          >
            Home
          </router-link>
          <router-link
            to="/browse-tools"
            class="text-gray-700 hover:bg-gray-200 hover:text-gray-900 rounded-md px-3 py-2 text-xl font-medium"
            :class="{
              'text-gray-900': $route.path === '/browse-tools',
              'dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white': isDarkMode,
            }"
          >
            Browse Tools
          </router-link>
          <router-link
            to="/addProduct"
            class="text-gray-700 hover:bg-gray-200 hover:text-gray-900 rounded-md px-3 py-2 text-xl font-medium"
            :class="{
              'text-gray-900': $route.path === '/addProduct',
              'dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white': isDarkMode,
            }"
          >
            Add Your Tool
          </router-link>
          <router-link
            to="/about"
            class="text-gray-700 hover:bg-gray-200 hover:text-gray-900 rounded-md px-3 py-2 text-xl font-medium"
            :class="{
              'text-gray-900': $route.path === '/about',
              'dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white': isDarkMode,
            }"
          >
            About
          </router-link>
          <router-link
            to="/contact"
            class="text-gray-700 hover:bg-gray-200 hover:text-gray-900 rounded-md px-3 py-2 text-xl font-medium"
            :class="{
              'text-gray-900': $route.path === '/contact',
              'dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white': isDarkMode,
            }"
          >
            Contact
          </router-link>
          <router-link
            to="/login"
            class="bg-success-500 text-white hover:bg-success-600 rounded-md px-3 py-2 text-xl font-medium"
            :class="{
              'bg-success-700': $route.path === '/login',
              'dark:bg-success-600': isDarkMode,
            }"
          >
            Logout
          </router-link>
          <div class="mt-2">
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

const open = ref(false);
const isDarkMode = ref(false);
const isAuthenticated = ref(false);
const auth = getAuth();
const router = useRouter();

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

// Run initialization on mount
onMounted(() => {
  initializeDarkMode();
  initializeAuth();
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
</style>
