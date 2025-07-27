<template>
  <div class="min-h-screen bg-white p-8">
    <!-- Top Bar -->
    <TopBar
      :title="$t('allCategories')"
      :searchPlaceholder="$t('searchCategories')"
      @update:search="handleSearch"
      @update:sort="handleSort"
      @filter="handleFilter"
    />
    <!-- Categories Grid -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4">
      <!-- Add Category Card -->
      <div
        class="border-2 border-dashed border-teal-400 rounded-xl flex flex-col items-center justify-center p-8 min-h-[180px] cursor-pointer hover:bg-teal-50 transition"
        @click="showAddModal = true"
      >
        <div class="flex flex-col items-center">
          <span class="text-4xl text-teal-500 mb-2">+</span>
          <span class="text-lg font-semibold text-teal-600">{{$t('addCategory')}}</span>
        </div>
      </div>
      <!-- Category Cards -->
      <div
        v-for="cat in paginatedCategories"
        :key="cat.id"
        class="bg-white rounded-xl shadow p-6 flex flex-col gap-4 hover:shadow-lg transition cursor-pointer border border-gray-200"
      >
        <h3 class="text-xl font-semibold text-gray-900 select-none mb-2">{{ cat.name }}</h3>
        <div class="flex items-center gap-3 mt-auto">
          <span
            class="px-3 py-1 rounded-full text-xs font-semibold"
            :class="cat.status === 'inactive' ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-green-50 text-green-500 border border-green-200'"
          >
            {{ cat.status === 'inactive' ? $t('inactive') : $t('active') }}
          </span>
          <button @click="toggleStatus(cat)" class="text-gray-400 hover:text-teal-500" :title="cat.status === 'inactive' ? 'Make Active (Show on Website)' : 'Make Inactive (Hide from Website)'">
            <i :class="cat.status === 'inactive' ? 'fas fa-toggle-off' : 'fas fa-toggle-on'"></i>
          </button>
          <button
            @click="editCategory(cat)"
            class="text-yellow-500 hover:text-yellow-600 text-lg"
            title="Edit Category"
          >
            <i class="fas fa-pen"></i>
          </button>
        <button
          @click="deleteCategory(cat.id)"
            class="text-red-500 hover:text-red-700 text-lg"
          title="Delete Category"
          aria-label="Delete Category"
        >
            <i class="fas fa-trash"></i>
        </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || editingCategory" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-8 w-full max-w-md space-y-4">
        <h2 class="text-xl font-bold text-gray-800 mb-2">
          {{ editingCategory ? $t('editCategory') : $t('addCategory') }}
        </h2>
        <input
          v-model="categoryForm.name"
          type="text"
          :placeholder="$t('enterCategoryName')"
          class="w-full border rounded-md px-4 py-3 text-lg"
        />
        <div class="flex justify-end gap-2">
          <button @click="closeModal" class="text-gray-500">{{$t('cancel')}}</button>
          <button
            @click="saveCategory"
            class="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600"
          >{{$t('save')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopBar from '@/components/admin/TopBar.vue'
import { ref, computed, onMounted } from 'vue'
import { db } from '@/firebase/config'
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'

const showAddModal = ref(false)
const editingCategory = ref(null)
const categoryForm = ref({ name: '' })
const categories = ref([])
const searchQuery = ref('')
const sortOption = ref('Name A → Z')
const filterStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 12

const fetchCategories = () => {
  const colRef = collection(db, 'categories')
  onSnapshot(colRef, (snapshot) => {
    categories.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
}

const addCategory = async () => {
  if (!categoryForm.value.name.trim()) return
  await addDoc(collection(db, 'categories'), {
    name: categoryForm.value.name.trim(),
    status: 'active',
  })
  closeModal()
}

const editCategory = (cat) => {
  editingCategory.value = cat
  categoryForm.value = { name: cat.name }
  showAddModal.value = false
}

const saveCategory = async () => {
  if (!categoryForm.value.name.trim()) return
  if (editingCategory.value) {
    await updateDoc(doc(db, 'categories', editingCategory.value.id), {
      name: categoryForm.value.name.trim(),
  })
    editingCategory.value = null
  } else {
    await addCategory()
  }
  categoryForm.value = { name: '' }
  closeModal()
}

const toggleStatus = async (cat) => {
  const newStatus = cat.status === 'inactive' ? 'active' : 'inactive'
  const statusText = newStatus === 'active' ? 'active' : 'inactive'
  
  try {
    await updateDoc(doc(db, 'categories', cat.id), { status: newStatus })
    
    // Show confirmation message
    const Swal = await import('sweetalert2')
    Swal.default.fire({
      icon: 'success',
      title: 'Status Updated!',
      text: `Category "${cat.name}" is now ${statusText}. ${newStatus === 'inactive' ? 'It will no longer appear on the website.' : 'It is now visible on the website.'}`,
      timer: 3000,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('Error updating category status:', error)
    const Swal = await import('sweetalert2')
    Swal.default.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Failed to update category status.'
    })
  }
}

const deleteCategory = async (id) => {
  await deleteDoc(doc(db, 'categories', id))
}

const closeModal = () => {
  showAddModal.value = false
  editingCategory.value = null
  categoryForm.value = { name: '' }
}

const filteredCategories = computed(() => {
  let filtered = categories.value
  // Search
  if (searchQuery.value) {
    filtered = filtered.filter(cat =>
      (cat.name || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  // Filter by status
  if (filterStatus.value) {
    filtered = filtered.filter(cat =>
      (cat.status || 'active') === filterStatus.value
    )
  }
  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortOption.value === 'Name A → Z') {
      return (a.name || '').localeCompare(b.name || '')
    } else {
      return (b.name || '').localeCompare(a.name || '')
    }
  })
  return filtered
})

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredCategories.value.slice(start, start + itemsPerPage)
})

const handleSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1
}
const handleSort = (option) => {
  sortOption.value = option
}
const handleFilter = () => {
  // SweetAlert filter modal for status
  import('sweetalert2').then(({ default: Swal }) => {
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
        filterStatus.value = result.value || ''
        currentPage.value = 1
      }
    })
  })
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.min-h-[180px] { min-height: 180px; }
</style>