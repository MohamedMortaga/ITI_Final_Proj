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
    <div class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
      <h3 class="text-lg font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">
        {{ $t("uploadIDCard") }}
      </h3>

      <!-- Front ID Upload -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-1">
          {{ $t("frontIDCard") }}
        </label>
        <input
          type="file"
          @change="handleFrontImageUpload"
          accept="image/*"
          class="w-full px-3 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)]"
        />
        <div v-if="form.frontImage" class="mt-3">
          <img :src="form.frontImage" :alt="$t('frontIDCard')" class="h-32 w-full object-cover rounded-lg border border-[var(--Color-Boarder-Border-Primary)]" />
        </div>
        <p v-if="uploadingFront" class="text-sm text-[var(--Colors-Success-500)] mt-2">{{ $t("uploadingImage") }}</p>
      </div>

      <!-- Back ID Upload -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-1">
          {{ $t("backIDCard") }}
        </label>
        <input
          type="file"
          @change="handleBackImageUpload"
          accept="image/*"
          class="w-full px-3 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)]"
        />
        <div v-if="form.backImage" class="mt-3">
          <img :src="form.backImage" :alt="$t('backIDCard')" class="h-32 w-full object-cover rounded-lg border border-[var(--Color-Boarder-Border-Primary)]" />
        </div>
        <p v-if="uploadingBack" class="text-sm text-[var(--Colors-Success-500)] mt-2">{{ $t("uploadingImage") }}</p>
      </div>

      <!-- Submit Button -->
      <div v-if="form.frontImage && form.backImage" class="text-center">
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
    <div class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 mt-6">
      <h3 class="text-lg font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">
        {{ $t("idRequirements") }}
      </h3>
      <ul class="space-y-2 text-sm text-[var(--Color-Text-Text-Secondary)]">
        <li class="flex items-start gap-2">
          <i class="fas fa-check text-green-500 mt-1"></i>
          {{ $t("idRequirement1") }}
        </li>
        <li class="flex items-start gap-2">
          <i class="fas fa-check text-green-500 mt-1"></i>
          {{ $t("idRequirement2") }}
        </li>
        <li class="flex items-start gap-2">
          <i class="fas fa-check text-green-500 mt-1"></i>
          {{ $t("idRequirement3") }}
        </li>
        <li class="flex items-start gap-2">
          <i class="fas fa-check text-green-500 mt-1"></i>
          {{ $t("idRequirement4") }}
        </li>
        <li class="flex items-start gap-2">
          <i class="fas fa-check text-green-500 mt-1"></i>
          {{ $t("idRequirement5") }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { db, auth, storage } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import { useNotifications } from "@/composables/useNotifications";

const { t } = useI18n();
const { notifyIDVerificationSubmitted } = useNotifications();

const userId = ref(null);
const uploadingFront = ref(false);
const uploadingBack = ref(false);
const isSubmitting = ref(false);

// Simple form like product upload
const form = ref({
  frontImage: null,
  backImage: null,
  frontImagePath: "",
  backImagePath: ""
});

// Handle front image upload - exactly like product upload
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

    const storagePath = `id-cards/${userId.value}/front/${Date.now()}_${file.name}`;
    const imageRef = storageRef(storage, storagePath);
    const snapshot = await uploadBytes(imageRef, file);
    const imageUrl = await getDownloadURL(snapshot.ref);

    form.value.frontImage = imageUrl;
    form.value.frontImagePath = storagePath;
  } catch (err) {
    Swal.fire({ icon: "error", title: "Front image upload failed", text: err.message });
  } finally {
    uploadingFront.value = false;
  }
};

// Handle back image upload - exactly like product upload
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

    const storagePath = `id-cards/${userId.value}/back/${Date.now()}_${file.name}`;
    const imageRef = storageRef(storage, storagePath);
    const snapshot = await uploadBytes(imageRef, file);
    const imageUrl = await getDownloadURL(snapshot.ref);

    form.value.backImage = imageUrl;
    form.value.backImagePath = storagePath;
  } catch (err) {
    Swal.fire({ icon: "error", title: "Back image upload failed", text: err.message });
  } finally {
    uploadingBack.value = false;
  }
};

// Submit verification - simplified like product submit
const submitVerification = async () => {
  if (!form.value.frontImage || !form.value.backImage) {
    Swal.fire({
      icon: 'warning',
      title: t('incompleteUpload'),
      text: t('pleaseUploadBothImages'),
      confirmButtonText: 'OK'
    });
    return;
  }

  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;

    // Get current user information
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Swal.fire({
        icon: 'error',
        title: t('userNotLoggedIn'),
        text: t('pleaseLoginFirst'),
        confirmButtonText: 'OK'
      });
      return;
    }

    // Get user data from users collection
    let userName = 'Unknown User';
    let userEmail = currentUser.email || 'No email';
    let userImage = null;

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        userName = userData.displayName || userData.email || 'Unknown User';
        userEmail = userData.email || currentUser.email || 'No email';
        userImage = userData.imageUrl || null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }

    // Save to Firestore - include user information
    const verificationData = {
      frontIdCardUrl: form.value.frontImage,
      backIdCardUrl: form.value.backImage,
      status: 'pending',
      submittedAt: serverTimestamp(),
      // Add user information
      userId: currentUser.uid,
      userName: userName,
      userEmail: userEmail,
      userImage: userImage
    };

    await setDoc(doc(db, 'user-verifications', userId.value), verificationData);

    // Send notification to admin
    try {
      await notifyIDVerificationSubmitted('User');
    } catch (error) {
      console.error('Error sending notification:', error);
    }

    // Clear the form
    form.value = {
      frontImage: null,
      backImage: null,
      frontImagePath: "",
      backImagePath: ""
    };
     
    Swal.fire({
      icon: 'success',
      title: t('verificationSubmitted'),
      text: t('verificationSubmittedDesc'),
      timer: 2000,
      showConfirmButton: false
    });

  } catch (error) {
    console.error('Error submitting verification:', error);
    
    Swal.fire({
      icon: 'error',
      title: t('submissionError'),
      text: t('verificationSubmissionError'),
      confirmButtonText: 'OK'
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Initialize
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId.value = user.uid;
    }
  });
});
</script> 