<template>
  <div class="product-image-upload-example">
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-[var(--Color-Text-Text-Primary)] mb-6">
        Product Image Upload Example
      </h1>
      
      <!-- Product ID Input -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-2">
          Product ID
        </label>
        <input
          v-model="productId"
          type="text"
          placeholder="Enter product ID"
          class="w-full px-4 py-2 border border-[var(--Color-Boarder-Border-Primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)]"
        />
        <p class="text-sm text-[var(--Color-Text-Text-Secondary)] mt-1">
          Enter a valid product ID to test the image upload functionality
        </p>
      </div>
      
      <!-- Image Upload Component -->
      <div v-if="productId" class="bg-white rounded-lg shadow-lg p-6">
        <ProductImageUpload
          :productId="productId"
          @imagesUpdated="handleImagesUpdated"
        />
      </div>
      
      <!-- Instructions -->
      <div v-else class="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 class="text-lg font-medium text-blue-800 mb-2">How to Use</h3>
        <ol class="list-decimal list-inside space-y-2 text-blue-700">
          <li>Enter a valid product ID above</li>
          <li>Click "Click to upload images" to select multiple images</li>
          <li>Preview the selected images before uploading</li>
          <li>Click "Upload Images" to upload to Firebase Storage</li>
          <li>Images will be saved to <code>products/{productId}/</code> path</li>
          <li>The first image will be set as the main image (img field)</li>
          <li>All image URLs will be saved in the imagePaths array</li>
        </ol>
      </div>
      
      <!-- Current Product Data -->
      <div v-if="productId && currentProductData" class="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-medium text-[var(--Color-Text-Text-Primary)] mb-4">
          Current Product Data
        </h3>
        <pre class="bg-white p-4 rounded border overflow-auto text-sm">{{ JSON.stringify(currentProductData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import ProductImageUpload from './ProductImageUpload.vue'

const productId = ref('')
const currentProductData = ref(null)

// Watch for productId changes to load product data
watch(productId, async (newProductId) => {
  if (newProductId) {
    await loadProductData(newProductId)
  } else {
    currentProductData.value = null
  }
})

// Load product data from Firestore
const loadProductData = async (id) => {
  try {
    const productDoc = await getDoc(doc(db, 'products', id))
    if (productDoc.exists()) {
      currentProductData.value = productDoc.data()
    } else {
      currentProductData.value = null
      console.warn('Product not found')
    }
  } catch (error) {
    console.error('Error loading product data:', error)
    currentProductData.value = null
  }
}

// Handle images updated event
const handleImagesUpdated = (imageData) => {
  console.log('Images updated:', imageData)
  // Reload product data to show updated images
  if (productId.value) {
    loadProductData(productId.value)
  }
}
</script>

<style scoped>
.product-image-upload-example {
  @apply min-h-screen bg-gray-50;
}

pre {
  @apply font-mono;
}
</style> 