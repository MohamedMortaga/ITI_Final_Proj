import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useNotifications = () => {
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
      console.log('Notification created successfully')
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }

  // Predefined notification types
  const notifyNewBooking = async (userName, productTitle) => {
    await createNotification(
      'booking',
      'New Booking',
      `User ${userName} booked "${productTitle}"`,
      null
    )
  }

  const notifyNewProduct = async (productName) => {
    await createNotification(
      'product',
      'Product Added',
      `New product "${productName}" has been added`,
      null
    )
  }

  const notifyNewUser = async (userName) => {
    await createNotification(
      'user',
      'New User',
      `User ${userName} has registered`,
      null
    )
  }

  const notifyBookingStatusChange = async (productTitle, newStatus) => {
    await createNotification(
      'booking',
      'Booking Status Updated',
      `Booking for "${productTitle}" status changed to ${newStatus}`,
      null
    )
  }

  const notifyUserBlocked = async (userName, isBlocked) => {
    await createNotification(
      'user',
      'User Status Changed',
      `User ${userName} has been ${isBlocked ? 'blocked' : 'unblocked'}`,
      null
    )
  }

  return {
    createNotification,
    notifyNewBooking,
    notifyNewProduct,
    notifyNewUser,
    notifyBookingStatusChange,
    notifyUserBlocked
  }
} 
