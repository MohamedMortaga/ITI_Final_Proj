<template>
  <div class="min-h-screen p-8">
    <!-- Top Bar -->
    <TopBar
      :title="$t('idVerificationManagement')"
      :searchPlaceholder="$t('searchVerifications')"
      @update:search="handleSearch"
      @update:sort="handleSort"
      @filter="handleFilter"
    />

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ $t('totalVerifications') }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ statistics.total }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-id-card text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ $t('pendingVerifications') }}</p>
            <p class="text-2xl font-bold text-yellow-600">{{ statistics.pending }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-clock text-yellow-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ $t('approvedVerifications') }}</p>
            <p class="text-2xl font-bold text-green-600">{{ statistics.approved }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-check text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ $t('rejectedVerifications') }}</p>
            <p class="text-2xl font-bold text-red-600">{{ statistics.rejected }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-times text-red-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Verifications Table -->
    <div class="bg-white rounded-xl shadow border">
      <table class="min-w-full divide-y">
        <thead>
          <tr>
            <th class="px-4 py-3">{{ $t('user') }}</th>
            <th class="px-4 py-3">{{ $t('email') }}</th>
            <th class="px-4 py-3">{{ $t('uploadedAt') }}</th>
            <th class="px-4 py-3">{{ $t('status') }}</th>
            <th class="px-4 py-3">{{ $t('actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="verification in paginatedVerifications" :key="verification.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img 
                  :src="verification.userImage || require('@/assets/default.png')" 
                  :alt="verification.userName"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p class="font-medium text-gray-900">{{ verification.userName || $t('unknownUser') }}</p>
                  <p class="text-sm text-gray-500">{{ verification.userId }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">{{ verification.userEmail }}</td>
            <td class="px-4 py-3">
              <span v-if="verification.submittedAt">
                {{ formatDate(verification.submittedAt) }}
              </span>
              <span v-else>{{ $t('notAvailable') }}</span>
            </td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" :class="getStatusBadgeClass(verification.status)">
                {{ getStatusText(verification.status) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center space-x-2">
                <button
                  @click="viewIDCard(verification)"
                  class="text-blue-500 hover:text-blue-700"
                  title="{{ $t('viewIDCard') }}"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  v-if="verification.status === 'pending'"
                  @click="approveVerification(verification)"
                  class="text-green-500 hover:text-green-700"
                  title="{{ $t('approve') }}"
                >
                  <i class="fas fa-check"></i>
                </button>
                <button
                  v-if="verification.status === 'pending'"
                  @click="rejectVerification(verification)"
                  class="text-red-500 hover:text-red-700"
                  title="{{ $t('reject') }}"
                >
                  <i class="fas fa-times"></i>
                </button>
                <button
                  @click="viewDetails(verification)"
                  class="text-gray-500 hover:text-gray-700"
                  title="{{ $t('viewDetails') }}"
                >
                  <i class="fas fa-info-circle"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- No Verifications Fallback -->
      <div v-if="!paginatedVerifications.length" class="text-gray-600 mt-8 text-center">
        <p>{{ $t('noVerificationsFound') }}</p>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t">
        <button
          class="text-gray-500 flex items-center"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <i class="fas fa-chevron-left mr-1"></i> {{ $t('previous') }}
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
          {{ $t('next') }} <i class="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>

    <!-- Rejection Modal -->
    <div
      v-if="showRejectionModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 class="text-lg font-semibold text-gray-800">{{ $t('rejectVerification') }}</h2>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">{{ $t('rejectionReason') }}:</label>
          <textarea
            v-model="rejectionReason"
            rows="4"
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            :placeholder="$t('enterRejectionReason')"
          ></textarea>
        </div>
        <div class="flex justify-end gap-2">
          <button 
            @click="showRejectionModal = false" 
            class="px-4 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {{ $t('cancel') }}
          </button>
          <button
            @click="confirmRejection"
            :disabled="!rejectionReason.trim()"
            class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ $t('reject') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div
      v-if="selectedVerification"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">{{ $t('verificationDetails') }}</h2>
          <button @click="selectedVerification = null" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- User Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-2">{{ $t('userInformation') }}</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">{{ $t('name') }}:</span>
                <span class="ml-2 font-medium">{{ selectedVerification.userName || $t('unknownUser') }}</span>
              </div>
              <div>
                <span class="text-gray-600">{{ $t('email') }}:</span>
                <span class="ml-2 font-medium">{{ selectedVerification.userEmail }}</span>
              </div>
              <div>
                <span class="text-gray-600">{{ $t('submittedAt') }}:</span>
                <span class="ml-2 font-medium">{{ formatDate(selectedVerification.submittedAt) }}</span>
              </div>
              <div>
                <span class="text-gray-600">{{ $t('status') }}:</span>
                <span class="ml-2 font-medium">{{ getStatusText(selectedVerification.status) }}</span>
              </div>
            </div>
          </div>

          <!-- ID Card Preview -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-2">{{ $t('idCardPreview') }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Front ID Card -->
              <div class="space-y-2">
                <h4 class="font-medium text-gray-700">{{ $t('frontIDCard') }}</h4>
                <div class="flex justify-center">
                  <img 
                    :src="selectedVerification.frontIdCardUrl" 
                    :alt="$t('frontIDCard')"
                    class="max-w-full max-h-48 object-contain rounded-lg border"
                  />
                </div>
                <div class="text-center">
                  <a 
                    :href="selectedVerification.frontIdCardUrl" 
                    target="_blank"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {{ $t('openInNewTab') }}
                  </a>
                </div>
              </div>

              <!-- Back ID Card -->
              <div class="space-y-2">
                <h4 class="font-medium text-gray-700">{{ $t('backIDCard') }}</h4>
                <div class="flex justify-center">
                  <img 
                    :src="selectedVerification.backIdCardUrl" 
                    :alt="$t('backIDCard')"
                    class="max-w-full max-h-48 object-contain rounded-lg border"
                  />
                </div>
                <div class="text-center">
                  <a 
                    :href="selectedVerification.backIdCardUrl" 
                    target="_blank"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {{ $t('openInNewTab') }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Review History -->
          <div v-if="selectedVerification.reviewedAt" class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-2">{{ $t('reviewHistory') }}</h3>
            <div class="space-y-2 text-sm">
              <div>
                <span class="text-gray-600">{{ $t('reviewedBy') }}:</span>
                <span class="ml-2 font-medium">{{ selectedVerification.reviewedBy || $t('unknownAdmin') }}</span>
              </div>
              <div>
                <span class="text-gray-600">{{ $t('reviewedAt') }}:</span>
                <span class="ml-2 font-medium">{{ formatDate(selectedVerification.reviewedAt) }}</span>
              </div>
              <div v-if="selectedVerification.rejectionReason">
                <span class="text-gray-600">{{ $t('rejectionReason') }}:</span>
                <span class="ml-2 font-medium text-red-600">{{ selectedVerification.rejectionReason }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopBar from '@/components/admin/TopBar.vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { doc, updateDoc, getDoc, collection, query, getDocs, where } from 'firebase/firestore'
import { db } from '@/firebase/config'
import Swal from 'sweetalert2'
import { useNotifications } from '@/composables/useNotifications'

const { t } = useI18n()
const searchQuery = ref('')
const sortOption = ref('Newest First')
const filterStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const verifications = ref([])
const selectedVerification = ref(null)
const showRejectionModal = ref(false)
const rejectionReason = ref('')
const pendingRejection = ref(null)
const { notifyIDVerificationApproved, notifyIDVerificationRejected } = useNotifications()

// Computed properties
const filteredVerifications = computed(() => {
  let filtered = verifications.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(v => 
      v.userName?.toLowerCase().includes(query) ||
      v.userEmail?.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (filterStatus.value) {
    filtered = filtered.filter(v => v.status === filterStatus.value)
  }

  return filtered
})

const sortedVerifications = computed(() => {
  const sorted = [...filteredVerifications.value]
  
  switch (sortOption.value) {
    case 'Newest First':
      return sorted.sort((a, b) => {
        const dateA = a.submittedAt?.toDate ? a.submittedAt.toDate() : new Date(a.submittedAt || 0)
        const dateB = b.submittedAt?.toDate ? b.submittedAt.toDate() : new Date(b.submittedAt || 0)
        return dateB - dateA
      })
    case 'Oldest First':
      return sorted.sort((a, b) => {
        const dateA = a.submittedAt?.toDate ? a.submittedAt.toDate() : new Date(a.submittedAt || 0)
        const dateB = b.submittedAt?.toDate ? b.submittedAt.toDate() : new Date(b.submittedAt || 0)
        return dateA - dateB
      })
    case 'Status':
      return sorted.sort((a, b) => a.status.localeCompare(b.status))
    default:
      return sorted
  }
})

const paginatedVerifications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedVerifications.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(sortedVerifications.value.length / itemsPerPage)
})

const statistics = computed(() => {
  const total = verifications.value.length
  const pending = verifications.value.filter(v => v.status === 'pending').length
  const approved = verifications.value.filter(v => v.status === 'approved').length
  const rejected = verifications.value.filter(v => v.status === 'rejected').length

  return { total, pending, approved, rejected }
})

// Methods
const handleSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1
}

const handleSort = (option) => {
  sortOption.value = option
}

const handleFilter = (status) => {
  filterStatus.value = status
  currentPage.value = 1
}

const formatDate = (timestamp) => {
  if (!timestamp) return t('notAvailable')
  
  // Handle Firebase server timestamp
  if (timestamp.toDate) {
    const date = timestamp.toDate()
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }
  
  // Handle regular date strings
  if (typeof timestamp === 'string') {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }
  
  // Handle timestamp objects
  if (timestamp.seconds) {
    const date = new Date(timestamp.seconds * 1000)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }
  
  return t('notAvailable')
}

const formatFileSize = (bytes) => {
  if (!bytes) return t('notAvailable')
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'approved':
      return t('approved')
    case 'rejected':
      return t('rejected')
    case 'pending':
      return t('pending')
    default:
      return t('unknown')
  }
}

const viewIDCard = (verification) => {
  // Show a modal to choose which image to view
  Swal.fire({
    title: t('selectImageToView'),
    html: `
      <div class="space-y-4">
        <button id="view-front" class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          ${t('viewFrontID')}
        </button>
        <button id="view-back" class="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          ${t('viewBackID')}
        </button>
      </div>
    `,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: t('cancel'),
    didOpen: () => {
      document.getElementById('view-front').addEventListener('click', () => {
        if (verification.frontIdCardUrl) {
          window.open(verification.frontIdCardUrl, '_blank')
        }
        Swal.close()
      })
      document.getElementById('view-back').addEventListener('click', () => {
        if (verification.backIdCardUrl) {
          window.open(verification.backIdCardUrl, '_blank')
        }
        Swal.close()
      })
    }
  })
}

const approveVerification = async (verification) => {
  try {
    const result = await Swal.fire({
      title: t('approveVerification'),
      text: t('approveVerificationConfirm'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t('approve'),
      cancelButtonText: t('cancel')
    })

    if (result.isConfirmed) {
      // Update verification status
      await updateDoc(doc(db, 'user-verifications', verification.id), {
        status: 'approved',
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Admin' // You can get the actual admin name here
      })

      // Update user's verification status in users collection
      await updateDoc(doc(db, 'users', verification.userId), {
        isVerified: true,
        verifiedAt: new Date().toISOString()
      })

      // Send notification
      await notifyIDVerificationApproved(verification.userName || 'User')

      // Update local state
      const index = verifications.value.findIndex(v => v.id === verification.id)
      if (index !== -1) {
        verifications.value[index].status = 'approved'
        verifications.value[index].reviewedAt = new Date().toISOString()
        verifications.value[index].reviewedBy = 'Admin'
      }

      Swal.fire({
        icon: 'success',
        title: t('verificationApproved'),
        text: t('verificationApprovedDesc'),
        timer: 2000,
        showConfirmButton: false
      })
    }
  } catch (error) {
    console.error('Error approving verification:', error)
    Swal.fire({
      icon: 'error',
      title: t('approvalError'),
      text: t('approvalErrorDesc'),
      confirmButtonText: 'OK'
    })
  }
}

const rejectVerification = (verification) => {
  pendingRejection.value = verification
  showRejectionModal.value = true
}

const confirmRejection = async () => {
  if (!pendingRejection.value || !rejectionReason.value.trim()) return

  try {
    // Update verification status
    await updateDoc(doc(db, 'user-verifications', pendingRejection.value.id), {
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'Admin',
      rejectionReason: rejectionReason.value.trim()
    })

    // Update user's verification status in users collection
    await updateDoc(doc(db, 'users', pendingRejection.value.userId), {
      isVerified: false,
      verifiedAt: null
    })

    // Send notification
    await notifyIDVerificationRejected(pendingRejection.value.userName || 'User', rejectionReason.value.trim())

    // Update local state
    const index = verifications.value.findIndex(v => v.id === pendingRejection.value.id)
    if (index !== -1) {
      verifications.value[index].status = 'rejected'
      verifications.value[index].reviewedAt = new Date().toISOString()
      verifications.value[index].reviewedBy = 'Admin'
      verifications.value[index].rejectionReason = rejectionReason.value.trim()
    }

    showRejectionModal.value = false
    rejectionReason.value = ''
    pendingRejection.value = null

    Swal.fire({
      icon: 'success',
      title: t('verificationRejected'),
      text: t('verificationRejectedDesc'),
      timer: 2000,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('Error rejecting verification:', error)
    Swal.fire({
      icon: 'error',
      title: t('rejectionError'),
      text: t('rejectionErrorDesc'),
      confirmButtonText: 'OK'
    })
  }
}

const viewDetails = (verification) => {
  selectedVerification.value = verification
}

// Load verifications
const loadVerifications = async () => {
  try {
    const verificationsQuery = query(collection(db, 'user-verifications'))
    const querySnapshot = await getDocs(verificationsQuery)
    
    const verificationsData = []
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data()
      
      // Use user information that's already stored in the verification data
      const userName = data.userName || 'Unknown User'
      const userEmail = data.userEmail || 'No email'
      const userImage = data.userImage || null
      
      verificationsData.push({
        id: doc.id,
        userId: data.userId || doc.id,
        userName,
        userEmail,
        userImage,
        ...data
      })
    }
    
    verifications.value = verificationsData
  } catch (error) {
    console.error('Error loading verifications:', error)
  }
}

onMounted(() => {
  loadVerifications()
})
</script> 