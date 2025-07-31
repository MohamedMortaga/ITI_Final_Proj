<template>
  <div class="min-h-screen p-8">
    <!-- Top Bar -->
     <TopBar
      title="All Products"
      searchPlaceholder="Search Products?"
      @update:search="handleSearch"
      @update:sort="handleSort"
      @filter="handleFilter"
    />

    <!-- Products Table -->
    <div class="bg-white rounded-xl shadow  border border-gray-50">
      <table class="min-w-full divide-y">
        <thead>
          <tr>
            <th class="px-4 py-3">
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
            </th>
            <th class="px-4 py-3">Photo</th>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Price</th>
            <th class="px-4 py-3">Category</th>
            <th class="px-4 py-3">Uploaded by</th>
            <th class="px-4 py-3">Uploaded at</th>
            <th class="px-4 py-3">
              <i class="fas fa-ellipsis-v"></i>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in filteredProducts"
            :key="product.id"
            class="hover:bg-gray-25"
          >
            <td class="px-4 py-3 text-center">
              <input type="checkbox" v-model="selectedProducts" :value="product.id" />
            </td>
            <td class="px-4 py-3">
              <img
                :src="product.image1"
                alt="Product Image"
                class="w-16 h-16 object-cover rounded"
              />
            </td>
            <td class="px-4 py-3 font-medium">
              {{ product.title }}
            </td>
            <td class="px-4 py-3">
              ${{ product.price }}
            </td>
            <td class="px-4 py-3">
              {{ product.category || 'Not set' }}
            </td>
            <td class="px-4 py-3">
              {{ product.ownerName || 'Unknown' }}
            </td>
            <td class="px-4 py-3">
              <span v-if="product.createdAt && product.createdAt.toDate">
                {{ product.createdAt.toDate().toLocaleString() }}
              </span>
              <span v-else>Unknown</span>
            </td>
            <td class="px-4 py-3 flex items-center space-x-2 justify-center">
              <button
                @click="deleteProduct(product.id)"
                class="text-red-500 hover:text-red-700"
                title="Delete"
              >
                <i class="fas fa-trash"></i>
              </button>
              <button
                v-if="product.isApproved !== true"
                @click="approveProduct(product.id)"
                class="text-green-500 hover:text-green-700"
                title="Approve"
              >
                <i class="fas fa-check"></i>
              </button>
         <button
  v-if="product.isApproved === true"
  @click="disapproveProduct(product.id)"
  class="text-yellow-500 hover:text-yellow-700"
  title="Unapprove"
>
  <i class="fas fa-times"></i>
</button>

            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination -->
              <div class="flex items-center justify-between px-4 py-3 border-t border-gray-50">
        <button
          class="text-gray-500 flex items-center"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <i class="fas fa-chevron-left mr-1"></i> Previous
        </button>
        <div class="flex items-center space-x-2">
          <button
            v-for="page in totalPages"
            :key="page"
            class="w-8 h-8 rounded"
            :class="{ 'bg-teal-500 text-white': currentPage === page, 'hover:bg-gray-200': currentPage !== page }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </div>
        <button
          class="text-gray-500 flex items-center"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next <i class="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopBar from '@/components/admin/TopBar.vue';
import { ref, computed, onMounted } from 'vue';
import {
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { useAdminRealTime } from '@/composables/useAdminRealTime';

// Initialize real-time data
const { products, users, initializeRealTimeData, cleanup } = useAdminRealTime();

const searchQuery = ref('');
const sortOption = ref('Name A → Z');
const filterCategory = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const selectedProducts = ref([]);
const selectAll = ref(false);
const disapproveProduct = async (id) => {
  try {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, { isApproved: false });
    await fetchProducts(); 
    Swal.fire("Product has been successfully removed from the website ✅");
  } catch (error) {
    console.error("Failed to disapprove product:", error);
    Swal.fire("An error occurred while removing the product ❌");
  }
};


const unapproveProduct = async (productId) => {
  try {
    await updateDoc(doc(db, 'products', productId), {
      isApproved: false,
    });
    await fetchProducts();
    Swal.fire('Updated!', 'Product has been marked as not approved.', 'info');
  } catch (err) {
    console.error('Failed to unapprove product:', err);
    Swal.fire('Error!', 'There was an error updating the product.', 'error');
  }
};

const filteredProducts = computed(() => {
  let filtered = products.value;

  // Search
  if (searchQuery.value) {
    filtered = filtered.filter(product =>
      product.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Filter by category (example: assuming category is a field in products)
  if (filterCategory.value) {
    filtered = filtered.filter(product =>
      product.category?.toLowerCase() === filterCategory.value.toLowerCase()
    );
  }

  // Sort by upload time (newest first) and then by name
  filtered = [...filtered].sort((a, b) => {
    // First sort by creation date (newest first)
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
    
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    
    // If dates are equal, sort by name
    return a.title.localeCompare(b.title);
  });

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage;
  return filtered.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(products.value.length / itemsPerPage);
});


// Users map for easy lookup
const usersMap = computed(() => {
  const map = {};
  users.value.forEach(user => {
    map[user.id] = user;
  });
  return map;
});

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

const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1; // Reset to first page on search
};

const handleSort = (sortData) => {
  // The sorting is handled in the computed filteredProducts
  console.log('Sort data:', sortData);
};

const handleFilter = () => {
  // Example: Open a modal or prompt to select a category
  Swal.fire({
    title: 'Filter by Category',
    input: 'text',
    inputPlaceholder: 'Enter category name',
    showCancelButton: true,
    confirmButtonText: 'Apply',
  }).then(result => {
    if (result.isConfirmed) {
      filterCategory.value = result.value || '';
      currentPage.value = 1; // Reset to first page on filter
    }
  });
};

const handleExport = () => {
  const data = products.value.map(product => ({
    ID: product.id,
    Name: product.title,
    Price: product.price,
    Category: product.category || 'Not set',
    'Uploaded by': product.ownerName || 'Unknown',
    'Uploaded at': product.createdAt?.toDate().toLocaleString() || 'Unknown',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
  XLSX.writeFile(workbook, 'products.xlsx');
};



const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedProducts.value = filteredProducts.value.map(product => product.id);
  } else {
    selectedProducts.value = [];
  }
};

onMounted(() => {
  initializeRealTimeData();
});
</script>

<style scoped>
/* Add any additional styles if needed */
</style>