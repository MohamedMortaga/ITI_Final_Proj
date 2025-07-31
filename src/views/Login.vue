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
        class="w-full lg:w-1/2 p-6 lg:p-10 xl:p-12 bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)]"
        :class="i18n.locale.value === 'ar' ? 'lg:order-2' : 'lg:order-1'"
      >
        <div
          class="mb-6"
          :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
        >
          <h1
            class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] dark:text-[var(--Color-Text-Text-Brand)] lg:text-3xl xl:text-4xl"
          >
            {{ $t("rento") }}
          </h1>
        </div>

        <h2 class="text-2xl font-semibold mb-4 lg:text-2xl xl:text-3xl">
          {{ $t("login") }}
        </h2>
        <p class="text-gray-600 mb-6 lg:text-base xl:text-lg dark:text-gray-300">
          {{ $t("registerHere") }}<br />
          <router-link
            to="/Signup"
            class="text-[var(--Color-Text-Text-Brand)] font-semibold"
          >
            {{ $t("signUp") }}
          </router-link>
        </p>

        <form class="space-y-3 xl:space-y-3" @submit.prevent="handleSubmit">
          <!-- Email -->
          <div>
            <label
              :for="i18n.locale.value === 'ar' ? 'البريد_الإلكتروني' : 'email'"
              class="block text-sm text-black-900 mb-1 lg:text-sm xl:text-base dark:text-gray-200"
            >
              {{ $t("emailPlaceholder") }}
            </label>
            <input
              :id="i18n.locale.value === 'ar' ? 'البريد_الإلكتروني' : 'email'"
              v-model="email"
              type="email"
              required
              :placeholder="$t('emailPlaceholder')"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <!-- Password -->
          <div>
            <label
              :for="i18n.locale.value === 'ar' ? 'كلمة_المرور' : 'password'"
              class="block text-sm text-black-900 mb-1 lg:text-sm xl:text-base dark:text-gray-200"
            >
              {{ $t("passwordPlaceholder") }}
            </label>
            <div class="relative">
              <input
                :id="i18n.locale.value === 'ar' ? 'كلمة_المرور' : 'password'"
                v-model="password"
                :type="passwordVisible ? 'text' : 'password'"
                required
                :placeholder="$t('passwordPlaceholder')"
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

          <!-- Remember Me & Forgot -->
          <div
            class="flex justify-between items-center text-xs text-gray-600 lg:text-xs xl:text-sm dark:text-gray-300"
            :class="i18n.locale.value === 'ar' ? 'flex-row-reverse' : ''"
          >
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="rememberMe"
                class="mr-1 lg:mr-1 xl:mr-2 xl:h-5 xl:w-5 dark:bg-gray-700 dark:border-gray-600 m-2"
              />
              {{ $t("rememberMe") }}
            </label>
            <button
              type="button"
              @click="showForgotPasswordModal"
              class="text-[var(--Color-Text-Text-Brand)] hover:underline dark:text-[var(--Color-Text-Text-Brand)]"
            >
              {{ $t("forgotPassword") }}
            </button>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="w-full bg-[var(--Color-Surface-Surface-Brand)] dark:bg-[var(--Color-Surface-Surface-Brand)] text-white dark:text-[var(--Color-Text-Text-Primary)] rounded-md py-2 font-semibold hover:bg-[var(--Colors-Primary-600)] dark:hover:bg-[var(--Colors-Primary-600)] lg:py-2 xl:py-2 xl:text-lg"
          >
            {{ $t("logIn") }}
          </button>

          <!-- OR Social -->
          <div class="text-center text-gray-500 text-xl font-semibold dark:text-gray-400">
            {{ $t("or") }}
          </div>

          <div class="flex gap-3 items-center justify-center xl:gap-4">
            <button
              @click="handleGoogleLogin"
              type="button"
              class="flex w-full justify-center items-center rounded-md py-2 gap-2 xl:py-2 xl:gap-3 border border-teal-600 text-teal-600 bg-transparent hover:bg-teal-50 dark:border-teal-500 dark:text-teal-500 dark:hover:bg-teal-900/20 text-base"
            >
              {{ $t("ContinueWith") }}
              <img
                src="../assets/google.png"
                alt="google"
                class="h-4 w-4 lg:h-6 lg:w-6 xl:h-6 xl:w-6"
              />
            </button>
          </div>

          <!-- Error -->
          <div
            v-if="error"
            class="text-red-600 text-sm mt-2 lg:text-sm xl:text-base dark:text-red-400"
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

      <!-- Forgot Password Modal -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-md dark:bg-gray-800">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-200">
            {{ $t("resetYourPassword") }}
          </h3>
          <p class="text-sm text-gray-600 mb-4 dark:text-gray-300">
            {{ $t("enterEmailToReset") }}
          </p>
          <form @submit.prevent="handleForgotPassword">
            <div class="mb-4">
              <label
                :for="
                  i18n.locale.value === 'ar'
                    ? 'البريد_الإلكتروني_إعادة_الضبط'
                    : 'reset-email'
                "
                class="block text-sm text-gray-700 mb-1 dark:text-gray-200"
              >
                {{ $t("emailPlaceholder") }}
              </label>
              <input
                :id="
                  i18n.locale.value === 'ar'
                    ? 'البريد_الإلكتروني_إعادة_الضبط'
                    : 'reset-email'
                "
                v-model="resetEmail"
                type="email"
                required
                :placeholder="$t('emailPlaceholder')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div
              class="flex justify-end gap-2"
              :class="i18n.locale.value === 'ar' ? 'flex-row-reverse' : ''"
            >
              <button
                type="button"
                @click="isModalOpen = false"
                class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
              >
                {{ $t("cancel") }}
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-semibold hover:bg-teal-700"
              >
                {{ $t("sendResetLink") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  getAuth,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import useLogin from "../composables/useLogin";
import { useStorageUpload } from "@/composables/useStorage";
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
    const userImage = ref(null);
    const { login, loginWithGoogle, loginWithFacebook, error, userName } = useLogin();
    const router = useRouter();
    const auth = getAuth();
    const i18n = useI18n();
    const db = getFirestore();
    
    // Initialize storage upload composable
    const { uploadImage, url, error: uploadError, isPending } = useStorageUpload();

    onMounted(() => {
      const savedEmail = localStorage.getItem("rememberedEmail");
      const savedPassword = localStorage.getItem("rememberedPassword");
      if (savedEmail && savedPassword) {
        email.value = savedEmail;
        password.value = savedPassword;
        rememberMe.value = true;
      }
      onAuthStateChanged(auth, (user) => {
        if (user && user.emailVerified) {
          Swal.fire({
            position: "top-end",
            icon: "info",
            title: i18n.t("loginSuccessful"),
            showConfirmButton: false,
            timer: 1500,
          });
          router.push({ name: "HomePage" });
        }
      });
    });

    const handleImageUpload = (event) => {
      userImage.value = event.target.files[0];
    };

    const updateUserDoc = async (userCredential, defaultDisplayName) => {
      let imageUrl = userCredential.photoURL || "";
      if (userImage.value) {
        try {
          // Use enhanced upload function with retry logic
          await uploadImage(userImage.value, `users/${userCredential.uid}`, 3);
          
          if (uploadError.value) {
            throw new Error(uploadError.value);
          }
          
          imageUrl = url.value;
        } catch (err) {
          console.error('Profile image upload error:', err);
          // Continue without profile image if upload fails
        }
      }

      // Fetch existing user document to preserve role
      const userDocRef = doc(db, "users", userCredential.uid);
      const userDoc = await getDoc(userDocRef);
      const existingRole = userDoc.exists() ? userDoc.data().role : "user";

      await setDoc(
        userDocRef,
        {
          email: userCredential.email.toLowerCase(),
          displayName: userCredential.displayName || defaultDisplayName,
          role: existingRole, // Preserve existing role or set to "user" for new users
          createdAt: new Date().toISOString(),
          imageUrl: imageUrl,
        },
        { merge: true }
      );
    };

    const handleSubmit = async () => {
      if (rememberMe.value) {
        localStorage.setItem("rememberedEmail", email.value);
        localStorage.setItem("rememberedPassword", password.value);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      const userCredential = await login(email.value, password.value);
      if (!error.value && userCredential) {
        if (userCredential.emailVerified) {
          await updateUserDoc(userCredential, "sama ebrahim");
          Swal.fire({
            title: i18n.t("loginSuccessful"),
            icon: "success",
            draggable: true,
          });
          router.push({ name: "HomePage" });
        } else {
          await signOut(auth);
          Swal.fire({
            icon: "warning",
            title: i18n.t("emailVerificationRequired"),
            text: i18n.t("verifyEmailToLogin"),
            showConfirmButton: true,
          });
        }
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: `${i18n.t("error")}: ${error.value}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    const handleGoogleLogin = async () => {
      const userCredential = await loginWithGoogle();
      if (!userCredential) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: i18n.t("error") + ": Failed to authenticate with Google",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
      if (!error.value && userCredential) {
        if (userCredential.emailVerified) {
          await updateUserDoc(userCredential, "Google User");
          Swal.fire({
            title: i18n.t("loginGoogleSuccessful"),
            icon: "success",
            draggable: true,
          });
          router.push({ name: "HomePage" });
        } else {
          await signOut(auth);
          Swal.fire({
            icon: "warning",
            title: i18n.t("emailVerificationRequired"),
            text: i18n.t("verifyEmailToLogin"),
            showConfirmButton: true,
          });
        }
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: `${i18n.t("error")}: ${error.value}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    const handleFacebookLogin = async () => {
      const userCredential = await loginWithFacebook();
      if (!error.value && userCredential) {
        if (userCredential.emailVerified) {
          await updateUserDoc(userCredential, "Facebook User");
          Swal.fire({
            title: i18n.t("loginFacebookSuccessful"),
            icon: "success",
            draggable: true,
          });
          router.push({ name: "HomePage" });
        } else {
          await signOut(auth);
          Swal.fire({
            icon: "warning",
            title: i18n.t("emailVerificationRequired"),
            text: i18n.t("verifyEmailToLogin"),
            showConfirmButton: true,
          });
        }
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: `${i18n.t("error")}: ${error.value}`,
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
          title: i18n.t("enterEmail"),
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
          title: i18n.t("passwordResetSent"),
          showConfirmButton: false,
          timer: 1500,
        });
        isModalOpen.value = false;
        resetEmail.value = "";
      } catch (err) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: `${i18n.t("error")}: ${err.message}`,
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
      userImage,
      handleImageUpload,
      handleSubmit,
      handleGoogleLogin,
      handleFacebookLogin,
      showForgotPasswordModal,
      handleForgotPassword,
      togglePasswordVisibility,
      error,
      userName,
      router,
      i18n,
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
