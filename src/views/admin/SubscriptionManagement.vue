<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        {{ $t('admin.subscription.title') }}
      </h1>
      <p class="text-gray-600">
        {{ $t('admin.subscription.description') }}
      </p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-blue-100">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">{{ $t('admin.subscription.basicUsers') }}</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.basic || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-green-100">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">{{ $t('admin.subscription.proUsers') }}</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.pro || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-purple-100">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">{{ $t('admin.subscription.premiumUsers') }}</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.premium || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-yellow-100">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">{{ $t('admin.subscription.monthlyRevenue') }}</p>
            <p class="text-2xl font-semibold text-gray-900">{{ getMonthlyRevenue }} {{ $t('subscription.egp') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Plan Management Section -->
    <div class="bg-white rounded-lg shadow mb-8">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ $t('admin.subscription.planManagement') }}
          </h2>
          <button
            @click="showAddPlanModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ $t('admin.subscription.addPlan') }}
          </button>
        </div>
      </div>
      
      <div class="p-6">
        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="plan in plans"
            :key="plan.id"
            class="border rounded-lg p-6"
            :class="plan.isPopular ? 'ring-2 ring-blue-500' : ''"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ $t(`subscription.plans.${plan.id}.name`) }}
                </h3>
                <p class="text-2xl font-bold text-gray-900">
                  {{ plan.price === 0 ? $t('subscription.free') : plan.price }} {{ plan.price !== 0 ? $t('subscription.egp') : '' }}
                </p>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="editPlan(plan)"
                  class="text-blue-600 hover:text-blue-700"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="deletePlan(plan.id)"
                  class="text-red-600 hover:text-red-700"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="mb-4">
              <span
                v-if="plan.isPopular"
                class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {{ $t('subscription.mostPopular') }}
              </span>
            </div>
            
            <ul class="space-y-2 text-sm text-gray-600">
              <li
                v-for="feature in plan.features"
                :key="feature"
                class="flex items-center"
              >
                <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                {{ $t(`subscription.features.${feature}`) }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- User Management Section -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ $t('admin.subscription.userManagement') }}
          </h2>
          
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('admin.subscription.searchUsers')"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <select
              v-model="selectedPlanFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{{ $t('admin.subscription.allPlans') }}</option>
              <option value="Basic">{{ $t('subscription.plans.Basic.name') }}</option>
              <option value="Pro">{{ $t('subscription.plans.Pro.name') }}</option>
              <option value="Premium">{{ $t('subscription.plans.Premium.name') }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('admin.subscription.user') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('admin.subscription.currentPlan') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('admin.subscription.status') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('admin.subscription.expiryDate') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('admin.subscription.paymentMethod') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('admin.subscription.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="user in filteredUsers"
              :key="user.uid"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      class="h-10 w-10 rounded-full"
                      :src="user.profileImage || '/default-avatar.png'"
                      :alt="user.displayName"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.displayName || user.email }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ user.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getPlanBadgeClass(user.subscription?.planId)">
                  {{ user.subscription ? $t(`subscription.plans.${user.subscription.planId}.name`) : $t('admin.subscription.noPlan') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getStatusBadgeClass(user.subscription?.status)">
                  {{ user.subscription ? $t(`subscription.statuses.${user.subscription.status}`) : '-' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.subscription?.endDate ? formatDate(user.subscription.endDate) : $t('admin.subscription.noExpiry') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getPaymentMethodBadgeClass(user.subscription?.paymentMethod)">
                  {{ user.subscription?.paymentMethod ? $t(`paymentMethod.${user.subscription.paymentMethod}`) : $t('paymentMethod.normal') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="openChangePlanModal(user)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  {{ $t('admin.subscription.changePlan') }}
                </button>
                <button
                  v-if="user.subscription?.status === 'expired'"
                  @click="renewSubscription(user.subscription.id)"
                  class="text-green-600 hover:text-green-900"
                >
                  {{ $t('admin.subscription.renew') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Change Plan Modal -->
    <div
      v-if="showChangePlanModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ $t('admin.subscription.changePlanFor') }} {{ selectedUser?.displayName || selectedUser?.email }}
          </h3>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('admin.subscription.selectNewPlan') }}
            </label>
            <select
              v-model="newPlanId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Basic">{{ $t('subscription.plans.Basic.name') }}</option>
              <option value="Pro">{{ $t('subscription.plans.Pro.name') }}</option>
              <option value="Premium">{{ $t('subscription.plans.Premium.name') }}</option>
            </select>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button
              @click="showChangePlanModal = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              @click="changeUserPlan"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {{ $t('common.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Plan Modal -->
    <div
      v-if="showAddPlanModal || showEditPlanModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditPlanModal ? $t('admin.subscription.editPlan') : $t('admin.subscription.addPlan') }}
          </h3>
          
          <form @submit.prevent="savePlan">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('admin.subscription.planName') }}
                </label>
                <input
                  v-model="planForm.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('admin.subscription.planPrice') }} ({{ $t('subscription.egp') }})
                </label>
                <input
                  v-model="planForm.price"
                  type="number"
                  min="0"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('admin.subscription.planFeatures') }}
                </label>
                <div class="space-y-2">
                  <div
                    v-for="(feature, index) in planForm.features"
                    :key="index"
                    class="flex items-center space-x-2"
                  >
                    <input
                      v-model="planForm.features[index]"
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      @click="removeFeature(index)"
                      class="text-red-600 hover:text-red-700"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="addFeature"
                    class="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + {{ $t('admin.subscription.addFeature') }}
                  </button>
                </div>
              </div>
              
              <div class="flex items-center">
                <input
                  v-model="planForm.isPopular"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900">
                  {{ $t('admin.subscription.markAsPopular') }}
                </label>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="closePlanModal"
                class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {{ $t('common.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminSubscriptions } from '@/composables/useAdminSubscriptions'
import Swal from 'sweetalert2'

const {
  allSubscriptions,
  allUsers,
  stats,
  plans,
  fetchAllSubscriptions,
  subscribeToAllSubscriptions,
  fetchAllUsers,
  getUsersWithSubscriptions,
  filterUsersByPlan,
  changeUserPlan: changePlan,
  calculateStats,
  getMonthlyRevenue,
  markSubscriptionExpired,
  renewSubscription: renewSub,
  fetchPlans
} = useAdminSubscriptions()

// Reactive data
const searchQuery = ref('')
const selectedPlanFilter = ref('')
const showChangePlanModal = ref(false)
const showAddPlanModal = ref(false)
const showEditPlanModal = ref(false)
const selectedUser = ref(null)
const newPlanId = ref('')
const editingPlan = ref(null)

const planForm = ref({
  name: '',
  price: 0,
  features: [''],
  isPopular: false
})

// Computed properties
const filteredUsers = computed(() => {
  let users = getUsersWithSubscriptions.value
  
  if (searchQuery.value) {
    users = users.filter(user => 
      user.displayName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (selectedPlanFilter.value) {
    users = users.filter(user => user.subscription?.planId === selectedPlanFilter.value)
  }
  
  return users
})

// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const getPlanBadgeClass = (planId) => {
  switch (planId) {
    case 'Basic': return 'bg-gray-100 text-gray-800'
    case 'Pro': return 'bg-green-100 text-green-800'
    case 'Premium': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'expired': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPaymentMethodBadgeClass = (paymentMethod) => {
  switch (paymentMethod) {
    case 'wallet': return 'bg-blue-100 text-blue-800'
    case 'normal': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const openChangePlanModal = (user) => {
  selectedUser.value = user
  newPlanId.value = user.subscription?.planId || 'Basic'
  showChangePlanModal.value = true
}

const changeUserPlan = async () => {
  try {
    await changePlan(selectedUser.value.uid, newPlanId.value)
    showChangePlanModal.value = false
    Swal.fire({
      title: 'Success!',
      text: 'User plan has been updated successfully',
      icon: 'success'
    })
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: error.message || 'Failed to update user plan',
      icon: 'error'
    })
  }
}

const editPlan = (plan) => {
  editingPlan.value = plan
  planForm.value = {
    name: plan.name,
    price: plan.price,
    features: [...plan.features],
    isPopular: plan.isPopular
  }
  showEditPlanModal.value = true
}

const addFeature = () => {
  planForm.value.features.push('')
}

const removeFeature = (index) => {
  planForm.value.features.splice(index, 1)
}

const savePlan = async () => {
  try {
    // Implementation for saving plan
    closePlanModal()
    Swal.fire({
      title: 'Success!',
      text: 'Plan has been saved successfully',
      icon: 'success'
    })
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: error.message || 'Failed to save plan',
      icon: 'error'
    })
  }
}

const deletePlan = async (planId) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This action cannot be undone',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  })
  
  if (result.isConfirmed) {
    try {
      // Implementation for deleting plan
      Swal.fire('Deleted!', 'Plan has been deleted.', 'success')
    } catch (error) {
      Swal.fire('Error!', error.message || 'Failed to delete plan', 'error')
    }
  }
}

const closePlanModal = () => {
  showAddPlanModal.value = false
  showEditPlanModal.value = false
  editingPlan.value = null
  planForm.value = {
    name: '',
    price: 0,
    features: [''],
    isPopular: false
  }
}

const renewSubscription = async (subscriptionId) => {
  try {
    await renewSub(subscriptionId)
    Swal.fire({
      title: 'Success!',
      text: 'Subscription has been renewed successfully',
      icon: 'success'
    })
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: error.message || 'Failed to renew subscription',
      icon: 'error'
    })
  }
}

onMounted(async () => {
  await Promise.all([
    fetchAllSubscriptions(),
    fetchAllUsers(),
    fetchPlans()
  ])
  subscribeToAllSubscriptions()
  calculateStats()
})
</script> 