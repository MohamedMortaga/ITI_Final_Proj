// src/composables/useAdminManagement.js
import { ref, computed } from 'vue'
import { db } from '@/firebase/config'
import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  query,
  serverTimestamp,
  addDoc,
  deleteDoc
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import Swal from 'sweetalert2'

export default function useAdminManagement() {
  const admins = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentUser = ref(null)

  // Get current user
  const auth = getAuth()
  if (auth.currentUser) {
    currentUser.value = auth.currentUser
  }

  // Load all admins
  const loadAdmins = async () => {
    loading.value = true
    error.value = null
    
    try {
      // First, get all users and filter client-side to avoid index requirements
      const q = query(collection(db, 'users'))
      const snapshot = await getDocs(q)
      
      // Filter admins on the client side
      admins.value = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(user => user.role === 'admin' || user.role === 'superAdmin')
        .sort((a, b) => {
          // Sort by createdAt if available, otherwise by adminSince
          const aDate = a.createdAt?.toDate?.() || a.adminSince?.toDate?.() || new Date(0)
          const bDate = b.createdAt?.toDate?.() || b.adminSince?.toDate?.() || new Date(0)
          return bDate - aDate
        })
    } catch (err) {
      error.value = err.message
      console.error('Error loading admins:', err)
    } finally {
      loading.value = false
    }
  }

  // Add admin
  const addAdmin = async (userId, role = 'superAdmin') => {
    loading.value = true
    error.value = null
    
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        role: role,
        adminSince: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      // Add admin activity log
      await addDoc(collection(db, 'adminActivities'), {
        userId: userId,
        action: 'admin_added',
        role: role,
        performedBy: currentUser.value?.uid,
        timestamp: serverTimestamp()
      })

      await loadAdmins()
      return true
    } catch (err) {
      error.value = err.message
      console.error('Error adding admin:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Find user by email
  const findUserByEmail = async (email) => {
    try {
      // Get all users and filter by email to avoid index requirements
      const q = query(collection(db, 'users'))
      const snapshot = await getDocs(q)
      
      const user = snapshot.docs.find(doc => {
        const userData = doc.data()
        return userData.email === email
      })
      
      if (user) {
        return { id: user.id, ...user.data() }
      }
      return null
    } catch (err) {
      console.error('Error finding user by email:', err)
      return null
    }
  }

  // Remove admin
  const removeAdmin = async (userId) => {
    loading.value = true
    error.value = null
    
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        role: 'user',
        adminSince: null,
        updatedAt: serverTimestamp()
      })

      // Add admin activity log
      await addDoc(collection(db, 'adminActivities'), {
        userId: userId,
        action: 'admin_removed',
        performedBy: currentUser.value?.uid,
        timestamp: serverTimestamp()
      })

      await loadAdmins()
      return true
    } catch (err) {
      error.value = err.message
      console.error('Error removing admin:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Update admin role
  const updateAdminRole = async (userId, newRole) => {
    loading.value = true
    error.value = null
    
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: serverTimestamp()
      })

      // Add admin activity log
      await addDoc(collection(db, 'adminActivities'), {
        userId: userId,
        action: 'role_updated',
        newRole: newRole,
        performedBy: currentUser.value?.uid,
        timestamp: serverTimestamp()
      })

      await loadAdmins()
      return true
    } catch (err) {
      error.value = err.message
      console.error('Error updating admin role:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Convert all admins to super admins
  const convertAllToSuperAdmin = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Get all current admins
      const currentAdmins = admins.value.filter(admin => admin.role === 'admin')
      
      if (currentAdmins.length === 0) {
        showSuccess('No regular admins to convert')
        return true
      }

      // Convert each regular admin to super admin
      for (const admin of currentAdmins) {
        const userRef = doc(db, 'users', admin.id)
        await updateDoc(userRef, {
          role: 'superAdmin',
          updatedAt: serverTimestamp()
        })

        // Add admin activity log
        await addDoc(collection(db, 'adminActivities'), {
          userId: admin.id,
          action: 'role_updated',
          newRole: 'superAdmin',
          performedBy: currentUser.value?.uid,
          timestamp: serverTimestamp()
        })
      }

      await loadAdmins()
      showSuccess(`Successfully converted ${currentAdmins.length} admin(s) to Super Admin`)
      return true
    } catch (err) {
      error.value = err.message
      console.error('Error converting admins to super admin:', err)
      showError('Error converting admins to Super Admin')
      return false
    } finally {
      loading.value = false
    }
  }

  // Convert first admin to super admin (for initial setup)
  const convertFirstAdminToSuper = async () => {
    loading.value = true
    error.value = null
    
    try {
      if (admins.value.length === 0) {
        showError('No admins found')
        return false
      }

      const firstAdmin = admins.value[0]
      const userRef = doc(db, 'users', firstAdmin.id)
      await updateDoc(userRef, {
        role: 'superAdmin',
        updatedAt: serverTimestamp()
      })

      // Add admin activity log
      await addDoc(collection(db, 'adminActivities'), {
        userId: firstAdmin.id,
        action: 'role_updated',
        newRole: 'superAdmin',
        performedBy: currentUser.value?.uid,
        timestamp: serverTimestamp()
      })

      await loadAdmins()
      showSuccess(`Successfully converted ${firstAdmin.displayName || firstAdmin.email} to Super Admin`)
      return true
    } catch (err) {
      error.value = err.message
      console.error('Error converting first admin to super admin:', err)
      showError('Error converting first admin to Super Admin')
      return false
    } finally {
      loading.value = false
    }
  }

  // Get admin activity
  const getAdminActivity = async (adminId) => {
    try {
      // Get all admin activities and filter client-side to avoid index requirements
      const q = query(collection(db, 'adminActivities'))
      const snapshot = await getDocs(q)
      
      return snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(activity => activity.performedBy === adminId)
        .sort((a, b) => {
          const aDate = a.timestamp?.toDate?.() || new Date(0)
          const bDate = b.timestamp?.toDate?.() || new Date(0)
          return bDate - aDate
        })
    } catch (err) {
      console.error('Error loading admin activity:', err)
      return []
    }
  }

  // Check if user is super admin
  const isSuperAdmin = computed(() => {
    return currentUser.value && admins.value.find(admin => 
      admin.id === currentUser.value.uid && admin.role === 'superAdmin'
    )
  })

  // Check if user can manage admins - temporarily allow all users to access
  const canManageAdmins = computed(() => {
    // Temporarily allow all authenticated users to access admin management
    return currentUser.value !== null
  })

  // Show success message
  const showSuccess = (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
      timer: 2000,
      showConfirmButton: false
    })
  }

  // Show error message
  const showError = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: message
    })
  }

  // Confirm action
  const confirmAction = async (title, text) => {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    })
    
    return result.isConfirmed
  }

  return {
    admins,
    loading,
    error,
    currentUser,
    isSuperAdmin,
    canManageAdmins,
    loadAdmins,
    addAdmin,
    removeAdmin,
    updateAdminRole,
    convertAllToSuperAdmin,
    convertFirstAdminToSuper,
    getAdminActivity,
    findUserByEmail,
    showSuccess,
    showError,
    confirmAction
  }
} 