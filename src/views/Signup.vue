<template>
  <div
    :dir="i18n.locale.value === 'ar' ? 'rtl' : 'ltr'"
    class="min-h-screen flex items-center justify-center bg-[var(--Color-Surface-Surface-Primary)] px-4 sm:px-6 lg:px-8 overflow-y-hidden dark:bg-[var(--Color-Surface-Surface-Primary)]"
  >
    <div
      class="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between xl:max-w-7xl 2xl:max-w-[1500px]"
    >
      <!-- Form Section -->
      <div
        class="w-full lg:w-1/2 p-6 lg:p-10 xl:p-12 bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(var(--Color-Surface-Surface-Primary))] dark:text-gray-200"
        :class="i18n.locale.value === 'ar' ? 'lg:order-2' : 'lg:order-1'"
      >
        <div
          class="mb-6"
          :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
          :style="{ marginBottom: i18n.locale.value === 'ar' ? '1.5rem' : '1.5rem' }"
        >
          <h1 class="text-3xl font-bold text-teal-600 lg:text-3xl xl:text-4xl">
            {{ $t("rento") }}
          </h1>
        </div>

        <h2 class="text-2xl font-semibold mb-4 lg:text-2xl xl:text-3xl text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)]">
          {{ $t("signUp") }}
        </h2>
        <p class="text-gray-600 mb-6 lg:text-base xl:text-lg dark:text-gray-300">
          {{ $t("alreadyHaveAccount") }}<br />
          <router-link to="/Login" class="text-[var(--Color-Text-Text-Brand)] font-semibold">
            {{ $t("loginHere") }}
          </router-link>
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4 xl:space-y-5">
          <!-- Username -->
          <div>
            <label
              :for="i18n.locale.value === 'ar' ? 'اسم_المستخدم' : 'username'"
              class="block text-sm text-black mb-1 dark:text-gray-200"
            >
              {{ $t("username") }}
            </label>
            <input
              :id="i18n.locale.value === 'ar' ? 'اسم_المستخدم' : 'username'"
              v-model="username"
              type="text"
              required
              :placeholder="$t('enterUsername')"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>

          <!-- Email -->
          <div>
            <label
              :for="i18n.locale.value === 'ar' ? 'البريد_الإلكتروني' : 'email'"
              class="block text-sm text-black mb-1 dark:text-gray-200"
            >
              {{ $t("email") }}
            </label>
            <input
              :id="i18n.locale.value === 'ar' ? 'البريد_الإلكتروني' : 'email'"
              v-model="email"
              type="email"
              required
              :placeholder="$t('enterEmail')"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>

          <!-- Password -->
          <div>
            <label
              :for="i18n.locale.value === 'ar' ? 'كلمة_المرور' : 'password'"
              class="block text-sm text-black mb-1 dark:text-gray-200"
            >
              {{ $t("password") }}
            </label>
            <div class="relative">
              <input
                :id="i18n.locale.value === 'ar' ? 'كلمة_المرور' : 'password'"
                v-model="password"
                :type="passwordVisible ? 'text' : 'password'"
                required
                :placeholder="$t('enterPassword')"
                class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-lg dark:text-gray-300 dark:hover:text-gray-100"
                @click="togglePasswordVisibility"
                aria-label="Toggle password visibility"
              >
                <i :class="passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label
              :for="i18n.locale.value === 'ar' ? 'تأكيد_كلمة_المرور' : 'confirmPassword'"
              class="block text-sm text-black mb-1 dark:text-gray-200"
            >
              {{ $t("confirmPassword") }}
            </label>
            <div class="relative">
              <input
                :id="i18n.locale.value === 'ar' ? 'تأكيد_كلمة_المرور' : 'confirmPassword'"
                v-model="confirmPassword"
                :type="confirmPasswordVisible ? 'text' : 'password'"
                required
                :placeholder="$t('confirmPasswordPlaceholder')"
                class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-lg dark:text-gray-300 dark:hover:text-gray-100"
                @click="toggleConfirmPasswordVisibility"
                aria-label="Toggle confirm password visibility"
              >
                <i
                  :class="confirmPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"
                ></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            class="w-full bg-[var(--Color-Surface-Surface-Brand)] dark:bg-[var(--Color-Surface-Surface-Brand)]   text-white dark:text-[var(--Color-Text-Text-Primary)] rounded-md py-2 font-semibold hover:bg-[var(--Colors-Primary-600)] dark:hover:bg-[var(--Colors-Primary-600)] lg:py-2 xl:py-2 xl:text-lg"
          >
            {{ $t("signUp") }}
          </button>

          <div class="text-center text-gray-500 text-lg font-semibold dark:text-gray-400">
            {{ $t("or") }}
          </div>

          <div class="flex gap-3 items-center justify-center xl:gap-4">
            <button
              @click="handleGoogleSignup"
              type="button"
              class="flex w-full justify-center items-center rounded-md py-2 gap-2 border border-[var(--Color-Boarder-Surface-Brand)] text-[var(--Color-Text-Text-Brand)] bg-transparent hover:bg-teal-50 dark:border-[var(--Color-Boarder-Surface-Brand)] dark:text-[var(--Color-Text-Text-Brand)] dark:hover:bg-teal-900/20 text-base"
            >
              {{ $t("ContinueWith") }}
              <img
                src="../assets/google.png"
                alt="google"
                class="h-5 w-5"
              />
            </button>
          </div>

          <div
            v-if="error"
            class="text-red-600 text-sm mt-2 text-center dark:text-red-400"
            :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
          >
            {{ error }}
          </div>
        </form>
      </div>

      <!-- Illustration -->
      <div
        class="hidden lg:block w-full lg:w-1/2 mt-8 lg:mt-0"
        :class="i18n.locale.value === 'ar' ? 'lg:order-1' : 'lg:order-2'"
      >
        <img
          src="../assets/login.png"
          alt="Login Illustration"
          class="w-full h-auto"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import useSignup from "../composables/useSignup";
import { useI18n } from "vue-i18n";

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
    const i18n = useI18n();

    const handleSubmit = async () => {
      if (password.value !== confirmPassword.value) {
        Swal.fire({
          icon: "warning",
          title: i18n.t("passwordsDoNotMatch"),
          showConfirmButton: true,
        });
        return;
      }
      await signup(email.value, password.value, username.value);
      if (!error.value) {
        router.push({ name: "Login" });
      }
    };

    const handleGoogleSignup = async () => {
      await signupWithGoogle();
      if (!error.value) {
        router.push({ name: "Login" });
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
      i18n,
    };
  },
};
</script>

<style scoped>
/* Tailwind handles styling */
</style>
