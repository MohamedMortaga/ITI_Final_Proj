<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-center text-pink-600">Admin Dashboard - Products</h1>

    <!-- Add / Edit Form -->
    <form @submit.prevent="submitForm" class="bg-white p-4 rounded-xl shadow-md mb-6">
      <h2 class="text-xl font-semibold mb-4">{{ isEdit ? 'Edit Product' : 'Add New Product' }}</h2>
      
      <input v-model="form.title" type="text" placeholder="Title" class="input" />
      <input v-model="form.type" type="text" placeholder="Type" class="input" />
      <input v-model="form.price" type="number" placeholder="Price" class="input" />
      <textarea v-model="form.details" placeholder="Details" class="input"></textarea>

      <button type="submit" class="bg-pink-600 text-white py-2 px-4 rounded mt-2">
        {{ isEdit ? 'Update Product' : 'Add Product' }}
      </button>
    </form>

    <!-- Products List -->
    <div v-if="products.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="product in products" :key="product.id" class="bg-white p-4 rounded-xl shadow-md">
        <h3 class="font-bold text-pink-600 text-lg">{{ product.title }}</h3>
        <p><strong>Type:</strong> {{ product.type }}</p>
        <p><strong>Price:</strong> {{ product.price }}</p>
        <p><strong>Details:</strong> {{ product.details }}</p>

        <div class="flex gap-2 mt-3">
          <button @click="editProduct(product)" class="text-blue-600">Edit</button>
          <button @click="deleteProduct(product.id)" class="text-red-600">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, addDoc, deleteDoc, updateDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/config'

const products = ref([])
const form = ref({ title: '', type: '', price: '', details: '' })
const isEdit = ref(false)
let editId = null

const loadProducts = async () => {
  const snapshot = await getDocs(collection(db, 'products'))
  products.value = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
}

const submitForm = async () => {
  if (isEdit.value) {
    const docRef = doc(db, 'products', editId)
    await updateDoc(docRef, form.value)
  } else {
    await addDoc(collection(db, 'products'), form.value)
  }
  resetForm()
  loadProducts()
}

const editProduct = (product) => {
  form.value = { title: product.title, type: product.type, price: product.price, details: product.details }
  isEdit.value = true
  editId = product.id
}

const deleteProduct = async (id) => {
  await deleteDoc(doc(db, 'products', id))
  loadProducts()
}

const resetForm = () => {
  form.value = { title: '', type: '', price: '', details: '' }
  isEdit.value = false
  editId = null
}

onMounted(loadProducts)
</script>

<style scoped>
.input {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
</style>
