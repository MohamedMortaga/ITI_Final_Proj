<template>
  <div
    class="min-h-screen bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-800)] text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
  >
    <!-- Profile Section -->
    <div class="max-w-6xl mx-auto py-10 px-4">
      <div class="flex flex-col items-center md:items-start md:flex-row gap-8 mb-8">
        <img
          :src="sanitizeUrl(userProfile.imageUrl) || require('@/assets/default.png')"
          alt="Profile"
          class="w-28 h-28 rounded-full object-cover border-4 border-[var(--color-primary-100)] shadow"
          @error="onImageError"
        />
        <div class="flex flex-col justify-center items-center md:items-start">
          <h2 class="text-2xl font-bold mb-1">
            <span class="text-[var(--color-primary-600)]">{{ $t("welcome") }} </span>
            <span class="text-[var(--Color-Text-Text-Primary)]">
              {{ userProfile.displayName || $t("unknownUser") }}</span
            >
          </h2>
        </div>
      </div>
      <div class="bg-white dark:bg-[var(--color-gray-800)] rounded-xl shadow p-8">
        <h3 class="text-lg font-bold mb-6 text-[var(--Color-Text-Text-Primary)]">
          {{ $t("personalInformation") }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{
              $t("firstName")
            }}</label>
            <div class="relative">
              <input
                v-model="userProfile.firstName"
                type="text"
                class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-200)] text-[var(--Color-Text-Text-Primary)]"
              />
              <span
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] cursor-pointer"
                @click="editField('firstName')"
              >
                <i class="fas fa-pen"></i>
              </span>
            </div>
          </div>
          <div>
            <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{
              $t("lastName")
            }}</label>
            <div class="relative">
              <input
                v-model="userProfile.lastName"
                type="text"
                class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-200)] text-[var(--Color-Text-Text-Primary)]"
              />
              <span
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] cursor-pointer"
                @click="editField('lastName')"
              >
                <i class="fas fa-pen"></i>
              </span>
            </div>
          </div>
          <div>
            <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{
              $t("emailAddress")
            }}</label>
            <input
              v-model="userProfile.email"
              type="email"
              class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 text-[var(--Color-Text-Text-Primary)]"
              disabled
            />
          </div>
          <div>
            <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{
              $t("phone")
            }}</label>
            <div class="relative">
              <input
                v-model="userProfile.phone"
                type="tel"
                class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-200)] text-[var(--Color-Text-Text-Primary)]"
                placeholder="0102 219 4510"
                @input="formatPhoneNumber"
              />
              <span
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] cursor-pointer"
                @click="editField('phone')"
              >
                <i class="fas fa-pen"></i>
              </span>
            </div>
          </div>
        </div>
        <h3 class="text-lg font-bold mb-6 text-[var(--Color-Text-Text-Primary)]">
          {{ $t("address") }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{
              $t("city")
            }}</label>
            <div class="relative">
              <input
                v-model="userProfile.city"
                type="text"
                class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-200)] text-[var(--Color-Text-Text-Primary)]"
              />
              <span
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] cursor-pointer"
                @click="editField('city')"
              >
                <i class="fas fa-pen"></i>
              </span>
            </div>
          </div>
          <div>
            <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{
              $t("district")
            }}</label>
            <div class="relative">
              <input
                v-model="userProfile.district"
                type="text"
                class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-200)] text-[var(--Color-Text-Text-Primary)]"
              />
              <span
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] cursor-pointer"
                @click="editField('district')"
              >
                <i class="fas fa-pen"></i>
              </span>
            </div>
          </div>
        </div>
        <button
          @click="saveProfile"
          class="mt-6 bg-[var(--color-success-500)] text-[var(--color-gray-25)] py-2 px-4 rounded-lg hover:bg-[var(--color-success-600)] dark:bg-[var(--color-success-300)] dark:hover:bg-[var(--color-success-400)]"
        >
          {{ $t("saveChanges") }}
        </button>
      </div>
    </div>

    <!-- Existing Product Section -->
    <div
      v-if="product"
      class="max-w-4xl mx-auto p-6 bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-800)] rounded-2xl shadow-xl border border-[var(--color-success-200)] flex flex-col md:flex-row gap-6"
    >
      <!-- Placeholder for product and booking logic -->
      <p>{{ $t("loadingProduct") }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import Swal from "sweetalert2";

const { t } = useI18n();
const route = useRouter(); // Corrected: Should be useRoute
const router = useRouter();
const product = ref(null); // Placeholder for product data
const userProfile = ref({
  displayName: "",
  imageUrl: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  district: "",
});
const showBookingForm = ref(false);

const loadUserProfile = async () => {
  try {
    // Ensure user is authenticated
    if (!auth.currentUser) {
      Swal.fire({
        icon: "error",
        title: t("authErrorTitle"),
        text: t("authErrorText"),
        confirmButtonText: t("ok"),
      });
      router.push("/login");
      return;
    }

    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      userProfile.value = {
        displayName: data.displayName || auth.currentUser.displayName || t("unknownUser"),
        imageUrl: sanitizeUrl(data.imageUrl) || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: auth.currentUser.email || "",
        phone: data.phone || "",
        city: data.city || "",
        district: data.district || "",
      };
    } else {
      // Initialize with default values if no document exists
      userProfile.value = {
        displayName: auth.currentUser.displayName || t("unknownUser"),
        imageUrl: "",
        firstName: "",
        lastName: "",
        email: auth.currentUser.email || "",
        phone: "",
        city: "",
        district: "",
      };
      await setDoc(userDocRef, {
        ...userProfile.value,
        timestamp: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    Swal.fire({
      icon: "error",
      title: t("error"),
      text: t("failedToLoadProfile"),
      confirmButtonText: t("ok"),
    });
  }
};

const onImageError = () => {
  userProfile.value.imageUrl = require("@/assets/default.png");
};

const editField = (field) => {
  console.log(`Editing ${field}`);
  // Optionally, add logic to enable editing (e.g., focus the input)
};

const saveProfile = async () => {
  if (!auth.currentUser) {
    Swal.fire({
      icon: "error",
      title: t("authErrorTitle"),
      text: t("authErrorText"),
      confirmButtonText: t("ok"),
    });
    router.push("/login");
    return;
  }

  // Basic validation
  if (!userProfile.value.firstName || !userProfile.value.lastName) {
    Swal.fire({
      icon: "warning",
      title: t("validationError"),
      text: t("nameRequired"),
      confirmButtonText: t("ok"),
    });
    return;
  }

  try {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    const profileData = {
      displayName: userProfile.value.displayName,
      imageUrl: userProfile.value.imageUrl,
      firstName: userProfile.value.firstName,
      lastName: userProfile.value.lastName,
      email: userProfile.value.email,
      phone: userProfile.value.phone,
      city: userProfile.value.city,
      district: userProfile.value.district,
      timestamp: serverTimestamp(),
    };

    if (userDocSnap.exists()) {
      await updateDoc(userDocRef, profileData);
    } else {
      await setDoc(userDocRef, profileData);
    }

    Swal.fire({
      icon: "success",
      title: t("success"),
      text: t("profileUpdated"),
      confirmButtonText: t("ok"),
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    Swal.fire({
      icon: "error",
      title: t("error"),
      text: `${t("failedToUpdateProfile")} ${error.message}`,
      confirmButtonText: t("ok"),
    });
  }
};

const formatPhoneNumber = (event) => {
  let value = event.target.value.replace(/\D/g, ""); // Remove non-digits
  if (value && !value.startsWith("01")) {
    value = "01" + value; // Ensure it starts with 01
    Swal.fire({
      icon: "warning",
      title: t("invalidPhone"),
      text: t("phoneMustStartWith01"),
      confirmButtonText: t("ok"),
    });
  }
  if (value.length > 11) value = value.slice(0, 11); // Limit to 11 digits
  let formatted = "";
  if (value.length > 0) formatted = value.slice(0, 3); // e.g., 010
  if (value.length > 3) formatted += " " + value.slice(3, 6); // e.g., 219
  if (value.length > 6) formatted += " " + value.slice(6, 11); // e.g., 4510
  userProfile.value.phone = formatted.trim();
};

const sanitizeUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  // Remove potentially harmful characters and schemes
  return url.replace(/[<>"]/g, "").replace(/javascript:/gi, "");
};

onMounted(() => {
  // Wait for auth state to be resolved
  auth.onAuthStateChanged((user) => {
    if (user) {
      loadUserProfile();
    } else {
      router.push("/login");
    }
  });
});
</script>
