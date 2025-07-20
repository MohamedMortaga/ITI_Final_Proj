<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-4">📦 Product Management</h1>
    <p class="text-gray-500 mb-8">View all uploaded products with details</p>

    <div v-if="products.length" class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-xl shadow p-4 border border-gray-200"
      >
        <img
          :src="product.img"
          alt="Product image"
          class="h-48 w-full object-cover rounded-lg mb-4"
        />
        <h2 class="text-xl font-semibold mb-1">{{ product.title }}</h2>
        <p class="text-gray-700 mb-2">{{ product.details }}</p>
        <p class="text-gray-800 font-medium mb-1">💰 Price: {{ product.price }} EGP</p>
        
        <!-- Category -->
        <p class="text-sm text-gray-700">🏷️ Category: {{ product.category || 'Not specified' }}</p>

        <!-- Owner -->
     
<!-- Uploaded By -->
<p class="text-sm text-gray-600">👤 Uploaded by: {{ product.ownerName || 'Unknown' }}</p>



        <!-- Uploaded time -->
        <p class="text-sm text-gray-500">
          🕒 Uploaded:
          <span v-if="product.createdAt && product.createdAt.toDate">
            {{ product.createdAt.toDate().toLocaleString() }}
          </span>
          <span v-else>Unknown</span>
        </p>

        <!-- Delete Button -->
        <div class="mt-4">
          <button
            @click="deleteProduct(product.id)"
            class="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-600 mt-8">
      <p>No products available currently.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config';
import Swal from 'sweetalert2';

const products = ref([]);
const users = ref({});

// const fetchProducts = async () => {
//   try {
//     const snapshot = await getDocs(collection(db, 'products'));
//     products.value = snapshot.docs.map(doc => ({
      
//       id: doc.id,
//       ...doc.data()
//     }));
//     await fetchUsers();
//   } catch (err) {
//     console.error('Failed to load products:', err);
//   }
// };
const fetchProducts = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    const allProducts = snapshot.docs.map(doc => {
      const data = doc.data();


      console.log('🕒 Time (createdAt):', data.createdAt?.toDate?.() || 'Unknown');
      console.log('👤 Owner ID:', data.userId || 'No owner ID');

      return {
        id: doc.id,
        ...data
      };
    });

    products.value = allProducts;
    await fetchUsers();

   
    allProducts.forEach(product => {
      const owner = users.value[product.userId];
      console.log('🧑‍💻 Owner Name:', owner?.name || 'Unknown');
      console.log('📧 Owner Email:', owner?.email || 'Unknown');
    });

  } catch (err) {
    console.error('Failed to load products:', err);
  }
};

const fetchUsers = async () => {
  try {
    const userSnapshot = await getDocs(collection(db, 'users'));
    userSnapshot.docs.forEach(doc => {
      users.value[doc.id] = doc.data();
    });
  } catch (err) {
    console.error('Failed to load users:', err);
  }
};

const deleteProduct = async (productId) => {
  const confirm = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this product?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  });

  if (confirm.isConfirmed) {
    try {
      await deleteDoc(doc(db, 'products', productId));
      products.value = products.value.filter(product => product.id !== productId);
      Swal.fire('Deleted!', 'Product has been deleted.', 'success');
    } catch (err) {
      console.error('Failed to delete product:', err);
      Swal.fire('Error!', 'There was an error deleting the product.', 'error');
    }
  }
};

onMounted(fetchProducts);
</script>
