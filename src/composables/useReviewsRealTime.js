import { ref, watchEffect, computed } from 'vue'
import { db } from '../firebase/config'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import Swal from 'sweetalert2'

// Real-time reviews data composable
export const useReviewsRealTime = () => {
  const userReviews = ref([])
  const webReviews = ref([])
  const error = ref(null)
  const loading = ref({
    userReviews: true,
    webReviews: true
  })

  let unsubscribers = {
    userReviews: null,
    webReviews: null
  }

  // Real-time user reviews listener
  const subscribeToUserReviews = () => {
    const colRef = collection(db, 'user-reviews')
    const q = query(colRef, orderBy('timestamp', 'desc'))
    
    unsubscribers.userReviews = onSnapshot(
      q,
      (snapshot) => {
        userReviews.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || null
        }))
        loading.value.userReviews = false
        error.value = null
      },
      (err) => {
        console.error('User reviews snapshot error:', err.message)
        error.value = 'Failed to fetch user reviews'
        loading.value.userReviews = false
        showError('User Reviews Load Error', 'Failed to load user reviews in real-time')
      }
    )
  }

  // Real-time web reviews listener
  const subscribeToWebReviews = () => {
    const colRef = collection(db, 'web-reviews')
    const q = query(colRef, orderBy('timestamp', 'desc'))
    
    unsubscribers.webReviews = onSnapshot(
      q,
      (snapshot) => {
        webReviews.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || null
        }))
        loading.value.webReviews = false
        error.value = null
      },
      (err) => {
        console.error('Web reviews snapshot error:', err.message)
        error.value = 'Failed to fetch web reviews'
        loading.value.webReviews = false
        showError('Web Reviews Load Error', 'Failed to load web reviews in real-time')
      }
    )
  }

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
  const initializeRealTimeReviews = () => {
    subscribeToUserReviews()
    subscribeToWebReviews()
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
    userReviews,
    webReviews,
    error,
    loading,
    
    // Methods
    initializeRealTimeReviews,
    cleanup,
    showError
  }
} 