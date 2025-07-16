<template>
  <div
    class="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8 overflow-y-hidden"
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
          <router-link to="/signup" class="text-teal-600 font-semibold"
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
                :type="passwordVisible ? 'text' : 'password'"
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
              <input
                type="checkbox"
                v-model="rememberMe"
                class="mr-1 lg:mr-1 xl:mr-2 xl:h-5 xl:w-5"
              />
              Remember me
            </label>
            <button
              type="button"
              @click="showForgotPasswordModal"
              class="text-teal-600 hover:underline"
            >
              Forgot Password?
            </button>
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

    <!-- Forgot Password Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Reset Your Password</h3>
        <p class="text-sm text-gray-600 mb-4">
          Enter your email address to receive a password reset link.
        </p>
        <form @submit.prevent="handleForgotPassword">
          <div class="mb-4">
            <label for="reset-email" class="block text-sm text-gray-700 mb-1"
              >Email</label
            >
            <input
              Watching
              id="reset-email"
              v-model="resetEmail"
              type="email"
              required
              placeholder="Enter your email address"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
            />
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="isModalOpen = false"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
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

    // Load saved email and password from localStorage when component mounts
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
      // Save email and password to localStorage if "Remember me" is checked
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
      resetEmail.value = email.value; // Pre-fill with login form email if available
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
      isModalOpen,
      resetEmail,
      handleSubmit,
      handleGoogleLogin,
      showForgotPasswordModal,
      handleForgotPassword,
      error,
      userName,
      router,
      togglePasswordVisibility,
      passwordVisible,
    };
  },
};
</script>

<style scoped>
/* No additional styles needed; Tailwind CSS classes handle the design */
</style>
