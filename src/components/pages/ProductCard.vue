<template>
  <div
    v-if="product"
    class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-lg md:rounded-xl shadow-sm transition hover:shadow-lg h-32 md:h-auto"
    :class="{ 'dir-rtl': $i18n.locale === 'ar' }"
  >
    <router-link :to="{ name: 'ProductDetails', params: { id: product.id || '' } }" class="flex flex-row md:flex-col h-full">
      <!-- Product Image -->
      <div class="w-1/3 md:w-full">
        <img
          :src="product.img || require('@/assets/test.png')"
          alt="product image"
          class="w-full h-full md:h-40 object-cover rounded-l-lg md:rounded-t-xl md:rounded-l-none"
        />
      </div>
      
      <!-- Product Details -->
      <div class="p-3 md:p-4 flex flex-col flex-1 w-2/3 md:w-full">
        <div class="flex justify-between items-start mb-1 md:mb-2">
          <h2 class="text-sm md:text-base font-bold text-[var(--Color-Text-Text-Brand)] truncate flex-1 md:pb-4">
            {{ product.title || "Untitled" }}
          </h2>
          <div class="flex items-center text-xs md:text-sm font-semibold text-[var(--Color-Text-Text-Primary)] ml-2">
            <i class="fa-solid fa-star text-yellow-400 mr-1 text-xs"></i>
            <span>{{ product.rating || "0" }}</span>
          </div>
        </div>
        
        <div class="flex items-center text-xs md:text-xs text-[var(--Color-Text-Text-Secondary)] mb-2 md:mb-1 md:pb-2"
             :class="{ 'flex-row-reverse': $i18n.locale === 'ar' }"
             :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
          <div class="flex items-center">
            <i class="fa-solid fa-location-dot mr-1 text-xs"></i>
            {{ product.location || $t("defaultLocation") }}
          </div>
        </div>
        
        <div class="flex items-center justify-between mb-3 md:mb-2"
             :class="{ 'flex-row-reverse': $i18n.locale === 'ar' }"
             :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
          <div class="text-sm md:text-sm font-semibold text-[var(--Color-Text-Text-Primary)]">
            {{ $i18n.locale === "ar" ? "ج.م" : "EGP" }} {{ product.price || "0" }}
          </div>
          <div class="text-xs md:text-sm font-semibold text-[var(--Color-Text-Text-Primary)]">
            {{ $t("perDay") }}
          </div>
        </div>
        
        <div class="mt-auto md:mt-4">
          <button
            v-if="!isAuthenticated"
            @click="promptLogin"
            class="w-full bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-3 md:px-4 py-1.5 md:py-2 font-semibold text-xs md:text-sm transition hover:bg-[var(--Color-Text-Text-Brand)] hover:text-white rounded md:rounded-md"
            aria-label="Log in to rent this product"
          >
            {{ $t("rentItem") }}
          </button>
          <div
            v-else-if="isProductOwner()"
            class="w-full bg-gray-100 text-gray-600 px-3 md:px-4 py-1.5 md:py-2 font-semibold text-xs md:text-sm rounded md:rounded-md border border-gray-300 text-center"
          >
            {{ $t("ownProductMessage") }}
          </div>
          <router-link
            v-else
            :to="{ name: 'ProductDetails', params: { id: product.id || '' } }"
            class="block w-full text-center bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-3 md:px-4 py-1.5 md:py-2 font-semibold text-xs md:text-sm transition hover:bg-[var(--Color-Text-Text-Brand)] hover:text-white rounded md:rounded-md"
            :aria-label="`View details for ${product.title || 'Untitled'}`"
          >
            {{ $t("rentItem") }}
          </router-link>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n"; // Import useI18n
import { getAuth } from "firebase/auth";

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
    const auth = getAuth();

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

    // Check if current user is the product owner
    const isProductOwner = () => {
      try {
        if (!auth?.currentUser || !props.product) return false;
        const productOwnerId = props.product.userId || props.product.sellerId;
        return auth.currentUser.uid === productOwnerId;
      } catch (error) {
        console.warn('Error checking product ownership:', error);
        return false;
      }
    };

    return {
      promptLogin,
      isProductOwner,
    };
  },
};
</script>

<style scoped>
.dir-rtl {
  direction: rtl;
}
</style>
