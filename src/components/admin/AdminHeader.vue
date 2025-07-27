<!-- src/components/AdminHeader.vue -->
<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
    <!-- Logo/Brand Section -->
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
          <i class="fas fa-shield-alt text-white text-sm"></i>
        </div>
        <span class="text-xl font-bold text-gray-800">Admin Panel</span>
      </div>
    </div>

    <!-- Search Section -->
    <div class="flex-1 max-w-2xl mx-8">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="fas fa-search text-gray-400"></i>
        </div>
        <input
          v-model="searchQuery"
          @input="handleSearch"
          @focus="showSearchResults = true"
          @blur="handleSearchBlur"
          type="text"
          placeholder="Search rentals, users, products, categories..."
          class="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-25 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
        />
        
        <!-- Search Results Dropdown -->
        <div v-if="showSearchResults && searchResults.length > 0" 
             class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div class="p-2">
            <div v-for="result in searchResults" :key="result.id" 
                 @click="handleResultClick(result)"
                 class="p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors duration-150">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center"
                     :class="getResultBgColor(result.type)">
                  <i :class="getResultIcon(result.type)" class="text-white text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 truncate">{{ result.title }}</div>
                  <div class="text-sm text-gray-500 truncate">{{ result.subtitle }}</div>
                  <div class="text-xs text-gray-400 mt-1">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                          :class="getResultBadgeColor(result.type)">
                      {{ result.type }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right Section -->
    <div class="flex items-center space-x-4">
      <!-- Quick Stats -->
      <div class="hidden md:flex items-center space-x-4 text-sm text-gray-600">
        <div class="flex items-center space-x-1">
          <i class="fas fa-users text-blue-500"></i>
          <span>{{ stats.users || 0 }} Users</span>
        </div>
        <div class="flex items-center space-x-1">
          <i class="fas fa-box text-green-500"></i>
          <span>{{ stats.products || 0 }} Products</span>
        </div>
        <div class="flex items-center space-x-1">
          <i class="fas fa-calendar text-purple-500"></i>
          <span>{{ stats.rentals || 0 }} Rentals</span>
        </div>
      </div>

      <!-- Notifications -->
      <div class="relative">
        <button @click="toggleNotifications" 
                class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <i class="fas fa-bell text-gray-600 text-lg"></i>
          <span v-if="unreadNotifications > 0" 
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
          </span>
        </button>
        
        <!-- Notifications Dropdown -->
        <div v-if="showNotifications" 
             class="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div class="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-gray-900">Notifications</h3>
              <button @click="markAllAsRead" 
                      class="text-sm text-teal-600 hover:text-teal-800 font-medium">
                Mark all as read
              </button>
            </div>
          </div>
          <div v-if="notifications.length === 0" class="p-6 text-center text-gray-500">
            <i class="fas fa-bell-slash text-2xl mb-2 text-gray-300"></i>
            <p>No notifications</p>
          </div>
          <div v-for="notification in notifications" :key="notification.id" 
               @click="handleNotificationClick(notification)"
               class="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                   :class="getNotificationColor(notification.type)">
                <i :class="getNotificationIcon(notification.type)" class="text-white text-sm"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-gray-900 mb-1">{{ notification.title }}</div>
                <div class="text-sm text-gray-600 mb-2">{{ notification.message }}</div>
                <div class="text-xs text-gray-400">{{ formatNotificationTime(notification.timestamp) }}</div>
              </div>
              <div v-if="!notification.read" class="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Admin Profile -->
      <div class="relative">
        <button @click="toggleProfileMenu" 
                class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <div class="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">{{ adminName.charAt(0).toUpperCase() }}</span>
          </div>
          <div class="hidden md:block text-left">
            <div class="font-medium text-gray-900">{{ adminName }}</div>
            <div class="text-xs text-gray-500">Administrator</div>
          </div>
          <i class="fas fa-chevron-down text-gray-400 text-sm transition-transform duration-200"
             :class="{ 'rotate-180': showProfileMenu }"></i>
        </button>
        
        <!-- Profile Dropdown -->
        <div v-if="showProfileMenu" 
             class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div class="p-4 border-b border-gray-200">
            <div class="font-medium text-gray-900">{{ adminName }}</div>
            <div class="text-sm text-gray-500">{{ currentUser?.email }}</div>
          </div>
          <div class="p-2">
            <button @click="handleProfileAction('settings')" 
                    class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-150">
              <i class="fas fa-cog mr-2"></i>Settings
            </button>
            <button @click="handleProfileAction('profile')" 
                    class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-150">
              <i class="fas fa-user mr-2"></i>Profile
            </button>
            <hr class="my-2">
            <button @click="handleProfileAction('logout')" 
                    class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150">
              <i class="fas fa-sign-out-alt mr-2"></i>Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { collection, getDocs, query, where, orderBy, limit, onSnapshot, addDoc, serverTimestamp, writeBatch, doc, updateDoc } from 'firebase/firestore'
import { db, auth } from '@/firebase/config'
import { useRouter } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'

const router = useRouter()

// Search functionality
const searchQuery = ref('')
const searchResults = ref([])
const showSearchResults = ref(false)

// Notifications
const notifications = ref([])
const showNotifications = ref(false)
const unreadNotifications = ref(0)

// Admin name
const adminName = ref('Admin')
const currentUser = ref(null)

// Profile menu
const showProfileMenu = ref(false)

// Stats
const stats = ref({
  users: 0,
  products: 0,
  rentals: 0
})

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
  
  // Setup auth state listener
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
    if (user) {
      // Get user's display name or email
      adminName.value = user.displayName || user.email?.split('@')[0] || 'Admin'
    } else {
      adminName.value = 'Admin'
    }
  })
  
  // Load stats
  loadStats()
  
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

const handleSearchBlur = () => {
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
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

const getResultBgColor = (type) => {
  switch (type) {
    case 'rental': return 'bg-blue-500'
    case 'user': return 'bg-purple-500'
    case 'product': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

const getResultBadgeColor = (type) => {
  switch (type) {
    case 'rental': return 'bg-blue-100 text-blue-800'
    case 'user': return 'bg-purple-100 text-purple-800'
    case 'product': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Notifications functionality
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showSearchResults.value = false
  showProfileMenu.value = false
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
  showNotifications.value = false
  showSearchResults.value = false
}

const handleProfileAction = (action) => {
  showProfileMenu.value = false
  
  switch (action) {
    case 'settings':
      // Navigate to settings or show settings modal
      console.log('Settings clicked')
      break
    case 'profile':
      // Navigate to profile page
      console.log('Profile clicked')
      break
    case 'logout':
      // Handle logout
      auth.signOut().then(() => {
        router.push('/login')
      })
      break
  }
}

// Load stats
const loadStats = async () => {
  try {
    // Load users count
    const usersSnapshot = await getDocs(collection(db, 'users'))
    stats.value.users = usersSnapshot.size
    
    // Load products count
    const productsSnapshot = await getDocs(collection(db, 'products'))
    stats.value.products = productsSnapshot.size
    
    // Load rentals count
    const rentalsSnapshot = await getDocs(collection(db, 'bookings'))
    stats.value.rentals = rentalsSnapshot.size
  } catch (error) {
    console.error('Error loading stats:', error)
  }
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
    showProfileMenu.value = false
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