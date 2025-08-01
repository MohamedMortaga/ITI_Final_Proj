import { ref, watchEffect, computed } from 'vue'
import { db } from '../firebase/config'
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore'
import Swal from 'sweetalert2'

// Global real-time data store
class GlobalRealTimeStore {
  constructor() {
    this.data = {
      products: ref([]),
      bookings: ref([]),
      users: ref([]),
      categories: ref([]),
      userReviews: ref([]),
      webReviews: ref([])
    }
    
    this.loading = ref({
      products: true,
      bookings: true,
      users: true,
      categories: true,
      userReviews: true,
      webReviews: true
    })
    
    this.error = ref(null)
    this.unsubscribers = {}
    this.isInitialized = false
  }

  // Initialize all real-time listeners
  initialize() {
    if (this.isInitialized) return
    
    this.subscribeToProducts()
    this.subscribeToBookings()
    this.subscribeToUsers()
    this.subscribeToCategories()
    this.subscribeToUserReviews()
    this.subscribeToWebReviews()
    
    this.isInitialized = true
    console.log('Global real-time store initialized')
  }

  // Subscribe to products collection
  subscribeToProducts() {
    const colRef = collection(db, 'products')
    const q = query(colRef, orderBy('createdAt', 'desc'))
    
    this.unsubscribers.products = onSnapshot(
      q,
      (snapshot) => {
        this.data.products.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || null
        }))
        this.loading.value.products = false
        this.error.value = null
      },
      (err) => {
        console.error('Products snapshot error:', err.message)
        this.error.value = 'Failed to fetch products'
        this.loading.value.products = false
        this.showError('Products Load Error', 'Failed to load products in real-time')
      }
    )
  }

  // Subscribe to bookings collection
  subscribeToBookings() {
    const colRef = collection(db, 'bookings')
    const q = query(colRef, orderBy('startDate', 'desc'))
    
    this.unsubscribers.bookings = onSnapshot(
      q,
      (snapshot) => {
        const newBookings = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || null
        }))
        
        // Debug logging for real-time updates
        console.log('🔄 Real-time bookings update:', {
          totalBookings: newBookings.length,
          changes: snapshot.docChanges().map(change => ({
            type: change.type,
            docId: change.doc.id,
            status: change.doc.data().status,
            userId: change.doc.data().userId
          }))
        })
        
        this.data.bookings.value = newBookings
        this.loading.value.bookings = false
        this.error.value = null
      },
      (err) => {
        console.error('Bookings snapshot error:', err.message)
        this.error.value = 'Failed to fetch bookings'
        this.loading.value.bookings = false
        this.showError('Bookings Load Error', 'Failed to load bookings in real-time')
      }
    )
  }

  // Subscribe to users collection
  subscribeToUsers() {
    const colRef = collection(db, 'users')
    const q = query(colRef, orderBy('createdAt', 'desc'))
    
    this.unsubscribers.users = onSnapshot(
      q,
      (snapshot) => {
        this.data.users.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || null
        }))
        this.loading.value.users = false
        this.error.value = null
      },
      (err) => {
        console.error('Users snapshot error:', err.message)
        this.error.value = 'Failed to fetch users'
        this.loading.value.users = false
        this.showError('Users Load Error', 'Failed to load users in real-time')
      }
    )
  }

  // Subscribe to categories collection
  subscribeToCategories() {
    const colRef = collection(db, 'categories')
    const q = query(colRef, orderBy('name', 'asc'))
    
    this.unsubscribers.categories = onSnapshot(
      q,
      (snapshot) => {
        this.data.categories.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || null
        }))
        this.loading.value.categories = false
        this.error.value = null
      },
      (err) => {
        console.error('Categories snapshot error:', err.message)
        this.error.value = 'Failed to fetch categories'
        this.loading.value.categories = false
        this.showError('Categories Load Error', 'Failed to load categories in real-time')
      }
    )
  }

  // Subscribe to user reviews collection
  subscribeToUserReviews() {
    const colRef = collection(db, 'user-reviews')
    const q = query(colRef, orderBy('timestamp', 'desc'))
    
    this.unsubscribers.userReviews = onSnapshot(
      q,
      (snapshot) => {
        this.data.userReviews.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || null
        }))
        this.loading.value.userReviews = false
        this.error.value = null
      },
      (err) => {
        console.error('User reviews snapshot error:', err.message)
        this.error.value = 'Failed to fetch user reviews'
        this.loading.value.userReviews = false
        this.showError('User Reviews Load Error', 'Failed to load user reviews in real-time')
      }
    )
  }

  // Subscribe to web reviews collection
  subscribeToWebReviews() {
    const colRef = collection(db, 'web-reviews')
    const q = query(colRef, orderBy('timestamp', 'desc'))
    
    this.unsubscribers.webReviews = onSnapshot(
      q,
      (snapshot) => {
        this.data.webReviews.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || null
        }))
        this.loading.value.webReviews = false
        this.error.value = null
      },
      (err) => {
        console.error('Web reviews snapshot error:', err.message)
        this.error.value = 'Failed to fetch web reviews'
        this.loading.value.webReviews = false
        this.showError('Web Reviews Load Error', 'Failed to load web reviews in real-time')
      }
    )
  }

  // Helper function to show errors
  showError(title, message) {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      timer: 3000,
      showConfirmButton: false
    })
  }

  // Cleanup all listeners
  cleanup() {
    Object.values(this.unsubscribers).forEach(unsub => {
      if (unsub && typeof unsub === 'function') {
        unsub()
      }
    })
    this.unsubscribers = {}
    this.isInitialized = false
    console.log('Global real-time store cleaned up')
  }

  // Get computed properties for filtered data
  getComputedData() {
    return {
      approvedProducts: computed(() => {
        // Get all approved products
        const approvedProducts = this.data.products.value.filter(product => product.isApproved === true);
        
        // Get active bookings to filter out products currently being rented
        const activeBookings = this.data.bookings.value.filter(booking => 
          booking.status === 'active'
        );
        
        // Create a set of product IDs that are currently being rented
        const rentedProductIds = new Set(activeBookings.map(booking => booking.productId));
        
        // Filter out products that are currently being rented
        return approvedProducts.filter(product => !rentedProductIds.has(product.id));
      }),
      pendingProducts: computed(() => 
        this.data.products.value.filter(product => product.isApproved === false)
      ),
      activeBookings: computed(() => 
        this.data.bookings.value.filter(booking => booking.status === 'active')
      ),
      pendingBookings: computed(() => 
        this.data.bookings.value.filter(booking => booking.status === 'pending')
      ),
      cancelledBookings: computed(() => 
        this.data.bookings.value.filter(booking => booking.status === 'cancelled')
      ),
      usersMap: computed(() => {
        const map = {}
        this.data.users.value.forEach(user => {
          map[user.id] = user
        })
        return map
      }),
      productsMap: computed(() => {
        const map = {}
        this.data.products.value.forEach(product => {
          map[product.id] = product
        })
        return map
      })
    }
  }
}

// Create singleton instance
const globalStore = new GlobalRealTimeStore()

// Vue composable
export const useGlobalRealTime = () => {
  return {
    // Data
    products: globalStore.data.products,
    bookings: globalStore.data.bookings,
    users: globalStore.data.users,
    categories: globalStore.data.categories,
    userReviews: globalStore.data.userReviews,
    webReviews: globalStore.data.webReviews,
    loading: globalStore.loading,
    error: globalStore.error,
    
    // Computed data
    ...globalStore.getComputedData(),
    
    // Methods
    initialize: () => globalStore.initialize(),
    cleanup: () => globalStore.cleanup(),
    showError: (title, message) => globalStore.showError(title, message)
  }
}

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    globalStore.cleanup()
  })
}

export default globalStore 