<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        {{ $t('subscriptionPlansManagement') }}
      </h1>
      <p class="text-gray-600">
        {{ $t('manageSubscriptionPlans') }}
      </p>
    </div>

    <!-- Add New Plan Button -->
    <div class="mb-6">
      <button 
        @click="showAddPlanModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <i class="fas fa-plus"></i>
        {{ $t('addNewPlan') }}
      </button>
    </div>

    <!-- Plans Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="plan in plans" 
        :key="plan.id"
        class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
      >
        <!-- Plan Header -->
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-xl font-bold text-gray-900">{{ plan.name }}</h3>
            <p class="text-gray-600">{{ plan.description }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="editPlan(plan)"
              class="text-blue-600 hover:text-blue-800 p-1"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button 
              @click="deletePlan(plan.id)"
              class="text-red-600 hover:text-red-800 p-1"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <!-- Plan Price -->
        <div class="mb-4">
          <div class="text-2xl font-bold text-gray-900">
            {{ plan.price }} {{ $t('egp') }}
            <span class="text-sm font-normal text-gray-600">
              {{ plan.name === 'Basic' ? $t('free') : $t('perMonth') }}
            </span>
          </div>
        </div>

        <!-- Plan Features -->
        <div class="mb-4">
          <h4 class="font-semibold text-gray-900 mb-2">{{ $t('features') }}:</h4>
          <ul class="space-y-1">
            <li 
              v-for="feature in plan.features" 
              :key="feature"
              class="flex items-center text-sm text-gray-700"
            >
              <i class="fas fa-check text-green-500 mr-2"></i>
              {{ feature }}
            </li>
          </ul>
        </div>

        <!-- Plan Status -->
        <div class="flex items-center justify-between">
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
          >
            {{ plan.isActive ? $t('active') : $t('inactive') }}
          </span>
          <span 
            v-if="plan.isPopular"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ $t('popular') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Add/Edit Plan Modal -->
    <div v-if="showAddPlanModal || showEditPlanModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditPlanModal ? $t('editPlan') : $t('addNewPlan') }}
          </h3>
          
          <form @submit.prevent="savePlan">
            <div class="space-y-4">
              <!-- Plan Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('planName') }}</label>
                <input 
                  v-model="planForm.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>

              <!-- Plan Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('description') }}</label>
                <textarea 
                  v-model="planForm.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <!-- Plan Price -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('price') }} ({{ $t('egp') }})</label>
                <input 
                  v-model.number="planForm.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>

              <!-- Plan Features -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('features') }}</label>
                <div class="space-y-2">
                  <div 
                    v-for="(feature, index) in planForm.features" 
                    :key="index"
                    class="flex items-center gap-2"
                  >
                    <input 
                      v-model="planForm.features[index]"
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :placeholder="$t('enterFeature')"
                    >
                    <button 
                      @click="removeFeature(index)"
                      type="button"
                      class="text-red-600 hover:text-red-800 p-1"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <button 
                    @click="addFeature"
                    type="button"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <i class="fas fa-plus mr-1"></i>
                    {{ $t('addFeature') }}
                  </button>
                </div>
              </div>

              <!-- Plan Status -->
              <div class="flex items-center gap-4">
                <label class="flex items-center">
                  <input 
                    v-model="planForm.isActive"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">{{ $t('active') }}</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="planForm.isPopular"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">{{ $t('popular') }}</span>
                </label>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                @click="closeModal"
                type="button"
                class="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                {{ $t('cancel') }}
              </button>
              <button 
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <span v-if="loading" class="flex items-center">
                  <i class="fas fa-spinner fa-spin mr-2"></i>
                  {{ $t('saving') }}
                </span>
                <span v-else>{{ showEditPlanModal ? $t('update') : $t('save') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import Swal from 'sweetalert2';

const plans = ref([]);
const loading = ref(false);
const showAddPlanModal = ref(false);
const showEditPlanModal = ref(false);
const editingPlanId = ref(null);

const planForm = ref({
  name: '',
  description: '',
  price: 0,
  features: [''],
  isActive: true,
  isPopular: false
});

// Fetch all plans
const fetchPlans = async () => {
  try {
    loading.value = true;
    const plansRef = collection(db, 'plans');
    const snapshot = await getDocs(plansRef);
    plans.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error('Error fetching plans:', err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch plans. Please try again.',
      confirmButtonText: 'OK'
    });
  } finally {
    loading.value = false;
  }
};

// Add new feature field
const addFeature = () => {
  planForm.value.features.push('');
};

// Remove feature field
const removeFeature = (index) => {
  planForm.value.features.splice(index, 1);
};

// Edit plan
const editPlan = (plan) => {
  editingPlanId.value = plan.id;
  planForm.value = {
    name: plan.name,
    description: plan.description || '',
    price: plan.price,
    features: [...plan.features],
    isActive: plan.isActive !== false,
    isPopular: plan.isPopular || false
  };
  showEditPlanModal.value = true;
};

// Save plan (add or update)
const savePlan = async () => {
  try {
    loading.value = true;
    
    // Filter out empty features
    const features = planForm.value.features.filter(f => f.trim() !== '');
    
    const planData = {
      name: planForm.value.name,
      description: planForm.value.description,
      price: planForm.value.price,
      features: features,
      isActive: planForm.value.isActive,
      isPopular: planForm.value.isPopular,
      updatedAt: serverTimestamp()
    };

    if (showEditPlanModal.value) {
      // Update existing plan
      await updateDoc(doc(db, 'plans', editingPlanId.value), planData);
      
      Swal.fire({
        icon: 'success',
        title: 'Plan Updated',
        text: 'Plan has been updated successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      // Add new plan
      planData.createdAt = serverTimestamp();
      await addDoc(collection(db, 'plans'), planData);
      
      Swal.fire({
        icon: 'success',
        title: 'Plan Added',
        text: 'New plan has been added successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    }
    
    closeModal();
    await fetchPlans();
  } catch (err) {
    console.error('Error saving plan:', err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message || 'Failed to save plan. Please try again.',
      confirmButtonText: 'OK'
    });
  } finally {
    loading.value = false;
  }
};

// Delete plan
const deletePlan = async (planId) => {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Delete Plan',
    text: 'Are you sure you want to delete this plan? This action cannot be undone.',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    try {
      loading.value = true;
      await deleteDoc(doc(db, 'plans', planId));
      
      Swal.fire({
        icon: 'success',
        title: 'Plan Deleted',
        text: 'Plan has been deleted successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      
      await fetchPlans();
    } catch (err) {
      console.error('Error deleting plan:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to delete plan. Please try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      loading.value = false;
    }
  }
};

// Close modal
const closeModal = () => {
  showAddPlanModal.value = false;
  showEditPlanModal.value = false;
  editingPlanId.value = null;
  planForm.value = {
    name: '',
    description: '',
    price: 0,
    features: [''],
    isActive: true,
    isPopular: false
  };
};

onMounted(() => {
  fetchPlans();
});
</script> 