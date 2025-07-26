<!-- src/components/AdminHeader.vue -->
<template>
  <header class="bg-[var(--Color-Surface-Surface-Primary)] px-4 py-4 flex items-center justify-end">
    <div class="flex-1 flex justify-center">
      <div class="relative">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          @focus="showSearchResults = true"
          type="text"
          placeholder="Search rentals, users, products..."
          class="border border-[var(--Color-Boarder-Border-Primary)] rounded-lg px-4 py-2 w-[600px] pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--Color-Text-Text-Secondary)]"></i>
        
        <!-- Search Results Dropdown -->
        <div v-if="showSearchResults && searchResults.length > 0" class="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div v-for="result in searchResults" :key="result.id" 
               @click="handleResultClick(result)"
               class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <i :class="getResultIcon(result.type)" class="text-blue-600 text-sm"></i>
              </div>
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ result.title }}</div>
                <div class="text-sm text-gray-500">{{ result.subtitle }}</div>
                <div class="text-xs text-gray-400">{{ result.type }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex items-center space-x-3 ml-4">
      <!-- Notifications -->
      <div class="relative">
        <button @click="toggleNotifications" class="relative">
          <i class="fas fa-bell text-[var(--Color-Text-Text-Secondary)] text-xl"></i>
          <span v-if="unreadNotifications > 0" 
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
          </span>
        </button>
        
        <!-- Notifications Dropdown -->
        <div v-if="showNotifications" class="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div class="p-3 border-b border-gray-200">
            <h3 class="font-semibold text-gray-900">Notifications</h3>
            <button @click="markAllAsRead" class="text-sm text-blue-600 hover:text-blue-800">
              Mark all as read
            </button>
          </div>
          <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
            No notifications
          </div>
          <div v-for="notification in notifications" :key="notification.id" 
               @click="handleNotificationClick(notification)"
               class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center"
                   :class="getNotificationColor(notification.type)">
                <i :class="getNotificationIcon(notification.type)" class="text-white text-sm"></i>
              </div>
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ notification.title }}</div>
                <div class="text-sm text-gray-600">{{ notification.message }}</div>
                <div class="text-xs text-gray-400">{{ formatNotificationTime(notification.timestamp) }}</div>
              </div>
              <div v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Admin Profile -->
      <div class="flex items-center cursor-pointer select-none gap-1">
        <span class="font-semibold text-[var(--Color-Text-Text-Primary)]">Admin</span>
        <i class="fas fa-chevron-down text-[var(--Color-Text-Text-Secondary)]"></i>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { collection, getDocs, query, where, orderBy, limit, onSnapshot, addDoc, serverTimestamp, writeBatch, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useRouter } from 'vue-router'

const router = useRouter()

// Search functionality
const searchQuery = ref('')
const searchResults = ref([])
const showSearchResults = ref(false)

// Notifications
const notifications = ref([])
const showNotifications = ref(false)
const unreadNotifications = ref(0)

// Real-time notifications from Firestore
const setupNotificationsListener = () => {
  const notificationsRef = collection(db, 'notifications')
  const q = query(notificationsRef, orderBy('timestamp', 'desc'), limit(50))
  
  onSnapshot(q, (snapshot) => {
    const newNotifications = []
    snapshot.forEach(doc => {
      newNotifications.push({
        id: doc.id,
        ...doc.data()
      })
    })
    notifications.value = newNotifications
    updateUnreadCount()
  }, (error) => {
    console.error('Error listening to notifications:', error)
  })
}

// Create notification function (call this when actions happen)
const createNotification = async (type, title, message, targetId = null) => {
  try {
    const notificationsRef = collection(db, 'notifications')
    await addDoc(notificationsRef, {
      type,
      title,
      message,
      targetId,
      timestamp: serverTimestamp(),
      read: false,
      adminId: 'admin' // You can replace with actual admin ID if needed
    })
  } catch (error) {
    console.error('Error creating notification:', error)
  }
}

onMounted(() => {
  // Setup real-time notifications listener
  setupNotificationsListener()
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Search functionality
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  try {
    const query = searchQuery.value.toLowerCase()
    const results = []

    // Search in rentals/bookings
    const bookingsSnapshot = await getDocs(collection(db, 'bookings'))
    bookingsSnapshot.forEach(doc => {
      const data = doc.data()
      if (
        (data.productTitle && data.productTitle.toLowerCase().includes(query)) ||
        (data.userName && data.userName.toLowerCase().includes(query)) ||
        (data.paymentMethod && data.paymentMethod.toLowerCase().includes(query))
      ) {
        results.push({
          id: doc.id,
          type: 'rental',
          title: data.productTitle || 'Rental',
          subtitle: `Booked by ${data.userName || 'Unknown'}`,
          data: data
        })
      }
    })

    // Search in users
    const usersSnapshot = await getDocs(collection(db, 'users'))
    usersSnapshot.forEach(doc => {
      const data = doc.data()
      if (
        (data.displayName && data.displayName.toLowerCase().includes(query)) ||
        (data.email && data.email.toLowerCase().includes(query))
      ) {
        results.push({
          id: doc.id,
          type: 'user',
          title: data.displayName || 'User',
          subtitle: data.email || 'No email',
          data: data
        })
      }
    })

    // Search in products (if you have a products collection)
    try {
      const productsSnapshot = await getDocs(collection(db, 'products'))
      productsSnapshot.forEach(doc => {
        const data = doc.data()
        if (
          (data.name && data.name.toLowerCase().includes(query)) ||
          (data.description && data.description.toLowerCase().includes(query))
        ) {
          results.push({
            id: doc.id,
            type: 'product',
            title: data.name || 'Product',
            subtitle: data.description || 'No description',
            data: data
          })
        }
      })
    } catch (error) {
      // Products collection might not exist
      console.log('Products collection not found')
    }

    searchResults.value = results.slice(0, 10) // Limit to 10 results
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  }
}

const handleResultClick = (result) => {
  showSearchResults.value = false
  searchQuery.value = ''
  
  // Navigate based on result type
  switch (result.type) {
    case 'rental':
      router.push({ name: 'Rentals' })
      break
    case 'user':
      router.push({ name: 'UserRentals', params: { userId: result.id } })
      break
    case 'product':
      router.push({ name: 'ProductsDashboard' })
      break
  }
}

const getResultIcon = (type) => {
  switch (type) {
    case 'rental': return 'fas fa-calendar-alt'
    case 'user': return 'fas fa-user'
    case 'product': return 'fas fa-box'
    default: return 'fas fa-search'
  }
}

// Notifications functionality
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showSearchResults.value = false
}

const markAllAsRead = async () => {
  try {
    const batch = writeBatch(db)
    notifications.value.forEach(notification => {
      if (!notification.read) {
        const notificationRef = doc(db, 'notifications', notification.id)
        batch.update(notificationRef, { read: true })
      }
    })
    await batch.commit()
  } catch (error) {
    console.error('Error marking notifications as read:', error)
  }
}

const handleNotificationClick = async (notification) => {
  try {
    // Mark as read in database
    if (!notification.read) {
      const notificationRef = doc(db, 'notifications', notification.id)
      await updateDoc(notificationRef, { read: true })
    }
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'booking':
        router.push({ name: 'Rentals' })
        break
      case 'product':
        router.push({ name: 'ProductsDashboard' })
        break
      case 'user':
        router.push({ name: 'AdminUsers' })
        break
    }
    
    showNotifications.value = false
  } catch (error) {
    console.error('Error handling notification click:', error)
  }
}

const updateUnreadCount = () => {
  unreadNotifications.value = notifications.value.filter(n => !n.read).length
}

const getNotificationColor = (type) => {
  switch (type) {
    case 'booking': return 'bg-blue-500'
    case 'product': return 'bg-green-500'
    case 'user': return 'bg-purple-500'
    default: return 'bg-gray-500'
  }
}

const getNotificationIcon = (type) => {
  switch (type) {
    case 'booking': return 'fas fa-calendar-check'
    case 'product': return 'fas fa-box'
    case 'user': return 'fas fa-user-plus'
    default: return 'fas fa-bell'
  }
}

const formatNotificationTime = (timestamp) => {
  if (!timestamp) return 'Unknown time'
  
  let date
  if (timestamp.toDate) {
    // Firestore timestamp
    date = timestamp.toDate()
  } else if (timestamp instanceof Date) {
    // Regular Date object
    date = timestamp
  } else {
    // String or number timestamp
    date = new Date(timestamp)
  }
  
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const handleClickOutside = (event) => {
  const header = event.target.closest('header')
  if (!header) {
    showSearchResults.value = false
    showNotifications.value = false
  }
}
</script>

<style scoped>
/* Custom scrollbar for dropdowns */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>