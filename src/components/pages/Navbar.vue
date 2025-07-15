<template>
  <div>
    <Disclosure as="nav" class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button -->
            <DisclosureButton
              class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
          <div class="flex flex-1 items-center justify-end sm:items-center sm:justify-end">
            <div class="hidden sm:ml-6 sm:block">
              <div class="flex space-x-4">
                <!-- Show Home, Add Product, and Logout only if user is logged in -->
                <router-link
                  v-if="isLoggedIn"
                  to="/Home"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-xl font-medium"
                  :class="{ 'bg-gray-900 text-white': $route.path === '/Home' }"
                  aria-current="page"
                >
                  Home
                </router-link>
                <router-link
                  v-if="!isLoggedIn"
                  to="/"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-xl font-medium"
                  :class="{ 'bg-gray-900 text-white': $route.path === '/' }"
                >
                  Login
                </router-link>
                <router-link
                  v-if="!isLoggedIn"
                  to="/Signup"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-xl font-medium"
                  :class="{ 'bg-gray-900 text-white': $route.path === '/Signup' }"
                >
                  Sign Up
                </router-link>
                <router-link
                  v-if="isLoggedIn"
                  to="/AddProduct"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-xl font-medium"
                  :class="{ 'bg-gray-900 text-white': $route.path === '/AddProduct' }"
                >
                  Add Product
                </router-link>
                <button
                  v-if="isLoggedIn"
                  @click="handleLogout"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-xl font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DisclosurePanel class="sm:hidden">
        <div class="space-y-1 px-2 pt-2 pb-3 flex flex-col">
          <!-- Show Home, Add Product, and Logout only if user is logged in -->
          <router-link
            v-if="isLoggedIn"
            to="/Home"
            class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-xl font-medium"
            :class="{ 'bg-gray-900 text-white': $route.path === '/Home' }"
            aria-current="page"
          >
            Home
          </router-link>
          <router-link
            v-if="!isLoggedIn"
            to="/"
            class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-xl font-medium"
            :class="{ 'bg-gray-900 text-white': $route.path === '/' }"
          >
            Login
          </router-link>
          <router-link
            v-if="!isLoggedIn"
            to="/Signup"
            class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-xl font-medium"
            :class="{ 'bg-gray-900 text-white': $route.path === '/Signup' }"
          >
            Sign Up
          </router-link>
          <router-link
            v-if="isLoggedIn"
            to="/AddProduct"
            class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-xl font-medium"
            :class="{ 'bg-gray-900 text-white': $route.path === '/AddProduct' }"
          >
            Add Product
          </router-link>
          <router-link
            v-if="isLoggedIn"
            to="/Logout"
            class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-xl font-medium"
            :class="{ 'bg-gray-900 text-white': $route.path === '/Logout' }"
            @click.prevent="handleLogout"
          >
            Logout
          </router-link>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = getAuth();
const isLoggedIn = ref(false);

// Check authentication state
onAuthStateChanged(auth, (user) => {
  isLoggedIn.value = !!user; // Set isLoggedIn to true if user exists, false otherwise
});

const handleLogout = async () => {
  try {
    await signOut(auth);
    router.push('/login');
  } catch (err) {
    console.error('Logout failed:', err.message);
  }
};
</script>

<style lang="less" scoped></style>