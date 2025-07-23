<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-4">Your Rentals</h1>
    <p class="text-gray-500 mb-8">View all your rental bookings</p>

    <div v-if="rentals.length" class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="rental in rentals"
        :key="rental.id"
        class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-5 border border-gray-200"
      >
        <!-- Image -->
        <img
          :src="rental.productImage || require('@/assets/logo.png')"
          alt="Product Image"
          class="h-48 w-full object-cover rounded-lg mb-4"
        />

        <!-- Info -->
        <h2 class="text-xl font-semibold mb-1">{{ rental.productTitle }}</h2>
        <p class="text-gray-700 mb-2">Rented by: {{ rental.sellerName }}</p>
        <p class="text-gray-800 font-medium mb-1">Total Price: {{ rental.totalPrice }} EGP</p>
        <p class="text-gray-600 mb-1">Delivery: {{ rental.deliveryMethod }}</p>
        <p class="text-gray-600 mb-1">Start Date: {{ formatDate(rental.startDate) }}</p>
        <p class="text-gray-600 mb-1">End Date: {{ formatDate(rental.endDate) }}</p>
        <p class="text-gray-600 mb-2">
          Status:
          <span
            :class="[
              'font-semibold px-2 py-1 rounded text-xs',
              rental.status === 'active' ? 'bg-green-100 text-green-700' :
              rental.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            ]"
          >
            {{ rental.status }}
          </span>
        </p>

        <!-- Actions -->
        <div class="flex justify-between items-center mt-4 gap-2">
          <!-- Change Status -->
          <select
            v-model="rental.status"
            @change="updateStatus(rental.id, rental.status)"
            class="text-sm border rounded px-2 py-1"
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
          </select>



          <!-- Delete -->
          <button
            @click="deleteRental(rental.id)"
            class="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-600 mt-8">
      <p>No rentals found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Swal from 'sweetalert2';

const rentals = ref([]);

const fetchRentals = async () => {
  try {
    const rentalsRef = collection(db, 'bookings');
    const snapshot = await getDocs(rentalsRef);
    rentals.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching rentals:', error);
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Update status
const updateStatus = async (rentalId, newStatus) => {
  try {
    await updateDoc(doc(db, 'bookings', rentalId), { status: newStatus });
    Swal.fire('Updated', 'Booking status updated successfully.', 'success');
  } catch (error) {
    console.error('Error updating status:', error);
    Swal.fire('Error', 'Failed to update status.', 'error');
  }
};

// Delete rental
const deleteRental = async (rentalId) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This booking will be deleted permanently.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    try {
      await deleteDoc(doc(db, 'bookings', rentalId));
      rentals.value = rentals.value.filter(r => r.id !== rentalId);
      Swal.fire('Deleted', 'Booking deleted successfully.', 'success');
    } catch (error) {
      console.error('Error deleting rental:', error);
      Swal.fire('Error', 'Failed to delete booking.', 'error');
    }
  }
};



onMounted(fetchRentals);
</script>

<style scoped>
/* You can enhance styles here if needed */
</style>
