<template>
  <div class="min-h-screen p-8">
    <!-- Top Bar -->
    <TopBar title="Chat Data Display" searchPlaceholder="Search data?" @update:search="handleSearch"
      @update:sort="handleSort" @filter="handleFilter" />
    
    <!-- Add Test Data Button -->
    <div class="mb-6">
      <button @click="addTestData" 
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
        <i class="fas fa-plus mr-2"></i>
        Add Test Data
      </button>
    </div>

    <!-- Data Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <i class="fas fa-comments text-blue-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Records</p>
            <p class="text-2xl font-bold text-gray-900">{{ chatData.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <i class="fas fa-user text-green-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Unique Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ uniqueUsersCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100">
            <i class="fas fa-exclamation-triangle text-yellow-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Issues Detected</p>
            <p class="text-2xl font-bold text-gray-900">{{ issuesCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-red-100">
            <i class="fas fa-phone text-red-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Phone Numbers</p>
            <p class="text-2xl font-bold text-gray-900">{{ phoneNumbersCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Data Table -->
    <div class="bg-white rounded-xl shadow border">
      <div class="p-6 border-b">
        <h2 class="text-xl font-semibold text-gray-800">Chat Data Records</h2>
      </div>
      
            <div class="overflow-hidden">
        <table class="w-full divide-y">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">User</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Issue</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Content</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Chat ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Time</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="data in paginatedData" :key="data.id" class="hover:bg-gray-50">
              <td class="px-4 py-4">
                <div class="flex items-center">
                  <img :src="users[data.userId]?.imageUrl || require('@/assets/default.png')" 
                       class="h-8 w-8 rounded-full object-cover" />
                  <div class="ml-3 min-w-0 flex-1">
                    <div class="text-sm font-medium text-gray-900 truncate">{{ users[data.userId]?.displayName || 'Unknown User' }}</div>
                    <div class="text-xs text-gray-500 truncate">{{ data.userId }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  data.issue === 'phone number' ? 'bg-red-100 text-red-800' :
                  data.issue === 'email' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                ]">
                  {{ data.issue || 'Unknown' }}
                </span>
              </td>
              <td class="px-4 py-4">
                <div class="text-sm text-gray-900 truncate">{{ data.content || 'N/A' }}</div>
              </td>
              <td class="px-4 py-4">
                <div class="text-xs text-gray-500 font-mono truncate">{{ data.chatId ? data.chatId.slice(0, 15) + '...' : 'N/A' }}</div>
              </td>
              <td class="px-4 py-4">
                <div class="text-xs text-gray-500">{{ formatDate(data.detectedAt) }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- No Data Fallback -->
      <div v-if="!paginatedData.length" class="text-gray-600 mt-8 text-center py-8">
        <i class="fas fa-comments text-4xl text-gray-300 mb-4"></i>
        <p>No chat data found.</p>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-6 py-3 border-t">
        <button class="text-gray-500 flex items-center" :disabled="currentPage === 1" @click="currentPage--">
          <i class="fas fa-chevron-left mr-1"></i> Previous
        </button>
        <div class="flex items-center space-x-2">
          <button v-for="page in totalPages" :key="page" class="w-8 h-8 rounded"
            :class="{ 'bg-teal-500 text-white': currentPage === page, 'hover:bg-gray-200 text-gray-700': currentPage !== page }"
            @click="currentPage = page">
            {{ page }}
          </button>
        </div>
        <button class="text-gray-500 flex items-center" :disabled="currentPage === totalPages" @click="currentPage++">
          Next <i class="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopBar from '@/components/admin/TopBar.vue';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, limit, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Swal from 'sweetalert2';
import { useNotifications } from '@/composables/useNotifications';

// Initialize notifications composable
const { addUserNotificationData } = useNotifications();

// Reactive data
const chatData = ref([]);
const users = ref({}); // Store user data by userId
const searchQuery = ref('');
const sortOption = ref('Newest First');
const filterStatus = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

// Computed properties
const filteredData = computed(() => {
  let filtered = chatData.value;
  
  if (searchQuery.value) {
    filtered = filtered.filter(data =>
      (users.value[data.userId]?.displayName || 'Unknown User').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (data.content || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (data.issue || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (data.chatId || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  filtered = [...filtered].sort((a, b) => {
    if (sortOption.value === 'Newest First') {
      return new Date(b.detectedAt) - new Date(a.detectedAt);
    } else {
      return new Date(a.detectedAt) - new Date(b.detectedAt);
    }
  });
  
  return filtered;
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage);
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredData.value.slice(start, start + itemsPerPage);
});

const uniqueUsersCount = computed(() => {
  const uniqueUsers = new Set(chatData.value.map(n => n.userId));
  return uniqueUsers.size;
});

const issuesCount = computed(() => {
  return chatData.value.length;
});

const phoneNumbersCount = computed(() => {
  return chatData.value.filter(n => n.issue === 'phone number').length;
});

// Methods
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getUserInfo = async (userId) => {
  if (users.value[userId]) {
    return users.value[userId];
  }
  
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      users.value[userId] = userData;
      return userData;
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
  
  return null;
};

const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1;
};

const handleSort = (option) => {
  sortOption.value = option;
};

const handleFilter = () => {
  Swal.fire({
    title: 'Filter by Issue Type',
    input: 'select',
    inputOptions: {
      'phone number': 'Phone Number',
      'email': 'Email',
      'other': 'Other'
    },
    inputPlaceholder: 'Select issue type',
    showCancelButton: true,
    confirmButtonText: 'Apply',
  }).then(result => {
    if (result.isConfirmed) {
      filterStatus.value = result.value || '';
      currentPage.value = 1;
    }
  });
};

const addTestData = async () => {
  try {
    await addUserNotificationData();
    Swal.fire({
      icon: 'success',
      title: 'Test Data Added',
      text: 'The chat data has been added successfully.',
      timer: 2000,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Error adding test data:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to add test data.',
    });
  }
};

// Initialize real-time listeners
let unsubscribeData = null;

const initializeRealTimeData = () => {
  // Listen to notifications collection (we'll use this for chat data)
  const dataQuery = query(
    collection(db, 'notifications'),
    orderBy('timestamp', 'desc'),
    limit(100)
  );
  
  unsubscribeData = onSnapshot(dataQuery, (snapshot) => {
    chatData.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Fetch user info for new data
    chatData.value.forEach(async (data) => {
      if (!users.value[data.userId]) {
        await getUserInfo(data.userId);
      }
    });
  });
};

// Lifecycle
onMounted(() => {
  initializeRealTimeData();
});

onBeforeUnmount(() => {
  if (unsubscribeData) {
    unsubscribeData();
  }
});
</script> 