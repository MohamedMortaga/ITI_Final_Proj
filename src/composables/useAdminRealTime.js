import { ref, watchEffect, computed } from 'vue'
import { db } from '../firebase/config'
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import Swal from 'sweetalert2'

// Real-time admin data composable
export const useAdminRealTime = () => {
  const products = ref([])
  const bookings = ref([])
  const users = ref([])
  const categories = ref([])
  const reviews = ref([])
  const error = ref(null)
  const loading = ref({
    products: true,
    bookings: true,
    users: true,
    categories: true,
    reviews: true
  })

  let unsubscribers = {
    products: null,
    bookings: null,
    users: null,
    categories: null,
    reviews: null
  }

  // Real-time products listener
  const subscribeToProducts = () => {
    const colRef = collection(db, 'products')
    const q = query(colRef, orderBy('createdAt', 'desc'))
    
    unsubscribers.products = onSnapshot(
      q,
      (snapshot) => {
        products.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || null
        }))
        loading.value.products = false
        error.value = null
      },
      (err) => {
        console.error('Products snapshot error:', err.message)
        error.value = 'Failed to fetch products'
        loading.value.products = false
        showError('Products Load Error', 'Failed to load products in real-time')
      }
    )
  }

  // Real-time bookings listener
  const subscribeToBookings = () => {
    const colRef = collection(db, 'bookings')
    const q = query(colRef, orderBy('startDate', 'desc'))
    
    unsubscribers.bookings = onSnapshot(
      q,
      (snapshot) => {
        bookings.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || null
        }))
        loading.value.bookings = false
        error.value = null
      },
      (err) => {
        console.error('Bookings snapshot error:', err.message)
        error.value = 'Failed to fetch bookings'
        loading.value.bookings = false
        showError('Bookings Load Error', 'Failed to load bookings in real-time')
      }
    )
  }

  // Real-time users listener
  const subscribeToUsers = () => {
    const colRef = collection(db, 'users')
    const q = query(colRef, orderBy('createdAt', 'desc'))
    
    unsubscribers.users = onSnapshot(
      q,
      (snapshot) => {
        users.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || null
        }))
        loading.value.users = false
        error.value = null
      },
      (err) => {
        console.error('Users snapshot error:', err.message)
        error.value = 'Failed to fetch users'
        loading.value.users = false
        showError('Users Load Error', 'Failed to load users in real-time')
      }
    )
  }

  // Real-time categories listener
  const subscribeToCategories = () => {
    const colRef = collection(db, 'categories')
    const q = query(colRef, orderBy('name', 'asc'))
    
    unsubscribers.categories = onSnapshot(
      q,
      (snapshot) => {
        categories.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || null
        }))
        loading.value.categories = false
        error.value = null
      },
      (err) => {
        console.error('Categories snapshot error:', err.message)
        error.value = 'Failed to fetch categories'
        loading.value.categories = false
        showError('Categories Load Error', 'Failed to load categories in real-time')
      }
    )
  }

  // Real-time reviews listener
  const subscribeToReviews = () => {
    const colRef = collection(db, 'user-reviews')
    const q = query(colRef, orderBy('timestamp', 'desc'))
    
    unsubscribers.reviews = onSnapshot(
      q,
      (snapshot) => {
        reviews.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || null
        }))
        loading.value.reviews = false
        error.value = null
      },
      (err) => {
        console.error('Reviews snapshot error:', err.message)
        error.value = 'Failed to fetch reviews'
        loading.value.reviews = false
        showError('Reviews Load Error', 'Failed to load reviews in real-time')
      }
    )
  }

  // Computed properties for filtered data
  const approvedProducts = computed(() => 
    products.value.filter(product => product.isApproved === true)
  )

  const pendingProducts = computed(() => 
    products.value.filter(product => product.isApproved === false)
  )

  const activeBookings = computed(() => 
    bookings.value.filter(booking => booking.status === 'active')
  )

  const pendingBookings = computed(() => 
    bookings.value.filter(booking => booking.status === 'pending')
  )

  const cancelledBookings = computed(() => 
    bookings.value.filter(booking => booking.status === 'cancelled')
  )

  // Helper function to show errors
  const showError = (title, message) => {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      timer: 3000,
      showConfirmButton: false
    })
  }

  // Initialize all real-time listeners
  const initializeRealTimeData = () => {
    subscribeToProducts()
    subscribeToBookings()
    subscribeToUsers()
    subscribeToCategories()
    subscribeToReviews()
  }

  // Cleanup function
  const cleanup = () => {
    Object.values(unsubscribers).forEach(unsub => {
      if (unsub && typeof unsub === 'function') {
        unsub()
      }
    })
  }

  // Auto-cleanup on component unmount
  watchEffect((onInvalidate) => {
    onInvalidate(() => {
      cleanup()
    })
  })

  return {
    // Data
    products,
    bookings,
    users,
    categories,
    reviews,
    error,
    loading,
    
    // Computed
    approvedProducts,
    pendingProducts,
    activeBookings,
    pendingBookings,
    cancelledBookings,
    
    // Methods
    initializeRealTimeData,
    cleanup,
    showError
  }
} 