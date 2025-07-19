<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-extrabold text-gray-800">Rentals for {{ userName }}</h1>
    <p class="text-gray-500 mt-1">List of all rentals for this user.</p>

    <div v-if="rentals.length" class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="rental in rentals"
        :key="rental.id"
        class="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 border border-gray-100"
      >
              <img
          :src="rental.productImage || require('@/assets/logo.png')"
          alt="Product Image"
          class="h-48 w-full object-cover rounded-lg mb-4"
        />
        <h2 class="text-xl font-semibold text-gray-800">{{ rental.productTitle }}</h2>
        <p class="text-sm text-gray-600"><span class="font-medium">Total Price:</span> {{ rental.totalPrice }} EGP</p>
        <p class="text-sm text-gray-600"><span class="font-medium">Start Date:</span> {{ formatDate(rental.startDate) }}</p>
        <p class="text-sm text-gray-600"><span class="font-medium">End Date:</span> {{ formatDate(rental.endDate) }}</p>
        <p class="text-sm text-gray-600"><span class="font-medium">Status:</span> {{ rental.status }}</p>
      </div>
    </div>

    <div v-else class="text-gray-600 mt-8 text-center">
      <p>No rentals found for this user.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

const route = useRoute()
const userId = route.params.userId

const rentals = ref([])
const userName = ref('') // Optional: To display user's name if you want

// Fetch all rentals (bookings) for the specified userId
const fetchUserRentals = async () => {
  const rentalsRef = collection(db, 'bookings')
  const q = query(rentalsRef, where('userId', '==', userId))
  const snapshot = await getDocs(q)
  rentals.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// Optionally, fetch user's display name from the users collection
const fetchUserName = async () => {
  const userDocRef = doc(db, 'users', userId)
  const userDocSnap = await getDoc(userDocRef)
  if (userDocSnap.exists()) {
    userName.value = userDocSnap.data().displayName || 'User'
  } else {
    userName.value = 'User'
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(() => {
  fetchUserRentals()
  fetchUserName()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
