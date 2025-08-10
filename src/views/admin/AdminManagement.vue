<template>
  <div class="min-h-screen p-8">
    <!-- Top Bar -->
    <TopBar
      :title="$t('adminManagement')"
      :searchPlaceholder="$t('searchAdmins')"
      @update:search="handleSearch"
      @update:sort="handleSort"
      @filter="handleFilter"
    />

    <!-- Admin Management Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <!-- Current Admins -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow border border-gray-50 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-800">{{ $t('currentAdmins') }}</h2>
            <div class="flex space-x-2" v-if="canManageAdmins">
              
              <button
                @click="handleConvertAllToSuperAdmin"
                class="bg-[var(--Color-Surface-Surface-Primary)]  text-[var(--Color-Text-Text-Brand)] px-4 py-2 rounded-lg flex items-center border border-[var(--Color-Boarder-Surface-Brand)]"
                :disabled="loading"
              >
                <i class="fas fa-crown mr-2"></i> 
                Convert All to Super Admin
              </button>
              <button
                @click="showAddAdminModal = true"
                class=" bg-[var(--Color-Surface-Surface-Brand)] hover:bg-[var(--Colors-Primary-600)] text-white px-4 py-2 rounded-lg flex items-center"
                :disabled="loading"
              >
                <i class="fas fa-plus mr-2"></i>
                {{ $t('addAdmin') }}
              </button>
            </div>
          </div>

          <!-- Admins Table -->
          <div v-if="!loading" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('name') }}
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('email') }}
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('adminRole') }}
                  </th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('actions') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="admin in filteredAdmins" :key="admin.id" class="hover:bg-gray-50">
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img
                          class="h-10 w-10 rounded-full"
                          :src="admin.photoURL || '/default-avatar.png'"
                          :alt="admin.displayName"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ admin.displayName || $t('unknownUser') }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ admin.email }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ admin.email }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        admin.role === 'superAdmin' 
                          ? 'bg-[var(--Colors-Primary-25)] text-[var(--Color-Text-Text-Brand)]' 
                          : 'bg-[var(--Colors-Gray-25)] text-[var(--Colors-Gray-500)]'
                      ]"
                    >
                      {{ admin.role === 'superAdmin' ? $t('superAdmin') : $t('regularAdmin') }}
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-center space-x-2">
                      <button
                        @click="viewAdminDetails(admin)"
                        class="text-blue-600 hover:text-blue-900"
                        :title="$t('viewAdminDetails')"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button
                        v-if="canManageAdmins && admin.id !== currentUser?.uid"
                        @click="editAdminRole(admin)"
                        class="text-yellow-600 hover:text-yellow-900"
                        :title="$t('editRole')"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        v-if="canManageAdmins && admin.id !== currentUser?.uid"
                        @click="handleRemoveAdmin(admin)"
                        class="text-red-600 hover:text-red-900"
                        :title="$t('removeAdmin')"
                      >
                        <i class="fas fa-user-minus"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- No Admins Message -->
            <div v-if="!filteredAdmins.length" class="text-center py-8">
              <i class="fas fa-users text-gray-400 text-4xl mb-4"></i>
              <p class="text-gray-500">{{ $t('noAdminsFound') }}</p>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </div>

      <!-- Admin Permissions Info -->
      <div class="lg:col-span-1 ">
        <div class="bg-white rounded-xl shadow border border-gray-50 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ $t('adminPermissions') }}</h3>
          
          <div class="space-y-4 justify-between flex flex-row ">
            <div class="border-l-4 border-[var(--Color-Surface-Surface-Brand)] pl-4">
              <h4 class="font-medium text-gray-900">{{ $t('superAdmin') }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ $t('fullAccess') }}</p>
              <ul class="text-xs text-gray-500 mt-2 space-y-1">
                <li>• {{ $t('manageUsers') }}</li>
                <li>• {{ $t('manageProducts') }}</li>
                <li>• {{ $t('manageCategories') }}</li>
                <li>• {{ $t('manageRentals') }}</li>
                <li>• {{ $t('manageReviews') }}</li>
                <li>• {{ $t('manageVerifications') }}</li>
                <li>• {{ $t('manageWithdrawals') }}</li>
                <li>• {{ $t('manageMessages') }}</li>
                <li>• {{ $t('manageAdmins') }}</li>
              </ul>
            </div>

            <div class="border-l-4  border-[var(--Color-Boarder-Border-Primary)] pl-4">
              <h4 class="font-medium text-gray-900">{{ $t('regularAdmin') }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ $t('limitedAccess') }}</p>
              <ul class="text-xs text-gray-500 mt-2 space-y-1">
                <li>• {{ $t('manageUsers') }}</li>
                <li>• {{ $t('manageProducts') }}</li>
                <li>• {{ $t('manageCategories') }}</li>
                <li>• {{ $t('manageRentals') }}</li>
                <li>• {{ $t('manageReviews') }}</li>
                <li>• {{ $t('manageVerifications') }}</li>
                <li>• {{ $t('manageWithdrawals') }}</li>
                <li>• {{ $t('manageMessages') }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Admin Modal -->
    <div v-if="showAddAdminModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">{{ $t('addAdmin') }}</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('email') }}
            </label>
            <input
              v-model="newAdminEmail"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              :placeholder="$t('enterEmail')"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('adminRole') }}
            </label>
                         <select
               v-model="newAdminRole"
               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
             >
               <option value="superAdmin">{{ $t('superAdmin') }}</option>
               <option value="admin">{{ $t('regularAdmin') }}</option>
             </select>
            <p class="text-xs text-gray-500 mt-1">{{ $t('adminRoleDescription') }}</p>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showAddAdminModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            {{ $t('cancel') }}
          </button>
          <button
            @click="handleAddAdmin"
            :disabled="!newAdminEmail || loading"
            class="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:opacity-50"
          >
            {{ loading ? $t('loading') : $t('addAdmin') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Admin Details Modal -->
    <div v-if="showAdminDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">{{ $t('adminDetails') }}</h3>
          <button @click="showAdminDetailsModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div v-if="selectedAdmin" class="space-y-4">
          <div class="flex items-center space-x-4">
            <img
              :src="selectedAdmin.photoURL || '/default-avatar.png'"
              :alt="selectedAdmin.displayName"
              class="h-16 w-16 rounded-full"
            />
            <div>
              <h4 class="text-xl font-semibold">{{ selectedAdmin.displayName || $t('unknownUser') }}</h4>
              <p class="text-gray-600">{{ selectedAdmin.email }}</p>
              <span
                :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2',
                  selectedAdmin.role === 'superAdmin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                ]"
              >
                {{ selectedAdmin.role === 'superAdmin' ? $t('superAdmin') : $t('regularAdmin') }}
              </span>
            </div>
          </div>



          <div>
            <h5 class="font-medium text-gray-900 mb-2">{{ $t('adminActivity') }}</h5>
            <div v-if="adminActivity.length" class="space-y-2">
              <div
                v-for="activity in adminActivity.slice(0, 5)"
                :key="activity.id"
                class="text-sm text-gray-600 border-l-2 border-gray-200 pl-3"
              >
                {{ formatActivity(activity) }}
              </div>
            </div>
            <p v-else class="text-sm text-gray-500">{{ $t('noRecentActions') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import TopBar from '@/components/admin/TopBar.vue'
import useAdminManagement from '@/composables/useAdminManagement'

const { t } = useI18n()

const {
  admins,
  loading,
  error,
  currentUser,
  isSuperAdmin,
  canManageAdmins,
  loadAdmins,
  addAdmin,
  removeAdmin,
  updateAdminRole,
  convertAllToSuperAdmin,
  convertFirstAdminToSuper,
  getAdminActivity,
  findUserByEmail,
  showSuccess,
  showError,
  confirmAction
} = useAdminManagement()

// Reactive data
const showAddAdminModal = ref(false)
const showAdminDetailsModal = ref(false)
const selectedAdmin = ref(null)
const adminActivity = ref([])
const newAdminEmail = ref('')
const newAdminRole = ref('superAdmin')
const searchQuery = ref('')
const sortBy = ref('name')
const filterBy = ref('all')

// Computed
const filteredAdmins = computed(() => {
  let filtered = admins.value

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(admin => 
      admin.displayName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Role filter
  if (filterBy.value !== 'all') {
    filtered = filtered.filter(admin => admin.role === filterBy.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return (a.displayName || '').localeCompare(b.displayName || '')
      case 'email':
        return a.email.localeCompare(b.email)
      case 'role':
        return a.role.localeCompare(b.role)
      case 'adminSince':
        return new Date(b.adminSince?.toDate()) - new Date(a.adminSince?.toDate())
      default:
        return 0
    }
  })

  return filtered
})

// Methods
const handleSearch = (query) => {
  searchQuery.value = query
}

const handleSort = (sort) => {
  sortBy.value = sort
}

const handleFilter = (filter) => {
  filterBy.value = filter
}



const formatActivity = (activity) => {
  const date = new Date(activity.timestamp.toDate()).toLocaleDateString()
  switch (activity.action) {
    case 'admin_added':
      return `${date}: ${t('adminAddedSuccess')}`
    case 'admin_removed':
      return `${date}: ${t('adminRemovedSuccess')}`
    case 'role_updated':
      return `${date}: ${t('role')} ${t('updated')} to ${activity.newRole}`
    default:
      return `${date}: ${activity.action}`
  }
}

const handleAddAdmin = async () => {
  if (!newAdminEmail.value) {
    showError(t('pleaseEnterEmail'))
    return
  }

  // Find user by email
  const user = await findUserByEmail(newAdminEmail.value)
  if (!user) {
    showError(t('userNotFound'))
    return
  }

  // Check if user is already an admin
  if (user.role === 'admin' || user.role === 'superAdmin') {
    showError(t('userAlreadyAdmin'))
    return
  }

  const success = await addAdmin(user.id, newAdminRole.value)
  if (success) {
    showSuccess(t('adminAddedSuccess'))
    showAddAdminModal.value = false
    newAdminEmail.value = ''
         newAdminRole.value = 'superAdmin'
  } else {
    showError(t('adminUpdateError'))
  }
}

const handleRemoveAdmin = async (admin) => {
  const confirmed = await confirmAction(
    t('confirmRemoveAdmin'),
    `${t('confirmRemoveAdmin')} ${admin.displayName || admin.email}?`
  )

  if (confirmed) {
    const success = await removeAdmin(admin.id)
    if (success) {
      showSuccess(t('adminRemovedSuccess'))
    } else {
      showError(t('adminUpdateError'))
    }
  }
}

const editAdminRole = async (admin) => {
  const newRole = admin.role === 'admin' ? 'superAdmin' : 'admin'
  const success = await updateAdminRole(admin.id, newRole)
  if (success) {
    showSuccess(t('adminUpdateError'))
  } else {
    showError(t('adminUpdateError'))
  }
}

const viewAdminDetails = async (admin) => {
  selectedAdmin.value = admin
  adminActivity.value = await getAdminActivity(admin.id)
  showAdminDetailsModal.value = true
}

const handleConvertFirstToSuperAdmin = async () => {
  const confirmed = await confirmAction(
    'Convert First to Super Admin',
    'Are you sure you want to convert the first admin to Super Admin? This will give them full permissions.'
  )

  if (confirmed) {
    await convertFirstAdminToSuper()
  }
}

const handleConvertAllToSuperAdmin = async () => {
  const confirmed = await confirmAction(
    'Convert All to Super Admin',
    'Are you sure you want to convert all regular admins to Super Admins? This action cannot be undone.'
  )

  if (confirmed) {
    await convertAllToSuperAdmin()
  }
}

// Lifecycle
onMounted(() => {
  loadAdmins()
})
</script> 