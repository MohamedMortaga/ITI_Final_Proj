<template>
  <div class="min-h-screen p-8">
    <!-- Top Bar -->
    <TopBar
      :title="$t('userManagement')"
      :searchPlaceholder="$t('searchUsers')"
      @update:search="handleSearch"
      @update:sort="handleSort"
      @filter="handleFilter"
    />

    <!-- Users Table -->
          <div class="bg-white rounded-xl shadow border border-gray-50">
      <table class="min-w-full divide-y divide-gray-50">
        <thead>
          <tr>
            <th class="px-4 py-3">{{$t('name')}}</th>
            <th class="px-4 py-3">{{$t('email')}}</th>
            <th class="px-4 py-3">{{$t('role')}}</th>
            <th class="px-4 py-3">{{$t('createdAt')}}</th>
            <th class="px-4 py-3">{{$t('status')}}</th>
            <th class="px-4 py-3 text-center"><i class="fas fa-ellipsis-v"></i></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50 cursor-pointer" @click="goToUserRentals(user.id)">
            <td class="px-4 py-3 font-medium">{{ user.displayName || $t('unknownUser') }}</td>
            <td class="px-4 py-3">{{ user.email }}</td>
            <td class="px-4 py-3">{{ user.role || $t('notSet') }}</td>
            <td class="px-4 py-3">
              <span v-if="user.createdAt">
                {{ formatCreatedAt(user.createdAt) }}
              </span>
              <span v-else>{{$t('notAvailable')}}</span>
            </td>
            <td class="px-4 py-3">
              <span :class="user.blocked ? 'text-red-500' : 'text-green-500'">
                {{ user.blocked ? $t('blocked') : $t('active') }}
              </span>
            </td>
            <td class="px-4 py-3 flex items-center space-x-2 justify-center" @click.stop>
              <button
                @click="editUser(user)"
                class="text-yellow-500 hover:text-yellow-600"
                title="{{$t('editRole')}}"
              >
                <i class="fas fa-user-edit"></i>
              </button>
              <button
                @click="deleteUser(user.id)"
                class="text-red-500 hover:text-red-700"
                title="{{$t('delete')}}"
              >
                <i class="fas fa-trash"></i>
              </button>
              <button
                @click="toggleBlockUser(user)"
                :class="user.blocked ? 'text-green-500 hover:text-green-700' : 'text-[var(--Colors-Gray-400)] hover:text-[var(--Colors-Gray-600)]'"
                :title="user.blocked ? $t('unblock') : $t('block')"
              >
                <i :class="user.blocked ? 'fas fa-unlock' : 'fas fa-ban'"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- No Users Fallback -->
      <div v-if="!paginatedUsers.length" class="text-gray-600 mt-8 text-center">
        <p>{{$t('noUsersFound')}}</p>
      </div>
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-50">
        <button
          class="text-gray-500 flex items-center"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <i class="fas fa-chevron-left mr-1"></i> {{$t('previous') || 'Previous'}}
        </button>
        <div class="flex items-center space-x-2">
          <button
            v-for="page in totalPages"
            :key="page"
            class="w-8 h-8 rounded"
            :class="{ 'bg-teal-500 text-white': currentPage === page, 'hover:bg-gray-200 text-gray-700': currentPage !== page }"
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
          {{$t('next') || 'Next'}} <i class="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>

    <!-- Edit Role Modal -->
    <div
      v-if="selectedUser"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
        <h2 class="text-lg font-semibold text-gray-800">{{$t('editRole')}} {{$t('for')}} {{ selectedUser.displayName }}</h2>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Select Role:</label>
          <select
            v-model="updatedRole"
                            class="w-full border border-gray-50 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div class="flex justify-end gap-2">
          <button 
            @click="selectedUser = null" 
                            class="px-4 py-2 text-gray-500 hover:text-gray-700 border border-gray-50 rounded-md hover:bg-gray-50"
          >
            {{$t('cancel')}}
          </button>
          <button
            @click="updateRole"
            :disabled="!updatedRole"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{$t('save')}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopBar from '@/components/admin/TopBar.vue'
import { ref, computed, onMounted } from 'vue'
import { doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useAdminRealTime } from '@/composables/useAdminRealTime'

const router = useRouter()

const goToUserRentals = (userId) => {
  router.push({ name: 'UserRentals', params: { userId } })
}

// Initialize real-time data
const { users, initializeRealTimeData, cleanup } = useAdminRealTime()

const selectedUser  = ref(null)
const updatedRole = ref('')

const searchQuery = ref('')
const sortOption = ref('Newest First')
const filterRole = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const deleteUser  = async (userId) => {
  const confirm = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this user?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  })

  if (confirm.isConfirmed) {
    await deleteDoc(doc(db, 'users', userId))
    users.value = users.value.filter(user => user.id !== userId)
    Swal.fire('Deleted!', 'User  has been deleted.', 'success')
  }
}

const editUser = (user) => {
  selectedUser.value = user;
  // Set the current role or empty string if no role is set
  updatedRole.value = user.role || '';
}

const updateRole = async () => {
  if (!selectedUser.value) return;
  
  if (!updatedRole.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Role Required',
      text: 'Please select a role for this user.',
    });
    return;
  }

  try {
    const userRef = doc(db, 'users', selectedUser.value.id);
    await updateDoc(userRef, { role: updatedRole.value });
    
    // Update the local user data
    selectedUser.value.role = updatedRole.value;
    
    // Close modal and show success message
    selectedUser.value = null;
    updatedRole.value = '';
    
    Swal.fire({
      icon: 'success',
      title: 'Role Updated!',
      text: `User role has been updated to ${updatedRole.value}.`,
      timer: 2000,
      showConfirmButton: false
    });
    
    // Refresh the users list
    await fetchUsers();
  } catch (error) {
    console.error('Error updating role:', error);
    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: 'Failed to update user role. Please try again.',
    });
  }
}

const toggleBlockUser  = async (user) => {
  const userRef = doc(db, 'users', user.id)
  const newBlockedStatus = !user.blocked
  await updateDoc(userRef, { blocked: newBlockedStatus })
  user.blocked = newBlockedStatus
  Swal.fire('Updated!', `User  has been ${newBlockedStatus ? 'blocked' : 'unblocked'}.`, 'success')
}

const handleFilter = () => {
  Swal.fire({
    title: 'Filter by Status',
    input: 'select',
    inputOptions: {
      active: 'Active',
      inactive: 'Inactive',
    },
    inputPlaceholder: 'Select status',
    showCancelButton: true,
    confirmButtonText: 'Apply',
  }).then(result => {
    if (result.isConfirmed) {
      filterRole.value = '';
      filterStatus.value = result.value || '';
      currentPage.value = 1;
    }
  });
};

const filterStatus = ref('');

const filteredUsers = computed(() => {
  let filtered = users.value;
  // Search
  if (searchQuery.value) {
    filtered = filtered.filter(user =>
      (user.displayName || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  // Filter by status
  if (filterStatus.value) {
    filtered = filtered.filter(user =>
      filterStatus.value === 'active' ? !user.blocked : user.blocked
    );
  }
  // Filter by role
  if (filterRole.value) {
    filtered = filtered.filter(user =>
      (user.role || '').toLowerCase() === filterRole.value.toLowerCase()
    );
  }
  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortOption.value === 'Newest First') {
      // Sort by creation date, newest first
      const dateA = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date(0);
      const dateB = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date(0);
      return dateB - dateA;
    } else if (sortOption.value === 'Oldest First') {
      // Sort by creation date, oldest first
      const dateA = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date(0);
      const dateB = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date(0);
      return dateA - dateB;
    } else {
      // Sort by name
      const nameA = (a.displayName || '').toLowerCase();
      const nameB = (b.displayName || '').toLowerCase();
      if (sortOption.value === 'Name A → Z') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    }
  });
  return filtered;
});

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage)
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredUsers.value.slice(start, start + itemsPerPage)
})

const handleSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1 // Reset to first page on search
}
const handleSort = (option) => {
  sortOption.value = option
}

const formatCreatedAt = (timestamp) => {
  if (!timestamp) return 'Not Available';
  
  try {
    // Handle Firestore Timestamp objects
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // Handle regular Date objects
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // Handle timestamp numbers (milliseconds)
    if (typeof timestamp === 'number') {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // Handle string timestamps
    if (typeof timestamp === 'string') {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }
    
    return 'Invalid Date';
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Error';
  }
};

onMounted(() => {
  initializeRealTimeData()
})
</script>
