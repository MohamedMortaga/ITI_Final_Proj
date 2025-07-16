<!-- src/views/ProductDetails.vue -->
<template>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="product" class="bg-white rounded-2xl shadow-xl p-6 border border-pink-200 flex flex-col md:flex-row gap-6">
      
      <!-- Product Image -->
      <div class="md:w-1/2">
        <img
          :src="product.imageUrl || require('@/assets/logo.png')"
          alt="Product Image"
          class="w-full h-auto rounded-lg object-cover"
        />
      </div>

      <!-- Product Info -->
      <div class="md:w-1/2">
        <h1 class="text-3xl font-bold text-pink-600 mb-4">{{ product.title }}</h1>
       <p class="text-gray-700 mb-2">
  <span class="font-semibold text-gray-800">Category:</span>
  {{ product.category || product.type }}
</p>

        <p class="text-pink-500 font-bold mb-2">
          <span class="font-semibold text-gray-800">Price:</span> {{ product.price }} EGP
        </p>
        <p class="text-gray-700">
          <span class="font-semibold text-gray-800">Details:</span> {{ product.details }}
        </p>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-10 text-lg">Loading product...</div>
    <router-link
  to="/home"
  class="mt-6 inline-block text-pink-600 hover:underline text-sm"
>
  ← Back to Products
</router-link>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

const route = useRoute()
const product = ref(null)

const loadProduct = async () => {
  const id = route.params.id
  const docRef = doc(db, 'products', id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    product.value = docSnap.data()
  }
}

onMounted(loadProduct)
</script>
