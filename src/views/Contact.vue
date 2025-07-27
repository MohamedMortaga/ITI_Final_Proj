<template>
  <div
    :dir="i18n.locale.value === 'ar' ? 'rtl' : 'ltr'"
    class="min-h-screen flex items-center justify-center bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] px-[88px] overflow-y-hidden"
  >
    <div
      class="max-w-6xl w-full flex flex-col items-center justify-between xl:max-w-7xl 2xl:max-w-[1500px] bg-[var(--Color-Surface-Surface-Primary)]"
      :class="i18n.locale.value === 'ar' ? 'lg:flex-row-reverse' : 'lg:flex-row'"
    >
      <!-- Form Section -->
      <div
        class="w-full p-0 md:p-6 lg:w-1/2 lg:p-10 xl:p-12 bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]"
        :class="i18n.locale.value === 'ar' ? 'lg:order-2' : 'lg:order-1'"
      >
        <form
          class="space-y-4 xl:space-y-4 border border-[var(--Color-Boarder-Border-Primary)] rounded-lg p-6 bg-[var(--Color-Surface-Surface-Primary)]"
          @submit.prevent="handleSubmit"
        >
          <h2
            class="text-2xl font-semibold mb-4 lg:text-2xl xl:text-3xl text-[var(--Color-Text-Text-Primary)]"
            :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
          >
            {{ $t("sendMessage") }}
          </h2>
          <p
            class="font-semibold mb-1 lg:text-base xl:text-lg text-[var(--Color-Text-Text-Secondary)]"
            :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
          >
            {{ $t("haveSomethingToShare") }}
          </p>
          <p
            class="text-[var(--Color-Text-Text-Secondary)] mb-6 lg:text-base xl:text-lg"
            :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
          >
            {{ $t("fillOutForm") }}
          </p>

          <!-- Name -->
          <div>
            <label
              for="name"
              class="block text-sm font-bold text-[var(--Color-Text-Text-Primary)] mb-1 lg:text-sm xl:text-base"
              :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
            >
              {{ $t("firstName") }}
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              :placeholder="$t('enterUsername')"
              class="w-full px-3 py-2 border border-[var(--Color-Boarder-Border-Primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-sm lg:text-sm xl:text-base bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]"
              :dir="i18n.locale.value === 'ar' ? 'rtl' : 'ltr'"
              required
            />
          </div>
          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-bold text-[var(--Color-Text-Text-Primary)] mb-1 lg:text-sm xl:text-base"
              :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
            >
              {{ $t("emailAddress") }}
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              :placeholder="$t('emailPlaceholder')"
              class="w-full px-3 py-2 border border-[var(--Color-Boarder-Border-Primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-sm lg:text-sm xl:text-base bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]"
              :dir="i18n.locale.value === 'ar' ? 'rtl' : 'ltr'"
              required
            />
          </div>
          <!-- Message -->
          <div>
            <label
              for="message"
              class="block text-sm font-bold text-[var(--Color-Text-Text-Primary)] mb-1 lg:text-sm xl:text-base"
              :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
            >
              {{ $t("message") }}
            </label>
            <textarea
              id="message"
              v-model="form.message"
              :placeholder="$t('productDetailsPlaceholder')"
              class="w-full px-3 py-2 border border-[var(--Color-Boarder-Border-Primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-sm lg:text-sm xl:text-base bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]"
              rows="4"
              :dir="i18n.locale.value === 'ar' ? 'rtl' : 'ltr'"
              required
            ></textarea>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="w-full bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] rounded-md py-3 font-semibold hover:bg-[var(--Color-Text-Text-Brand)] hover:text-[var(--Color-Text-Text-Invert)] lg:py-3 xl:py-4 xl:text-lg"
          >
            {{ $t("sendMessage") }}
          </button>
          <p
            v-if="error"
            class="text-red-600 text-sm"
            :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
          >
            {{ error }}
          </p>
        </form>
      </div>

      <!-- Map Image -->
      <div
        class="hidden lg:flex w-full lg:w-1/2 mt-8 lg:mt-0 items-stretch"
        :class="i18n.locale.value === 'ar' ? 'lg:order-1' : 'lg:order-2'"
      >
        <iframe
          :src="`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.021964024052!2d31.23571131511663!3d30.04441998187909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145841f6e2b2e7e3%3A0x7e1e8b4a3e8e8e8e!2sCairo%2C%20Egypt!5e0!3m2!1s${i18n.locale.value}!2seg!4v1681234567890!5m2!1s${i18n.locale.value}!2seg`"
          style="
            border: 0;
            border-radius: 0.5rem;
            width: 100%;
            height: 100%;
            aspect-ratio: 8/7;
          "
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="rounded-lg border border-[var(--Color-Boarder-Border-Primary)]"
        ></iframe>
      </div>
    </div>
    <!-- Get in Touch Section -->
  </div>
  <div
    :dir="i18n.locale.value === 'ar' ? 'rtl' : 'ltr'"
    class="w-full text-center flex flex-col items-center justify-center dark:bg-[var(--Color-Surface-Surface-Primary)] p-6"
  >
    <h2
      class="text-2xl font-semibold mb-4 lg:text-2xl xl:text-3xl text-[var(--Color-Text-Text-Brand)]"
      :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
    >
      {{ $t("getInTouch") }}
    </h2>
    <p
      class="text-[var(--Color-Text-Text-Secondary)] mb-6 lg:text-base xl:text-lg max-w-2xl mx-auto"
      :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
    >
      {{ $t("otherWaysToContact") }}
    </p>
    <div
      class="flex flex-col gap-10"
      :class="i18n.locale.value === 'ar' ? 'md:flex-row-reverse' : 'md:flex-row'"
      :style="i18n.locale.value === 'ar' ? 'direction: rtl' : 'direction: ltr'"
    >
      <div class="flex flex-col items-center">
        <span
          class="inline-flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)]"
        >
          <img src="@/assets/Message.svg" alt="Email" class="w-6 h-6" />
        </span>
        <p
          class="text-[var(--Color-Text-Text-Secondary)]"
          :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
        >
          {{ $t("emailAddress") }}
        </p>
        <p
          class="font-bold text-[var(--Color-Text-Text-Brand)]"
          :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
        >
          support@example.com
        </p>
      </div>
      <div class="flex flex-col items-center">
        <span
          class="inline-flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)]"
        >
          <img src="@/assets/Phone.svg" alt="Phone" class="w-6 h-6" />
        </span>
        <p
          class="text-[var(--Color-Text-Text-Secondary)]"
          :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
        >
          {{ $t("phone") }}
        </p>
        <p
          class="font-bold text-[var(--Color-Text-Text-Brand)]"
          :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
        >
          +1 234 567 890
        </p>
      </div>
      <div class="flex flex-col items-center">
        <span
          class="inline-flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)]"
        >
          <img src="@/assets/Pin_alt.svg" alt="Location" class="w-6 h-6" />
        </span>
        <p
          class="text-[var(--Color-Text-Text-Secondary)]"
          :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
        >
          {{ $t("address") }}
        </p>
        <p
          class="font-bold text-[var(--Color-Text-Text-Brand)]"
          :class="i18n.locale.value === 'ar' ? 'text-right' : 'text-left'"
        >
          {{ $t("location") }}
        </p>
      </div>
    </div>
  </div>
  <!-- Footer -->
  <AppFooter />
</template>

<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import AppFooter from "../components/pages/AppFooter.vue";
import Swal from "sweetalert2";

export default {
  components: {
    AppFooter,
  },
  setup() {
    const i18n = useI18n();
    const form = ref({
      name: "",
      email: "",
      message: "",
    });
    const error = ref("");
    const auth = getAuth();
    const db = getFirestore();

    const handleSubmit = async () => {
      if (!form.value.name || !form.value.email || !form.value.message) {
        error.value = i18n.t("allFieldsRequired");
        return;
      }

      try {
        const user = auth.currentUser;
        const contactData = {
          name: form.value.name,
          email: form.value.email.toLowerCase(),
          message: form.value.message,
          userId: user ? user.uid : null,
          createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, "contacts"), contactData);

        Swal.fire({
          icon: "success",
          title: i18n.t("messageSent"),
          showConfirmButton: false,
          timer: 1500,
        });

        form.value.name = "";
        form.value.email = "";
        form.value.message = "";
        error.value = "";
      } catch (err) {
        console.error("Error saving contact:", err); // Debug: Log the error
        error.value = i18n.t("sendError") + ": " + err.message;
      }
    };

    return { i18n, form, handleSubmit, error };
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

/* Ensure RTL text alignment for inputs and placeholders when dir is 'rtl' */
:deep([dir="rtl"]) input,
:deep([dir="rtl"]) textarea {
  text-align: right;
}

:deep([dir="rtl"]) input::placeholder,
:deep([dir="rtl"]) textarea::placeholder {
  text-align: right;
}

:deep([dir="ltr"]) input,
:deep([dir="ltr"]) textarea {
  text-align: left;
}

:deep([dir="ltr"]) input::placeholder,
:deep([dir="ltr"]) textarea::placeholder {
  text-align: left;
}
</style>
