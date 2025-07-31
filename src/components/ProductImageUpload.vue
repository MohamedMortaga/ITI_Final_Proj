<template>
  <div class="product-image-upload">
    <!-- Upload Mode Toggle -->
    <div class="mb-4">
      <div class="flex items-center justify-center space-x-4">
        <label class="flex items-center cursor-pointer">
          <input
            v-model="uploadMode"
            type="radio"
            value="single"
            class="mr-2 text-[var(--Color-Surface-Surface-Brand)] focus:ring-[var(--Colors-Primary-500)]"
          />
          <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">{{ $t('singleImage') }}</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input
            v-model="uploadMode"
            type="radio"
            value="multiple"
            class="mr-2 text-[var(--Color-Surface-Surface-Brand)] focus:ring-[var(--Colors-Primary-500)]"
          />
          <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">{{ $t('multipleImages') }}</span>
        </label>
      </div>
    </div>

    <!-- Enhanced Upload Section -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-3">
        {{ uploadMode === 'single' ? $t('productImage') : $t('productImages') }}
      </label>
      
      <!-- Modern File Input -->
      <div 
        class="relative border-2 border-dashed border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-8 text-center hover:border-[var(--Color-Surface-Surface-Brand)] hover:bg-[var(--Colors-Primary-25)] dark:hover:bg-[var(--Colors-Primary-800)] transition-all duration-300 cursor-pointer group"
        @click="$refs.fileInput.click()"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        :class="{
          'border-[var(--Color-Surface-Surface-Brand)] bg-[var(--Colors-Primary-25)] dark:bg-[var(--Colors-Primary-800)]': isDragOver
        }"
      >
        <input
          ref="fileInput"
          type="file"
          :multiple="uploadMode === 'multiple'"
          accept="image/*"
          @change="handleFileSelect"
          class="hidden"
        />
        
        <!-- Upload Icon with Animation -->
        <div class="mb-4">
          <div class="relative inline-block">
            <div class="w-16 h-16 bg-gradient-to-br from-[var(--Color-Surface-Surface-Brand)] to-[var(--Colors-Primary-600)] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <i class="fas fa-cloud-upload-alt text-2xl text-white"></i>
            </div>
            <!-- Animated Ring -->
            <div class="absolute inset-0 border-2 border-[var(--Color-Surface-Surface-Brand)] rounded-full animate-ping opacity-20"></div>
          </div>
        </div>
        
                  <!-- Upload Text -->
          <div class="space-y-2">
            <h3 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] group-hover:text-[var(--Color-Text-Text-Brand)] transition-colors">
              {{ uploadMode === 'single' ? $t('clickToUploadSingle') : $t('clickToUpload') }}
            </h3>
            <p class="text-sm text-[var(--Color-Text-Text-Secondary)] max-w-md mx-auto">
              {{ uploadMode === 'single' ? $t('uploadSingleImageDescription') : $t('uploadImagesDescription') }}
            </p>
          
          <!-- Drag & Drop Hint -->
          <div class="mt-4 flex items-center justify-center space-x-2 text-xs text-[var(--Color-Text-Text-Secondary)]">
            <i class="fas fa-mouse-pointer"></i>
            <span>{{ uploadMode === 'single' ? $t('orDragAndDropSingle') : $t('orDragAndDrop') }}</span>
            <i class="fas fa-arrow-down"></i>
          </div>
        </div>
        
        <!-- File Type Icons -->
        <div class="mt-4 flex items-center justify-center space-x-3">
          <div class="flex items-center space-x-1 text-xs text-[var(--Color-Text-Text-Secondary)]">
            <i class="fas fa-image text-[var(--Colors-Success-500)]"></i>
            <span>JPG</span>
          </div>
          <div class="flex items-center space-x-1 text-xs text-[var(--Color-Text-Text-Secondary)]">
            <i class="fas fa-image text-[var(--Colors-Success-500)]"></i>
            <span>PNG</span>
          </div>
          <div class="flex items-center space-x-1 text-xs text-[var(--Color-Text-Text-Secondary)]">
            <i class="fas fa-image text-[var(--Colors-Success-500)]"></i>
            <span>WebP</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Preview Section -->
    <div v-if="selectedFiles.length > 0" class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-[var(--Color-Text-Text-Primary)]">
          {{ $t('imagePreview') }} ({{ selectedFiles.length }} {{ uploadMode === 'single' ? $t('image') : $t('images') }})
        </h3>
        <div class="flex items-center space-x-2" v-if="uploadMode === 'multiple'">
          <span class="text-xs text-[var(--Color-Text-Text-Secondary)]">
            {{ $t('firstImageMain') }}
          </span>
          <i class="fas fa-info-circle text-[var(--Color-Text-Text-Secondary)] text-xs"></i>
        </div>
      </div>
      
      <div :class="uploadMode === 'single' ? 'max-w-md mx-auto' : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'">
        <div
          v-for="(file, index) in selectedFiles"
          :key="index"
          :class="uploadMode === 'single' ? 'relative group bg-white rounded-xl shadow-sm border border-[var(--Color-Boarder-Border-Primary)] overflow-hidden hover:shadow-lg transition-all duration-300' : 'relative group bg-white rounded-xl shadow-sm border border-[var(--Color-Boarder-Border-Primary)] overflow-hidden hover:shadow-lg transition-all duration-300'"
        >
          <img
            :src="file.preview"
            :alt="`Preview ${index + 1}`"
            class="w-full h-32 object-cover"
          />
          
          <!-- Overlay on Hover -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
          
          <!-- Remove Button -->
          <button
            @click="removeFile(index)"
            class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            :title="$t('removeImage')"
          >
            <i class="fas fa-times text-sm"></i>
          </button>
          
          <!-- Main Image Badge -->
          <div
            v-if="index === 0 && uploadMode === 'multiple'"
            class="absolute top-2 left-2 bg-gradient-to-r from-[var(--Color-Surface-Surface-Brand)] to-[var(--Colors-Primary-600)] text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
          >
            <i class="fas fa-star mr-1"></i>
            {{ $t('mainImage') }}
          </div>
          
          <!-- File Info -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p class="text-white text-xs truncate">{{ file.file.name }}</p>
            <p class="text-white/80 text-xs">{{ formatFileSize(file.file.size) }}</p>
          </div>
        </div>
      </div>
      
      <!-- Enhanced Upload Buttons -->
      <div class="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          @click="uploadImages"
          :disabled="uploading"
          class="flex-1 bg-gradient-to-r from-[var(--Color-Surface-Surface-Brand)] to-[var(--Colors-Primary-600)] text-white px-6 py-4 rounded-xl font-semibold hover:from-[var(--Colors-Primary-600)] hover:to-[var(--Colors-Primary-700)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <div class="flex items-center justify-center">
            <div v-if="uploading" class="mr-3">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <i v-else class="fas fa-cloud-upload-alt mr-3 text-lg"></i>
            <span>{{ uploading ? $t('uploading') : (uploadMode === 'single' ? $t('uploadImage') : $t('uploadImages')) }}</span>
          </div>
        </button>
        
        <button
          @click="clearSelection"
          class="flex-1 bg-white border-2 border-[var(--Color-Boarder-Border-Primary)] text-[var(--Color-Text-Text-Primary)] px-6 py-4 rounded-xl font-semibold hover:bg-[var(--Colors-Gray-50)] dark:hover:bg-[var(--Colors-Gray-800)] transition-all duration-300 transform hover:scale-105"
        >
          <div class="flex items-center justify-center">
            <i class="fas fa-trash mr-3 text-lg"></i>
            <span>{{ $t('clearSelection') }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Enhanced Current Images Display -->
    <div v-if="currentImages.length > 0" class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-[var(--Color-Text-Text-Primary)]">
          {{ $t('currentImages') }} ({{ currentImages.length }})
        </h3>
        <div class="flex items-center space-x-2">
          <span class="text-xs text-[var(--Color-Text-Text-Secondary)]">
            {{ $t('clickToDelete') }}
          </span>
          <i class="fas fa-info-circle text-[var(--Color-Text-Text-Secondary)] text-xs"></i>
        </div>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="(image, index) in currentImages"
          :key="index"
          class="relative group bg-white rounded-xl shadow-sm border border-[var(--Color-Boarder-Border-Primary)] overflow-hidden hover:shadow-lg transition-all duration-300"
        >
          <img
            :src="image"
            :alt="`Product image ${index + 1}`"
            class="w-full h-32 object-cover"
          />
          
          <!-- Overlay on Hover -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
          
          <!-- Delete Button -->
          <button
            @click="deleteImage(index)"
            class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            :title="$t('deleteImage')"
          >
            <i class="fas fa-trash text-sm"></i>
          </button>
          
          <!-- Main Image Badge -->
          <div
            v-if="index === 0"
            class="absolute top-2 left-2 bg-gradient-to-r from-[var(--Color-Surface-Surface-Brand)] to-[var(--Colors-Primary-600)] text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
          >
            <i class="fas fa-star mr-1"></i>
            {{ $t('mainImage') }}
          </div>
          
          <!-- Image Number -->
          <div class="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">
            {{ index + 1 }}
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Progress Bar -->
    <div v-if="uploading" class="mb-6">
      <div class="bg-white rounded-xl p-4 shadow-lg border border-[var(--Color-Boarder-Border-Primary)]">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">
            {{ $t('uploadingImages') }}
          </span>
          <span class="text-sm text-[var(--Color-Text-Text-Secondary)]">
            {{ uploadProgress }}%
          </span>
        </div>
        
        <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            class="bg-gradient-to-r from-[var(--Color-Surface-Surface-Brand)] to-[var(--Colors-Primary-600)] h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>
        
        <div class="flex items-center justify-between mt-2">
          <span class="text-xs text-[var(--Color-Text-Text-Secondary)]">
            {{ $t('uploadingToFirebase') }}
          </span>
          <div class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-[var(--Color-Surface-Surface-Brand)] rounded-full animate-pulse"></div>
            <div class="w-2 h-2 bg-[var(--Color-Surface-Surface-Brand)] rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 bg-[var(--Color-Surface-Surface-Brand)] rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Messages -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Success Messages -->
    <div v-if="successMessage" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <p class="text-green-600">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storage, db } from '@/firebase/config'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import Swal from 'sweetalert2'

// Props
const props = defineProps({
  productId: {
    type: String,
    required: true
  }
})

// Emits
const emit = defineEmits(['imagesUpdated'])

// Reactive data
const fileInput = ref(null)
const selectedFiles = ref([])
const currentImages = ref([])
const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref('')
const successMessage = ref('')
const isDragOver = ref(false)
const uploadMode = ref('multiple') // 'single' or 'multiple'

// Load current images on mount
onMounted(async () => {
  await loadCurrentImages()
})

// Watch for productId changes
watch(() => props.productId, async () => {
  if (props.productId) {
    await loadCurrentImages()
  }
})

// Load current images from Firestore
const loadCurrentImages = async () => {
  try {
    const productDoc = await getDoc(doc(db, 'products', props.productId))
    if (productDoc.exists()) {
      const data = productDoc.data()
      currentImages.value = data.imagePaths || []
    }
  } catch (err) {
    console.error('Error loading current images:', err)
    error.value = 'Failed to load current images'
  }
}

// Handle file selection
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
  event.target.value = ''
}

// Handle drag over
const handleDragOver = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

// Handle drag leave
const handleDragLeave = (event) => {
  event.preventDefault()
  isDragOver.value = false
}

// Handle drop
const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

// Process files (common function for both drag & drop and file input)
const processFiles = (files) => {
  // Validate file types
  const validFiles = files.filter(file => {
    if (!file.type.startsWith('image/')) {
      error.value = `${file.name} is not an image file`
      return false
    }
    return true
  })
  
  // Validate file sizes
  const maxSize = 5 * 1024 * 1024 // 5MB
  const sizeValidFiles = validFiles.filter(file => {
    if (file.size > maxSize) {
      error.value = `${file.name} is too large (max 5MB)`
      return false
    }
    return true
  })
  
  // Handle single image mode
  if (uploadMode.value === 'single') {
    // Clear previous selection and only keep the first file
    selectedFiles.value = []
    if (sizeValidFiles.length > 0) {
      const file = sizeValidFiles[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedFiles.value.push({
          file: file,
          preview: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  } else {
    // Multiple image mode - add all files
    sizeValidFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedFiles.value.push({
          file: file,
          preview: e.target.result
        })
      }
      reader.readAsDataURL(file)
    })
  }
  
  // Clear error if successful
  if (sizeValidFiles.length > 0) {
    error.value = ''
  }
}

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Remove file from selection
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

// Clear all selected files
const clearSelection = () => {
  selectedFiles.value = []
  error.value = ''
}

// Upload images to Firebase Storage
const uploadImages = async () => {
  if (selectedFiles.value.length === 0) {
    error.value = 'Please select images to upload'
    return
  }
  
  uploading.value = true
  uploadProgress.value = 0
  error.value = ''
  successMessage.value = ''
  
  try {
    const uploadPromises = selectedFiles.value.map(async (fileObj, index) => {
      const file = fileObj.file
      const fileName = `${Date.now()}_${file.name}`
      const storagePath = `products/${props.productId}/${fileName}`
      const imageRef = storageRef(storage, storagePath)
      
      // Upload file
      const snapshot = await uploadBytes(imageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      // Update progress
      uploadProgress.value = ((index + 1) / selectedFiles.value.length) * 100
      
      return {
        url: downloadURL,
        path: storagePath
      }
    })
    
    const uploadedImages = await Promise.all(uploadPromises)
    
    // Update Firestore document
    const productRef = doc(db, 'products', props.productId)
    const productDoc = await getDoc(productRef)
    
    if (productDoc.exists()) {
      const currentData = productDoc.data()
      const currentImagePaths = currentData.imagePaths || []
      const currentImages = currentData.images || []
      
      // Add new images
      const newImagePaths = [...currentImagePaths, ...uploadedImages.map(img => img.url)]
      const newImages = [...currentImages, ...uploadedImages.map(img => img.path)]
      
      // Set main image (img field) to the first image
      const mainImage = newImagePaths[0] || ''
      
      await updateDoc(productRef, {
        imagePaths: newImagePaths,
        images: newImages,
        img: mainImage
      })
      
      // Update local state
      currentImages.value = newImagePaths
      selectedFiles.value = []
      
      successMessage.value = `Successfully uploaded ${uploadedImages.length} image(s)`
      
      // Emit event
      emit('imagesUpdated', {
        imagePaths: newImagePaths,
        images: newImages,
        img: mainImage
      })
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Upload Successful!',
        text: `Successfully uploaded ${uploadedImages.length} image(s)`,
        timer: 2000,
        showConfirmButton: false
      })
    }
  } catch (err) {
    console.error('Error uploading images:', err)
    error.value = 'Failed to upload images. Please try again.'
    
    Swal.fire({
      icon: 'error',
      title: 'Upload Failed',
      text: 'Failed to upload images. Please try again.'
    })
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

// Delete image from current images
const deleteImage = async (index) => {
  try {
    const productRef = doc(db, 'products', props.productId)
    const productDoc = await getDoc(productRef)
    
    if (productDoc.exists()) {
      const currentData = productDoc.data()
      const currentImagePaths = currentData.imagePaths || []
      const currentImages = currentData.images || []
      
      // Remove image from arrays
      const updatedImagePaths = currentImagePaths.filter((_, i) => i !== index)
      const updatedImages = currentImages.filter((_, i) => i !== index)
      
      // Update main image if needed
      const mainImage = updatedImagePaths[0] || ''
      
      await updateDoc(productRef, {
        imagePaths: updatedImagePaths,
        images: updatedImages,
        img: mainImage
      })
      
      // Update local state
      currentImages.value = updatedImagePaths
      
      successMessage.value = 'Image deleted successfully'
      
      // Emit event
      emit('imagesUpdated', {
        imagePaths: updatedImagePaths,
        images: updatedImages,
        img: mainImage
      })
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Image deleted successfully',
        timer: 1500,
        showConfirmButton: false
      })
    }
  } catch (err) {
    console.error('Error deleting image:', err)
    error.value = 'Failed to delete image'
    
    Swal.fire({
      icon: 'error',
      title: 'Delete Failed',
      text: 'Failed to delete image. Please try again.'
    })
  }
}
</script>

<style scoped>
.product-image-upload {
  @apply space-y-4;
}

/* Custom scrollbar for image grid */
.grid::-webkit-scrollbar {
  width: 6px;
}

.grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.grid::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.grid::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 