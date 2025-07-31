<template>
  <div class="min-h-screen p-8">
    <!-- Top Bar -->
    <TopBar
      title="Latest Product Added"
      searchPlaceholder="Search Products?"
      @update:search="handleSearch"
      @update:sort="handleSort"
      @filter="handleFilter"
    />

    <!-- Latest Product Display -->
    <div v-if="latestProduct" class="bg-white rounded-xl shadow border p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Latest Product</h2>
        <span class="text-sm text-gray-500">
          Added {{ formatUploadTime(latestProduct.createdAt) }}
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Product Image -->
        <div class="space-y-4">
          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              :src="latestProduct.image1"
              alt="Latest Product"
              class="w-full h-32 object-cover rounded-lg"
            />
          </div>
          
          <!-- Product Actions -->
          <div class="flex space-x-3">
            <button
              @click="deleteProduct(latestProduct.id)"
              class="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              <i class="fas fa-trash mr-2"></i>
              Delete Product
            </button>
            
            <button
              v-if="latestProduct.isApproved !== true"
              @click="approveProduct(latestProduct.id)"
              class="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              <i class="fas fa-check mr-2"></i>
              Approve Product
            </button>
            
            <button
              v-if="latestProduct.isApproved === true"
              @click="disapproveProduct(latestProduct.id)"
              class="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
            >
              <i class="fas fa-times mr-2"></i>
              Unapprove Product
            </button>
          </div>
        </div>

        <!-- Product Details -->
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              {{ latestProduct.title }}
            </h3>
            <p class="text-3xl font-bold text-teal-600">
              ${{ latestProduct.price }}
            </p>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b">
              <span class="font-medium text-gray-600">Category:</span>
              <span class="text-gray-800">{{ latestProduct.category || 'Not set' }}</span>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b">
              <span class="font-medium text-gray-600">Uploaded by:</span>
              <span class="text-gray-800">{{ latestProduct.ownerName || 'Unknown' }}</span>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b">
              <span class="font-medium text-gray-600">Status:</span>
              <span 
                :class="latestProduct.isApproved ? 'text-green-600' : 'text-yellow-600'"
                class="font-medium"
              >
                {{ latestProduct.isApproved ? 'Approved' : 'Pending Approval' }}
              </span>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b">
              <span class="font-medium text-gray-600">Upload Date:</span>
              <span class="text-gray-800">
                {{ formatFullDate(latestProduct.createdAt) }}
              </span>
            </div>
          </div>

          <!-- Product Description -->
          <div v-if="latestProduct.description">
            <h4 class="font-medium text-gray-600 mb-2">Description:</h4>
            <p class="text-gray-800 leading-relaxed">
              {{ latestProduct.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Products Message -->
    <div v-else class="bg-white rounded-xl shadow border p-8 text-center">
      <div class="text-gray-400 mb-4">
        <i class="fas fa-box-open text-6xl"></i>
      </div>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
      <p class="text-gray-500">There are no products in the system yet.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAdminRealTime } from '@/composables/useAdminRealTime';
import TopBar from '@/components/admin/TopBar.vue';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Swal from 'sweetalert2';

// Initialize real-time data
const { products, initializeRealTimeData } = useAdminRealTime();

// Get the latest product (most recently added)
const latestProduct = computed(() => {
  if (!products.value || products.value.length === 0) return null;
  
  // Sort by createdAt in descending order and get the first one
  return products.value
    .filter(product => product.createdAt)
    .sort((a, b) => {
      const dateA = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA;
    })[0] || null;
});

const formatUploadTime = (timestamp) => {
  if (!timestamp) return 'Unknown';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

const formatFullDate = (timestamp) => {
  if (!timestamp) return 'Unknown';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString();
};

const deleteProduct = async (productId) => {
  const confirm = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this product?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (confirm.isConfirmed) {
    try {
      await deleteDoc(doc(db, 'products', productId));
      Swal.fire('Deleted!', 'Product has been deleted.', 'success');
    } catch (err) {
      console.error('Failed to delete product:', err);
      Swal.fire('Error!', 'There was an error deleting the product.', 'error');
    }
  }
};

const approveProduct = async (productId) => {
  try {
    await updateDoc(doc(db, 'products', productId), {
      isApproved: true,
    });
    Swal.fire('Approved!', 'Product has been approved.', 'success');
  } catch (err) {
    console.error('Failed to approve product:', err);
    Swal.fire('Error!', 'There was an error approving the product.', 'error');
  }
};

const disapproveProduct = async (productId) => {
  try {
    await updateDoc(doc(db, 'products', productId), {
      isApproved: false,
    });
    Swal.fire('Updated!', 'Product has been marked as not approved.', 'info');
  } catch (err) {
    console.error('Failed to disapprove product:', err);
    Swal.fire('Error!', 'There was an error updating the product.', 'error');
  }
};

const handleSearch = (query) => {
  // Search functionality can be implemented if needed
  console.log('Search:', query);
};

const handleSort = (option) => {
  // Sort functionality can be implemented if needed
  console.log('Sort:', option);
};

const handleFilter = () => {
  // Filter functionality can be implemented if needed
  console.log('Filter');
};

onMounted(() => {
  initializeRealTimeData();
});
</script>

<style scoped>
/* Add any additional styles if needed */
</style> 