<template>
  <div
    class="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between xl:max-w-7xl 2xl:max-w-[1500px]"
    >
      <!-- Form Section -->
      <div class="w-full lg:w-1/2 p-6 lg:p-10 xl:p-12">
        <div class="mb-6 text-left xl:mb-8">
          <h1 class="text-3xl font-bold text-teal-600 lg:text-3xl xl:text-4xl">Rento</h1>
        </div>

        <h2 class="text-2xl font-semibold mb-4 lg:text-2xl xl:text-3xl">Log in</h2>
        <p class="text-gray-600 mb-6 lg:text-base xl:text-lg">
          If you don't have an account register<br />
          You can
          <router-link to="/Signup" class="text-teal-600 font-semibold"
            >Register here !</router-link
          >
        </p>

        <form class="space-y-4 xl:space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label
              for="email"
              class="block text-sm text-gray-700 mb-1 lg:text-sm xl:text-base"
              >Email</label
            >
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="Enter your email address"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm text-gray-700 mb-1 lg:text-sm xl:text-base"
              >Password</label
            >
            <div class="relative">
              <input
                id="password"
                v-model="password"
                type="password"
                required
                placeholder="Enter Your email Password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base"
              />
              <button
                type="button"
                class="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                @click="togglePasswordVisibility"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div
            class="flex justify-between items-center text-xs text-gray-600 lg:text-xs xl:text-sm"
          >
            <label class="flex items-center">
              <input type="checkbox" class="mr-1 lg:mr-1 xl:mr-2 xl:h-5 xl:w-5" />
              Remember me
            </label>
            <a href="#" class="text-teal-600">Forgot Password ?</a>
          </div>

          <button
            type="submit"
            class="w-full bg-teal-600 text-white rounded-md py-3 font-semibold hover:bg-teal-700 lg:py-3 xl:py-4 xl:text-lg"
          >
            Log In
          </button>

          <div class="text-center text-gray-500 text-sm lg:text-sm xl:text-base">
            or continue with
          </div>
          <div class="flex gap-3 items-center justify-center xl:gap-4">
            <button
              @click="handleGoogleLogin"
              type="button"
              class="flex justify-center items-center rounded-md py-3 hover:bg-gray-100 gap-2 xl:py-4 xl:gap-3"
            >
              <img
                src="https://img.icons8.com/color/32/google-logo.png"
                alt="google"
                class="h-6 w-6 lg:h-6 lg:w-6 xl:h-8 xl:w-8"
              />
            </button>
            <button
              type="button"
              class="flex justify-center items-center rounded-md py-3 hover:bg-gray-100 gap-2 xl:py-4 xl:gap-3"
            >
              <img
                src="https://img.icons8.com/color/32/facebook.png"
                alt="facebook"
                class="h-6 w-6 lg:h-6 lg:w-6 xl:h-8 xl:w-8"
              />
            </button>
          </div>

          <div v-if="error" class="text-red-600 text-sm mt-2 lg:text-sm xl:text-base">
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
import useLogin from "../composables/useLogin";
import Swal from "sweetalert2";

export default {
  name: "Login",
  setup() {
    const email = ref("");
    const password = ref("");
    const passwordVisible = ref(false);
    const { login, loginWithGoogle, error, userName } = useLogin();
    const router = useRouter();

    const handleSubmit = async () => {
      await login(email.value, password.value);
      if (!error.value) {
        Swal.fire({
          title: "Login successful! Welcome to our community!",
          icon: "success",
          draggable: true,
        });
        router.push({ name: "HomePage" });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: `Oops, login unsuccessful: ${error.value}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    const handleGoogleLogin = async () => {
      await loginWithGoogle();
      if (!error.value) {
        Swal.fire({
          title: "Login using Google successful! Welcome to our community!",
          icon: "success",
          draggable: true,
        });
        router.push({ name: "HomePage" });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: `Oops, login unsuccessful: ${error.value}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
      const passwordInput = document.getElementById("password");
      passwordInput.type = passwordVisible.value ? "text" : "password";
    };

    return {
      email,
      password,
      handleSubmit,
      handleGoogleLogin,
      error,
      userName,
      router,
      togglePasswordVisibility,
    };
  },
};
</script>

<style scoped>
/* No additional styles needed; Tailwind CSS classes handle the design */
</style>
