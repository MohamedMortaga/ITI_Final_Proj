<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <h1 class="text-4xl font-extrabold mb-10 text-gray-800 tracking-wide text-center">Category Management</h1>

    <!-- Add Category Form -->
    <form
      @submit.prevent="addCategory"
      class="max-w-lg mx-auto mb-12 bg-white rounded-lg shadow-lg p-8 flex gap-4 items-center"
    >
      <input
        v-model="newCategory.name"
        type="text"
        placeholder="Enter new category name"
        class="flex-grow border border-gray-300 rounded-md px-4 py-3 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <button
        type="submit"
        class="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:from-green-500 hover:to-blue-600 transition duration-200"
      >
        Add Category
      </button>
    </form>

    <!-- Categories Grid -->
    <div class="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition cursor-pointer"
      >
        <h3 class="text-2xl font-semibold text-gray-900 mb-4 select-none">{{ cat.name }}</h3>
        <button
          @click="deleteCategory(cat.id)"
          class="self-end text-red-600 hover:text-red-800 text-2xl transition duration-200"
          title="Delete Category"
          aria-label="Delete Category"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/config'
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore'

const newCategory = ref({ name: '' })
const categories = ref([])

const fetchCategories = () => {
  const colRef = collection(db, 'categories')
  onSnapshot(colRef, (snapshot) => {
    categories.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
}

const addCategory = async () => {
  if (!newCategory.value.name.trim()) return

  await addDoc(collection(db, 'categories'), {
    name: newCategory.value.name.trim(),
  })

  newCategory.value.name = ''
}

const deleteCategory = async (id) => {
  await deleteDoc(doc(db, 'categories', id))
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
/* You can add custom CSS here if needed */
</style>