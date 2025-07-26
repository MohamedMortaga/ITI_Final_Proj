<template>
  <div
    v-if="product"
    class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl shadow-sm flex flex-col transition hover:shadow-lg"
    :class="{ 'dir-rtl': $i18n.locale === 'ar' }"
  >
    <img
      :src="product.img || require('@/assets/test.png')"
      alt="product image"
      class="w-full h-40 object-cover rounded-t-xl"
    />
    <div class="p-4 flex flex-col flex-1">
      <h2 class="pb-4 text-base font-bold text-[var(--Color-Text-Text-Brand)] truncate">
        {{ product.title || "Untitled" }}
      </h2>
      <div
        class="mt-2 flex items-center justify-between text-xs text-[var(--Color-Text-Text-Secondary)] mb-1 pb-2"
        :class="{ 'flex-row-reverse': $i18n.locale === 'ar' }"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
      >
        <div class="flex items-center">
          <i class="fa-solid fa-location-dot mr-1"></i>
          {{ product.location || $t("defaultLocation") }}
        </div>
        <div
          class="flex items-center text-sm font-semibold text-[var(--Color-Text-Text-Primary)]"
        >
          <i class="fa-solid fa-star text-yellow-400 mr-1"></i>
          <span>{{ product.rating || "0" }}</span>
        </div>
      </div>
      <div
        class="flex items-center justify-between h-full mb-2"
        :class="{ 'flex-row-reverse': $i18n.locale === 'ar' }"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
      >
        <div class="text-sm font-semibold text-[var(--Color-Text-Text-Primary)]">
          {{ $i18n.locale === "ar" ? "ج.م" : "EGP" }} {{ product.price || "0" }}
        </div>
        <div class="text-sm font-semibold text-[var(--Color-Text-Text-Primary)]">
          {{ $t("perDay") }}
        </div>
      </div>
      <div class="mt-4">
        <button
          v-if="!isAuthenticated"
          @click="promptLogin"
          class="w-full bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-4 py-2 font-semibold text-sm transition hover:bg-[var(--Color-Text-Text-Brand)] hover:text-white"
          aria-label="Log in to rent this product"
        >
          {{ $t("rentItem") }}
        </button>
        <router-link
          v-else
          :to="{ name: 'ProductDetails', params: { id: product.id || '' } }"
          class="rounded-xl block w-full text-center bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-4 py-2 rounded font-semibold text-sm transition hover:bg-[var(--Color-Text-Text-Brand)] hover:text-white"
          :aria-label="`View details for ${product.title || 'Untitled'}`"
        >
          {{ $t("rentItem") }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n"; // Import useI18n

export default {
  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    isAuthenticated: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  setup(props) {
    const router = useRouter();
    const { t } = useI18n(); // Destructure t for translations

    const promptLogin = () => {
      Swal.fire({
        position: "top-end",
        icon: "info",
        title: t("pleaseLoginToRent"), // Translated title
        showConfirmButton: true,
        confirmButtonText: t("goToLogin"), // Translated button text
        showCancelButton: true,
        cancelButtonText: t("cancel"), // Translated button text
        timer: 5000,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
    };

    return {
      promptLogin,
    };
  },
};
</script>

<style scoped>
.dir-rtl {
  direction: rtl;
}
</style>
