<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-4">{{$t('yourRentals')}}</h1>
    <p class="text-gray-500 mb-8">{{$t('viewAllYourRentalBookings')}}</p>

    <div v-if="rentals.length" class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="rental in rentals"
        :key="rental.id"
        class="bg-white rounded-xl shadow p-4 border border-gray-200"
      >
        <img
          :src="rental.productImage || require('@/assets/logo.png')"
          alt="Product Image"
          class="h-48 w-full object-cover rounded-lg mb-4"
        />
        <h2 class="text-xl font-semibold mb-1">{{ rental.productTitle }}</h2>
        <p class="text-gray-700 mb-2">{{$t('rentedBy')}}: {{ rental.sellerName }}</p>
        <p class="text-gray-800 font-medium mb-1">{{$t('totalPrice')}}: {{ rental.totalPrice }} {{$t('egp')}}</p>
        <p class="text-gray-600 mb-2">{{$t('deliveryMethod')}}: {{ rental.deliveryMethod }}</p>
        <p class="text-gray-600 mb-2">{{$t('startDate')}}: {{ formatDate(rental.startDate) }}</p>
        <p class="text-gray-600 mb-2">{{$t('endDate')}}: {{ formatDate(rental.endDate) }}</p>
        <p class="text-gray-600 mb-2">{{$t('status')}}: {{$t(rental.status)}}</p>
      </div>
    </div>

    <div v-else class="text-center text-gray-600 mt-8">
      <p>No rentals found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '@/firebase/config';

const rentals = ref([]);

const fetchRentals = async () => {
  try {
    const rentalsRef = collection(db, 'bookings');
    const snapshot = await getDocs(rentalsRef);
    rentals.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching rentals:", error);
  }
};
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(fetchRentals);
</script>

<style scoped>
/* optional styles */
</style>
