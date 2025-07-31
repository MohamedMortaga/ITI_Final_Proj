// src/composables/useIDVerification.js
import { ref, onMounted, onUnmounted } from 'vue'
import { db, auth } from '@/firebase/config'
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const userVerification = ref(null)
const isLoading = ref(false)
const error = ref(null)

// Real-time listener for user verification
let verificationUnsubscribe = null

const loadUserVerification = async (userId) => {
  if (!userId) return

  try {
    isLoading.value = true
    error.value = null

    const verificationDoc = await getDoc(doc(db, 'user-verifications', userId))
    if (verificationDoc.exists()) {
      userVerification.value = {
        id: verificationDoc.id,
        ...verificationDoc.data()
      }
    } else {
      userVerification.value = null
    }
  } catch (err) {
    console.error('Error loading user verification:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

const setupRealTimeVerification = (userId) => {
  if (!userId) return

  // Clean up existing listener
  if (verificationUnsubscribe) {
    verificationUnsubscribe()
  }

  // Set up real-time listener
  verificationUnsubscribe = onSnapshot(
    doc(db, 'user-verifications', userId),
    (doc) => {
      if (doc.exists()) {
        userVerification.value = {
          id: doc.id,
          ...doc.data()
        }
      } else {
        userVerification.value = null
      }
    },
    (err) => {
      console.error('Error in real-time verification listener:', err)
      error.value = err.message
    }
  )
}

const uploadIDCard = async (userId, fileData, type) => {
  try {
    isLoading.value = true
    error.value = null

    const verificationData = {
      [type === 'front' ? 'frontIdCardUrl' : 'backIdCardUrl']: fileData.url,
      [type === 'front' ? 'frontFileName' : 'backFileName']: fileData.name,
      [type === 'front' ? 'frontFileSize' : 'backFileSize']: fileData.size,
      uploadedAt: serverTimestamp(),
      status: null // Will be set to 'pending' when both images are uploaded
    }

    await setDoc(doc(db, 'user-verifications', userId), verificationData, { merge: true })

    return { success: true }
  } catch (err) {
    console.error('Error uploading ID card:', err)
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    isLoading.value = false
  }
}

const submitVerification = async (userId) => {
  try {
    isLoading.value = true
    error.value = null

    const updateData = {
      status: 'pending',
      submittedAt: serverTimestamp()
    }

    await updateDoc(doc(db, 'user-verifications', userId), updateData)

    return { success: true }
  } catch (err) {
    console.error('Error submitting verification:', err)
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    isLoading.value = false
  }
}

const updateVerificationStatus = async (userId, status, reviewedBy = null, rejectionReason = null) => {
  try {
    isLoading.value = true
    error.value = null

    const updateData = {
      status,
      reviewedAt: serverTimestamp(),
      reviewedBy: reviewedBy || 'Admin'
    }

    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason
    }

    await updateDoc(doc(db, 'user-verifications', userId), updateData)

    // If approved, update user verification status
    if (status === 'approved') {
      await updateDoc(doc(db, 'users', userId), {
        isVerified: true,
        verifiedAt: serverTimestamp()
      })
    }

    return { success: true }
  } catch (err) {
    console.error('Error updating verification status:', err)
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    isLoading.value = false
  }
}

const getVerificationStatus = () => {
  if (!userVerification.value) return 'not_uploaded'
  return userVerification.value.status || 'not_uploaded'
}

const isVerified = () => {
  return getVerificationStatus() === 'approved'
}

const isPending = () => {
  return getVerificationStatus() === 'pending'
}

const isRejected = () => {
  return getVerificationStatus() === 'rejected'
}

const hasUploadedID = () => {
  return userVerification.value && userVerification.value.frontIdCardUrl && userVerification.value.backIdCardUrl
}

const hasUploadedBothImages = () => {
  return userVerification.value && userVerification.value.frontIdCardUrl && userVerification.value.backIdCardUrl
}

// Initialize on mount
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadUserVerification(user.uid)
      setupRealTimeVerification(user.uid)
    } else {
      userVerification.value = null
      if (verificationUnsubscribe) {
        verificationUnsubscribe()
      }
    }
  })
})

// Clean up on unmount
onUnmounted(() => {
  if (verificationUnsubscribe) {
    verificationUnsubscribe()
  }
})

export default function useIDVerification() {
  return {
    userVerification,
    isLoading,
    error,
    loadUserVerification,
    uploadIDCard,
    submitVerification,
    updateVerificationStatus,
    getVerificationStatus,
    isVerified,
    isPending,
    isRejected,
    hasUploadedID,
    hasUploadedBothImages
  }
} 