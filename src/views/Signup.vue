<template>
  <div
    class="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8 overflow-y-hidden dark:bg-gray-900"
  >
    <div
      class="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between xl:max-w-7xl 2xl:max-w-[1500px]"
    >
      <!-- Form Section -->
      <div
        class="w-full lg:w-1/2 p-6 lg:p-10 xl:p-12 dark:bg-gray-800 dark:text-gray-200"
      >
        <div class="mb-6 text-left xl:mb-8">
          <h1 class="text-3xl font-bold text-teal-600 lg:text-3xl xl:text-4xl">Rento</h1>
        </div>

        <h2 class="text-2xl font-semibold mb-4 lg:text-2xl xl:text-3xl">{{$t('signUp')}}</h2>
        <p class="text-gray-600 mb-6 lg:text-base xl:text-lg dark:text-gray-300">
          {{$t('loginHere')}}
          <router-link to="/Login" class="text-teal-600 font-semibold">
            {{$t('logIn')}}
          </router-link>
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4 xl:space-y-6">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm text-black mb-1 dark:text-gray-200">
              {{$t('usernamePlaceholder')}}
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              :placeholder="$t('usernamePlaceholder')"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm text-black mb-1 dark:text-gray-200">
              {{$t('emailPlaceholder')}}
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              :placeholder="$t('emailPlaceholder')"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm text-black mb-1 dark:text-gray-200">
              {{$t('passwordPlaceholder')}}
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="passwordVisible ? 'text' : 'password'"
                required
                :placeholder="$t('passwordPlaceholder')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700 text-lg dark:text-gray-300 dark:hover:text-gray-100"
                @click="togglePasswordVisibility"
                aria-label="Toggle password visibility"
              >
                <i :class="passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm text-black mb-1 dark:text-gray-200">
              {{$t('confirmPasswordPlaceholder')}}
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="confirmPasswordVisible ? 'text' : 'password'"
                required
                :placeholder="$t('confirmPasswordPlaceholder')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700 text-lg dark:text-gray-300 dark:hover:text-gray-100"
                @click="toggleConfirmPasswordVisibility"
                aria-label="Toggle confirm password visibility"
              >
                <i :class="confirmPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            class="w-full bg-teal-600 text-white rounded-md py-3 font-semibold hover:bg-teal-700 lg:py-3 xl:py-4 xl:text-lg"
          >
            {{$t('signUp')}}
          </button>

          <div class="text-center text-gray-500 text-lg font-semibold dark:text-gray-400">
            {{$t('orContinueWith')}}
          </div>

          <div class="flex gap-3 items-center justify-center">
            <button
              @click="handleGoogleSignup"
              type="button"
              class="flex justify-center items-center rounded-md py-3 hover:bg-gray-100 gap-2 bg-white dark:bg-gray-700"
            >
              <img src="../assets/google.png" alt="google" class="h-6 w-6" />
            </button>
          </div>

          <div
            v-if="error"
            class="text-red-600 text-sm mt-2 text-center dark:text-red-400"
          >
            {{ error }}
          </div>
        </form>
      </div>

      <!-- Illustration Section -->
      <div class="hidden lg:block w-full lg:w-1/2 mt-8 lg:mt-0">
        <img src="../assets/login.png" alt="Login Illustration" class="w-full h-auto" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import useSignup from "../composables/useSignup";

export default {
  name: "Signup",
  setup() {
    const username = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const passwordVisible = ref(false);
    const confirmPasswordVisible = ref(false);
    const { signup, signupWithGoogle, error } = useSignup();
    const router = useRouter();

    const handleSubmit = async () => {
      if (password.value !== confirmPassword.value) {
        Swal.fire({
          icon: "warning",
          title: $t('passwordsDoNotMatch'),
          showConfirmButton: true,
        });
        return;
      }
      await signup(email.value, password.value, username.value);
      if (!error.value) {
        router.push({ name: "Login" }); // Redirect to Login instead of HomePage
      }
    };

    const handleGoogleSignup = async () => {
      await signupWithGoogle();
      if (!error.value) {
        router.push({ name: "Login" }); // Redirect to Login instead of HomePage
      }
    };

    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    const toggleConfirmPasswordVisibility = () => {
      confirmPasswordVisible.value = !confirmPasswordVisible.value;
    };

    return {
      username,
      email,
      password,
      confirmPassword,
      passwordVisible,
      confirmPasswordVisible,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
      handleSubmit,
      handleGoogleSignup,
      error,
    };
  },
};
</script>

<style scoped>
/* Tailwind handles styling */
</style>
