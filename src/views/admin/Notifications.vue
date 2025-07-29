<template>
  <div class="min-h-screen p-8">
    <!-- Top Bar -->
    <TopBar title="Chat Data Display" searchPlaceholder="Search data?" @update:search="handleSearch"
      @update:sort="handleSort" @filter="handleFilter" />
    


    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
      <p class="mt-2 text-gray-600">Loading chat data...</p>
    </div>

    <!-- Data Stats -->
    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
    <div v-if="!loading" class="bg-white rounded-xl shadow border">
      <div class="p-6 border-b">
        <h2 class="text-xl font-semibold text-gray-800">Chat Data Records</h2>
        <p class="text-sm text-gray-600 mt-1">Showing {{ paginatedData.length }} of {{ filteredData.length }} records</p>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full divide-y">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detected At</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="data in paginatedData" :key="data.id" class="hover:bg-gray-50">
              <td class="px-4 py-4 text-sm text-gray-900">
                {{ getUserDisplayName(data.userId) }}
              </td>
              <td class="px-4 py-4">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  data.issue === 'phone number' ? 'bg-red-100 text-red-800' :
                  data.issue === 'email' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ data.issue || 'Unknown' }}
                </span>
              </td>
              <td class="px-4 py-4 text-xs text-gray-500">{{ formatDate(data.detectedAt || data.timestamp) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- No Data Fallback -->
      <div v-if="!paginatedData.length && !loading" class="text-gray-600 mt-8 text-center py-8">
        <i class="fas fa-comments text-4xl text-gray-300 mb-4"></i>
        <p class="text-lg font-medium mb-2">No chat data found</p>
        <p class="text-sm text-gray-500">Try adding test data or check your filters</p>
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
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, limit, getDoc, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Swal from 'sweetalert2';
import { useNotifications } from '@/composables/useNotifications';

// Initialize notifications composable
const { } = useNotifications();

// Reactive data
const chatData = ref([]);
const users = ref({}); // Store user data by userId
const searchQuery = ref('');
const sortOption = ref('Newest First');
const filterStatus = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const loading = ref(false);

// Computed properties
const filteredData = computed(() => {
  let filtered = chatData.value;
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(data =>
      getUserDisplayName(data.userId).toLowerCase().includes(query) ||
      (data.issue || '').toLowerCase().includes(query)
    );
  }
  
  // Filter by issue type
  if (filterStatus.value) {
    filtered = filtered.filter(data => data.issue === filterStatus.value);
  } else {
    // Only show phone number and email issues, filter out others
    filtered = filtered.filter(data => data.issue === 'phone number' || data.issue === 'email');
  }
  
  // Sort data
  filtered = [...filtered].sort((a, b) => {
    if (sortOption.value === 'Newest First') {
      return new Date(b.detectedAt || b.timestamp) - new Date(a.detectedAt || a.timestamp);
    } else {
      return new Date(a.detectedAt || a.timestamp) - new Date(b.detectedAt || b.timestamp);
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

const getUserDisplayName = (userId) => {
  if (!userId) return 'Unknown User';
  
  const user = users.value[userId];
  if (user) {
    return user.displayName || user.email || user.name || 'Unknown User';
  }
  
  // If user data is not loaded yet, trigger loading
  getUserInfo(userId);
  return 'Loading...';
};

const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1;
};

const handleSort = (option) => {
  sortOption.value = option;
  currentPage.value = 1;
};

const handleFilter = () => {
  Swal.fire({
    title: 'Filter by Issue Type',
    input: 'select',
    inputOptions: {
      'phone number': 'Phone Number',
      'email': 'Email'
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



// Initialize real-time listeners
let unsubscribeData = null;

const initializeRealTimeData = () => {
  // Listen to warnings collection
  const dataQuery = query(
    collection(db, 'warnings'),
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
  }, (error) => {
    console.error('Error listening to warnings data:', error);
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