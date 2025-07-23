<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-extrabold text-gray-800">Bookings for {{ userName }}</h1>
    <p class="text-gray-500 mt-1">List of all rentals for this user</p>

    <div v-if="loading" class="text-gray-600 mt-8 text-center">
      <p>Loading rentals...</p>
    </div>

    <div v-if="!loading && rentals.length" class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="rental in rentals"
        :key="rental.id"
        class="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 border border-gray-100 relative"
      >
        <!-- Image -->
        <img
          :src="rental.productImage || require('@/assets/logo.png')"
          alt="Product Image"
          class="h-48 w-full object-cover rounded-lg mb-4"
        />

        <!-- Title -->
        <h2 class="text-xl font-semibold text-gray-800">{{ rental.productTitle }}</h2>

        <!-- Price & Dates -->
        <p class="text-sm text-gray-600"><span class="font-medium">Total Price:</span> {{ rental.totalPrice }} EGP</p>
        <p class="text-sm text-gray-600"><span class="font-medium">Start Date:</span> {{ formatDate(rental.startDate) }}</p>
        <p class="text-sm text-gray-600"><span class="font-medium">End Date:</span> {{ formatDate(rental.endDate) }}</p>

        <!-- Status with color -->
        <p class="text-sm font-medium mt-2">
          Status:
          <span
            :class="[ 
              'px-2 py-1 rounded-full text-xs font-bold',
              rental.status === 'active' ? 'bg-green-100 text-green-700' :
              rental.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            ]"
          >
            {{ rental.status }}
          </span>
        </p>

        <!-- Actions -->
        <div class="flex justify-between items-center mt-4">
          <!-- Change Status -->
          <select
            v-model="rental.status"
            @change="updateStatus(rental.id, rental.status)"
            class="px-2 py-1 text-sm border rounded"
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <!-- Delete Booking -->
          <button
            @click="deleteRental(rental.id)"
            class="text-red-500 hover:text-red-700 text-sm font-semibold"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="text-gray-600 mt-8 text-center">
      <p>No rentals found for this user.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { collection, getDocs, query, where, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import Swal from 'sweetalert2'

const route = useRoute()
const userId = route.params.userId

const rentals = ref([])
const userName = ref('')
const loading = ref(true)

// Fetch rentals
const fetchUserRentals = async () => {
  try {
    const rentalsRef = collection(db, 'bookings')
    const q = query(rentalsRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)
    rentals.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error fetching rentals:", error)
    Swal.fire({ icon: 'error', title: 'Error fetching rentals', text: error.message })
  } finally {
    loading.value = false
  }
}

// Fetch user name
const fetchUserName = async () => {
  try {
    const userDocRef = doc(db, 'users', userId)
    const userDocSnap = await getDoc(userDocRef)
    if (userDocSnap.exists()) {
      userName.value = userDocSnap.data().displayName || 'User'
    } else {
      userName.value = 'User'
    }
  } catch (error) {
    console.error("Error fetching user name:", error)
    userName.value = 'User'
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Delete
const deleteRental = async (rentalId) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to cancel this booking?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, cancel it!',
    cancelButtonText: 'No, keep it'
  })

  if (result.isConfirmed) {
    try {
      await deleteDoc(doc(db, 'bookings', rentalId))
      rentals.value = rentals.value.filter(r => r.id !== rentalId)
      Swal.fire('Cancelled!', 'The booking has been cancelled.', 'success')
    } catch (error) {
      console.error("Error deleting rental:", error)
      Swal.fire({ icon: 'error', title: 'Error cancelling booking', text: error.message })
    }
  }
}

// Update Status
const updateStatus = async (rentalId, newStatus) => {
  try {
    await updateDoc(doc(db, 'bookings', rentalId), { status: newStatus })
    Swal.fire('Updated!', 'Booking status updated.', 'success')
  } catch (error) {
    console.error("Error updating status:", error)
    Swal.fire({ icon: 'error', title: 'Error updating status', text: error.message })
  }
}

onMounted(() => {
  fetchUserRentals()
  fetchUserName()
})
</script>

<style scoped>
/* Optional custom styling */
</style>
