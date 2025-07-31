<template>
  <div class="min-h-screen p-8">
    <!-- Top Bar -->
    <TopBar
      :title="$t('contactMessages')"
      :searchPlaceholder="$t('searchMessages')"
      @update:search="handleSearch"
      @update:sort="handleSort"
      @filter="handleFilter"
    />

    <!-- Contact Messages Table -->
          <div class="bg-white rounded-xl shadow border border-gray-50">
      <table class="min-w-full divide-y divide-gray-50">
        <thead>
          <tr>
            <th class="px-4 py-3">{{ $t('name') }}</th>
            <th class="px-4 py-3">{{ $t('emailAddress') }}</th>
            <th class="px-4 py-3">{{ $t('message') }}</th>
            <th class="px-4 py-3">{{ $t('createdAt') }}</th>
            <th class="px-4 py-3 text-center">{{ $t('actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="message in paginatedMessages" :key="message.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 font-medium">{{ message.name }}</td>
            <td class="px-4 py-3">{{ message.email }}</td>
            <td class="px-4 py-3">
              <div class="max-w-xs truncate" :title="message.message">
                {{ message.message }}
              </div>
            </td>
            <td class="px-4 py-3">
              <span v-if="message.createdAt">
                {{ formatCreatedAt(message.createdAt) }}
              </span>
              <span v-else>{{ $t('notAvailable') }}</span>
            </td>
            <td class="px-4 py-3 flex items-center space-x-2 justify-center">
              <button
                @click="viewMessage(message)"
                class="text-blue-500 hover:text-blue-700"
                :title="$t('viewDetails')"
              >
                <i class="fas fa-eye"></i>
              </button>
              <button
                @click="deleteMessage(message.id)"
                class="text-red-500 hover:text-red-700"
                :title="$t('delete')"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- No Messages Fallback -->
      <div v-if="!paginatedMessages.length" class="text-gray-600 mt-8 text-center">
        <p>{{ $t('noMessagesFound') }}</p>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-50">
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

    <!-- Message Details Modal -->
    <div v-if="selectedMessage" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">{{ $t('messageDetails') }}</h3>
          <button @click="selectedMessage = null" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">{{ $t('name') }}</label>
            <p class="text-gray-900">{{ selectedMessage.name }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">{{ $t('emailAddress') }}</label>
            <p class="text-gray-900">{{ selectedMessage.email }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">{{ $t('message') }}</label>
            <p class="text-gray-900 whitespace-pre-wrap">{{ selectedMessage.message }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">{{ $t('createdAt') }}</label>
            <p class="text-gray-900">{{ formatCreatedAt(selectedMessage.createdAt) }}</p>
          </div>
          

        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="selectedMessage = null"
                            class="px-4 py-2 text-gray-600 border border-gray-50 rounded-md hover:bg-gray-50"
          >
            {{ $t('close') }}
          </button>
          <button
            @click="deleteMessage(selectedMessage.id)"
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            {{ $t('delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import TopBar from '@/components/admin/TopBar.vue';
import Swal from 'sweetalert2';

export default {
  components: {
    TopBar,
  },
  setup() {
    const i18n = useI18n();
    const messages = ref([]);
    const loading = ref(false);
    const searchQuery = ref('');
    const sortBy = ref('createdAt');
    const sortOrder = ref('desc');
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const selectedMessage = ref(null);
    const db = getFirestore();

    const filteredMessages = computed(() => {
      let filtered = messages.value;
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(message => 
          message.name?.toLowerCase().includes(query) ||
          message.email?.toLowerCase().includes(query) ||
          message.message?.toLowerCase().includes(query)
        );
      }
      
      return filtered.sort((a, b) => {
        let aVal = a[sortBy.value];
        let bVal = b[sortBy.value];
        
        if (sortBy.value === 'createdAt') {
          aVal = aVal?.toDate?.() || aVal;
          bVal = bVal?.toDate?.() || bVal;
        }
        
        if (sortOrder.value === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    });

    const paginatedMessages = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredMessages.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredMessages.value.length / itemsPerPage.value);
    });

    const fetchMessages = async () => {
      loading.value = true;
      try {
        const contactsRef = collection(db, 'contacts');
        const q = query(contactsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        messages.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching messages:', error);
        Swal.fire({
          icon: 'error',
          title: i18n.t('error'),
          text: i18n.t('fetchError'),
        });
      } finally {
        loading.value = false;
      }
    };

    const handleSearch = (query) => {
      searchQuery.value = query;
      currentPage.value = 1;
    };

    const handleSort = (sort) => {
      sortBy.value = sort.field;
      sortOrder.value = sort.order;
    };

    const handleFilter = (filter) => {
      // Handle any additional filtering if needed
      console.log('Filter:', filter);
    };

    const formatCreatedAt = (timestamp) => {
      if (!timestamp) return i18n.t('notAvailable');
      
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString(i18n.locale.value, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const viewMessage = (message) => {
      selectedMessage.value = message;
    };

    const deleteMessage = async (messageId) => {
      try {
        const result = await Swal.fire({
          title: i18n.t('areYouSure'),
          text: i18n.t('deleteMessageConfirm'),
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: i18n.t('yesDeleteIt'),
          cancelButtonText: i18n.t('cancel')
        });

        if (result.isConfirmed) {
          await deleteDoc(doc(db, 'contacts', messageId));
          
          // Remove from local state
          messages.value = messages.value.filter(msg => msg.id !== messageId);
          
          if (selectedMessage.value?.id === messageId) {
            selectedMessage.value = null;
          }

          Swal.fire({
            icon: 'success',
            title: i18n.t('deleted'),
            text: i18n.t('messageDeleted'),
            timer: 1500,
            showConfirmButton: false
          });
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        Swal.fire({
          icon: 'error',
          title: i18n.t('error'),
          text: i18n.t('deleteError'),
        });
      }
    };

    onMounted(() => {
      fetchMessages();
    });

    return {
      messages,
      loading,
      searchQuery,
      sortBy,
      sortOrder,
      currentPage,
      itemsPerPage,
      selectedMessage,
      filteredMessages,
      paginatedMessages,
      totalPages,
      handleSearch,
      handleSort,
      handleFilter,
      formatCreatedAt,
      viewMessage,
      deleteMessage,
      i18n
    };
  },
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style> 