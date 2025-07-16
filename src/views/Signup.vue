<template>
  <div class="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8 overflow-y-hidden">
    <div
      class="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between xl:max-w-7xl 2xl:max-w-[1500px]">

      <!-- Form Section -->
      <div class="w-full lg:w-1/2 p-6 lg:p-10 xl:p-12">
        <div class="mb-6 text-left xl:mb-8">
          <h1 class="text-3xl font-bold text-teal-600 lg:text-3xl xl:text-4xl">Rento</h1>
        </div>

        <h2 class="text-2xl font-semibold mb-4 lg:text-2xl xl:text-3xl">Sign Up</h2>
        <p class="text-gray-600 mb-6 lg:text-base xl:text-lg">
          If you already have an account register
 You can<br />
          <router-link to="/Login" class="text-teal-600 font-semibold">Login here!</router-link>
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4 xl:space-y-6">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm text-black mb-1">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              placeholder="Enter your username"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm text-black mb-1">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="Enter your email address"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm text-black mb-1">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="passwordVisible ? 'text' : 'password'"
                required
                placeholder="Enter your password"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700 text-lg"
                @click="togglePasswordVisibility"
                aria-label="Toggle password visibility">
                <i :class="['fas', passwordVisible ? 'fa-eye-slash' : 'fa-eye']"></i>
              </button>
            </div>
          </div>

        <!-- Confirm Password -->
<div>
  <label for="confirmPassword" class="block text-sm text-black mb-1">Confirm Password</label>
  <div class="relative">
    <input
      id="confirmPassword"
      v-model="confirmPassword"
      :type="confirmPasswordVisible ? 'text' : 'password'"
      required
      placeholder="Confirm your password"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base"
    />
    <button
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700 text-lg"
      @click="toggleConfirmPasswordVisibility"
      aria-label="Toggle confirm password visibility">
      <i :class="confirmPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
    </button>
  </div>
</div>


          <button
            type="submit"
            class="w-full bg-teal-600 text-white rounded-md py-3 font-semibold hover:bg-teal-700">
            Sign Up
          </button>

          <!-- <div class="text-center text-gray-500 text-lg font-semibold">or continue with</div> -->

          <!-- <div class="flex gap-3 items-center justify-center">
            <button type="button" class="flex justify-center items-center rounded-md py-3 hover:bg-gray-100 gap-2">
              <img src="../assets/google.png" alt="google" class="h-6 w-6" />
            </button>
            <button type="button" class="flex justify-center items-center rounded-md py-3 hover:bg-gray-100 gap-2">
              <img src="../assets/Facebook.png" alt="facebook" class="h-6 w-6" />
            </button>
          </div> -->

          <div v-if="error" class="text-red-600 text-sm mt-2 text-center">
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import useSignup from '../composables/useSignup';

export default {
  name: 'Signup',
  setup() {
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const passwordVisible = ref(false);
    const confirmPasswordVisible = ref(false);
    const { signup, signupWithGoogle, error } = useSignup();
    const router = useRouter();

    const handleSubmit = async () => {
      if (password.value !== confirmPassword.value) {
        Swal.fire({
          icon: 'warning',
          title: 'Passwords do not match',
          showConfirmButton: true,
        });
        return;
      }
      await signup(email.value, password.value, username.value);
      if (!error.value) {
        Swal.fire({
          icon: 'success',
          title: 'Signed up successfully!',
          timer: 1500,
          showConfirmButton: false
        });
        router.push({ name: 'HomePage' });
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
      error,
    };
  },
};
</script>

<style scoped>
/* Tailwind handles styling */

</style>