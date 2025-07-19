<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Main Content -->
    <div class="flex-1 p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-extrabold text-gray-800">👥 User Management</h1>
        <p class="text-gray-500 mt-1">List of all registered users</p>
      </div>

      <!-- User Cards -->
      <div v-if="users.length" class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="user in users"
          :key="user.id"
          class="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 border border-gray-100"
        @click="goToUserRentals(user.id)"
          >
          <div class="space-y-2">
            <h2 class="text-xl font-semibold text-gray-800">{{ user.displayName || 'Unknown User' }}</h2>
            <p class="text-sm text-gray-600"><span class="font-medium">Email:</span> {{ user.email }}</p>
            <p class="text-sm text-gray-600"><span class="font-medium">Role:</span> {{ user.role || 'Not set' }}</p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Created At:</span>
              <span v-if="user.createdAt && user.createdAt.toDate">
                {{ user.createdAt.toDate().toLocaleDateString() }}
              </span>
              <span v-else>Not available</span>
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Status:</span>
              <span :class="user.blocked ? 'text-red-500' : 'text-green-500'">
                {{ user.blocked ? 'Blocked' : 'Active' }}
              </span>
            </p>
          </div>

          <!-- Actions -->
          <div class="mt-4 flex gap-2">
            <button
              @click="editUser (user)"
              class="bg-yellow-400 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-500"
            >
              Edit Role
            </button>
            <button
              @click="deleteUser (user.id)"
              class="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
            >
              Delete
            </button>
            <button
              @click="toggleBlockUser (user)"
              class="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
            >
              {{ user.blocked ? 'Unblock' : 'Block' }}
            </button>
          </div>
        </div>
      </div>

      <!-- No Users Fallback -->
      <div v-else class="text-gray-600 mt-8 text-center">
        <p>No users found.</p>
      </div>
    </div>

    <!-- Edit Role Modal -->
    <div
      v-if="selectedUser "
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
        <h2 class="text-lg font-semibold text-gray-800">Edit Role for {{ selectedUser .displayName }}</h2>
        <input
          v-model="updatedRole"
          type="text"
          placeholder="Enter new role"
          class="w-full border rounded-md px-3 py-2"
        />
        <div class="flex justify-end gap-2">
          <button @click="selectedUser  = null" class="text-gray-500">Cancel</button>
          <button
            @click="updateRole"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToUserRentals = (userId) => {
  router.push({ name: 'UserRentals', params: { userId } })
}

const users = ref([])
const selectedUser  = ref(null)
const updatedRole = ref('')

const fetchUsers = async () => {
  const snapshot = await getDocs(collection(db, 'users'))
  users.value = snapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data() }
  })
}

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

const editUser  = (user) => {
  selectedUser .value = user
  updatedRole.value = user.role || ''
}

const updateRole = async () => {
  if (!selectedUser .value) return
  const userRef = doc(db, 'users', selectedUser .value.id)
  await updateDoc(userRef, { role: updatedRole.value })
  selectedUser .value.role = updatedRole.value
  selectedUser .value = null
  await fetchUsers()
  Swal.fire('Updated!', 'Role has been updated.', 'success')
}

const toggleBlockUser  = async (user) => {
  const userRef = doc(db, 'users', user.id)
  const newBlockedStatus = !user.blocked
  await updateDoc(userRef, { blocked: newBlockedStatus })
  user.blocked = newBlockedStatus
  Swal.fire('Updated!', `User  has been ${newBlockedStatus ? 'blocked' : 'unblocked'}.`, 'success')
}

onMounted(fetchUsers)
</script>
