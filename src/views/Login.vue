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

        <h2 class="text-2xl font-semibold mb-4 lg:text-2xl xl:text-3xl">Log in</h2>
        <p class="text-gray-600 mb-6 lg:text-base xl:text-lg dark:text-gray-300">
          If you don't have an account register<br />
          You can
          <router-link to="/Signup" class="text-teal-600 font-semibold"
            >Register here!</router-link
          >
        </p>

        <form class="space-y-4 xl:space-y-6" @submit.prevent="handleSubmit">
          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm text-black-900 mb-1 lg:text-sm xl:text-base dark:text-gray-200"
              >Email</label
            >
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="Enter your email address"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <!-- Password -->
          <div>
            <label
              for="password"
              class="block text-sm text-black-900 mb-1 lg:text-sm xl:text-base dark:text-gray-200"
              >Password</label
            >
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="passwordVisible ? 'text' : 'password'"
                required
                placeholder="Enter your password"
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

          <!-- Remember Me & Forgot -->
          <div
            class="flex justify-between items-center text-xs text-gray-600 lg:text-xs xl:text-sm dark:text-gray-300"
          >
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="rememberMe"
                class="mr-1 lg:mr-1 xl:mr-2 xl:h-5 xl:w-5 dark:bg-gray-700 dark:border-gray-600"
              />
              Remember me
            </label>
            <button
              type="button"
              @click="showForgotPasswordModal"
              class="text-teal-600 hover:underline dark:text-teal-400"
            >
              Forgot Password?
            </button>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="w-full bg-teal-600 text-white rounded-md py-3 font-semibold hover:bg-teal-700 lg:py-3 xl:py-4 xl:text-lg"
          >
            Log In
          </button>

          <!-- OR Social -->
          <div class="text-center text-gray-500 text-xl font-semibold dark:text-gray-400">
            or continue with
          </div>

          <div class="flex gap-3 items-center justify-center xl:gap-4">
            <button
              @click="handleGoogleLogin"
              type="button"
              class="flex justify-center items-center rounded-md py-3 gap-2 xl:py-4 xl:gap-3 bg-white dark:bg-gray-700"
            >
              <img
                src="../assets/google.png"
                alt="google"
                class="h-6 w-6 lg:h-6 lg:w-6 xl:h-8 xl:w-8"
              />
            </button>
          </div>

          <!-- Error -->
          <div
            v-if="error"
            class="text-red-600 text-sm mt-2 lg:text-sm xl:text-base dark:text-red-400"
          >
            {{ error }}
          </div>
        </form>
      </div>

      <!-- Illustration -->
      <div class="hidden lg:block w-full lg:w-1/2 mt-8 lg:mt-0">
        <img
          src="../assets/login.png"
          alt="Login Illustration"
          class="w-full h-auto"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md dark:bg-gray-800">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-200">
          Reset Your Password
        </h3>
        <p class="text-sm text-gray-600 mb-4 dark:text-gray-300">
          Enter your email address to receive a password reset link.
        </p>
        <form @submit.prevent="handleForgotPassword">
          <div class="mb-4">
            <label
              for="reset-email"
              class="block text-sm text-gray-700 mb-1 dark:text-gray-200"
              >Email</label
            >
            <input
              id="reset-email"
              v-model="resetEmail"
              type="email"
              required
              placeholder="Enter your email address"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="isModalOpen = false"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-semibold hover:bg-teal-700"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import useLogin from "../composables/useLogin";
import Swal from "sweetalert2";

export default {
  name: "Login",
  setup() {
    const email = ref("");
    const password = ref("");
    const passwordVisible = ref(false);
    const rememberMe = ref(false);
    const isModalOpen = ref(false);
    const resetEmail = ref("");
    const { login, loginWithGoogle, error, userName } = useLogin();
    const router = useRouter();
    const auth = getAuth();

    onMounted(() => {
      const savedEmail = localStorage.getItem("rememberedEmail");
      const savedPassword = localStorage.getItem("rememberedPassword");
      if (savedEmail && savedPassword) {
        email.value = savedEmail;
        password.value = savedPassword;
        rememberMe.value = true;
      }
    });

    const handleSubmit = async () => {
      if (rememberMe.value) {
        localStorage.setItem("rememberedEmail", email.value);
        localStorage.setItem("rememberedPassword", password.value);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

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

    const showForgotPasswordModal = () => {
      isModalOpen.value = true;
      resetEmail.value = email.value;
    };

    const handleForgotPassword = async () => {
      if (!resetEmail.value) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Please enter your email address",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      try {
        await sendPasswordResetEmail(auth, resetEmail.value, {
          url: `${window.location.origin}/Login`,
        });
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Password reset email sent! Check your inbox.",
          showConfirmButton: false,
          timer: 1500,
        });
        isModalOpen.value = false;
        resetEmail.value = "";
      } catch (err) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: `Error: ${err.message}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    return {
      email,
      password,
      rememberMe,
      passwordVisible,
      isModalOpen,
      resetEmail,
      handleSubmit,
      handleGoogleLogin,
      showForgotPasswordModal,
      handleForgotPassword,
      togglePasswordVisibility,
      error,
      userName,
      router,
    };
  },
};
</script>

<style scoped>
input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px #ffffff inset !important;
  -webkit-text-fill-color: #000 !important;
  border: 1px solid #737373 !important;
  transition: background-color 5000s ease-in-out 0s;
}
.dark input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px #1a1a1a inset !important;
  -webkit-text-fill-color: #d1d5db !important;
  border: 1px solid #4b5563 !important;
}
</style>
