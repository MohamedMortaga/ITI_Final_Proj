<template>
  <div class="max-w-6xl mx-auto py-10 px-4">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-[var(--Color-Text-Text-Primary)] mb-2">
        {{ $t("idVerification") }}
      </h1>
      <p class="text-[var(--Color-Text-Text-Secondary)]">
        {{ $t("idVerificationDesc") }}
      </p>
    </div>

    <!-- Simple Upload Section -->
    <div
      class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6"
    >
      <h3 class="text-lg font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">
        {{ $t("uploadIDCard") }}
      </h3>

      <!-- Front ID Upload -->
      <div class="mb-6">
        <label
          class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-1"
        >
          {{ $t("frontIDCard") }}
        </label>
        <input
          type="file"
          @change="handleFrontImageUpload"
          accept="image/*"
          class="w-full px-3 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)]"
        />
        <div v-if="form.frontImage" class="mt-3">
          <img
            :src="form.frontImage"
            :alt="$t('frontIDCard')"
            class="h-32 w-full object-cover rounded-lg border border-[var(--Color-Boarder-Border-Primary)]"
          />
        </div>
      </div>

      <!-- Back ID Upload -->
      <div class="mb-6">
        <label
          class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-1"
        >
          {{ $t("backIDCard") }}
        </label>
        <input
          type="file"
          @change="handleBackImageUpload"
          accept="image/*"
          class="w-full px-3 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)]"
        />
        <div v-if="form.backImage" class="mt-3">
          <img
            :src="form.backImage"
            :alt="$t('backIDCard')"
            class="h-32 w-full object-cover rounded-lg border border-[var(--Color-Boarder-Border-Primary)]"
          />
        </div>
      </div>

      <!-- Visa Info -->
      <div
        class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 mb-6"
      >
        <h3 class="text-lg font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">
          {{ $t("visaInfoRequired") }}
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Visa Number: 16 digits, spaced every 4 -->
          <div>
            <label
              class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-1"
            >
              {{ $t("visaNumber") }}
            </label>
            <input
              type="text"
              v-model="form.visa.number"
              @input="formatVisaNumber"
              placeholder="XXXX XXXX XXXX XXXX"
              maxlength="19"
              class="w-full px-3 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)]"
              :class="{ 'border-red-400': errors.visaNumber }"
              required
            />
            <p v-if="errors.visaNumber" class="text-xs text-red-500 mt-1">
              {{ errors.visaNumber }}
            </p>
          </div>

          <!-- Name on Visa -->
          <div>
            <label
              class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-1"
            >
              {{ $t("nameOnVisa") }}
            </label>
            <input
              v-model.trim="form.visa.name"
              type="text"
              class="w-full px-3 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)]"
              :class="{ 'border-red-400': errors.visaName }"
            />
            <p v-if="errors.visaName" class="text-xs text-red-500 mt-1">
              {{ errors.visaName }}
            </p>
          </div>

          <!-- Issuing Country -->
          <div>
            <label
              class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-1"
            >
              {{ $t("issuingCountry") }}
            </label>
            <input
              v-model.trim="form.visa.issuingCountry"
              type="text"
              class="w-full px-3 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)]"
              :class="{ 'border-red-400': errors.issuingCountry }"
            />
            <p v-if="errors.issuingCountry" class="text-xs text-red-500 mt-1">
              {{ errors.issuingCountry }}
            </p>
          </div>

          <!-- Visa Type -->
          <div>
            <label
              class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-1"
            >
              {{ $t("visaType") }}
            </label>
            <select
              v-model="form.visa.type"
              class="w-full px-3 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)]"
              :class="{ 'border-red-400': errors.visaType }"
            >
              <option value="">{{ $t("select") }}</option>
              <option value="tourist">{{ $t("visaTypeTourist") }}</option>
              <option value="work">{{ $t("visaTypeWork") }}</option>
              <option value="student">{{ $t("visaTypeStudent") }}</option>
              <option value="residence">{{ $t("visaTypeResidence") }}</option>
              <option value="other">{{ $t("other") }}</option>
            </select>
            <p v-if="errors.visaType" class="text-xs text-red-500 mt-1">
              {{ errors.visaType }}
            </p>
          </div>

          <!-- Expiry Date -->
          <div>
            <label
              class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-1"
            >
              {{ $t("expiryDate") }}
            </label>
            <input
              v-model="form.visa.expiry"
              type="date"
              class="w-full px-3 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)]"
              :class="{ 'border-red-400': errors.expiry }"
            />
            <p v-if="errors.expiry" class="text-xs text-red-500 mt-1">
              {{ errors.expiry }}
            </p>
          </div>

          <!-- (Optional) Passport Number -->
          <div>
            <label
              class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-1"
            >
              {{ $t("passportNumber") }}
            </label>
            <input
              v-model.trim="form.visa.passportNumber"
              type="text"
              maxlength="20"
              class="w-full px-3 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)]"
            />
          </div>
        </div>
      </div>

      <!-- Submit Button: only when all required fields are present -->
      <div v-if="canSubmit" class="text-center">
        <button
          @click="submitVerification"
          :disabled="isSubmitting"
          class="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
          {{ isSubmitting ? $t("submitting") : $t("submitForVerification") }}
        </button>
      </div>
    </div>

    <!-- Requirements Section -->
    <div
      class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 mt-6"
    >
      <h3 class="text-lg font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">
        {{ $t("idRequirements") }}
      </h3>
      <ul class="space-y-2 text-sm text-[var(--Color-Text-Text-Secondary)]">
        <li class="flex items-start gap-2">
          <i class="fas fa-check text-green-500 mt-1"></i>{{ $t("idRequirement1") }}
        </li>
        <li class="flex items-start gap-2">
          <i class="fas fa-check text-green-500 mt-1"></i>{{ $t("idRequirement2") }}
        </li>
        <li class="flex items-start gap-2">
          <i class="fas fa-check text-green-500 mt-1"></i>{{ $t("idRequirement3") }}
        </li>
        <li class="flex items-start gap-2">
          <i class="fas fa-check text-green-500 mt-1"></i>{{ $t("idRequirement4") }}
        </li>
        <li class="flex items-start gap-2">
          <i class="fas fa-check text-green-500 mt-1"></i>{{ $t("idRequirement5") }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { db, auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useStorageUpload } from "@/composables/useStorage";
import Swal from "sweetalert2";
import { useNotifications } from "@/composables/useNotifications";

const { t } = useI18n();
const { notifyIDVerificationSubmitted } = useNotifications();
const { uploadImage, url, error: uploadError } = useStorageUpload();

const userId = ref(null);
const uploadingFront = ref(false);
const uploadingBack = ref(false);
const isSubmitting = ref(false);

// errors for visa fields
const errors = ref({
  visaNumber: "",
  visaName: "",
  issuingCountry: "",
  visaType: "",
  expiry: "",
});

// form state
const form = ref({
  frontImage: null,
  backImage: null,
  frontImagePath: "",
  backImagePath: "",
  visa: {
    number: "", // formatted: "1234 5678 9012 3456"
    name: "",
    issuingCountry: "",
    type: "",
    expiry: "", // YYYY-MM-DD
    passportNumber: "",
  },
});

// gate for showing the button
const canSubmit = computed(() => {
  const hasImages = !!(form.value.frontImage && form.value.backImage);
  const v = form.value.visa;
  const digits = (v.number || "").replace(/\s/g, "");
  const hasVisa =
    digits.length === 16 && v.name && v.issuingCountry && v.type && v.expiry;
  return hasImages && hasVisa;
});

// format visa number: only digits, max 16, spaced every 4
const formatVisaNumber = () => {
  let digits = (form.value.visa.number || "").replace(/\D/g, "");
  digits = digits.substring(0, 16);
  form.value.visa.number = digits.replace(/(.{4})/g, "$1 ").trim();
};

// validation on submit
const validateVisa = () => {
  errors.value = {
    visaNumber: "",
    visaName: "",
    issuingCountry: "",
    visaType: "",
    expiry: "",
  };

  const digits = (form.value.visa.number || "").replace(/\s/g, "");
  if (digits.length !== 16) {
    errors.value.visaNumber = t("invalidVisaNumber") || "Visa number must be 16 digits.";
  }
  if (!form.value.visa.name || form.value.visa.name.length < 2) {
    errors.value.visaName = t("requiredField") || "Required.";
  }
  if (!form.value.visa.issuingCountry || form.value.visa.issuingCountry.length < 2) {
    errors.value.issuingCountry = t("requiredField") || "Required.";
  }
  if (!form.value.visa.type) {
    errors.value.visaType = t("requiredField") || "Required.";
  }
  if (!form.value.visa.expiry) {
    errors.value.expiry = t("requiredField") || "Required.";
  } else {
    const exp = new Date(form.value.visa.expiry);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(exp.getTime()) || exp < today) {
      errors.value.expiry = t("expiryMustBeFuture") || "Expiry must be a future date.";
    }
  }
  return Object.values(errors.value).every((v) => !v);
};

// uploads
const handleFrontImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  uploadingFront.value = true;
  try {
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.frontImage = e.target.result;
    };
    reader.readAsDataURL(file);

    await uploadImage(file, `id-cards/${userId.value}/front`, 3);
    if (uploadError.value) throw new Error(uploadError.value);
    const imageUrl = url.value;
    const storagePath = `id-cards/${userId.value}/front/${Date.now()}_${file.name}`;
    form.value.frontImage = imageUrl;
    form.value.frontImagePath = storagePath;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Front image upload failed",
      text: err.message || "Try again.",
    });
  } finally {
    uploadingFront.value = false;
  }
};

const handleBackImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  uploadingBack.value = true;
  try {
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.backImage = e.target.result;
    };
    reader.readAsDataURL(file);

    await uploadImage(file, `id-cards/${userId.value}/back`, 3);
    if (uploadError.value) throw new Error(uploadError.value);
    const imageUrl = url.value;
    const storagePath = `id-cards/${userId.value}/back/${Date.now()}_${file.name}`;
    form.value.backImage = imageUrl;
    form.value.backImagePath = storagePath;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Back image upload failed",
      text: err.message || "Try again.",
    });
  } finally {
    uploadingBack.value = false;
  }
};

// submit
const submitVerification = async () => {
  if (!form.value.frontImage || !form.value.backImage) {
    Swal.fire({
      icon: "warning",
      title: t("incompleteUpload"),
      text: t("pleaseUploadBothImages"),
    });
    return;
  }
  if (!validateVisa()) {
    Swal.fire({
      icon: "warning",
      title: t("invalidVisaInfo"),
      text: t("pleaseFixVisaErrors") || "Fix visa fields.",
    });
    return;
  }
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Swal.fire({
        icon: "error",
        title: t("userNotLoggedIn"),
        text: t("pleaseLoginFirst"),
      });
      return;
    }

    let userName = "Unknown User";
    let userEmail = currentUser.email || "No email";
    let userImage = null;
    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        userName = userData.displayName || userData.email || "Unknown User";
        userEmail = userData.email || currentUser.email || "No email";
        userImage = userData.imageUrl || null;
      }
    } catch {}

    const verificationData = {
      frontIdCardUrl: form.value.frontImage,
      backIdCardUrl: form.value.backImage,
      status: "pending",
      submittedAt: serverTimestamp(),
      userId: currentUser.uid,
      userName,
      userEmail,
      userImage,
      visa: {
        number: form.value.visa.number,
        name: form.value.visa.name,
        issuingCountry: form.value.visa.issuingCountry,
        type: form.value.visa.type,
        expiry: form.value.visa.expiry,
        passportNumber: form.value.visa.passportNumber || null,
      },
    };

    await setDoc(doc(db, "user-verifications", userId.value), verificationData);

    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        visa: { ...verificationData.visa },
      },
      { merge: true }
    );

    form.value = {
      frontImage: null,
      backImage: null,
      frontImagePath: "",
      backImagePath: "",
      visa: {
        number: "",
        name: "",
        issuingCountry: "",
        type: "",
        expiry: "",
        passportNumber: "",
      },
    };

    Swal.fire({
      icon: "success",
      title: t("verificationSubmitted"),
      text: t("verificationSubmittedDesc"),
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: t("submissionError"),
      text: t("verificationSubmissionError"),
    });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) userId.value = user.uid;
  });
});
</script>
