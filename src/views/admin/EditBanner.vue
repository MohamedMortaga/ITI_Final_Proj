<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Banner Image Management</h2>

    <div v-if="banners.length === 0" class="text-gray-500">No images available.</div>

    <div class="grid sm:grid-cols-2 gap-6">
      <div
        v-for="banner in banners"
        :key="banner.id"
        class="border border-gray-50 rounded-lg p-4 shadow-md relative"
      >
        <img
          :src="banner.imageUrl"
          alt="Banner Image"
          class="w-full h-48 object-cover rounded"
        />

        <label class="block mt-4">
          <span class="text-sm text-gray-700">Update Image:</span>
          <input type="file" @change="e => handleFileChange(e, banner.id)" />
        </label>

        <button
          class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          @click="uploadBannerImage(banner.id)"
        >
          Update Image
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/config'
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore'
import { useStorageUpload } from '@/composables/useStorage'

// Initialize storage upload composable
const { uploadImage, url, error: uploadError, isPending } = useStorageUpload()

// State
const banners = ref([])
const selectedFiles = ref({}) // { bannerId: File }

const fetchBanners = async () => {
  const snapshot = await getDocs(collection(db, 'banners'))
  banners.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

const handleFileChange = (e, bannerId) => {
  const file = e.target.files[0]
  selectedFiles.value[bannerId] = file
}

const uploadBannerImage = async (bannerId) => {
  const file = selectedFiles.value[bannerId]
  if (!file) return alert('Please select an image first.')

  try {
    // Use enhanced upload function with retry logic
    await uploadImage(file, 'banners', 3)
    
    if (uploadError.value) {
      throw new Error(uploadError.value)
    }
    
    const downloadURL = url.value

    const bannerDoc = doc(db, 'banners', bannerId)
    await updateDoc(bannerDoc, { imageUrl: downloadURL })

    alert('Image updated successfully!')
    await fetchBanners() // Refresh the displayed list
  } catch (err) {
    console.error('Banner image upload error:', err)
    alert('Failed to upload image. Please try again.')
  }
}

// Initial fetch
onMounted(fetchBanners)
</script>
